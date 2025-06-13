import React, { useState, useEffect } from 'react';
import { Play, Users, TrendingUp, Clock, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DemoTeaser = () => {
  const { language } = useLanguage();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const translations = {
    ar: {
      badge: "عرض مباشر",
      title: "شاهد النظام يعمل",
      subtitle: "تجربة حقيقية لإدارة فندق كامل",
      features: [
        "لوحة تحكم تفاعلية",
        "إدارة الحجوزات المباشرة", 
        "تقارير مالية فورية",
        "إدارة الغرف والخدمات"
      ],
      cta: "ابدأ العرض التوضيحي",
      stats: {
        users: "مستخدم نشط",
        rating: "تقييم",
        time: "دقائق تجربة"
      },
      benefits: [
        "بدون تسجيل",
        "بيانات حقيقية", 
        "تجربة كاملة"
      ]
    },
    en: {
      badge: "Live Demo",
      title: "See the System in Action",
      subtitle: "Real hotel management experience",
      features: [
        "Interactive Dashboard",
        "Live Booking Management",
        "Instant Financial Reports", 
        "Room & Service Management"
      ],
      cta: "Start Demo",
      stats: {
        users: "active users",
        rating: "rating",
        time: "minutes experience"
      },
      benefits: [
        "No Registration",
        "Real Data",
        "Full Experience"
      ]
    },
    fr: {
      badge: "Démo en Direct",
      title: "Voyez le Système en Action",
      subtitle: "Expérience réelle de gestion hôtelière",
      features: [
        "Tableau de Bord Interactif",
        "Gestion des Réservations en Direct",
        "Rapports Financiers Instantanés",
        "Gestion des Chambres et Services"
      ],
      cta: "Commencer la Démo",
      stats: {
        users: "utilisateurs actifs",
        rating: "note",
        time: "minutes d'expérience"
      },
      benefits: [
        "Sans Inscription",
        "Données Réelles",
        "Expérience Complète"
      ]
    }
  };

  const t = translations[language] || translations.en;

  // Auto-rotate features
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentFeature(prev => (prev + 1) % t.features.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, t.features.length]);

  const handleDemoClick = () => {
    window.open('/hotel-demo', '_blank');
  };

  return (
    <div className="relative bg-gradient-to-br from-sysora-midnight via-blue-900 to-sysora-midnight rounded-3xl p-8 text-white overflow-hidden group">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sysora-mint/10 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-sysora-mint/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-sysora-mint/20 text-sysora-mint rounded-full text-sm font-medium flex items-center space-x-2">
              <div className="w-2 h-2 bg-sysora-mint rounded-full animate-pulse"></div>
              <span>{t.badge}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm opacity-80">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>2.5K+ {t.stats.users}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9 {t.stats.rating}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t.title}</h3>
              <p className="text-sysora-mint text-lg">{t.subtitle}</p>
            </div>

            {/* Rotating Features */}
            <div 
              className="space-y-3"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {t.features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 transition-all duration-500 ${
                    index === currentFeature 
                      ? 'text-sysora-mint transform scale-105' 
                      : 'text-white/70'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index === currentFeature ? 'bg-sysora-mint' : 'bg-white/30'
                  }`}></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="flex items-center space-x-6 text-sm">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sysora-mint">
                  <div className="w-1.5 h-1.5 bg-sysora-mint rounded-full"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Demo Button */}
          <div className="text-center">
            
            {/* Main Demo Button */}
            <button
              onClick={handleDemoClick}
              className="relative group/btn w-full max-w-xs mx-auto"
            >
              
              {/* Button Background */}
              <div className="relative bg-gradient-to-r from-sysora-mint to-sysora-mint/90 hover:from-sysora-mint/90 hover:to-sysora-mint rounded-2xl p-6 transition-all duration-300 transform group-hover/btn:scale-105 shadow-2xl">
                
                {/* Play Icon */}
                <div className="relative mx-auto w-16 h-16 bg-sysora-midnight rounded-full flex items-center justify-center mb-4 group-hover/btn:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-sysora-mint ml-1" fill="currentColor" />
                  
                  {/* Pulse Rings */}
                  <div className="absolute inset-0 bg-sysora-mint/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-sysora-mint/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Text */}
                <div className="text-sysora-midnight">
                  <div className="text-lg font-bold mb-1">{t.cta}</div>
                  <div className="text-sm opacity-80">5 {t.stats.time}</div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-5 h-5 text-sysora-midnight mx-auto mt-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-sysora-mint to-sysora-mint/80 rounded-2xl blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity duration-300 -z-10"></div>
            </button>

            {/* Additional Info */}
            <div className="mt-4 text-xs text-white/60 flex items-center justify-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>
                {language === 'ar' ? 'يفتح في تبويب جديد' :
                 language === 'fr' ? 'Ouvre dans un nouvel onglet' :
                 'Opens in new tab'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTeaser;
