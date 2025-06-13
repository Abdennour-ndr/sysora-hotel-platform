import React, { useState, useEffect } from 'react';
import {
  Palette,
  Upload,
  Save,
  RotateCcw,
  Eye,
  Settings,
  Image,
  Type,
  Layout,
  Sliders,
  Code,
  Sparkles,
  DollarSign
} from 'lucide-react';
import useCustomization from '../hooks/useCustomization';
import CurrencySettings from '../components/CurrencySettings';
import { CURRENCIES } from '../utils/currencies';
import FeatureGateButton from '../components/FeatureGateButton';

const Customization = () => {
  const [activeTab, setActiveTab] = useState('theme');
  const [presets, setPresets] = useState([]);

  // Use the custom hook for all customization operations
  const {
    customization,
    loading,
    saving,
    updateTheme,
    updateBranding,
    updateLayout,
    updateUI,
    resetSettings,
    previewChanges,
    exportSettings
  } = useCustomization();

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/presets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPresets(data.data);
      }
    } catch (error) {
      console.error('Fetch presets error:', error);
    }
  };



  const applyPreset = async (presetId) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/presets/${presetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Use updateTheme from hook instead of setCustomization
        await updateTheme(data.data);
        applyThemeToDocument(data.data);
        window.showToast && window.showToast('تم تطبيق القالب بنجاح', 'success');
      } else {
        window.showToast && window.showToast('فشل في تطبيق القالب', 'error');
      }
    } catch (error) {
      console.error('Apply preset error:', error);
      window.showToast && window.showToast('حدث خطأ في تطبيق القالب', 'error');
    }
  };

  const applyThemeToDocument = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--sidebar-color', theme.sidebarColor);
    root.style.setProperty('--header-color', theme.headerColor);
  };

  const uploadLogo = async (file) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Use updateBranding from hook instead of setCustomization
        await updateBranding({
          logo: data.data.logoUrl
        });
        window.showToast && window.showToast('تم رفع الشعار بنجاح', 'success');
      } else {
        window.showToast && window.showToast('فشل في رفع الشعار', 'error');
      }
    } catch (error) {
      console.error('Upload logo error:', error);
      window.showToast && window.showToast('حدث خطأ في رفع الشعار', 'error');
    }
  };



  const tabs = [
    { id: 'theme', name: 'الألوان والثيم', icon: Palette },
    { id: 'branding', name: 'الشعار والعلامة التجارية', icon: Image },
    { id: 'layout', name: 'تخطيط لوحة التحكم', icon: Layout },
    { id: 'ui', name: 'واجهة المستخدم', icon: Sliders },
    { id: 'currency', name: 'إعدادات العملة', icon: DollarSign },
    { id: 'presets', name: 'القوالب الجاهزة', icon: Sparkles }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customization settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">تخصيص المظهر</h1>
                <p className="text-sm text-gray-500">قم بتخصيص مظهر نظام إدارة الفندق</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={previewChanges}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة</span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>العودة للوحة التحكم</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">إعدادات التخصيص</h3>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-right transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Theme Colors Tab */}
              {activeTab === 'theme' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">الألوان والثيم</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={resetSettings}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>إعادة تعيين</span>
                      </button>
                      <button
                        onClick={exportSettings}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>تصدير</span>
                      </button>
                      <button
                        onClick={() => updateTheme(customization?.theme)}
                        disabled={saving}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اللون الأساسي
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization?.theme?.primaryColor || '#002D5B'}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            // Apply preview immediately
                            previewChanges('theme', {
                              ...customization?.theme,
                              primaryColor: newColor
                            });
                          }}
                          onBlur={async (e) => {
                            // Save to database when user finishes selecting
                            const newTheme = {
                              ...customization?.theme,
                              primaryColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization?.theme?.primaryColor || '#002D5B'}
                          onChange={(e) => {
                            previewChanges('theme', {
                              ...customization?.theme,
                              primaryColor: e.target.value
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              primaryColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اللون الثانوي
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization?.theme?.secondaryColor || '#2EC4B6'}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            previewChanges('theme', {
                              ...customization?.theme,
                              secondaryColor: newColor
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              secondaryColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization?.theme?.secondaryColor || '#2EC4B6'}
                          onChange={(e) => {
                            previewChanges('theme', {
                              ...customization?.theme,
                              secondaryColor: e.target.value
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              secondaryColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        لون الخلفية
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization?.theme?.backgroundColor || '#FFFFFF'}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            previewChanges('theme', {
                              ...customization?.theme,
                              backgroundColor: newColor
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              backgroundColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization?.theme?.backgroundColor || '#FFFFFF'}
                          onChange={(e) => {
                            previewChanges('theme', {
                              ...customization?.theme,
                              backgroundColor: e.target.value
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              backgroundColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        لون النص
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customization?.theme?.textColor || '#1F2937'}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            previewChanges('theme', {
                              ...customization?.theme,
                              textColor: newColor
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              textColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customization?.theme?.textColor || '#1F2937'}
                          onChange={(e) => {
                            previewChanges('theme', {
                              ...customization?.theme,
                              textColor: e.target.value
                            });
                          }}
                          onBlur={async (e) => {
                            const newTheme = {
                              ...customization?.theme,
                              textColor: e.target.value
                            };
                            await updateTheme(newTheme);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">معاينة مباشرة</h4>
                    <div
                      className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                      style={{
                        backgroundColor: customization?.theme?.backgroundColor,
                        color: customization?.theme?.textColor
                      }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: customization?.theme?.primaryColor }}
                        >
                          S
                        </div>
                        <div>
                          <h5 className="font-semibold">اسم الفندق</h5>
                          <p className="text-sm opacity-75">معاينة النظام</p>
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: customization?.theme?.secondaryColor }}
                      >
                        زر تجريبي
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Presets Tab */}
              {activeTab === 'presets' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">القوالب الجاهزة</h3>
                    <p className="text-gray-600">اختر من القوالب الجاهزة لتطبيق مظهر سريع</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {presets.map((preset) => (
                      <div key={preset.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex space-x-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.theme.primaryColor }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.theme.secondaryColor }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: preset.theme.accentColor }}
                              ></div>
                            </div>
                            <h4 className="font-medium text-gray-900">{preset.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{preset.description}</p>
                          <button
                            onClick={() => applyPreset(preset.id)}
                            disabled={saving}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {saving ? 'جاري التطبيق...' : 'تطبيق القالب'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">تخطيط لوحة التحكم</h3>
                  <div className="space-y-6">
                    {/* Sidebar Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        موضع الشريط الجانبي
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => updateLayout({ sidebarPosition: 'left' })}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            customization?.dashboard?.sidebarPosition === 'left' || !customization?.dashboard?.sidebarPosition
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white rounded border mb-2 flex">
                            <div className="w-1/4 bg-blue-200 rounded-l"></div>
                            <div className="flex-1 bg-gray-100"></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            customization?.dashboard?.sidebarPosition === 'left' || !customization?.dashboard?.sidebarPosition ? 'text-blue-700' : 'text-gray-700'
                          }`}>يسار</span>
                        </button>
                        <button
                          onClick={() => updateLayout({ sidebarPosition: 'right' })}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            customization?.dashboard?.sidebarPosition === 'right'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white rounded border mb-2 flex">
                            <div className="flex-1 bg-gray-100"></div>
                            <div className="w-1/4 bg-blue-200 rounded-r"></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            customization?.dashboard?.sidebarPosition === 'right' ? 'text-blue-700' : 'text-gray-700'
                          }`}>يمين</span>
                        </button>
                      </div>
                    </div>

                    {/* Dashboard Layout */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        تخطيط لوحة التحكم
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => updateLayout({ layout: 'grid' })}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            customization?.dashboard?.layout === 'grid' || !customization?.dashboard?.layout
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white rounded border mb-2">
                            <div className="grid grid-cols-4 gap-1 p-2 h-full">
                              <div className="bg-blue-200 rounded"></div>
                              <div className="bg-blue-200 rounded"></div>
                              <div className="bg-blue-200 rounded"></div>
                              <div className="bg-blue-200 rounded"></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${
                            customization?.dashboard?.layout === 'grid' || !customization?.dashboard?.layout ? 'text-blue-700' : 'text-gray-700'
                          }`}>شبكة</span>
                        </button>
                        <button
                          onClick={() => updateLayout({ layout: 'list' })}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            customization?.dashboard?.layout === 'list'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white rounded border mb-2">
                            <div className="space-y-1 p-2 h-full">
                              <div className="bg-blue-200 rounded h-1/3"></div>
                              <div className="bg-blue-200 rounded h-1/3"></div>
                              <div className="bg-blue-200 rounded h-1/3"></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${
                            customization?.dashboard?.layout === 'list' ? 'text-blue-700' : 'text-gray-700'
                          }`}>قائمة</span>
                        </button>
                        <button
                          onClick={() => updateLayout({ layout: 'cards' })}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            customization?.dashboard?.layout === 'cards'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-full h-16 bg-white rounded border mb-2">
                            <div className="grid grid-cols-2 gap-1 p-2 h-full">
                              <div className="bg-blue-200 rounded"></div>
                              <div className="bg-blue-200 rounded"></div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${
                            customization?.dashboard?.layout === 'cards' ? 'text-blue-700' : 'text-gray-700'
                          }`}>بطاقات</span>
                        </button>
                      </div>
                    </div>

                    {/* Widget Settings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        إعدادات الودجات
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">إظهار الإحصائيات السريعة</span>
                          <button
                            onClick={() => updateLayout({
                              widgets: {
                                ...customization?.dashboard?.widgets,
                                showQuickStats: !customization?.dashboard?.widgets?.showQuickStats
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.dashboard?.widgets?.showQuickStats !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.dashboard?.widgets?.showQuickStats !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">إظهار الحجوزات الأخيرة</span>
                          <button
                            onClick={() => updateLayout({
                              widgets: {
                                ...customization?.dashboard?.widgets,
                                showRecentReservations: !customization?.dashboard?.widgets?.showRecentReservations
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.dashboard?.widgets?.showRecentReservations !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.dashboard?.widgets?.showRecentReservations !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">إظهار الإجراءات السريعة</span>
                          <button
                            onClick={() => updateLayout({
                              widgets: {
                                ...customization?.dashboard?.widgets,
                                showQuickActions: !customization?.dashboard?.widgets?.showQuickActions
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.dashboard?.widgets?.showQuickActions !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.dashboard?.widgets?.showQuickActions !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">إظهار مخطط الإيرادات</span>
                          <button
                            onClick={() => updateLayout({
                              widgets: {
                                ...customization?.dashboard?.widgets,
                                showRevenueChart: !customization?.dashboard?.widgets?.showRevenueChart
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.dashboard?.widgets?.showRevenueChart !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.dashboard?.widgets?.showRevenueChart !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">إظهار مخطط الإشغال</span>
                          <button
                            onClick={() => updateLayout({
                              widgets: {
                                ...customization?.dashboard?.widgets,
                                showOccupancyChart: !customization?.dashboard?.widgets?.showOccupancyChart
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.dashboard?.widgets?.showOccupancyChart !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.dashboard?.widgets?.showOccupancyChart !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UI Tab */}
              {activeTab === 'ui' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">واجهة المستخدم</h3>
                  <div className="space-y-6">
                    {/* Font Settings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        إعدادات الخط
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">نوع الخط</label>
                          <select
                            value={customization?.ui?.fontFamily || 'Inter'}
                            onChange={(e) => updateUI({ fontFamily: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Cairo">Cairo</option>
                            <option value="Tajawal">Tajawal</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">حجم الخط</label>
                          <select
                            value={customization?.ui?.fontSize || 'medium'}
                            onChange={(e) => updateUI({ fontSize: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="small">صغير</option>
                            <option value="medium">متوسط</option>
                            <option value="large">كبير</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        انحناء الحواف
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        <button
                          onClick={() => updateUI({ borderRadius: 'none' })}
                          className={`p-3 border-2 rounded text-center transition-colors ${
                            customization?.ui?.borderRadius === 'none'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-8 h-8 bg-blue-500 mx-auto mb-1"></div>
                          <span className={`text-xs ${
                            customization?.ui?.borderRadius === 'none' ? 'text-blue-700' : 'text-gray-700'
                          }`}>مربع</span>
                        </button>
                        <button
                          onClick={() => updateUI({ borderRadius: 'small' })}
                          className={`p-3 border-2 rounded text-center transition-colors ${
                            customization?.ui?.borderRadius === 'small'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-sm mx-auto mb-1"></div>
                          <span className={`text-xs ${
                            customization?.ui?.borderRadius === 'small' ? 'text-blue-700' : 'text-gray-700'
                          }`}>صغير</span>
                        </button>
                        <button
                          onClick={() => updateUI({ borderRadius: 'medium' })}
                          className={`p-3 border-2 rounded text-center transition-colors ${
                            customization?.ui?.borderRadius === 'medium' || !customization?.ui?.borderRadius
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-1"></div>
                          <span className={`text-xs ${
                            customization?.ui?.borderRadius === 'medium' || !customization?.ui?.borderRadius ? 'text-blue-700' : 'text-gray-700'
                          }`}>متوسط</span>
                        </button>
                        <button
                          onClick={() => updateUI({ borderRadius: 'large' })}
                          className={`p-3 border-2 rounded text-center transition-colors ${
                            customization?.ui?.borderRadius === 'large'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1"></div>
                          <span className={`text-xs ${
                            customization?.ui?.borderRadius === 'large' ? 'text-blue-700' : 'text-gray-700'
                          }`}>دائري</span>
                        </button>
                      </div>
                    </div>

                    {/* Animation Settings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        إعدادات الحركة
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">تفعيل الحركات</span>
                          <button
                            onClick={() => updateUI({
                              animations: {
                                ...customization?.ui?.animations,
                                enabled: !customization?.ui?.animations?.enabled
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.ui?.animations?.enabled !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.ui?.animations?.enabled !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">حركات الانتقال</span>
                          <button
                            onClick={() => updateUI({
                              animations: {
                                ...customization?.ui?.animations,
                                transitions: !customization?.ui?.animations?.transitions
                              }
                            })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              customization?.ui?.animations?.transitions !== false ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              customization?.ui?.animations?.transitions !== false ? 'right-0.5' : 'left-0.5'
                            }`}></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">سرعة الحركة</span>
                          <select
                            value={customization?.ui?.animations?.duration || 'normal'}
                            onChange={(e) => updateUI({
                              animations: {
                                ...customization?.ui?.animations,
                                duration: e.target.value
                              }
                            })}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="fast">سريع</option>
                            <option value="normal">عادي</option>
                            <option value="slow">بطيء</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">الشعار والعلامة التجارية</h3>
                    <button
                      onClick={() => {
                        const brandingData = {
                          companyName: document.querySelector('input[placeholder="أدخل اسم الفندق"]')?.value,
                          description: document.querySelector('textarea[placeholder="أدخل وصف الفندق"]')?.value,
                          phone: document.querySelector('input[placeholder="رقم الهاتف"]')?.value,
                          email: document.querySelector('input[placeholder="البريد الإلكتروني"]')?.value,
                          address: document.querySelector('textarea[placeholder="أدخل عنوان الفندق"]')?.value
                        };
                        updateBranding(brandingData);
                      }}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شعار الفندق
                      </label>
                      <div className="flex items-center space-x-4">
                        {customization?.branding?.logo && (
                          <div className="relative">
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${customization.branding.logo}`}
                              alt="Hotel Logo"
                              className="w-16 h-16 object-contain border rounded-lg"
                            />
                            <button
                              onClick={async () => {
                                await updateBranding({ logo: null });
                                window.showToast && window.showToast('تم حذف الشعار', 'info');
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              uploadLogo(e.target.files[0]);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        يُفضل استخدام صور بصيغة PNG أو SVG بحجم 200x200 بكسل
                      </p>
                    </div>

                    {/* Hotel Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الفندق
                      </label>
                      <input
                        type="text"
                        defaultValue={customization?.branding?.companyName || 'فندق سيسورا'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل اسم الفندق"
                      />
                    </div>

                    {/* Hotel Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وصف الفندق
                      </label>
                      <textarea
                        rows="3"
                        defaultValue={customization?.branding?.description || 'فندق فاخر يقدم أفضل الخدمات الفندقية'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل وصف الفندق"
                      />
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        معلومات الاتصال
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">رقم الهاتف</label>
                          <input
                            type="tel"
                            defaultValue={customization?.branding?.phone || '+966501234567'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="رقم الهاتف"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">البريد الإلكتروني</label>
                          <input
                            type="email"
                            defaultValue={customization?.branding?.email || 'info@sysora-hotel.com'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="البريد الإلكتروني"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان
                      </label>
                      <textarea
                        rows="2"
                        defaultValue={customization?.branding?.address || 'الرياض، المملكة العربية السعودية'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="أدخل عنوان الفندق"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Currency Settings Tab */}
              {activeTab === 'currency' && (
                <div className="p-6">
                  <CurrencySettings
                    currentCurrency={customization?.settings?.currency?.code || 'DZD'}
                    onCurrencyChange={(currencyCode) => {
                      // Preview currency change immediately
                      console.log('Currency changed to:', currencyCode);
                    }}
                    onSave={async (currencyCode) => {
                      // Save currency settings
                      const currencyData = {
                        code: currencyCode,
                        symbol: CURRENCIES[currencyCode]?.symbol || 'دج',
                        name: CURRENCIES[currencyCode]?.name || 'الدينار الجزائري',
                        position: CURRENCIES[currencyCode]?.position || 'after'
                      };

                      // Update hotel currency settings
                      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/hotels/currency`, {
                        method: 'PUT',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(currencyData)
                      });

                      if (!response.ok) {
                        throw new Error('Failed to update currency settings');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customization;
