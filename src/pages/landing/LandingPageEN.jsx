import React, { useState, useEffect } from 'react';
import HeroSectionEN from '../../components/landing/HeroSectionEN';
import WhySysoraSection from '../../components/landing/WhySysoraSection';
import FeaturedModule from '../../components/FeaturedModule';
import DemoHook from '../../components/DemoHook';
import FAQ from '../../components/FAQ';
import Testimonials from '../../components/Testimonials';
import ComingSoonModules from '../../components/ComingSoonModules';
import PricingSection from '../../components/PricingSection';
import SignupForm from '../../components/SignupForm';
import LoginModal from '../../components/LoginModalEN';
import Footer from '../../components/Footer';
import SysoraLogo from '../../components/SysoraLogo';

const LandingPageEN = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset state when component mounts (language change)
  useEffect(() => {
    setShowSignupModal(false);
    setShowLoginModal(false);
  }, []);

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
    // Scroll to top when modal opens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
    // Scroll to top when modal opens
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

  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4">
            <SysoraLogo
              size="md"
              showText={true}
              textColor="text-sysora-midnight"
            />
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                Contact
              </a>
              <a
                href="/hotel-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sysora-mint hover:text-sysora-midnight transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Demo</span>
              </a>
              <button
                onClick={openLoginModal}
                className="text-sysora-midnight hover:text-sysora-mint transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={openSignupModal}
                className="btn-primary text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="px-4 py-3 space-y-3">
          <a
            href="#features"
            className="block text-gray-600 hover:text-sysora-midnight transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block text-gray-600 hover:text-sysora-midnight transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block text-gray-600 hover:text-sysora-midnight transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
          <a
            href="/hotel-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sysora-mint hover:text-sysora-midnight transition-colors font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Watch Demo</span>
          </a>
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <button
              onClick={() => {
                openLoginModal();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sysora-midnight hover:text-sysora-mint transition-colors font-medium py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                openSignupModal();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full btn-primary text-sm text-center py-3"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized Order */}
      <main className="pt-16">
        <HeroSectionEN onGetStarted={openSignupModal} />
        <WhySysoraSection onGetStarted={openSignupModal} />
        <FeaturedModule onCreateAccount={openSignupModal} />
        <DemoHook />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <SignupForm />
        <ComingSoonModules />
      </main>

      <Footer />



      {/* Signup Modal */}
      {showSignupModal && (
        <SignupForm 
          isModal={true} 
          onClose={() => setShowSignupModal(false)} 
          onSwitchToLogin={switchToLogin} 
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={true}
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={switchToSignup}
        />
      )}
    </div>
  );
};

export default LandingPageEN;
