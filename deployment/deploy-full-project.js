#!/usr/bin/env node

// Deploy complete Sysora project to AWS S3
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
    frontendBucket: `sysora-platform-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Deploying Complete Sysora Platform');
console.log('='.repeat(60));
console.log(`📦 Bucket: ${config.frontendBucket}`);
console.log(`🌍 Region: ${config.region}`);
console.log('='.repeat(60));

// Get content type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
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
        '.eot': 'application/vnd.ms-fontobject',
        '.txt': 'text/plain',
        '.xml': 'application/xml',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// Setup S3 bucket with proper configuration
async function setupBucket() {
    try {
        console.log('🔧 Setting up S3 bucket...');
        
        // Create bucket
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Bucket created successfully');
        
        // Wait for bucket to be ready
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Configure public access
        console.log('🔓 Configuring public access...');
        await s3Client.send(new PutPublicAccessBlockCommand({
            Bucket: config.frontendBucket,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false,
                RestrictPublicBuckets: false
            }
        }));
        console.log('✅ Public access configured');
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set bucket policy
        console.log('📋 Setting bucket policy...');
        const policy = {
            Version: '2012-10-17',
            Statement: [{
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: `arn:aws:s3:::${config.frontendBucket}/*`
            }]
        };
        
        await s3Client.send(new PutBucketPolicyCommand({
            Bucket: config.frontendBucket,
            Policy: JSON.stringify(policy)
        }));
        console.log('✅ Bucket policy applied');
        
        // Configure website hosting
        console.log('🌐 Configuring website hosting...');
        await s3Client.send(new PutBucketWebsiteCommand({
            Bucket: config.frontendBucket,
            WebsiteConfiguration: {
                IndexDocument: { Suffix: 'index.html' },
                ErrorDocument: { Key: 'index.html' }
            }
        }));
        console.log('✅ Website hosting configured');
        
        return true;
    } catch (error) {
        console.log(`❌ Setup error: ${error.message}`);
        return false;
    }
}

// Upload file with proper settings
async function uploadFile(bucketName, filePath, key) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);
        
        // Set cache control based on file type
        let cacheControl = 'public, max-age=31536000'; // 1 year for assets
        if (key.endsWith('.html')) {
            cacheControl = 'public, max-age=0, must-revalidate'; // No cache for HTML
        }
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
            CacheControl: cacheControl
        });
        
        await s3Client.send(command);
        return true;
    } catch (error) {
        console.log(`❌ Failed to upload ${key}: ${error.message}`);
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
                    console.log(`📁 Uploaded: ${key} (${(stat.size / 1024).toFixed(2)} KB)`);
                }
            }
        }
        
        return uploadCount;
    } catch (error) {
        console.log(`❌ Directory upload error: ${error.message}`);
        return 0;
    }
}

// Main deployment function
async function deployProject() {
    try {
        // Setup bucket
        const setupOk = await setupBucket();
        if (!setupOk) {
            console.log('❌ Failed to setup bucket');
            return;
        }
        
        // Check if dist directory exists
        const distPath = path.join(__dirname, 'dist');
        if (!fs.existsSync(distPath)) {
            console.log('❌ dist directory not found. Please run "npm run build" first.');
            return;
        }
        
        // Upload all files from dist directory
        console.log('\n📤 Uploading project files...');
        console.log('='.repeat(40));
        
        const uploadCount = await uploadDirectory(config.frontendBucket, distPath);
        
        if (uploadCount > 0) {
            const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
            
            console.log('\n🎉 Deployment Successful!');
            console.log('='.repeat(60));
            console.log(`✅ Bucket: ${config.frontendBucket}`);
            console.log(`📁 Files uploaded: ${uploadCount}`);
            console.log(`📊 Total size: ${await getTotalSize(distPath)} KB`);
            console.log(`🌐 Website URL: ${websiteUrl}`);
            console.log(`🏨 Hotel Dashboard: ${websiteUrl}/hotel`);
            console.log(`👨‍💼 Admin Panel: ${websiteUrl}/admin`);
            console.log(`📱 Demo Version: ${websiteUrl}/demo`);
            console.log(`🔐 Login Page: ${websiteUrl}/login`);
            console.log('='.repeat(60));
            
            // Save deployment info
            const deploymentInfo = {
                frontendBucket: config.frontendBucket,
                websiteUrl: websiteUrl,
                filesUploaded: uploadCount,
                deploymentDate: new Date().toISOString(),
                status: 'success',
                type: 'complete-sysora-platform',
                features: [
                    'Landing Page',
                    'Hotel Dashboard',
                    'Admin Panel', 
                    'Demo Version',
                    'Login System',
                    'Reservation Management',
                    'Payment System (with overpayment)',
                    'Room Management',
                    'Guest Management',
                    'Reports & Analytics',
                    'Multi-tenant Architecture',
                    'Arabic Language Support',
                    'Responsive Design'
                ]
            };
            
            fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
            console.log('✅ Deployment info saved to deployment-info.json');
            
            // Wait for propagation
            console.log('\n⏳ Waiting 15 seconds for DNS propagation...');
            await new Promise(resolve => setTimeout(resolve, 15000));
            
            console.log('\n🎊 Sysora Platform is now live!');
            console.log(`🔗 Visit: ${websiteUrl}`);
            
            return websiteUrl;
            
        } else {
            console.log('❌ No files were uploaded');
        }
        
    } catch (error) {
        console.log(`❌ Deployment failed: ${error.message}`);
    }
}

// Get total directory size
async function getTotalSize(dirPath) {
    let totalSize = 0;
    
    function calculateSize(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                calculateSize(itemPath);
            } else {
                totalSize += stat.size;
            }
        }
    }
    
    calculateSize(dirPath);
    return (totalSize / 1024).toFixed(2);
}

// Run deployment
deployProject().then(url => {
    if (url) {
        console.log('\n🌟 SUCCESS! Complete Sysora Platform deployed successfully!');
        console.log('🏨 Hotel Management System is now available online!');
        console.log('🚀 Ready for production use!');
    }
}).catch(error => {
    console.log(`💥 Deployment error: ${error.message}`);
});
