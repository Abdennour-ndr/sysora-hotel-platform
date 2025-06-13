# Install AWS CLI on Windows
Write-Host "🔧 Installing AWS CLI..." -ForegroundColor Cyan

# Download AWS CLI installer
$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$output = "$env:TEMP\AWSCLIV2.msi"

Write-Host "📥 Downloading AWS CLI installer..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "✅ Download completed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Install AWS CLI
Write-Host "🔧 Installing AWS CLI..." -ForegroundColor Yellow
try {
    Start-Process msiexec.exe -Wait -ArgumentList "/I $output /quiet"
    Write-Host "✅ AWS CLI installed successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $output -ErrorAction SilentlyContinue

# Add to PATH for current session
$env:Path += ";C:\Program Files\Amazon\AWSCLIV2\"

Write-Host "🎉 AWS CLI installation completed!" -ForegroundColor Green
Write-Host "Please restart PowerShell or run: refreshenv" -ForegroundColor Yellow
