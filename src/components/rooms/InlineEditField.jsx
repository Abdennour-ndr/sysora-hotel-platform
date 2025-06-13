import React, { useState, useEffect, useRef } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const InlineEditField = ({
  value,
  type = 'text',
  onSave,
  onCancel,
  className = '',
  placeholder = '',
  validation = null,
  multiline = false,
  selectOnFocus = true,
  autoFocus = true,
  minValue = null,
  maxValue = null,
  maxLength = null
}) => {
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (selectOnFocus && type === 'text') {
        inputRef.current.select();
      }
    }
  }, [autoFocus, selectOnFocus, type]);

  useEffect(() => {
    validateValue(editValue);
  }, [editValue]);

  const validateValue = (val) => {
    let errorMsg = '';
    let valid = true;

    // Basic validation
    if (type === 'number') {
      const numVal = parseFloat(val);
      if (isNaN(numVal)) {
        errorMsg = 'Please enter a valid number';
        valid = false;
      } else {
        if (minValue !== null && numVal < minValue) {
          errorMsg = `Value must be at least ${minValue}`;
          valid = false;
        }
        if (maxValue !== null && numVal > maxValue) {
          errorMsg = `Value must be at most ${maxValue}`;
          valid = false;
        }
      }
    }

    if (type === 'text' && maxLength && val.length > maxLength) {
      errorMsg = `Text must be at most ${maxLength} characters`;
      valid = false;
    }

    if (type === 'text' && val.trim().length === 0) {
      errorMsg = 'This field cannot be empty';
      valid = false;
    }

    // Custom validation
    if (validation && typeof validation === 'function') {
      const customValidation = validation(val);
      if (customValidation !== true) {
        errorMsg = customValidation;
        valid = false;
      }
    }

    setError(errorMsg);
    setIsValid(valid);
  };

  const handleSave = () => {
    if (!isValid) return;
    
    let finalValue = editValue;
    if (type === 'number') {
      finalValue = parseFloat(editValue);
    } else if (type === 'text') {
      finalValue = editValue.trim();
    }
    
    onSave(finalValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    setError('');
    setIsValid(true);
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isValid) {
        handleSave();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = (e) => {
    // Don't save on blur if clicking on action buttons
    if (e.relatedTarget && (
      e.relatedTarget.classList.contains('save-btn') ||
      e.relatedTarget.classList.contains('cancel-btn')
    )) {
      return;
    }
    
    // Auto-save on blur if valid
    if (isValid && editValue !== value) {
      handleSave();
    } else {
      handleCancel();
    }
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative inline-block w-full">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <InputComponent
            ref={inputRef}
            type={multiline ? undefined : type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2 border-2 rounded-lg transition-all duration-200
              ${isValid 
                ? 'border-sysora-mint focus:border-sysora-mint focus:ring-2 focus:ring-sysora-mint/20' 
                : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              }
              ${className}
              ${multiline ? 'resize-none min-h-[80px]' : ''}
            `}
            rows={multiline ? 3 : undefined}
            min={type === 'number' ? minValue : undefined}
            max={type === 'number' ? maxValue : undefined}
            maxLength={maxLength}
          />
          
          {/* Validation Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {!isValid && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className={`
              save-btn p-2 rounded-lg transition-all duration-200
              ${isValid
                ? 'bg-green-100 text-green-600 hover:bg-green-200 hover:scale-110'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Save (Enter)"
          >
            <Check className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn p-2 bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 rounded-lg transition-all duration-200"
            title="Cancel (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 z-10 shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Character Count (for text fields with maxLength) */}
      {type === 'text' && maxLength && (
        <div className="absolute top-full right-0 mt-1 text-xs text-gray-500">
          {editValue.length}/{maxLength}
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="absolute top-full left-0 mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Press Enter to save, Escape to cancel
      </div>
    </div>
  );
};

export default InlineEditField;
