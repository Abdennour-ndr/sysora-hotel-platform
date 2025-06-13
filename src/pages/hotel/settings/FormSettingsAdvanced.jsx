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
  Edit3,
  Layout,
  Palette,
  Code,
  Monitor
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const FormSettingsAdvanced = ({ onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('guest');
  const [formConfigs, setFormConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const formTypes = [
    { 
      key: 'guest', 
      label: 'نموذج الضيوف', 
      icon: Users,
      description: 'إدارة حقول معلومات الضيوف والنزلاء',
      color: 'bg-blue-500'
    },
    { 
      key: 'room', 
      label: 'نموذج الغرف', 
      icon: Home,
      description: 'إدارة حقول معلومات الغرف والمرافق',
      color: 'bg-green-500'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'جميع الحقول' },
    { value: 'required', label: 'الحقول المطلوبة' },
    { value: 'optional', label: 'الحقول الاختيارية' },
    { value: 'visible', label: 'الحقول المرئية' },
    { value: 'hidden', label: 'الحقول المخفية' }
  ];

  const bulkActions = [
    { value: '', label: 'اختر إجراء جماعي' },
    { value: 'make_required', label: 'جعل مطلوب' },
    { value: 'make_optional', label: 'جعل اختياري' },
    { value: 'show', label: 'إظهار' },
    { value: 'hide', label: 'إخفاء' },
    { value: 'delete', label: 'حذف' }
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
      
      if (onSettingsChange) {
        onSettingsChange();
      }
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

  const handleFieldSelection = (fieldIndex, isSelected) => {
    if (isSelected) {
      setSelectedFields(prev => [...prev, fieldIndex]);
    } else {
      setSelectedFields(prev => prev.filter(index => index !== fieldIndex));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedFields.length === 0) return;

    const currentConfig = formConfigs[activeTab];
    if (!currentConfig) return;

    const updates = {};
    
    switch (bulkAction) {
      case 'make_required':
        updates.isRequired = true;
        break;
      case 'make_optional':
        updates.isRequired = false;
        break;
      case 'show':
        updates.isVisible = true;
        break;
      case 'hide':
        updates.isVisible = false;
        break;
      case 'delete':
        if (window.confirm(`هل أنت متأكد من حذف ${selectedFields.length} حقل؟`)) {
          const newFields = currentConfig.fields.filter((_, index) => !selectedFields.includes(index));
          setFormConfigs(prev => ({
            ...prev,
            [activeTab]: {
              ...prev[activeTab],
              fields: newFields
            }
          }));
          setSelectedFields([]);
          setBulkAction('');
          toast.success('تم حذف الحقول المحددة');
          return;
        }
        return;
      default:
        return;
    }

    selectedFields.forEach(fieldIndex => {
      updateFieldConfig(activeTab, fieldIndex, updates);
    });

    setSelectedFields([]);
    setBulkAction('');
    toast.success('تم تطبيق الإجراء على الحقول المحددة');
  };

  const exportConfiguration = async (formType) => {
    try {
      const config = formConfigs[formType];
      const dataStr = JSON.stringify(config, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${formType}-form-config.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('تم تصدير الإعدادات بنجاح');
    } catch (error) {
      toast.error('فشل في تصدير الإعدادات');
    }
  };

  const importConfiguration = async (formType, file) => {
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      setFormConfigs(prev => ({
        ...prev,
        [formType]: config
      }));
      
      toast.success('تم استيراد الإعدادات بنجاح');
    } catch (error) {
      toast.error('فشل في استيراد الإعدادات');
    }
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
            <h2 className="text-2xl font-bold mb-2">إعدادات النماذج المتقدمة</h2>
            <p className="text-white/80">تخصيص شامل لحقول النماذج مع أدوات متقدمة للإدارة</p>
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
              className={`p-6 rounded-xl border-2 transition-all text-right ${
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
                    <span className="text-green-600">{visibleFields} مرئي</span>
                    <span className="text-red-600">{requiredFields} مطلوب</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">أدوات متقدمة</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-sysora-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              معاينة
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showAdvanced 
                  ? 'bg-sysora-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              متقدم
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الحقول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent appearance-none"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            disabled={selectedFields.length === 0}
          >
            {bulkActions.map(action => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>

          {/* Apply Bulk Action */}
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedFields.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-4 h-4" />
            تطبيق ({selectedFields.length})
          </button>
        </div>

        {/* Export/Import */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => exportConfiguration(activeTab)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                تصدير الإعدادات
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                استيراد الإعدادات
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      importConfiguration(activeTab, file);
                    }
                  }}
                />
              </label>

              <button
                onClick={() => resetFormConfiguration(activeTab)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة تعيين
              </button>

              <button
                onClick={() => saveFormConfiguration(activeTab)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {(searchTerm || filterType !== 'all') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-blue-700">
              تم العثور على {filteredFields.length} حقل من أصل {currentConfig?.fields?.length || 0}
            </span>
            {searchTerm && (
              <span className="text-blue-600">
                للبحث: "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      )}

      {/* Fields List will continue in the next part... */}
    </div>
  );
};

export default FormSettingsAdvanced;
