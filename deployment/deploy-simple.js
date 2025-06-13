#!/usr/bin/env node

// Sysora Platform - Simple AWS Deployment
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketWebsiteCommand,
    ListBucketsCommand,
    PutPublicAccessBlockCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-aws-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-aws-secret-access-key',
    frontendBucket: `sysora-frontend-${Date.now()}`,
    uploadsBucket: `sysora-uploads-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

// Utility functions
const log = {
    info: (msg) => console.log(`🔵 ${msg}`),
    success: (msg) => console.log(`✅ ${msg}`),
    error: (msg) => console.log(`❌ ${msg}`),
    warning: (msg) => console.log(`⚠️  ${msg}`),
    step: (msg) => {
        console.log(`\n🚀 ${msg}`);
        console.log('='.repeat(50));
    }
};

// Test AWS connection
async function testConnection() {
    log.step('Testing AWS Connection');
    
    try {
        const command = new ListBucketsCommand({});
        const result = await s3Client.send(command);
        log.success('AWS connection successful');
        log.info(`Found ${result.Buckets.length} existing buckets`);
        return true;
    } catch (error) {
        log.error(`AWS connection failed: ${error.message}`);
        return false;
    }
}

// Create S3 bucket with simplified settings
async function createSimpleBucket(bucketName, isWebsite = false) {
    try {
        log.info(`Creating bucket: ${bucketName}`);
        
        const createCommand = new CreateBucketCommand({
            Bucket: bucketName
        });
        
        await s3Client.send(createCommand);
        log.success(`Bucket ${bucketName} created successfully`);
        
        if (isWebsite) {
            try {
                // Disable public access block first
                const publicAccessCommand = new PutPublicAccessBlockCommand({
                    Bucket: bucketName,
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: false,
                        IgnorePublicAcls: false,
                        BlockPublicPolicy: false,
                        RestrictPublicBuckets: false
                    }
                });
                
                await s3Client.send(publicAccessCommand);
                log.success(`Public access enabled for ${bucketName}`);
                
                // Configure for static website hosting
                const websiteCommand = new PutBucketWebsiteCommand({
                    Bucket: bucketName,
                    WebsiteConfiguration: {
                        IndexDocument: { Suffix: 'index.html' },
                        ErrorDocument: { Key: 'index.html' }
                    }
                });
                
                await s3Client.send(websiteCommand);
                log.success(`Website hosting enabled for ${bucketName}`);
                
            } catch (policyError) {
                log.warning(`Could not set public policy: ${policyError.message}`);
                log.info('Bucket created but may need manual configuration for public access');
            }
        }
        
        return true;
    } catch (error) {
        if (error.name === 'BucketAlreadyExists' || error.name === 'BucketAlreadyOwnedByYou') {
            log.warning(`Bucket ${bucketName} already exists`);
            return true;
        }
        log.error(`Failed to create bucket ${bucketName}: ${error.message}`);
        return false;
    }
}

// Get content type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// Upload file to S3
async function uploadFile(bucketName, filePath, key) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: contentType
        });
        
        await s3Client.send(command);
        return true;
    } catch (error) {
        log.error(`Failed to upload ${filePath}: ${error.message}`);
        return false;
    }
}

// Upload directory recursively
async function uploadDirectory(bucketName, dirPath, prefix = '') {
    try {
        const items = fs.readdirSync(dirPath);
        let uploadCount = 0;
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                const subCount = await uploadDirectory(bucketName, itemPath, `${prefix}${item}/`);
                uploadCount += subCount;
            } else {
                const key = `${prefix}${item}`;
                const success = await uploadFile(bucketName, itemPath, key);
                if (success) {
                    uploadCount++;
                    if (uploadCount % 3 === 0) {
                        log.info(`Uploaded ${uploadCount} files...`);
                    }
                }
            }
        }
        
        return uploadCount;
    } catch (error) {
        log.error(`Failed to upload directory ${dirPath}: ${error.message}`);
        return 0;
    }
}

// Deploy frontend
async function deployFrontend() {
    log.step('Deploying Frontend to S3');
    
    // Check if dist directory exists
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
        log.error('dist directory not found. Please run "npm run build" first.');
        return false;
    }
    
    // Create frontend bucket
    const bucketCreated = await createSimpleBucket(config.frontendBucket, true);
    if (!bucketCreated) {
        return false;
    }
    
    // Upload all files from dist directory
    log.info('Uploading frontend files...');
    const uploadCount = await uploadDirectory(config.frontendBucket, distPath);
    
    if (uploadCount > 0) {
        log.success(`Frontend deployed successfully! ${uploadCount} files uploaded.`);
        log.success(`Website URL: http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`);
        return true;
    } else {
        log.error('Failed to upload frontend files');
        return false;
    }
}

// Create uploads bucket
async function createUploadsBucket() {
    log.step('Creating Uploads Bucket');
    
    const bucketCreated = await createSimpleBucket(config.uploadsBucket, false);
    if (bucketCreated) {
        log.success(`Uploads bucket created: ${config.uploadsBucket}`);
        return true;
    }
    return false;
}

// Main deployment function
async function deploy() {
    console.log('🚀 Starting Sysora Platform AWS Deployment');
    console.log('Simple S3 Deployment');
    console.log('='.repeat(50));
    
    try {
        // Test AWS connection
        const connectionOk = await testConnection();
        if (!connectionOk) {
            process.exit(1);
        }
        
        // Deploy frontend
        const frontendOk = await deployFrontend();
        if (!frontendOk) {
            process.exit(1);
        }
        
        // Create uploads bucket
        const uploadsOk = await createUploadsBucket();
        if (!uploadsOk) {
            process.exit(1);
        }
        
        // Show deployment summary
        log.step('🎉 Deployment Summary');
        console.log('✅ Sysora Platform deployed successfully!');
        console.log('='.repeat(50));
        console.log(`📊 Frontend Bucket: ${config.frontendBucket}`);
        console.log(`📁 Uploads Bucket: ${config.uploadsBucket}`);
        console.log(`🌐 Website URL: http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`);
        console.log(`🏨 Hotel Dashboard: Add /hotel to the URL`);
        console.log(`👨‍💼 Admin Panel: Add /admin to the URL`);
        console.log(`💰 Estimated cost: $1-5/month`);
        console.log('='.repeat(50));
        
        log.success('🎊 Deployment completed successfully!');
        log.info('📝 Note: You may need to manually configure bucket permissions in AWS Console for public access');
        
        // Save deployment info
        const deploymentInfo = {
            frontendBucket: config.frontendBucket,
            uploadsBucket: config.uploadsBucket,
            websiteUrl: `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`,
            deploymentDate: new Date().toISOString()
        };
        
        fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
        log.success('Deployment info saved to deployment-info.json');
        
    } catch (error) {
        log.error(`Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

// Run deployment
deploy();
