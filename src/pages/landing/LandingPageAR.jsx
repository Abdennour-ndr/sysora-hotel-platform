import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import HeroSectionAR from '../../components/landing/HeroSectionAR';
import FeaturedModule from '../../components/FeaturedModule';
import DemoHook from '../../components/DemoHook';
import FAQ from '../../components/FAQ';
import Testimonials from '../../components/Testimonials';
import ComingSoonModules from '../../components/ComingSoonModules';
import PricingSection from '../../components/PricingSection';
import SignupForm from '../../components/SignupForm';
import WorkspaceLoginModal from '../../components/WorkspaceLoginModal';
import Footer from '../../components/Footer';
import SysoraLogo from '../../components/SysoraLogo';
import DemoLoginButton from '../../components/demo/DemoLoginButton';
import LanguageSelector from '../../components/LanguageSelector';
import BetaTrustSection from '../../components/landing/BetaTrustSection';

const LandingPageAR = () => {
  const { t } = useLanguage();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    <div className="min-h-screen bg-sysora-light" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <SysoraLogo
                size="md"
                showText={true}
                textColor="text-sysora-midnight"
                className="flex-row-reverse"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="#features" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                {t('navigation.features')}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                {t('navigation.pricing')}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-sysora-midnight transition-colors">
                {t('navigation.contact')}
              </a>
              <DemoLoginButton
                variant="link"
                size="small"
                showFeatures={false}
                className="flex items-center space-x-1 space-x-reverse text-sysora-mint hover:text-sysora-midnight transition-colors font-medium"
              />
              <button
                onClick={openLoginModal}
                className="text-sysora-midnight hover:text-sysora-mint transition-colors font-medium"
              >
                {t('auth.signIn')}
              </button>
              <button
                onClick={openSignupModal}
                className="btn-primary text-sm"
              >
                {t('auth.getStarted')}
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <LanguageSelector />
              
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40 hidden">
        <div className="px-4 py-3 space-y-3">
          <a href="#features" className="block text-gray-600 hover:text-sysora-midnight transition-colors">
            الميزات
          </a>
          <a href="#pricing" className="block text-gray-600 hover:text-sysora-midnight transition-colors">
            التسعير
          </a>
          <a href="#contact" className="block text-gray-600 hover:text-sysora-midnight transition-colors">
            اتصل بنا
          </a>
          <DemoLoginButton
            variant="link"
            size="small"
            showFeatures={false}
            className="flex items-center space-x-2 space-x-reverse text-sysora-mint hover:text-sysora-midnight transition-colors font-medium py-2"
          />
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <button
              onClick={openLoginModal}
              className="block w-full text-right text-sysora-midnight hover:text-sysora-mint transition-colors font-medium"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={openSignupModal}
              className="block w-full btn-primary text-sm text-center"
            >
              ابدأ الآن
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Optimized Order */}
      <main className="pt-16">
        <HeroSectionAR onGetStarted={openSignupModal} />
        <FeaturedModule onCreateAccount={openSignupModal} />
        <BetaTrustSection />
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
        <WorkspaceLoginModal 
          isOpen={true} 
          onClose={() => setShowLoginModal(false)} 
          onSwitchToSignup={switchToSignup} 
        />
      )}
    </div>
  );
};

export default LandingPageAR;
