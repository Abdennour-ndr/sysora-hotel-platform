#!/usr/bin/env node

// Fix S3 bucket permissions for Sysora Platform
import { 
    S3Client, 
    PutBucketPolicyCommand,
    PutPublicAccessBlockCommand,
    PutBucketAclCommand,
    GetBucketLocationCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';

// Read deployment info
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

async function fixBucketPermissions() {
    log.step(`Fixing permissions for bucket: ${bucketName}`);
    
    try {
        // Step 1: Remove public access block
        log.info('Removing public access block...');
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
        log.success('Public access block removed');
        
        // Step 2: Set bucket ACL to public-read
        log.info('Setting bucket ACL to public-read...');
        const aclCommand = new PutBucketAclCommand({
            Bucket: bucketName,
            ACL: 'public-read'
        });
        
        await s3Client.send(aclCommand);
        log.success('Bucket ACL set to public-read');
        
        // Step 3: Apply bucket policy for public read access
        log.info('Applying bucket policy...');
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
        log.success('Bucket policy applied successfully');
        
        log.step('✅ Permissions Fixed Successfully!');
        console.log(`🌐 Website should now be accessible at:`);
        console.log(`http://${bucketName}.s3-website-${config.region}.amazonaws.com`);
        
        return true;
        
    } catch (error) {
        log.error(`Failed to fix permissions: ${error.message}`);
        
        if (error.name === 'AccessDenied') {
            log.warning('Access denied - trying alternative approach...');
            return await tryAlternativeApproach();
        }
        
        return false;
    }
}

async function tryAlternativeApproach() {
    log.step('Trying Alternative Approach');
    
    try {
        // Just try to apply the bucket policy without changing ACL
        log.info('Applying bucket policy only...');
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
        log.success('Bucket policy applied via alternative approach');
        
        return true;
        
    } catch (error) {
        log.error(`Alternative approach failed: ${error.message}`);
        
        // Show manual instructions
        showManualInstructions();
        return false;
    }
}

function showManualInstructions() {
    log.step('Manual Configuration Required');
    
    console.log('🔧 Please follow these manual steps in AWS Console:');
    console.log('='.repeat(50));
    console.log('1. Go to: https://console.aws.amazon.com/s3/');
    console.log(`2. Find bucket: ${bucketName}`);
    console.log('3. Go to Permissions tab');
    console.log('4. Edit "Block public access" settings:');
    console.log('   - Uncheck all 4 options');
    console.log('   - Save changes');
    console.log('5. Edit "Bucket policy" and paste this:');
    console.log('');
    console.log(JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`
        }]
    }, null, 2));
    console.log('');
    console.log('6. Save the policy');
    console.log(`7. Test the website: http://${bucketName}.s3-website-us-east-1.amazonaws.com`);
    console.log('='.repeat(50));
}

// Run the fix
fixBucketPermissions();
