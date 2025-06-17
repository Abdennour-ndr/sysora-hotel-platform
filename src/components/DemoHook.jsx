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
import DemoLoginButton from './demo/DemoLoginButton';

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
      badge: "حساب تجريبي مباشر",
      title: "ادخل للنظام مباشرة",
      subtitle: "جرب سيسورا بحساب تجريبي حقيقي - لوحة تحكم كاملة ببيانات فعلية",
      features: [
        "دخول فوري بدون تسجيل",
        "لوحة تحكم حقيقية بالكامل",
        "بيانات فندق واقعية",
        "جميع الميزات متاحة للاستكشاف"
      ],
      cta: "دخول مباشر للحساب التجريبي",
      ctaSecondary: "جلسة 24 ساعة مجانية",
      stats: {
        viewers: "مشاهدة",
        rating: "تقييم المستخدمين",
        time: "دقائق للاستكشاف"
      },
      testimonials: [
        {
          text: "الحساب التجريبي أقنعني فوراً. دخلت مباشرة وجربت كل شيء.",
          author: "أحمد محمد",
          role: "مدير فندق الأحلام"
        },
        {
          text: "رائع! لوحة تحكم حقيقية ببيانات فعلية. جربت كل الميزات بدون تسجيل.",
          author: "فاطمة علي",
          role: "مالكة فندق النخيل"
        }
      ],
      urgency: "جرب الآن - حساب تجريبي فوري بدون تسجيل",
      interactive: {
        quality: "جودة عالية",
        interactive: "تفاعلي",
        liveData: "بيانات مباشرة"
      },
      secondaryCta: "أو شاهد العرض مباشرة"
    },
    en: {
      badge: "Live Demo Account",
      title: "Enter the System Directly",
      subtitle: "Try Sysora with a real demo account - full dashboard with actual data",
      features: [
        "Instant access without registration",
        "Fully functional dashboard",
        "Real hotel data",
        "All features available to explore"
      ],
      cta: "Enter Demo Account",
      ctaSecondary: "24-Hour Free Session",
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

  const handleDemoClick = async () => {
    try {
      console.log('🎭 Starting demo login from DemoHook...');

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
              
              {/* Demo Login Button */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-sysora-midnight mb-2">{t.cta}</h3>
                  <p className="text-gray-600">{t.ctaSecondary}</p>
                </div>

                <DemoLoginButton
                  variant="primary"
                  size="large"
                  showFeatures={true}
                  className="w-full"
                />

                {/* Interactive Elements */}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mt-6 pt-6 border-t border-gray-100">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoHook;
