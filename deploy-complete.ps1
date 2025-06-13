# 🚀 Sysora Platform - Complete Deployment Script
# PowerShell script for Windows - GitHub + Fly.io + CI/CD

param(
    [switch]$SkipGitHub,
    [switch]$SkipFlyio,
    [switch]$SkipCICD,
    [string]$GitHubRepo,
    [string]$FlyAppName
)

Write-Host "🏨 Sysora Hotel Platform - Complete Deployment" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Yellow
    
    $errors = @()
    
    # Check Git
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        $errors += "Git is not installed"
    } else {
        Write-Host "✅ Git is installed" -ForegroundColor Green
    }
    
    # Check Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        $errors += "Node.js is not installed"
    } else {
        $nodeVersion = node --version
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    }
    
    # Check if we're in a Git repository
    if (!(Test-Path ".git")) {
        $errors += "Not in a Git repository"
    } else {
        Write-Host "✅ In a Git repository" -ForegroundColor Green
    }
    
    # Check if we have commits
    $commitCount = git rev-list --count HEAD 2>$null
    if ($LASTEXITCODE -ne 0) {
        $errors += "No commits found"
    } else {
        Write-Host "✅ Found $commitCount commits" -ForegroundColor Green
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "`n❌ Prerequisites check failed:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "  - $error" -ForegroundColor Red
        }
        return $false
    }
    
    Write-Host "✅ All prerequisites met!" -ForegroundColor Green
    return $true
}

# Function to deploy to GitHub
function Deploy-ToGitHub {
    param([string]$RepoUrl)
    
    Write-Host "`n📤 Deploying to GitHub..." -ForegroundColor Yellow
    
    if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
        Write-Host "Please create a repository on GitHub.com:" -ForegroundColor White
        Write-Host "  1. Go to https://github.com/new" -ForegroundColor Gray
        Write-Host "  2. Repository name: sysora-hotel-platform" -ForegroundColor Gray
        Write-Host "  3. Description: 🏨 Complete Hotel Management SaaS Platform" -ForegroundColor Gray
        Write-Host "  4. ❌ Do NOT initialize with README, .gitignore, or license" -ForegroundColor Gray
        
        $RepoUrl = Read-Host "`nEnter your GitHub repository URL"
    }
    
    # Validate URL
    if ($RepoUrl -notmatch "^https://github\.com/.+/.+\.git$") {
        Write-Host "❌ Invalid GitHub URL format" -ForegroundColor Red
        return $false
    }
    
    # Add remote and push
    try {
        $existingRemote = git remote get-url origin 2>$null
        if ($LASTEXITCODE -eq 0) {
            git remote remove origin
        }
        
        git remote add origin $RepoUrl
        git branch -M main
        git push -u origin main
        
        Write-Host "✅ Successfully deployed to GitHub!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to deploy to GitHub: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to deploy to Fly.io
function Deploy-ToFlyio {
    param([string]$AppName)
    
    Write-Host "`n🛫 Deploying to Fly.io..." -ForegroundColor Yellow
    
    # Install flyctl if needed
    if (!(Get-Command flyctl -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Fly.io CLI..." -ForegroundColor Yellow
        try {
            iwr https://fly.io/install.ps1 -useb | iex
        } catch {
            Write-Host "❌ Failed to install Fly.io CLI" -ForegroundColor Red
            return $false
        }
    }
    
    # Login check
    $authStatus = flyctl auth whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Please log in to Fly.io..." -ForegroundColor Yellow
        flyctl auth login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to log in to Fly.io" -ForegroundColor Red
            return $false
        }
    }
    
    # Create app
    if ([string]::IsNullOrWhiteSpace($AppName)) {
        $AppName = "sysora-hotel-platform"
    }
    
    $existingApp = flyctl apps list | Select-String $AppName
    if (!$existingApp) {
        flyctl apps create $AppName
        if ($LASTEXITCODE -ne 0) {
            $timestamp = Get-Date -Format "yyyyMMddHHmm"
            $AppName = "$AppName-$timestamp"
            flyctl apps create $AppName
        }
    }
    
    # Update fly.toml
    $flyTomlContent = Get-Content "fly.toml" -Raw
    $flyTomlContent = $flyTomlContent -replace 'app = ".*"', "app = `"$AppName`""
    Set-Content "fly.toml" $flyTomlContent
    
    # Set secrets
    $jwtSecret = "sysora-jwt-secret-2024-" + [System.Web.Security.Membership]::GeneratePassword(32, 8)
    
    flyctl secrets set "NODE_ENV=production" --app $AppName
    flyctl secrets set "JWT_SECRET=$jwtSecret" --app $AppName
    flyctl secrets set "MONGODB_URI=mongodb://localhost:27017/sysora-production" --app $AppName
    
    # Deploy
    flyctl deploy --app $AppName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully deployed to Fly.io!" -ForegroundColor Green
        Write-Host "🌐 App URL: https://$AppName.fly.dev" -ForegroundColor White
        return $AppName
    } else {
        Write-Host "❌ Failed to deploy to Fly.io" -ForegroundColor Red
        return $false
    }
}

# Function to setup CI/CD
function Setup-CICD {
    Write-Host "`n🔄 Setting up CI/CD..." -ForegroundColor Yellow
    
    # Get Fly.io token
    $token = flyctl auth token
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to get Fly.io API token" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Fly.io API Token obtained" -ForegroundColor Green
    Write-Host "`n📋 CI/CD Setup Instructions:" -ForegroundColor Yellow
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Settings → Secrets and variables → Actions" -ForegroundColor White
    Write-Host "3. Click 'New repository secret'" -ForegroundColor White
    Write-Host "4. Name: FLY_API_TOKEN" -ForegroundColor White
    Write-Host "5. Value: $token" -ForegroundColor Gray
    Write-Host "6. Click 'Add secret'" -ForegroundColor White
    
    $completed = Read-Host "`nHave you added the FLY_API_TOKEN to GitHub Secrets? (y/N)"
    
    if ($completed -eq "y" -or $completed -eq "Y") {
        Write-Host "✅ CI/CD setup completed!" -ForegroundColor Green
        Write-Host "🔄 Now every push to main branch will trigger automatic deployment" -ForegroundColor White
        return $true
    } else {
        Write-Host "⚠️  CI/CD setup incomplete. You can complete it later." -ForegroundColor Yellow
        return $false
    }
}

# Main execution
Write-Host "`n🚀 Starting complete deployment process..." -ForegroundColor Cyan

# Check prerequisites
if (!(Test-Prerequisites)) {
    exit 1
}

$success = $true

# GitHub deployment
if (!$SkipGitHub) {
    if (!(Deploy-ToGitHub -RepoUrl $GitHubRepo)) {
        $success = $false
    }
} else {
    Write-Host "`n⏭️  Skipping GitHub deployment" -ForegroundColor Yellow
}

# Fly.io deployment
if (!$SkipFlyio -and $success) {
    $deployedAppName = Deploy-ToFlyio -AppName $FlyAppName
    if (!$deployedAppName) {
        $success = $false
    }
} else {
    Write-Host "`n⏭️  Skipping Fly.io deployment" -ForegroundColor Yellow
}

# CI/CD setup
if (!$SkipCICD -and $success) {
    Setup-CICD | Out-Null
} else {
    Write-Host "`n⏭️  Skipping CI/CD setup" -ForegroundColor Yellow
}

# Final summary
Write-Host "`n🎉 Deployment Summary" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

if ($success) {
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    
    if ($deployedAppName) {
        Write-Host "`n🌐 Your Application:" -ForegroundColor Yellow
        Write-Host "  URL: https://$deployedAppName.fly.dev" -ForegroundColor White
        Write-Host "  Dashboard: https://$deployedAppName.fly.dev/dashboard" -ForegroundColor White
        Write-Host "  Health: https://$deployedAppName.fly.dev/api/health" -ForegroundColor White
    }
    
    Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
    Write-Host "  - STEP_BY_STEP_DEPLOYMENT.md" -ForegroundColor Gray
    Write-Host "  - QUICK_DEPLOY.md" -ForegroundColor Gray
    Write-Host "  - DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
    
} else {
    Write-Host "⚠️  Deployment completed with some issues" -ForegroundColor Yellow
    Write-Host "Please check the logs above and refer to the documentation" -ForegroundColor Gray
}

Write-Host "`n🎊 Thank you for using Sysora Platform!" -ForegroundColor Green
