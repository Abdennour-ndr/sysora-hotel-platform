import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import FormSettingsImproved from './settings/FormSettingsImproved';
import GeneralSettingsImproved from './settings/GeneralSettingsImproved';
import NotificationSettingsImproved from './settings/NotificationSettingsImproved';
import SecuritySettingsImproved from './settings/SecuritySettingsImproved';
import AppearanceSettingsImproved from './settings/AppearanceSettingsImproved';
import LanguageSettingsImproved from './settings/LanguageSettingsImproved';
import BillingSettingsImproved from './settings/BillingSettingsImproved';

const SettingsImproved = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: SettingsIcon,
      description: 'Basic hotel settings and general information',
      component: GeneralSettingsImproved,
      color: 'bg-blue-500'
    },
    {
      id: 'forms',
      name: 'Form Settings',
      icon: FileText,
      description: 'Customize form fields and validation rules',
      component: FormSettingsImproved,
      badge: 'New',
      color: 'bg-green-500'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Notification and alert settings',
      component: NotificationSettingsImproved,
      color: 'bg-yellow-500'
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: Shield,
      description: 'Security settings and user permissions',
      component: SecuritySettingsImproved,
      color: 'bg-red-500'
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: Palette,
      description: 'Interface colors, logo and design',
      component: AppearanceSettingsImproved,
      color: 'bg-purple-500'
    },
    {
      id: 'language',
      name: 'Language & Region',
      icon: Globe,
      description: 'Language, currency and timezone settings',
      component: LanguageSettingsImproved,
      color: 'bg-indigo-500'
    },
    {
      id: 'billing',
      name: 'Billing & Subscription',
      icon: CreditCard,
      description: 'Manage subscription, billing and payments',
      component: BillingSettingsImproved,
      color: 'bg-pink-500'
    }
  ];

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);
  const ActiveComponent = activeSettingsSection?.component;

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && autoSave) {
      const timer = setTimeout(() => {
        handleSaveAll();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSave]);

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

  const handleSaveAll = async () => {
    try {
      // Save all settings logic here
      setLastSaved(new Date());
      toast.success('All settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      toast.success('Settings reset successfully');
      setHasUnsavedChanges(false);
    }
  };

  const handleExportSettings = () => {
    // Export settings logic
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Import settings logic
      toast.success('Settings imported successfully');
      setHasUnsavedChanges(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sysora-primary rounded-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Hotel Settings</h1>
                  <p className="text-sm text-gray-500">Manage your hotel configuration</p>
                </div>
              </div>
              
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Unsaved changes</span>
                </div>
              )}
              
              {lastSaved && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Auto-save toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto-save</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSave ? 'bg-sysora-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Export/Import */}
              <button
                onClick={handleExportSettings}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <label className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>

              {/* Reset */}
              <button
                onClick={handleResetAll}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              {/* Save */}
              <button
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Settings Sections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Settings Sections</h2>
              </div>
              
              <nav className="space-y-1 p-2">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-sysora-primary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : section.color}`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white'}`} />
                        </div>
                        <div className="text-left">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
                  <span className="text-sm text-gray-500">
                    {lastSaved ? lastSaved.toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Section Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  {activeSettingsSection && (
                    <>
                      <div className={`p-3 rounded-lg ${activeSettingsSection.color}`}>
                        <activeSettingsSection.icon className="w-6 h-6 text-white" />
                      </div>
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

export default SettingsImproved;
