import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Input Component for Sysora Platform
 * Supports multiple variants, states, and validation
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  suffix,
  prefix,
  helperText,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Base input classes
  const baseClasses = `
    w-full border rounded-xl transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-neutral-400
  `;

  // Variant styles
  const variants = {
    default: `
      border-neutral-300 bg-white text-neutral-900
      focus:border-sysora-mint focus:ring-sysora-mint/20
      hover:border-neutral-400
    `,
    filled: `
      border-transparent bg-neutral-100 text-neutral-900
      focus:bg-white focus:border-sysora-mint focus:ring-sysora-mint/20
      hover:bg-neutral-50
    `,
    outlined: `
      border-2 border-neutral-300 bg-transparent text-neutral-900
      focus:border-sysora-mint focus:ring-sysora-mint/20
      hover:border-neutral-400
    `,
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  // State styles
  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
    : success
    ? 'border-success-500 focus:border-success-500 focus:ring-success-500/20'
    : '';

  // Icon padding adjustments
  const iconPadding = icon
    ? iconPosition === 'left'
      ? 'pl-12'
      : 'pr-12'
    : '';

  // Prefix/Suffix padding
  const prefixPadding = prefix ? 'pl-16' : '';
  const suffixPadding = suffix ? 'pr-16' : '';

  // Combine classes
  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${stateClasses}
    ${iconPadding}
    ${prefixPadding}
    ${suffixPadding}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm font-medium">
            {prefix}
          </div>
        )}

        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          {...props}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Suffix */}
        {suffix && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 text-sm font-medium">
            {suffix}
          </div>
        )}

        {/* Focus Ring Animation */}
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-sysora-mint pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {/* Helper Text / Error / Success Message */}
      {(helperText || error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-1"
        >
          {error && (
            <>
              <svg className="w-4 h-4 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-error-600">{error}</span>
            </>
          )}
          {success && !error && (
            <>
              <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-success-600">{success}</span>
            </>
          )}
          {helperText && !error && !success && (
            <span className="text-sm text-neutral-500">{helperText}</span>
          )}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
