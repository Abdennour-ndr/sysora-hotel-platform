import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Wifi,
  Bell,
  Palette,
  Globe,
  Key,
  Server,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';

const UnifiedSettingsCenter = ({ 
  currentUser = {}, 
  hotelSettings = {},
  systemSettings = {}
}) => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Settings sections configuration
  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: Settings,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Basic hotel and system configuration'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'User accounts, roles, and permissions'
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Security policies and access control'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Wifi,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Third-party services and API connections'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Email, SMS, and system notifications'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'Theme, branding, and UI customization'
    },
    {
      id: 'backup',
      title: 'Backup & Maintenance',
      icon: Database,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Data backup and system maintenance'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Simulate loading settings from API
    const defaultSettings = {
      general: {
        hotelName: 'Grand Hotel Sysora',
        hotelAddress: '123 Main Street, City, Country',
        hotelPhone: '+1 (555) 123-4567',
        hotelEmail: 'info@grandhotelsysora.com',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      },
      users: {
        maxUsers: 50,
        passwordPolicy: 'strong',
        sessionTimeout: 30,
        twoFactorAuth: true,
        loginAttempts: 5,
        accountLockout: 15
      },
      security: {
        sslEnabled: true,
        encryptionLevel: 'AES-256',
        auditLogging: true,
        ipWhitelist: '',
        securityHeaders: true,
        dataRetention: 365
      },
      integrations: {
        paymentGateway: 'stripe',
        emailService: 'sendgrid',
        smsService: 'twilio',
        analyticsService: 'google',
        backupService: 'aws-s3',
        apiRateLimit: 1000
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        bookingAlerts: true,
        paymentAlerts: true,
        systemAlerts: true,
        marketingEmails: false
      },
      appearance: {
        theme: 'light',
        primaryColor: '#002D5B',
        secondaryColor: '#2EC4B6',
        logoUrl: '/logo.png',
        faviconUrl: '/favicon.ico',
        customCSS: '',
        showBranding: true
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30,
        backupLocation: 'cloud',
        maintenanceWindow: '02:00',
        systemUpdates: 'auto'
      }
    };

    setSettings(defaultSettings);
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasChanges(false);
      window.showToast && window.showToast('Settings saved successfully', 'success');
    } catch (error) {
      window.showToast && window.showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      loadSettings();
      setHasChanges(false);
      window.showToast && window.showToast('Settings reset to defaults', 'info');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sysora-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    window.showToast && window.showToast('Settings exported successfully', 'success');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setHasChanges(true);
          window.showToast && window.showToast('Settings imported successfully', 'success');
        } catch (error) {
          window.showToast && window.showToast('Error importing settings', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
          <input
            type="text"
            value={settings.general?.hotelName || ''}
            onChange={(e) => handleSettingChange('general', 'hotelName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.general?.currency || 'USD'}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="DZD">DZD - Algerian Dinar</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={settings.general?.hotelEmail || ''}
            onChange={(e) => handleSettingChange('general', 'hotelEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={settings.general?.hotelPhone || ''}
            onChange={(e) => handleSettingChange('general', 'hotelPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={settings.general?.hotelAddress || ''}
          onChange={(e) => handleSettingChange('general', 'hotelAddress', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SSL Encryption</h4>
            <p className="text-sm text-gray-600">Enable HTTPS encryption</p>
          </div>
          <button
            onClick={() => handleSettingChange('security', 'sslEnabled', !settings.security?.sslEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security?.sslEnabled ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security?.sslEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Require 2FA for all users</p>
          </div>
          <button
            onClick={() => handleSettingChange('users', 'twoFactorAuth', !settings.users?.twoFactorAuth)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.users?.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.users?.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Audit Logging</h4>
            <p className="text-sm text-gray-600">Log all system activities</p>
          </div>
          <button
            onClick={() => handleSettingChange('security', 'auditLogging', !settings.security?.auditLogging)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security?.auditLogging ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security?.auditLogging ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.users?.sessionTimeout || 30}
            onChange={(e) => handleSettingChange('users', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
          { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
          { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Alerts for new bookings' },
          { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Alerts for payment events' },
          { key: 'systemAlerts', label: 'System Alerts', desc: 'System maintenance and updates' }
        ].map((notification) => (
          <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{notification.label}</h4>
              <p className="text-sm text-gray-600">{notification.desc}</p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', notification.key, !settings.notifications?.[notification.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications?.[notification.key] ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications?.[notification.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Settings Center</h1>
                <p className="text-gray-300 text-sm">System configuration and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="flex items-center space-x-2 text-yellow-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              
              <button
                onClick={exportSettings}
                className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors"
                title="Export Settings"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <label className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-colors cursor-pointer" title="Import Settings">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Info className="w-4 h-4" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetSettings}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset
                </button>
                
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl ${section.lightColor}`}>
                  <Icon className={`w-6 h-6 ${section.textColor}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {settingsSections.find(s => s.id === activeSection)?.title || 'Settings'}
          </h2>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'general' && renderGeneralSettings()}
          {activeSection === 'security' && renderSecuritySettings()}
          {activeSection === 'notifications' && renderNotificationSettings()}
          
          {!['general', 'security', 'notifications'].includes(activeSection) && (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Advanced {settingsSections.find(s => s.id === activeSection)?.title} coming soon...</p>
              <p className="text-sm mt-2">Configuration options will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSettingsCenter;
