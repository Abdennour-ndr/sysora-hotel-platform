# Sysora Platform Deployment Script for Windows PowerShell
# This script automates the deployment process to AWS

param(
    [string]$Environment = "production",
    [switch]$SkipBuild = $false,
    [switch]$SkipTests = $false
)

# Configuration
$AWS_REGION = "us-east-1"
$ECR_REPOSITORY = "sysora-backend"
$S3_BUCKET = "sysora-frontend-prod"
$ECS_CLUSTER = "sysora-cluster"
$ECS_SERVICE = "sysora-backend-service"

# Colors for output
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

function Test-Dependencies {
    Write-Info "Checking dependencies..."
    
    $dependencies = @("aws", "docker", "node", "npm")
    $missing = @()
    
    foreach ($dep in $dependencies) {
        if (!(Get-Command $dep -ErrorAction SilentlyContinue)) {
            $missing += $dep
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Error "Missing dependencies: $($missing -join ', ')"
        exit 1
    }
    
    Write-Success "All dependencies are installed"
}

function Test-AWSCredentials {
    Write-Info "Checking AWS credentials..."
    
    try {
        aws sts get-caller-identity | Out-Null
        Write-Success "AWS credentials are valid"
    }
    catch {
        Write-Error "AWS credentials are not configured"
        exit 1
    }
}

function Build-Frontend {
    if ($SkipBuild) {
        Write-Warning "Skipping frontend build"
        return
    }
    
    Write-Info "Building frontend..."
    
    # Install dependencies
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        exit 1
    }
    
    # Run tests
    if (!$SkipTests) {
        npm test
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Tests failed"
            exit 1
        }
    }
    
    # Build the frontend
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
}

function Deploy-Frontend {
    Write-Info "Deploying frontend to S3..."
    
    # Sync files to S3
    aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to sync files to S3"
        exit 1
    }
    
    # Get CloudFront distribution ID
    $distributionId = aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='$S3_BUCKET.s3.amazonaws.com'].Id" --output text --region $AWS_REGION
    
    if ($distributionId -and $distributionId -ne "None") {
        Write-Info "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation --distribution-id $distributionId --paths "/*" --region $AWS_REGION
        if ($LASTEXITCODE -eq 0) {
            Write-Success "CloudFront cache invalidated"
        }
    }
    else {
        Write-Warning "CloudFront distribution not found"
    }
    
    Write-Success "Frontend deployed successfully"
}

function Build-Backend {
    Write-Info "Building backend Docker image..."
    
    # Get ECR login token
    $loginCommand = aws ecr get-login-password --region $AWS_REGION
    $loginCommand | docker login --username AWS --password-stdin "$((aws sts get-caller-identity --query Account --output text)).dkr.ecr.$AWS_REGION.amazonaws.com"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to login to ECR"
        exit 1
    }
    
    # Build Docker image
    $imageTag = Get-Date -Format "yyyyMMddHHmmss"
    $ecrRegistry = "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com"
    
    docker build -t "$ecrRegistry/$ECR_REPOSITORY`:$imageTag" .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build Docker image"
        exit 1
    }
    
    docker tag "$ecrRegistry/$ECR_REPOSITORY`:$imageTag" "$ecrRegistry/$ECR_REPOSITORY`:latest"
    
    Write-Success "Backend Docker image built"
    return @{
        Registry = $ecrRegistry
        Tag = $imageTag
    }
}

function Deploy-Backend {
    param($ImageInfo)
    
    Write-Info "Deploying backend to ECS..."
    
    # Push Docker image to ECR
    docker push "$($ImageInfo.Registry)/$ECR_REPOSITORY`:$($ImageInfo.Tag)"
    docker push "$($ImageInfo.Registry)/$ECR_REPOSITORY`:latest"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push Docker image"
        exit 1
    }
    
    # Update ECS service
    Write-Info "Updating ECS service..."
    
    # Get current task definition
    aws ecs describe-task-definition --task-definition sysora-backend-task --query taskDefinition > task-definition.json
    
    # Update image URI in task definition (using PowerShell JSON manipulation)
    $taskDef = Get-Content task-definition.json | ConvertFrom-Json
    $taskDef.containerDefinitions[0].image = "$($ImageInfo.Registry)/$ECR_REPOSITORY`:$($ImageInfo.Tag)"
    $taskDef | ConvertTo-Json -Depth 10 | Set-Content updated-task-definition.json
    
    # Register new task definition
    aws ecs register-task-definition --cli-input-json file://updated-task-definition.json
    
    # Update service
    aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --task-definition sysora-backend-task
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to update ECS service"
        exit 1
    }
    
    # Wait for deployment to complete
    Write-Info "Waiting for deployment to complete..."
    aws ecs wait services-stable --cluster $ECS_CLUSTER --services $ECS_SERVICE
    
    # Cleanup
    Remove-Item task-definition.json, updated-task-definition.json -ErrorAction SilentlyContinue
    
    Write-Success "Backend deployed successfully"
}

function Test-HealthCheck {
    Write-Info "Running health check..."
    
    # Get load balancer URL
    $albDns = aws elbv2 describe-load-balancers --names sysora-alb --query 'LoadBalancers[0].DNSName' --output text --region $AWS_REGION
    
    if ($albDns -and $albDns -ne "None") {
        # Wait a bit for the service to be ready
        Start-Sleep -Seconds 30
        
        # Check health endpoint
        try {
            $response = Invoke-WebRequest -Uri "http://$albDns/api/health" -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Success "Health check passed"
            }
            else {
                Write-Warning "Health check failed - service might still be starting"
            }
        }
        catch {
            Write-Warning "Health check failed - service might still be starting"
        }
    }
    else {
        Write-Warning "Load balancer not found"
    }
}

function Invoke-Cleanup {
    Write-Info "Cleaning up..."
    
    # Remove build artifacts
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist
    }
    
    if (Test-Path "node_modules\.cache") {
        Remove-Item -Recurse -Force "node_modules\.cache"
    }
    
    # Remove Docker images to save space
    docker image prune -f
    
    Write-Success "Cleanup completed"
}

# Main execution
function Main {
    Write-Host "🚀 Starting Sysora Platform Deployment" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    
    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the project root."
        exit 1
    }
    
    try {
        # Run deployment steps
        Test-Dependencies
        Test-AWSCredentials
        
        # Frontend deployment
        Build-Frontend
        Deploy-Frontend
        
        # Backend deployment
        $imageInfo = Build-Backend
        Deploy-Backend -ImageInfo $imageInfo
        
        # Health check
        Test-HealthCheck
        
        # Cleanup
        Invoke-Cleanup
        
        Write-Host ""
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
        Write-Host "Frontend: https://$S3_BUCKET" -ForegroundColor Green
        Write-Host "Backend: https://api.sysora.com" -ForegroundColor Green
        Write-Host "======================================" -ForegroundColor Green
    }
    catch {
        Write-Error "Deployment failed: $($_.Exception.Message)"
        exit 1
    }
}

# Handle script interruption
trap {
    Write-Error "Deployment interrupted"
    exit 1
}

# Run main function
Main
