import React from 'react';
import PublicPricingView from '../components/PublicPricingView';
import Footer from '../components/Footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sysora-midnight rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-sysora-midnight">Sysora</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-sysora-midnight transition-colors">الرئيسية</a>
              <a href="#features" className="text-gray-600 hover:text-sysora-midnight transition-colors">الميزات</a>
              <a href="#pricing" className="text-sysora-midnight font-medium">التسعير</a>
              <a href="#contact" className="text-gray-600 hover:text-sysora-midnight transition-colors">اتصل بنا</a>
              <button
                onClick={() => window.location.href = '/#signup-form'}
                className="btn-primary text-sm"
              >
                ابدأ الآن
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <PublicPricingView />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PricingPage;
