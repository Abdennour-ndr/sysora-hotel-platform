import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../ui';
import SysoraLogo from '../SysoraLogo';

/**
 * Modern Navigation Bar for Sysora Landing Page
 * Professional design with the new design system
 */
const ModernNavbar = ({ onGetStarted, onLogin, onWatchDemo }) => {

  const handleSignIn = () => {
    window.location.href = '/signin';
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg border-b border-neutral-200/50 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <SysoraLogo
                size="lg"
                showText={true}
                textColor={isScrolled ? "text-sysora-midnight" : "text-white"}
                className="cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className={`font-medium transition-colors duration-200 ${
                    isScrolled
                      ? 'text-neutral-700 hover:text-sysora-mint'
                      : 'text-white/90 hover:text-sysora-mint'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Demo Button */}
              <motion.button
                onClick={onWatchDemo}
                className={`flex items-center space-x-2 font-medium transition-colors duration-200 ${
                  isScrolled
                    ? 'text-sysora-mint hover:text-sysora-mint-dark'
                    : 'text-sysora-mint hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>Demo</span>
              </motion.button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className={
                  isScrolled
                    ? 'text-neutral-700 hover:text-sysora-mint hover:bg-neutral-100'
                    : 'text-white hover:text-sysora-mint hover:bg-white/10'
                }
              >
                Sign In
              </Button>
              
              <Button
                variant={isScrolled ? "primary" : "secondary"}
                size="sm"
                onClick={handleGetStarted}
                icon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-neutral-700 hover:bg-neutral-100'
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`lg:hidden fixed inset-0 z-40 ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={false}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <motion.div
          className="absolute top-20 left-0 right-0 bg-white border-b border-neutral-200 shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: isMobileMenuOpen ? 0 : -20,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="container-responsive py-6">
            <div className="space-y-4">
              {/* Navigation Links */}
              {navigation.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-3 px-4 text-neutral-700 hover:text-sysora-mint hover:bg-neutral-50 rounded-lg transition-colors font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Demo Link */}
              <motion.button
                onClick={() => {
                  onWatchDemo();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full py-3 px-4 text-sysora-mint hover:text-sysora-mint-dark hover:bg-sysora-mint/5 rounded-lg transition-colors font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.1 }}
              >
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </motion.button>

              {/* Divider */}
              <div className="border-t border-neutral-200 my-4" />

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navigation.length + 1) * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => {
                    handleSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-center"
                >
                  Sign In
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="justify-center shadow-lg"
                >
                  Get Started Free
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="pt-4 border-t border-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (navigation.length + 2) * 0.1 }}
              >
                <div className="text-center space-y-2">
                  <p className="text-sm text-neutral-600">
                    ✨ 14-day free trial • No credit card required
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
                    <span>🔒 Secure</span>
                    <span>⚡ Fast Setup</span>
                    <span>🇩🇿 Made in Algeria</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ModernNavbar;
