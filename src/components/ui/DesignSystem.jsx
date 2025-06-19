// Modern Design System Components for Professional SaaS UI
import React from 'react';
import { cn } from '../../utils/cn';

// Card Component - Foundation for all sections
export const Card = ({ children, className, ...props }) => (
  <div
    className={cn(
      "bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Card Header
export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={cn("px-6 py-5 border-b border-gray-100", className)}
    {...props}
  >
    {children}
  </div>
);

// Card Content
export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-5", className)} {...props}>
    {children}
  </div>
);

// Modern Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  loading,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, children, className }) => {
  const statusStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-gray-50 text-gray-700 border-gray-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border",
        statusStyles[status] || statusStyles.neutral,
        className
      )}
    >
      {children}
    </span>
  );
};

// Input Component
export const Input = ({ className, error, ...props }) => (
  <input
    className={cn(
      "block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors",
      error && "border-red-300 focus:ring-red-500",
      className
    )}
    {...props}
  />
);

// Select Component
export const Select = ({ children, className, error, ...props }) => (
  <select
    className={cn(
      "block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-white",
      error && "border-red-300 focus:ring-red-500",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

// Textarea Component
export const Textarea = ({ className, error, ...props }) => (
  <textarea
    className={cn(
      "block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none",
      error && "border-red-300 focus:ring-red-500",
      className
    )}
    {...props}
  />
);

// Modal Component
export const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className={cn(
          "relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto",
          className
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <svg
      className={cn("animate-spin text-gray-400", sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
};

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action, className }) => (
  <div className={cn("text-center py-12", className)}>
    {Icon && (
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
        <Icon className="h-full w-full" />
      </div>
    )}
    <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action}
  </div>
);

// Metric Card Component
export const MetricCard = ({ title, value, change, trend, icon: Icon, onClick }) => (
  <Card className={cn("p-6", onClick && "cursor-pointer hover:shadow-lg")} onClick={onClick}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <div className={cn(
            "flex items-center mt-2 text-sm",
            trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-red-600" : "text-gray-600"
          )}>
            {trend === 'up' && (
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="ml-4 p-2 bg-gray-50 rounded-lg">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      )}
    </div>
  </Card>
);

// Table Components
export const Table = ({ children, className }) => (
  <div className="overflow-hidden">
    <table className={cn("min-w-full divide-y divide-gray-200", className)}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

export const TableRow = ({ children, className, ...props }) => (
  <tr className={cn("hover:bg-gray-50 transition-colors", className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className }) => (
  <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", className)}>
    {children}
  </th>
);

export const TableCell = ({ children, className }) => (
  <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)}>
    {children}
  </td>
);


