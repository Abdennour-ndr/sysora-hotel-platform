# 🚀 **دليل النشر السريع لمنصة Sysora على AWS**

## ✅ **التطبيق جاهز للنشر!**

تم التحقق من:
- ✅ Node.js v22.14.0 يعمل
- ✅ npm v10.9.2 يعمل  
- ✅ Dependencies مثبتة بنجاح
- ✅ Frontend build نجح
- ✅ جميع ملفات النشر موجودة

---

## 📋 **المتطلبات المتبقية:**

### **1. 🔧 تثبيت AWS CLI:**

#### **تحميل وتثبيت:**
```
1. اذهب إلى: https://awscli.amazonaws.com/AWSCLIV2.msi
2. حمل الملف وشغله
3. اتبع خطوات التثبيت
4. أعد تشغيل PowerShell
```

#### **التحقق من التثبيت:**
```powershell
aws --version
# يجب أن يظهر: aws-cli/2.x.x
```

### **2. 🐳 تثبيت Docker Desktop:**

#### **تحميل وتثبيت:**
```
1. اذهب إلى: https://www.docker.com/products/docker-desktop/
2. اضغط "Download for Windows"
3. شغل Docker Desktop Installer.exe
4. أعد تشغيل الكمبيوتر إذا طُلب
5. شغل Docker Desktop
```

#### **التحقق من التثبيت:**
```powershell
docker --version
# يجب أن يظهر: Docker version 24.x.x
```

### **3. ☁️ إنشاء حساب AWS:**

#### **إنشاء الحساب:**
```
1. اذهب إلى: https://aws.amazon.com/
2. اضغط "Create an AWS Account"
3. املأ المعلومات المطلوبة
4. أدخل بطاقة ائتمان (للتحقق فقط)
5. اختر خطة الدعم المجانية
```

#### **إنشاء IAM User:**
```
1. سجل دخول إلى AWS Console
2. اذهب إلى IAM service
3. Users → Add user
4. اسم المستخدم: sysora-deployer
5. Access type: Programmatic access
6. أضف Policies:
   - AmazonS3FullAccess
   - AmazonEC2ContainerRegistryFullAccess
   - AmazonECS_FullAccess
   - ElasticLoadBalancingFullAccess
   - CloudFrontFullAccess
7. احفظ Access Key ID و Secret Access Key
```

#### **تكوين AWS CLI:**
```powershell
aws configure
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json
```

### **4. 🗄️ إعداد MongoDB Atlas:**

#### **إنشاء Cluster:**
```
1. اذهب إلى: https://cloud.mongodb.com/
2. أنشئ حساب أو سجل دخول
3. "Build a Database" → "Shared" (مجاني)
4. اختر AWS و us-east-1
5. اسم Cluster: sysora-cluster
6. "Create Cluster"
```

#### **إعداد Database User:**
```
1. Database Access → Add New Database User
2. Username: sysora-admin
3. Password: [كلمة مرور قوية]
4. Database User Privileges: Read and write to any database
5. Add User
```

#### **إعداد Network Access:**
```
1. Network Access → Add IP Address
2. Allow Access from Anywhere (0.0.0.0/0)
3. Confirm
```

#### **الحصول على Connection String:**
```
1. Databases → Connect
2. Connect your application
3. Node.js, version 4.1 or later
4. انسخ connection string
5. استبدل <password> بكلمة المرور الفعلية
```

---

## ⚙️ **إعداد ملف .env:**

### **تحديث المتغيرات:**
```powershell
# عدل ملف .env
notepad .env
```

### **المتغيرات المطلوبة:**
```env
# Database
MONGODB_URI=mongodb+srv://sysora-admin:YOUR_PASSWORD@sysora-cluster.xxxxx.mongodb.net/sysora-production?retryWrites=true&w=majority

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1

# S3 Configuration
S3_BUCKET_NAME=sysora-uploads-prod

# JWT Secret (أنشئ مفتاح قوي)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Application
NODE_ENV=production
PORT=3000
```

---

## 🚀 **تشغيل النشر:**

### **بعد إكمال الإعداد أعلاه:**

```powershell
# تشغيل النشر
.\deploy.ps1
```

### **أو النشر اليدوي خطوة بخطوة:**

#### **1. إنشاء S3 Buckets:**
```powershell
aws s3 mb s3://sysora-frontend-prod --region us-east-1
aws s3 mb s3://sysora-uploads-prod --region us-east-1
```

#### **2. رفع Frontend:**
```powershell
aws s3 sync dist/ s3://sysora-frontend-prod --delete
```

#### **3. إنشاء ECR Repository:**
```powershell
aws ecr create-repository --repository-name sysora-backend --region us-east-1
```

#### **4. بناء ورفع Docker Image:**
```powershell
# تسجيل دخول ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com

# بناء Image
docker build -t sysora-backend .

# Tag Image
docker tag sysora-backend:latest [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/sysora-backend:latest

# رفع Image
docker push [ACCOUNT-ID].dkr.ecr.us-east-1.amazonaws.com/sysora-backend:latest
```

---

## 💰 **التكلفة المتوقعة:**

### **الشهر الأول (مع Free Tier):**
- **MongoDB Atlas M0**: مجاني
- **AWS Free Tier**: مجاني لمعظم الخدمات
- **التكلفة الإجمالية**: ~$10-20/شهر

### **بعد Free Tier:**
- **MongoDB Atlas M10**: $57/شهر
- **AWS Services**: $150-200/شهر
- **التكلفة الإجمالية**: ~$210/شهر

---

## 🎯 **خطة العمل:**

### **اليوم الأول:**
- [ ] تثبيت AWS CLI
- [ ] تثبيت Docker Desktop
- [ ] إنشاء حساب AWS
- [ ] إعداد IAM User

### **اليوم الثاني:**
- [ ] إعداد MongoDB Atlas
- [ ] تكوين .env file
- [ ] اختبار الاتصالات
- [ ] تشغيل النشر

### **اليوم الثالث:**
- [ ] إعداد Domain Name
- [ ] تكوين SSL Certificate
- [ ] اختبار التطبيق
- [ ] إعداد المراقبة

---

## 📞 **الدعم:**

### **في حالة المشاكل:**
1. تحقق من SETUP_REQUIREMENTS.md للتفاصيل
2. راجع AWS_DEPLOYMENT_PLAN.md للخطة الكاملة
3. استخدم DEPLOYMENT_README.md للمساعدة التفصيلية

### **الملفات المساعدة:**
- `check-requirements.ps1` - فحص المتطلبات
- `simple-test.ps1` - اختبار سريع
- `deploy.ps1` - النشر الكامل

---

## 🎉 **الخلاصة:**

**التطبيق جاهز تقنياً للنشر!**

**المطلوب فقط:**
1. تثبيت AWS CLI و Docker
2. إعداد حساب AWS و MongoDB Atlas  
3. تحديث ملف .env
4. تشغيل سكريبت النشر

**بعدها ستكون منصة Sysora متاحة على الإنترنت! 🌟**

**هل تريد البدء بتثبيت المتطلبات؟** 🚀
