import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Eye, 
  Users, 
  Star, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Sparkles,
  MousePointer,
  Monitor
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DemoHook = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const translations = {
    ar: {
      badge: "عرض توضيحي مباشر",
      title: "شاهد النظام في العمل",
      subtitle: "اكتشف كيف يمكن لسيسورا تحويل إدارة فندقك في دقائق معدودة",
      features: [
        "لوحة تحكم حقيقية بالكامل",
        "بيانات فندق واقعية",
        "جميع الميزات متاحة",
        "تجربة تفاعلية كاملة"
      ],
      cta: "شاهد العرض التوضيحي",
      ctaSecondary: "تجربة مجانية لمدة 3 يوم",
      stats: {
        viewers: "مشاهدة",
        rating: "تقييم المستخدمين",
        time: "دقائق للاستكشاف"
      },
      testimonials: [
        {
          text: "العرض التوضيحي أقنعني فوراً. النظام بديهي ومتكامل.",
          author: "أحمد محمد",
          role: "مدير فندق الأحلام"
        },
        {
          text: "رأيت بالضبط ما أحتاجه لفندقي. التصميم رائع والوظائف شاملة.",
          author: "فاطمة علي", 
          role: "مالكة فندق النخيل"
        }
      ],
      urgency: "أكثر من '47' فندق يستخدم النظام الآن",
      interactive: {
        quality: "جودة عالية",
        interactive: "تفاعلي",
        liveData: "بيانات مباشرة"
      },
      secondaryCta: "أو شاهد العرض مباشرة"
    },
    en: {
      badge: "Live Demo",
      title: "See the System in Action",
      subtitle: "Discover how Sysora can transform your hotel management in minutes",
      features: [
        "Fully functional dashboard",
        "Real hotel data",
        "All features available", 
        "Complete interactive experience"
      ],
      cta: "Watch Demo",
      ctaSecondary: "3-Day Free Trial",
      stats: {
        viewers: "views",
        rating: "user rating",
        time: "minutes to explore"
      },
      testimonials: [
        {
          text: "The demo convinced me instantly. The system is intuitive and comprehensive.",
          author: "Ahmed Mohamed",
          role: "Dreams Hotel Manager"
        },
        {
          text: "I saw exactly what I need for my hotel. Great design and comprehensive features.",
          author: "Fatima Ali",
          role: "Palm Hotel Owner"
        }
      ],
      urgency: "Over 47 hotels are using the system now",
      interactive: {
        quality: "HD Quality",
        interactive: "Interactive",
        liveData: "Live Data"
      },
      secondaryCta: "Or watch demo directly"
    },
    fr: {
      badge: "Démo en Direct",
      title: "Voyez le Système en Action", 
      subtitle: "Découvrez comment Sysora peut transformer la gestion de votre hôtel en quelques minutes",
      features: [
        "Tableau de bord entièrement fonctionnel",
        "Données d'hôtel réelles",
        "Toutes les fonctionnalités disponibles",
        "Expérience interactive complète"
      ],
      cta: "Regarder la Démo",
      ctaSecondary: "Essai Gratuit de 3 Jours",
      stats: {
        viewers: "vues",
        rating: "note des utilisateurs", 
        time: "minutes pour explorer"
      },
      testimonials: [
        {
          text: "La démo m'a convaincu instantanément. Le système est intuitif et complet.",
          author: "Ahmed Mohamed",
          role: "Directeur Hôtel des Rêves"
        },
        {
          text: "J'ai vu exactement ce dont j'ai besoin pour mon hôtel. Design superbe et fonctionnalités complètes.",
          author: "Fatima Ali",
          role: "Propriétaire Hôtel Palm"
        }
      ],
      urgency: "Plus de 47 hôtels utilisent le système maintenant",
      interactive: {
        quality: "Qualité HD",
        interactive: "Interactif",
        liveData: "Données en Direct"
      },
      secondaryCta: "Ou regarder la démo directement"
    }
  };

  const t = translations[language] || translations.en;
  const testimonials = t.testimonials;

  const handleDemoClick = () => {
    // Add analytics tracking here
    window.open('/hotel-demo', '_blank');
  };

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-light via-white to-sysora-mint/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sysora-mint/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-sysora-midnight/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-max relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sysora-mint/20 to-sysora-mint/10 text-sysora-mint px-6 py-3 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>{t.badge}</span>
              <Play className="w-4 h-4" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-sysora-midnight mb-6">
              {t.title}
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-2xl shadow-card">
                  <div className="text-2xl font-bold text-sysora-mint mb-1">2.5K+</div>
                  <div className="text-sm text-gray-600">{t.stats.viewers}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-card">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-sysora-mint">4.9</span>
                    <Star className="w-5 h-5 text-yellow-400 ml-1 fill-current" />
                  </div>
                  <div className="text-sm text-gray-600">{t.stats.rating}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-card">
                  <div className="text-2xl font-bold text-sysora-mint mb-1">5</div>
                  <div className="text-sm text-gray-600">{t.stats.time}</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {t.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 transition-all duration-500 delay-${index * 100}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white p-6 rounded-2xl shadow-card border-l-4 border-sysora-mint">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-sysora-mint" />
                  </div>
                  <div>
                    <p className="text-gray-700 italic mb-3">"{testimonials[currentTestimonial].text}"</p>
                    <div>
                      <p className="font-semibold text-sysora-midnight">{testimonials[currentTestimonial].author}</p>
                      <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-800 font-medium">{t.urgency}</span>
                </div>
              </div>
            </div>

            {/* Right Content - Demo Preview */}
            <div className="relative">
              
              {/* Main Demo Button */}
              <div className="relative group cursor-pointer" onClick={handleDemoClick}>
                <div className="absolute inset-0 bg-gradient-to-r from-sysora-mint to-sysora-mint/80 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-sysora-midnight via-sysora-midnight to-blue-900 rounded-3xl p-8 text-white overflow-hidden">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative text-center space-y-6">
                    
                    {/* Play Button */}
                    <div className="relative mx-auto w-24 h-24 bg-sysora-mint rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <Play className="w-10 h-10 text-sysora-midnight ml-1" fill="currentColor" />
                      
                      {/* Pulse Animation */}
                      <div className="absolute inset-0 bg-sysora-mint rounded-full animate-ping opacity-75"></div>
                      <div className="absolute inset-2 bg-sysora-mint/50 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{t.cta}</h3>
                      <p className="text-sysora-mint text-lg">{t.ctaSecondary}</p>
                    </div>

                    {/* Interactive Elements */}
                    <div className="flex items-center justify-center space-x-6 text-sm opacity-90">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>{t.interactive.quality}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MousePointer className="w-4 h-4" />
                        <span>{t.interactive.interactive}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>{t.interactive.liveData}</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-sysora-mint/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleDemoClick}
                  className="inline-flex items-center space-x-2 text-sysora-mint hover:text-sysora-midnight transition-colors font-medium group"
                >
                  <span>{t.secondaryCta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoHook;
