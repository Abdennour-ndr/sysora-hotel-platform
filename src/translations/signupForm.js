export const signupFormTranslations = {
  en: {
    // Header
    title: "Create Hotel Workspace",
    subtitle: "Start your 3-day free trial",
    
    // Progress
    step: "Step",
    of: "of",
    
    // Step 1: Account Info
    step1: {
      title: "Account Information",
      subtitle: "Enter your personal information to create your account",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      fullNameRequired: "Full name is required",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      emailRequired: "Email address is required",
      emailInvalid: "Please enter a valid email address",
      emailExists: "This email is already in use",
      emailAvailable: "Email is available!",
      clearTestData: "Clear test data (for testing only)",
      password: "Password",
      passwordPlaceholder: "Enter a strong password",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      passwordMismatch: "Passwords do not match"
    },
    
    // Step 2: Plan Selection
    step2: {
      title: "Choose Your Plan",
      subtitle: "All plans start at $1 for the first 3 months",
      plans: {
        basic: {
          name: "Basic",
          description: "Perfect for small hotels",
          period: "First 3 months",
          features: [
            "Up to 20 rooms",
            "Basic booking management",
            "Basic reports",
            "Email support"
          ]
        },
        standard: {
          name: "Standard",
          description: "Most popular for medium hotels",
          period: "First 3 months",
          features: [
            "Up to 100 rooms",
            "Comprehensive booking management",
            "Advanced reports",
            "Guest and billing management",
            "24/7 phone support"
          ]
        },
        premium: {
          name: "Premium",
          description: "For large hotels and chains",
          period: "First 3 months",
          features: [
            "Unlimited rooms",
            "All advanced features",
            "AI-powered analytics",
            "External system integration",
            "Dedicated account manager"
          ]
        }
      },
      popular: "Most Popular"
    },
    
    // Step 3: Hotel Setup
    step3: {
      title: "Hotel Setup",
      subtitle: "Enter your hotel information to complete setup",
      companyName: "Hotel/Company Name",
      companyNamePlaceholder: "Enter your hotel or company name",
      companyNameRequired: "Hotel/Company name is required",
      employeeCount: "Number of Employees",
      employeeCountPlaceholder: "Select number of employees",
      employeeCountRequired: "Please select number of employees",
      employeeOptions: {
        "1-10": "1-10 employees",
        "11-50": "11-50 employees",
        "51-200": "51-200 employees",
        "201+": "201+ employees"
      },
      subdomain: "Subdomain",
      subdomainPlaceholder: "yourhotel",
      subdomainRequired: "Subdomain is required",
      subdomainMinLength: "Subdomain must be at least 3 characters",
      subdomainInvalid: "Subdomain can only contain letters, numbers, and hyphens",
      subdomainUnavailable: "This subdomain is not available",
      subdomainAvailable: "Subdomain is available!"
    },
    
    // Buttons
    buttons: {
      next: "Next",
      back: "Back",
      finish: "Create Workspace",
      close: "Close",
      switchToLogin: "Already have an account? Sign in"
    },
    
    // Success
    success: {
      title: "Welcome to Sysora!",
      subtitle: "Your hotel workspace is being set up. You will be redirected to the dashboard soon.",
      workspace: "Your workspace:",
      setting: "Setting up workspace..."
    },
    
    // Landing Section
    landing: {
      title: "Start Your Journey with Sysora",
      subtitle: "Join thousands of hotels that trust Sysora to manage their operations",
      button: "Create Hotel Workspace"
    },

    // Footer
    footer: {
      switchToLogin: "Already have an account? Sign In",
      terms: "By creating an account, you agree to our",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy"
    },

    // Errors
    errors: {
      registrationFailed: "Registration failed. Please try again.",
      networkError: "Network error. Please check your internet connection."
    }
  },
  
  ar: {
    // Header
    title: "إنشاء مساحة عمل الفندق",
    subtitle: "ابدأ تجربتك المجانية لمدة 3 أيام",
    
    // Progress
    step: "الخطوة",
    of: "من",
    
    // Step 1: Account Info
    step1: {
      title: "معلومات الحساب",
      subtitle: "أدخل معلوماتك الشخصية لإنشاء حسابك",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      fullNameRequired: "الاسم الكامل مطلوب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
      emailExists: "هذا البريد الإلكتروني مستخدم بالفعل",
      emailAvailable: "البريد الإلكتروني متاح!",
      clearTestData: "مسح البيانات التجريبية (للاختبار فقط)",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة مرور قوية",
      passwordRequired: "كلمة المرور مطلوبة",
      passwordMinLength: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
      passwordMismatch: "كلمات المرور غير متطابقة"
    },
    
    // Step 2: Plan Selection
    step2: {
      title: "اختر باقتك",
      subtitle: "جميع الباقات تبدأ بـ $1 لأول 3 أشهر",
      plans: {
        basic: {
          name: "أساسي",
          description: "مثالي للفنادق الصغيرة",
          period: "أول 3 أشهر",
          features: [
            "حتى 20 غرفة",
            "إدارة الحجوزات الأساسية",
            "تقارير أساسية",
            "دعم عبر البريد الإلكتروني"
          ]
        },
        standard: {
          name: "قياسي",
          description: "الأكثر شعبية للفنادق المتوسطة",
          period: "أول 3 أشهر",
          features: [
            "حتى 100 غرفة",
            "إدارة شاملة للحجوزات",
            "تقارير متقدمة",
            "إدارة الضيوف والفواتير",
            "دعم هاتفي 24/7"
          ]
        },
        premium: {
          name: "مميز",
          description: "للفنادق الكبيرة والسلاسل",
          period: "أول 3 أشهر",
          features: [
            "غرف غير محدودة",
            "جميع الميزات المتقدمة",
            "تحليلات ذكية بالذكاء الاصطناعي",
            "تكامل مع أنظمة خارجية",
            "مدير حساب مخصص"
          ]
        }
      },
      popular: "الأكثر شعبية"
    },
    
    // Step 3: Hotel Setup
    step3: {
      title: "إعداد الفندق",
      subtitle: "أدخل معلومات فندقك لإكمال الإعداد",
      companyName: "اسم الفندق/الشركة",
      companyNamePlaceholder: "أدخل اسم الفندق أو الشركة",
      companyNameRequired: "اسم الفندق/الشركة مطلوب",
      employeeCount: "عدد الموظفين",
      employeeCountPlaceholder: "اختر عدد الموظفين",
      employeeCountRequired: "يرجى اختيار عدد الموظفين",
      employeeOptions: {
        "1-10": "1-10 موظفين",
        "11-50": "11-50 موظف",
        "51-200": "51-200 موظف",
        "201+": "201+ موظف"
      },
      subdomain: "النطاق الفرعي",
      subdomainPlaceholder: "فندقك",
      subdomainRequired: "النطاق الفرعي مطلوب",
      subdomainMinLength: "النطاق الفرعي يجب أن يكون 3 أحرف على الأقل",
      subdomainInvalid: "النطاق الفرعي يمكن أن يحتوي على أحرف وأرقام وشرطات فقط",
      subdomainUnavailable: "هذا النطاق الفرعي غير متاح",
      subdomainAvailable: "النطاق الفرعي متاح!"
    },
    
    // Buttons
    buttons: {
      next: "التالي",
      back: "رجوع",
      finish: "إنشاء مساحة العمل",
      close: "إغلاق",
      switchToLogin: "لديك حساب بالفعل؟ تسجيل الدخول"
    },
    
    // Success
    success: {
      title: "مرحباً بك في Sysora!",
      subtitle: "يتم إعداد مساحة عمل الفندق الخاصة بك. سيتم توجيهك إلى لوحة التحكم قريباً.",
      workspace: "مساحة العمل الخاصة بك:",
      setting: "جاري إعداد مساحة العمل..."
    },
    
    // Landing Section
    landing: {
      title: "ابدأ رحلتك مع Sysora",
      subtitle: "انضم إلى آلاف الفنادق التي تثق في Sysora لإدارة عملياتها",
      button: "إنشاء مساحة عمل الفندق"
    },

    // Footer
    footer: {
      switchToLogin: "لديك حساب بالفعل؟ تسجيل الدخول",
      terms: "بإنشاء حساب، فإنك توافق على",
      termsLink: "شروط الخدمة",
      and: "و",
      privacyLink: "سياسة الخصوصية"
    },

    // Errors
    errors: {
      registrationFailed: "فشل في التسجيل. يرجى المحاولة مرة أخرى.",
      networkError: "خطأ في الشبكة. تأكد من اتصالك بالإنترنت."
    }
  },
  
  fr: {
    // Header
    title: "Créer un Espace de Travail Hôtel",
    subtitle: "Commencez votre essai gratuit de 3 jours",
    
    // Progress
    step: "Étape",
    of: "sur",
    
    // Step 1: Account Info
    step1: {
      title: "Informations du Compte",
      subtitle: "Entrez vos informations personnelles pour créer votre compte",
      fullName: "Nom Complet",
      fullNamePlaceholder: "Entrez votre nom complet",
      fullNameRequired: "Le nom complet est requis",
      email: "Adresse Email",
      emailPlaceholder: "Entrez votre adresse email",
      emailRequired: "L'adresse email est requise",
      emailInvalid: "Veuillez entrer une adresse email valide",
      emailExists: "Cet email est déjà utilisé",
      emailAvailable: "Email disponible!",
      clearTestData: "Effacer les données de test (pour les tests uniquement)",
      password: "Mot de Passe",
      passwordPlaceholder: "Entrez un mot de passe fort",
      passwordRequired: "Le mot de passe est requis",
      passwordMinLength: "Le mot de passe doit contenir au moins 8 caractères",
      confirmPassword: "Confirmer le Mot de Passe",
      confirmPasswordPlaceholder: "Ressaisissez votre mot de passe",
      passwordMismatch: "Les mots de passe ne correspondent pas"
    },
    
    // Step 2: Plan Selection
    step2: {
      title: "Choisissez Votre Plan",
      subtitle: "Tous les plans commencent à 1$ pour les 3 premiers mois",
      plans: {
        basic: {
          name: "Basique",
          description: "Parfait pour les petits hôtels",
          period: "3 premiers mois",
          features: [
            "Jusqu'à 20 chambres",
            "Gestion de réservation basique",
            "Rapports basiques",
            "Support par email"
          ]
        },
        standard: {
          name: "Standard",
          description: "Le plus populaire pour les hôtels moyens",
          period: "3 premiers mois",
          features: [
            "Jusqu'à 100 chambres",
            "Gestion complète des réservations",
            "Rapports avancés",
            "Gestion des clients et facturation",
            "Support téléphonique 24/7"
          ]
        },
        premium: {
          name: "Premium",
          description: "Pour les grands hôtels et chaînes",
          period: "3 premiers mois",
          features: [
            "Chambres illimitées",
            "Toutes les fonctionnalités avancées",
            "Analyses IA intelligentes",
            "Intégration systèmes externes",
            "Gestionnaire de compte dédié"
          ]
        }
      },
      popular: "Le Plus Populaire"
    },
    
    // Step 3: Hotel Setup
    step3: {
      title: "Configuration de l'Hôtel",
      subtitle: "Entrez les informations de votre hôtel pour terminer la configuration",
      companyName: "Nom de l'Hôtel/Entreprise",
      companyNamePlaceholder: "Entrez le nom de votre hôtel ou entreprise",
      companyNameRequired: "Le nom de l'hôtel/entreprise est requis",
      employeeCount: "Nombre d'Employés",
      employeeCountPlaceholder: "Sélectionnez le nombre d'employés",
      employeeCountRequired: "Veuillez sélectionner le nombre d'employés",
      employeeOptions: {
        "1-10": "1-10 employés",
        "11-50": "11-50 employés",
        "51-200": "51-200 employés",
        "201+": "201+ employés"
      },
      subdomain: "Sous-domaine",
      subdomainPlaceholder: "votrehotel",
      subdomainRequired: "Le sous-domaine est requis",
      subdomainMinLength: "Le sous-domaine doit contenir au moins 3 caractères",
      subdomainInvalid: "Le sous-domaine ne peut contenir que des lettres, chiffres et tirets",
      subdomainUnavailable: "Ce sous-domaine n'est pas disponible",
      subdomainAvailable: "Sous-domaine disponible!"
    },
    
    // Buttons
    buttons: {
      next: "Suivant",
      back: "Retour",
      finish: "Créer l'Espace de Travail",
      close: "Fermer",
      switchToLogin: "Vous avez déjà un compte? Se connecter"
    },
    
    // Success
    success: {
      title: "Bienvenue chez Sysora!",
      subtitle: "Votre espace de travail hôtel est en cours de configuration. Vous serez redirigé vers le tableau de bord bientôt.",
      workspace: "Votre espace de travail:",
      setting: "Configuration de l'espace de travail..."
    },
    
    // Landing Section
    landing: {
      title: "Commencez Votre Voyage avec Sysora",
      subtitle: "Rejoignez des milliers d'hôtels qui font confiance à Sysora pour gérer leurs opérations",
      button: "Créer un Espace de Travail Hôtel"
    },

    // Footer
    footer: {
      switchToLogin: "Vous avez déjà un compte? Se connecter",
      terms: "En créant un compte, vous acceptez nos",
      termsLink: "Conditions d'Utilisation",
      and: "et",
      privacyLink: "Politique de Confidentialité"
    },

    // Errors
    errors: {
      registrationFailed: "Échec de l'inscription. Veuillez réessayer.",
      networkError: "Erreur réseau. Vérifiez votre connexion internet."
    }
  }
}
