#!/bin/bash

# Sysora Platform Deployment Script
# This script automates the deployment process to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="sysora-backend"
S3_BUCKET="sysora-frontend-prod"
ECS_CLUSTER="sysora-cluster"
ECS_SERVICE="sysora-backend-service"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

check_aws_credentials() {
    log_info "Checking AWS credentials..."
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials are not configured"
        exit 1
    fi
    
    log_success "AWS credentials are valid"
}

build_frontend() {
    log_info "Building frontend..."
    
    # Install dependencies
    npm ci
    
    # Build the frontend
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    log_success "Frontend built successfully"
}

deploy_frontend() {
    log_info "Deploying frontend to S3..."
    
    # Sync files to S3
    aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION
    
    # Get CloudFront distribution ID
    DISTRIBUTION_ID=$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?Origins.Items[0].DomainName=='$S3_BUCKET.s3.amazonaws.com'].Id" \
        --output text --region $AWS_REGION)
    
    if [ -n "$DISTRIBUTION_ID" ]; then
        log_info "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation \
            --distribution-id $DISTRIBUTION_ID \
            --paths "/*" \
            --region $AWS_REGION
        log_success "CloudFront cache invalidated"
    else
        log_warning "CloudFront distribution not found"
    fi
    
    log_success "Frontend deployed successfully"
}

build_backend() {
    log_info "Building backend Docker image..."
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Build Docker image
    IMAGE_TAG=$(date +%Y%m%d%H%M%S)
    ECR_REGISTRY=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com
    
    docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
    docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
    
    log_success "Backend Docker image built"
}

deploy_backend() {
    log_info "Deploying backend to ECS..."
    
    # Push Docker image to ECR
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
    
    # Update ECS service
    log_info "Updating ECS service..."
    
    # Get current task definition
    aws ecs describe-task-definition \
        --task-definition sysora-backend-task \
        --query taskDefinition > task-definition.json
    
    # Update image URI in task definition
    jq --arg IMAGE_URI "$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" \
       '.containerDefinitions[0].image = $IMAGE_URI' \
       task-definition.json > updated-task-definition.json
    
    # Remove unnecessary fields
    jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities, .registeredAt, .registeredBy)' \
       updated-task-definition.json > clean-task-definition.json
    
    # Register new task definition
    aws ecs register-task-definition \
        --cli-input-json file://clean-task-definition.json
    
    # Update service
    aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $ECS_SERVICE \
        --task-definition sysora-backend-task
    
    # Wait for deployment to complete
    log_info "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster $ECS_CLUSTER \
        --services $ECS_SERVICE
    
    # Cleanup
    rm -f task-definition.json updated-task-definition.json clean-task-definition.json
    
    log_success "Backend deployed successfully"
}

run_health_check() {
    log_info "Running health check..."
    
    # Get load balancer URL
    ALB_DNS=$(aws elbv2 describe-load-balancers \
        --names sysora-alb \
        --query 'LoadBalancers[0].DNSName' \
        --output text --region $AWS_REGION)
    
    if [ "$ALB_DNS" != "None" ]; then
        # Wait a bit for the service to be ready
        sleep 30
        
        # Check health endpoint
        if curl -f -s "http://$ALB_DNS/api/health" > /dev/null; then
            log_success "Health check passed"
        else
            log_warning "Health check failed - service might still be starting"
        fi
    else
        log_warning "Load balancer not found"
    fi
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove build artifacts
    rm -rf dist/
    rm -rf node_modules/.cache/
    
    # Remove Docker images to save space
    docker image prune -f
    
    log_success "Cleanup completed"
}

main() {
    echo "🚀 Starting Sysora Platform Deployment"
    echo "======================================"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Run deployment steps
    check_dependencies
    check_aws_credentials
    
    # Frontend deployment
    build_frontend
    deploy_frontend
    
    # Backend deployment
    build_backend
    deploy_backend
    
    # Health check
    run_health_check
    
    # Cleanup
    cleanup
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "Frontend: https://$S3_BUCKET"
    echo "Backend: https://api.sysora.com"
    echo "======================================"
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
