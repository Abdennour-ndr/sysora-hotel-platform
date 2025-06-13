# Sysora Platform - Requirements Checker
# This script checks if all required tools are installed and configured

Write-Host "🔍 Checking Sysora Platform Requirements..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$allGood = $true

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to display status
function Show-Status {
    param([string]$Item, [bool]$Status, [string]$Details = "")
    if ($Status) {
        Write-Host "✅ $Item" -ForegroundColor Green
        if ($Details) {
            Write-Host "   $Details" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "❌ $Item" -ForegroundColor Red
        if ($Details) {
            Write-Host "   $Details" -ForegroundColor Yellow
        }
        $script:allGood = $false
    }
}

Write-Host "`n📋 Checking Required Tools:" -ForegroundColor Yellow

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Show-Status "Node.js" $true "Version: $nodeVersion"
}
else {
    Show-Status "Node.js" $false "Please install Node.js 18+ from https://nodejs.org/"
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Show-Status "npm" $true "Version: $npmVersion"
}
else {
    Show-Status "npm" $false "npm should come with Node.js installation"
}

# Check AWS CLI
if (Test-Command "aws") {
    try {
        $awsVersion = aws --version 2>&1
        Show-Status "AWS CLI" $true "Version: $awsVersion"
    }
    catch {
        Show-Status "AWS CLI" $false "AWS CLI found but not working properly"
    }
}
else {
    Show-Status "AWS CLI" $false "Please install AWS CLI from https://aws.amazon.com/cli/"
}

# Check Docker
if (Test-Command "docker") {
    try {
        $dockerVersion = docker --version
        Show-Status "Docker" $true "Version: $dockerVersion"
        
        # Check if Docker daemon is running
        try {
            docker info | Out-Null
            Show-Status "Docker Daemon" $true "Docker daemon is running"
        }
        catch {
            Show-Status "Docker Daemon" $false "Docker is installed but daemon is not running. Please start Docker Desktop."
        }
    }
    catch {
        Show-Status "Docker" $false "Docker found but not working properly"
    }
}
else {
    Show-Status "Docker" $false "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
}

Write-Host "`n🔧 Checking AWS Configuration:" -ForegroundColor Yellow

# Check AWS credentials
try {
    $awsIdentity = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        $identity = $awsIdentity | ConvertFrom-Json
        Show-Status "AWS Credentials" $true "Account: $($identity.Account), User: $($identity.Arn)"
    }
    else {
        Show-Status "AWS Credentials" $false "Run 'aws configure' to set up your credentials"
    }
}
catch {
    Show-Status "AWS Credentials" $false "Unable to check AWS credentials. Run 'aws configure' to set up."
}

Write-Host "`n📁 Checking Project Files:" -ForegroundColor Yellow

# Check if we're in the right directory
if (Test-Path "package.json") {
    Show-Status "package.json" $true "Found in current directory"
}
else {
    Show-Status "package.json" $false "Please run this script from the project root directory"
}

# Check if .env file exists
if (Test-Path ".env") {
    Show-Status ".env file" $true "Environment file found"
    
    # Check for required environment variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("MONGODB_URI", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "JWT_SECRET")
    
    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=.+") {
            Show-Status "  $var" $true "Set in .env file"
        }
        else {
            Show-Status "  $var" $false "Missing or empty in .env file"
        }
    }
}
else {
    Show-Status ".env file" $false "Copy .env.production to .env and configure it"
}

# Check deployment scripts
if (Test-Path "deploy.ps1") {
    Show-Status "deploy.ps1" $true "Deployment script found"
}
else {
    Show-Status "deploy.ps1" $false "Deployment script missing"
}

if (Test-Path "Dockerfile") {
    Show-Status "Dockerfile" $true "Docker configuration found"
}
else {
    Show-Status "Dockerfile" $false "Dockerfile missing"
}

Write-Host "`n🧪 Testing Connections:" -ForegroundColor Yellow

# Test MongoDB connection (if Node.js is available)
if (Test-Command "node" -and (Test-Path ".env")) {
    try {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -match "MONGODB_URI=(.+)") {
            $mongoUri = $matches[1]
            if ($mongoUri -and $mongoUri -ne "your-mongodb-connection-string") {
                # Create a simple test script
                $testScript = @"
const mongoose = require('mongoose');
mongoose.connect('$mongoUri', { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
"@
                $testScript | Out-File -FilePath "temp-mongo-test.js" -Encoding UTF8
                
                try {
                    $result = node temp-mongo-test.js 2>&1
                    if ($LASTEXITCODE -eq 0) {
                        Show-Status "MongoDB Connection" $true "Database connection successful"
                    }
                    else {
                        Show-Status "MongoDB Connection" $false "Database connection failed: $result"
                    }
                }
                catch {
                    Show-Status "MongoDB Connection" $false "Unable to test database connection"
                }
                finally {
                    Remove-Item "temp-mongo-test.js" -ErrorAction SilentlyContinue
                }
            }
            else {
                Show-Status "MongoDB Connection" $false "MONGODB_URI not configured properly"
            }
        }
        else {
            Show-Status "MongoDB Connection" $false "MONGODB_URI not found in .env file"
        }
    }
    catch {
        Show-Status "MongoDB Connection" $false "Unable to test MongoDB connection"
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "🎉 All requirements are met! You are ready to deploy." -ForegroundColor Green
    Write-Host "`n🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run: .\deploy.ps1" -ForegroundColor White
    Write-Host "2. Monitor the deployment process" -ForegroundColor White
    Write-Host "3. Test the deployed application" -ForegroundColor White
}
else {
    Write-Host "⚠️  Some requirements are missing. Please fix the issues above before deploying." -ForegroundColor Red
    Write-Host "`n📋 Quick setup guide:" -ForegroundColor Yellow
    Write-Host "1. Check SETUP_REQUIREMENTS.md for detailed instructions" -ForegroundColor White
    Write-Host "2. Install missing tools" -ForegroundColor White
    Write-Host "3. Configure AWS credentials: aws configure" -ForegroundColor White
    Write-Host "4. Set up .env file with your configuration" -ForegroundColor White
    Write-Host "5. Run this script again to verify" -ForegroundColor White
}

Write-Host "`n=============================================" -ForegroundColor Cyan
