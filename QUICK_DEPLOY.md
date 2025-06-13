# ⚡ النشر السريع - Sysora Platform

## 🚀 نشر سريع في 5 دقائق

### 1️⃣ إعداد GitHub (دقيقة واحدة)

```bash
# إنشاء مستودع جديد على GitHub
# اسم المستودع: sysora-hotel-platform

# ربط المستودع المحلي
git remote add origin https://github.com/YOUR_USERNAME/sysora-hotel-platform.git
git push -u origin main
```

### 2️⃣ إعداد Fly.io (3 دقائق)

```bash
# تثبيت Fly.io CLI
curl -L https://fly.io/install.sh | sh

# تسجيل الدخول
flyctl auth login

# إنشاء التطبيق
flyctl apps create sysora-hotel-platform

# إعداد المتغيرات الأساسية
flyctl secrets set NODE_ENV=production
flyctl secrets set JWT_SECRET="sysora-jwt-secret-2024-production"
flyctl secrets set MONGODB_URI="mongodb://localhost:27017/sysora-production"

# النشر
flyctl deploy
```

### 3️⃣ إعداد CI/CD (دقيقة واحدة)

```bash
# الحصول على Fly.io API Token
flyctl auth token

# إضافة Token إلى GitHub Secrets:
# GitHub → Settings → Secrets → New secret
# Name: FLY_API_TOKEN
# Value: [الـ token من الأمر السابق]
```

## ✅ التحقق من النشر

```bash
# فحص حالة التطبيق
flyctl status

# فتح التطبيق
flyctl open

# مراقبة اللوجز
flyctl logs --follow
```

## 🔧 إعدادات إضافية (اختيارية)

### قاعدة بيانات MongoDB Atlas

```bash
# إنشاء cluster مجاني على MongoDB Atlas
# https://cloud.mongodb.com/

# تحديث connection string
flyctl secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/sysora"
```

### تخزين الملفات AWS S3

```bash
flyctl secrets set AWS_ACCESS_KEY_ID="your-access-key"
flyctl secrets set AWS_SECRET_ACCESS_KEY="your-secret-key"
flyctl secrets set S3_BUCKET_NAME="sysora-uploads"
```

## 🎯 URLs مهمة

- **التطبيق:** https://sysora-hotel-platform.fly.dev
- **API Health:** https://sysora-hotel-platform.fly.dev/api/health
- **لوحة التحكم:** https://sysora-hotel-platform.fly.dev/dashboard

## 🔄 تحديث التطبيق

```bash
# تحديث الكود
git add .
git commit -m "تحديث: وصف التغيير"
git push

# النشر اليدوي (إذا لزم الأمر)
flyctl deploy
```

## 🆘 حل سريع للمشاكل

### مشكلة: فشل النشر
```bash
flyctl logs
flyctl deploy --force
```

### مشكلة: خطأ في قاعدة البيانات
```bash
flyctl secrets list
flyctl secrets set MONGODB_URI="new-connection-string"
flyctl restart
```

### مشكلة: GitHub Actions فشل
1. تحقق من FLY_API_TOKEN في GitHub Secrets
2. تحقق من صحة fly.toml
3. راجع لوجز GitHub Actions

---

🎉 **مبروك!** تطبيقك أصبح منشور ويعمل!
