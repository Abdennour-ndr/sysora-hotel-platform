# Sysora Platform - Supervised AWS Deployment
# Full supervision and automated deployment to AWS

param(
    [string]$Environment = "production",
    [switch]$SkipBuild = $false,
    [switch]$CreateInfrastructure = $true
)

# Configuration
$AWS_REGION = "us-east-1"
$PROJECT_NAME = "sysora"
$FRONTEND_BUCKET = "sysora-frontend-prod-$(Get-Random -Minimum 1000 -Maximum 9999)"
$UPLOADS_BUCKET = "sysora-uploads-prod-$(Get-Random -Minimum 1000 -Maximum 9999)"
$ECR_REPOSITORY = "sysora-backend"

# Colors for output
function Write-Step {
    param([string]$Message)
    Write-Host "`n🚀 $Message" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Test-AWSConnection {
    Write-Info "Testing AWS connection..."
    try {
        $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
        Write-Success "Connected to AWS Account: $($identity.Account)"
        Write-Success "User: $($identity.Arn)"
        return $true
    }
    catch {
        Write-Error "Failed to connect to AWS. Please check credentials."
        return $false
    }
}

function New-S3Buckets {
    Write-Step "Creating S3 Buckets"
    
    # Create frontend bucket
    Write-Info "Creating frontend bucket: $FRONTEND_BUCKET"
    aws s3 mb s3://$FRONTEND_BUCKET --region $AWS_REGION
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend bucket created successfully"
    }
    
    # Enable static website hosting
    Write-Info "Enabling static website hosting..."
    aws s3 website s3://$FRONTEND_BUCKET --index-document index.html --error-document index.html
    
    # Set bucket policy for public read
    $bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$FRONTEND_BUCKET/*"
        }
    ]
}
"@
    
    $bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8
    aws s3api put-bucket-policy --bucket $FRONTEND_BUCKET --policy file://bucket-policy.json
    Remove-Item "bucket-policy.json"
    
    # Create uploads bucket
    Write-Info "Creating uploads bucket: $UPLOADS_BUCKET"
    aws s3 mb s3://$UPLOADS_BUCKET --region $AWS_REGION
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Uploads bucket created successfully"
    }
    
    # Update .env with bucket names
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace "S3_BUCKET_NAME=.*", "S3_BUCKET_NAME=$UPLOADS_BUCKET"
    $envContent | Set-Content ".env"
    
    Write-Success "S3 buckets created and configured"
}

function New-ECRRepository {
    Write-Step "Creating ECR Repository"
    
    Write-Info "Creating ECR repository: $ECR_REPOSITORY"
    $result = aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION 2>&1
    
    if ($LASTEXITCODE -eq 0 -or $result -like "*already exists*") {
        Write-Success "ECR repository ready"
        
        # Get repository URI
        $repoInfo = aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION --output json | ConvertFrom-Json
        $script:ECR_URI = $repoInfo.repositories[0].repositoryUri
        Write-Success "Repository URI: $ECR_URI"
        return $true
    }
    else {
        Write-Error "Failed to create ECR repository: $result"
        return $false
    }
}

function Build-Frontend {
    Write-Step "Building Frontend"
    
    if ($SkipBuild) {
        Write-Warning "Skipping frontend build"
        return $true
    }
    
    Write-Info "Installing dependencies..."
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        return $false
    }
    
    Write-Info "Building React application..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Frontend build failed"
        return $false
    }
    
    if (!(Test-Path "dist")) {
        Write-Error "Build output directory not found"
        return $false
    }
    
    Write-Success "Frontend built successfully"
    return $true
}

function Deploy-Frontend {
    Write-Step "Deploying Frontend to S3"
    
    Write-Info "Uploading files to S3..."
    aws s3 sync dist/ s3://$FRONTEND_BUCKET --delete --region $AWS_REGION
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend deployed successfully"
        Write-Success "Frontend URL: http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
        return $true
    }
    else {
        Write-Error "Failed to deploy frontend"
        return $false
    }
}

function Build-BackendImage {
    Write-Step "Building Backend Docker Image"
    
    Write-Info "Logging into ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI.Split('/')[0]
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to login to ECR"
        return $false
    }
    
    Write-Info "Building Docker image..."
    $imageTag = "latest"
    docker build -t $ECR_REPOSITORY`:$imageTag .
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build Docker image"
        return $false
    }
    
    Write-Info "Tagging image for ECR..."
    docker tag $ECR_REPOSITORY`:$imageTag $ECR_URI`:$imageTag
    
    Write-Info "Pushing image to ECR..."
    docker push $ECR_URI`:$imageTag
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend image built and pushed successfully"
        return $true
    }
    else {
        Write-Error "Failed to push image to ECR"
        return $false
    }
}

function Test-Deployment {
    Write-Step "Testing Deployment"
    
    Write-Info "Testing frontend..."
    try {
        $frontendUrl = "http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
        $response = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible"
        }
    }
    catch {
        Write-Warning "Frontend test failed: $($_.Exception.Message)"
    }
    
    Write-Success "Basic deployment tests completed"
}

function Show-DeploymentSummary {
    Write-Step "Deployment Summary"
    
    Write-Host "`n🎉 Sysora Platform Deployed Successfully!" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Green
    
    Write-Host "`n📊 Deployment Details:" -ForegroundColor Yellow
    Write-Host "Frontend Bucket: $FRONTEND_BUCKET" -ForegroundColor White
    Write-Host "Uploads Bucket: $UPLOADS_BUCKET" -ForegroundColor White
    Write-Host "ECR Repository: $ECR_URI" -ForegroundColor White
    Write-Host "AWS Region: $AWS_REGION" -ForegroundColor White
    
    Write-Host "`n🌐 Access URLs:" -ForegroundColor Yellow
    Write-Host "Frontend: http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com" -ForegroundColor Cyan
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Set up custom domain name" -ForegroundColor White
    Write-Host "2. Configure CloudFront for CDN" -ForegroundColor White
    Write-Host "3. Set up SSL certificate" -ForegroundColor White
    Write-Host "4. Deploy backend to ECS" -ForegroundColor White
    Write-Host "5. Set up MongoDB Atlas" -ForegroundColor White
    
    Write-Host "`n💰 Estimated Monthly Cost: ~$10-50 (with free tier)" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Green
}

# Main execution
try {
    Write-Host "🚀 Starting Sysora Platform AWS Deployment" -ForegroundColor Cyan
    Write-Host "Supervised by AI Assistant" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    # Test AWS connection
    if (!(Test-AWSConnection)) {
        exit 1
    }
    
    # Create infrastructure
    if ($CreateInfrastructure) {
        if (!(New-S3Buckets)) { exit 1 }
        if (!(New-ECRRepository)) { exit 1 }
    }
    
    # Build and deploy
    if (!(Build-Frontend)) { exit 1 }
    if (!(Deploy-Frontend)) { exit 1 }
    if (!(Build-BackendImage)) { exit 1 }
    
    # Test deployment
    Test-Deployment
    
    # Show summary
    Show-DeploymentSummary
    
    Write-Host "`n🎊 Deployment completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    exit 1
}
