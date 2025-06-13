import React, { useState } from 'react';
import { Palette, Upload, Save, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AppearanceSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    primaryColor: '#2EC4B6',
    secondaryColor: '#002D5B',
    accentColor: '#F9FAFB',
    logo: null,
    favicon: null,
    theme: 'light',
    borderRadius: 'rounded',
    fontFamily: 'Inter'
  });

  const colorPresets = [
    { name: 'Sysora الافتراضي', primary: '#2EC4B6', secondary: '#002D5B' },
    { name: 'أزرق كلاسيكي', primary: '#3B82F6', secondary: '#1E40AF' },
    { name: 'أخضر طبيعي', primary: '#10B981', secondary: '#047857' },
    { name: 'بنفسجي عصري', primary: '#8B5CF6', secondary: '#5B21B6' },
    { name: 'برتقالي دافئ', primary: '#F59E0B', secondary: '#D97706' }
  ];

  const handleSave = () => {
    toast.success('تم حفظ إعدادات المظهر');
    if (onSettingsChange) onSettingsChange();
  };

  const handleColorPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
    if (onSettingsChange) onSettingsChange();
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">الألوان والمظهر</h3>
        </div>

        <div className="space-y-6">
          {/* Color Presets */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">قوالب الألوان الجاهزة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleColorPreset(preset)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-sysora-primary transition-colors"
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللون الأساسي
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللون الثانوي
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لون التمييز
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Branding */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">الشعار والهوية</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شعار الفندق
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">اسحب الشعار هنا أو انقر للتحميل</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG حتى 2MB</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أيقونة الموقع (Favicon)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">اسحب الأيقونة هنا أو انقر للتحميل</p>
              <p className="text-xs text-gray-500 mt-1">ICO, PNG 32x32px</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
      </div>

      {/* Typography and Layout */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-sysora-primary" />
          <h3 className="text-lg font-semibold text-gray-900">التخطيط والخطوط</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الخط
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => setSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Cairo">Cairo (عربي)</option>
              <option value="Tajawal">Tajawal (عربي)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نمط الحواف
            </label>
            <select
              value={settings.borderRadius}
              onChange={(e) => setSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="none">بدون انحناء</option>
              <option value="small">انحناء صغير</option>
              <option value="rounded">انحناء متوسط</option>
              <option value="large">انحناء كبير</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نمط المظهر
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة المظهر</h3>
        <div className="border border-gray-200 rounded-lg p-4" style={{ 
          backgroundColor: settings.accentColor,
          borderRadius: settings.borderRadius === 'none' ? '0' : 
                        settings.borderRadius === 'small' ? '4px' :
                        settings.borderRadius === 'rounded' ? '8px' : '16px'
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: settings.primaryColor }}
            />
            <h4 className="font-semibold" style={{ color: settings.secondaryColor }}>
              عنوان تجريبي
            </h4>
          </div>
          <p className="text-gray-600 mb-3">هذا نص تجريبي لمعاينة المظهر الجديد للفندق.</p>
          <button 
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: settings.primaryColor }}
          >
            زر تجريبي
          </button>
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

export default AppearanceSettings;
