const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Configure AWS
const s3 = new AWS.S3({
  region: 'us-east-1'
});

const BUCKET_NAME = 'sysora-platform-1748817495052';
const DIST_FOLDER = './dist';

// Function to upload a file
async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    console.log(`✅ Uploaded: ${key}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${key}:`, error);
    throw error;
  }
}

// Function to upload directory recursively
async function uploadDirectory(dirPath, prefix = '') {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, path.join(prefix, file));
    } else {
      const key = path.join(prefix, file).replace(/\\/g, '/');
      await uploadFile(filePath, key);
    }
  }
}

// Main deployment function
async function deploy() {
  try {
    console.log('🚀 Starting deployment to S3...');
    console.log(`📦 Bucket: ${BUCKET_NAME}`);
    console.log(`📁 Source: ${DIST_FOLDER}`);
    
    if (!fs.existsSync(DIST_FOLDER)) {
      console.error('❌ Dist folder not found. Please run "npm run build" first.');
      process.exit(1);
    }
    
    await uploadDirectory(DIST_FOLDER);
    
    console.log('🎉 Deployment completed successfully!');
    console.log(`🌐 Website URL: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deploy();
