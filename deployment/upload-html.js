#!/usr/bin/env node

// Simple HTML upload to S3
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
    PutPublicAccessBlockCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';

const config = {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-aws-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-aws-secret-access-key',
    frontendBucket: `sysora-live-${Date.now()}`
};

const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Uploading Sysora Website');

async function upload() {
    try {
        // Create bucket
        console.log('Creating bucket...');
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Configure public access
        console.log('Configuring public access...');
        await s3Client.send(new PutPublicAccessBlockCommand({
            Bucket: config.frontendBucket,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false,
                RestrictPublicBuckets: false
            }
        }));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set bucket policy
        console.log('Setting bucket policy...');
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
        
        // Configure website hosting
        console.log('Configuring website hosting...');
        await s3Client.send(new PutBucketWebsiteCommand({
            Bucket: config.frontendBucket,
            WebsiteConfiguration: {
                IndexDocument: { Suffix: 'index.html' },
                ErrorDocument: { Key: 'index.html' }
            }
        }));
        
        // Upload HTML file
        console.log('Uploading HTML file...');
        const htmlContent = fs.readFileSync('sysora-website.html', 'utf8');
        
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'index.html',
            Body: htmlContent,
            ContentType: 'text/html; charset=utf-8'
        }));
        
        const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n✅ SUCCESS!');
        console.log('='.repeat(50));
        console.log(`Bucket: ${config.frontendBucket}`);
        console.log(`Website: ${websiteUrl}`);
        console.log('='.repeat(50));
        
        // Save info
        fs.writeFileSync('deployment-info.json', JSON.stringify({
            frontendBucket: config.frontendBucket,
            websiteUrl: websiteUrl,
            deploymentDate: new Date().toISOString(),
            status: 'success'
        }, null, 2));
        
        console.log('Waiting 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log(`Ready: ${websiteUrl}`);
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

upload();
