import React from 'react';
import AnimatedCounter from '../AnimatedCounter';
import DemoTeaser from '../DemoTeaser';
import DemoLoginButton from '../demo/DemoLoginButton';
import { PLATFORM_STATS } from '../../constants/promotions';

const HeroSectionFR = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-sysora-midnight via-sysora-midnight to-blue-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="relative container-max py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Plateforme de
                <span className="block text-sysora-mint">Gestion Hôtelière</span>
                Intelligente
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                Rationalisez vos opérations hôtelières avec notre système de gestion complet. 
                Des réservations à la facturation, tout ce dont vous avez besoin en un seul endroit.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="btn-primary text-lg px-8 py-4 bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Commencer Gratuitement
              </button>
              <DemoLoginButton
                variant="secondary"
                size="large"
                showFeatures={false}
                className="text-lg px-8 py-4 bg-white hover:bg-gray-100 text-sysora-midnight border border-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              />
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                  <AnimatedCounter end={PLATFORM_STATS.hotels.value} duration={2500} />{PLATFORM_STATS.hotels.suffix}
                </div>
                <div className="text-sm text-gray-300">Hôtels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                  <AnimatedCounter end={PLATFORM_STATS.bookings.value} duration={3000} />{PLATFORM_STATS.bookings.suffix}
                </div>
                <div className="text-sm text-gray-300">Réservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                  <AnimatedCounter end={PLATFORM_STATS.uptime.value} duration={3500} decimals={1} />{PLATFORM_STATS.uptime.suffix}
                </div>
                <div className="text-sm text-gray-300">Disponibilité</div>
              </div>
            </div>
          </div>

          {/* Demo Teaser */}
          <div className="relative">
            <DemoTeaser />

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-sysora-mint/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionFR;
