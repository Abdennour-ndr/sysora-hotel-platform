import React from 'react'
import { Clock, Star, ArrowRight, CheckCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { limitedTimeOfferTranslations } from '../translations/limitedTimeOffer'
import { CURRENT_PROMOTION, MARKETING_MESSAGES } from '../constants/promotions'

const LimitedTimeOffer = ({ onCreateWorkspace }) => {
  const { language } = useLanguage()
  const t = limitedTimeOfferTranslations[language] || limitedTimeOfferTranslations.en

  return (
    <section className="section-padding bg-gradient-to-r from-sysora-midnight to-sysora-midnight/90 text-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-sysora-mint/20 text-sysora-mint px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>{t.badge}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Get Started for Just
                <span className="block text-sysora-mint text-5xl md:text-6xl">${CURRENT_PROMOTION.price}</span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed">
                Enjoy full access to Hotel Management System for 3 days free trial, then pay only ${CURRENT_PROMOTION.price} for the next {CURRENT_PROMOTION.durationText}. Afterwards, standard plans apply.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onCreateWorkspace}
              className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg"
            >
              <span>{t.cta}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Pricing Breakdown */}
          <div className="space-y-6">
            {/* Trial Period */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.pricing.freeTrialPeriod}</h3>
                <Star className="w-5 h-5 text-sysora-mint" />
              </div>
              <div className="space-y-2">
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.duration}</span>
                  <span className="pricing-value font-semibold">{t.pricing.days3}</span>
                </div>
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.cost}</span>
                  <span className="pricing-value font-semibold text-sysora-mint">{t.pricing.free}</span>
                </div>
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.features}</span>
                  <span className="pricing-value font-semibold">{t.pricing.fullAccess}</span>
                </div>
              </div>
            </div>

            {/* Promotional Period */}
            <div className="bg-sysora-mint/20 backdrop-blur-sm rounded-3xl p-6 border border-sysora-mint/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.pricing.promotionalPeriod}</h3>
                <div className="pricing-badge bg-sysora-mint text-sysora-midnight px-3 py-1 rounded-full text-xs font-medium">
                  {t.pricing.save95}
                </div>
              </div>
              <div className="space-y-2">
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.duration}</span>
                  <span className="pricing-value font-semibold">{t.pricing.months3}</span>
                </div>
                <div className="pricing-row flex justify-between items-center">
                  <span className="pricing-label text-gray-300">{t.pricing.cost}</span>
                  <div className="price-display text-right">
                    <span className="font-semibold text-sysora-mint text-xl">${CURRENT_PROMOTION.price}</span>
                    <div className="text-xs text-gray-400 line-through">${CURRENT_PROMOTION.originalPricing.medium.monthly * 3}</div>
                  </div>
                </div>
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.billing}</span>
                  <span className="pricing-value font-semibold">{t.pricing.oneTime}</span>
                </div>
              </div>
            </div>

            {/* Regular Pricing */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.pricing.afterPromotion}</h3>
                <span className="text-xs text-gray-400">{t.pricing.month4Plus}</span>
              </div>
              <div className="space-y-2">
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.standardPlans}</span>
                  <span className="pricing-value font-semibold">{t.pricing.fromPerMonth}</span>
                </div>
                <div className="pricing-row flex justify-between">
                  <span className="pricing-label text-gray-300">{t.pricing.cancelAnytime}</span>
                  <span className="pricing-value font-semibold text-sysora-mint">{t.pricing.yes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LimitedTimeOffer
