import React, { useState } from 'react';
import { Globe, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LanguageSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en', 'fr'],
    currency: 'DZD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'Africa/Algiers',
    rtlSupport: true
  });

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currencies = [
    { code: 'DZD', name: 'دينار جزائري', symbol: 'د.ج' },
    { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
    { code: 'EUR', name: 'يورو', symbol: '€' },
    { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
    { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' }
  ];

  const timezones = [
    { value: 'Africa/Algiers', label: 'الجزائر (GMT+1)' },
    { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' },
    { value: 'Europe/Paris', label: 'باريس (GMT+1)' },
    { value: 'America/New_York', label: 'نيويورك (GMT-5)' },
    { value: 'Asia/Dubai', label: 'دبي (GMT+4)' }
  ];

  const handleSave = () => {
    toast.success('تم حفظ إعدادات اللغة والمنطقة');
    if (onSettingsChange) onSettingsChange();
  };

  const toggleLanguageSupport = (langCode) => {
    setSettings(prev => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(langCode)
        ? prev.supportedLanguages.filter(code => code !== langCode)
        : [...prev.supportedLanguages, langCode]
    }));
    if (onSettingsChange) onSettingsChange();
  };

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">إعدادات اللغة</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة الافتراضية
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultLanguage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              اللغات المدعومة
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map(lang => (
                <div key={lang.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <button
                    onClick={() => toggleLanguageSupport(lang.code)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.supportedLanguages.includes(lang.code) ? 'bg-sysora-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.supportedLanguages.includes(lang.code) ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">دعم الكتابة من اليمين لليسار (RTL)</h4>
              <p className="text-sm text-gray-600">تفعيل دعم اللغات التي تُكتب من اليمين لليسار</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, rtlSupport: !prev.rtlSupport }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.rtlSupport ? 'bg-sysora-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.rtlSupport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">الإعدادات الإقليمية</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العملة
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة الزمنية
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تنسيق التاريخ
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY (31-12-2024)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تنسيق الوقت
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e) => setSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="24h">24 ساعة (14:30)</option>
              <option value="12h">12 ساعة (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة التنسيق</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">التاريخ:</span>
            <span className="font-medium">
              {settings.dateFormat === 'DD/MM/YYYY' ? '31/12/2024' :
               settings.dateFormat === 'MM/DD/YYYY' ? '12/31/2024' :
               settings.dateFormat === 'YYYY-MM-DD' ? '2024-12-31' : '31-12-2024'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">الوقت:</span>
            <span className="font-medium">
              {settings.timeFormat === '24h' ? '14:30' : '2:30 PM'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">السعر:</span>
            <span className="font-medium">
              {currencies.find(c => c.code === settings.currency)?.symbol} 1,250
            </span>
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

export default LanguageSettings;
