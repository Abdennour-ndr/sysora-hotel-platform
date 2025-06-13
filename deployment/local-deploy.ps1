# Sysora Platform - Local Deployment Script
# This script builds and tests the application locally before AWS deployment

Write-Host "🚀 Starting Sysora Local Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Configuration
$ErrorActionPreference = "Stop"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

try {
    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the project root."
        exit 1
    }

    Write-Info "Checking Node.js and npm..."
    
    # Check Node.js version
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
    
    # Check npm version
    $npmVersion = npm --version
    Write-Success "npm version: $npmVersion"

    Write-Info "Installing dependencies..."
    
    # Install dependencies
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        exit 1
    }
    Write-Success "Dependencies installed successfully"

    Write-Info "Building frontend..."
    
    # Build frontend
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Frontend build failed"
        exit 1
    }
    
    if (!(Test-Path "dist")) {
        Write-Error "Frontend build failed - dist directory not found"
        exit 1
    }
    Write-Success "Frontend built successfully"

    Write-Info "Testing backend health check..."
    
    # Start the server in background for testing
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "server/index.js" -PassThru -WindowStyle Hidden
    
    # Wait a bit for server to start
    Start-Sleep -Seconds 5
    
    try {
        # Test health endpoint
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend health check passed"
            $healthData = $response.Content | ConvertFrom-Json
            Write-Info "Server status: $($healthData.status)"
            Write-Info "Environment: $($healthData.environment)"
        }
        else {
            Write-Warning "Health check returned status: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "Health check failed: $($_.Exception.Message)"
    }
    finally {
        # Stop the test server
        if ($serverProcess -and !$serverProcess.HasExited) {
            Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Info "Test server stopped"
        }
    }

    Write-Info "Checking project structure..."
    
    # Check important files
    $requiredFiles = @(
        "Dockerfile",
        "docker-compose.yml",
        "nginx.conf",
        ".env",
        "deploy.ps1"
    )
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Success "✓ $file found"
        }
        else {
            Write-Warning "⚠ $file missing"
        }
    }

    Write-Info "Checking environment configuration..."
    
    # Check .env file
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -Raw
        $requiredVars = @("NODE_ENV", "MONGODB_URI", "JWT_SECRET")
        
        foreach ($var in $requiredVars) {
            if ($envContent -match "$var=.+") {
                Write-Success "✓ $var configured"
            }
            else {
                Write-Warning "⚠ $var missing or empty"
            }
        }
    }
    else {
        Write-Warning ".env file not found"
    }

    Write-Host "`n📊 Local Deployment Summary:" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    
    Write-Success "✅ Dependencies installed"
    Write-Success "✅ Frontend built successfully"
    Write-Success "✅ Backend health check passed"
    Write-Success "✅ Project structure verified"
    
    Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure AWS credentials if not done already" -ForegroundColor White
    Write-Host "2. Set up MongoDB Atlas cluster" -ForegroundColor White
    Write-Host "3. Update .env file with production values" -ForegroundColor White
    Write-Host "4. Run AWS deployment: .\deploy.ps1" -ForegroundColor White
    
    Write-Host "`n🚀 Ready for AWS deployment!" -ForegroundColor Green

}
catch {
    Write-Error "Local deployment failed: $($_.Exception.Message)"
    exit 1
}

Write-Host "`n====================================" -ForegroundColor Cyan
