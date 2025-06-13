import React from 'react';
import { Crown, Sparkles, Zap, Lock, ArrowRight } from 'lucide-react';

const FeatureGateButton = ({ 
  featureKey, 
  children, 
  currentPlan = 'basic',
  requiredPlan = 'premium',
  onClick,
  className = '',
  disabled = false
}) => {
  const planHierarchy = {
    'basic': 1,
    'standard': 2, 
    'premium': 3,
    'enterprise': 4
  };

  const isFeatureLocked = planHierarchy[currentPlan] < planHierarchy[requiredPlan];

  const planIcons = {
    'standard': Zap,
    'premium': Crown,
    'enterprise': Sparkles
  };

  const planColors = {
    'standard': 'from-blue-500 to-blue-600',
    'premium': 'from-purple-500 to-purple-600', 
    'enterprise': 'from-indigo-500 to-indigo-600'
  };

  const planNames = {
    'basic': 'الأساسية',
    'standard': 'المتقدمة',
    'premium': 'المميزة',
    'enterprise': 'المؤسسية'
  };

  const handleClick = () => {
    if (isFeatureLocked) {
      // Show upgrade modal
      showUpgradeModal(featureKey, requiredPlan);
    } else if (onClick) {
      onClick();
    }
  };

  const showUpgradeModal = (feature, plan) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    const PlanIcon = planIcons[plan] || Crown;
    
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center transform animate-pulse">
        <div class="w-20 h-20 bg-gradient-to-br ${planColors[plan]} rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-3">
          🚀 ارتق لمستوى أعلى!
        </h3>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          هذه الميزة متاحة فقط في خطة <span class="font-semibold text-purple-600">${planNames[plan]}</span>
          <br>
          <span class="text-sm">استمتع بميزات أكثر وإمكانيات لا محدودة</span>
        </p>
        
        <div class="bg-gradient-to-r ${planColors[plan]} rounded-2xl p-4 mb-6 text-white">
          <div class="flex items-center justify-center mb-2">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="font-semibold">ميزات حصرية في انتظارك</span>
          </div>
          <div class="text-sm opacity-90">
            ✨ إمكانيات متقدمة • 🎯 دعم أولوية • 🚀 أداء محسن
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            onclick="window.location.href='/pricing'" 
            class="flex-1 bg-gradient-to-r ${planColors[plan]} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <span>ترقية الآن</span>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
          <button 
            onclick="this.closest('.fixed').remove()" 
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            لاحقاً
          </button>
        </div>
        
        <div class="mt-4 text-xs text-gray-500">
          💡 يمكنك الترقية أو التراجع في أي وقت
        </div>
      </div>
    `;
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
    
    // Add animation
    setTimeout(() => {
      modal.querySelector('.bg-white').classList.remove('animate-pulse');
      modal.querySelector('.bg-white').classList.add('animate-bounce');
      setTimeout(() => {
        modal.querySelector('.bg-white').classList.remove('animate-bounce');
      }, 1000);
    }, 100);
  };

  if (isFeatureLocked) {
    const PlanIcon = planIcons[requiredPlan] || Crown;
    
    return (
      <div className="relative group">
        <button
          onClick={handleClick}
          className={`${className} relative overflow-hidden bg-gradient-to-r ${planColors[requiredPlan]} text-white hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={disabled}
        >
          <div className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            {children}
            <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {planNames[requiredPlan]}
            </span>
          </div>
          
          {/* Sparkle animation */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          متاح في خطة {planNames[requiredPlan]}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${className} hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default FeatureGateButton;
