# 📋 خطوات النشر التفاعلية - Sysora Platform

## 🎯 الحالة الحالية
✅ **تم إنجازه:**
- مستودع Git محلي جاهز
- ملفات المشروع منظمة
- إعدادات Fly.io جاهزة
- GitHub Actions معد
- الوثائق كاملة

## 🚀 الخطوات التالية

### الخطوة 1: إنشاء مستودع GitHub

#### أ) اذهب إلى GitHub
1. افتح [GitHub.com](https://github.com)
2. سجل الدخول إلى حسابك
3. انقر على **"New"** أو **"+"** → **"New repository"**

#### ب) إعدادات المستودع
```
Repository name: sysora-hotel-platform
Description: 🏨 Complete Hotel Management SaaS Platform with React & Node.js
Visibility: ✅ Public (أو Private حسب الحاجة)

❌ لا تضع ✓ في:
- Add a README file
- Add .gitignore  
- Choose a license
```

#### ج) إنشاء المستودع
- انقر **"Create repository"**
- ستحصل على صفحة بها URL مثل:
  `https://github.com/YOUR_USERNAME/sysora-hotel-platform.git`

### الخطوة 2: ربط المستودع المحلي

#### نسخ URL المستودع
بعد إنشاء المستودع، انسخ الـ URL من GitHub وشغل هذه الأوامر:

```bash
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك
git remote add origin https://github.com/YOUR_USERNAME/sysora-hotel-platform.git

# تحديد الفرع الرئيسي
git branch -M main

# رفع الكود لأول مرة
git push -u origin main
```

### الخطوة 3: التحقق من الرفع

```bash
# التحقق من الـ remote
git remote -v

# عرض حالة Git
git status

# عرض آخر commits
git log --oneline -5
```

### الخطوة 4: إعداد Fly.io

#### أ) تثبيت Fly.io CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**أو استخدم:**
```bash
curl -L https://fly.io/install.sh | sh
```

#### ب) تسجيل الدخول
```bash
# تسجيل الدخول (سيفتح المتصفح)
flyctl auth login

# التحقق من الحساب
flyctl auth whoami
```

#### ج) إنشاء التطبيق
```bash
# إنشاء التطبيق
flyctl apps create sysora-hotel-platform

# إذا كان الاسم محجوز، جرب:
flyctl apps create sysora-hotel-platform-demo
# أو
flyctl apps create sysora-hotel-platform-$(date +%s)
```

### الخطوة 5: إعداد متغيرات البيئة

```bash
# متغيرات أساسية
flyctl secrets set NODE_ENV=production
flyctl secrets set JWT_SECRET="sysora-jwt-secret-2024-$(openssl rand -hex 16)"
flyctl secrets set APP_NAME="Sysora Hotel Management Platform"

# قاعدة البيانات (للبداية - محلية)
flyctl secrets set MONGODB_URI="mongodb://localhost:27017/sysora-production"

# متغيرات اختيارية
flyctl secrets set DEFAULT_TIMEZONE="Africa/Algiers"
flyctl secrets set DEFAULT_LANGUAGE="ar"
flyctl secrets set SUPPORTED_LANGUAGES="ar,en,fr"
```

### الخطوة 6: النشر الأول

```bash
# النشر
flyctl deploy

# مراقبة العملية
flyctl logs --follow
```

### الخطوة 7: إعداد CI/CD

#### أ) الحصول على Fly.io API Token
```bash
flyctl auth token
```

#### ب) إضافة Token إلى GitHub
1. اذهب إلى مستودع GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. انقر **"New repository secret"**
4. Name: `FLY_API_TOKEN`
5. Value: [الصق الـ token من الأمر السابق]
6. انقر **"Add secret"**

### الخطوة 8: اختبار CI/CD

```bash
# إنشاء تغيير بسيط لاختبار CI/CD
echo "# 🚀 Deployed with CI/CD" >> README.md
git add README.md
git commit -m "test: CI/CD deployment"
git push
```

### الخطوة 9: التحقق من النشر

#### فحص الحالة
```bash
# حالة التطبيق
flyctl status

# فتح التطبيق في المتصفح
flyctl open

# فحص الصحة
curl https://your-app-name.fly.dev/api/health
```

#### URLs مهمة
- **التطبيق:** `https://your-app-name.fly.dev`
- **لوحة التحكم:** `https://your-app-name.fly.dev/dashboard`
- **API Health:** `https://your-app-name.fly.dev/api/health`

## 🔧 إعدادات إضافية (اختيارية)

### قاعدة بيانات MongoDB Atlas

1. **إنشاء حساب مجاني:** [MongoDB Atlas](https://cloud.mongodb.com/)
2. **إنشاء cluster مجاني**
3. **الحصول على connection string**
4. **تحديث المتغير:**
```bash
flyctl secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/sysora"
```

### تخزين الملفات AWS S3

```bash
flyctl secrets set AWS_ACCESS_KEY_ID="your-access-key"
flyctl secrets set AWS_SECRET_ACCESS_KEY="your-secret-key"
flyctl secrets set S3_BUCKET_NAME="sysora-uploads"
flyctl secrets set S3_REGION="us-east-1"
```

## ✅ قائمة التحقق النهائية

- [ ] مستودع GitHub منشأ ومربوط
- [ ] الكود مرفوع على GitHub
- [ ] Fly.io CLI مثبت ومسجل دخول
- [ ] التطبيق منشأ على Fly.io
- [ ] متغيرات البيئة معدة
- [ ] النشر الأول نجح
- [ ] FLY_API_TOKEN مضاف لـ GitHub Secrets
- [ ] CI/CD يعمل (اختبار push)
- [ ] التطبيق يعمل ويمكن الوصول إليه

## 🆘 حل المشاكل

### مشكلة: فشل git push
```bash
git remote -v
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### مشكلة: فشل flyctl deploy
```bash
flyctl logs
flyctl status
flyctl deploy --force
```

### مشكلة: GitHub Actions فشل
1. تحقق من FLY_API_TOKEN في GitHub Secrets
2. تحقق من صحة fly.toml
3. راجع لوجز GitHub Actions

---

🎉 **بعد إكمال هذه الخطوات، ستحصل على:**
- ✅ تطبيق منشور على الإنترنت
- ✅ CI/CD تلقائي
- ✅ نشر تلقائي عند كل push
- ✅ مراقبة وصحة التطبيق
