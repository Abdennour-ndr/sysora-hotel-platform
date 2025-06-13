import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Available languages - Currently English only
  const languages = {
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
      flag: '🇺🇸'
    }
    // Arabic and French temporarily disabled
    // Will be re-enabled after proper localization
    // ar: {
    //   code: 'ar',
    //   name: 'Arabic',
    //   nativeName: 'العربية',
    //   direction: 'rtl',
    //   flag: '🇸🇦'
    // },
    // fr: {
    //   code: 'fr',
    //   name: 'French',
    //   nativeName: 'Français',
    //   direction: 'ltr',
    //   flag: '🇫🇷'
    // }
  };

  // Load language from localStorage on mount - Force English only
  useEffect(() => {
    const savedLanguage = localStorage.getItem('sysora_language');
    // Force English language only for now
    if (savedLanguage && savedLanguage === 'en' && languages[savedLanguage]) {
      changeLanguage(savedLanguage);
    } else {
      // Always default to English
      changeLanguage('en');
    }
  }, []);

  // Update document direction and language
  useEffect(() => {
    const lang = languages[currentLanguage];
    if (lang) {
      // Update document attributes
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.direction;

      // Update body classes
      document.body.classList.remove('rtl', 'ltr');
      document.body.classList.add(lang.direction);

      // Update root element classes
      document.documentElement.classList.remove('rtl', 'ltr');
      document.documentElement.classList.add(lang.direction);

      // Set RTL state
      setIsRTL(lang.direction === 'rtl');

      // Force re-render of layout
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    // Only allow English for now
    if (languageCode === 'en' && languages[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('sysora_language', languageCode);
    } else {
      // Force English if any other language is requested
      setCurrentLanguage('en');
      localStorage.setItem('sysora_language', 'en');
    }
  };

  const getCurrentLanguage = () => languages[currentLanguage];

  const value = useMemo(() => ({
    language: currentLanguage,
    currentLanguage,
    languages,
    isRTL,
    changeLanguage,
    getCurrentLanguage,
    t: (key, params = {}) => translate(key, currentLanguage, params)
  }), [currentLanguage, isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Translation function
const translate = (key, language, params = {}) => {
  const translations = getTranslations();
  const keys = key.split('.');
  let value = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  if (typeof value === 'string') {
    // Replace parameters in the translation
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }

  // Fallback to English if translation not found
  if (language !== 'en') {
    return translate(key, 'en', params);
  }

  // Return key if no translation found
  return key;
};

// Translations object
const getTranslations = () => ({
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    },
    navigation: {
      home: 'Home',
      about: 'About',
      features: 'Features',
      pricing: 'Pricing',
      contact: 'Contact',
      dashboard: 'Dashboard',
      profile: 'Profile'
    },

    landing: {
      hero: {
        title: 'Smart Hotel Management Platform',
        subtitle: 'Streamline your hotel operations with our comprehensive management system',
        cta: 'Get Started',
        demo: 'View Demo'
      },
      features: {
        title: 'Powerful Features',
        subtitle: 'Everything you need to manage your hotel efficiently',
        reservation: {
          title: 'Reservation Management',
          description: 'Manage bookings, check-ins, and check-outs seamlessly'
        },
        rooms: {
          title: 'Room Management',
          description: 'Track room availability, pricing, and maintenance'
        },
        billing: {
          title: 'Billing & Invoicing',
          description: 'Generate invoices and manage payments automatically'
        },
        analytics: {
          title: 'Analytics & Reports',
          description: 'Get insights into your hotel performance'
        }
      },
      pricing: {
        title: 'Choose Your Plan',
        subtitle: 'Flexible pricing for hotels of all sizes',
        monthly: 'Monthly',
        yearly: 'Yearly',
        basic: {
          name: 'Basic',
          price: '$29',
          description: 'Perfect for small hotels',
          features: [
            'Up to 20 rooms',
            'Basic reporting',
            'Email support',
            'Mobile app access'
          ]
        },
        standard: {
          name: 'Standard',
          price: '$59',
          description: 'Great for growing hotels',
          features: [
            'Up to 50 rooms',
            'Advanced reporting',
            'Priority support',
            'API access',
            'Custom branding'
          ]
        },
        premium: {
          name: 'Premium',
          price: '$99',
          description: 'For large hotel chains',
          features: [
            'Unlimited rooms',
            'Advanced analytics',
            '24/7 support',
            'White-label solution',
            'Custom integrations'
          ]
        }
      }
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'System Administrator',
      welcome: 'Welcome, {{name}}!',
      overview: {
        title: 'Overview',
        description: 'Platform statistics and insights',
        totalHotels: 'Total Hotels',
        activeUsers: 'Active Users',
        activeHotels: 'Active Hotels',
        trialPeriod: 'Trial Period'
      },
      hotels: {
        title: 'Hotel Management',
        description: 'View and manage all registered hotels',
        status: 'Status',
        plan: 'Plan',
        registrationDate: 'Registration Date',
        actions: 'Actions'
      },
      users: {
        title: 'User Management',
        description: 'Manage all platform users',
        role: 'Role',
        hotel: 'Hotel',
        lastLogin: 'Last Login'
      },
      analytics: {
        title: 'Advanced Analytics',
        description: 'Detailed reports and platform performance'
      },
      settings: {
        title: 'System Settings',
        description: 'Manage platform configurations'
      },
      recentActivity: 'Recent Activity'
    },
    hotel: {
      dashboard: {
        title: 'Hotel Dashboard',
        welcome: 'Welcome to {{hotelName}}',
        overview: 'Overview',
        rooms: 'Rooms',
        reservations: 'Reservations',
        guests: 'Guests',
        billing: 'Billing',
        reports: 'Reports'
      },
      rooms: {
        title: 'Room Management',
        available: 'Available',
        occupied: 'Occupied',
        maintenance: 'Maintenance',
        cleaning: 'Cleaning'
      },
      reservations: {
        title: 'Reservations',
        checkIn: 'Check In',
        checkOut: 'Check Out',
        guest: 'Guest',
        room: 'Room',
        status: 'Status'
      }
    },
    auth: {
      signIn: 'Sign In',
      getStarted: 'Get Started',
      signUp: 'Sign Up',
      login: {
        title: 'Sign In',
        subtitle: 'Welcome back to Sysora',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        signUp: 'Sign Up'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join Sysora today',
        hasAccount: 'Already have an account?',
        signIn: 'Sign In'
      },
      adminLogin: {
        title: 'Admin Login',
        subtitle: 'Access admin dashboard'
      }
    }
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      export: 'تصدير',
      import: 'استيراد',
      refresh: 'تحديث',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم',
      phone: 'الهاتف',
      address: 'العنوان',
      city: 'المدينة',
      country: 'البلد',
      submit: 'إرسال',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      open: 'فتح',
      yes: 'نعم',
      no: 'لا',
      confirm: 'تأكيد',
      success: 'نجح',
      error: 'خطأ',
      warning: 'تحذير',
      info: 'معلومات'
    },
    navigation: {
      home: 'الرئيسية',
      about: 'حول',
      features: 'الميزات',
      pricing: 'التسعير',
      contact: 'اتصل بنا',
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي'
    },
    landing: {
      hero: {
        title: 'منصة إدارة الفنادق الذكية',
        subtitle: 'قم بتبسيط عمليات فندقك مع نظام الإدارة الشامل',
        cta: 'ابدأ الآن',
        demo: 'عرض تجريبي'
      },
      features: {
        title: 'مميزات قوية',
        subtitle: 'كل ما تحتاجه لإدارة فندقك بكفاءة',
        reservation: {
          title: 'إدارة الحجوزات',
          description: 'إدارة الحجوزات وتسجيل الوصول والمغادرة بسلاسة'
        },
        rooms: {
          title: 'إدارة الغرف',
          description: 'تتبع توفر الغرف والأسعار والصيانة'
        },
        billing: {
          title: 'الفواتير والمحاسبة',
          description: 'إنشاء الفواتير وإدارة المدفوعات تلقائياً'
        },
        analytics: {
          title: 'التحليلات والتقارير',
          description: 'احصل على رؤى حول أداء فندقك'
        }
      },
      pricing: {
        title: 'اختر خطتك',
        subtitle: 'أسعار مرنة للفنادق من جميع الأحجام',
        monthly: 'شهري',
        yearly: 'سنوي',
        basic: {
          name: 'أساسي',
          price: '109 ريال',
          description: 'مثالي للفنادق الصغيرة',
          features: [
            'حتى 20 غرفة',
            'تقارير أساسية',
            'دعم بريد إلكتروني',
            'وصول للتطبيق المحمول'
          ]
        },
        standard: {
          name: 'قياسي',
          price: '221 ريال',
          description: 'رائع للفنادق النامية',
          features: [
            'حتى 50 غرفة',
            'تقارير متقدمة',
            'دعم أولوية',
            'وصول API',
            'علامة تجارية مخصصة'
          ]
        },
        premium: {
          name: 'مميز',
          price: '371 ريال',
          description: 'لسلاسل الفنادق الكبيرة',
          features: [
            'غرف غير محدودة',
            'تحليلات متقدمة',
            'دعم 24/7',
            'حل العلامة البيضاء',
            'تكاملات مخصصة'
          ]
        }
      }
    },
    admin: {
      title: 'لوحة المشرفين',
      subtitle: 'مشرف النظام',
      welcome: 'مرحباً، {{name}}!',
      overview: {
        title: 'نظرة عامة',
        description: 'إحصائيات ورؤى المنصة',
        totalHotels: 'إجمالي الفنادق',
        activeUsers: 'المستخدمين النشطين',
        activeHotels: 'الفنادق النشطة',
        trialPeriod: 'الفترة التجريبية'
      },
      hotels: {
        title: 'إدارة الفنادق',
        description: 'عرض وإدارة جميع الفنادق المسجلة',
        status: 'الحالة',
        plan: 'الخطة',
        registrationDate: 'تاريخ التسجيل',
        actions: 'الإجراءات'
      },
      users: {
        title: 'إدارة المستخدمين',
        description: 'إدارة جميع مستخدمي المنصة',
        role: 'الدور',
        hotel: 'الفندق',
        lastLogin: 'آخر دخول'
      },
      analytics: {
        title: 'التحليلات المتقدمة',
        description: 'تقارير مفصلة وأداء المنصة'
      },
      settings: {
        title: 'إعدادات النظام',
        description: 'إدارة تكوينات المنصة'
      },
      recentActivity: 'النشاط الأخير'
    },
    hotel: {
      dashboard: {
        title: 'لوحة تحكم الفندق',
        welcome: 'مرحباً بك في {{hotelName}}',
        overview: 'نظرة عامة',
        rooms: 'الغرف',
        reservations: 'الحجوزات',
        guests: 'النزلاء',
        billing: 'الفواتير',
        reports: 'التقارير'
      },
      rooms: {
        title: 'إدارة الغرف',
        available: 'متاحة',
        occupied: 'مشغولة',
        maintenance: 'صيانة',
        cleaning: 'تنظيف'
      },
      reservations: {
        title: 'الحجوزات',
        checkIn: 'تسجيل الوصول',
        checkOut: 'تسجيل المغادرة',
        guest: 'النزيل',
        room: 'الغرفة',
        status: 'الحالة'
      }
    },
    auth: {
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      signUp: 'إنشاء حساب',
      login: {
        title: 'تسجيل الدخول',
        subtitle: 'مرحباً بعودتك إلى Sysora',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        signUp: 'إنشاء حساب'
      },
      register: {
        title: 'إنشاء حساب',
        subtitle: 'انضم إلى Sysora اليوم',
        hasAccount: 'لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول'
      },
      adminLogin: {
        title: 'دخول المشرفين',
        subtitle: 'الوصول إلى لوحة المشرفين'
      }
    }
  },
  fr: {
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      search: 'Rechercher',
      filter: 'Filtrer',
      export: 'Exporter',
      import: 'Importer',
      refresh: 'Actualiser',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: "S'inscrire",
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      submit: 'Soumettre',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      open: 'Ouvrir',
      yes: 'Oui',
      no: 'Non',
      confirm: 'Confirmer',
      success: 'Succès',
      error: 'Erreur',
      warning: 'Avertissement',
      info: 'Information'
    },
    navigation: {
      home: 'Accueil',
      about: 'À propos',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      contact: 'Contact',
      dashboard: 'Tableau de bord',
      profile: 'Profil'
    },
    landing: {
      hero: {
        title: 'Plateforme de Gestion Hôtelière Intelligente',
        subtitle: 'Rationalisez vos opérations hôtelières avec notre système de gestion complet',
        cta: 'Commencer',
        demo: 'Voir la démo'
      },
      features: {
        title: 'Fonctionnalités Puissantes',
        subtitle: 'Tout ce dont vous avez besoin pour gérer votre hôtel efficacement',
        reservation: {
          title: 'Gestion des Réservations',
          description: 'Gérez les réservations, les arrivées et les départs en toute fluidité'
        },
        rooms: {
          title: 'Gestion des Chambres',
          description: 'Suivez la disponibilité, les prix et la maintenance des chambres'
        },
        billing: {
          title: 'Facturation et Paiements',
          description: 'Générez des factures et gérez les paiements automatiquement'
        },
        analytics: {
          title: 'Analyses et Rapports',
          description: 'Obtenez des insights sur les performances de votre hôtel'
        }
      },
      pricing: {
        title: 'Choisissez Votre Plan',
        subtitle: 'Tarification flexible pour les hôtels de toutes tailles',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        basic: {
          name: 'Basique',
          price: '29€',
          description: 'Parfait pour les petits hôtels',
          features: [
            "Jusqu'à 20 chambres",
            'Rapports de base',
            'Support par email',
            "Accès à l'application mobile"
          ]
        },
        standard: {
          name: 'Standard',
          price: '59€',
          description: 'Idéal pour les hôtels en croissance',
          features: [
            "Jusqu'à 50 chambres",
            'Rapports avancés',
            'Support prioritaire',
            'Accès API',
            'Marque personnalisée'
          ]
        },
        premium: {
          name: 'Premium',
          price: '99€',
          description: 'Pour les grandes chaînes hôtelières',
          features: [
            'Chambres illimitées',
            'Analyses avancées',
            'Support 24/7',
            'Solution en marque blanche',
            'Intégrations personnalisées'
          ]
        }
      }
    },
    admin: {
      title: 'Tableau de Bord Admin',
      subtitle: 'Administrateur Système',
      welcome: 'Bienvenue, {{name}} !',
      overview: {
        title: 'Vue d\'ensemble',
        description: 'Statistiques et insights de la plateforme',
        totalHotels: 'Total des Hôtels',
        activeUsers: 'Utilisateurs Actifs',
        activeHotels: 'Hôtels Actifs',
        trialPeriod: 'Période d\'Essai'
      },
      hotels: {
        title: 'Gestion des Hôtels',
        description: 'Voir et gérer tous les hôtels enregistrés',
        status: 'Statut',
        plan: 'Plan',
        registrationDate: "Date d'inscription",
        actions: 'Actions'
      },
      users: {
        title: 'Gestion des Utilisateurs',
        description: 'Gérer tous les utilisateurs de la plateforme',
        role: 'Rôle',
        hotel: 'Hôtel',
        lastLogin: 'Dernière connexion'
      },
      analytics: {
        title: 'Analyses Avancées',
        description: 'Rapports détaillés et performance de la plateforme'
      },
      settings: {
        title: 'Paramètres Système',
        description: 'Gérer les configurations de la plateforme'
      },
      recentActivity: 'Activité Récente'
    },
    hotel: {
      dashboard: {
        title: 'Tableau de Bord Hôtel',
        welcome: 'Bienvenue à {{hotelName}}',
        overview: 'Vue d\'ensemble',
        rooms: 'Chambres',
        reservations: 'Réservations',
        guests: 'Clients',
        billing: 'Facturation',
        reports: 'Rapports'
      },
      rooms: {
        title: 'Gestion des Chambres',
        available: 'Disponible',
        occupied: 'Occupée',
        maintenance: 'Maintenance',
        cleaning: 'Nettoyage'
      },
      reservations: {
        title: 'Réservations',
        checkIn: 'Arrivée',
        checkOut: 'Départ',
        guest: 'Client',
        room: 'Chambre',
        status: 'Statut'
      }
    },
    auth: {
      signIn: 'Se connecter',
      getStarted: 'Commencer',
      signUp: "S'inscrire",
      login: {
        title: 'Se Connecter',
        subtitle: 'Bon retour sur Sysora',
        forgotPassword: 'Mot de passe oublié ?',
        noAccount: "Vous n'avez pas de compte ?",
        signUp: "S'inscrire"
      },
      register: {
        title: 'Créer un Compte',
        subtitle: 'Rejoignez Sysora aujourd\'hui',
        hasAccount: 'Vous avez déjà un compte ?',
        signIn: 'Se connecter'
      },
      adminLogin: {
        title: 'Connexion Admin',
        subtitle: "Accéder au tableau de bord admin"
      }
    }
  }
});

export default LanguageProvider;
