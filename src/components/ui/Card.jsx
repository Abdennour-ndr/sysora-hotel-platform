import React from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Card Component for Sysora Platform
 * Supports multiple variants, hover effects, and interactive states
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  rounded = 'xl',
  interactive = false,
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  // Base card classes
  const baseClasses = `
    bg-white border border-neutral-200
    transition-all duration-200 ease-in-out
    relative overflow-hidden
  `;

  // Variant styles
  const variants = {
    default: 'bg-white border-neutral-200',
    elevated: 'bg-white border-neutral-100 shadow-lg',
    gradient: 'bg-gradient-to-br from-white to-neutral-50 border-neutral-200',
    glass: 'bg-white/80 backdrop-blur-sm border-white/20',
    primary: 'bg-sysora-mint/5 border-sysora-mint/20',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    error: 'bg-error-50 border-error-200',
    info: 'bg-info-50 border-info-200',
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Shadow styles
  const shadows = {
    none: 'shadow-none',
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    sysora: 'shadow-sysora',
  };

  // Rounded styles
  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  // Interactive styles
  const interactiveClasses = interactive || onClick ? `
    cursor-pointer
    hover:shadow-lg hover:-translate-y-1
    active:translate-y-0 active:shadow-md
  ` : '';

  // Hover effect styles
  const hoverClasses = hover ? `
    hover:shadow-xl hover:-translate-y-2
    hover:border-sysora-mint/30
  ` : '';

  // Combine classes
  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${shadows[shadow]}
    ${roundeds[rounded]}
    ${interactiveClasses}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={
        interactive || hover
          ? { y: -4, transition: { duration: 0.2 } }
          : {}
      }
      {...props}
    >
      {children}
    </MotionCard>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`border-b border-neutral-200 pb-4 mb-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-xl font-semibold text-neutral-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => (
  <p
    className={`text-neutral-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Card Content Component
const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`border-t border-neutral-200 pt-4 mt-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Stats Card Component
const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'primary',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: 'border-l-sysora-mint bg-sysora-mint/5',
    success: 'border-l-success-500 bg-success-50',
    warning: 'border-l-warning-500 bg-warning-50',
    error: 'border-l-error-500 bg-error-50',
    info: 'border-l-info-500 bg-info-50',
  };

  const changeColors = {
    positive: 'text-success-600 bg-success-100',
    negative: 'text-error-600 bg-error-100',
    neutral: 'text-neutral-600 bg-neutral-100',
  };

  return (
    <Card
      variant="elevated"
      className={`border-l-4 ${colorClasses[color]} ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Stats = StatsCard;

export default Card;
