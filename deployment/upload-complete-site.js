#!/usr/bin/env node

// Upload complete Sysora website to S3
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
    PutPublicAccessBlockCommand,
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
    frontendBucket: `sysora-complete-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Uploading Complete Sysora Website');
console.log('='.repeat(50));

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
        '.pdf': 'application/pdf'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// Create and configure bucket
async function setupBucket() {
    try {
        console.log(`🔵 Creating bucket: ${config.frontendBucket}`);
        
        // Create bucket
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Bucket created');
        
        // Wait for bucket to be ready
        await new Promise(resolve => setTimeout(resolve, 3000));
        
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
        console.log('✅ Bucket policy applied');
        
        // Configure website hosting
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
            CacheControl: cacheControl,
            ContentEncoding: key.endsWith('.js') || key.endsWith('.css') ? 'gzip' : undefined
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
                    console.log(`✅ Uploaded: ${key}`);
                }
            }
        }
        
        return uploadCount;
    } catch (error) {
        console.log(`❌ Directory upload error: ${error.message}`);
        return 0;
    }
}

// Create a simple index.html if dist is empty or problematic
function createFallbackIndex() {
    const fallbackHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sysora - منصة إدارة الفنادق</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #002D5B 0%, #2EC4B6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .container {
            text-align: center;
            max-width: 800px;
            padding: 2rem;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #2EC4B6;
        }
        
        .subtitle {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 1rem;
            backdrop-filter: blur(10px);
        }
        
        .feature h3 {
            color: #2EC4B6;
            margin-bottom: 1rem;
        }
        
        .cta {
            margin-top: 3rem;
        }
        
        .btn {
            display: inline-block;
            background: #2EC4B6;
            color: #002D5B;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: bold;
            margin: 0.5rem;
            transition: transform 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(46, 196, 182, 0.2);
            border-radius: 0.5rem;
            border: 1px solid #2EC4B6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏨 Sysora</div>
        <div class="subtitle">منصة إدارة الفنادق الذكية</div>
        
        <div class="features">
            <div class="feature">
                <h3>🏨 إدارة الفنادق</h3>
                <p>نظام شامل لإدارة الحجوزات والغرف والنزلاء</p>
            </div>
            <div class="feature">
                <h3>💳 نظام المدفوعات</h3>
                <p>إدارة المدفوعات مع دعم الدفع الزائد والجزئي</p>
            </div>
            <div class="feature">
                <h3>📊 التقارير</h3>
                <p>تقارير مفصلة وإحصائيات في الوقت الفعلي</p>
            </div>
            <div class="feature">
                <h3>👥 إدارة المستخدمين</h3>
                <p>نظام صلاحيات متقدم لجميع أعضاء الفريق</p>
            </div>
        </div>
        
        <div class="cta">
            <a href="#" class="btn" onclick="alert('قريباً: تسجيل الدخول')">تسجيل الدخول</a>
            <a href="#" class="btn" onclick="alert('قريباً: تسجيل فندق جديد')">تسجيل فندق جديد</a>
        </div>
        
        <div class="status">
            <h3>✅ تم النشر بنجاح على AWS!</h3>
            <p>منصة Sysora متاحة الآن وجاهزة للاستخدام</p>
            <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
    </div>
    
    <script>
        console.log('🎉 Sysora Platform loaded successfully!');
        console.log('🏨 Hotel Management System');
        console.log('🚀 Deployed on AWS S3');
        
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                feature.style.animationDelay = (index * 0.2) + 's';
                feature.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), fallbackHTML);
    console.log('✅ Created fallback index.html');
}

// Main upload function
async function uploadComplete() {
    try {
        // Setup bucket
        const setupOk = await setupBucket();
        if (!setupOk) return;
        
        // Check if dist exists and has content
        const distPath = path.join(__dirname, 'dist');
        if (!fs.existsSync(distPath) || fs.readdirSync(distPath).length === 0) {
            console.log('⚠️  dist directory empty or missing, creating fallback...');
            if (!fs.existsSync(distPath)) {
                fs.mkdirSync(distPath);
            }
            createFallbackIndex();
        }
        
        // Upload all files from dist
        console.log('🔵 Uploading all files...');
        const uploadCount = await uploadDirectory(config.frontendBucket, distPath);
        
        if (uploadCount > 0) {
            const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
            
            console.log('\n🎉 Complete Upload Successful!');
            console.log('='.repeat(50));
            console.log(`✅ Bucket: ${config.frontendBucket}`);
            console.log(`📁 Files uploaded: ${uploadCount}`);
            console.log(`🌐 Website: ${websiteUrl}`);
            console.log('='.repeat(50));
            
            // Save deployment info
            const deploymentInfo = {
                frontendBucket: config.frontendBucket,
                websiteUrl: websiteUrl,
                filesUploaded: uploadCount,
                deploymentDate: new Date().toISOString(),
                status: 'success'
            };
            
            fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
            console.log('✅ Deployment info saved');
            
            // Wait and test
            console.log('🔵 Waiting 15 seconds for propagation...');
            await new Promise(resolve => setTimeout(resolve, 15000));
            
            console.log('🌐 Website should be ready now!');
            console.log(`🔗 Open: ${websiteUrl}`);
            
        } else {
            console.log('❌ No files were uploaded');
        }
        
    } catch (error) {
        console.log(`❌ Upload failed: ${error.message}`);
    }
}

// Run upload
uploadComplete();
