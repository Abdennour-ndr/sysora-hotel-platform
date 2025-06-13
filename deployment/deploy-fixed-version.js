#!/usr/bin/env node

// Deploy the fixed version with correct paths
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
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
    frontendBucket: `sysora-fixed-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🔧 Deploying Fixed Sysora Platform');
console.log('='.repeat(50));
console.log(`📦 New Bucket: ${config.frontendBucket}`);

// Get content type
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

async function deployFixed() {
    try {
        // Create bucket
        console.log('🔧 Creating new bucket...');
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Bucket created');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
        
        // Upload files
        console.log('\n📤 Uploading files...');
        const distPath = path.join(__dirname, 'dist');
        
        // Upload index.html
        const htmlContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'index.html',
            Body: htmlContent,
            ContentType: 'text/html; charset=utf-8',
            CacheControl: 'public, max-age=0, must-revalidate'
        }));
        console.log('✅ Uploaded: index.html');
        
        // Upload CSS
        const cssContent = fs.readFileSync(path.join(distPath, 'assets', 'index-46d9b117.css'));
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'assets/index-46d9b117.css',
            Body: cssContent,
            ContentType: 'text/css; charset=utf-8',
            CacheControl: 'public, max-age=31536000'
        }));
        console.log('✅ Uploaded: assets/index-46d9b117.css');
        
        // Upload JS
        const jsContent = fs.readFileSync(path.join(distPath, 'assets', 'index-a9601cfb.js'));
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'assets/index-a9601cfb.js',
            Body: jsContent,
            ContentType: 'application/javascript; charset=utf-8',
            CacheControl: 'public, max-age=31536000'
        }));
        console.log('✅ Uploaded: assets/index-a9601cfb.js');
        
        const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n🎉 Fixed Version Deployed Successfully!');
        console.log('='.repeat(60));
        console.log(`✅ Bucket: ${config.frontendBucket}`);
        console.log(`📁 Files uploaded: 3`);
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
            filesUploaded: 3,
            deploymentDate: new Date().toISOString(),
            status: 'success',
            type: 'fixed-sysora-platform',
            pathsFixed: true
        };
        
        fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
        console.log('✅ Deployment info saved');
        
        console.log('\n⏳ Waiting 15 seconds for propagation...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        console.log('🎊 Fixed Sysora Platform is now live!');
        console.log(`🔗 Visit: ${websiteUrl}`);
        
        return websiteUrl;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return null;
    }
}

deployFixed().then(url => {
    if (url) {
        console.log('\n🌟 SUCCESS! Fixed version deployed successfully!');
        console.log('🏨 Sysora Platform should now load correctly!');
    }
});
