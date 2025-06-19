import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, X, ArrowRight, ArrowLeft, Building } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { workspaceLoginTranslations } from '../translations/workspaceLogin'

const WorkspaceLoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { language } = useLanguage()
  const t = workspaceLoginTranslations[language] || workspaceLoginTranslations.en
  const [currentStep, setCurrentStep] = useState(1) // 1: Workspace, 2: Credentials
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [workspaceInfo, setWorkspaceInfo] = useState(null)

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
  }

  const validateWorkspace = async () => {
    if (!formData.subdomain.trim()) {
      setErrors({ subdomain: t.workspaceRequired })
      return false
    }

    if (formData.subdomain.length < 3) {
      setErrors({ subdomain: t.workspaceRequired })
      return false
    }

    if (!/^[a-zA-Z0-9-]+$/.test(formData.subdomain)) {
      setErrors({ subdomain: t.workspaceRequired })
      return false
    }

    setIsLoading(true)

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/check-workspace/${formData.subdomain}`
      console.log('🔍 Checking workspace URL:', apiUrl)

      const response = await fetch(apiUrl)
      console.log('📡 Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('📊 Response data:', data)

      if (data.exists) {
        setWorkspaceInfo(data.workspace)
        setCurrentStep(2)
        setErrors({})
        return true
      } else {
        setErrors({ subdomain: t.workspaceNotFound })
        return false
      }
    } catch (error) {
      console.error('Workspace check error:', error)
      setErrors({ subdomain: t.workspaceCheckFailed })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const validateCredentials = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateCredentials()) {
      return
    }

    setIsLoading(true)

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
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem('sysora_token', data.data.token)
        localStorage.setItem('sysora_hotel', JSON.stringify(data.data.hotel))
        localStorage.setItem('sysora_user', JSON.stringify(data.data.user))

        // Close modal and redirect to dashboard (now modern by default)
        onClose()
        window.location.href = `/dashboard?subdomain=${formData.subdomain}`
      } else {
        throw new Error(data.error || t.loginFailed)
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: error.message || `${t.loginFailed}. ${t.tryAgain}` })
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    setCurrentStep(1)
    setWorkspaceInfo(null)
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-3xl max-w-md w-full max-h-[95vh] overflow-hidden glass-effect flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sysora-midnight rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-sysora-midnight">
                {currentStep === 1 ? t.step1Title : t.step2Title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStep === 1 ? t.step1Subtitle : `${t.step2Subtitle} ${workspaceInfo?.name || formData.subdomain}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          {currentStep === 1 ? (
            // Step 1: Workspace
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-sysora-midnight">{t.workspaceTitle}</h3>
                <p className="text-sm text-gray-600">{t.workspaceSubtitle}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="subdomain" className="block text-sm font-medium text-sysora-midnight">
                  {t.workspaceLabel}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="subdomain"
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && validateWorkspace()}
                    className={`input-ltr input-focus w-full pl-10 pr-20 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                      errors.subdomain ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t.workspacePlaceholder}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    .sysora.app
                  </div>
                </div>
                {errors.subdomain && (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.subdomain}</span>
                  </p>
                )}
              </div>

              <button
                onClick={validateWorkspace}
                disabled={isLoading || !formData.subdomain.trim()}
                className="btn-hover w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{t.checking}</span>
                  </>
                ) : (
                  <>
                    <span>{t.continue}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            // Step 2: Credentials
            <div className="space-y-6">
              {/* Workspace Info */}
              <div className="bg-sysora-light/30 rounded-2xl p-4 text-center">
                <p className="text-sm text-sysora-midnight">
                  {t.step2Subtitle} <span className="font-semibold">{workspaceInfo?.name || formData.subdomain}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">{formData.subdomain}.sysora.app</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-sysora-midnight">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-ltr input-focus w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-sysora-midnight">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className={`input-ltr input-focus w-full pl-10 pr-10 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={t.passwordPlaceholder}
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
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={goBack}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.back}</span>
                </button>
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="flex-2 btn-hover btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{t.signingIn}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.signIn}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <p className="text-red-600 text-sm text-center flex items-center justify-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">{t.or}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Switch to Signup */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <button
                onClick={onSwitchToSignup}
                className="text-sysora-mint hover:text-sysora-midnight font-medium transition-colors"
              >
                {t.switchToSignup}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceLoginModal
