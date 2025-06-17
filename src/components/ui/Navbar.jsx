import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

/**
 * Professional Navigation Bar Component for Sysora Platform
 * Responsive design with mobile menu and professional styling
 */
const Navbar = ({
  logo,
  logoText = 'Sysora',
  navigation = [],
  actions = [],
  user = null,
  onUserMenuClick,
  className = '',
  variant = 'default',
  sticky = true,
  transparent = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Base navbar classes
  const baseClasses = `
    w-full z-50 transition-all duration-300 ease-in-out
    ${sticky ? 'sticky top-0' : 'relative'}
  `;

  // Variant styles
  const variants = {
    default: `
      bg-white/95 backdrop-blur-md border-b border-neutral-200/50
      shadow-sm
    `,
    transparent: `
      bg-transparent
    `,
    glass: `
      bg-white/80 backdrop-blur-lg border-b border-white/20
      shadow-sm
    `,
    solid: `
      bg-white border-b border-neutral-200
      shadow-md
    `,
  };

  // Combine classes
  const navbarClasses = `
    ${baseClasses}
    ${transparent ? variants.transparent : variants[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <motion.nav
      className={navbarClasses}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {logo && (
              <div className="flex-shrink-0">
                {logo}
              </div>
            )}
            <div className="text-2xl font-bold text-sysora-midnight">
              {logoText}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={item.onClick}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${item.active
                      ? 'text-sysora-mint bg-sysora-mint/10'
                      : 'text-neutral-700 hover:text-sysora-mint hover:bg-neutral-100'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'ghost'}
                size="sm"
                onClick={action.onClick}
                icon={action.icon}
              >
                {action.label}
              </Button>
            ))}

            {/* User Menu */}
            {user && (
              <div className="relative">
                <motion.button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-sysora-mint rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <svg
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => onUserMenuClick?.('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onUserMenuClick?.('settings')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        Settings
                      </button>
                      <hr className="my-1 border-neutral-100" />
                      <button
                        onClick={() => onUserMenuClick?.('logout')}
                        className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-neutral-700 hover:text-sysora-mint hover:bg-neutral-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={item.onClick}
                  className={`
                    block px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${item.active
                      ? 'text-sysora-mint bg-sysora-mint/10'
                      : 'text-neutral-700 hover:text-sysora-mint hover:bg-neutral-100'
                    }
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 space-y-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    fullWidth
                    onClick={action.onClick}
                    icon={action.icon}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Mobile User Section */}
              {user && (
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-sysora-mint rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => onUserMenuClick?.('profile')}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onUserMenuClick?.('settings')}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => onUserMenuClick?.('logout')}
                      className="w-full text-left px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(mobileMenuOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setMobileMenuOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
