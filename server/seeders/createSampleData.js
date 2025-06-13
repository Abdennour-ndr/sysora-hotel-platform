import mongoose from 'mongoose';
import { SubscriptionPlan, Feature } from '../models/SubscriptionPlan.js';
import DiscountCode from '../models/DiscountCode.js';

// Sample features data
const sampleFeatures = [
  {
    key: 'basic_rooms',
    name: 'إدارة الغرف الأساسية',
    description: 'إضافة وتحرير الغرف الأساسية',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 1,
    isActive: true
  },
  {
    key: 'advanced_rooms',
    name: 'إدارة الغرف المتقدمة',
    description: 'أنواع الغرف، الوسائل، التسعير الديناميكي',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 2,
    isActive: true
  },
  {
    key: 'basic_reservations',
    name: 'الحجوزات الأساسية',
    description: 'إنشاء وإدارة الحجوزات الأساسية',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 3,
    isActive: true
  },
  {
    key: 'online_booking',
    name: 'الحجز الإلكتروني',
    description: 'نظام حجز إلكتروني للموقع',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 4,
    isActive: true
  },
  {
    key: 'basic_guests',
    name: 'إدارة الضيوف الأساسية',
    description: 'قاعدة بيانات الضيوف الأساسية',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 5,
    isActive: true
  },
  {
    key: 'guest_profiles',
    name: 'ملفات الضيوف المتقدمة',
    description: 'تاريخ الإقامة، التفضيلات، الملاحظات',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 6,
    isActive: true
  },
  {
    key: 'basic_payments',
    name: 'المدفوعات الأساسية',
    description: 'تسجيل المدفوعات النقدية والبطاقات',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 7,
    isActive: true
  },
  {
    key: 'invoicing',
    name: 'نظام الفواتير',
    description: 'إنشاء وإرسال الفواتير',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 8,
    isActive: true
  },
  {
    key: 'basic_reports',
    name: 'التقارير الأساسية',
    description: 'تقارير الإشغال والإيرادات',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 9,
    isActive: true
  },
  {
    key: 'advanced_analytics',
    name: 'التحليلات المتقدمة',
    description: 'تحليلات مفصلة ومؤشرات الأداء',
    category: 'premium',
    module: 'hotel',
    status: 'available',
    order: 10,
    isActive: true
  },
  {
    key: 'channel_manager',
    name: 'مدير القنوات',
    description: 'ربط مع مواقع الحجز العالمية',
    category: 'premium',
    module: 'hotel',
    status: 'soon',
    order: 11,
    isActive: true
  },
  {
    key: 'api_access',
    name: 'الوصول للـ API',
    description: 'واجهة برمجة التطبيقات للتكامل',
    category: 'premium',
    module: 'integrations',
    status: 'available',
    order: 12,
    isActive: true
  }
];

// Sample subscription plans
const samplePlans = [
  {
    name: 'Basic',
    slug: 'basic',
    description: 'مثالي للفنادق الصغيرة وبيوت الضيافة',
    tagline: 'ابدأ رحلتك الرقمية',
    pricing: {
      monthly: { amount: 29, currency: 'USD' },
      yearly: { amount: 290, currency: 'USD', discount: 17 }
    },
    trial: {
      enabled: true,
      duration: 3,
      requiresCreditCard: false
    },
    promo: {
      enabled: true,
      price: 1,
      duration: 90,
      description: '$1 لمدة 3 أشهر',
      eligibility: 'first_time_only'
    },
    features: [
      { featureKey: 'basic_rooms', included: true, limit: 20 },
      { featureKey: 'basic_reservations', included: true, limit: 100 },
      { featureKey: 'basic_guests', included: true, limit: 500 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'basic_reports', included: true, limit: -1 }
    ],
    limits: {
      users: 2,
      hotels: 1,
      rooms: 20,
      reservations: 100,
      storage: 1000,
      apiCalls: 1000
    },
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: false,
      order: 1,
      color: '#10B981',
      icon: 'star'
    },
    isActive: true
  },
  {
    name: 'Standard',
    slug: 'standard',
    description: 'مثالي للفنادق المتوسطة والمتنامية',
    tagline: 'الخيار الأكثر شعبية',
    pricing: {
      monthly: { amount: 59, currency: 'USD' },
      yearly: { amount: 590, currency: 'USD', discount: 17 }
    },
    trial: {
      enabled: true,
      duration: 3,
      requiresCreditCard: false
    },
    promo: {
      enabled: true,
      price: 1,
      duration: 90,
      description: '$1 لمدة 3 أشهر',
      eligibility: 'first_time_only'
    },
    features: [
      { featureKey: 'basic_rooms', included: true, limit: -1 },
      { featureKey: 'advanced_rooms', included: true, limit: -1 },
      { featureKey: 'basic_reservations', included: true, limit: -1 },
      { featureKey: 'online_booking', included: true, limit: -1 },
      { featureKey: 'basic_guests', included: true, limit: -1 },
      { featureKey: 'guest_profiles', included: true, limit: -1 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'invoicing', included: true, limit: -1 },
      { featureKey: 'basic_reports', included: true, limit: -1 },
      { featureKey: 'advanced_analytics', included: true, limit: -1 }
    ],
    limits: {
      users: 5,
      hotels: 1,
      rooms: -1,
      reservations: -1,
      storage: 5000,
      apiCalls: 10000
    },
    display: {
      isVisible: true,
      isPopular: true,
      isFeatured: false,
      order: 2,
      color: '#3B82F6',
      icon: 'zap'
    },
    isActive: true
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'للفنادق الكبيرة والسلاسل الفندقية',
    tagline: 'قوة وميزات متقدمة',
    pricing: {
      monthly: { amount: 99, currency: 'USD' },
      yearly: { amount: 990, currency: 'USD', discount: 17 }
    },
    trial: {
      enabled: true,
      duration: 7,
      requiresCreditCard: true
    },
    promo: {
      enabled: false
    },
    features: [
      { featureKey: 'basic_rooms', included: true, limit: -1 },
      { featureKey: 'advanced_rooms', included: true, limit: -1 },
      { featureKey: 'basic_reservations', included: true, limit: -1 },
      { featureKey: 'online_booking', included: true, limit: -1 },
      { featureKey: 'channel_manager', included: true, limit: -1 },
      { featureKey: 'basic_guests', included: true, limit: -1 },
      { featureKey: 'guest_profiles', included: true, limit: -1 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'invoicing', included: true, limit: -1 },
      { featureKey: 'basic_reports', included: true, limit: -1 },
      { featureKey: 'advanced_analytics', included: true, limit: -1 },
      { featureKey: 'api_access', included: true, limit: -1 }
    ],
    limits: {
      users: 15,
      hotels: 3,
      rooms: -1,
      reservations: -1,
      storage: 20000,
      apiCalls: 50000
    },
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: true,
      order: 3,
      color: '#8B5CF6',
      icon: 'crown'
    },
    isActive: true
  }
];

// Sample discount codes
const sampleDiscounts = [
  {
    code: 'WELCOME2024',
    name: 'ترحيب 2024',
    description: 'خصم ترحيبي للعملاء الجدد',
    type: 'percentage',
    value: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: { total: 1000, perUser: 1 },
    eligibility: {
      userType: 'new_users',
      planTypes: ['basic', 'standard'],
      billingCycle: 'all',
      minimumAmount: 25
    },
    conditions: {
      firstTimeOnly: true,
      requiresTrialExpiry: false,
      userBehavior: 'any'
    },
    autoApply: { enabled: false },
    isActive: true,
    isPublic: true,
    category: 'promotional',
    usageCount: 0
  }
];

export const createSampleData = async () => {
  try {
    console.log('🌱 Creating sample pricing data...');

    // Clear existing data
    await Feature.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await DiscountCode.deleteMany({});

    // Create features
    console.log('📋 Creating features...');
    const features = await Feature.insertMany(sampleFeatures);
    console.log(`✅ Created ${features.length} features`);

    // Create subscription plans
    console.log('💰 Creating subscription plans...');
    const plans = await SubscriptionPlan.insertMany(samplePlans);
    console.log(`✅ Created ${plans.length} subscription plans`);

    // Create discount codes
    console.log('🎫 Creating discount codes...');
    const discounts = await DiscountCode.insertMany(sampleDiscounts);
    console.log(`✅ Created ${discounts.length} discount codes`);

    console.log('🎉 Sample data created successfully!');
    
    return { features, plans, discounts };
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
};

export default createSampleData;
