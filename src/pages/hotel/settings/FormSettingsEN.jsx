import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Copy,
  Download,
  Upload,
  Zap,
  Target,
  BarChart3,
  Settings2,
  Sparkles,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const FormSettings = ({ onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('guest');
  const [formConfigs, setFormConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const formTypes = [
    { 
      key: 'guest', 
      label: 'Guest Form', 
      icon: Users,
      description: 'Manage guest information fields',
      color: 'bg-blue-500'
    },
    { 
      key: 'room', 
      label: 'Room Form', 
      icon: Home,
      description: 'Manage room information and amenities fields',
      color: 'bg-green-500'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'required', label: 'Required Fields' },
    { value: 'optional', label: 'Optional Fields' },
    { value: 'visible', label: 'Visible Fields' },
    { value: 'hidden', label: 'Hidden Fields' }
  ];

  useEffect(() => {
    loadFormConfigurations();
  }, []);

  const loadFormConfigurations = async () => {
    try {
      setLoading(true);
      const response = await api.formConfig.getAll();
      const configs = {};
      
      response.data.data.forEach(config => {
        configs[config.formType] = config;
      });
      
      setFormConfigs(configs);
    } catch (error) {
      console.error('Error loading form configurations:', error);
      toast.error('Failed to load form configurations');
    } finally {
      setLoading(false);
    }
  };

  const saveFormConfiguration = async (formType) => {
    try {
      setSaving(true);
      const config = formConfigs[formType];
      
      if (config._id) {
        await api.formConfig.update(config._id, config);
      } else {
        await api.formConfig.create(config);
      }
      
      toast.success('Form configuration saved successfully');
      await loadFormConfigurations();
      
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('Error saving form configuration:', error);
      toast.error('Failed to save form configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetFormConfiguration = async (formType) => {
    if (!window.confirm('Are you sure you want to reset the form to default settings?')) {
      return;
    }

    try {
      setSaving(true);
      await api.formConfig.reset(formType);
      toast.success('Form reset successfully');
      await loadFormConfigurations();
    } catch (error) {
      console.error('Error resetting form configuration:', error);
      toast.error('Failed to reset form');
    } finally {
      setSaving(false);
    }
  };

  const updateFieldConfig = (formType, fieldIndex, updates) => {
    setFormConfigs(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        fields: prev[formType].fields.map((field, index) => 
          index === fieldIndex ? { ...field, ...updates } : field
        )
      }
    }));

    if (onSettingsChange) {
      onSettingsChange();
    }
  };

  const moveField = (formType, fieldIndex, direction) => {
    const config = formConfigs[formType];
    const fields = [...config.fields];
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    if (newIndex >= 0 && newIndex < fields.length) {
      [fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]];
      
      fields.forEach((field, index) => {
        field.order = index + 1;
      });
      
      setFormConfigs(prev => ({
        ...prev,
        [formType]: {
          ...prev[formType],
          fields
        }
      }));

      if (onSettingsChange) {
        onSettingsChange();
      }
    }
  };

  const getFilteredFields = (fields) => {
    if (!fields) return [];
    
    let filtered = fields;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(field => 
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.fieldKey.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'required':
        filtered = filtered.filter(field => field.isRequired);
        break;
      case 'optional':
        filtered = filtered.filter(field => !field.isRequired);
        break;
      case 'visible':
        filtered = filtered.filter(field => field.isVisible);
        break;
      case 'hidden':
        filtered = filtered.filter(field => !field.isVisible);
        break;
      default:
        break;
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-primary"></div>
      </div>
    );
  }

  const currentConfig = formConfigs[activeTab];
  const filteredFields = getFilteredFields(currentConfig?.fields || []);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sysora-primary to-sysora-mint rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Advanced Form Settings</h2>
            <p className="text-white/80">Comprehensive form field customization with advanced management tools</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-3">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Type Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeTab === type.key;
          const config = formConfigs[type.key];
          const visibleFields = config?.fields?.filter(f => f.isVisible).length || 0;
          const requiredFields = config?.fields?.filter(f => f.isRequired).length || 0;
          
          return (
            <button
              key={type.key}
              onClick={() => setActiveTab(type.key)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isActive
                  ? 'border-sysora-primary bg-sysora-primary/5'
                  : 'border-gray-200 hover:border-sysora-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${type.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-green-600">{visibleFields} visible</span>
                    <span className="text-red-600">{requiredFields} required</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Field Management</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetFormConfiguration(activeTab)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => saveFormConfiguration(activeTab)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent appearance-none"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || filterType !== 'all') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-blue-700">
                Found {filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''} out of {currentConfig?.fields?.length || 0}
              </span>
              {searchTerm && (
                <span className="text-blue-600">
                  for search: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fields List */}
        <div className="space-y-4">
          {filteredFields.map((field, index) => (
            <FieldConfigCard 
              key={field.fieldKey} 
              field={field} 
              fieldIndex={index} 
              formType={activeTab}
              onUpdate={updateFieldConfig}
              onMove={moveField}
            />
          ))}
        </div>
      </div>
    </div>
  );

  function FieldConfigCard({ field, fieldIndex, formType, onUpdate, onMove }) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${field.isVisible ? 'bg-green-500' : 'bg-gray-300'}`} />
              <h4 className="font-semibold text-gray-900">{field.fieldName}</h4>
              <span className="text-sm text-gray-500">({field.fieldKey})</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMove(formType, fieldIndex, 'up')}
                disabled={fieldIndex === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMove(formType, fieldIndex, 'down')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Required</span>
              <button
                onClick={() => onUpdate(formType, fieldIndex, { isRequired: !field.isRequired })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  field.isRequired ? 'bg-sysora-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    field.isRequired ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Visible</span>
              <button
                onClick={() => onUpdate(formType, fieldIndex, { isVisible: !field.isVisible })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  field.isVisible ? 'bg-sysora-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    field.isVisible ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-medium text-gray-900">{field.fieldType}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FormSettings;
