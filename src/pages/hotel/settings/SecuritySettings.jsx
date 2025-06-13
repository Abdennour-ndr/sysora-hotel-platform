import React, { useState } from 'react';
import { Shield, Key, Users, Eye, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SecuritySettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false
    },
    loginAttempts: 5,
    ipWhitelist: '',
    auditLog: true
  });

  const handleSave = () => {
    toast.success('تم حفظ إعدادات الأمان');
    if (onSettingsChange) onSettingsChange();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">إعدادات الأمان</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">المصادقة الثنائية</h4>
              <p className="text-sm text-gray-600">تفعيل المصادقة الثنائية لحماية إضافية</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-sysora-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انتهاء الجلسة (بالدقائق)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              min="5"
              max="480"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">سياسة كلمة المرور</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى لطول كلمة المرور
                </label>
                <input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                  min="6"
                  max="32"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">يتطلب أحرف كبيرة</span>
                <button
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, requireUppercase: !prev.passwordPolicy.requireUppercase }
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.passwordPolicy.requireUppercase ? 'bg-sysora-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.passwordPolicy.requireUppercase ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">يتطلب أرقام</span>
                <button
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, requireNumbers: !prev.passwordPolicy.requireNumbers }
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.passwordPolicy.requireNumbers ? 'bg-sysora-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.passwordPolicy.requireNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">يتطلب رموز خاصة</span>
                <button
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    passwordPolicy: { ...prev.passwordPolicy, requireSymbols: !prev.passwordPolicy.requireSymbols }
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.passwordPolicy.requireSymbols ? 'bg-sysora-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.passwordPolicy.requireSymbols ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
