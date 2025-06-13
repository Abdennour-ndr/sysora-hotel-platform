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
  Calendar,
  DollarSign,
  BarChart3,
  Zap,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsIntegrated = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hotelData, setHotelData] = useState({
    general: {
      hotelName: 'Grand Luxury Hotel',
      description: 'A premium hotel experience in the heart of the city',
      address: '123 Main Street, Downtown',
      city: 'New York',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      email: 'info@grandluxury.com',
      website: 'https://grandluxury.com',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxOccupancy: 4,
      currency: 'USD',
      timezone: 'America/New_York',
      logo: null
    },
    forms: {
      guestForm: {
        enabled: true,
        fields: [
          { id: 1, name: 'First Name', key: 'firstName', type: 'text', required: true, visible: true, order: 1 },
          { id: 2, name: 'Last Name', key: 'lastName', type: 'text', required: true, visible: true, order: 2 },
          { id: 3, name: 'Email', key: 'email', type: 'email', required: false, visible: true, order: 3 },
          { id: 4, name: 'Phone', key: 'phone', type: 'tel', required: true, visible: true, order: 4 },
          { id: 5, name: 'ID Number', key: 'idNumber', type: 'text', required: true, visible: true, order: 5 },
          { id: 6, name: 'Date of Birth', key: 'dateOfBirth', type: 'date', required: false, visible: true, order: 6 }
        ]
      },
      roomForm: {
        enabled: true,
        fields: [
          { id: 1, name: 'Room Number', key: 'roomNumber', type: 'text', required: true, visible: true, order: 1 },
          { id: 2, name: 'Room Type', key: 'roomType', type: 'select', required: true, visible: true, order: 2 },
          { id: 3, name: 'Floor', key: 'floor', type: 'number', required: true, visible: true, order: 3 },
          { id: 4, name: 'Max Capacity', key: 'maxCapacity', type: 'number', required: true, visible: true, order: 4 },
          { id: 5, name: 'Base Price', key: 'basePrice', type: 'number', required: true, visible: true, order: 5 },
          { id: 6, name: 'Description', key: 'description', type: 'textarea', required: false, visible: true, order: 6 }
        ]
      }
    },
    notifications: {
      email: {
        newBooking: true,
        paymentReceived: true,
        checkIn: false,
        checkOut: false,
        cancellation: true
      },
      sms: {
        newBooking: false,
        paymentReceived: false,
        checkIn: true,
        checkOut: true,
        cancellation: false
      },
      push: {
        newBooking: true,
        paymentReceived: true,
        checkIn: true,
        checkOut: true,
        cancellation: true
      }
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false
      },
      loginAttempts: 5,
      auditLog: true
    },
    appearance: {
      primaryColor: '#2EC4B6',
      secondaryColor: '#002D5B',
      accentColor: '#F9FAFB',
      logo: null,
      favicon: null,
      theme: 'light',
      borderRadius: 'rounded',
      fontFamily: 'Inter'
    },
    language: {
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      timezone: 'America/New_York',
      rtlSupport: false
    }
  });

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
      name: 'Form Builder',
      icon: FileText,
      description: 'Customize guest and room forms',
      badge: 'Pro',
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
      setLoading(true);
      
      // Simulate API save - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for persistence
      localStorage.setItem('hotelSettings', JSON.stringify(hotelData));
      
      const saveTime = new Date();
      setLastSaved(saveTime);
      setHasUnsavedChanges(false);
      
      toast.success('Settings saved successfully!', {
        icon: '✅',
        duration: 3000
      });
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (section, data) => {
    setHotelData(prev => ({
      ...prev,
      [section]: data
    }));
    setHasUnsavedChanges(true);
  };

  const handleResetAll = () => {
    if (window.confirm('This will reset ALL settings to default values. Continue?')) {
      // Reset to default values
      setHotelData({
        general: {
          hotelName: '',
          description: '',
          address: '',
          city: '',
          country: '',
          phone: '',
          email: '',
          website: '',
          starRating: 3,
          checkInTime: '14:00',
          checkOutTime: '12:00',
          maxOccupancy: 2,
          currency: 'USD',
          timezone: 'America/New_York',
          logo: null
        },
        forms: {
          guestForm: { enabled: true, fields: [] },
          roomForm: { enabled: true, fields: [] }
        },
        notifications: {
          email: { newBooking: false, paymentReceived: false, checkIn: false, checkOut: false, cancellation: false },
          sms: { newBooking: false, paymentReceived: false, checkIn: false, checkOut: false, cancellation: false },
          push: { newBooking: false, paymentReceived: false, checkIn: false, checkOut: false, cancellation: false }
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordPolicy: { minLength: 8, requireUppercase: false, requireNumbers: false, requireSymbols: false },
          loginAttempts: 3,
          auditLog: false
        },
        appearance: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          accentColor: '#F9FAFB',
          logo: null,
          favicon: null,
          theme: 'light',
          borderRadius: 'rounded',
          fontFamily: 'Inter'
        },
        language: {
          defaultLanguage: 'en',
          supportedLanguages: ['en'],
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          timezone: 'America/New_York',
          rtlSupport: false
        }
      });
      setHasUnsavedChanges(true);
      toast.success('Settings reset to defaults');
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(hotelData, null, 2);
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
          setHotelData(importedData);
          setHasUnsavedChanges(true);
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('hotelSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setHotelData(parsedSettings);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettingsSection 
            data={hotelData.general}
            onChange={(data) => handleDataChange('general', data)}
          />
        );
      case 'forms':
        return (
          <FormBuilderSection 
            data={hotelData.forms}
            onChange={(data) => handleDataChange('forms', data)}
          />
        );
      case 'notifications':
        return (
          <NotificationSettingsSection 
            data={hotelData.notifications}
            onChange={(data) => handleDataChange('notifications', data)}
          />
        );
      case 'security':
        return (
          <SecuritySettingsSection 
            data={hotelData.security}
            onChange={(data) => handleDataChange('security', data)}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettingsSection 
            data={hotelData.appearance}
            onChange={(data) => handleDataChange('appearance', data)}
          />
        );
      case 'language':
        return (
          <LanguageSettingsSection 
            data={hotelData.language}
            onChange={(data) => handleDataChange('language', data)}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Section Not Found</h3>
            <p className="text-gray-500">Please select a valid settings section</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-xl flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Hotel Settings</h1>
                  <p className="text-sm text-gray-500">Configure your hotel workspace</p>
                </div>
              </div>
              
              {/* Status Indicators */}
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
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
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

              {/* Action Buttons */}
              <button
                onClick={handleExportSettings}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <label className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm cursor-pointer">
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
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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
                <h2 className="font-semibold text-gray-900 text-sm">Settings Sections</h2>
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
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Quick Stats</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel Name</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    {hotelData.general.hotelName || 'Not Set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Star Rating</span>
                  <div className="flex items-center">
                    {[...Array(hotelData.general.starRating || 0)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Fields</span>
                  <span className="font-medium text-sysora-primary">
                    {hotelData.forms.guestForm.fields.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Fields</span>
                  <span className="font-medium text-sysora-primary">
                    {hotelData.forms.roomForm.fields.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Saved</span>
                  <span className="text-gray-500">
                    {lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}
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
              </div>

              {/* Content Body */}
              <div className="p-6">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettingsSection = ({ data, onChange }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'hotelName':
        return value.trim() ? '' : 'Hotel name is required';
      case 'email':
        return /\S+@\S+\.\S+/.test(value) ? '' : 'Please enter a valid email';
      case 'phone':
        return value.trim() ? '' : 'Phone number is required';
      default:
        return '';
    }
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('logo', e.target.result);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hotel Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Hotel Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Name *
            </label>
            <input
              type="text"
              value={formData.hotelName || ''}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              onBlur={(e) => handleBlur('hotelName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent ${
                errors.hotelName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter hotel name"
            />
            {errors.hotelName && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.hotelName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Star Rating
            </label>
            <select
              value={formData.starRating || 3}
              onChange={(e) => handleChange('starRating', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map(stars => (
                <option key={stars} value={stars}>
                  {stars} Star{stars > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="Brief description of your hotel..."
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Hotel Logo</h3>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
            {formData.logo ? (
              <img
                src={formData.logo}
                alt="Hotel Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG up to 2MB. Recommended: 200x200px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Builder Component
const FormBuilderSection = ({ data, onChange }) => {
  const [activeForm, setActiveForm] = useState('guestForm');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: '📝' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'tel', label: 'Phone Number', icon: '📞' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'textarea', label: 'Text Area', icon: '📄' },
    { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { value: 'radio', label: 'Radio Button', icon: '🔘' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'required', label: 'Required' },
    { value: 'optional', label: 'Optional' },
    { value: 'visible', label: 'Visible' },
    { value: 'hidden', label: 'Hidden' }
  ];

  const currentFormData = data[activeForm] || { enabled: true, fields: [] };

  const getFilteredFields = (fields) => {
    if (!fields) return [];

    let filtered = fields;

    if (searchTerm) {
      filtered = filtered.filter(field =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filterType) {
      case 'required':
        filtered = filtered.filter(field => field.required);
        break;
      case 'optional':
        filtered = filtered.filter(field => !field.required);
        break;
      case 'visible':
        filtered = filtered.filter(field => field.visible);
        break;
      case 'hidden':
        filtered = filtered.filter(field => !field.visible);
        break;
    }

    return filtered;
  };

  const filteredFields = getFilteredFields(currentFormData.fields);

  const handleFormChange = (formType) => {
    setActiveForm(formType);
    setSearchTerm('');
    setFilterType('all');
  };

  const handleFieldUpdate = (fieldId, updates) => {
    const updatedFields = currentFormData.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    const newData = {
      ...data,
      [activeForm]: {
        ...currentFormData,
        fields: updatedFields
      }
    };

    onChange(newData);
  };

  const handleAddField = (newField) => {
    const field = {
      id: Date.now(),
      name: newField.name,
      key: newField.key,
      type: newField.type,
      required: newField.required || false,
      visible: newField.visible !== false,
      placeholder: newField.placeholder || '',
      order: currentFormData.fields.length + 1
    };

    const newData = {
      ...data,
      [activeForm]: {
        ...currentFormData,
        fields: [...currentFormData.fields, field]
      }
    };

    onChange(newData);
    setShowAddField(false);
    toast.success('Field added successfully');
  };

  const handleRemoveField = (fieldId) => {
    if (window.confirm('Are you sure you want to remove this field?')) {
      const updatedFields = currentFormData.fields.filter(field => field.id !== fieldId);

      // Reorder remaining fields
      updatedFields.forEach((field, index) => {
        field.order = index + 1;
      });

      const newData = {
        ...data,
        [activeForm]: {
          ...currentFormData,
          fields: updatedFields
        }
      };

      onChange(newData);
      toast.success('Field removed successfully');
    }
  };

  const handleMoveField = (fieldId, direction) => {
    const fieldIndex = currentFormData.fields.findIndex(field => field.id === fieldId);
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;

    if (newIndex >= 0 && newIndex < currentFormData.fields.length) {
      const fields = [...currentFormData.fields];
      [fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]];

      // Update order
      fields.forEach((field, index) => {
        field.order = index + 1;
      });

      const newData = {
        ...data,
        [activeForm]: {
          ...currentFormData,
          fields
        }
      };

      onChange(newData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleFormChange('guestForm')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            activeForm === 'guestForm'
              ? 'border-sysora-primary bg-sysora-primary/5'
              : 'border-gray-200 hover:border-sysora-primary/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Guest Form</h3>
              <p className="text-sm text-gray-600 mt-1">Manage guest information fields</p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="text-green-600">
                  {data.guestForm?.fields?.filter(f => f.visible).length || 0} visible
                </span>
                <span className="text-orange-600">
                  {data.guestForm?.fields?.filter(f => f.required).length || 0} required
                </span>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleFormChange('roomForm')}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            activeForm === 'roomForm'
              ? 'border-sysora-primary bg-sysora-primary/5'
              : 'border-gray-200 hover:border-sysora-primary/30'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <Home className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Room Form</h3>
              <p className="text-sm text-gray-600 mt-1">Manage room information fields</p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="text-green-600">
                  {data.roomForm?.fields?.filter(f => f.visible).length || 0} visible
                </span>
                <span className="text-orange-600">
                  {data.roomForm?.fields?.filter(f => f.required).length || 0} required
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center space-x-1 px-4 py-2 bg-sysora-primary text-white rounded-md hover:bg-sysora-primary/90 transition-colors text-sm font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Add Field</span>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || filterType !== 'all') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700 text-sm">
              Showing {filteredFields.length} of {currentFormData.fields.length} fields
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>
      )}

      {/* Fields List */}
      <div className="space-y-3">
        {filteredFields.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No fields found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Add your first field to get started'
              }
            </p>
          </div>
        ) : (
          filteredFields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
              onMove={(direction) => handleMoveField(field.id, direction)}
              onRemove={() => handleRemoveField(field.id)}
              onEdit={() => setEditingField(field)}
            />
          ))
        )}
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <AddFieldModal
          onAdd={handleAddField}
          onClose={() => setShowAddField(false)}
          fieldTypes={fieldTypes}
        />
      )}
    </div>
  );
};

// Field Card Component
const FieldCard = ({ field, onUpdate, onMove, onRemove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${field.visible ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>

          <div>
            <h4 className="font-medium text-gray-900">{field.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{field.key}</span>
              <span>•</span>
              <span className="capitalize">{field.type}</span>
              {field.required && (
                <>
                  <span>•</span>
                  <span className="text-red-600">Required</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle buttons */}
          <button
            onClick={() => onUpdate({ required: !field.required })}
            className={`px-2 py-1 text-xs rounded ${
              field.required
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {field.required ? 'Required' : 'Optional'}
          </button>

          <button
            onClick={() => onUpdate({ visible: !field.visible })}
            className={`p-1 rounded ${
              field.visible
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            {field.visible ? '👁️' : '🙈'}
          </button>

          {/* Move buttons */}
          <button
            onClick={() => onMove('up')}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            ⬆️
          </button>

          <button
            onClick={() => onMove('down')}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            ⬇️
          </button>

          {/* Remove button */}
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Field Modal Component
const AddFieldModal = ({ onAdd, onClose, fieldTypes }) => {
  const [fieldData, setFieldData] = useState({
    name: '',
    key: '',
    type: 'text',
    required: false,
    visible: true,
    placeholder: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldData.name || !fieldData.key) {
      toast.error('Field name and key are required');
      return;
    }
    onAdd(fieldData);
  };

  const generateKey = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');
  };

  const handleNameChange = (name) => {
    setFieldData(prev => ({
      ...prev,
      name,
      key: generateKey(name)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Field</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name *
            </label>
            <input
              type="text"
              value={fieldData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="e.g., Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Key *
            </label>
            <input
              type="text"
              value={fieldData.key}
              onChange={(e) => setFieldData(prev => ({ ...prev, key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="e.g., fullName"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              value={fieldData.type}
              onChange={(e) => setFieldData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={fieldData.placeholder}
              onChange={(e) => setFieldData(prev => ({ ...prev, placeholder: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="Enter placeholder text..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={fieldData.required}
                onChange={(e) => setFieldData(prev => ({ ...prev, required: e.target.checked }))}
                className="rounded border-gray-300 text-sysora-primary focus:ring-sysora-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={fieldData.visible}
                onChange={(e) => setFieldData(prev => ({ ...prev, visible: e.target.checked }))}
                className="rounded border-gray-300 text-sysora-primary focus:ring-sysora-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Visible</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sysora-primary text-white rounded-md hover:bg-sysora-primary/90"
            >
              Add Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple placeholder components for other sections
const NotificationSettingsSection = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
      <div className="space-y-4">
        {Object.entries(data.email || {}).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <button
              onClick={() => onChange({ ...data, email: { ...data.email, [key]: !value } })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-sysora-primary' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SecuritySettingsSection = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Two-Factor Authentication</span>
          <button
            onClick={() => onChange({ ...data, twoFactorAuth: !data.twoFactorAuth })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.twoFactorAuth ? 'bg-sysora-primary' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              data.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={data.sessionTimeout || 30}
            onChange={(e) => onChange({ ...data, sessionTimeout: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            min="5"
            max="480"
          />
        </div>
      </div>
    </div>
  </div>
);

const AppearanceSettingsSection = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <input
            type="color"
            value={data.primaryColor || '#2EC4B6'}
            onChange={(e) => onChange({ ...data, primaryColor: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={data.theme || 'light'}
            onChange={(e) => onChange({ ...data, theme: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const LanguageSettingsSection = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Language
          </label>
          <select
            value={data.defaultLanguage || 'en'}
            onChange={(e) => onChange({ ...data, defaultLanguage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={data.currency || 'USD'}
            onChange={(e) => onChange({ ...data, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="DZD">Algerian Dinar (DZD)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsIntegrated;
