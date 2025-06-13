import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  FileText,
  ChevronRight,
  Save,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import FormSettings from './settings/FormSettingsEN';
import GeneralSettings from './settings/GeneralSettingsEN';
import NotificationSettings from './settings/NotificationSettings';
import SecuritySettings from './settings/SecuritySettings';
import AppearanceSettings from './settings/AppearanceSettings';
import LanguageSettings from './settings/LanguageSettings';
import BillingSettings from './settings/BillingSettings';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: SettingsIcon,
      description: 'Basic hotel settings and general information',
      component: GeneralSettings
    },
    {
      id: 'forms',
      name: 'Form Settings',
      icon: FileText,
      description: 'Customize form fields and validation rules',
      component: FormSettings,
      badge: 'New'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Notification and alert settings',
      component: NotificationSettings
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: Shield,
      description: 'Security settings and user permissions',
      component: SecuritySettings
    },
    {
      id: 'appearance',
      name: 'Appearance & Customization',
      icon: Palette,
      description: 'Interface colors, logo and design',
      component: AppearanceSettings
    },
    {
      id: 'language',
      name: 'Language & Region',
      icon: Globe,
      description: 'Language, currency and timezone settings',
      component: LanguageSettings
    },
    {
      id: 'billing',
      name: 'Billing & Subscription',
      icon: CreditCard,
      description: 'Manage subscription, billing and payments',
      component: BillingSettings
    }
  ];

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);
  const ActiveComponent = activeSettingsSection?.component;

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to continue without saving?')) {
        setActiveSection(sectionId);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveSection(sectionId);
    }
  };

  const handleSaveAll = () => {
    // Save all settings
    toast.success('All settings saved successfully');
    setHasUnsavedChanges(false);
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      toast.success('Settings reset successfully');
      setHasUnsavedChanges(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-6 h-6 text-sysora-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Hotel Settings</h1>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Settings Sections</h2>
              </div>
              
              <nav className="space-y-1 p-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-colors ${
                        isActive
                          ? 'bg-sysora-primary text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <div className="text-right">
                          <div className="font-medium">{section.name}</div>
                          {section.badge && (
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                              isActive 
                                ? 'bg-white/20 text-white' 
                                : 'bg-sysora-primary text-white'
                            }`}>
                              {section.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Custom Forms</span>
                  <span className="font-semibold text-sysora-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Fields</span>
                  <span className="font-semibold text-green-600">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {activeSettingsSection && (
                    <>
                      <activeSettingsSection.icon className="w-6 h-6 text-sysora-primary" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {activeSettingsSection.name}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {activeSettingsSection.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {ActiveComponent && (
                  <ActiveComponent 
                    onSettingsChange={() => setHasUnsavedChanges(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
