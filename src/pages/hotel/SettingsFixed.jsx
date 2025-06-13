import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  FileText,
  Save,
  RotateCcw,
  Search,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import improved components
import FormSettingsFixed from './settings/FormSettingsFixed';
import GeneralSettingsFixed from './settings/GeneralSettingsFixed';

const SettingsFixed = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: Building,
      description: 'Basic hotel information and configuration',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'forms',
      name: 'Form Settings',
      icon: FileText,
      description: 'Customize form fields and validation',
      badge: 'New',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Alert and notification preferences',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Security and privacy settings',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: Palette,
      description: 'Theme and visual customization',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'language',
      name: 'Language & Region',
      icon: Globe,
      description: 'Language and regional settings',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: CreditCard,
      description: 'Subscription and payment settings',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && autoSave) {
      const timer = setTimeout(() => {
        handleSaveAll();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, autoSave]);

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Continue without saving?')) {
        setActiveSection(sectionId);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveSection(sectionId);
    }
  };

  const handleSaveAll = async () => {
    try {
      setLastSaved(new Date());
      toast.success('Settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all settings to default values?')) {
      toast.success('Settings reset successfully');
      setHasUnsavedChanges(false);
    }
  };

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettingsFixed onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'forms':
        return <FormSettingsFixed onSettingsChange={() => setHasUnsavedChanges(true)} />;
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Hotel Settings</h1>
                  <p className="text-sm text-gray-500">Configure your hotel</p>
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center space-x-2">
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved</span>
                  </div>
                )}
                
                {lastSaved && !hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>Saved</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Auto-save toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Auto-save</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoSave ? 'bg-sysora-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action buttons */}
              <button
                onClick={handleResetAll}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges}
                className="flex items-center space-x-1 px-4 py-1.5 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Save All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 text-sm">Settings</h2>
              </div>
              
              <nav className="p-2 space-y-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 p-2.5 rounded-md text-left transition-all text-sm ${
                        isActive
                          ? 'bg-sysora-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{section.name}</div>
                        {section.badge && (
                          <span className={`inline-block px-1.5 py-0.5 text-xs rounded mt-0.5 ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-sysora-primary text-white'
                          }`}>
                            {section.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Quick Info</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Forms</span>
                  <span className="font-medium text-sysora-primary">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fields</span>
                  <span className="font-medium text-green-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated</span>
                  <span className="text-gray-500">
                    {lastSaved ? 'Today' : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Content Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {activeSettingsSection && (
                    <>
                      <div className={`w-8 h-8 bg-gradient-to-r ${activeSettingsSection.color} rounded-lg flex items-center justify-center`}>
                        <activeSettingsSection.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {activeSettingsSection.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {activeSettingsSection.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4">
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsFixed;
