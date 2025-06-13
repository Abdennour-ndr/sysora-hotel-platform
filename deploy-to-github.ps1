# 🚀 Sysora Platform - GitHub Deployment Script
# PowerShell script for Windows

Write-Host "🏨 Sysora Hotel Platform - GitHub Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green

# Check current Git status
Write-Host "`n📋 Current Git Status:" -ForegroundColor Yellow
git status --short

# Check if we have commits
$commitCount = git rev-list --count HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No commits found. Please make sure you have committed your changes." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $commitCount commits" -ForegroundColor Green

# Prompt for GitHub repository URL
Write-Host "`n🔗 GitHub Repository Setup:" -ForegroundColor Yellow
Write-Host "Please create a new repository on GitHub.com with these settings:" -ForegroundColor White
Write-Host "  - Repository name: sysora-hotel-platform" -ForegroundColor Gray
Write-Host "  - Description: 🏨 Complete Hotel Management SaaS Platform" -ForegroundColor Gray
Write-Host "  - Public or Private (your choice)" -ForegroundColor Gray
Write-Host "  - ❌ Do NOT initialize with README, .gitignore, or license" -ForegroundColor Gray

$repoUrl = Read-Host "`nEnter your GitHub repository URL (e.g., https://github.com/username/sysora-hotel-platform.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required." -ForegroundColor Red
    exit 1
}

# Validate URL format
if ($repoUrl -notmatch "^https://github\.com/.+/.+\.git$") {
    Write-Host "❌ Invalid GitHub URL format. Expected: https://github.com/username/repo.git" -ForegroundColor Red
    exit 1
}

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        git remote remove origin
        Write-Host "✅ Removed existing remote" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment cancelled." -ForegroundColor Red
        exit 1
    }
}

# Add remote origin
Write-Host "`n🔗 Adding GitHub remote..." -ForegroundColor Yellow
git remote add origin $repoUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add remote origin." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Remote origin added successfully" -ForegroundColor Green

# Set main branch
Write-Host "`n🌿 Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may take a few minutes depending on your internet connection..." -ForegroundColor Gray

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor Red
    Write-Host "You may need to:" -ForegroundColor Yellow
    Write-Host "  1. Set up GitHub authentication (Personal Access Token)" -ForegroundColor Gray
    Write-Host "  2. Check if the repository exists and you have write access" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green

# Display next steps
Write-Host "`n🎉 GitHub Deployment Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. ✅ Your code is now on GitHub: $($repoUrl -replace '\.git$', '')" -ForegroundColor White
Write-Host "2. 🚀 Next: Deploy to Fly.io using the deploy-to-flyio.ps1 script" -ForegroundColor White
Write-Host "3. 🔄 Set up CI/CD by adding FLY_API_TOKEN to GitHub Secrets" -ForegroundColor White

Write-Host "`n🔧 Quick Commands:" -ForegroundColor Yellow
Write-Host "  View repository: $($repoUrl -replace '\.git$', '')" -ForegroundColor Gray
Write-Host "  Deploy to Fly.io: .\deploy-to-flyio.ps1" -ForegroundColor Gray
Write-Host "  Check status: git status" -ForegroundColor Gray

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Write-Host "  - STEP_BY_STEP_DEPLOYMENT.md - Complete guide" -ForegroundColor Gray
Write-Host "  - QUICK_DEPLOY.md - Quick reference" -ForegroundColor Gray
Write-Host "  - DEPLOYMENT_GUIDE.md - Detailed instructions" -ForegroundColor Gray

Write-Host "`n🎊 Success! Your Sysora Platform is now on GitHub!" -ForegroundColor Green
