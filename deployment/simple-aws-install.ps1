# Simple AWS CLI installer
Write-Host "Installing AWS CLI..." -ForegroundColor Cyan

$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$output = "$env:TEMP\AWSCLIV2.msi"

Write-Host "Downloading..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Installing..." -ForegroundColor Yellow
Start-Process msiexec.exe -Wait -ArgumentList "/I $output /quiet"

Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item $output -ErrorAction SilentlyContinue

Write-Host "AWS CLI installed!" -ForegroundColor Green
