import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useFormConfiguration = (formType) => {
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load form configuration
  const loadFormConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.formConfig.getByType(formType);
      setFormConfig(response.data.data);
    } catch (err) {
      console.error('Error loading form configuration:', err);
      setError(err.response?.data?.message || 'فشل في تحميل إعدادات النموذج');
    } finally {
      setLoading(false);
    }
  }, [formType]);

  // Validate form data
  const validateFormData = useCallback(async (formData) => {
    try {
      const response = await api.formConfig.validate(formType, formData);
      
      return response.data.data;
    } catch (err) {
      console.error('Error validating form data:', err);
      throw new Error(err.response?.data?.message || 'فشل في التحقق من البيانات');
    }
  }, [formType]);

  // Get visible fields
  const getVisibleFields = useCallback(() => {
    if (!formConfig || !formConfig.fields) return [];
    
    return formConfig.fields
      .filter(field => field.isVisible)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [formConfig]);

  // Get required fields
  const getRequiredFields = useCallback(() => {
    if (!formConfig || !formConfig.fields) return [];
    
    return formConfig.fields
      .filter(field => field.isRequired && field.isVisible)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [formConfig]);

  // Get field by key
  const getFieldByKey = useCallback((fieldKey) => {
    if (!formConfig || !formConfig.fields) return null;
    
    return formConfig.fields.find(field => field.fieldKey === fieldKey);
  }, [formConfig]);

  // Check if field is required
  const isFieldRequired = useCallback((fieldKey) => {
    const field = getFieldByKey(fieldKey);
    return field ? field.isRequired : false;
  }, [getFieldByKey]);

  // Check if field is visible
  const isFieldVisible = useCallback((fieldKey) => {
    const field = getFieldByKey(fieldKey);
    return field ? field.isVisible : false;
  }, [getFieldByKey]);

  // Check if field is editable
  const isFieldEditable = useCallback((fieldKey) => {
    const field = getFieldByKey(fieldKey);
    return field ? field.isEditable : true;
  }, [getFieldByKey]);

  // Validate single field
  const validateField = useCallback((fieldKey, value) => {
    const field = getFieldByKey(fieldKey);
    if (!field) return { isValid: true };

    // Check if required
    if (field.isRequired && (!value || value.toString().trim() === '')) {
      return {
        isValid: false,
        message: `${field.fieldName} مطلوب`
      };
    }

    // Check validation rules
    if (value && field.validation) {
      const { minLength, maxLength, pattern } = field.validation;
      
      if (minLength && value.length < minLength) {
        return {
          isValid: false,
          message: `${field.fieldName} يجب أن يكون ${minLength} أحرف على الأقل`
        };
      }
      
      if (maxLength && value.length > maxLength) {
        return {
          isValid: false,
          message: `${field.fieldName} يجب أن يكون ${maxLength} أحرف كحد أقصى`
        };
      }
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return {
          isValid: false,
          message: field.validation.customMessage || `${field.fieldName} غير صحيح`
        };
      }
    }

    return { isValid: true };
  }, [getFieldByKey]);

  // Validate all form data
  const validateAllFields = useCallback((formData) => {
    const errors = {};
    const visibleFields = getVisibleFields();

    visibleFields.forEach(field => {
      const value = formData[field.fieldKey];
      const validation = validateField(field.fieldKey, value);
      
      if (!validation.isValid) {
        errors[field.fieldKey] = validation.message;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [getVisibleFields, validateField]);

  // Get field options for select fields
  const getFieldOptions = useCallback((fieldKey) => {
    const field = getFieldByKey(fieldKey);
    return field?.options || [];
  }, [getFieldByKey]);

  // Get default value for field
  const getFieldDefaultValue = useCallback((fieldKey) => {
    const field = getFieldByKey(fieldKey);
    if (!field) return '';

    // For select fields, find default option
    if (field.fieldType === 'select' && field.options) {
      const defaultOption = field.options.find(option => option.isDefault);
      return defaultOption ? defaultOption.value : '';
    }

    // For checkbox fields, return empty array
    if (field.fieldType === 'checkbox') {
      return [];
    }

    return '';
  }, [getFieldByKey]);

  // Generate form schema for validation libraries
  const getFormSchema = useCallback(() => {
    const schema = {};
    const visibleFields = getVisibleFields();

    visibleFields.forEach(field => {
      schema[field.fieldKey] = {
        type: field.fieldType,
        required: field.isRequired,
        label: field.fieldName,
        placeholder: field.placeholder,
        helpText: field.helpText,
        validation: field.validation,
        options: field.options
      };
    });

    return schema;
  }, [getVisibleFields]);

  // Load configuration on mount
  useEffect(() => {
    if (formType) {
      loadFormConfiguration();
    }
  }, [formType, loadFormConfiguration]);

  return {
    // State
    formConfig,
    loading,
    error,
    
    // Actions
    loadFormConfiguration,
    validateFormData,
    
    // Field utilities
    getVisibleFields,
    getRequiredFields,
    getFieldByKey,
    isFieldRequired,
    isFieldVisible,
    isFieldEditable,
    
    // Validation
    validateField,
    validateAllFields,
    
    // Field data
    getFieldOptions,
    getFieldDefaultValue,
    getFormSchema
  };
};

export default useFormConfiguration;
