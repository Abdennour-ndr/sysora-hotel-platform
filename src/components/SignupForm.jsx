import React, { useState } from 'react'
import { User, Building, Mail, Users, Globe, Loader, CheckCircle, AlertCircle, X, ArrowRight, ArrowLeft, Shield, Zap, Crown, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { signupFormTranslations } from '../translations/signupForm'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import { PRICING_PLANS, CURRENT_PROMOTION } from '../constants/promotions'

const MultiStepSignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { language } = useLanguage()
  const t = signupFormTranslations[language] || signupFormTranslations.en
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Plan Selection
    selectedPlan: 'medium-hotels',
    // Step 3: Hotel Setup
    companyName: '',
    employeeCount: '',
    subdomain: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [subdomainAvailable, setSubdomainAvailable] = useState(null)
  const [emailAvailable, setEmailAvailable] = useState(null)
  const [checkingSubdomain, setCheckingSubdomain] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentStep < totalSteps) {
        nextStep()
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const totalSteps = 3

  // Use unified pricing plans from constants
  const iconMap = {
    'Star': Shield,
    'Zap': Zap,
    'Crown': Crown
  }

  const colorMap = {
    'small-hotels': 'from-blue-500 to-blue-600',
    'medium-hotels': 'from-sysora-mint to-emerald-500',
    'large-hotels': 'from-purple-500 to-purple-600'
  }

  const plans = PRICING_PLANS.map(plan => ({
    ...plan,
    icon: iconMap[plan.icon] || Shield,
    color: colorMap[plan.id] || 'from-blue-500 to-blue-600',
    price: plan.promo.price,
    originalPrice: plan.pricing.monthly,
    period: `for ${plan.promo.duration}`
  }))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Check email availability
    if (name === 'email' && value.includes('@')) {
      checkEmailAvailability(value)
    }

    // Check subdomain availability
    if (name === 'subdomain' && value.length > 2) {
      checkSubdomainAvailability(value)
    }
  }

  const checkEmailAvailability = async (email) => {
    setCheckingEmail(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/check-email/${email}`)
      const data = await response.json()

      if (response.ok) {
        setEmailAvailable(data.available)
        console.log(`Email ${email} availability:`, data.available)
      } else {
        console.error('Email check failed:', data.error)
        setEmailAvailable(false)
      }
    } catch (error) {
      console.error('Email check error:', error)
      setEmailAvailable(null) // Reset to null on error
    } finally {
      setCheckingEmail(false)
    }
  }

  const checkSubdomainAvailability = async (subdomain) => {
    setCheckingSubdomain(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/check-subdomain/${subdomain}`)
      const data = await response.json()

      if (response.ok) {
        setSubdomainAvailable(data.available)
      } else {
        setSubdomainAvailable(false)
      }
    } catch (error) {
      console.error('Subdomain check error:', error)
      setSubdomainAvailable(false)
    } finally {
      setCheckingSubdomain(false)
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = t.step1.fullNameRequired
      }
      if (!formData.email.trim()) {
        newErrors.email = t.step1.emailRequired
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.step1.emailInvalid
      } else if (emailAvailable === false) {
        newErrors.email = t.step1.emailExists
      }
      if (!formData.password) {
        newErrors.password = t.step1.passwordRequired
      } else if (formData.password.length < 8) {
        newErrors.password = t.step1.passwordMinLength
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t.step1.passwordMismatch
      }
    }

    if (step === 3) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = t.step3.companyNameRequired
      }
      if (!formData.employeeCount) {
        newErrors.employeeCount = t.step3.employeeCountRequired
      }
      if (!formData.subdomain.trim()) {
        newErrors.subdomain = t.step3.subdomainRequired
      } else if (formData.subdomain.length < 3) {
        newErrors.subdomain = t.step3.subdomainMinLength
      } else if (!/^[a-zA-Z0-9-]+$/.test(formData.subdomain)) {
        newErrors.subdomain = t.step3.subdomainInvalid
      } else if (subdomainAvailable === false) {
        newErrors.subdomain = t.step3.subdomainUnavailable
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const selectPlan = (planId) => {
    setFormData(prev => ({ ...prev, selectedPlan: planId }))
  }

  const clearTestData = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/clear-test-data/${email}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (response.ok) {
        console.log('Test data cleared successfully')
        // Re-check email availability
        checkEmailAvailability(email)
      } else {
        console.error('Failed to clear test data:', data.error)
      }
    } catch (error) {
      console.error('Clear test data error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Starting registration with data:', {
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName,
        employeeCount: formData.employeeCount,
        subdomain: formData.subdomain,
        selectedPlan: formData.selectedPlan
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/register-hotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          employeeCount: formData.employeeCount,
          subdomain: formData.subdomain,
          selectedPlan: formData.selectedPlan
        }),
      })

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      let data;
      try {
        data = await response.json();
        console.log('📦 Response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        throw new Error('Server returned invalid response');
      }

      if (response.ok && data.success) {
        console.log('✅ Registration successful!');
        setIsSuccess(true)
        localStorage.setItem('sysora_token', data.data.token)
        localStorage.setItem('sysora_hotel', JSON.stringify(data.data.hotel))
        localStorage.setItem('sysora_user', JSON.stringify(data.data.user))

        setTimeout(() => {
          window.location.href = `/dashboard?subdomain=${formData.subdomain}&setup=true`
        }, 3000)
      } else {
        console.error('❌ Registration failed:', data);
        throw new Error(data.error || data.message || t.errors.registrationFailed)
      }
    } catch (error) {
      console.error('💥 Registration error:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ submit: 'Network error. Please check your connection and try again.' })
      } else {
        setErrors({ submit: error.message || t.errors.registrationFailed })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  // Success Screen
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-sysora-midnight">
              {t.success.title}
            </h3>
            <p className="text-gray-600">
              {t.success.subtitle}
            </p>
            <div className="bg-sysora-light p-4 rounded-2xl">
              <p className="text-sm text-sysora-midnight font-medium">
                {t.success.workspace} <span className="text-sysora-mint">{formData.subdomain}.sysora.app</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-5 h-5 animate-spin text-sysora-mint" />
            <span className="text-sm text-gray-600">{t.success.setting}</span>
          </div>
        </div>
      </div>
    )
  }

  // Main Modal
  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-content bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden glass-effect flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sysora-midnight rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-sysora-midnight">{t.title}</h2>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-sysora-light/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sysora-midnight">{t.step} {currentStep} {t.of} {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="progress-bar bg-gradient-to-r from-sysora-mint to-emerald-500 h-2 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="modal-scroll flex-1 p-4 overflow-y-auto min-h-0">
          {currentStep === 1 && (
            <div className="step-content space-y-4">
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-xl font-bold text-sysora-midnight">{t.step1.title}</h3>
                <p className="text-sm text-gray-600">{t.step1.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-sysora-midnight">
                    {t.step1.fullName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t.step1.fullNamePlaceholder}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-sysora-midnight">
                    {t.step1.email} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-ltr w-full pl-10 pr-10 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t.step1.emailPlaceholder}
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {checkingEmail ? (
                          <Loader className="w-5 h-5 animate-spin text-gray-400" />
                        ) : emailAvailable !== null ? (
                          emailAvailable ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )
                        ) : null}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                  {formData.email && emailAvailable === false && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                      <p className="text-red-600 text-sm flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{t.step1.emailExists}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => clearTestData(formData.email)}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        {t.step1.clearTestData}
                      </button>
                    </div>
                  )}
                  {formData.email && emailAvailable === true && (
                    <p className="text-green-600 text-sm flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.step1.emailAvailable}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-sysora-midnight">
                    {t.step1.password} *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-ltr w-full pl-4 pr-10 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t.step1.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                  <PasswordStrengthMeter password={formData.password} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-sysora-midnight">
                    {t.step1.confirmPassword} *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`input-ltr w-full pl-4 pr-10 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t.step1.confirmPasswordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-xl font-bold text-sysora-midnight">{t.step2.title}</h3>
                <p className="text-sm text-gray-600">{t.step2.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const IconComponent = plan.icon
                  return (
                    <div
                      key={plan.id}
                      onClick={() => selectPlan(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        formData.selectedPlan === plan.id
                          ? 'border-sysora-mint bg-sysora-mint/5 shadow-lg'
                          : 'border-gray-200 hover:border-sysora-mint/50'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-sysora-mint to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            {t.step2.popular}
                          </span>
                        </div>
                      )}

                      <div className="text-center space-y-3">
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-sysora-midnight">{plan.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-2">
                            <div className="text-yellow-800 font-bold text-sm">
                              🎉 Launch Offer
                            </div>
                            <div className="text-yellow-600 text-xs">
                              Early adopters only
                            </div>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-2xl font-bold text-sysora-midnight">${plan.price}</span>
                            <span className="text-sm text-gray-400 line-through">${plan.originalPrice}/month</span>
                          </div>
                          <p className="text-xs text-gray-600">{plan.period}</p>
                          <p className="text-xs text-gray-500">Then ${plan.originalPrice}/month</p>
                        </div>

                        <ul className="space-y-1 text-xs">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-sysora-mint flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {formData.selectedPlan === plan.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-sysora-mint rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-6">
                <h3 className="text-xl font-bold text-sysora-midnight">{t.step3.title}</h3>
                <p className="text-sm text-gray-600">{t.step3.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-sysora-midnight">
                    {t.step3.companyName} *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.companyName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t.step3.companyNamePlaceholder}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.companyName}</span>
                    </p>
                  )}
                </div>

                {/* Employee Count */}
                <div className="space-y-2">
                  <label htmlFor="employeeCount" className="block text-sm font-medium text-sysora-midnight">
                    {t.step3.employeeCount} *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="employeeCount"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                        errors.employeeCount ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t.step3.employeeCountPlaceholder}</option>
                      <option value="1-10">{t.step3.employeeOptions["1-10"]}</option>
                      <option value="11-50">{t.step3.employeeOptions["11-50"]}</option>
                      <option value="51-200">{t.step3.employeeOptions["51-200"]}</option>
                      <option value="201+">{t.step3.employeeOptions["201+"]}</option>
                    </select>
                  </div>
                  {errors.employeeCount && (
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.employeeCount}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Subdomain */}
              <div className="space-y-2">
                <label htmlFor="subdomain" className="block text-sm font-medium text-sysora-midnight">
                  {t.step3.subdomain} *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="subdomain"
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    className={`input-ltr w-full pl-10 pr-32 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                      errors.subdomain ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t.step3.subdomainPlaceholder}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    .sysora.app
                  </div>
                  {formData.subdomain && (
                    <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
                      {checkingSubdomain ? (
                        <Loader className="w-5 h-5 animate-spin text-gray-400" />
                      ) : subdomainAvailable !== null ? (
                        subdomainAvailable ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )
                      ) : null}
                    </div>
                  )}
                </div>
                {errors.subdomain && (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.subdomain}</span>
                  </p>
                )}
                {formData.subdomain && subdomainAvailable === false && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t.step3.subdomainUnavailable}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => clearTestData(formData.email)}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      {t.step1.clearTestData}
                    </button>
                  </div>
                )}
                {formData.subdomain && subdomainAvailable === true && (
                  <p className="text-green-600 text-sm flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.step3.subdomainAvailable}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-sysora-midnight hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.buttons.back}</span>
            </button>

            {/* Step Indicators */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i + 1 <= currentStep
                      ? 'bg-sysora-mint'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Next/Submit Button */}
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 btn-primary px-6 py-3"
              >
                <span>{t.buttons.next}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>{t.buttons.finish}</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-600 text-sm text-center flex items-center justify-center space-x-1 mt-4">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.submit}</span>
            </p>
          )}

          {/* Switch to Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              <button
                onClick={onSwitchToLogin}
                className="text-sysora-mint hover:text-sysora-midnight font-medium transition-colors"
              >
                {t.footer.switchToLogin}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            {t.footer.terms}{' '}
            <button className="text-sysora-mint hover:underline">{t.footer.termsLink}</button>{' '}
            {t.footer.and}{' '}
            <button className="text-sysora-mint hover:underline">{t.footer.privacyLink}</button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main SignupForm component
const SignupForm = ({ isModal = false, onClose = null, onSwitchToLogin = null }) => {
  const { language } = useLanguage()
  const t = signupFormTranslations[language] || signupFormTranslations.en
  const [showModal, setShowModal] = useState(false)

  // If used as modal directly
  if (isModal && onClose) {
    return <MultiStepSignupModal isOpen={true} onClose={onClose} onSwitchToLogin={onSwitchToLogin} />
  }

  // Default landing page section
  return (
    <>
      <section id="signup-form" className="section-padding bg-gradient-to-br from-sysora-mint/10 to-white">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-sysora-midnight">
                {t.landing.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.landing.subtitle}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              {t.landing.button}
            </button>
          </div>
        </div>
      </section>

      <MultiStepSignupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}

export default SignupForm
