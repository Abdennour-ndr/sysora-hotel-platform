# 🎨 Sysora Design System

## نظام التصميم الاحترافي لمنصة Sysora

تم تطوير نظام تصميم شامل ومحترف لمنصة Sysora يتضمن مكونات UI حديثة، نظام ألوان متقدم، وتجربة مستخدم متميزة.

---

## 🌟 المميزات الرئيسية

### ✨ نظام الألوان المحترف
- **الألوان الأساسية**: لوحة ألوان عميقة ومتطورة
- **الألوان الثانوية**: تدرجات متوازنة للتفاعلات
- **الألوان الدلالية**: نظام شامل للحالات المختلفة
- **الشفافية والتدرجات**: تأثيرات بصرية احترافية

### 🎯 المكونات الأساسية
- **Button**: أزرار متعددة الأنواع والأحجام
- **Card**: بطاقات تفاعلية مع تأثيرات حركية
- **Input**: حقول إدخال ذكية مع التحقق
- **Navbar**: شريط تنقل متجاوب
- **Sidebar**: شريط جانبي قابل للطي

### 🚀 الأنيميشن والحركة
- انتقالات سلسة وطبيعية
- تأثيرات hover احترافية
- حركات تفاعلية متقدمة
- دعم Framer Motion

---

## 🎨 نظام الألوان

### الألوان الأساسية (Primary)
```css
--sysora-midnight: #0A1628        /* اللون الأساسي الجديد */
--sysora-midnight-light: #1E3A5F  /* متغير فاتح */
--sysora-midnight-dark: #050B14   /* متغير داكن */
```

### الألوان الثانوية (Secondary)
```css
--sysora-mint: #14B8A6           /* تيل محدث */
--sysora-mint-light: #2DD4BF     /* متغير فاتح */
--sysora-mint-dark: #0F766E      /* متغير داكن */
```

### الألوان الدلالية
```css
/* Success Colors */
--success-50: #ECFDF5
--success-500: #10B981
--success-900: #064E3B

/* Warning Colors */
--warning-50: #FFFBEB
--warning-500: #F59E0B
--warning-900: #78350F

/* Error Colors */
--error-50: #FEF2F2
--error-500: #EF4444
--error-900: #7F1D1D
```

---

## 🧩 استخدام المكونات

### Button Component

```jsx
import { Button } from '../components/ui';

// الاستخدام الأساسي
<Button variant="primary">Primary Button</Button>

// مع أيقونة
<Button variant="secondary" icon={<PlusIcon />}>
  Add New
</Button>

// حالة التحميل
<Button variant="primary" loading>
  Saving...
</Button>

// أحجام مختلفة
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Card Component

```jsx
import { Card } from '../components/ui';

// بطاقة أساسية
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    Card content goes here
  </Card.Content>
</Card>

// بطاقة إحصائيات
<Card.Stats
  title="Total Rooms"
  value="24"
  change="+12%"
  changeType="positive"
  color="primary"
  icon={<RoomsIcon />}
/>
```

### Input Component

```jsx
import { Input } from '../components/ui';

// حقل إدخال أساسي
<Input
  label="Hotel Name"
  placeholder="Enter hotel name"
  value={hotelName}
  onChange={(e) => setHotelName(e.target.value)}
/>

// مع التحقق
<Input
  label="Email"
  type="email"
  error={emailError}
  success={emailSuccess}
  helperText="We'll never share your email"
/>
```

### Navbar Component

```jsx
import { Navbar } from '../components/ui';

const navigation = [
  { label: 'Dashboard', href: '/dashboard', active: true },
  { label: 'Rooms', href: '/rooms' },
  { label: 'Reservations', href: '/reservations' },
];

const actions = [
  { label: 'Login', variant: 'ghost' },
  { label: 'Sign Up', variant: 'primary' },
];

<Navbar
  logoText="Sysora"
  navigation={navigation}
  actions={actions}
  user={currentUser}
  onUserMenuClick={handleUserAction}
/>
```

### Sidebar Component

```jsx
import { Sidebar } from '../components/ui';

const sidebarNavigation = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        active: true,
        badge: { text: '5', variant: 'success' }
      },
      {
        label: 'Rooms',
        icon: <RoomsIcon />,
      },
    ]
  }
];

<Sidebar
  navigation={sidebarNavigation}
  user={currentUser}
  collapsed={isCollapsed}
  onToggleCollapse={toggleSidebar}
  variant="gradient"
/>
```

---

## 🎭 المتغيرات والأنواع

### Button Variants
- `primary` - الزر الأساسي
- `secondary` - الزر الثانوي
- `outline` - زر بحدود
- `ghost` - زر شفاف
- `success` - زر النجاح
- `warning` - زر التحذير
- `error` - زر الخطأ
- `gradient` - زر متدرج

### Card Variants
- `default` - البطاقة الافتراضية
- `elevated` - بطاقة مرتفعة
- `gradient` - بطاقة متدرجة
- `glass` - بطاقة زجاجية
- `primary` - بطاقة أساسية

### Input Variants
- `default` - الحقل الافتراضي
- `filled` - حقل معبأ
- `outlined` - حقل بحدود

---

## 📱 التصميم المتجاوب

جميع المكونات مصممة لتكون متجاوبة بالكامل:

```css
/* Mobile First Approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

---

## 🌐 دعم RTL

النظام يدعم اللغة العربية بالكامل:

```css
[dir="rtl"] .component {
  /* RTL specific styles */
}
```

---

## 🚀 البدء السريع

1. **استيراد المكونات**:
```jsx
import { Button, Card, Input } from '../components/ui';
```

2. **استخدام نظام الألوان**:
```jsx
<div className="bg-sysora-midnight text-white">
  <h1 className="text-sysora-mint">Welcome to Sysora</h1>
</div>
```

3. **تطبيق الأنيميشن**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 🎯 أفضل الممارسات

### 1. استخدام الألوان
- استخدم `sysora-midnight` للنصوص الأساسية
- استخدم `sysora-mint` للعناصر التفاعلية
- استخدم الألوان الدلالية للحالات المختلفة

### 2. التباعد والتخطيط
- استخدم `space-y-*` للتباعد العمودي
- استخدم `gap-*` للشبكات
- استخدم `container-responsive` للحاويات

### 3. الأنيميشن
- استخدم `animate-fade-in-up` للعناصر الجديدة
- استخدم `hover:scale-105` للتفاعلات
- استخدم `transition-all duration-200` للانتقالات

### 4. إمكانية الوصول
- استخدم `focus:ring-*` للتركيز
- أضف `aria-label` للأيقونات
- استخدم ألوان متباينة

---

## 📚 الموارد الإضافية

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Documentation](https://reactjs.org/docs)

---

## 🤝 المساهمة

لإضافة مكونات جديدة أو تحسين الموجود:

1. اتبع نمط التسمية الموحد
2. أضف التوثيق المناسب
3. اختبر على جميع الأحجام
4. تأكد من دعم RTL

---

**تم تطوير نظام التصميم هذا خصيصاً لمنصة Sysora لتوفير تجربة مستخدم احترافية ومتميزة** ✨
