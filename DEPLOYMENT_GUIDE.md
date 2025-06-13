# 🚀 دليل النشر الشامل - Sysora Hotel Platform

## 📋 نظرة عامة

هذا الدليل يوضح كيفية رفع مشروع Sysora على GitHub ونشره على Fly.io مع إعداد CI/CD التلقائي.

## 🔧 المتطلبات الأساسية

### 1. أدوات مطلوبة
```bash
# Git (مثبت مسبقاً)
git --version

# Node.js 18+ 
node --version
npm --version

# Fly.io CLI
curl -L https://fly.io/install.sh | sh
```

### 2. حسابات مطلوبة
- ✅ حساب GitHub
- ✅ حساب Fly.io (مجاني)
- ✅ حساب MongoDB Atlas (اختياري للإنتاج)

## 📂 الخطوة 1: رفع المشروع على GitHub

### إنشاء مستودع GitHub جديد

1. **اذهب إلى GitHub.com**
2. **انقر على "New Repository"**
3. **املأ التفاصيل:**
   - Repository name: `sysora-hotel-platform`
   - Description: `🏨 Complete Hotel Management SaaS Platform`
   - ✅ Public (أو Private حسب الحاجة)
   - ❌ لا تضع Initialize with README (لأن لدينا ملفات بالفعل)

### ربط المستودع المحلي بـ GitHub

```bash
# إضافة remote origin (استبدل USERNAME بـ اسم المستخدم الخاص بك)
git remote add origin https://github.com/USERNAME/sysora-hotel-platform.git

# رفع الكود
git branch -M main
git push -u origin main
```

## 🛫 الخطوة 2: إعداد Fly.io

### تسجيل الدخول إلى Fly.io

```bash
# تسجيل الدخول
flyctl auth login

# التحقق من الحساب
flyctl auth whoami
```

### إنشاء التطبيق على Fly.io

```bash
# إنشاء التطبيق (سيستخدم fly.toml الموجود)
flyctl apps create sysora-hotel-platform

# أو إذا كان الاسم محجوز، استخدم اسم مختلف
flyctl apps create sysora-hotel-platform-[YOUR-SUFFIX]
```

### إعداد متغيرات البيئة

```bash
# متغيرات أساسية
flyctl secrets set NODE_ENV=production
flyctl secrets set JWT_SECRET="your-super-secure-jwt-secret-key-here"
flyctl secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/sysora"

# متغيرات اختيارية (AWS S3)
flyctl secrets set AWS_ACCESS_KEY_ID="your-aws-access-key"
flyctl secrets set AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
flyctl secrets set S3_BUCKET_NAME="your-s3-bucket"
```

### النشر الأول

```bash
# نشر التطبيق
flyctl deploy

# مراقبة الحالة
flyctl status

# عرض اللوجز
flyctl logs
```

## 🔄 الخطوة 3: إعداد CI/CD مع GitHub Actions

### إعداد Secrets في GitHub

1. **اذهب إلى مستودع GitHub**
2. **Settings → Secrets and variables → Actions**
3. **أضف Secret جديد:**
   - Name: `FLY_API_TOKEN`
   - Value: احصل عليه من `flyctl auth token`

```bash
# الحصول على Fly.io API Token
flyctl auth token
```

### تفعيل GitHub Actions

الملف `.github/workflows/fly-deploy.yml` موجود بالفعل وسيعمل تلقائياً عند:
- ✅ Push إلى main branch
- ✅ Pull Request إلى main branch

## 🗄️ الخطوة 4: إعداد قاعدة البيانات

### خيار 1: MongoDB Atlas (موصى به للإنتاج)

```bash
# إنشاء cluster مجاني على MongoDB Atlas
# https://cloud.mongodb.com/

# إضافة connection string
flyctl secrets set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/sysora"
```

### خيار 2: MongoDB على Fly.io

```bash
# إنشاء volume للبيانات
flyctl volumes create sysora_data --region fra --size 10

# تحديث fly.toml لإضافة MongoDB
```

## 🔧 الخطوة 5: التحقق من النشر

### فحص الصحة

```bash
# فحص حالة التطبيق
flyctl status

# فحص الصحة عبر API
curl https://sysora-hotel-platform.fly.dev/api/health

# مراقبة اللوجز المباشرة
flyctl logs --follow
```

### اختبار الوظائف

1. **الصفحة الرئيسية:** `https://your-app.fly.dev`
2. **لوحة التحكم:** `https://your-app.fly.dev/dashboard`
3. **API Health:** `https://your-app.fly.dev/api/health`

## 🔄 سير العمل التلقائي (CI/CD)

### عند Push إلى main:

1. ✅ **اختبار الكود** - تشغيل ESLint والاختبارات
2. ✅ **بناء التطبيق** - npm run build
3. ✅ **نشر على Fly.io** - flyctl deploy
4. ✅ **فحص الصحة** - التحقق من عمل التطبيق

### عند Pull Request:

1. ✅ **اختبار الكود**
2. ✅ **فحص الأمان** - npm audit
3. ✅ **مراجعة التبعيات**

## 🛠️ أوامر مفيدة

### إدارة Fly.io

```bash
# عرض التطبيقات
flyctl apps list

# عرض حالة التطبيق
flyctl status

# إعادة تشغيل
flyctl restart

# عرض اللوجز
flyctl logs

# فتح التطبيق في المتصفح
flyctl open

# عرض معلومات النشر
flyctl releases

# التراجع عن نشر
flyctl releases rollback
```

### إدارة Git

```bash
# عرض حالة Git
git status

# إضافة تغييرات
git add .
git commit -m "تحديث: وصف التغيير"
git push

# إنشاء branch جديد
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## 🔒 الأمان والصيانة

### نصائح الأمان

1. **لا تضع أسرار في الكود**
2. **استخدم flyctl secrets للمتغيرات الحساسة**
3. **فعل HTTPS دائماً**
4. **راقب اللوجز بانتظام**

### الصيانة الدورية

```bash
# تحديث التبعيات
npm update
npm audit fix

# تحديث Fly.io CLI
curl -L https://fly.io/install.sh | sh

# نسخ احتياطي من قاعدة البيانات
# (حسب نوع قاعدة البيانات المستخدمة)
```

## 🆘 حل المشاكل الشائعة

### مشكلة: فشل النشر

```bash
# فحص اللوجز
flyctl logs

# فحص حالة التطبيق
flyctl status

# إعادة النشر
flyctl deploy --force
```

### مشكلة: خطأ في قاعدة البيانات

```bash
# فحص متغيرات البيئة
flyctl secrets list

# تحديث connection string
flyctl secrets set MONGODB_URI="new-connection-string"
```

### مشكلة: GitHub Actions فشل

1. **تحقق من FLY_API_TOKEN في GitHub Secrets**
2. **تحقق من صحة fly.toml**
3. **راجع لوجز GitHub Actions**

## 📞 الدعم والمساعدة

- **Fly.io Docs:** https://fly.io/docs/
- **GitHub Actions:** https://docs.github.com/actions
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

🎉 **تهانينا!** تطبيق Sysora Hotel Platform أصبح الآن منشور ويعمل بـ CI/CD تلقائي!
