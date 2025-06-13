import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Upload } from 'lucide-react';
import { useFormConfiguration } from '../../hooks/useFormConfiguration';

const DynamicForm = ({ 
  formType, 
  initialData = {}, 
  onSubmit, 
  onValidationChange,
  className = '',
  showRequiredIndicator = true 
}) => {
  const {
    formConfig,
    loading,
    error,
    getVisibleFields,
    validateField,
    validateAllFields,
    getFieldOptions,
    getFieldDefaultValue,
    isFieldRequired,
    isFieldEditable
  } = useFormConfiguration(formType);

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data with default values
  useEffect(() => {
    if (formConfig && Object.keys(initialData).length === 0) {
      const defaultData = {};
      const visibleFields = getVisibleFields();
      
      visibleFields.forEach(field => {
        defaultData[field.fieldKey] = getFieldDefaultValue(field.fieldKey);
      });
      
      setFormData(defaultData);
    }
  }, [formConfig, initialData, getVisibleFields, getFieldDefaultValue]);

  // Update form data when initialData changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Validate form when data changes
  useEffect(() => {
    if (formConfig) {
      const validation = validateAllFields(formData);
      setErrors(validation.errors);
      
      if (onValidationChange) {
        onValidationChange(validation.isValid, validation.errors);
      }
    }
  }, [formData, formConfig, validateAllFields, onValidationChange]);

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [fieldKey]: true
    }));

    // Validate field immediately
    if (formConfig) {
      const validation = validateField(fieldKey, value);
      setErrors(prev => ({
        ...prev,
        [fieldKey]: validation.isValid ? undefined : validation.message
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formConfig) {
      const validation = validateAllFields(formData);
      setErrors(validation.errors);
      
      // Mark all fields as touched
      const visibleFields = getVisibleFields();
      const allTouched = {};
      visibleFields.forEach(field => {
        allTouched[field.fieldKey] = true;
      });
      setTouched(allTouched);
      
      if (validation.isValid && onSubmit) {
        onSubmit(formData);
      }
    }
  };

  const renderField = (field) => {
    const value = formData[field.fieldKey] || '';
    const error = errors[field.fieldKey];
    const isTouched = touched[field.fieldKey];
    const isRequired = isFieldRequired(field.fieldKey);
    const isEditable = isFieldEditable(field.fieldKey);
    const options = getFieldOptions(field.fieldKey);

    const fieldProps = {
      id: field.fieldKey,
      name: field.fieldKey,
      value,
      onChange: (e) => handleFieldChange(field.fieldKey, e.target.value),
      disabled: !isEditable,
      className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent transition-colors ${
        error && isTouched 
          ? 'border-red-500 bg-red-50' 
          : 'border-gray-300 bg-white'
      } ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`,
      placeholder: field.placeholder
    };

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.fieldType}
            {...fieldProps}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            {...fieldProps}
            onChange={(e) => handleFieldChange(field.fieldKey, parseFloat(e.target.value) || '')}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            rows={3}
            className={fieldProps.className + ' resize-none'}
          />
        );

      case 'select':
        return (
          <select {...fieldProps}>
            <option value="">اختر {field.fieldName}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {options.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFieldChange(field.fieldKey, newValues);
                  }}
                  disabled={!isEditable}
                  className="rounded border-gray-300 text-sysora-primary focus:ring-sysora-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              {...fieldProps}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              {...fieldProps}
              onChange={(e) => handleFieldChange(field.fieldKey, e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor={field.fieldKey}
              className={`flex items-center justify-center gap-2 w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                error && isTouched 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-sysora-primary hover:bg-sysora-primary/5'
              }`}
            >
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {value ? value.name || 'تم اختيار ملف' : `اختر ${field.fieldName}`}
              </span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            {...fieldProps}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return null;
  }

  const visibleFields = getVisibleFields();

  return (
    <form id="dynamic-form" onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {visibleFields.map((field, index) => (
          <div
            key={field.fieldKey}
            className="space-y-2 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <label
              htmlFor={field.fieldKey}
              className="block text-sm font-medium text-gray-700"
            >
              {field.fieldName}
              {showRequiredIndicator && isFieldRequired(field.fieldKey) && (
                <span className="text-red-500 mr-1">*</span>
              )}
            </label>
            
            {renderField(field)}
            
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
            
            {errors[field.fieldKey] && touched[field.fieldKey] && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors[field.fieldKey]}
              </p>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default DynamicForm;
