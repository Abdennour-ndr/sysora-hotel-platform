import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown, Settings, ArrowRight, Sparkles } from 'lucide-react';

// Fallback plans in case API fails - Updated with new pricing structure
const fallbackPlans = [
  {
    _id: '1',
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
      { featureKey: 'basic_rooms', name: 'Room Management', included: true },
      { featureKey: 'guest_management', name: 'Guest Management', included: true },
      { featureKey: 'basic_reservations', name: 'Reservation System', included: true },
      { featureKey: 'housekeeping', name: 'Housekeeping Management', included: true },
      { featureKey: 'basic_payments', name: 'Payment Processing', included: true },
      { featureKey: 'interface_customization', name: 'Interface Customization', included: true },
      { featureKey: 'revenue_tracking', name: 'Revenue Tracking', included: true }
    ],
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: false,
      order: 1,
      color: '#10B981'
    },
    yearlySavingsPercentage: 17
  },
  {
    _id: '2',
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
      { featureKey: 'basic_rooms', name: 'Room Management', included: true },
      { featureKey: 'guest_management', name: 'Guest Management', included: true },
      { featureKey: 'basic_reservations', name: 'Reservation System', included: true },
      { featureKey: 'housekeeping', name: 'Housekeeping Management', included: true },
      { featureKey: 'basic_payments', name: 'Payment Processing', included: true },
      { featureKey: 'interface_customization', name: 'Interface Customization', included: true },
      { featureKey: 'revenue_tracking', name: 'Revenue Tracking', included: true },
      { featureKey: 'channel_management', name: 'Channel Management', included: true },
      { featureKey: 'periodic_reports', name: 'Periodic Reports', included: true },
      { featureKey: 'smart_notifications', name: 'Smart Notifications', included: true }
    ],
    display: {
      isVisible: true,
      isPopular: true,
      isFeatured: false,
      order: 2,
      color: '#3B82F6'
    },
    yearlySavingsPercentage: 17
  },
  {
    _id: '3',
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
      { featureKey: 'basic_rooms', name: 'Room Management', included: true },
      { featureKey: 'guest_management', name: 'Guest Management', included: true },
      { featureKey: 'basic_reservations', name: 'Reservation System', included: true },
      { featureKey: 'housekeeping', name: 'Housekeeping Management', included: true },
      { featureKey: 'basic_payments', name: 'Payment Processing', included: true },
      { featureKey: 'interface_customization', name: 'Interface Customization', included: true },
      { featureKey: 'revenue_tracking', name: 'Revenue Tracking', included: true },
      { featureKey: 'channel_management', name: 'Channel Management', included: true },
      { featureKey: 'periodic_reports', name: 'Periodic Reports', included: true },
      { featureKey: 'smart_notifications', name: 'Smart Notifications', included: true },
      { featureKey: 'advanced_analytics', name: 'Advanced Analytics', included: true },
      { featureKey: 'revenue_management', name: 'Revenue Management', included: true, badge: 'Advanced' },
      { featureKey: 'api_access', name: 'API Access', included: true },
      { featureKey: 'guest_communication', name: 'Guest Communication', included: true, badge: 'Premium' },
      { featureKey: 'payment_gateway', name: 'Payment Gateway', included: true, badge: 'Enterprise' }
    ],
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: true,
      order: 3,
      color: '#8B5CF6'
    },
    yearlySavingsPercentage: 17
  }
];

const PublicPricingView = () => {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // First try to create sample data if no plans exist
      try {
        await fetch(`${baseUrl}/api/pricing/create-sample-data`, {
          method: 'POST'
        });
      } catch (sampleError) {
        console.log('Sample data might already exist');
      }

      const response = await fetch(`${baseUrl}/api/pricing/plans`);
      const data = await response.json();

      if (data.success && data.data) {
        setPlans(data.data);
      } else {
        // Fallback to hardcoded plans if API fails
        setPlans(fallbackPlans);
      }
    } catch (error) {
      console.error('Fetch plans error:', error);
      // Use fallback plans
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  };

  const validateDiscountCode = async (code, planPrice) => {
    if (!code.trim()) {
      setAppliedDiscount(null);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/pricing/discount/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code.trim(),
          planType: 'standard',
          billingCycle,
          amount: planPrice
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedDiscount(data.data);
        window.showToast && window.showToast('تم تطبيق كود الخصم بنجاح!', 'success');
      } else {
        setAppliedDiscount(null);
        window.showToast && window.showToast(data.error || 'كود خصم غير صالح', 'error');
      }
    } catch (error) {
      console.error('Validate discount error:', error);
      setAppliedDiscount(null);
      window.showToast && window.showToast('فشل في التحقق من كود الخصم', 'error');
    }
  };

  const planIcons = {
    basic: Star,
    standard: Zap,
    premium: Crown,
    enterprise: Settings
  };

  const getPrice = (plan) => {
    return billingCycle === 'monthly'
      ? plan.pricing.monthly.amount
      : plan.pricing.yearly.amount;
  };

  const getDiscountedPrice = (originalPrice) => {
    if (!appliedDiscount) return originalPrice;
    return appliedDiscount.calculation.finalAmount;
  };

  const handleStartTrial = (plan) => {
    // Redirect to registration with plan selection
    window.location.href = `/register?plan=${plan.slug}&trial=true`;
  };

  const handleSelectPlan = (plan) => {
    // Redirect to registration with plan selection
    const params = new URLSearchParams({
      plan: plan.slug,
      billing: billingCycle
    });

    if (appliedDiscount) {
      params.append('discount', discountCode);
    }

    window.location.href = `/register?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          اختر الخطة المناسبة لفندقك
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          ابدأ بتجربة مجانية لمدة 3 أيام، بدون الحاجة لبطاقة ائتمان
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              سنوي
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                وفر حتى 20%
              </span>
            </button>
          </div>
        </div>

        {/* Discount Code Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="كود الخصم (اختياري)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => validateDiscountCode(discountCode, 59)}
              className="px-6 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors"
            >
              تطبيق
            </button>
          </div>
          {appliedDiscount && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800 font-medium">{appliedDiscount.name}</span>
                <span className="text-green-600">
                  خصم {appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `$${appliedDiscount.value}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const Icon = planIcons[plan.slug] || Star;
          const originalPrice = getPrice(plan);
          const finalPrice = getDiscountedPrice(originalPrice);
          const hasDiscount = appliedDiscount && finalPrice < originalPrice;

          return (
            <div
              key={plan._id}
              className={`relative bg-white rounded-3xl border-2 p-8 transition-all hover:shadow-xl ${
                plan.display.isPopular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.display.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${
                  plan.display.isPopular
                    ? 'from-blue-500 to-purple-600'
                    : 'from-gray-400 to-gray-600'
                } flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  {hasDiscount && (
                    <span className="text-2xl text-gray-400 line-through mr-2">
                      ${originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    ${finalPrice}
                  </span>
                  <span className="text-gray-600 ml-1">
                    /{billingCycle === 'monthly' ? 'شهر' : 'سنة'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.yearlySavingsPercentage > 0 && (
                  <div className="text-green-600 text-sm font-medium">
                    وفر {plan.yearlySavingsPercentage}% سنوياً
                  </div>
                )}
                {hasDiscount && (
                  <div className="text-green-600 text-sm font-medium">
                    خصم ${(originalPrice - finalPrice).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.slice(0, 8).map((feature) => (
                  <div key={feature.featureKey || feature.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature.name}</span>
                    </div>
                    {feature.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        feature.badge === 'قريباً' ? 'bg-yellow-100 text-yellow-800' :
                        feature.badge === 'حصري' ? 'bg-purple-100 text-purple-800' :
                        feature.badge === 'VIP' ? 'bg-red-100 text-red-800' :
                        feature.badge === 'متقدم' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                    {feature.limit && (
                      <span className="text-xs text-gray-500">
                        {feature.limit}
                      </span>
                    )}
                  </div>
                ))}
                {plan.features.length > 8 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{plan.features.length - 8} ميزة إضافية
                  </div>
                )}
              </div>

              {/* Trial Info */}
              {plan.trial.enabled && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-blue-800 font-medium mb-1">
                      تجربة مجانية لمدة {plan.trial.duration} أيام
                    </div>
                    <div className="text-blue-600 text-sm">
                      {plan.trial.requiresCreditCard
                        ? 'يتطلب بطاقة ائتمان'
                        : 'بدون الحاجة لبطاقة ائتمان'}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {plan.trial.enabled && (
                  <button
                    onClick={() => handleStartTrial(plan)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
                  >
                    ابدأ التجربة المجانية
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </button>
                )}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                    plan.display.isPopular
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  اختر هذه الخطة
                  <ArrowRight className="w-4 h-4 mr-2" />
                </button>
              </div>

              {/* Promo Offer */}
              {plan.promo.enabled && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="text-center">
                    <div className="text-yellow-800 font-medium text-sm">
                      🎉 عرض خاص: {plan.promo.description}
                    </div>
                    <div className="text-yellow-600 text-xs mt-1">
                      للمستخدمين الجدد فقط
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">أسئلة شائعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="text-right">
            <h3 className="font-semibold text-gray-900 mb-2">هل يمكنني تغيير الخطة لاحقاً؟</h3>
            <p className="text-gray-600 text-sm">نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من لوحة التحكم.</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-900 mb-2">ما هي طرق الدفع المقبولة؟</h3>
            <p className="text-gray-600 text-sm">نقبل جميع البطاقات الائتمانية الرئيسية وPayPal والتحويل البنكي.</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-900 mb-2">هل هناك رسوم إعداد؟</h3>
            <p className="text-gray-600 text-sm">لا، جميع خططنا لا تتضمن أي رسوم إعداد أو رسوم خفية.</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-900 mb-2">هل يمكنني إلغاء الاشتراك؟</h3>
            <p className="text-gray-600 text-sm">نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي التزامات.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPricingView;
