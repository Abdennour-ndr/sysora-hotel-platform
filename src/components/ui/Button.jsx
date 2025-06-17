import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Button Component for Sysora Platform
 * Supports multiple variants, sizes, and states
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base button classes
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `;

  // Variant styles
  const variants = {
    primary: `
      bg-sysora-mint text-sysora-midnight
      hover:bg-sysora-mint-dark hover:shadow-mint
      focus:ring-sysora-mint
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white text-sysora-midnight border-2 border-sysora-midnight
      hover:bg-sysora-midnight hover:text-white
      focus:ring-sysora-midnight
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent text-sysora-midnight border-2 border-neutral-300
      hover:border-sysora-mint hover:text-sysora-mint
      focus:ring-sysora-mint
    `,
    ghost: `
      bg-transparent text-neutral-600
      hover:bg-neutral-100 hover:text-neutral-900
      focus:ring-neutral-500
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-600 hover:shadow-lg
      focus:ring-success-500
      shadow-sm
    `,
    warning: `
      bg-warning-500 text-white
      hover:bg-warning-600 hover:shadow-lg
      focus:ring-warning-500
      shadow-sm
    `,
    error: `
      bg-error-500 text-white
      hover:bg-error-600 hover:shadow-lg
      focus:ring-error-500
      shadow-sm
    `,
    gradient: `
      bg-gradient-to-r from-sysora-mint to-sysora-mint-dark text-white
      hover:from-sysora-mint-dark hover:to-sysora-mint
      focus:ring-sysora-mint
      shadow-mint hover:shadow-mint-lg
    `
  };

  // Size styles
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Icon sizes
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizes[size]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {/* Loading state */}
      {loading && (
        <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
          <LoadingSpinner />
        </span>
      )}

      {/* Icon - Left */}
      {!loading && icon && iconPosition === 'left' && (
        <span className={`${iconSizes[size]} mr-2`}>
          {icon}
        </span>
      )}

      {/* Button text */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>

      {/* Icon - Right */}
      {!loading && icon && iconPosition === 'right' && (
        <span className={`${iconSizes[size]} ml-2`}>
          {icon}
        </span>
      )}

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 pointer-events-none"
        whileHover={{ opacity: variant === 'primary' ? 0.1 : 0.05 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default Button;
