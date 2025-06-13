# Sysora Hotel Android Project

مشروع Android Studio كامل لتطبيق Sysora Hotel Management - نظام إدارة الفنادق الذكي.

## 🚀 كيفية فتح المشروع في Android Studio

### الطريقة 1: فتح مباشر
1. افتح **Android Studio**
2. اختر **Open an existing Android Studio project**
3. انتقل إلى مجلد `SysoraHotelAndroidProject`
4. انقر **OK**

### الطريقة 2: استيراد المشروع
1. في Android Studio، اختر **File → Open**
2. اختر مجلد `SysoraHotelAndroidProject`
3. انقر **OK**
4. انتظر حتى يتم تحميل المشروع

## 📋 متطلبات النظام

### للتطوير
- **Android Studio** Arctic Fox أو أحدث
- **JDK** 11 أو أحدث
- **Android SDK** API level 21+
- **Gradle** 7.4+

### للأجهزة
- **Android** 5.0+ (API level 21+)
- **RAM** 2GB أو أكثر
- **Storage** 100MB مساحة فارغة

## 🛠️ إعداد المشروع

### 1. تحديث SDK
1. اذهب إلى **Tools → SDK Manager**
2. تأكد من تثبيت:
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.0
   - Android Emulator
   - Android SDK Platform-Tools

### 2. إعداد Emulator
1. اذهب إلى **Tools → AVD Manager**
2. انقر **Create Virtual Device**
3. اختر **Pixel 6** أو أي جهاز حديث
4. اختر **API 33** (Android 13)
5. انقر **Finish**

### 3. Sync المشروع
1. انقر **File → Sync Project with Gradle Files**
2. انتظر حتى ينتهي التحميل
3. تأكد من عدم وجود أخطاء

## 🏃‍♂️ تشغيل التطبيق

### على المحاكي
1. شغل المحاكي من **AVD Manager**
2. انقر زر **Run** (▶️) في Android Studio
3. اختر المحاكي من القائمة
4. انتظر حتى يتم تثبيت التطبيق

### على جهاز حقيقي
1. فعل **Developer Options** على الهاتف
2. فعل **USB Debugging**
3. وصل الهاتف بالكمبيوتر
4. انقر **Run** واختر الجهاز

## 📁 هيكل المشروع

```
SysoraHotelAndroidProject/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sysorahotel/
│   │   │   │   ├── MainActivity.java
│   │   │   │   ├── MainApplication.java
│   │   │   │   └── SplashActivity.java
│   │   │   ├── res/
│   │   │   │   ├── drawable/          # الصور والأيقونات
│   │   │   │   ├── layout/            # تخطيطات الشاشات
│   │   │   │   ├── values/            # الألوان والنصوص
│   │   │   │   ├── anim/              # الانيميشن
│   │   │   │   └── mipmap/            # أيقونات التطبيق
│   │   │   └── AndroidManifest.xml
│   │   └── debug/
│   └── build.gradle
├── gradle/
├── build.gradle
└── settings.gradle
```

## 🎨 الميزات المطبقة

### ✅ الواجهات
- **Splash Screen** مع انيميشن جميل
- **MainActivity** جاهز لـ React Native
- **تصميم Sysora** بالألوان الرسمية
- **دعم اللغة العربية** مع RTL

### ✅ الإعدادات
- **أذونات كاملة** للكاميرا والتخزين والشبكة
- **Push Notifications** جاهز للتفعيل
- **Firebase** مُعد ومجهز
- **ProGuard** للحماية في الإنتاج

### ✅ التحسينات
- **MultiDex** للتطبيقات الكبيرة
- **Vector Drawables** للأيقونات
- **Edge-to-edge** display
- **Material Design** components

## 🔧 التخصيص

### تغيير اسم التطبيق
في `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">اسم التطبيق الجديد</string>
```

### تغيير الألوان
في `app/src/main/res/values/colors.xml`:
```xml
<color name="sysora_mint">#لونك_الجديد</color>
```

### تغيير الأيقونة
1. انقر بالزر الأيمن على **res**
2. اختر **New → Image Asset**
3. ارفع الأيقونة الجديدة

## 🚀 البناء للإنتاج

### إنشاء APK
```bash
# في Terminal داخل Android Studio
./gradlew assembleRelease
```

### إنشاء AAB (للـ Play Store)
```bash
./gradlew bundleRelease
```

### الملفات المُنتجة
- **APK**: `app/build/outputs/apk/release/app-release.apk`
- **AAB**: `app/build/outputs/bundle/release/app-release.aab`

## 🔍 استكشاف الأخطاء

### مشاكل شائعة
1. **Gradle Sync Failed**
   - انقر **File → Invalidate Caches and Restart**
   - تأكد من اتصال الإنترنت

2. **SDK Not Found**
   - اذهب إلى **File → Project Structure**
   - تأكد من مسار SDK

3. **Build Failed**
   - نظف المشروع: **Build → Clean Project**
   - أعد البناء: **Build → Rebuild Project**

### الحصول على المساعدة
- **Logcat**: لعرض logs التطبيق
- **Build Output**: لعرض أخطاء البناء
- **Event Log**: لعرض أحداث Android Studio

## 📱 الخطوات التالية

### 1. ربط مع React Native
- أضف React Native dependencies
- أنشئ `index.js` file
- ربط مع JavaScript code

### 2. إضافة الميزات
- تسجيل الدخول
- لوحة التحكم
- إدارة الغرف والحجوزات

### 3. الاختبار
- اختبر على أجهزة مختلفة
- اختبر الأداء والذاكرة
- اختبر الشبكة والـ offline mode

## 📞 الدعم الفني

للمساعدة:
- **البريد الإلكتروني**: dev@sysora.com
- **الوثائق**: https://docs.sysora.com
- **GitHub**: https://github.com/sysora/hotel-android

---

**مشروع جاهز للاستخدام! 🎉**

تم إنشاء مشروع Android Studio كامل مع جميع الإعدادات والملفات المطلوبة لتطبيق Sysora Hotel Management.
