# 🚀 **دليل نشر منصة Sysora على AWS**

## 📋 **المتطلبات الأساسية**

### **1. الأدوات المطلوبة:**
```bash
# تثبيت AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# تثبيت Docker
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# تثبيت Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **2. إعداد AWS:**
```bash
# تكوين AWS CLI
aws configure
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json
```

---

## 🏗️ **خطوات النشر**

### **المرحلة 1: إعداد قاعدة البيانات**

#### **1.1 إنشاء MongoDB Atlas Cluster:**
1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com)
2. أنشئ حساب جديد أو سجل الدخول
3. أنشئ cluster جديد (M10 للإنتاج)
4. أضف IP address للوصول (0.0.0.0/0 للاختبار)
5. أنشئ database user
6. احصل على connection string

#### **1.2 تحديث متغيرات البيئة:**
```bash
# انسخ ملف البيئة
cp .env.production .env

# عدل المتغيرات
nano .env
```

### **المرحلة 2: إعداد AWS Infrastructure**

#### **2.1 إنشاء S3 Buckets:**
```bash
# Frontend static files
aws s3 mb s3://sysora-frontend-prod --region us-east-1

# User uploads
aws s3 mb s3://sysora-uploads-prod --region us-east-1

# تفعيل static website hosting
aws s3 website s3://sysora-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

#### **2.2 إنشاء ECR Repository:**
```bash
# إنشاء repository للـ backend
aws ecr create-repository \
  --repository-name sysora-backend \
  --region us-east-1
```

#### **2.3 إنشاء VPC والشبكات:**
```bash
# إنشاء VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --query 'Vpc.VpcId' \
  --output text)

# إنشاء subnets
SUBNET1_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --query 'Subnet.SubnetId' \
  --output text)

SUBNET2_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --query 'Subnet.SubnetId' \
  --output text)
```

### **المرحلة 3: النشر التلقائي**

#### **3.1 استخدام سكريبت النشر:**
```bash
# تشغيل سكريبت النشر
chmod +x deploy.sh
./deploy.sh
```

#### **3.2 النشر اليدوي:**
```bash
# بناء Frontend
npm run build

# رفع Frontend إلى S3
aws s3 sync dist/ s3://sysora-frontend-prod --delete

# بناء Backend Docker image
docker build -t sysora-backend .

# رفع إلى ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  [account-id].dkr.ecr.us-east-1.amazonaws.com

docker tag sysora-backend:latest \
  [account-id].dkr.ecr.us-east-1.amazonaws.com/sysora-backend:latest

docker push [account-id].dkr.ecr.us-east-1.amazonaws.com/sysora-backend:latest
```

---

## 🔧 **إعداد ECS (Elastic Container Service)**

### **1. إنشاء ECS Cluster:**
```bash
aws ecs create-cluster --cluster-name sysora-cluster
```

### **2. إنشاء Task Definition:**
```json
{
  "family": "sysora-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::[account]:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "sysora-backend",
      "image": "[account].dkr.ecr.us-east-1.amazonaws.com/sysora-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "your-mongodb-connection-string"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/sysora-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### **3. إنشاء ECS Service:**
```bash
aws ecs create-service \
  --cluster sysora-cluster \
  --service-name sysora-backend-service \
  --task-definition sysora-backend-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1_ID,$SUBNET2_ID],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## 🌐 **إعداد Load Balancer و CloudFront**

### **1. Application Load Balancer:**
```bash
# إنشاء ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name sysora-alb \
  --subnets $SUBNET1_ID $SUBNET2_ID \
  --security-groups sg-xxx \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# إنشاء Target Group
TG_ARN=$(aws elbv2 create-target-group \
  --name sysora-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)
```

### **2. CloudFront Distribution:**
```bash
# إنشاء CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

## 🔒 **الأمان والحماية**

### **1. SSL Certificate:**
```bash
# طلب SSL certificate
aws acm request-certificate \
  --domain-name sysora.com \
  --subject-alternative-names "*.sysora.com" \
  --validation-method DNS \
  --region us-east-1
```

### **2. Security Groups:**
```bash
# إنشاء security group للـ backend
SG_ID=$(aws ec2 create-security-group \
  --group-name sysora-backend-sg \
  --description "Sysora Backend Security Group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# إضافة قواعد الأمان
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 3000 \
  --cidr 10.0.0.0/16
```

---

## 📊 **المراقبة والتنبيهات**

### **1. CloudWatch Logs:**
```bash
# إنشاء log group
aws logs create-log-group \
  --log-group-name /ecs/sysora-backend \
  --region us-east-1
```

### **2. CloudWatch Alarms:**
```bash
# إنشاء alarm للـ CPU usage
aws cloudwatch put-metric-alarm \
  --alarm-name "Sysora-High-CPU" \
  --alarm-description "High CPU usage" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 🧪 **الاختبار والتحقق**

### **1. اختبار Health Check:**
```bash
# اختبار الـ backend
curl -f https://api.sysora.com/api/health

# اختبار الـ frontend
curl -f https://sysora.com
```

### **2. اختبار الوظائف:**
```bash
# اختبار تسجيل الدخول
curl -X POST https://api.sysora.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🔄 **النسخ الاحتياطية والاستعادة**

### **1. نسخ احتياطية للقاعدة:**
```bash
# MongoDB Atlas automatic backups
# تفعيل من لوحة التحكم
```

### **2. نسخ احتياطية للملفات:**
```bash
# نسخ S3 إلى bucket آخر
aws s3 sync s3://sysora-uploads-prod s3://sysora-backups-prod
```

---

## 📞 **الدعم والصيانة**

### **1. تحديث التطبيق:**
```bash
# تحديث الكود
git pull origin main

# إعادة النشر
./deploy.sh
```

### **2. مراقبة الأداء:**
```bash
# مراقبة logs
aws logs tail /ecs/sysora-backend --follow

# مراقبة metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average
```

---

## ✅ **قائمة التحقق النهائية**

- [ ] MongoDB Atlas cluster جاهز
- [ ] AWS credentials مكونة
- [ ] S3 buckets منشأة
- [ ] ECR repository منشأ
- [ ] VPC والشبكات جاهزة
- [ ] ECS cluster وservice يعملان
- [ ] Load Balancer مكون
- [ ] CloudFront distribution جاهز
- [ ] SSL certificate مثبت
- [ ] DNS records مكونة
- [ ] Health checks تعمل
- [ ] Monitoring مفعل
- [ ] Backups مجدولة

---

## 🎉 **تهانينا!**

تم نشر منصة Sysora بنجاح على AWS! 

**الروابط:**
- Frontend: https://sysora.com
- API: https://api.sysora.com
- Admin: https://admin.sysora.com

**للدعم:** support@sysora.com
