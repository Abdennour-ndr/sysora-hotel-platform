import { useState, useEffect, useContext, createContext } from 'react';

// Feature Access Context
const FeatureAccessContext = createContext();

// Feature Access Provider
export const FeatureAccessProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
    try {
      // Check if we're on landing page or login page - skip API call
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath.includes('login') || currentPath.includes('admin') || currentPath.includes('pricing')) {
        setSubscription({
          status: 'trial',
          planId: null,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
        });
        setFeatures({});
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('sysora_token');
      if (!token) {
        // No token means user is not logged in - set default trial state
        setSubscription({
          status: 'trial',
          planId: null,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
        });
        setFeatures({});
        setLoading(false);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/pricing/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        // Token is invalid, clear it and set trial state
        localStorage.removeItem('sysora_token');
        localStorage.removeItem('sysora_user');
        localStorage.removeItem('sysora_hotel');
        setSubscription({
          status: 'trial',
          planId: null,
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });
        setFeatures({});
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setSubscription(data.data.subscription);

        // Build features map for quick access
        const featuresMap = {};
        if (data.data.plan && data.data.plan.features) {
          data.data.plan.features.forEach(feature => {
            featuresMap[feature.featureKey] = {
              included: feature.included,
              limit: feature.limit,
              notes: feature.notes
            };
          });
        }
        setFeatures(featuresMap);
      }
    } catch (error) {
      console.error('Fetch subscription error:', error);
      // On error, set trial state
      setSubscription({
        status: 'trial',
        planId: null,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      });
      setFeatures({});
    } finally {
      setLoading(false);
    }
  };

  const hasFeature = (featureKey) => {
    if (loading) return false;
    return features[featureKey]?.included || false;
  };

  const getFeatureLimit = (featureKey) => {
    if (loading) return 0;
    return features[featureKey]?.limit || 0;
  };

  const isTrialExpired = () => {
    if (!subscription) return false;
    if (subscription.status !== 'trial') return false;
    return new Date() > new Date(subscription.endDate);
  };

  const getDaysRemaining = () => {
    if (!subscription) return 0;
    if (subscription.status !== 'trial') return 0;
    
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const getUpgradeUrl = (featureKey) => {
    return `/pricing?feature=${featureKey}&upgrade=true`;
  };

  const value = {
    subscription,
    features,
    loading,
    hasFeature,
    getFeatureLimit,
    isTrialExpired,
    getDaysRemaining,
    getUpgradeUrl,
    refreshSubscription: fetchSubscriptionDetails
  };

  return (
    <FeatureAccessContext.Provider value={value}>
      {children}
    </FeatureAccessContext.Provider>
  );
};

// Hook to use feature access
export const useFeatureAccess = () => {
  const context = useContext(FeatureAccessContext);
  if (!context) {
    throw new Error('useFeatureAccess must be used within a FeatureAccessProvider');
  }
  return context;
};

// Feature Gate Component
export const FeatureGate = ({ 
  featureKey, 
  children, 
  fallback = null, 
  showUpgrade = true,
  upgradeMessage = null 
}) => {
  const { hasFeature, loading, getUpgradeUrl, subscription } = useFeatureAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasFeature(featureKey)) {
    if (fallback) {
      return fallback;
    }

    if (showUpgrade) {
      return (
        <UpgradePrompt 
          featureKey={featureKey}
          message={upgradeMessage}
          upgradeUrl={getUpgradeUrl(featureKey)}
          planName={subscription?.plan || 'Trial'}
        />
      );
    }

    return null;
  }

  return children;
};

// Upgrade Prompt Component
const UpgradePrompt = ({ featureKey, message, upgradeUrl, planName }) => {
  const defaultMessage = `هذه الميزة غير متاحة في خطة ${planName}. قم بالترقية للوصول إليها.`;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        ميزة محدودة
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message || defaultMessage}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={upgradeUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors inline-flex items-center justify-center"
        >
          ترقية الخطة
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        
        <button
          onClick={() => window.history.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors"
        >
          العودة
        </button>
      </div>
    </div>
  );
};

// Trial Banner Component
export const TrialBanner = () => {
  const { subscription, isTrialExpired, getDaysRemaining } = useFeatureAccess();

  if (!subscription || subscription.status !== 'trial') {
    return null;
  }

  const daysRemaining = getDaysRemaining();
  const expired = isTrialExpired();

  if (expired) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-red-800">
                انتهت فترة التجربة المجانية
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>قم بترقية خطتك للاستمرار في استخدام جميع الميزات.</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/pricing"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ترقية الآن
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-l-4 p-4 mb-6 ${
      daysRemaining <= 1 
        ? 'bg-red-50 border-red-400' 
        : daysRemaining <= 3 
          ? 'bg-yellow-50 border-yellow-400'
          : 'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className={`h-5 w-5 ${
              daysRemaining <= 1 
                ? 'text-red-400' 
                : daysRemaining <= 3 
                  ? 'text-yellow-400'
                  : 'text-blue-400'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className={`text-sm font-medium ${
              daysRemaining <= 1 
                ? 'text-red-800' 
                : daysRemaining <= 3 
                  ? 'text-yellow-800'
                  : 'text-blue-800'
            }`}>
              التجربة المجانية - {daysRemaining} {daysRemaining === 1 ? 'يوم' : 'أيام'} متبقية
            </h3>
            <div className={`mt-2 text-sm ${
              daysRemaining <= 1 
                ? 'text-red-700' 
                : daysRemaining <= 3 
                  ? 'text-yellow-700'
                  : 'text-blue-700'
            }`}>
              <p>استمتع بجميع الميزات خلال فترة التجربة المجانية.</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <a
            href="/pricing"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              daysRemaining <= 1 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : daysRemaining <= 3 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            اختر خطتك
          </a>
        </div>
      </div>
    </div>
  );
};

export default useFeatureAccess;
