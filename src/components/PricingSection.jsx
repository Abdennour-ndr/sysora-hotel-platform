import React from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { pricingSectionTranslations } from '../translations/pricingSection'
import { PRICING_PLANS, CURRENT_PROMOTION } from '../constants/promotions'

const PricingSection = () => {
  const { language } = useLanguage()
  const t = pricingSectionTranslations[language] || pricingSectionTranslations.en

  // Use unified pricing plans from constants
  const iconMap = {
    'Star': Star,
    'Zap': Zap,
    'Crown': Crown
  }

  const plans = PRICING_PLANS.map(plan => ({
    ...plan,
    icon: iconMap[plan.icon] || Star,
    price: plan.pricing.monthly,
    promoPrice: plan.promo.price,
    promoDuration: plan.promo.duration
  }))


  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-max px-4">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-sysora-midnight">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base">
            <Star className="w-4 h-4 md:w-5 md:h-5" />
            <span>{t.trialBadge}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative card h-full ${
                plan.popular 
                  ? 'ring-2 ring-sysora-mint transform scale-105' 
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-sysora-mint text-white px-4 py-2 rounded-full text-sm font-medium">
                    {t.mostPopular}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-sysora-mint text-white' 
                      : 'bg-sysora-mint/10 text-sysora-mint'
                  }`}>
                    <plan.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-sysora-midnight">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center">
                  <div className="space-y-2">
                    {/* Launch Offer */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                      <div className="text-yellow-800 font-bold text-lg">
                        🎉 Launch Offer: ${plan.promoPrice}
                      </div>
                      <div className="text-yellow-600 text-sm">
                        for {plan.promoDuration} (Early adopters only)
                      </div>
                    </div>

                    {/* Regular Pricing */}
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-sysora-midnight">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      After promotional period
                    </div>
                    <div className="text-xs text-gray-400">
                      ${plan.price * 10}/year (Save 17%)
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sysora-midnight">{t.whatsIncluded}</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-sysora-mint flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-sysora-mint hover:bg-sysora-mint/90 text-white shadow-card hover:shadow-lg'
                    : 'bg-sysora-light hover:bg-gray-100 text-sysora-midnight border border-gray-200'
                }`}>
                  {t.startTrial}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info - Responsive */}
        <div className="mt-12 md:mt-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-sysora-midnight text-sm md:text-base">{t.features.noSetupFees.title}</h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{t.features.noSetupFees.description}</p>
            </div>
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-sysora-midnight text-sm md:text-base">{t.features.cancelAnytime.title}</h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{t.features.cancelAnytime.description}</p>
            </div>
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-sysora-midnight text-sm md:text-base">{t.features.support247.title}</h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{t.features.support247.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
