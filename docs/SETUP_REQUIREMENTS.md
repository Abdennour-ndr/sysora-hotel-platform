# 📋 **دليل تثبيت المتطلبات الأساسية للنشر**

## 🎯 **المتطلبات المطلوبة:**

### **1. 🔧 AWS CLI**
### **2. 🐳 Docker Desktop**
### **3. ☁️ حساب AWS**
### **4. 🗄️ MongoDB Atlas**

---

## 🔧 **1. تثبيت AWS CLI على Windows:**

### **الطريقة الأولى: MSI Installer (الأسهل)**
```powershell
# تحميل وتثبيت AWS CLI
# اذهب إلى: https://awscli.amazonaws.com/AWSCLIV2.msi
# قم بتحميل وتثبيت الملف
```

### **الطريقة الثانية: PowerShell**
```powershell
# تحميل AWS CLI
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"

# تثبيت AWS CLI
Start-Process msiexec.exe -Wait -ArgumentList '/I AWSCLIV2.msi /quiet'

# إعادة تشغيل PowerShell أو إضافة المسار
$env:Path += ";C:\Program Files\Amazon\AWSCLIV2\"
```

### **التحقق من التثبيت:**
```powershell
aws --version
# يجب أن يظهر: aws-cli/2.x.x Python/3.x.x Windows/10
```

---

## 🐳 **2. تثبيت Docker Desktop على Windows:**

### **تحميل وتثبيت Docker Desktop:**
```
1. اذهب إلى: https://www.docker.com/products/docker-desktop/
2. اضغط على "Download for Windows"
3. قم بتشغيل الملف المحمل: Docker Desktop Installer.exe
4. اتبع خطوات التثبيت
5. أعد تشغيل الكمبيوتر إذا طُلب منك
6. شغل Docker Desktop من قائمة Start
```

### **التحقق من التثبيت:**
```powershell
docker --version
# يجب أن يظهر: Docker version 24.x.x

docker-compose --version
# يجب أن يظهر: Docker Compose version v2.x.x
```

---

## ☁️ **3. إنشاء حساب AWS:**

### **إنشاء الحساب:**
```
1. اذهب إلى: https://aws.amazon.com/
2. اضغط على "Create an AWS Account"
3. املأ المعلومات المطلوبة
4. أدخل معلومات بطاقة الائتمان (للتحقق فقط)
5. اختر خطة الدعم المجانية
6. تحقق من الهوية عبر الهاتف
```

### **إعداد IAM User:**
```
1. سجل الدخول إلى AWS Console
2. اذهب إلى IAM service
3. اضغط على "Users" ثم "Add user"
4. اختر اسم المستخدم: sysora-deployer
5. اختر "Programmatic access"
6. أضف الصلاحيات التالية:
   - AmazonS3FullAccess
   - AmazonEC2ContainerRegistryFullAccess
   - AmazonECS_FullAccess
   - ElasticLoadBalancingFullAccess
   - CloudFrontFullAccess
   - Route53FullAccess
   - CloudWatchFullAccess
7. احفظ Access Key ID و Secret Access Key
```

### **تكوين AWS CLI:**
```powershell
aws configure
# AWS Access Key ID: [your-access-key-id]
# AWS Secret Access Key: [your-secret-access-key]
# Default region name: us-east-1
# Default output format: json
```

---

## 🗄️ **4. إعداد MongoDB Atlas:**

### **إنشاء Cluster:**
```
1. اذهب إلى: https://cloud.mongodb.com/
2. أنشئ حساب جديد أو سجل الدخول
3. اضغط على "Build a Database"
4. اختر "Shared" (المجاني للبداية)
5. اختر AWS كـ Cloud Provider
6. اختر us-east-1 كـ Region
7. اختر اسم للـ Cluster: sysora-cluster
8. اضغط على "Create Cluster"
```

### **إعداد Database Access:**
```
1. اذهب إلى "Database Access"
2. اضغط على "Add New Database User"
3. اختر "Password" authentication
4. أدخل username: sysora-admin
5. أنشئ password قوي
6. اختر "Read and write to any database"
7. اضغط على "Add User"
```

### **إعداد Network Access:**
```
1. اذهب إلى "Network Access"
2. اضغط على "Add IP Address"
3. اضغط على "Allow Access from Anywhere" (0.0.0.0/0)
4. اضغط على "Confirm"
```

### **الحصول على Connection String:**
```
1. اذهب إلى "Databases"
2. اضغط على "Connect" بجانب cluster
3. اختر "Connect your application"
4. اختر "Node.js" و version "4.1 or later"
5. انسخ connection string
6. استبدل <password> بكلمة المرور الفعلية
```

---

## ⚙️ **5. إعداد متغيرات البيئة:**

### **إنشاء ملف .env:**
```powershell
# انسخ ملف البيئة
Copy-Item .env.production .env

# عدل الملف باستخدام notepad
notepad .env
```

### **تحديث المتغيرات المطلوبة:**
```env
# Database
MONGODB_URI=mongodb+srv://sysora-admin:your-password@sysora-cluster.xxxxx.mongodb.net/sysora-production?retryWrites=true&w=majority

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1

# S3 Configuration
S3_BUCKET_NAME=sysora-uploads-prod

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Application
NODE_ENV=production
PORT=3000
```

---

## 🧪 **6. اختبار الإعداد:**

### **اختبار AWS CLI:**
```powershell
# اختبار الاتصال
aws sts get-caller-identity

# يجب أن يظهر معلومات حسابك
```

### **اختبار Docker:**
```powershell
# اختبار Docker
docker run hello-world

# يجب أن يظهر رسالة نجاح
```

### **اختبار MongoDB:**
```powershell
# اختبار الاتصال بقاعدة البيانات
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-mongodb-uri')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
"
```

---

## ✅ **قائمة التحقق النهائية:**

- [ ] AWS CLI مثبت ومكون
- [ ] Docker Desktop مثبت ويعمل
- [ ] حساب AWS منشأ ومكون
- [ ] IAM User منشأ مع الصلاحيات المطلوبة
- [ ] MongoDB Atlas cluster منشأ ومكون
- [ ] ملف .env محدث بالمتغيرات الصحيحة
- [ ] جميع الاختبارات تعمل بنجاح

---

## 🚀 **الخطوة التالية:**

بعد تثبيت جميع المتطلبات، يمكنك تشغيل سكريبت النشر:

```powershell
# تشغيل النشر
.\deploy.ps1
```

---

## 📞 **في حالة المشاكل:**

### **مشاكل AWS CLI:**
- تأكد من إعادة تشغيل PowerShell بعد التثبيت
- تحقق من متغير PATH
- تأكد من صحة Access Keys

### **مشاكل Docker:**
- تأكد من تشغيل Docker Desktop
- تأكد من تفعيل Hyper-V على Windows
- أعد تشغيل الكمبيوتر إذا لزم الأمر

### **مشاكل MongoDB:**
- تحقق من صحة connection string
- تأكد من إضافة IP address للـ whitelist
- تحقق من صحة username وpassword

**بعد إكمال هذه الخطوات، ستكون جاهزاً لبدء النشر! 🎉**
