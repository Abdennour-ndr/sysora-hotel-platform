# 🚨 Quick Debug Steps for 500 Error

## 🔧 **تم إصلاح endpoints الاختبار - اختبر الآن:**

### **الخطوة 1: اختبار الاتصال الأساسي**
افتح المتصفح واذهب إلى:
```
http://localhost:5000/api/customization/ping
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "Customization routes are working",
  "timestamp": "2024-..."
}
```

### **الخطوة 2: اختبار التوثيق**
في صفحة التخصيص، افتح Developer Tools → Console وأدخل:

```javascript
// اختبار endpoint التشخيص
fetch('/api/customization/test', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Test Result:', data);
})
.catch(err => {
  console.error('❌ Test Error:', err);
});
```

### **الخطوة 3: اختبار حفظ بسيط**
```javascript
// اختبار حفظ ثيم بسيط
fetch('/api/customization/test-theme', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ primaryColor: '#FF0000' })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Theme Test Result:', data);
})
.catch(err => {
  console.error('❌ Theme Test Error:', err);
});
```

---

## 🔍 **ما نبحث عنه:**

### **إذا كان ping يعمل ولكن test لا يعمل:**
- مشكلة في التوثيق
- Token منتهي الصلاحية
- مشكلة في middleware

### **إذا كان test يعمل ولكن test-theme لا يعمل:**
- مشكلة في قاعدة البيانات
- مشكلة في نموذج Hotel
- مشكلة في حفظ البيانات

### **إذا كان كلاهما لا يعمل:**
- مشكلة في الخادم
- مشكلة في الاتصال
- مشكلة في routes

---

## 🛠️ **إصلاحات سريعة:**

### **إذا كان Token منتهي الصلاحية:**
```javascript
// تسجيل دخول جديد
localStorage.removeItem('sysora_token');
// ثم سجل دخول مرة أخرى
```

### **إذا كانت مشكلة في قاعدة البيانات:**
```bash
# تحقق من أن MongoDB يعمل
mongosh
# أو
mongo
```

### **إذا كانت مشكلة في الخادم:**
```bash
# أعد تشغيل الخادم
npm run dev
# أو
node server/index.js
```

---

## 📋 **تحقق من Server Console:**

عند تشغيل الاختبارات، يجب أن ترى في server console:

```
=== CUSTOMIZATION TEST ENDPOINT ===
User ID: 67...
User email: user@example.com
User hotelId: 67...
Looking for hotel with ID: 67...
Hotel found: true
Hotel name: فندق سيسورا
Has customization: false
Customization keys: none
```

---

## 🚨 **إذا استمرت المشكلة:**

### **أرسل النتائج التالية:**

1. **نتيجة ping test:**
   - هل يعمل `/api/customization/ping`؟

2. **نتيجة auth test:**
   - ما هي نتيجة `/api/customization/test`؟

3. **Server console logs:**
   - ما هي الرسائل في server console؟

4. **Browser console errors:**
   - هل هناك أخطاء في browser console؟

5. **Network tab:**
   - ما هي status codes للطلبات؟

---

## 🎯 **الهدف:**

نريد أن نرى:
- ✅ ping يعمل (يؤكد أن routes مسجلة)
- ✅ test يعمل (يؤكد أن التوثيق يعمل)
- ✅ test-theme يعمل (يؤكد أن الحفظ يعمل)

بعدها يمكننا إصلاح endpoints الأصلية!

---

## ⚡ **اختبار سريع في سطر واحد:**

```javascript
// اختبار شامل
Promise.all([
  fetch('/api/customization/ping').then(r => r.json()),
  fetch('/api/customization/test', {headers: {'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`}}).then(r => r.json()),
  fetch('/api/customization/test-theme', {method: 'PUT', headers: {'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`, 'Content-Type': 'application/json'}, body: JSON.stringify({primaryColor: '#FF0000'})}).then(r => r.json())
]).then(results => {
  console.log('🔍 Test Results:');
  console.log('1. Ping:', results[0]);
  console.log('2. Auth Test:', results[1]);
  console.log('3. Theme Test:', results[2]);
}).catch(err => console.error('❌ Test Failed:', err));
```

**انسخ هذا السطر في browser console وشغله!** 🚀
