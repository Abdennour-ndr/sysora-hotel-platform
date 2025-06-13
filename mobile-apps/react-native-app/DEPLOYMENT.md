# دليل النشر - Sysora Hotel Mobile App

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية بناء ونشر تطبيق Sysora Hotel على متاجر التطبيقات.

## 📋 قائمة المراجعة قبل النشر

### ✅ التحقق من الكود
- [ ] اختبار جميع الوظائف على أجهزة حقيقية
- [ ] مراجعة أمان API endpoints
- [ ] تحديث أرقام الإصدارات
- [ ] إزالة console.log من الإنتاج
- [ ] تحسين الصور والأصول
- [ ] اختبار الأداء والذاكرة

### ✅ التحقق من المحتوى
- [ ] مراجعة النصوص والترجمات
- [ ] تحديث أيقونات التطبيق
- [ ] إعداد splash screens
- [ ] مراجعة أذونات التطبيق
- [ ] تحديث وصف المتجر

## 🤖 بناء الأندرويد

### 1. إعداد Keystore
```bash
# إنشاء keystore جديد
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore sysora-hotel-release-key.keystore \
  -alias sysora-hotel-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# سيطلب منك:
# - كلمة مرور للـ keystore
# - كلمة مرور للـ key
# - معلومات المطور
```

### 2. تكوين Gradle
أضف إلى `android/gradle.properties`:
```properties
SYSORA_HOTEL_UPLOAD_STORE_FILE=sysora-hotel-release-key.keystore
SYSORA_HOTEL_UPLOAD_KEY_ALIAS=sysora-hotel-key-alias
SYSORA_HOTEL_UPLOAD_STORE_PASSWORD=your_keystore_password
SYSORA_HOTEL_UPLOAD_KEY_PASSWORD=your_key_password
```

حدث `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('SYSORA_HOTEL_UPLOAD_STORE_FILE')) {
                storeFile file(SYSORA_HOTEL_UPLOAD_STORE_FILE)
                storePassword SYSORA_HOTEL_UPLOAD_STORE_PASSWORD
                keyAlias SYSORA_HOTEL_UPLOAD_KEY_ALIAS
                keyPassword SYSORA_HOTEL_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. بناء التطبيق
```bash
# تنظيف المشروع
cd android && ./gradlew clean

# بناء APK
./gradlew assembleRelease

# بناء AAB (مستحسن للـ Play Store)
./gradlew bundleRelease

# الملفات المُنتجة:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### 4. اختبار البناء
```bash
# تثبيت APK على جهاز
adb install android/app/build/outputs/apk/release/app-release.apk

# اختبار التطبيق بدون debugger
```

## 🍎 بناء الآيفون

### 1. إعداد Xcode
```bash
# فتح workspace
open ios/SysoraHotelMobileApp.xcworkspace

# في Xcode:
# 1. اختر المشروع -> Signing & Capabilities
# 2. حدد Team (Apple Developer Account)
# 3. تأكد من Bundle Identifier
# 4. فعل Automatic Signing
```

### 2. تكوين الإصدار
```bash
# تحديث Info.plist
# CFBundleVersion (Build number)
# CFBundleShortVersionString (Version)
```

### 3. بناء للأرشيف
```bash
# من سطر الأوامر
xcodebuild -workspace ios/SysoraHotelMobileApp.xcworkspace \
  -scheme SysoraHotelMobileApp \
  -configuration Release \
  archive -archivePath ios/build/SysoraHotelMobileApp.xcarchive

# تصدير IPA
xcodebuild -exportArchive \
  -archivePath ios/build/SysoraHotelMobileApp.xcarchive \
  -exportPath ios/build \
  -exportOptionsPlist ios/ExportOptions.plist
```

### 4. رفع إلى App Store Connect
```bash
# استخدام Transporter app
# أو من سطر الأوامر:
xcrun altool --upload-app \
  --type ios \
  --file "ios/build/SysoraHotelMobileApp.ipa" \
  --username "your-apple-id" \
  --password "app-specific-password"
```

## 🏪 نشر Google Play Store

### 1. إنشاء التطبيق
1. اذهب إلى [Google Play Console](https://play.google.com/console)
2. انقر "Create app"
3. املأ التفاصيل الأساسية

### 2. إعداد Store Listing
```
App name: Sysora Hotel Management
Short description: نظام إدارة الفنادق الذكي والشامل
Full description: 
تطبيق Sysora Hotel Management هو حل شامل لإدارة الفنادق يوفر:

🏨 إدارة الغرف والحجوزات
👥 متابعة النزلاء والخدمات  
📊 تقارير مالية مفصلة
🔔 تنبيهات فورية
📱 واجهة سهلة الاستخدام

مصمم خصيصاً لأصحاب الفنادق والموظفين لإدارة العمليات بكفاءة عالية.

الميزات الرئيسية:
✅ لوحة تحكم تفاعلية مع إحصائيات فورية
✅ إدارة كاملة للغرف مع تحديث الحالة
✅ نظام حجوزات متقدم مع تتبع المدفوعات
✅ إدارة ملفات النزلاء والتاريخ
✅ تقارير مالية وتحليلات الأداء
✅ تنبيهات فورية للأحداث المهمة
✅ دعم كامل للغة العربية
✅ تصميم متجاوب لجميع الأجهزة

Category: Business
Tags: hotel, management, booking, hospitality, business
```

### 3. رفع الملفات
- رفع AAB file
- إضافة screenshots (مطلوب)
- إضافة أيقونة التطبيق
- إضافة feature graphic

### 4. إعداد Content Rating
- املأ استبيان Content Rating
- اختر التصنيف المناسب

### 5. إرسال للمراجعة
- مراجعة جميع المعلومات
- إرسال للمراجعة (1-3 أيام عادة)

## 🍎 نشر Apple App Store

### 1. إعداد App Store Connect
1. اذهب إلى [App Store Connect](https://appstoreconnect.apple.com)
2. انقر "My Apps" -> "+"
3. املأ معلومات التطبيق

### 2. إعداد App Information
```
Name: Sysora Hotel Management
Subtitle: نظام إدارة الفنادق الذكي
Category: Business
Description:
تطبيق Sysora Hotel Management هو الحل الأمثل لإدارة الفنادق بطريقة ذكية وفعالة.

الميزات الرئيسية:
• إدارة شاملة للغرف والحجوزات
• متابعة النزلاء وتاريخ الإقامة
• تقارير مالية مفصلة وتحليلات
• تنبيهات فورية للأحداث المهمة
• واجهة عربية سهلة الاستخدام
• تصميم متجاوب لجميع الأجهزة

مصمم خصيصاً لأصحاب الفنادق والموظفين لتحسين كفاءة العمليات وزيادة الإيرادات.

Keywords: hotel,management,booking,hospitality,business,فندق,إدارة,حجز
```

### 3. رفع البناء
- رفع IPA file عبر Xcode أو Transporter
- انتظار معالجة البناء (15-30 دقيقة)

### 4. إعداد Screenshots
- iPhone screenshots (مطلوب)
- iPad screenshots (إذا كان يدعم iPad)
- Apple Watch screenshots (إذا كان يدعم Watch)

### 5. إرسال للمراجعة
- مراجعة جميع المعلومات
- إرسال للمراجعة (1-7 أيام عادة)

## 🔄 التحديثات

### تحديث الأندرويد
```bash
# زيادة versionCode في android/app/build.gradle
android {
    defaultConfig {
        versionCode 2
        versionName "1.0.1"
    }
}

# بناء ورفع AAB جديد
```

### تحديث الآيفون
```bash
# زيادة CFBundleVersion في Info.plist
# رفع بناء جديد إلى App Store Connect
```

## 📊 مراقبة ما بعد النشر

### Analytics
- Google Play Console Analytics
- App Store Connect Analytics
- Firebase Analytics (إذا كان مُفعل)

### Crash Reporting
- Google Play Console Vitals
- Xcode Organizer Crashes
- Crashlytics (إذا كان مُفعل)

### User Feedback
- مراجعة تقييمات المستخدمين
- الرد على التعليقات
- تتبع الأخطاء المبلغ عنها

## 🚨 استكشاف الأخطاء

### مشاكل البناء الشائعة
```bash
# تنظيف المشروع
npm run clean
cd android && ./gradlew clean && cd ..
cd ios && xcodebuild clean && cd ..

# إعادة تثبيت المكتبات
rm -rf node_modules
npm install
cd ios && pod install && cd ..

# إعادة تعيين Metro cache
npx react-native start --reset-cache
```

### مشاكل التوقيع
- تحقق من صحة keystore/certificate
- تأكد من تطابق Bundle ID
- مراجعة إعدادات Provisioning Profile

### مشاكل الرفع
- تحقق من حجم التطبيق (< 150MB للـ APK)
- مراجعة أذونات التطبيق
- تأكد من استيفاء متطلبات المتجر

## 📞 الدعم

للمساعدة في النشر:
- **البريد الإلكتروني**: deploy@sysora.com
- **الوثائق**: https://docs.sysora.com/deployment
- **الدعم الفني**: https://support.sysora.com

---

**نجح النشر! 🎉**
