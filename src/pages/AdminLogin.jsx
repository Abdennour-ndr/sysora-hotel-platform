import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, Shield, ArrowRight } from 'lucide-react'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح'
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log('✅ Admin login successful:', data);

        // Store admin authentication data
        localStorage.setItem('sysora_admin_token', data.data.token)
        localStorage.setItem('sysora_admin_user', JSON.stringify(data.data.user))

        console.log('💾 Admin data stored in localStorage');
        console.log('🔄 Redirecting to admin dashboard...');

        // Redirect to admin dashboard
        window.location.href = '/admin'
      } else {
        console.log('❌ Admin login failed:', data);
        throw new Error(data.error || 'فشل في تسجيل الدخول')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setErrors({ submit: error.message || 'فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sysora-midnight via-sysora-midnight to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم المشرفين</h1>
          <p className="text-white/70">تسجيل دخول مشرفي منصة Sysora</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                    errors.email ? 'border-red-400' : ''
                  }`}
                  placeholder="admin@sysora.app"
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className={`w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent transition-all ${
                    errors.password ? 'border-red-400' : ''
                  }`}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold py-3 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول لوحة المشرفين</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {errors.submit && (
              <p className="text-red-300 text-sm text-center flex items-center justify-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </p>
            )}
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-sysora-mint mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm">منطقة محمية</h4>
                <p className="text-white/70 text-xs mt-1">
                  هذه المنطقة مخصصة لمشرفي منصة Sysora فقط. جميع الأنشطة مراقبة ومسجلة.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Main Site */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← العودة إلى الموقع الرئيسي
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-xs">
            © 2024 Sysora. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
