import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Copy,
  Download,
  Upload,
  Settings,
  AlertCircle,
  CheckCircle,
  GripVertical,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const FormSettingsFixed = ({ onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('guest');
  const [formConfigs, setFormConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState(null);

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
      description: 'Manage room information fields',
      color: 'bg-green-500'
    }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone Number' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'required', label: 'Required' },
    { value: 'optional', label: 'Optional' },
    { value: 'visible', label: 'Visible' },
    { value: 'hidden', label: 'Hidden' }
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
      
      toast.success('Form saved successfully');
      await loadFormConfigurations();
      
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('Error saving form configuration:', error);
      toast.error('Failed to save form');
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

  const addNewField = (formType, newField) => {
    const config = formConfigs[formType];
    const fields = [...(config?.fields || [])];
    
    const field = {
      fieldKey: newField.fieldKey,
      fieldName: newField.fieldName,
      fieldType: newField.fieldType,
      isRequired: newField.isRequired || false,
      isVisible: newField.isVisible !== false,
      placeholder: newField.placeholder || '',
      order: fields.length + 1,
      validation: newField.validation || {},
      options: newField.options || []
    };
    
    fields.push(field);
    
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
    
    setShowAddField(false);
    toast.success('Field added successfully');
  };

  const removeField = (formType, fieldIndex) => {
    if (window.confirm('Are you sure you want to remove this field?')) {
      const config = formConfigs[formType];
      const fields = [...config.fields];
      fields.splice(fieldIndex, 1);
      
      // Reorder remaining fields
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
      
      toast.success('Field removed successfully');
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

    if (searchTerm) {
      filtered = filtered.filter(field => 
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.fieldKey.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
      {/* Form Type Selection */}
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
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? 'border-sysora-primary bg-sysora-primary/5'
                  : 'border-gray-200 hover:border-sysora-primary/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${type.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="text-green-600">{visibleFields} visible</span>
                    <span className="text-orange-600">{requiredFields} required</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Search */}
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

            {/* Filter */}
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddField(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-sysora-primary text-white rounded-md hover:bg-sysora-primary/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
            
            <button
              onClick={() => saveFormConfiguration(activeTab)}
              disabled={saving}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || filterType !== 'all') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700 text-sm">
              Showing {filteredFields.length} of {currentConfig?.fields?.length || 0} fields
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
              <Settings className="w-6 h-6 text-gray-400" />
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
          filteredFields.map((field, index) => (
            <FieldCard
              key={field.fieldKey}
              field={field}
              fieldIndex={index}
              formType={activeTab}
              onUpdate={updateFieldConfig}
              onMove={moveField}
              onRemove={removeField}
              onEdit={setEditingField}
            />
          ))
        )}
      </div>

      {/* Add Field Modal */}
      {showAddField && (
        <AddFieldModal
          formType={activeTab}
          onAdd={addNewField}
          onClose={() => setShowAddField(false)}
          fieldTypes={fieldTypes}
        />
      )}
    </div>
  );
};

// Field Card Component
const FieldCard = ({ field, fieldIndex, formType, onUpdate, onMove, onRemove, onEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <div className={`w-3 h-3 rounded-full ${field.isVisible ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{field.fieldName}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{field.fieldKey}</span>
              <span>•</span>
              <span className="capitalize">{field.fieldType}</span>
              {field.isRequired && (
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
            onClick={() => onUpdate(formType, fieldIndex, { isRequired: !field.isRequired })}
            className={`px-2 py-1 text-xs rounded ${
              field.isRequired 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {field.isRequired ? 'Required' : 'Optional'}
          </button>
          
          <button
            onClick={() => onUpdate(formType, fieldIndex, { isVisible: !field.isVisible })}
            className={`p-1 rounded ${
              field.isVisible 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            {field.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Move buttons */}
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

          {/* Actions */}
          <button
            onClick={() => onEdit(field)}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onRemove(formType, fieldIndex)}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Field Modal Component
const AddFieldModal = ({ formType, onAdd, onClose, fieldTypes }) => {
  const [fieldData, setFieldData] = useState({
    fieldKey: '',
    fieldName: '',
    fieldType: 'text',
    isRequired: false,
    isVisible: true,
    placeholder: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldData.fieldKey || !fieldData.fieldName) {
      toast.error('Field key and name are required');
      return;
    }
    onAdd(formType, fieldData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Field</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              value={fieldData.fieldName}
              onChange={(e) => setFieldData(prev => ({ ...prev, fieldName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="e.g., Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Key
            </label>
            <input
              type="text"
              value={fieldData.fieldKey}
              onChange={(e) => setFieldData(prev => ({ ...prev, fieldKey: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="e.g., fullName"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              value={fieldData.fieldType}
              onChange={(e) => setFieldData(prev => ({ ...prev, fieldType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
                checked={fieldData.isRequired}
                onChange={(e) => setFieldData(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="rounded border-gray-300 text-sysora-primary focus:ring-sysora-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={fieldData.isVisible}
                onChange={(e) => setFieldData(prev => ({ ...prev, isVisible: e.target.checked }))}
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

export default FormSettingsFixed;
