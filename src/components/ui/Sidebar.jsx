import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Professional Sidebar Component for Sysora Platform
 * Responsive design with collapsible functionality
 */
const Sidebar = ({
  navigation = [],
  user = null,
  logo,
  logoText = 'Sysora',
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  className = '',
  variant = 'default',
  position = 'left',
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Base sidebar classes
  const baseClasses = `
    h-full bg-white border-r border-neutral-200 flex flex-col
    transition-all duration-300 ease-in-out
    ${position === 'left' ? 'border-r' : 'border-l'}
  `;

  // Variant styles
  const variants = {
    default: 'bg-white border-neutral-200',
    dark: 'bg-sysora-midnight border-sysora-midnight-light text-white',
    glass: 'bg-white/80 backdrop-blur-lg border-white/20',
    gradient: 'bg-gradient-to-b from-sysora-midnight to-sysora-midnight-light text-white',
  };

  // Width classes
  const widthClasses = collapsed ? 'w-20' : 'w-72';

  // Combine classes
  const sidebarClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const isDark = variant === 'dark' || variant === 'gradient';

  return (
    <motion.aside
      className={sidebarClasses}
      initial={{ x: position === 'left' ? -288 : 288, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        <motion.div
          className="flex items-center space-x-3"
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}
          {!collapsed && (
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-sysora-midnight'}`}>
              {logoText}
            </div>
          )}
        </motion.div>

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <motion.button
            onClick={onToggleCollapse}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark 
                ? 'hover:bg-white/10 text-white' 
                : 'hover:bg-neutral-100 text-neutral-600'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={position === 'left' ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sysora-mint rounded-full flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-white/70' : 'text-neutral-500'}`}>
                    {user.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {/* Section Title */}
            {section.title && !collapsed && (
              <motion.h3
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-white/60' : 'text-neutral-500'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {section.title}
              </motion.h3>
            )}

            {/* Navigation Items */}
            {section.items?.map((item, itemIndex) => (
              <motion.div
                key={itemIndex}
                className="relative"
                onMouseEnter={() => setHoveredItem(`${sectionIndex}-${itemIndex}`)}
                onMouseLeave={() => setHoveredItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sectionIndex * section.items.length + itemIndex) * 0.05 }}
              >
                <button
                  onClick={() => onNavigate?.(item)}
                  className={`
                    w-full flex items-center px-3 py-3 rounded-xl text-left transition-all duration-200
                    ${item.active
                      ? isDark
                        ? 'bg-white/20 text-white'
                        : 'bg-sysora-mint/10 text-sysora-mint'
                      : isDark
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }
                    ${collapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${collapsed ? '' : 'mr-3'}`}>
                    {item.icon}
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {item.badge && !collapsed && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${item.badge.variant === 'success'
                          ? 'bg-success-100 text-success-800'
                          : item.badge.variant === 'warning'
                          ? 'bg-warning-100 text-warning-800'
                          : item.badge.variant === 'error'
                          ? 'bg-error-100 text-error-800'
                          : 'bg-neutral-100 text-neutral-800'
                        }
                      `}
                    >
                      {item.badge.text}
                    </motion.span>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === `${sectionIndex}-${itemIndex}` && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`
                      absolute ${position === 'left' ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 transform -translate-y-1/2
                      bg-neutral-900 text-white px-3 py-2 rounded-lg text-sm font-medium
                      whitespace-nowrap z-50 shadow-lg
                    `}
                  >
                    {item.label}
                    <div
                      className={`
                        absolute top-1/2 transform -translate-y-1/2
                        ${position === 'left' ? 'right-full' : 'left-full'}
                        border-4 border-transparent
                        ${position === 'left' ? 'border-r-neutral-900' : 'border-l-neutral-900'}
                      `}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <motion.div
          className="flex items-center justify-center"
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!collapsed && (
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-neutral-500'}`}>
              © 2024 Sysora Platform
            </p>
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
