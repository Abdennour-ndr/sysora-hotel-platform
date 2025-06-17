import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Play
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import SysoraLogo from '../../components/SysoraLogo';

/**
 * Modern Sign In Page for Sysora
 * Matches the new design system and landing page style
 */
const ModernSignInPage = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Workspace, 2: Credentials
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState(null);

  // Auto-fill demo data for testing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.get('demo');
    if (demo === 'true') {
      setFormData(prev => ({
        ...prev,
        subdomain: 'demo',
        email: 'admin@demo.com',
        password: 'demo123'
      }));
    }
  }, []);

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
  };

  const validateWorkspace = async () => {
    if (!formData.subdomain.trim()) {
      setErrors({ subdomain: 'Workspace name is required' });
      return false;
    }

    if (formData.subdomain.length < 3) {
      setErrors({ subdomain: 'Workspace name must be at least 3 characters' });
      return false;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(formData.subdomain)) {
      setErrors({ subdomain: 'Workspace name can only contain letters, numbers, and hyphens' });
      return false;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/check-workspace/${formData.subdomain}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.exists) {
        setWorkspaceInfo(data.workspace);
        setCurrentStep(2);
        setErrors({});
        return true;
      } else {
        setErrors({ subdomain: 'Workspace not found. Please check the name and try again.' });
        return false;
      }
    } catch (error) {
      console.error('Workspace check error:', error);
      setErrors({ subdomain: 'Unable to verify workspace. Please try again.' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateCredentials = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateCredentials()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/workspace-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subdomain: formData.subdomain,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem('sysora_token', data.data.token);
        localStorage.setItem('sysora_hotel', JSON.stringify(data.data.hotel));
        localStorage.setItem('sysora_user', JSON.stringify(data.data.user));

        // Redirect to dashboard
        window.location.href = `/dashboard?subdomain=${formData.subdomain}`;
      } else {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setCurrentStep(1);
    setWorkspaceInfo(null);
    setErrors({});
  };

  const goToSignup = () => {
    window.location.href = '/?signup=true';
  };

  const goToLanding = () => {
    window.location.href = '/';
  };

  const watchDemo = () => {
    window.open('/hotel-demo', '_blank');
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
              onClick={goToLanding}
              className="text-white hover:bg-white/10"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <motion.div
          className="w-full max-w-md"
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
                  {currentStep === 1 ? 'Access Your Workspace' : 'Welcome Back'}
                </h1>
                <p className="text-neutral-300">
                  {currentStep === 1 
                    ? 'Enter your hotel workspace to continue' 
                    : `Sign in to ${workspaceInfo?.name || formData.subdomain}`
                  }
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Workspace Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Hotel Workspace
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="text"
                          name="subdomain"
                          value={formData.subdomain}
                          onChange={handleInputChange}
                          onKeyPress={(e) => e.key === 'Enter' && validateWorkspace()}
                          className={`w-full pl-10 pr-20 py-3 bg-white/20 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.subdomain ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="your-hotel"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-600">
                          .sysora.app
                        </div>
                      </div>
                      {errors.subdomain && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.subdomain}</span>
                        </p>
                      )}
                    </div>

                    <Button
                      variant="gradient"
                      size="lg"
                      fullWidth
                      onClick={validateWorkspace}
                      disabled={isLoading || !formData.subdomain.trim()}
                      icon={isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                      className="shadow-mint-lg hover:shadow-mint-xl"
                    >
                      {isLoading ? 'Checking...' : 'Continue'}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Workspace Info */}
                    <div className="bg-sysora-mint/10 backdrop-blur-sm rounded-xl p-4 text-center border border-sysora-mint/20">
                      <p className="text-white text-sm">
                        Signing in to <span className="font-semibold text-sysora-mint">{workspaceInfo?.name || formData.subdomain}</span>
                      </p>
                      <p className="text-neutral-400 text-xs mt-1">{formData.subdomain}.sysora.app</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.email ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="admin@hotel.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-error-400 text-sm flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                          className={`w-full pl-10 pr-10 py-3 bg-white/20 backdrop-blur-sm border rounded-xl text-sysora-midnight placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                            errors.password ? 'border-error-400' : 'border-white/30'
                          }`}
                          placeholder="Enter your password"
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

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-sysora-mint bg-white/10 border-white/30 rounded focus:ring-sysora-mint focus:ring-2"
                        />
                        <span className="text-sm text-neutral-300">Remember me</span>
                      </label>
                      <button className="text-sm text-sysora-mint hover:text-sysora-mint-light transition-colors">
                        Forgot password?
                      </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={goBack}
                        icon={<ArrowLeft className="w-4 h-4" />}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>
                      <Button
                        variant="gradient"
                        size="md"
                        onClick={handleLogin}
                        disabled={isLoading}
                        icon={isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        className="flex-1 shadow-mint-lg hover:shadow-mint-xl"
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </div>

                    {errors.submit && (
                      <p className="text-error-400 text-sm text-center flex items-center justify-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.submit}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-sm text-neutral-400">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Switch to Signup */}
              <div className="text-center">
                <p className="text-sm text-neutral-300">
                  Don't have an account?{' '}
                  <button
                    onClick={goToSignup}
                    className="text-sysora-mint hover:text-sysora-mint-light font-medium transition-colors"
                  >
                    Get started for free
                  </button>
                </p>
              </div>
            </Card.Content>
          </Card>

          {/* Trust Indicators */}
          <motion.div
            className="mt-8 grid grid-cols-3 gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="space-y-1">
              <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
              <p className="text-xs text-neutral-400">Secure Login</p>
            </div>
            <div className="space-y-1">
              <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
              <p className="text-xs text-neutral-400">24/7 Support</p>
            </div>
            <div className="space-y-1">
              <CheckCircle className="w-5 h-5 text-success-400 mx-auto" />
              <p className="text-xs text-neutral-400">99.9% Uptime</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernSignInPage;
