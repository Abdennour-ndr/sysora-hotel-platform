#!/usr/bin/env node

// Fix and redeploy the corrected files
import { 
    S3Client, 
    PutObjectCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the bucket name from deployment info
const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
const bucketName = deploymentInfo.frontendBucket;

// Configuration
const config = {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-aws-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-aws-secret-access-key'
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🔧 Fixing and redeploying corrected files...');
console.log(`📦 Bucket: ${bucketName}`);

async function uploadCorrectedFile() {
    try {
        // Upload the corrected index.html
        const htmlContent = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');
        
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: 'index.html',
            Body: htmlContent,
            ContentType: 'text/html; charset=utf-8',
            CacheControl: 'public, max-age=0, must-revalidate'
        }));
        
        console.log('✅ Corrected index.html uploaded successfully');
        
        const websiteUrl = `http://${bucketName}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n🎉 Fix Applied Successfully!');
        console.log('='.repeat(50));
        console.log(`🌐 Website: ${websiteUrl}`);
        console.log('='.repeat(50));
        
        console.log('⏳ Waiting 10 seconds for propagation...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log('✅ Website should now load correctly!');
        console.log(`🔗 Test: ${websiteUrl}`);
        
        return websiteUrl;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return null;
    }
}

uploadCorrectedFile().then(url => {
    if (url) {
        console.log('\n🎊 SUCCESS! Sysora Platform should now work correctly!');
    }
});
