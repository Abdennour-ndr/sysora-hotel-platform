#!/usr/bin/env node

// Deploy working Sysora website
import { 
    S3Client, 
    CreateBucketCommand, 
    PutObjectCommand, 
    PutBucketPolicyCommand,
    PutBucketWebsiteCommand,
    PutPublicAccessBlockCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';

// Configuration
const config = {
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-aws-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-aws-secret-access-key',
    frontendBucket: `sysora-final-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Deploying Working Sysora Website');
console.log('='.repeat(50));

// HTML content
const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sysora - منصة إدارة الفنادق الذكية</title>
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
            color: white;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }
        
        .nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #2EC4B6;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #2EC4B6;
        }
        
        .main {
            padding-top: 100px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            text-align: center;
        }
        
        .hero-title {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #2EC4B6;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 3rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 1rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .feature h3 {
            color: #2EC4B6;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .feature p {
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin: 3rem 0;
        }
        
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            font-size: 1.1rem;
        }
        
        .btn-primary {
            background: #2EC4B6;
            color: #002D5B;
        }
        
        .btn-primary:hover {
            background: #26a69a;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        
        .btn-secondary:hover {
            background: white;
            color: #002D5B;
        }
        
        .status {
            background: rgba(46, 196, 182, 0.2);
            border: 2px solid #2EC4B6;
            border-radius: 1rem;
            padding: 2rem;
            margin: 3rem 0;
            backdrop-filter: blur(10px);
        }
        
        .status h2 {
            color: #2EC4B6;
            margin-bottom: 1rem;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .status-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
        }
        
        .status-label {
            font-weight: bold;
            color: #2EC4B6;
        }
        
        .footer {
            background: rgba(0, 0, 0, 0.3);
            padding: 2rem 0;
            margin-top: 4rem;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-subtitle {
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .nav {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
        
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
        
        .feature {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .feature:nth-child(1) { animation-delay: 0.1s; }
        .feature:nth-child(2) { animation-delay: 0.2s; }
        .feature:nth-child(3) { animation-delay: 0.3s; }
        .feature:nth-child(4) { animation-delay: 0.4s; }
        .feature:nth-child(5) { animation-delay: 0.5s; }
        .feature:nth-child(6) { animation-delay: 0.6s; }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">🏨 Sysora</div>
            <ul class="nav-links">
                <li><a href="#features">الميزات</a></li>
                <li><a href="#status">الحالة</a></li>
                <li><a href="#contact">اتصل بنا</a></li>
            </ul>
        </nav>
    </header>

    <main class="main">
        <div class="container">
            <h1 class="hero-title">🏨 منصة Sysora</h1>
            <p class="hero-subtitle">منصة إدارة الفنادق الذكية - نظام شامل لإدارة الحجوزات والمدفوعات والتقارير</p>
            
            <div class="features" id="features">
                <div class="feature">
                    <div class="feature-icon">🏨</div>
                    <h3>إدارة الفنادق</h3>
                    <p>نظام شامل لإدارة معلومات الفندق والغرف والخدمات مع واجهة سهلة الاستخدام</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <h3>نظام الحجوزات</h3>
                    <p>إدارة الحجوزات مع تتبع الحالة والتواريخ وإشعارات تلقائية</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💳</div>
                    <h3>نظام المدفوعات</h3>
                    <p>إدارة المدفوعات مع دعم الدفع الجزئي والزائد وتقارير مالية مفصلة</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">👥</div>
                    <h3>إدارة النزلاء</h3>
                    <p>قاعدة بيانات شاملة للنزلاء مع تاريخ الإقامة والتفضيلات</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>التقارير والإحصائيات</h3>
                    <p>تقارير مفصلة وإحصائيات في الوقت الفعلي لاتخاذ قرارات مدروسة</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <h3>الأمان والحماية</h3>
                    <p>نظام أمان متقدم مع تشفير البيانات وصلاحيات متعددة المستويات</p>
                </div>
            </div>
            
            <div class="buttons">
                <button class="btn btn-primary" onclick="showDemo()">شاهد العرض التوضيحي</button>
                <button class="btn btn-secondary" onclick="startTrial()">ابدأ تجربة مجانية</button>
            </div>
            
            <div class="status" id="status">
                <h2>✅ تم النشر بنجاح على AWS!</h2>
                <p>منصة Sysora متاحة الآن وجاهزة للاستخدام</p>
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-label">التاريخ</div>
                        <div id="deploy-date">${new Date().toLocaleDateString('ar-SA')}</div>
                    </div>
                    <div class="status-item">
                        <div class="status-label">الوقت</div>
                        <div id="deploy-time">${new Date().toLocaleTimeString('ar-SA')}</div>
                    </div>
                    <div class="status-item">
                        <div class="status-label">الحالة</div>
                        <div style="color: #4CAF50; font-weight: bold;">نشط</div>
                    </div>
                    <div class="status-item">
                        <div class="status-label">الخادم</div>
                        <div>AWS S3</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Sysora - منصة إدارة الفنادق الذكية. جميع الحقوق محفوظة.</p>
        </div>
    </footer>

    <script>
        console.log('🎉 Sysora Platform loaded successfully!');
        console.log('🏨 Hotel Management System');
        console.log('🚀 Deployed on AWS S3');
        
        function showDemo() {
            alert('🎬 العرض التوضيحي\\n\\nمنصة Sysora تتضمن:\\n\\n🏨 إدارة الفنادق الكاملة\\n📅 نظام الحجوزات المتقدم\\n💳 نظام المدفوعات (مع الدفع الزائد!)\\n👥 إدارة النزلاء\\n📊 التقارير والإحصائيات\\n🔒 الأمان والحماية\\n\\n✅ جاهز للاستخدام الفوري!');
        }
        
        function startTrial() {
            alert('🚀 التجربة المجانية\\n\\nيمكنك الآن:\\n\\n✅ تسجيل فندقك مجاناً\\n✅ إدارة الحجوزات\\n✅ تتبع المدفوعات\\n✅ إنشاء التقارير\\n\\n💰 مجاني لأول 30 يوم\\n\\nقريباً: نظام التسجيل الكامل!');
        }
        
        // Update time every second
        setInterval(() => {
            document.getElementById('deploy-time').textContent = new Date().toLocaleTimeString('ar-SA');
        }, 1000);
        
        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Show welcome message
        setTimeout(() => {
            console.log('🎊 مرحباً بك في منصة Sysora!');
        }, 2000);
    </script>
</body>
</html>`;

async function deployWebsite() {
    try {
        console.log(`🔵 Creating bucket: ${config.frontendBucket}`);
        
        // Create bucket
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Bucket created');
        
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
        
        // Upload HTML file
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'index.html',
            Body: htmlContent,
            ContentType: 'text/html; charset=utf-8',
            CacheControl: 'no-cache'
        }));
        console.log('✅ Uploaded: index.html');
        
        const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n🎉 Website Deployed Successfully!');
        console.log('='.repeat(50));
        console.log(`✅ Bucket: ${config.frontendBucket}`);
        console.log(`🌐 Website: ${websiteUrl}`);
        console.log('='.repeat(50));
        
        // Save deployment info
        fs.writeFileSync('deployment-info.json', JSON.stringify({
            frontendBucket: config.frontendBucket,
            websiteUrl: websiteUrl,
            deploymentDate: new Date().toISOString(),
            status: 'success',
            type: 'complete-working-site'
        }, null, 2));
        
        console.log('✅ Deployment info saved');
        console.log('🔵 Waiting 10 seconds for propagation...');
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log(`🌐 Website ready: ${websiteUrl}`);
        
        return websiteUrl;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return null;
    }
}

deployWebsite().then(url => {
    if (url) {
        console.log(`\n🎊 SUCCESS! Sysora website is live at: ${url}`);
    }
});
