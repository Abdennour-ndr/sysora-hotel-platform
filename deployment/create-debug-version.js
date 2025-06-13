#!/usr/bin/env node

// Create a debug version to identify the exact issue
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
    frontendBucket: `sysora-debug-${Date.now()}`
};

// Initialize S3 client
const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

console.log('🔍 Creating Debug Version to Identify Issues');
console.log('='.repeat(50));

// Create a comprehensive debug HTML
const createDebugHTML = () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sysora Debug - تشخيص المشاكل</title>
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
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: bold;
            color: #2EC4B6;
            margin-bottom: 1rem;
        }
        
        .debug-section {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            backdrop-filter: blur(10px);
        }
        
        .debug-title {
            color: #2EC4B6;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid #2EC4B6;
            padding-bottom: 0.5rem;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .status-label {
            font-weight: bold;
        }
        
        .status-value {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
        }
        
        .success { color: #4CAF50; }
        .error { color: #f44336; }
        .warning { color: #ff9800; }
        
        .test-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .test-btn {
            background: #2EC4B6;
            color: #002D5B;
            border: none;
            padding: 1rem;
            border-radius: 0.5rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .test-btn:hover {
            background: #26a69a;
            transform: translateY(-2px);
        }
        
        .console-output {
            background: #000;
            color: #0f0;
            padding: 1rem;
            border-radius: 0.5rem;
            font-family: monospace;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 1rem;
        }
        
        .asset-test {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .asset-item {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔍 Sysora Debug</div>
            <p>تشخيص شامل لمشاكل النشر</p>
        </div>

        <div class="debug-section">
            <h2 class="debug-title">📊 معلومات الموقع</h2>
            <div class="status-item">
                <span class="status-label">URL الحالي:</span>
                <span class="status-value" id="current-url"></span>
            </div>
            <div class="status-item">
                <span class="status-label">التاريخ والوقت:</span>
                <span class="status-value" id="current-time"></span>
            </div>
            <div class="status-item">
                <span class="status-label">User Agent:</span>
                <span class="status-value" id="user-agent"></span>
            </div>
            <div class="status-item">
                <span class="status-label">Screen Size:</span>
                <span class="status-value" id="screen-size"></span>
            </div>
        </div>

        <div class="debug-section">
            <h2 class="debug-title">🔧 اختبار تحميل الملفات</h2>
            <div class="asset-test">
                <div class="asset-item">
                    <h3>CSS Files</h3>
                    <div id="css-status">جاري الفحص...</div>
                </div>
                <div class="asset-item">
                    <h3>JavaScript Files</h3>
                    <div id="js-status">جاري الفحص...</div>
                </div>
                <div class="asset-item">
                    <h3>Images</h3>
                    <div id="img-status">جاري الفحص...</div>
                </div>
            </div>
        </div>

        <div class="debug-section">
            <h2 class="debug-title">🌐 اختبار الشبكة</h2>
            <div class="test-buttons">
                <button class="test-btn" onclick="testAssets()">اختبار الملفات</button>
                <button class="test-btn" onclick="testRouting()">اختبار التوجيه</button>
                <button class="test-btn" onclick="testConsole()">فحص Console</button>
                <button class="test-btn" onclick="testPerformance()">فحص الأداء</button>
            </div>
            <div class="console-output" id="console-output">
                <div>🔍 Debug Console - جاهز للاختبار</div>
            </div>
        </div>

        <div class="debug-section">
            <h2 class="debug-title">📋 تقرير المشاكل</h2>
            <div id="issues-report">
                <div class="status-item">
                    <span class="status-label">حالة HTML:</span>
                    <span class="status-value success">✅ يعمل</span>
                </div>
                <div class="status-item">
                    <span class="status-label">حالة CSS:</span>
                    <span class="status-value" id="css-report">جاري الفحص...</span>
                </div>
                <div class="status-item">
                    <span class="status-label">حالة JavaScript:</span>
                    <span class="status-value" id="js-report">جاري الفحص...</span>
                </div>
                <div class="status-item">
                    <span class="status-label">حالة React:</span>
                    <span class="status-value" id="react-report">جاري الفحص...</span>
                </div>
            </div>
        </div>

        <div class="debug-section">
            <h2 class="debug-title">🔗 روابط الاختبار</h2>
            <div class="test-buttons">
                <button class="test-btn" onclick="testRoute('/hotel')">اختبار /hotel</button>
                <button class="test-btn" onclick="testRoute('/admin')">اختبار /admin</button>
                <button class="test-btn" onclick="testRoute('/demo')">اختبار /demo</button>
                <button class="test-btn" onclick="testRoute('/login')">اختبار /login</button>
            </div>
        </div>
    </div>

    <script>
        // Initialize debug info
        document.addEventListener('DOMContentLoaded', function() {
            // Basic info
            document.getElementById('current-url').textContent = window.location.href;
            document.getElementById('current-time').textContent = new Date().toLocaleString('ar-SA');
            document.getElementById('user-agent').textContent = navigator.userAgent.substring(0, 50) + '...';
            document.getElementById('screen-size').textContent = screen.width + 'x' + screen.height;
            
            // Auto-run tests
            setTimeout(runAutoTests, 1000);
        });

        function log(message, type = 'info') {
            const output = document.getElementById('console-output');
            const timestamp = new Date().toLocaleTimeString('ar-SA');
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : '';
            output.innerHTML += \`<div class="\${className}">[\${timestamp}] \${message}</div>\`;
            output.scrollTop = output.scrollHeight;
        }

        function runAutoTests() {
            log('🔍 بدء الاختبارات التلقائية...', 'info');
            
            // Test CSS
            const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            if (cssLinks.length === 0) {
                log('❌ لم يتم العثور على ملفات CSS', 'error');
                document.getElementById('css-report').innerHTML = '<span class="error">❌ مفقود</span>';
            } else {
                log(\`✅ تم العثور على \${cssLinks.length} ملف CSS\`, 'success');
                document.getElementById('css-report').innerHTML = '<span class="success">✅ موجود</span>';
            }
            
            // Test JavaScript
            const jsScripts = document.querySelectorAll('script[src]');
            if (jsScripts.length === 0) {
                log('❌ لم يتم العثور على ملفات JavaScript خارجية', 'error');
                document.getElementById('js-report').innerHTML = '<span class="error">❌ مفقود</span>';
            } else {
                log(\`✅ تم العثور على \${jsScripts.length} ملف JavaScript\`, 'success');
                document.getElementById('js-report').innerHTML = '<span class="success">✅ موجود</span>';
            }
            
            // Test React
            if (typeof React !== 'undefined') {
                log('✅ React محمل بنجاح', 'success');
                document.getElementById('react-report').innerHTML = '<span class="success">✅ يعمل</span>';
            } else {
                log('❌ React غير محمل', 'error');
                document.getElementById('react-report').innerHTML = '<span class="error">❌ غير محمل</span>';
            }
            
            // Test console errors
            const originalError = console.error;
            let errorCount = 0;
            console.error = function(...args) {
                errorCount++;
                log(\`❌ Console Error: \${args.join(' ')}\`, 'error');
                originalError.apply(console, args);
            };
            
            setTimeout(() => {
                if (errorCount === 0) {
                    log('✅ لا توجد أخطاء في Console', 'success');
                } else {
                    log(\`❌ تم العثور على \${errorCount} أخطاء في Console\`, 'error');
                }
            }, 3000);
        }

        function testAssets() {
            log('🔍 اختبار تحميل الملفات...', 'info');
            
            // Test CSS files
            const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            cssLinks.forEach((link, index) => {
                const testLink = document.createElement('link');
                testLink.rel = 'stylesheet';
                testLink.href = link.href + '?test=' + Date.now();
                testLink.onload = () => log(\`✅ CSS \${index + 1} تم تحميله بنجاح\`, 'success');
                testLink.onerror = () => log(\`❌ CSS \${index + 1} فشل في التحميل: \${link.href}\`, 'error');
                document.head.appendChild(testLink);
            });
            
            // Test JS files
            const jsScripts = document.querySelectorAll('script[src]');
            jsScripts.forEach((script, index) => {
                fetch(script.src)
                    .then(response => {
                        if (response.ok) {
                            log(\`✅ JS \${index + 1} متاح: \${script.src}\`, 'success');
                        } else {
                            log(\`❌ JS \${index + 1} غير متاح: \${response.status}\`, 'error');
                        }
                    })
                    .catch(error => {
                        log(\`❌ JS \${index + 1} خطأ في التحميل: \${error.message}\`, 'error');
                    });
            });
        }

        function testRouting() {
            log('🔍 اختبار نظام التوجيه...', 'info');
            
            const routes = ['/hotel', '/admin', '/demo', '/login'];
            routes.forEach(route => {
                const testUrl = window.location.origin + route;
                fetch(testUrl)
                    .then(response => {
                        if (response.ok) {
                            log(\`✅ Route \${route}: متاح\`, 'success');
                        } else {
                            log(\`❌ Route \${route}: \${response.status}\`, 'error');
                        }
                    })
                    .catch(error => {
                        log(\`❌ Route \${route}: \${error.message}\`, 'error');
                    });
            });
        }

        function testConsole() {
            log('🔍 فحص Console للأخطاء...', 'info');
            
            // Check for common errors
            const commonErrors = [
                'Failed to load resource',
                'Uncaught ReferenceError',
                'Uncaught TypeError',
                'Module not found',
                'Cannot read property'
            ];
            
            // This is a simulation - in real scenario, errors would be caught
            log('ℹ️  للحصول على أخطاء Console الفعلية، افتح Developer Tools (F12)', 'info');
            log('ℹ️  ابحث عن الأخطاء التالية:', 'info');
            commonErrors.forEach(error => {
                log(\`   - \${error}\`, 'info');
            });
        }

        function testPerformance() {
            log('🔍 فحص الأداء...', 'info');
            
            const loadTime = performance.now();
            log(\`⏱️  وقت التحميل: \${loadTime.toFixed(2)}ms\`, 'info');
            
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                log(\`📊 DOM Content Loaded: \${navigation.domContentLoadedEventEnd.toFixed(2)}ms\`, 'info');
                log(\`📊 Load Complete: \${navigation.loadEventEnd.toFixed(2)}ms\`, 'info');
            }
            
            const resources = performance.getEntriesByType('resource');
            log(\`📁 عدد الموارد المحملة: \${resources.length}\`, 'info');
            
            resources.forEach(resource => {
                const duration = resource.responseEnd - resource.requestStart;
                const status = duration < 1000 ? 'success' : 'warning';
                log(\`📄 \${resource.name.split('/').pop()}: \${duration.toFixed(2)}ms\`, status);
            });
        }

        function testRoute(route) {
            log(\`🔍 اختبار route: \${route}\`, 'info');
            
            const testUrl = window.location.origin + route;
            window.open(testUrl, '_blank');
            log(\`🔗 تم فتح \${route} في نافذة جديدة\`, 'info');
        }

        // Global error handler
        window.addEventListener('error', function(event) {
            log(\`❌ Global Error: \${event.message} at \${event.filename}:\${event.lineno}\`, 'error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', function(event) {
            log(\`❌ Unhandled Promise Rejection: \${event.reason}\`, 'error');
        });

        log('🎉 Debug system initialized successfully!', 'success');
    </script>
</body>
</html>`;
};

async function deployDebugVersion() {
    try {
        console.log('🔧 Creating debug bucket...');
        
        // Create bucket
        await s3Client.send(new CreateBucketCommand({
            Bucket: config.frontendBucket
        }));
        console.log('✅ Debug bucket created');
        
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
        
        // Upload debug HTML
        const debugHTML = createDebugHTML();
        await s3Client.send(new PutObjectCommand({
            Bucket: config.frontendBucket,
            Key: 'index.html',
            Body: debugHTML,
            ContentType: 'text/html; charset=utf-8'
        }));
        console.log('✅ Debug HTML uploaded');
        
        const websiteUrl = `http://${config.frontendBucket}.s3-website-${config.region}.amazonaws.com`;
        
        console.log('\n🔍 Debug Version Deployed!');
        console.log('='.repeat(60));
        console.log(`🌐 Debug URL: ${websiteUrl}`);
        console.log('='.repeat(60));
        
        console.log('\n📋 هذا الموقع سيساعد في:');
        console.log('✅ تشخيص مشاكل تحميل الملفات');
        console.log('✅ فحص أخطاء JavaScript');
        console.log('✅ اختبار نظام التوجيه');
        console.log('✅ قياس الأداء');
        console.log('✅ تحديد السبب الدقيق للمشكلة');
        
        // Save debug info
        fs.writeFileSync('debug-deployment.json', JSON.stringify({
            debugBucket: config.frontendBucket,
            debugUrl: websiteUrl,
            deploymentDate: new Date().toISOString(),
            purpose: 'comprehensive-debugging'
        }, null, 2));
        
        console.log('\n⏳ Waiting 10 seconds for propagation...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        console.log(`🔗 Visit debug site: ${websiteUrl}`);
        
        return websiteUrl;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return null;
    }
}

deployDebugVersion().then(url => {
    if (url) {
        console.log('\n🎯 Debug version ready for analysis!');
        console.log('🔍 Use this to identify the exact issue with your main site.');
    }
});
