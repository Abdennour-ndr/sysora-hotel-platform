import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Star,
  Play,
  Users,
  Phone,
  MapPin,
  Target,
  RotateCcw
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import SysoraLogo from '../../components/SysoraLogo';

/**
 * Modern Sign Up Page for Sysora
 * Multi-step hotel workspace creation with 3-day free trial
 */
const ModernSignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Hotel Info, 2: Personal Info, 3: Account Setup
  const [formData, setFormData] = useState({
    // Step 1: Hotel Information
    hotelName: '',
    subdomain: '',
    location: '',
    
    // Step 2: Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    
    // Step 3: Account Setup
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);



  const positions = [
    'Hotel Owner',
    'General Manager',
    'Operations Manager',
    'Front Office Manager',
    'Revenue Manager',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-generate subdomain from hotel name
    if (name === 'hotelName' && value) {
      const subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 20);
      
      setFormData(prev => ({
        ...prev,
        subdomain: subdomain
      }));
      
      // Check subdomain availability
      if (subdomain.length >= 3) {
        checkSubdomainAvailability(subdomain);
      }
    }
  };

  const checkSubdomainAvailability = async (subdomain) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/check-workspace/${subdomain}`);
      const data = await response.json();
      setSubdomainAvailable(!data.exists);
    } catch (error) {
      console.error('Subdomain check error:', error);
      setSubdomainAvailable(null);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Workspace name is required';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Workspace name must be at least 3 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Workspace name can only contain lowercase letters, numbers, and hyphens';
    } else if (subdomainAvailable === false) {
      newErrors.subdomain = 'This workspace name is already taken';
    }



    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.position) {
      newErrors.position = 'Please select your position';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      console.log('Submitting registration data:', formData);

      // For demo purposes, simulate successful registration if server is not available
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || window.location.hostname === 'localhost';

      if (isDemoMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create demo user data
        const demoData = {
          success: true,
          data: {
            token: 'demo_token_' + Date.now(),
            hotel: {
              id: 'demo_hotel_' + Date.now(),
              name: formData.hotelName,
              subdomain: formData.subdomain,
              location: formData.location
            },
            user: {
              id: 'demo_user_' + Date.now(),
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              position: formData.position
            }
          }
        };

        // Store demo authentication data
        localStorage.setItem('sysora_token', demoData.data.token);
        localStorage.setItem('sysora_hotel', JSON.stringify(demoData.data.hotel));
        localStorage.setItem('sysora_user', JSON.stringify(demoData.data.user));
        localStorage.setItem('sysora_demo_mode', 'true');

        // Show success message
        setErrors({ submit: '✅ Demo registration successful! Redirecting to your dashboard...' });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = `/dashboard?subdomain=${formData.subdomain}&welcome=true&demo=true`;
        }, 2000);

        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/register-hotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 404) {
          throw new Error('Registration service is not available. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Handle demo mode when database is unavailable
      if (data.demo && (response.status === 503 || data.error === 'Database temporarily unavailable')) {
        console.log('🎮 Activating demo mode due to database unavailability');

        // Create demo user data
        const demoData = {
          success: true,
          data: {
            token: 'demo_token_' + Date.now(),
            hotel: {
              id: 'demo_hotel_' + Date.now(),
              name: formData.hotelName,
              subdomain: formData.subdomain,
              location: formData.location
            },
            user: {
              id: 'demo_user_' + Date.now(),
              firstName: formData.firstName,
              lastName: formData.lastName,
              fullName: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              position: formData.position
            }
          }
        };

        // Store demo authentication data
        localStorage.setItem('sysora_token', demoData.data.token);
        localStorage.setItem('sysora_hotel', JSON.stringify(demoData.data.hotel));
        localStorage.setItem('sysora_user', JSON.stringify(demoData.data.user));
        localStorage.setItem('sysora_demo_mode', 'true');

        // Show success message
        setErrors({ submit: '✅ Demo registration successful! Database is temporarily offline, but you can explore all features. Redirecting to your dashboard...' });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = `/dashboard?welcome=true`;
        }, 2000);

        return;
      }

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem('sysora_token', data.data.token);
        localStorage.setItem('sysora_hotel', JSON.stringify(data.data.hotel));
        localStorage.setItem('sysora_user', JSON.stringify(data.data.user));

        // Show success message briefly before redirect
        setErrors({ submit: '✅ Registration successful! Redirecting to your dashboard...' });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = `/dashboard?welcome=true`;
        }, 1500);
      } else {
        throw new Error(data.error || data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Provide more specific error messages
      let errorMessage = 'Registration failed. Please try again.';

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('Database temporarily unavailable')) {
        errorMessage = '🎮 Database is temporarily offline. Activating demo mode - you can still explore all features!';

        // Activate demo mode as fallback
        setTimeout(() => {
          const demoData = {
            success: true,
            data: {
              token: 'demo_token_' + Date.now(),
              hotel: {
                id: 'demo_hotel_' + Date.now(),
                name: formData.hotelName,
                subdomain: formData.subdomain,
                location: formData.location
              },
              user: {
                id: 'demo_user_' + Date.now(),
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                position: formData.position
              }
            }
          };

          localStorage.setItem('sysora_token', demoData.data.token);
          localStorage.setItem('sysora_hotel', JSON.stringify(demoData.data.hotel));
          localStorage.setItem('sysora_user', JSON.stringify(demoData.data.user));
          localStorage.setItem('sysora_demo_mode', 'true');

          window.location.href = `/dashboard?welcome=true`;
        }, 2000);

      } else if (error.message.includes('subdomain') || error.message.includes('workspace')) {
        errorMessage = 'This workspace name is already taken. Please choose a different name.';
      } else if (error.message.includes('email')) {
        errorMessage = 'This email address is already registered. Please use a different email or sign in.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    window.location.href = '/signin';
  };

  const goToLanding = () => {
    window.location.href = '/';
  };

  const watchDemo = () => {
    window.open('/hotel-demo', '_blank');
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Hotel Information';
      case 2: return 'Personal Details';
      case 3: return 'Account Setup';
      default: return 'Create Workspace';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return 'Tell us about your hotel';
      case 2: return 'We need to know who you are';
      case 3: return 'Secure your account';
      default: return 'Start your 3-day free trial';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sysora-midnight via-sysora-midnight-light to-sysora-midnight text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sysora-mint/10 via-transparent to-blue-500/10" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-sysora-mint/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={goToLanding}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <SysoraLogo
              size="lg"
              showText={true}
              textColor="text-white"
            />
          </motion.div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={watchDemo}
              icon={<Play className="w-4 h-4" />}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Watch Demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToSignIn}
              className="text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            variant="glass"
            className="backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden"
          >
            <Card.Content className="p-8">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-sysora-mint/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-sysora-mint" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Create Hotel Workspace
                </h1>
                <p className="text-neutral-300 mb-4">
                  Start your 3-day free trial
                </p>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        step === currentStep
                          ? 'bg-sysora-mint text-white'
                          : step < currentStep
                          ? 'bg-success-500 text-white'
                          : 'bg-white/20 text-neutral-400'
                      }`}
                    >
                      {step < currentStep ? <Check className="w-4 h-4" /> : step}
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-white">
                    {getStepTitle()}
                  </h2>
                  <p className="text-sm text-neutral-300">
                    {getStepSubtitle()}
                  </p>
                </div>
              </motion.div>

              {/* Form Steps */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Hotel Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Hotel Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="text"
                          name="hotelName"
                          value={formData.hotelName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.hotelName ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="Grand Hotel Algiers"
                        />
                      </div>
                      {errors.hotelName && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.hotelName}</span>
                        </p>
                      )}
                    </div>

                    {/* Workspace Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Workspace Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="text"
                          name="subdomain"
                          value={formData.subdomain}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-20 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.subdomain ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="grand-hotel"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-600">
                          .sysora.app
                        </div>
                      </div>
                      {subdomainAvailable === true && (
                        <p className="text-success-400 text-sm flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Workspace name is available</span>
                        </p>
                      )}
                      {subdomainAvailable === false && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>This workspace name is already taken</span>
                        </p>
                      )}
                      {errors.subdomain && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.subdomain}</span>
                        </p>
                      )}
                    </div>



                    {/* Location */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Hotel Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.location ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="Algiers, Algeria"
                        />
                      </div>
                      {errors.location && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.location}</span>
                        </p>
                      )}
                    </div>

                    <Button
                      variant="gradient"
                      size="lg"
                      fullWidth
                      onClick={nextStep}
                      icon={<ArrowRight className="w-5 h-5" />}
                      className="shadow-mint-lg hover:shadow-mint-xl"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                              errors.firstName ? 'border-error-400' : 'border-white/30'
                            }`}
                            placeholder="Ahmed"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-error-400 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.firstName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                              errors.lastName ? 'border-error-400' : 'border-white/30'
                            }`}
                            placeholder="Benali"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-error-400 text-sm flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.lastName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.email ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="ahmed@grandhotel.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.phone ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="+213 555 123 456"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Your Position *
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                          errors.position ? 'border-error-400' : 'border-white/30'
                        }`}
                      >
                        <option value="">Select your position</option>
                        {positions.map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                      {errors.position && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.position}</span>
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={prevStep}
                        icon={<ArrowLeft className="w-4 h-4" />}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>
                      <Button
                        variant="gradient"
                        size="md"
                        onClick={nextStep}
                        icon={<ArrowRight className="w-5 h-5" />}
                        className="flex-1 shadow-mint-lg hover:shadow-mint-xl"
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.password ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.confirmPassword ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-800 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-6">
                      {/* Terms Agreement */}
                      <motion.div
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.agreeToTerms
                            ? 'border-sysora-mint/50 bg-sysora-mint/10'
                            : errors.agreeToTerms
                            ? 'border-error-400/50 bg-error-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/30'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="flex items-start space-x-4 cursor-pointer group">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              name="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                              formData.agreeToTerms
                                ? 'border-sysora-mint bg-sysora-mint shadow-lg shadow-sysora-mint/25'
                                : 'border-white/40 bg-white/10 group-hover:border-white/60'
                            }`}>
                              {formData.agreeToTerms && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-semibold text-white">
                                Terms & Privacy Agreement
                              </span>
                              <span className="text-xs bg-error-500/20 text-error-400 px-2 py-1 rounded-full">
                                Required
                              </span>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed">
                              I agree to the{' '}
                              <button
                                type="button"
                                className="text-sysora-mint hover:text-sysora-mint-light underline font-medium transition-colors"
                                onClick={() => window.open('/terms', '_blank')}
                              >
                                Terms of Service
                              </button>{' '}
                              and{' '}
                              <button
                                type="button"
                                className="text-sysora-mint hover:text-sysora-mint-light underline font-medium transition-colors"
                                onClick={() => window.open('/privacy', '_blank')}
                              >
                                Privacy Policy
                              </button>
                            </p>
                          </div>
                        </label>

                        {/* Agreement Status Indicator */}
                        {formData.agreeToTerms && (
                          <motion.div
                            className="absolute top-2 right-2 w-3 h-3 bg-success-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          />
                        )}
                      </motion.div>

                      {errors.agreeToTerms && (
                        <motion.div
                          className="bg-error-500/10 border border-error-500/20 rounded-xl p-4"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-error-400 flex-shrink-0" />
                            <div>
                              <p className="text-error-400 text-sm font-medium">Agreement Required</p>
                              <p className="text-error-300 text-xs mt-1">
                                You must agree to our terms and privacy policy to continue
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Newsletter Subscription */}
                      <motion.div
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.subscribeNewsletter
                            ? 'border-info-500/50 bg-info-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/30'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="flex items-start space-x-4 cursor-pointer group">
                          <div className="relative mt-1">
                            <input
                              type="checkbox"
                              name="subscribeNewsletter"
                              checked={formData.subscribeNewsletter}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                              formData.subscribeNewsletter
                                ? 'border-info-500 bg-info-500 shadow-lg shadow-info-500/25'
                                : 'border-white/40 bg-white/10 group-hover:border-white/60'
                            }`}>
                              {formData.subscribeNewsletter && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-semibold text-white">
                                Newsletter Subscription
                              </span>
                              <span className="text-xs bg-info-500/20 text-info-400 px-2 py-1 rounded-full">
                                Optional
                              </span>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed">
                              Get exclusive hotel management tips, industry insights, and product updates delivered to your inbox
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-400">
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>Weekly digest</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Target className="w-3 h-3" />
                                <span>Industry tips</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <RotateCcw className="w-3 h-3" />
                                <span>Unsubscribe anytime</span>
                              </span>
                            </div>
                          </div>
                        </label>

                        {/* Subscription Status Indicator */}
                        {formData.subscribeNewsletter && (
                          <motion.div
                            className="absolute top-2 right-2 w-3 h-3 bg-info-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={prevStep}
                        icon={<ArrowLeft className="w-4 h-4" />}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>
                      <Button
                        variant="gradient"
                        size="md"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        icon={isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                        className="flex-1 shadow-mint-lg hover:shadow-mint-xl"
                      >
                        {isLoading ? 'Creating Workspace...' : 'Start Free Trial'}
                      </Button>
                    </div>

                    {errors.submit && (
                      <motion.div
                        className={`text-sm text-center flex items-center justify-center space-x-2 p-4 rounded-xl ${
                          errors.submit.includes('✅') || errors.submit.includes('successful')
                            ? 'bg-success-500/10 border border-success-500/20 text-success-600'
                            : 'bg-error-500/10 border border-error-500/20 text-error-400'
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {errors.submit.includes('✅') || errors.submit.includes('successful') ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{errors.submit}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust Indicators */}
              <motion.div
                className="mt-8 grid grid-cols-3 gap-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="space-y-1">
                  <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
                  <p className="text-xs text-neutral-400">3-Day Free Trial</p>
                </div>
                <div className="space-y-1">
                  <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
                  <p className="text-xs text-neutral-400">No Credit Card</p>
                </div>
                <div className="space-y-1">
                  <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
                  <p className="text-xs text-neutral-400">Setup in 5 min</p>
                </div>
              </motion.div>

              {/* Switch to Sign In */}
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-300">
                  Already have an account?{' '}
                  <button
                    onClick={goToSignIn}
                    className="text-sysora-mint hover:text-sysora-mint-light font-medium transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernSignUpPage;
