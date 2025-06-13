import React, { useState, useEffect } from 'react';
import { Play, X, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingDemoButton = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerHeight = 400; // Approximate footer height

      // Show after scrolling 30% of viewport height but hide before footer
      const showThreshold = windowHeight * 0.3;
      const hideThreshold = documentHeight - windowHeight - footerHeight;

      if (scrollPosition > showThreshold && scrollPosition < hideThreshold && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const translations = {
    ar: {
      text: "شاهد العرض التوضيحي",
      subtitle: "تجربة مجانية",
      dismiss: "إخفاء"
    },
    en: {
      text: "Watch Demo",
      subtitle: "Free Trial",
      dismiss: "Hide"
    },
    fr: {
      text: "Voir la Démo",
      subtitle: "Essai Gratuit",
      dismiss: "Masquer"
    }
  };

  const t = translations[language] || translations.en;

  const handleDemoClick = () => {
    window.open('/hotel-demo', '_blank');
    // Optional: Track analytics
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 translate-y-10 translate-x-10'
    }`} style={{ maxWidth: '280px' }}>
      
      {/* Main Button */}
      <div className="relative group">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-sysora-mint to-sysora-mint/80 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Button Content */}
        <button
          onClick={handleDemoClick}
          className="relative bg-gradient-to-r from-sysora-mint to-sysora-mint/90 hover:from-sysora-mint/90 hover:to-sysora-mint text-sysora-midnight font-semibold px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 border-2 border-white/20"
        >
          
          {/* Play Icon with Animation */}
          <div className="relative">
            <Play className="w-5 h-5" fill="currentColor" />
            <div className="absolute inset-0 bg-sysora-midnight/20 rounded-full animate-ping"></div>
          </div>
          
          {/* Text */}
          <div className="text-left">
            <div className="text-sm font-bold">{t.text}</div>
            <div className="text-xs opacity-80">{t.subtitle}</div>
          </div>
          
          {/* Sparkle Effect */}
          <Sparkles className="w-4 h-4 animate-pulse" />
        </button>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          title={t.dismiss}
        >
          <X className="w-3 h-3" />
        </button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-sysora-mint/30 rounded-2xl animate-ping opacity-20"></div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-sysora-midnight text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3" />
            <span>مشاهدة تفاعلية مباشرة</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-sysora-midnight"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingDemoButton;
