import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Modern Components
import ModernNavbar from '../../components/landing/ModernNavbar';
import ModernHeroSection from '../../components/landing/ModernHeroSection';
import ModernFeaturesSection from '../../components/landing/ModernFeaturesSection';
import ModernStatsSection from '../../components/landing/ModernStatsSection';
import ModernCTASection from '../../components/landing/ModernCTASection';

// Existing Components (to be updated gradually)
import WhySysoraSection from '../../components/landing/WhySysoraSection';
import ModernWhySysoraSection from '../../components/landing/ModernWhySysoraSection';
import Testimonials from '../../components/Testimonials';
import ModernTestimonials from '../../components/ModernTestimonials';
import PricingSection from '../../components/PricingSection';
import ModernPricingSection from '../../components/ModernPricingSection';
import FAQ from '../../components/FAQ';
import ModernFAQ from '../../components/ModernFAQ';
import Footer from '../../components/Footer';

// Modals
import SignupForm from '../../components/SignupForm';
import LoginModal from '../../components/LoginModalEN';

/**
 * Modern Landing Page for Sysora
 * Complete redesign with the new design system
 */
const ModernLandingPage = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset state when component mounts
  useEffect(() => {
    setShowSignupModal(false);
    setShowLoginModal(false);
  }, []);

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleWatchDemo = () => {
    window.open('/hotel-demo', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <ModernNavbar
        onGetStarted={openSignupModal}
        onLogin={openLoginModal}
        onWatchDemo={handleWatchDemo}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section - Completely Redesigned */}
        <ModernHeroSection
          onGetStarted={openSignupModal}
          onWatchDemo={handleWatchDemo}
        />

        {/* Features Section - Completely Redesigned */}
        <ModernFeaturesSection
          onGetStarted={openSignupModal}
        />

        {/* Stats Section - New Professional Stats */}
        <ModernStatsSection />

        {/* Why Sysora Section - Completely Redesigned */}
        <ModernWhySysoraSection onGetStarted={openSignupModal} />

        {/* Testimonials Section - Completely Redesigned */}
        <ModernTestimonials />

        {/* Pricing Section - Completely Redesigned */}
        <ModernPricingSection />

        {/* FAQ Section - Completely Redesigned */}
        <ModernFAQ />

        {/* Final CTA Section - New Modern Design */}
        <ModernCTASection onGetStarted={openSignupModal} />
      </main>

      {/* Footer - Using Existing (can be updated later) */}
      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {/* Signup Modal */}
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SignupForm 
              isModal={true} 
              onClose={() => setShowSignupModal(false)} 
              onSwitchToLogin={switchToLogin} 
            />
          </motion.div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginModal
              isOpen={true}
              onClose={() => setShowLoginModal(false)}
              onSwitchToSignup={switchToSignup}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Mobile */}
      <motion.div
        className="fixed bottom-6 right-6 z-40 lg:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={openSignupModal}
          className="w-14 h-14 bg-gradient-to-r from-sysora-mint to-sysora-mint-dark text-white rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            boxShadow: [
              "0 4px 20px rgba(20, 184, 166, 0.3)",
              "0 8px 30px rgba(20, 184, 166, 0.5)",
              "0 4px 20px rgba(20, 184, 166, 0.3)"
            ]
          }}
          transition={{ 
            boxShadow: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-sysora-midnight text-white rounded-full shadow-lg flex items-center justify-center hover:bg-sysora-midnight-light transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>


    </div>
  );
};

export default ModernLandingPage;
