import mongoose from 'mongoose';
import { SubscriptionPlan, Feature } from '../models/SubscriptionPlan.js';
import DiscountCode from '../models/DiscountCode.js';

// Features data - Updated with comprehensive hotel management features
const featuresData = [
  // Core Hotel Management Features
  {
    key: 'basic_rooms',
    name: 'Room Management',
    description: 'Add, edit, and manage hotel rooms with status tracking',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 1
  },
  {
    key: 'guest_management',
    name: 'Guest Management',
    description: 'Complete guest profiles with booking history',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 2
  },
  {
    key: 'basic_reservations',
    name: 'Reservation System',
    description: 'Handle bookings, check-ins, and availability',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 3
  },
  {
    key: 'housekeeping',
    name: 'Housekeeping Management',
    description: 'Track cleaning status and schedule tasks',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 4
  },
  {
    key: 'basic_payments',
    name: 'Payment Processing',
    description: 'Record payments and generate invoices',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 5
  },
  {
    key: 'interface_customization',
    name: 'Interface Customization',
    description: 'Customize colors, logo, and basic branding',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 6
  },
  {
    key: 'revenue_tracking',
    name: 'Revenue Tracking',
    description: 'Monitor daily and monthly revenue',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 7
  },

  // Reservations
  {
    key: 'basic_reservations',
    name: 'الحجوزات الأساسية',
    description: 'إنشاء وإدارة الحجوزات الأساسية',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 4
  },
  {
    key: 'online_booking',
    name: 'الحجز الإلكتروني',
    description: 'نظام حجز إلكتروني للموقع',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 5
  },
  {
    key: 'channel_manager',
    name: 'مدير القنوات',
    description: 'ربط مع مواقع الحجز العالمية',
    category: 'premium',
    module: 'hotel',
    status: 'soon',
    order: 6
  },

  // Guest Management
  {
    key: 'basic_guests',
    name: 'إدارة الضيوف الأساسية',
    description: 'قاعدة بيانات الضيوف الأساسية',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 7
  },
  {
    key: 'guest_profiles',
    name: 'ملفات الضيوف المتقدمة',
    description: 'تاريخ الإقامة، التفضيلات، الملاحظات',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 8
  },
  {
    key: 'guest_communication',
    name: 'التواصل مع الضيوف',
    description: 'رسائل SMS وإيميل تلقائية',
    category: 'premium',
    module: 'hotel',
    status: 'soon',
    order: 9
  },

  // Payments & Billing
  {
    key: 'basic_payments',
    name: 'المدفوعات الأساسية',
    description: 'تسجيل المدفوعات النقدية والبطاقات',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 10
  },
  {
    key: 'payment_gateway',
    name: 'بوابة الدفع الإلكتروني',
    description: 'قبول المدفوعات الإلكترونية',
    category: 'advanced',
    module: 'hotel',
    status: 'soon',
    order: 11
  },
  {
    key: 'invoicing',
    name: 'نظام الفواتير',
    description: 'إنشاء وإرسال الفواتير',
    category: 'advanced',
    module: 'hotel',
    status: 'available',
    order: 12
  },

  // Reports & Analytics
  {
    key: 'basic_reports',
    name: 'التقارير الأساسية',
    description: 'تقارير الإشغال والإيرادات',
    category: 'core',
    module: 'hotel',
    status: 'available',
    order: 13
  },
  {
    key: 'advanced_analytics',
    name: 'التحليلات المتقدمة',
    description: 'تحليلات مفصلة ومؤشرات الأداء',
    category: 'premium',
    module: 'hotel',
    status: 'available',
    order: 14
  },
  {
    key: 'revenue_management',
    name: 'إدارة الإيرادات',
    description: 'تحسين الأسعار والإيرادات',
    category: 'enterprise',
    module: 'hotel',
    status: 'planned',
    order: 15
  },

  // Future Modules
  {
    key: 'restaurant_pos',
    name: 'نقاط البيع للمطاعم',
    description: 'نظام نقاط بيع متكامل للمطاعم',
    category: 'premium',
    module: 'restaurant',
    status: 'planned',
    order: 16
  },
  {
    key: 'inventory_management',
    name: 'إدارة المخزون',
    description: 'تتبع وإدارة المخزون',
    category: 'advanced',
    module: 'erp',
    status: 'planned',
    order: 17
  },
  {
    key: 'api_access',
    name: 'الوصول للـ API',
    description: 'واجهة برمجة التطبيقات للتكامل',
    category: 'premium',
    module: 'integrations',
    status: 'available',
    order: 18
  }
];

// Subscription plans data - Updated with new pricing structure
const plansData = [
  {
    name: 'Small Hotels',
    slug: 'small-hotels',
    description: 'Perfect for small hotels and guesthouses',
    tagline: 'Start your digital journey',
    pricing: {
      monthly: { amount: 9, currency: 'USD' },
      yearly: { amount: 90, currency: 'USD', discount: 17 }
    },
    trial: {
      enabled: true,
      duration: 3,
      requiresCreditCard: false
    },
    promo: {
      enabled: true,
      price: 5,
      duration: 90,
      description: 'Launch Offer: $5 for 3 months',
      eligibility: 'first_time_only',
      note: 'Limited time offer for early adopters'
    },
    features: [
      { featureKey: 'basic_rooms', included: true, limit: -1 },
      { featureKey: 'guest_management', included: true, limit: -1 },
      { featureKey: 'basic_reservations', included: true, limit: -1 },
      { featureKey: 'housekeeping', included: true, limit: -1 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'interface_customization', included: true, limit: -1 },
      { featureKey: 'revenue_tracking', included: true, limit: -1 }
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
    }
  },
  {
    name: 'Medium Hotels',
    slug: 'medium-hotels',
    description: 'Ideal for growing medium-sized hotels',
    tagline: 'Most popular choice',
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
      price: 5,
      duration: 90,
      description: 'Launch Offer: $5 for 3 months',
      eligibility: 'first_time_only',
      note: 'Limited time offer for early adopters'
    },
    features: [
      // All Small Hotels features
      { featureKey: 'basic_rooms', included: true, limit: -1 },
      { featureKey: 'guest_management', included: true, limit: -1 },
      { featureKey: 'basic_reservations', included: true, limit: -1 },
      { featureKey: 'housekeeping', included: true, limit: -1 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'interface_customization', included: true, limit: -1 },
      { featureKey: 'revenue_tracking', included: true, limit: -1 },
      // Additional Medium Hotels features
      { featureKey: 'channel_management', included: true, limit: -1 },
      { featureKey: 'periodic_reports', included: true, limit: -1 },
      { featureKey: 'smart_notifications', included: true, limit: -1 }
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
    }
  },
  {
    name: 'Large Hotels & Chains',
    slug: 'large-hotels',
    description: 'For large hotels and hotel chains',
    tagline: 'Enterprise power and advanced features',
    pricing: {
      monthly: { amount: 79, currency: 'USD' },
      yearly: { amount: 790, currency: 'USD', discount: 17 }
    },
    trial: {
      enabled: true,
      duration: 7,
      requiresCreditCard: true
    },
    promo: {
      enabled: true,
      price: 5,
      duration: 90,
      description: 'Launch Offer: $5 for 3 months',
      eligibility: 'first_time_only',
      note: 'Limited time offer for early adopters'
    },
    features: [
      // All previous plan features
      { featureKey: 'basic_rooms', included: true, limit: -1 },
      { featureKey: 'guest_management', included: true, limit: -1 },
      { featureKey: 'basic_reservations', included: true, limit: -1 },
      { featureKey: 'housekeeping', included: true, limit: -1 },
      { featureKey: 'basic_payments', included: true, limit: -1 },
      { featureKey: 'interface_customization', included: true, limit: -1 },
      { featureKey: 'revenue_tracking', included: true, limit: -1 },
      { featureKey: 'channel_management', included: true, limit: -1 },
      { featureKey: 'periodic_reports', included: true, limit: -1 },
      { featureKey: 'smart_notifications', included: true, limit: -1 },
      // Additional Large Hotels features
      { featureKey: 'advanced_analytics', included: true, limit: -1 },
      { featureKey: 'revenue_management', included: true, limit: -1 },
      { featureKey: 'api_access', included: true, limit: -1 },
      { featureKey: 'guest_communication', included: true, limit: -1 },
      { featureKey: 'payment_gateway', included: true, limit: -1 }
    ],
    limits: {
      users: -1,
      hotels: 5,
      rooms: -1,
      reservations: -1,
      storage: 50000,
      apiCalls: 100000
    },
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: true,
      order: 3,
      color: '#8B5CF6',
      icon: 'crown'
    }
  }
];

// Discount codes data
const discountCodesData = [
  {
    code: 'WELCOME2024',
    name: 'ترحيب 2024',
    description: 'خصم ترحيبي للعملاء الجدد',
    type: 'percentage',
    value: 20,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: {
      total: 1000,
      perUser: 1
    },
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
    autoApply: {
      enabled: false
    },
    isActive: true,
    isPublic: true,
    category: 'promotional'
  },
  {
    code: 'BLACKFRIDAY',
    name: 'الجمعة السوداء',
    description: 'خصم الجمعة السوداء',
    type: 'percentage',
    value: 50,
    validFrom: new Date('2024-11-25'),
    validUntil: new Date('2024-11-30'),
    usageLimit: {
      total: 500,
      perUser: 1
    },
    eligibility: {
      userType: 'all',
      planTypes: ['basic', 'standard', 'premium'],
      billingCycle: 'yearly',
      minimumAmount: 50
    },
    conditions: {
      firstTimeOnly: false,
      requiresTrialExpiry: false,
      userBehavior: 'any'
    },
    autoApply: {
      enabled: false
    },
    isActive: true,
    isPublic: true,
    category: 'seasonal'
  }
];

// Seeder function
export const seedPricingData = async () => {
  try {
    console.log('🌱 Seeding pricing data...');

    // Clear existing data
    await Feature.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await DiscountCode.deleteMany({});

    // Seed features
    console.log('📋 Creating features...');
    const features = await Feature.insertMany(featuresData);
    console.log(`✅ Created ${features.length} features`);

    // Seed subscription plans
    console.log('💰 Creating subscription plans...');
    const plans = await SubscriptionPlan.insertMany(plansData);
    console.log(`✅ Created ${plans.length} subscription plans`);

    // Seed discount codes
    console.log('🎫 Creating discount codes...');
    const discounts = await DiscountCode.insertMany(discountCodesData);
    console.log(`✅ Created ${discounts.length} discount codes`);

    console.log('🎉 Pricing data seeded successfully!');
    
    return {
      features,
      plans,
      discounts
    };
  } catch (error) {
    console.error('❌ Error seeding pricing data:', error);
    throw error;
  }
};

export default seedPricingData;
