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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const formTypes = [
    { key: 'guest', label: 'نموذج الضيوف', icon: Users },
    { key: 'room', label: 'نموذج الغرف', icon: Home }
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
      toast.error('فشل في تحميل إعدادات النماذج');
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

      toast.success('تم حفظ إعدادات النموذج بنجاح');
      await loadFormConfigurations();
    } catch (error) {
      console.error('Error saving form configuration:', error);
      toast.error('فشل في حفظ إعدادات النموذج');
    } finally {
      setSaving(false);
    }
  };

  const resetFormConfiguration = async (formType) => {
    if (!window.confirm('هل أنت متأكد من إعادة تعيين النموذج إلى الإعدادات الافتراضية؟')) {
      return;
    }

    try {
      setSaving(true);
      await api.formConfig.reset(formType);
      toast.success('تم إعادة تعيين النموذج بنجاح');
      await loadFormConfigurations();
    } catch (error) {
      console.error('Error resetting form configuration:', error);
      toast.error('فشل في إعادة تعيين النموذج');
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
  };

  const moveField = (formType, fieldIndex, direction) => {
    const config = formConfigs[formType];
    const fields = [...config.fields];
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    if (newIndex >= 0 && newIndex < fields.length) {
      [fields[fieldIndex], fields[newIndex]] = [fields[newIndex], fields[fieldIndex]];
      
      // Update order values
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
    }
  };

  const FieldConfigCard = ({ field, fieldIndex, formType }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${field.isRequired ? 'bg-red-500' : 'bg-gray-300'}`} />
            <h3 className="font-semibold text-gray-900">{field.fieldName}</h3>
            <span className="text-sm text-gray-500">({field.fieldKey})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveField(formType, fieldIndex, 'up')}
              disabled={fieldIndex === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveField(formType, fieldIndex, 'down')}
              disabled={fieldIndex === formConfigs[formType]?.fields.length - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">مطلوب</label>
            <button
              onClick={() => updateFieldConfig(formType, fieldIndex, { isRequired: !field.isRequired })}
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

          {/* Visible Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">مرئي</label>
            <button
              onClick={() => updateFieldConfig(formType, fieldIndex, { isVisible: !field.isVisible })}
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

          {/* Editable Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">قابل للتعديل</label>
            <button
              onClick={() => updateFieldConfig(formType, fieldIndex, { isEditable: !field.isEditable })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                field.isEditable ? 'bg-sysora-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  field.isEditable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Placeholder */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">النص التوضيحي</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateFieldConfig(formType, fieldIndex, { placeholder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            placeholder="أدخل النص التوضيحي"
          />
        </div>

        {/* Help Text */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">نص المساعدة</label>
          <input
            type="text"
            value={field.helpText || ''}
            onChange={(e) => updateFieldConfig(formType, fieldIndex, { helpText: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            placeholder="أدخل نص المساعدة"
          />
        </div>

        {/* Validation Rules */}
        {field.validation && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للطول</label>
              <input
                type="number"
                value={field.validation.minLength || ''}
                onChange={(e) => updateFieldConfig(formType, fieldIndex, {
                  validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للطول</label>
              <input
                type="number"
                value={field.validation.maxLength || ''}
                onChange={(e) => updateFieldConfig(formType, fieldIndex, {
                  validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Field Status Indicators */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            {field.isRequired ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className={field.isRequired ? 'text-red-600' : 'text-green-600'}>
              {field.isRequired ? 'مطلوب' : 'اختياري'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {field.isVisible ? (
              <Eye className="w-4 h-4 text-blue-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <span className={field.isVisible ? 'text-blue-600' : 'text-gray-500'}>
              {field.isVisible ? 'مرئي' : 'مخفي'}
            </span>
          </div>
        </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-primary"></div>
      </div>
    );
  }

  const currentConfig = formConfigs[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-sysora-primary" />
          <h1 className="text-2xl font-bold text-gray-900">إعدادات النماذج</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => resetFormConfiguration(activeTab)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </button>
          
          <button
            onClick={() => saveFormConfiguration(activeTab)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {formTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setActiveTab(type.key)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === type.key
                    ? 'border-sysora-primary text-sysora-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Configuration */}
      {currentConfig && (
        <div className="space-y-6">
          {/* Form Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات النموذج</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم النموذج</label>
                <input
                  type="text"
                  value={currentConfig.formName || ''}
                  onChange={(e) => setFormConfigs(prev => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], formName: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وصف النموذج</label>
                <input
                  type="text"
                  value={currentConfig.formDescription || ''}
                  onChange={(e) => setFormConfigs(prev => ({
                    ...prev,
                    [activeTab]: { ...prev[activeTab], formDescription: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Fields Configuration */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الحقول</h2>
            <div className="space-y-4">
              {currentConfig.fields?.map((field, index) => (
                <FieldConfigCard
                  key={field.fieldKey}
                  field={field}
                  fieldIndex={index}
                  formType={activeTab}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSettings;
