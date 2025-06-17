import React, { useState, useEffect } from 'react';
import { Play, X, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DemoLoginButton from './demo/DemoLoginButton';

const StickyDemoButton = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show after scrolling 20% of viewport height
      if (scrollPosition > windowHeight * 0.2 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Auto expand for a few seconds when first shown
  useEffect(() => {
    if (isVisible && !isDismissed) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isDismissed]);

  const translations = {
    ar: {
      text: "شاهد العرض",
      expandedText: "شاهد العرض التوضيحي",
      subtitle: "تجربة مجانية",
      dismiss: "إخفاء",
      tooltip: "انقر لمشاهدة العرض التوضيحي"
    },
    en: {
      text: "Watch Demo",
      expandedText: "Watch Demo",
      subtitle: "Free Trial",
      dismiss: "Hide",
      tooltip: "Click to watch demo"
    },
    fr: {
      text: "Voir Démo",
      expandedText: "Voir la Démo",
      subtitle: "Essai Gratuit",
      dismiss: "Masquer",
      tooltip: "Cliquez pour voir la démo"
    }
  };

  const t = translations[language] || translations.en;

  const handleDemoClick = async () => {
    try {
      console.log('🎭 Starting demo login from StickyDemoButton...');

      // Call demo login API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://sysora-hotel-platform.fly.dev'}/api/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Demo login successful:', data.data);

        // Store authentication data directly in localStorage
        localStorage.setItem('sysora_token', data.data.token);
        localStorage.setItem('sysora_user', JSON.stringify(data.data.user));
        localStorage.setItem('sysora_hotel', JSON.stringify(data.data.hotel));

        // Show success message
        window.showToast && window.showToast(
          'مرحباً بك في الحساب التجريبي! جميع الميزات متاحة للاستكشاف.',
          'success'
        );

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);

      } else {
        throw new Error(data.error || 'فشل في الدخول للحساب التجريبي');
      }

    } catch (error) {
      console.error('❌ Demo login error:', error);
      window.showToast && window.showToast(
        error.message || 'فشل في الدخول للحساب التجريبي. يرجى المحاولة مرة أخرى.',
        'error'
      );
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      
      {/* Main Button Container */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-l from-sysora-mint to-sysora-mint/80 rounded-l-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Button Content */}
        <div className={`relative bg-gradient-to-l from-sysora-mint to-sysora-mint/90 text-sysora-midnight rounded-l-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-64' : 'w-16'
        }`}>
          
          {/* Demo Login Button */}
          <div className="w-full h-16 flex items-center justify-center">
            <DemoLoginButton
              variant="primary"
              size={isExpanded ? "medium" : "small"}
              showFeatures={false}
              className="w-full h-full flex items-center justify-center hover:bg-sysora-mint/90 transition-colors duration-200"
            />
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-sysora-mint/30 rounded-l-2xl animate-ping opacity-20"></div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
          title={t.dismiss}
        >
          <X className="w-3 h-3" />
        </button>

        {/* Tooltip for compact view */}
        {!isExpanded && (
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-sysora-midnight text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <Eye className="w-3 h-3" />
                <span>{t.tooltip}</span>
              </div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-sysora-midnight"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyDemoButton;
