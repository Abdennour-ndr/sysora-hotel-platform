# 🛫 Sysora Platform - Fly.io Deployment Script
# PowerShell script for Windows

Write-Host "🛫 Sysora Hotel Platform - Fly.io Deployment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if flyctl is installed
if (!(Get-Command flyctl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Fly.io CLI is not installed." -ForegroundColor Red
    Write-Host "Installing Fly.io CLI..." -ForegroundColor Yellow
    
    try {
        iwr https://fly.io/install.ps1 -useb | iex
        Write-Host "✅ Fly.io CLI installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Fly.io CLI. Please install manually:" -ForegroundColor Red
        Write-Host "  https://fly.io/docs/getting-started/installing-flyctl/" -ForegroundColor Gray
        exit 1
    }
} else {
    Write-Host "✅ Fly.io CLI is installed" -ForegroundColor Green
}

# Check if user is logged in
$authStatus = flyctl auth whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n🔐 Please log in to Fly.io..." -ForegroundColor Yellow
    flyctl auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to log in to Fly.io." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Logged in to Fly.io as: $authStatus" -ForegroundColor Green
}

# Prompt for app name
Write-Host "`n📱 App Configuration:" -ForegroundColor Yellow
$defaultAppName = "sysora-hotel-platform"
$appName = Read-Host "Enter app name (default: $defaultAppName)"

if ([string]::IsNullOrWhiteSpace($appName)) {
    $appName = $defaultAppName
}

Write-Host "App name: $appName" -ForegroundColor Gray

# Check if app already exists
$existingApp = flyctl apps list | Select-String $appName
if ($existingApp) {
    Write-Host "⚠️  App '$appName' already exists." -ForegroundColor Yellow
    $useExisting = Read-Host "Use existing app? (Y/n)"
    if ($useExisting -eq "n" -or $useExisting -eq "N") {
        $appName = Read-Host "Enter a different app name"
    }
} else {
    # Create new app
    Write-Host "`n🚀 Creating Fly.io app: $appName..." -ForegroundColor Yellow
    flyctl apps create $appName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create app. The name might be taken." -ForegroundColor Red
        $timestamp = Get-Date -Format "yyyyMMddHHmm"
        $appName = "$appName-$timestamp"
        Write-Host "Trying with timestamp: $appName" -ForegroundColor Yellow
        flyctl apps create $appName
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to create app with timestamp. Please try a different name." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "✅ App created successfully: $appName" -ForegroundColor Green
}

# Update fly.toml with the correct app name
Write-Host "`n📝 Updating fly.toml..." -ForegroundColor Yellow
$flyTomlContent = Get-Content "fly.toml" -Raw
$flyTomlContent = $flyTomlContent -replace 'app = ".*"', "app = `"$appName`""
Set-Content "fly.toml" $flyTomlContent
Write-Host "✅ fly.toml updated with app name: $appName" -ForegroundColor Green

# Set up environment variables
Write-Host "`n🔧 Setting up environment variables..." -ForegroundColor Yellow

# Generate secure JWT secret
$jwtSecret = "sysora-jwt-secret-2024-" + [System.Web.Security.Membership]::GeneratePassword(32, 8)

$secrets = @{
    "NODE_ENV" = "production"
    "JWT_SECRET" = $jwtSecret
    "APP_NAME" = "Sysora Hotel Management Platform"
    "DEFAULT_TIMEZONE" = "Africa/Algiers"
    "DEFAULT_LANGUAGE" = "ar"
    "SUPPORTED_LANGUAGES" = "ar,en,fr"
}

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "Setting $($secret.Key)..." -ForegroundColor Gray
    flyctl secrets set "$($secret.Key)=$($secret.Value)" --app $appName
}

# Database configuration
Write-Host "`n💾 Database Configuration:" -ForegroundColor Yellow
Write-Host "1. Use local MongoDB (for testing)" -ForegroundColor White
Write-Host "2. Use MongoDB Atlas (recommended for production)" -ForegroundColor White
Write-Host "3. Skip database setup for now" -ForegroundColor White

$dbChoice = Read-Host "Choose option (1-3, default: 1)"

switch ($dbChoice) {
    "2" {
        $mongoUri = Read-Host "Enter MongoDB Atlas connection string"
        if (![string]::IsNullOrWhiteSpace($mongoUri)) {
            flyctl secrets set "MONGODB_URI=$mongoUri" --app $appName
            Write-Host "✅ MongoDB Atlas configured" -ForegroundColor Green
        }
    }
    "3" {
        Write-Host "⏭️  Database setup skipped" -ForegroundColor Yellow
    }
    default {
        flyctl secrets set "MONGODB_URI=mongodb://localhost:27017/sysora-production" --app $appName
        Write-Host "✅ Local MongoDB configured" -ForegroundColor Green
    }
}

# Deploy the application
Write-Host "`n🚀 Deploying to Fly.io..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray

flyctl deploy --app $appName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed. Check the logs above for details." -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Docker build errors" -ForegroundColor Gray
    Write-Host "  - Missing dependencies" -ForegroundColor Gray
    Write-Host "  - Configuration issues" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Deployment successful!" -ForegroundColor Green

# Check app status
Write-Host "`n📊 Checking app status..." -ForegroundColor Yellow
flyctl status --app $appName

# Get app URL
$appUrl = "https://$appName.fly.dev"

# Test health endpoint
Write-Host "`n🏥 Testing health endpoint..." -ForegroundColor Yellow
Start-Sleep -Seconds 10  # Wait for app to start

try {
    $response = Invoke-WebRequest -Uri "$appUrl/api/health" -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Health check returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Health check failed. App might still be starting..." -ForegroundColor Yellow
}

# Display success information
Write-Host "`n🎉 Fly.io Deployment Complete!" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host "`n🌐 Your Application URLs:" -ForegroundColor Yellow
Write-Host "  Main App: $appUrl" -ForegroundColor White
Write-Host "  Dashboard: $appUrl/dashboard" -ForegroundColor White
Write-Host "  API Health: $appUrl/api/health" -ForegroundColor White

Write-Host "`n🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "  View logs: flyctl logs --app $appName" -ForegroundColor Gray
Write-Host "  Check status: flyctl status --app $appName" -ForegroundColor Gray
Write-Host "  Open app: flyctl open --app $appName" -ForegroundColor Gray
Write-Host "  SSH into app: flyctl ssh console --app $appName" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🔄 Set up CI/CD by adding FLY_API_TOKEN to GitHub Secrets" -ForegroundColor White
Write-Host "2. 💾 Configure production database (MongoDB Atlas)" -ForegroundColor White
Write-Host "3. 🔧 Set up custom domain (optional)" -ForegroundColor White
Write-Host "4. 📊 Monitor your application" -ForegroundColor White

Write-Host "`n🔑 For CI/CD Setup:" -ForegroundColor Yellow
Write-Host "1. Get your Fly.io API token: flyctl auth token" -ForegroundColor Gray
Write-Host "2. Add it to GitHub Secrets as FLY_API_TOKEN" -ForegroundColor Gray
Write-Host "3. Push to main branch to trigger automatic deployment" -ForegroundColor Gray

Write-Host "`n🎊 Success! Your Sysora Platform is now live on Fly.io!" -ForegroundColor Green
