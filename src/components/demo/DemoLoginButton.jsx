import React, { useState } from 'react';
import { 
  Play, 
  Zap, 
  ArrowRight, 
  Shield, 
  Clock, 
  Database,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';

const DemoLoginButton = ({ 
  variant = 'primary', 
  size = 'default',
  showFeatures = true,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();

  // Multi-language texts
  const texts = {
    ar: {
      buttonText: "دخول مباشر للحساب التجريبي",
      loadingText: "جاري الدخول...",
      successText: "تم الدخول بنجاح!",
      successMessage: "مرحباً بك في الحساب التجريبي! جميع الميزات متاحة للاستكشاف.",
      errorMessage: "فشل في الدخول للحساب التجريبي. يرجى المحاولة مرة أخرى.",
      infoText: "✨ لا حاجة للتسجيل - دخول فوري للوحة التحكم الكاملة",
      features: {
        realData: { title: "بيانات حقيقية", description: "فندق كامل ببيانات واقعية" },
        allFeatures: { title: "جميع الميزات", description: "وصول كامل لجميع الوظائف" },
        secure: { title: "آمن تماماً", description: "بيئة تجريبية معزولة" },
        duration: { title: "24 ساعة", description: "جلسة تجريبية مفتوحة" }
      }
    },
    en: {
      buttonText: "Enter Demo Account",
      loadingText: "Logging in...",
      successText: "Login Successful!",
      successMessage: "Welcome to the demo account! All features are available for exploration.",
      errorMessage: "Failed to login to demo account. Please try again.",
      infoText: "✨ No registration required - instant access to full dashboard",
      features: {
        realData: { title: "Real Data", description: "Complete hotel with realistic data" },
        allFeatures: { title: "All Features", description: "Full access to all functions" },
        secure: { title: "Fully Secure", description: "Isolated demo environment" },
        duration: { title: "24 Hours", description: "Open demo session" }
      }
    },
    fr: {
      buttonText: "Accéder au Compte Démo",
      loadingText: "Connexion...",
      successText: "Connexion Réussie!",
      successMessage: "Bienvenue dans le compte démo! Toutes les fonctionnalités sont disponibles.",
      errorMessage: "Échec de la connexion au compte démo. Veuillez réessayer.",
      infoText: "✨ Aucune inscription requise - accès instantané au tableau de bord complet",
      features: {
        realData: { title: "Données Réelles", description: "Hôtel complet avec données réalistes" },
        allFeatures: { title: "Toutes les Fonctionnalités", description: "Accès complet à toutes les fonctions" },
        secure: { title: "Entièrement Sécurisé", description: "Environnement démo isolé" },
        duration: { title: "24 Heures", description: "Session démo ouverte" }
      }
    }
  };

  const t = texts[language] || texts.en;

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      console.log('🎭 Starting demo login...');

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

        // Show success state briefly
        setShowSuccess(true);

        // Show success message
        window.showToast && window.showToast(
          t.successMessage,
          'success'
        );

        // Redirect to dashboard immediately
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);

      } else {
        throw new Error(data.error || t.errorMessage);
      }

    } catch (error) {
      console.error('❌ Demo login error:', error);
      window.showToast && window.showToast(
        error.message || t.errorMessage,
        'error'
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sysora-mint/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    
    const sizeClasses = {
      small: "px-4 py-2 text-sm",
      default: "px-6 py-3 text-base",
      large: "px-8 py-4 text-lg"
    };

    const variantClasses = {
      primary: "bg-gradient-to-r from-sysora-mint to-green-400 text-sysora-midnight shadow-lg hover:shadow-xl",
      secondary: "bg-white text-sysora-midnight border-2 border-sysora-mint hover:bg-sysora-mint/10",
      outline: "border-2 border-sysora-mint text-sysora-mint hover:bg-sysora-mint hover:text-sysora-midnight"
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const demoFeatures = [
    {
      icon: Database,
      title: "بيانات حقيقية",
      description: "فندق كامل ببيانات واقعية"
    },
    {
      icon: Zap,
      title: "جميع الميزات",
      description: "وصول كامل لجميع الوظائف"
    },
    {
      icon: Shield,
      title: "آمن تماماً",
      description: "بيئة تجريبية معزولة"
    },
    {
      icon: Clock,
      title: "24 ساعة",
      description: "جلسة تجريبية مفتوحة"
    }
  ];

  if (showSuccess) {
    return (
      <div className={getButtonClasses()}>
        <CheckCircle className="w-5 h-5 mr-2" />
        <span>تم الدخول بنجاح!</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Demo Button */}
      <button
        onClick={handleDemoLogin}
        disabled={isLoading}
        className={getButtonClasses()}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span>جاري الدخول...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            <span>دخول مباشر للحساب التجريبي</span>
            <ArrowRight className="w-4 h-4 mr-2" />
          </>
        )}
      </button>

      {/* Demo Features */}
      {showFeatures && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {demoFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="p-1 bg-sysora-mint/10 rounded-lg">
                  <Icon className="w-4 h-4 text-sysora-mint" />
                </div>
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-xs text-gray-500">{feature.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Demo Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>✨ لا حاجة للتسجيل - دخول فوري للوحة التحكم الكاملة</p>
      </div>
    </div>
  );
};

export default DemoLoginButton;
