import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Shield,
  Mail,
  Database,
  Server,
  Bell,
  Palette,
  Key,
  Users,
  Building,
  DollarSign,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Download
} from 'lucide-react';

const SystemSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Sysora',
      siteDescription: 'منصة إدارة الفنادق الذكية',
      defaultLanguage: 'ar',
      timezone: 'Asia/Riyadh',
      currency: 'SAR'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: 'noreply@sysora.app',
      smtpPassword: '••••••••',
      fromName: 'Sysora Platform',
      fromEmail: 'noreply@sysora.app'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: '24',
      passwordMinLength: '8',
      maxLoginAttempts: '5',
      apiRateLimit: '1000'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      systemAlerts: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: '30',
      lastBackup: '2024-01-15 10:30:00'
    }
  });

  const sections = [
    { id: 'general', name: 'الإعدادات العامة', icon: Settings },
    { id: 'email', name: 'إعدادات البريد', icon: Mail },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: Database }
  ];

  const handleSave = async () => {
    setSaving(true);
    // محاكاة حفظ الإعدادات
    setTimeout(() => {
      setSaving(false);
      // إظهار رسالة نجاح
    }, 1500);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم الموقع
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اللغة الافتراضية
          </label>
          <select
            value={settings.general.defaultLanguage}
            onChange={(e) => handleInputChange('general', 'defaultLanguage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المنطقة الزمنية
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          >
            <option value="Asia/Riyadh">الرياض (GMT+3)</option>
            <option value="Asia/Dubai">دبي (GMT+4)</option>
            <option value="Africa/Cairo">القاهرة (GMT+2)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العملة الافتراضية
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="AED">درهم إماراتي (AED)</option>
            <option value="USD">دولار أمريكي (USD)</option>
            <option value="EUR">يورو (EUR)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف الموقع
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
        />
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            خادم SMTP
          </label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            منفذ SMTP
          </label>
          <input
            type="text"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المستخدم
          </label>
          <input
            type="email"
            value={settings.email.smtpUser}
            onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div>
            <h4 className="text-sm font-medium text-gray-900">المصادقة الثنائية</h4>
            <p className="text-xs text-gray-500">تفعيل المصادقة الثنائية للحسابات</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnabled}
              onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sysora-mint/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sysora-mint"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مهلة الجلسة (ساعة)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى لطول كلمة المرور
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleInputChange('security', 'passwordMinLength', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حد محاولات تسجيل الدخول
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">إعدادات الإشعارات قيد التطوير</p>
          </div>
        );
      case 'backup':
        return (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">إعدادات النسخ الاحتياطي قيد التطوير</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sysora-midnight">إعدادات النظام</h2>
          <p className="text-gray-600">إدارة إعدادات المنصة والتكوينات العامة</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-sysora-mint hover:bg-sysora-mint/90 disabled:opacity-50 text-sysora-midnight px-6 py-3 rounded-2xl font-medium transition-colors flex items-center space-x-2"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-sysora-mint text-sysora-midnight'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                قم بتكوين الإعدادات حسب احتياجاتك
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
