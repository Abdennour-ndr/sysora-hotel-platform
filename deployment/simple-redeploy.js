#!/usr/bin/env node

// Simple redeploy with fixed permissions
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
    frontendBucket: `sysora-working-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Starting Simple Redeploy');
console.log('='.repeat(50));

async function createAndConfigureBucket() {
    try {
        console.log(`🔵 Creating bucket: ${config.frontendBucket}`);
        
        // Create bucket
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Bucket created');
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Configure public access
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
        console.log('✅ Bucket policy set');
        
        // Configure website
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
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

async function uploadFiles() {
    try {
        console.log('🔵 Uploading files...');
        
        const distPath = path.join(__dirname, 'dist');
        const files = [
            'index.html',
            'assets/index-46d9b117.css',
            'assets/index-a9601cfb.js'
        ];
        
        for (const file of files) {
            const filePath = path.join(distPath, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath);
                let contentType = 'text/html';
                
                if (file.endsWith('.css')) contentType = 'text/css';
                if (file.endsWith('.js')) contentType = 'application/javascript';
                
                await s3Client.send(new PutObjectCommand({
                    Bucket: config.frontendBucket,
                    Key: file,
                    Body: content,
                    ContentType: contentType
                }));
                
                console.log(`✅ Uploaded: ${file}`);
            }
        }
        
        return true;
    } catch (error) {
        console.log(`❌ Upload error: ${error.message}`);
        return false;
    }
}

async function deploy() {
    try {
        const bucketOk = await createAndConfigureBucket();
        if (!bucketOk) return;
        
        const uploadOk = await uploadFiles();
        if (!uploadOk) return;
        
        const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n🎉 Deployment Successful!');
        console.log('='.repeat(50));
        console.log(`✅ Bucket: ${config.frontendBucket}`);
        console.log(`🌐 Website: ${websiteUrl}`);
        console.log('='.repeat(50));
        
        // Save info
        fs.writeFileSync('deployment-info.json', JSON.stringify({
            frontendBucket: config.frontendBucket,
            websiteUrl: websiteUrl,
            deploymentDate: new Date().toISOString()
        }, null, 2));
        
        console.log('✅ Deployment info saved');
        
        // Wait and test
        console.log('🔵 Waiting 10 seconds for propagation...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('🔗 Testing website...');
        
    } catch (error) {
        console.log(`❌ Deployment failed: ${error.message}`);
    }
}

deploy();
