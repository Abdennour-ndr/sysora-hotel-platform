# 🚀 دليل النشر الكامل - Sysora Hotel Platform

## 🎯 نظرة عامة

مشروع Sysora Hotel Platform جاهز للنشر بالكامل مع أدوات التشغيل التلقائي والـ CI/CD. يمكنك اختيار الطريقة التي تناسبك:

## 🛠️ خيارات النشر

### 1️⃣ النشر التلقائي الكامل (موصى به)
```powershell
# تشغيل سكريبت واحد لكل شيء
.\deploy-complete.ps1
```

### 2️⃣ النشر خطوة بخطوة
```powershell
# 1. رفع على GitHub
.\deploy-to-github.ps1

# 2. نشر على Fly.io
.\deploy-to-flyio.ps1
```

### 3️⃣ النشر اليدوي
راجع `STEP_BY_STEP_DEPLOYMENT.md` للتعليمات المفصلة

## 📋 المتطلبات الأساسية

### ✅ أدوات مطلوبة
- **Git** (مثبت)
- **Node.js 18+** (مثبت)
- **PowerShell** (Windows)

### 🌐 حسابات مطلوبة
- **GitHub Account** - لاستضافة الكود
- **Fly.io Account** - للنشر (مجاني)
- **MongoDB Atlas** (اختياري للإنتاج)

## 🚀 البدء السريع

### الخطوة 1: إنشاء حساب Fly.io
1. اذهب إلى [fly.io](https://fly.io)
2. انقر "Sign Up"
3. أكمل التسجيل

### الخطوة 2: تشغيل النشر التلقائي
```powershell
# في مجلد المشروع
.\deploy-complete.ps1
```

### الخطوة 3: اتبع التعليمات
السكريبت سيرشدك خلال:
- ✅ إنشاء مستودع GitHub
- ✅ رفع الكود
- ✅ إنشاء تطبيق Fly.io
- ✅ النشر
- ✅ إعداد CI/CD

## 📁 ملفات النشر

### 📜 سكريبتات PowerShell
- `deploy-complete.ps1` - النشر الكامل التلقائي
- `deploy-to-github.ps1` - رفع على GitHub فقط
- `deploy-to-flyio.ps1` - نشر على Fly.io فقط

### 📚 أدلة مفصلة
- `STEP_BY_STEP_DEPLOYMENT.md` - خطوات مفصلة
- `QUICK_DEPLOY.md` - مرجع سريع
- `DEPLOYMENT_GUIDE.md` - دليل شامل

### ⚙️ ملفات التكوين
- `fly.toml` - إعدادات Fly.io
- `Dockerfile` - بناء التطبيق
- `.github/workflows/fly-deploy.yml` - CI/CD

## 🔧 إعدادات متقدمة

### قاعدة البيانات
```powershell
# MongoDB Atlas (موصى به للإنتاج)
flyctl secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/sysora"

# MongoDB محلي (للتطوير)
flyctl secrets set MONGODB_URI="mongodb://localhost:27017/sysora"
```

### تخزين الملفات
```powershell
# AWS S3
flyctl secrets set AWS_ACCESS_KEY_ID="your-key"
flyctl secrets set AWS_SECRET_ACCESS_KEY="your-secret"
flyctl secrets set S3_BUCKET_NAME="sysora-uploads"
```

### متغيرات إضافية
```powershell
flyctl secrets set DEFAULT_TIMEZONE="Africa/Algiers"
flyctl secrets set DEFAULT_LANGUAGE="ar"
flyctl secrets set SUPPORTED_LANGUAGES="ar,en,fr"
```

## 🔄 CI/CD التلقائي

### إعداد GitHub Actions
1. **احصل على Fly.io API Token:**
   ```bash
   flyctl auth token
   ```

2. **أضف Token إلى GitHub Secrets:**
   - GitHub Repository → Settings → Secrets → Actions
   - New repository secret: `FLY_API_TOKEN`
   - Value: [الـ token من الخطوة 1]

3. **اختبر CI/CD:**
   ```bash
   git add .
   git commit -m "test: CI/CD deployment"
   git push
   ```

### سير العمل التلقائي
- ✅ **Push إلى main** → نشر تلقائي
- ✅ **Pull Request** → اختبارات وفحص أمان
- ✅ **Health Checks** → التحقق من عمل التطبيق

## 🌐 URLs مهمة

بعد النشر الناجح:
- **التطبيق الرئيسي:** `https://your-app.fly.dev`
- **لوحة التحكم:** `https://your-app.fly.dev/dashboard`
- **فحص الصحة:** `https://your-app.fly.dev/api/health`
- **مستودع GitHub:** `https://github.com/username/sysora-hotel-platform`

## 🛠️ أوامر مفيدة

### إدارة Fly.io
```bash
flyctl status                    # حالة التطبيق
flyctl logs                      # عرض اللوجز
flyctl open                      # فتح التطبيق
flyctl ssh console               # الدخول للخادم
flyctl restart                   # إعادة تشغيل
flyctl releases                  # تاريخ النشر
flyctl releases rollback         # التراجع
```

### إدارة Git
```bash
git status                       # حالة Git
git log --oneline -10           # آخر 10 commits
git push                        # رفع التغييرات
git pull                        # جلب التحديثات
```

## 🆘 حل المشاكل

### مشكلة: فشل النشر على Fly.io
```bash
flyctl logs                      # فحص اللوجز
flyctl status                    # فحص الحالة
flyctl deploy --force            # إعادة النشر
```

### مشكلة: خطأ في قاعدة البيانات
```bash
flyctl secrets list             # عرض المتغيرات
flyctl secrets set MONGODB_URI="new-uri"  # تحديث الاتصال
flyctl restart                   # إعادة تشغيل
```

### مشكلة: GitHub Actions فشل
1. تحقق من `FLY_API_TOKEN` في GitHub Secrets
2. راجع لوجز GitHub Actions
3. تحقق من صحة `fly.toml`

### مشكلة: فشل رفع على GitHub
```bash
git remote -v                   # فحص الـ remote
git pull origin main --allow-unrelated-histories
git push -u origin main         # إعادة الرفع
```

## 📞 الدعم والمساعدة

### وثائق رسمية
- [Fly.io Documentation](https://fly.io/docs/)
- [GitHub Actions](https://docs.github.com/actions)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)

### ملفات المساعدة المحلية
- `STEP_BY_STEP_DEPLOYMENT.md` - خطوات مفصلة
- `QUICK_DEPLOY.md` - مرجع سريع
- `DEPLOYMENT_GUIDE.md` - دليل شامل

## ✅ قائمة التحقق النهائية

- [ ] حساب GitHub جاهز
- [ ] حساب Fly.io جاهز
- [ ] تشغيل `deploy-complete.ps1`
- [ ] التطبيق يعمل على Fly.io
- [ ] GitHub Actions معد
- [ ] CI/CD يعمل (اختبار push)
- [ ] قاعدة البيانات متصلة
- [ ] فحص الصحة يعمل

---

🎉 **مبروك!** تطبيق Sysora Hotel Platform أصبح منشور ويعمل بـ CI/CD تلقائي!

🌟 **استمتع بإدارة فندقك بأحدث التقنيات!**
