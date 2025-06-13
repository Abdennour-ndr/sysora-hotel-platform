# Simple test script for Sysora Platform

Write-Host "Testing Sysora Platform..." -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
node --version

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
npm --version

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

# Check if build succeeded
if (Test-Path "dist") {
    Write-Host "Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "Frontend build failed!" -ForegroundColor Red
}

Write-Host "Test completed!" -ForegroundColor Cyan
