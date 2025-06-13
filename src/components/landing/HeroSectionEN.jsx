import React from 'react';
import { CheckCircle, Clock, Shield, Star, Zap } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import DemoTeaser from '../DemoTeaser';
import { PLATFORM_STATS } from '../../constants/promotions';

const HeroSectionEN = ({ onGetStarted }) => {
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
            {/* Trust Badge */}
            <div className="flex items-center space-x-2 text-sysora-mint">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">#1 Hotel Management Platform in Algeria</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Manage Your Hotel in
                <span className="block text-sysora-mint">Minutes, Not Hours</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                Save 40% of daily management time with Algeria's first intelligent hotel management system.
                From reservations to billing, everything you need in one place.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-gray-300">Save 15 hours per week</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-gray-300">Increase revenue by 25%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-gray-300">24/7 Arabic support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-gray-300">14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group relative btn-primary text-lg px-8 py-4 bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Start 14-Day Free Trial</span>
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  </span>
                </button>
                <button
                  onClick={() => window.open('/hotel-demo', '_blank')}
                  className="btn-secondary text-lg px-8 py-4 bg-white hover:bg-gray-100 text-sysora-midnight border border-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Watch Demo</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Setup in 5 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats with Social Proof */}
            <div className="pt-8 border-t border-white/20">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400 mb-4">Trusted by hotels across Algeria</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                    <AnimatedCounter end={PLATFORM_STATS.hotels.value} duration={2500} />{PLATFORM_STATS.hotels.suffix}
                  </div>
                  <div className="text-sm text-gray-300">{PLATFORM_STATS.hotels.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                    <AnimatedCounter end={PLATFORM_STATS.bookings.value} duration={3000} />{PLATFORM_STATS.bookings.suffix}
                  </div>
                  <div className="text-sm text-gray-300">{PLATFORM_STATS.bookings.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                    <AnimatedCounter end={PLATFORM_STATS.uptime.value} duration={3500} decimals={1} />{PLATFORM_STATS.uptime.suffix}
                  </div>
                  <div className="text-sm text-gray-300">{PLATFORM_STATS.uptime.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-sysora-mint">
                    <AnimatedCounter end={PLATFORM_STATS.satisfaction.value} duration={4000} decimals={1} />{PLATFORM_STATS.satisfaction.suffix}
                  </div>
                  <div className="text-sm text-gray-300">{PLATFORM_STATS.satisfaction.label}</div>
                </div>
              </div>

              {/* Customer Logos Placeholder */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center space-x-8 opacity-60">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Featured on</span>
                  </div>
                  <div className="text-sm text-gray-300">Algeria Business</div>
                  <div className="text-sm text-gray-300">Hotel Tech</div>
                  <div className="text-sm text-gray-300">StartupDZ</div>
                </div>
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

export default HeroSectionEN;
