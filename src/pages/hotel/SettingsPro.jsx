import React, { useState, useEffect, useCallback } from 'react';
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
  Building,
  Zap,
  Filter,
  MoreVertical,
  Maximize2,
  Minimize2,
  RefreshCw,
  History,
  Star,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import professional components
import FormSettingsPro from './settings/FormSettingsPro';
import GeneralSettingsPro from './settings/GeneralSettingsPro';
import NotificationSettingsPro from './settings/NotificationSettingsPro';
import SecuritySettingsPro from './settings/SecuritySettingsPro';
import AppearanceSettingsPro from './settings/AppearanceSettingsPro';
import LanguageSettingsPro from './settings/LanguageSettingsPro';
import BillingSettingsPro from './settings/BillingSettingsPro';

const SettingsPro = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsData, setSettingsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveHistory, setSaveHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: Building,
      description: 'Basic hotel information and configuration',
      color: 'from-blue-500 to-blue-600',
      component: GeneralSettingsPro,
      priority: 'high'
    },
    {
      id: 'forms',
      name: 'Form Builder',
      icon: FileText,
      description: 'Advanced form customization and field management',
      badge: 'Pro',
      color: 'from-green-500 to-green-600',
      component: FormSettingsPro,
      priority: 'high'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Smart notification system and alerts',
      color: 'from-yellow-500 to-yellow-600',
      component: NotificationSettingsPro,
      priority: 'medium'
    },
    {
      id: 'security',
      name: 'Security Center',
      icon: Shield,
      description: 'Advanced security and privacy controls',
      color: 'from-red-500 to-red-600',
      component: SecuritySettingsPro,
      priority: 'high'
    },
    {
      id: 'appearance',
      name: 'Brand & Design',
      icon: Palette,
      description: 'Professional branding and visual customization',
      color: 'from-purple-500 to-purple-600',
      component: AppearanceSettingsPro,
      priority: 'medium'
    },
    {
      id: 'language',
      name: 'Localization',
      icon: Globe,
      description: 'Multi-language and regional settings',
      color: 'from-indigo-500 to-indigo-600',
      component: LanguageSettingsPro,
      priority: 'medium'
    },
    {
      id: 'billing',
      name: 'Billing & Plans',
      icon: CreditCard,
      description: 'Subscription management and billing',
      color: 'from-pink-500 to-pink-600',
      component: BillingSettingsPro,
      priority: 'low'
    }
  ];

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);
  const ActiveComponent = activeSettingsSection?.component;

  // Auto-save with debounce
  const debouncedAutoSave = useCallback(
    debounce(() => {
      if (hasUnsavedChanges && autoSave) {
        handleSaveAll();
      }
    }, 2000),
    [hasUnsavedChanges, autoSave]
  );

  useEffect(() => {
    debouncedAutoSave();
    return debouncedAutoSave.cancel;
  }, [debouncedAutoSave]);

  // Load initial data
  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        general: {
          hotelName: 'Grand Luxury Hotel',
          description: 'A premium hotel experience in the heart of the city',
          starRating: 5,
          // ... more data
        },
        forms: {
          guestForm: { fields: [], customizations: {} },
          roomForm: { fields: [], customizations: {} }
        },
        // ... other sections
      };
      
      setSettingsData(mockData);
      setLastSaved(new Date());
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
      
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const saveTime = new Date();
      setLastSaved(saveTime);
      setHasUnsavedChanges(false);
      
      // Add to save history
      setSaveHistory(prev => [
        { timestamp: saveTime, section: activeSection, user: 'Admin' },
        ...prev.slice(0, 9) // Keep last 10 saves
      ]);
      
      toast.success('All settings saved successfully', {
        icon: '✅',
        duration: 3000
      });
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('This will reset ALL settings to default values. This action cannot be undone. Continue?')) {
      setSettingsData({});
      setHasUnsavedChanges(true);
      toast.success('Settings reset to defaults');
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hotel-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported successfully');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setSettingsData(importedData);
          setHasUnsavedChanges(true);
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStats = () => {
    const totalSections = settingsSections.length;
    const completedSections = Object.keys(settingsData).length;
    const completionRate = Math.round((completedSections / totalSections) * 100);
    
    return {
      totalSections,
      completedSections,
      completionRate,
      lastSaved: lastSaved ? lastSaved.toLocaleString() : 'Never'
    };
  };

  const stats = getStats();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      
      {/* Professional Header */}
      <div className={`border-b sticky top-0 z-40 backdrop-blur-sm ${
        isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-xl flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Hotel Settings Pro
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Professional Configuration Center
                  </p>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-2">
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium animate-pulse">
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

                {loading && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Processing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Completion Progress */}
              <div className="hidden md:flex items-center space-x-2">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stats.completionRate}% Complete
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sysora-primary to-sysora-mint transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Auto-save Toggle */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Auto-save
                </span>
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

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleExportSettings}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    isDarkMode 
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <label className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm cursor-pointer ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleResetAll}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    isDarkMode 
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleSaveAll}
                  disabled={!hasUnsavedChanges || loading}
                  className="flex items-center space-x-1 px-4 py-1.5 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save All'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 transition-all duration-300 ${
          sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'
        }`}>
          
          {/* Professional Sidebar */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1 space-y-4">
              {/* Search */}
              <div className={`rounded-lg border p-3 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className={`rounded-lg border overflow-hidden ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Configuration Sections
                  </h2>
                </div>
                
                <nav className="p-2 space-y-1">
                  {filteredSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full flex items-center space-x-3 p-2.5 rounded-md text-left transition-all text-sm group ${
                          isActive
                            ? 'bg-sysora-primary text-white shadow-sm'
                            : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-r ${section.color}`
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-white'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{section.name}</div>
                          <div className={`text-xs truncate ${
                            isActive ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {section.description}
                          </div>
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
                        
                        {section.priority === 'high' && (
                          <Star className={`w-3 h-3 ${
                            isActive ? 'text-white' : 'text-yellow-500'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Stats Panel */}
              <div className={`rounded-lg border p-3 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuration Stats
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Sections</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.completedSections}/{stats.totalSections}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                    <span className="font-medium text-sysora-primary">{stats.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last Saved</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save History */}
              {saveHistory.length > 0 && (
                <div className={`rounded-lg border p-3 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <History className="w-4 h-4 text-gray-400" />
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recent Saves
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {saveHistory.slice(0, 3).map((save, index) => (
                      <div key={index} className="text-xs">
                        <div className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {save.section}
                        </div>
                        <div className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>
                          {save.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'lg:col-span-4'}`}>
            <div className={`rounded-lg border shadow-sm ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              {/* Content Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {activeSettingsSection && (
                      <>
                        <div className={`w-10 h-10 bg-gradient-to-r ${activeSettingsSection.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <activeSettingsSection.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activeSettingsSection.name}
                          </h2>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {activeSettingsSection.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {ActiveComponent ? (
                  <ActiveComponent 
                    onSettingsChange={() => setHasUnsavedChanges(true)}
                    settingsData={settingsData[activeSection] || {}}
                    onDataChange={(data) => setSettingsData(prev => ({ ...prev, [activeSection]: data }))}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <SettingsIcon className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Coming Soon
                    </h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      This section is under development
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  const debounced = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  debounced.cancel = function() {
    clearTimeout(timeout);
  };
  return debounced;
}

export default SettingsPro;
