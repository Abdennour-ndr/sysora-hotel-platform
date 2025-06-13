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
  Building,
  Users,
  Home,
  Clock,
  MapPin,
  Phone,
  Mail,
  Undo2,
  Redo2,
  History,
  Backup,
  RefreshCw,
  Zap,
  Star,
  TrendingUp,
  Activity,
  Database,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdvancedSettings } from '../../hooks/useAdvancedSettings';

// Import advanced components
import GeneralSettingsAdvanced from './settings/GeneralSettingsAdvanced';
import FormBuilderAdvanced from './settings/FormBuilderAdvanced';
import NotificationSettingsAdvanced from './settings/NotificationSettingsAdvanced';
import SecuritySettingsAdvanced from './settings/SecuritySettingsAdvanced';
import AppearanceSettingsAdvanced from './settings/AppearanceSettingsAdvanced';
import LanguageSettingsAdvanced from './settings/LanguageSettingsAdvanced';
import BackupManager from './settings/BackupManager';
import SettingsAnalytics from './settings/SettingsAnalytics';

const SettingsAdvanced = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);

  const {
    settings,
    loading,
    saving,
    hasUnsavedChanges,
    lastSaved,
    errors,
    autoSave,
    canUndo,
    canRedo,
    undo,
    redo,
    updateSettings,
    saveSettings,
    resetSettings,
    setAutoSave,
    exportSettings,
    importSettings,
    createBackup,
    getBackups,
    restoreBackup,
    validateField,
    getFieldError,
    clearFieldError
  } = useAdvancedSettings();

  const settingsSections = [
    {
      id: 'general',
      name: 'General Settings',
      icon: Building,
      description: 'Basic hotel information and configuration',
      color: 'from-blue-500 to-blue-600',
      component: GeneralSettingsAdvanced,
      priority: 'high'
    },
    {
      id: 'forms',
      name: 'Form Builder Pro',
      icon: FileText,
      description: 'Advanced form customization with templates',
      badge: 'Pro',
      color: 'from-green-500 to-green-600',
      component: FormBuilderAdvanced,
      priority: 'high'
    },
    {
      id: 'notifications',
      name: 'Smart Notifications',
      icon: Bell,
      description: 'Intelligent notification system',
      color: 'from-yellow-500 to-yellow-600',
      component: NotificationSettingsAdvanced,
      priority: 'medium'
    },
    {
      id: 'security',
      name: 'Security Center',
      icon: Shield,
      description: 'Advanced security and access control',
      color: 'from-red-500 to-red-600',
      component: SecuritySettingsAdvanced,
      priority: 'high'
    },
    {
      id: 'appearance',
      name: 'Brand Studio',
      icon: Palette,
      description: 'Professional branding and design',
      color: 'from-purple-500 to-purple-600',
      component: AppearanceSettingsAdvanced,
      priority: 'medium'
    },
    {
      id: 'language',
      name: 'Localization Hub',
      icon: Globe,
      description: 'Multi-language and regional settings',
      color: 'from-indigo-500 to-indigo-600',
      component: LanguageSettingsAdvanced,
      priority: 'medium'
    }
  ];

  const filteredSections = settingsSections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);
  const ActiveComponent = activeSettingsSection?.component;

  // Keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          saveSettings();
        }
      }
      
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }
      
      // Ctrl/Cmd + Shift + Z: Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }
      
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportSettings();
      }
      
      // Ctrl/Cmd + B: Create Backup
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        createBackup();
      }
      
      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowBackupManager(false);
        setShowAnalytics(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcuts, hasUnsavedChanges, canUndo, canRedo, saveSettings, undo, redo, exportSettings, createBackup]);

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Continue without saving?')) {
        setActiveSection(sectionId);
      }
    } else {
      setActiveSection(sectionId);
    }
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      importSettings(file);
      event.target.value = ''; // Reset file input
    }
  };

  const getCompletionStats = () => {
    const totalSections = settingsSections.length;
    const completedSections = Object.keys(settings).filter(key => 
      settings[key] && Object.keys(settings[key]).length > 0
    ).length;
    const completionRate = Math.round((completedSections / totalSections) * 100);
    
    return {
      totalSections,
      completedSections,
      completionRate,
      lastSaved: lastSaved ? lastSaved.toLocaleString() : 'Never'
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-xl flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Advanced Settings</h1>
                  <p className="text-sm text-gray-500">Professional hotel configuration center</p>
                </div>
              </div>
              
              {/* Enhanced Status Indicators */}
              <div className="flex items-center space-x-2">
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved Changes</span>
                  </div>
                )}
                
                {lastSaved && !hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>All Saved</span>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}

                {saving && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    <Database className="w-3 h-3 animate-pulse" />
                    <span>Saving...</span>
                  </div>
                )}

                {autoSave && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    <span>Auto-save On</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  {stats.completionRate}% Complete
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sysora-primary to-sysora-mint transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Undo/Redo */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              {/* Auto-save Toggle */}
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

              {/* Advanced Actions */}
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                title="View Analytics"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>

              <button
                onClick={() => setShowBackupManager(true)}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                title="Backup Manager (Ctrl+B)"
              >
                <Backup className="w-4 h-4" />
                <span className="hidden sm:inline">Backup</span>
              </button>

              <button
                onClick={exportSettings}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                title="Export Settings (Ctrl+E)"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <label className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={resetSettings}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={saveSettings}
                disabled={!hasUnsavedChanges || saving}
                className="flex items-center space-x-1 px-4 py-1.5 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                title="Save All (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 transition-all duration-300 ${
          sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'
        }`}>
          
          {/* Enhanced Sidebar */}
          {!sidebarCollapsed && (
            <div className="lg:col-span-1 space-y-4">
              {/* Search */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
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
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 text-sm">Configuration Sections</h2>
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
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-r ${section.color}`
                        }`}>
                          <Icon className="w-4 h-4 text-white" />
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

              {/* Enhanced Stats Panel */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Configuration Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Progress</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-sysora-primary to-sysora-mint transition-all duration-500"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-sysora-primary">{stats.completionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">{stats.completedSections}</div>
                      <div className="text-blue-500">Completed</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-gray-600">{stats.totalSections}</div>
                      <div className="text-gray-500">Total</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Last Saved</span>
                      <span className="text-gray-500">
                        {lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts Toggle */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Shortcuts</span>
                  </div>
                  <button
                    onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      keyboardShortcuts ? 'bg-sysora-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        keyboardShortcuts ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {keyboardShortcuts && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div>Ctrl+S: Save</div>
                    <div>Ctrl+Z: Undo</div>
                    <div>Ctrl+E: Export</div>
                    <div>Ctrl+B: Backup</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'lg:col-span-4'}`}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Content Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {activeSettingsSection && (
                      <>
                        <div className={`w-10 h-10 bg-gradient-to-r ${activeSettingsSection.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <activeSettingsSection.icon className="w-5 h-5 text-white" />
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
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
                    >
                      {sidebarCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {ActiveComponent ? (
                  <ActiveComponent 
                    data={settings[activeSection] || {}}
                    onChange={(data) => updateSettings({ ...settings, [activeSection]: data })}
                    errors={errors}
                    validateField={validateField}
                    getFieldError={getFieldError}
                    clearFieldError={clearFieldError}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SettingsIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">This section is under development</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Manager Modal */}
      {showBackupManager && (
        <BackupManager
          onClose={() => setShowBackupManager(false)}
          createBackup={createBackup}
          getBackups={getBackups}
          restoreBackup={restoreBackup}
        />
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <SettingsAnalytics
          onClose={() => setShowAnalytics(false)}
          settings={settings}
          stats={stats}
        />
      )}
    </div>
  );
};

export default SettingsAdvanced;
