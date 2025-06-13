#!/usr/bin/env node

// Create and upload full Sysora website
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
    frontendBucket: `sysora-full-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🚀 Creating Full Sysora Website');
console.log('='.repeat(50));

// Create complete HTML content
const createIndexHTML = () => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sysora - منصة إدارة الفنادق الذكية</title>
    <link rel="stylesheet" href="./styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                <span class="logo">🏨 Sysora</span>
            </div>
            <div class="nav-links">
                <a href="#features">الميزات</a>
                <a href="#pricing">الأسعار</a>
                <a href="#contact">اتصل بنا</a>
                <a href="./login.html" class="btn-primary">تسجيل الدخول</a>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">منصة إدارة الفنادق الذكية</h1>
                <p class="hero-subtitle">نظام شامل لإدارة الحجوزات، الغرف، المدفوعات والتقارير</p>
                <div class="hero-buttons">
                    <a href="./register.html" class="btn-primary large">ابدأ مجاناً</a>
                    <a href="./demo.html" class="btn-secondary large">شاهد العرض التوضيحي</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2 class="section-title">ميزات المنصة</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🏨</div>
                    <h3>إدارة الفنادق</h3>
                    <p>نظام شامل لإدارة معلومات الفندق والغرف والخدمات</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📅</div>
                    <h3>نظام الحجوزات</h3>
                    <p>إدارة الحجوزات مع تتبع الحالة والتواريخ</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💳</div>
                    <h3>نظام المدفوعات</h3>
                    <p>إدارة المدفوعات مع دعم الدفع الجزئي والزائد</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3>إدارة النزلاء</h3>
                    <p>قاعدة بيانات شاملة للنزلاء وتاريخ الإقامة</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>التقارير والإحصائيات</h3>
                    <p>تقارير مفصلة وإحصائيات في الوقت الفعلي</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>الأمان والحماية</h3>
                    <p>نظام أمان متقدم مع تشفير البيانات</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Status Section -->
    <section class="status">
        <div class="container">
            <div class="status-card">
                <h2>✅ تم النشر بنجاح على AWS!</h2>
                <p>منصة Sysora متاحة الآن وجاهزة للاستخدام</p>
                <div class="status-info">
                    <div class="status-item">
                        <strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}
                    </div>
                    <div class="status-item">
                        <strong>الحالة:</strong> <span class="status-active">نشط</span>
                    </div>
                    <div class="status-item">
                        <strong>الخادم:</strong> AWS S3
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <span class="logo">🏨 Sysora</span>
                    <p>منصة إدارة الفنادق الذكية</p>
                </div>
                <div class="footer-links">
                    <div class="footer-section">
                        <h4>المنصة</h4>
                        <a href="./features.html">الميزات</a>
                        <a href="./pricing.html">الأسعار</a>
                        <a href="./demo.html">العرض التوضيحي</a>
                    </div>
                    <div class="footer-section">
                        <h4>الدعم</h4>
                        <a href="./help.html">المساعدة</a>
                        <a href="./contact.html">اتصل بنا</a>
                        <a href="./docs.html">التوثيق</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Sysora. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    </footer>

    <script src="./script.js"></script>
</body>
</html>`;

// Create CSS styles
const createCSS = () => `/* Sysora Platform Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #002D5B;
    --secondary-color: #2EC4B6;
    --light-color: #F9FAFB;
    --text-color: #333;
    --border-radius: 1rem;
}

body {
    font-family: 'Inter', 'Poppins', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--light-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header */
.header {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: var(--secondary-color);
}

/* Buttons */
.btn-primary, .btn-secondary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: var(--secondary-color);
    color: var(--primary-color);
}

.btn-primary:hover {
    background: #26a69a;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
}

.large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 8rem 0 4rem;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Features Section */
.features {
    padding: 4rem 0;
    background: white;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 3rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: var(--light-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    transition: transform 0.3s ease;
    border: 1px solid #e0e0e0;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

/* Status Section */
.status {
    padding: 4rem 0;
    background: var(--light-color);
}

.status-card {
    background: white;
    padding: 3rem;
    border-radius: var(--border-radius);
    text-align: center;
    border: 2px solid var(--secondary-color);
}

.status-card h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.status-info {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

.status-item {
    padding: 0.5rem 1rem;
    background: var(--light-color);
    border-radius: 0.5rem;
}

.status-active {
    color: #4CAF50;
    font-weight: bold;
}

/* Footer */
.footer {
    background: var(--primary-color);
    color: white;
    padding: 3rem 0 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    margin-bottom: 2rem;
}

.footer-brand .logo {
    color: var(--secondary-color);
    margin-bottom: 1rem;
    display: block;
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
}

.footer-section h4 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.footer-section a {
    display: block;
    color: white;
    text-decoration: none;
    margin-bottom: 0.5rem;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.footer-section a:hover {
    opacity: 1;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .hero {
        padding: 6rem 0 3rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .status-info {
        flex-direction: column;
        align-items: center;
    }
}

/* Animations */
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

.feature-card {
    animation: fadeInUp 0.6s ease forwards;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }`;

// Create JavaScript
const createJS = () => `// Sysora Platform JavaScript
console.log('🎉 Sysora Platform loaded successfully!');
console.log('🏨 Hotel Management System');
console.log('🚀 Deployed on AWS S3');

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add click handlers for demo buttons
    document.querySelectorAll('a[href*="demo"], a[href*="register"], a[href*="login"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            alert(\`قريباً: \${action}\nمنصة Sysora قيد التطوير النهائي\`);
        });
    });
    
    // Update status with real-time info
    const statusItems = document.querySelectorAll('.status-item');
    if (statusItems.length > 0) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA');
        
        // Add real-time clock
        setInterval(() => {
            const currentTime = new Date().toLocaleTimeString('ar-SA');
            const timeElement = document.querySelector('.status-time');
            if (timeElement) {
                timeElement.textContent = currentTime;
            }
        }, 1000);
    }
    
    // Add some interactive effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add some utility functions
window.SysoraUtils = {
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = \`notification \${type}\`;
        notification.textContent = message;
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        \`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: 'DZD'
        }).format(amount);
    }
};

// Show welcome message
setTimeout(() => {
    if (window.SysoraUtils) {
        window.SysoraUtils.showNotification('مرحباً بك في منصة Sysora! 🎉');
    }
}, 2000);`;

async function createAndUpload() {
    try {
        console.log('🔵 Setting up bucket...');
        
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
                Resource: \`arn:aws:s3:::\${config.frontendBucket}/*\`
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
        
        // Upload files
        console.log('🔵 Uploading website files...');
        
        const files = [
            { key: 'index.html', content: createIndexHTML(), type: 'text/html; charset=utf-8' },
            { key: 'styles.css', content: createCSS(), type: 'text/css; charset=utf-8' },
            { key: 'script.js', content: createJS(), type: 'application/javascript; charset=utf-8' }
        ];
        
        for (const file of files) {
            await s3Client.send(new PutObjectCommand({
                Bucket: config.frontendBucket,
                Key: file.key,
                Body: file.content,
                ContentType: file.type,
                CacheControl: file.key.endsWith('.html') ? 'no-cache' : 'public, max-age=31536000'
            }));
            console.log(\`✅ Uploaded: \${file.key}\`);
        }
        
        const websiteUrl = \`http://\${config.frontendBucket}.s3-website-\${config.region}.amazonaws.com\`;
        
        console.log('\\n🎉 Full Website Deployed Successfully!');
        console.log('='.repeat(50));
        console.log(\`✅ Bucket: \${config.frontendBucket}\`);
        console.log(\`📁 Files: \${files.length}\`);
        console.log(\`🌐 Website: \${websiteUrl}\`);
        console.log('='.repeat(50));
        
        // Save deployment info
        fs.writeFileSync('deployment-info.json', JSON.stringify({
            frontendBucket: config.frontendBucket,
            websiteUrl: websiteUrl,
            filesUploaded: files.length,
            deploymentDate: new Date().toISOString(),
            status: 'success',
            type: 'full-website'
        }, null, 2));
        
        console.log('✅ Deployment info saved');
        console.log('🔵 Waiting 10 seconds for propagation...');
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log(\`🌐 Website ready: \${websiteUrl}\`);
        
    } catch (error) {
        console.log(\`❌ Error: \${error.message}\`);
    }
}

createAndUpload();`;

<function_calls>
<invoke name="launch-process">
<parameter name="command">node create-full-website.js
