#!/usr/bin/env node

// Sysora Platform - AWS Deployment using AWS SDK
// This script deploys the application to AWS using JavaScript SDK

import AWS from 'aws-sdk';
import { S3Client, CreateBucketCommand, PutObjectCommand, PutBucketPolicyCommand, PutBucketWebsiteCommand } from '@aws-sdk/client-s3';
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

// Initialize AWS clients
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

// Create S3 bucket
async function createBucket(bucketName, isWebsite = false) {
    try {
        log.info(`Creating bucket: ${bucketName}`);
        
        const createCommand = new CreateBucketCommand({
            Bucket: bucketName
        });
        
        await s3Client.send(createCommand);
        log.success(`Bucket ${bucketName} created successfully`);
        
        if (isWebsite) {
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
            
            // Set bucket policy for public access
            const bucketPolicy = {
                Version: '2012-10-17',
                Statement: [{
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }]
            };
            
            const policyCommand = new PutBucketPolicyCommand({
                Bucket: bucketName,
                Policy: JSON.stringify(bucketPolicy)
            });
            
            await s3Client.send(policyCommand);
            log.success(`Public access policy set for ${bucketName}`);
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

// Upload directory recursively
async function uploadDirectory(bucketName, dirPath, prefix = '') {
    try {
        const items = fs.readdirSync(dirPath);
        let uploadCount = 0;
        
        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                await uploadDirectory(bucketName, itemPath, `${prefix}${item}/`);
            } else {
                const key = `${prefix}${item}`;
                const success = await uploadFile(bucketName, itemPath, key);
                if (success) {
                    uploadCount++;
                    if (uploadCount % 10 === 0) {
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
    const bucketCreated = await createBucket(config.frontendBucket, true);
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
    
    const bucketCreated = await createBucket(config.uploadsBucket, false);
    if (bucketCreated) {
        log.success(`Uploads bucket created: ${config.uploadsBucket}`);
        return true;
    }
    return false;
}

// Test AWS connection
async function testConnection() {
    log.step('Testing AWS Connection');
    
    try {
        // Try to list buckets to test connection
        const AWS_SDK = new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region
        });
        
        const result = await AWS_SDK.listBuckets().promise();
        log.success('AWS connection successful');
        log.info(`Found ${result.Buckets.length} existing buckets`);
        return true;
    } catch (error) {
        log.error(`AWS connection failed: ${error.message}`);
        return false;
    }
}

// Update environment file with new bucket names
function updateEnvironment() {
    log.step('Updating Environment Configuration');
    
    try {
        let envContent = fs.readFileSync('.env', 'utf8');
        envContent = envContent.replace(/S3_BUCKET_NAME=.*/, `S3_BUCKET_NAME=${config.uploadsBucket}`);
        fs.writeFileSync('.env', envContent);
        log.success('Environment file updated with new bucket names');
        return true;
    } catch (error) {
        log.error(`Failed to update environment file: ${error.message}`);
        return false;
    }
}

// Main deployment function
async function deploy() {
    console.log('🚀 Starting Sysora Platform AWS Deployment');
    console.log('Using AWS SDK for JavaScript');
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
        
        // Update environment
        updateEnvironment();
        
        // Show deployment summary
        log.step('Deployment Summary');
        console.log('🎉 Sysora Platform deployed successfully!');
        console.log('='.repeat(50));
        console.log(`📊 Frontend Bucket: ${config.frontendBucket}`);
        console.log(`📁 Uploads Bucket: ${config.uploadsBucket}`);
        console.log(`🌐 Website URL: http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`);
        console.log(`💰 Estimated cost: $1-5/month`);
        console.log('='.repeat(50));
        
        log.success('Deployment completed successfully!');
        
    } catch (error) {
        log.error(`Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

// Run deployment
if (import.meta.url === `file://${process.argv[1]}`) {
    deploy();
}

export { deploy, deployFrontend, createUploadsBucket, testConnection };
