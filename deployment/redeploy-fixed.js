#!/usr/bin/env node

// Redeploy with correct permissions
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
    PutPublicAccessBlockCommand,
    DeleteBucketCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
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
    frontendBucket: `sysora-public-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

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

// Create bucket with proper configuration
async function createPublicBucket(bucketName) {
    try {
        log.info(`Creating new public bucket: ${bucketName}`);
        
        // Create bucket
        const createCommand = new CreateBucketCommand({
            Bucket: bucketName,
            CreateBucketConfiguration: undefined // For us-east-1, don't specify location
        });
        
        await s3Client.send(createCommand);
        log.success(`Bucket ${bucketName} created`);
        
        // Wait a moment for bucket to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Configure public access
        log.info('Configuring public access...');
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
        log.success('Public access configured');
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set bucket policy
        log.info('Setting bucket policy...');
        const bucketPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        };
        
        const policyCommand = new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(bucketPolicy)
        });
        
        await s3Client.send(policyCommand);
        log.success('Bucket policy set');
        
        // Configure website hosting
        log.info('Configuring website hosting...');
        const websiteCommand = new PutBucketWebsiteCommand({
            Bucket: bucketName,
            WebsiteConfiguration: {
                IndexDocument: { Suffix: 'index.html' },
                ErrorDocument: { Key: 'index.html' }
            }
        });
        
        await s3Client.send(websiteCommand);
        log.success('Website hosting configured');
        
        return true;
        
    } catch (error) {
        log.error(`Failed to create bucket: ${error.message}`);
        return false;
    }
}

// Upload file with public-read ACL
async function uploadFilePublic(bucketName, filePath, key) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
            ACL: 'public-read' // Make each object public
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        // If ACL fails, try without it
        try {
            const fileContent2 = fs.readFileSync(filePath);
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: fileContent2,
                ContentType: contentType
            });

            await s3Client.send(command);
            return true;
        } catch (error2) {
            log.error(`Failed to upload ${filePath}: ${error2.message}`);
            return false;
        }
    }
}

// Get content type
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
        '.ico': 'image/x-icon'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// Upload directory
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
                const success = await uploadFilePublic(bucketName, itemPath, key);
                if (success) {
                    uploadCount++;
                    log.info(`Uploaded: ${key}`);
                }
            }
        }
        
        return uploadCount;
    } catch (error) {
        log.error(`Failed to upload directory: ${error.message}`);
        return 0;
    }
}

// Main function
async function redeploy() {
    log.step('Redeploying Sysora with Fixed Permissions');
    
    try {
        // Create new bucket with proper settings
        const bucketCreated = await createPublicBucket(config.frontendBucket);
        if (!bucketCreated) {
            process.exit(1);
        }
        
        // Upload files
        log.step('Uploading Files');
        const distPath = path.join(__dirname, 'dist');
        
        if (!fs.existsSync(distPath)) {
            log.error('dist directory not found. Please run "npm run build" first.');
            process.exit(1);
        }
        
        const uploadCount = await uploadDirectory(config.frontendBucket, distPath);
        
        if (uploadCount > 0) {
            log.success(`${uploadCount} files uploaded successfully`);
            
            // Update deployment info
            const deploymentInfo = {
                frontendBucket: config.frontendBucket,
                websiteUrl: `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`,
                deploymentDate: new Date().toISOString(),
                status: 'success'
            };
            
            fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
            
            log.step('🎉 Deployment Successful!');
            console.log('='.repeat(50));
            console.log(`✅ Frontend Bucket: ${config.frontendBucket}`);
            console.log(`🌐 Website URL: http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`);
            console.log(`🏨 Hotel Dashboard: Add /hotel to the URL`);
            console.log(`👨‍💼 Admin Panel: Add /admin to the URL`);
            console.log('='.repeat(50));
            
            // Test the website
            log.info('Testing website accessibility...');
            setTimeout(() => {
                console.log('🔗 Opening website in browser...');
            }, 3000);
            
        } else {
            log.error('No files were uploaded');
            process.exit(1);
        }
        
    } catch (error) {
        log.error(`Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

// Run redeployment
redeploy();
