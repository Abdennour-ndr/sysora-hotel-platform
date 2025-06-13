# Sysora Hotel Mobile App

تطبيق موبايل شامل لإدارة الفنادق مبني بـ React Native، مصمم للعمل مع نظام Sysora لإدارة الفنادق.

## 🚀 المميزات

### ✅ الوظائف الأساسية
- **تسجيل دخول آمن** مع دعم المصادقة المتعددة
- **لوحة تحكم تفاعلية** مع إحصائيات فورية
- **إدارة الغرف** الكاملة مع تحديث الحالة
- **نظام الحجوزات** المتقدم
- **إدارة النزلاء** والملفات الشخصية
- **تقارير مالية** مفصلة
- **تنبيهات فورية** Push Notifications

### 🎨 التصميم
- **هوية Sysora** الموحدة مع الويب أبليكيشن
- **واجهة عربية** مع دعم RTL
- **تصميم متجاوب** لجميع أحجام الشاشات
- **انيميشن سلس** وتفاعل ممتاز

### 🔧 التقنيات
- **React Native 0.72+**
- **TypeScript** للأمان والجودة
- **React Navigation** للتنقل
- **Axios** للـ API calls
- **AsyncStorage** للتخزين المحلي
- **Push Notifications** للتنبيهات

## 📋 متطلبات النظام

### للتطوير
- **Node.js** 16 أو أحدث
- **React Native CLI**
- **Android Studio** (للأندرويد)
- **Xcode** (للآيفون - macOS فقط)

### للأجهزة
- **Android** 6.0+ (API level 23+)
- **iOS** 11.0+

## 🛠️ الإعداد والتشغيل

### 1. تثبيت المتطلبات
```bash
# تثبيت Node.js من https://nodejs.org
# تثبيت React Native CLI
npm install -g react-native-cli

# للأندرويد: تثبيت Android Studio
# للآيفون: تثبيت Xcode (macOS فقط)
```

### 2. إعداد المشروع
```bash
# استنساخ المشروع
git clone <repository-url>
cd SysoraHotelMobileApp

# تثبيت المكتبات
npm install

# إعداد iOS (macOS فقط)
cd ios && pod install && cd ..
```

### 3. تشغيل التطبيق
```bash
# تشغيل Metro bundler
npm start

# تشغيل على الأندرويد
npm run android

# تشغيل على الآيفون
npm run ios

# تشغيل على جهاز محدد
npx react-native run-android --deviceId <device-id>
npx react-native run-ios --device "iPhone 14 Pro"
```

## 🔧 التكوين

### متغيرات البيئة
أنشئ ملف `.env` في جذر المشروع:
```env
API_BASE_URL=https://api.sysora.com
API_TIMEOUT=15000
PUSH_NOTIFICATION_SENDER_ID=your-sender-id
```

### إعداد API
حدث `src/config/api.js`:
```javascript
const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com/api',
  // باقي الإعدادات...
};
```

## 📱 البناء للإنتاج

### بناء الأندرويد
```bash
# إنشاء keystore
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore sysora-release-key.keystore -alias sysora-key-alias -keyalg RSA -keysize 2048 -validity 10000

# بناء APK
cd android && ./gradlew assembleRelease

# بناء AAB (مستحسن للـ Play Store)
cd android && ./gradlew bundleRelease
```

### بناء الآيفون
```bash
# فتح في Xcode
open ios/SysoraHotelMobileApp.xcworkspace

# أو بناء من سطر الأوامر
xcodebuild -workspace ios/SysoraHotelMobileApp.xcworkspace -scheme SysoraHotelMobileApp -configuration Release archive
```

## 📂 هيكل المشروع

```
SysoraHotelMobileApp/
├── src/
│   ├── components/          # مكونات قابلة للإعادة
│   ├── screens/            # شاشات التطبيق
│   │   ├── auth/           # شاشات المصادقة
│   │   ├── dashboard/      # لوحة التحكم
│   │   ├── rooms/          # إدارة الغرف
│   │   ├── bookings/       # إدارة الحجوزات
│   │   ├── guests/         # إدارة النزلاء
│   │   ├── reports/        # التقارير
│   │   └── profile/        # الملف الشخصي
│   ├── navigation/         # إعداد التنقل
│   ├── services/          # خدمات API
│   ├── contexts/          # React Contexts
│   ├── config/            # ملفات التكوين
│   └── utils/             # دوال مساعدة
├── android/               # ملفات الأندرويد
├── ios/                   # ملفات الآيفون
└── assets/               # الصور والأيقونات
```

## 🔐 الأمان

### المصادقة
- **JWT Tokens** مع تجديد تلقائي
- **تخزين آمن** للبيانات الحساسة
- **تشفير** للاتصالات
- **انتهاء صلاحية** الجلسات

### الصلاحيات
- **نظام أدوار** متقدم
- **تحكم في الوصول** للميزات
- **تسجيل العمليات** والأنشطة

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# اختبار التغطية
npm run test:coverage

# اختبار E2E
npm run test:e2e
```

## 📊 الأداء

### تحسينات مطبقة
- **تحميل كسول** للشاشات
- **ذاكرة تخزين مؤقت** للبيانات
- **ضغط الصور** التلقائي
- **تحسين الشبكة** والطلبات

### مراقبة الأداء
- **Flipper** للتطوير
- **Crashlytics** لتتبع الأخطاء
- **Performance monitoring**

## 🚀 النشر

### Google Play Store
1. إنشاء حساب مطور ($25)
2. رفع AAB file
3. ملء بيانات المتجر
4. إرسال للمراجعة

### Apple App Store
1. حساب Apple Developer ($99/سنة)
2. رفع IPA file
3. ملء App Store Connect
4. إرسال للمراجعة

## 🆘 الدعم الفني

### المشاكل الشائعة
- **مشاكل البناء**: تحقق من إعدادات Android/iOS
- **مشاكل الشبكة**: تحقق من إعدادات API
- **مشاكل الأذونات**: تحقق من إعدادات الجهاز

### الحصول على المساعدة
- **البريد الإلكتروني**: dev@sysora.com
- **الوثائق**: https://docs.sysora.com
- **GitHub Issues**: للمشاكل التقنية

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للتفاصيل.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة `CONTRIBUTING.md` للتفاصيل.

## 📝 سجل التغييرات

راجع `CHANGELOG.md` لسجل كامل بالتغييرات والتحديثات.

---

**تم تطويره بـ ❤️ من فريق Sysora**
