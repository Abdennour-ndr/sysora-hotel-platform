import React from 'react'
import { Calendar, Users, BarChart3, Settings, CheckCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { featuredModuleTranslations } from '../translations/featuredModule'

const FeaturedModule = ({ onCreateAccount }) => {
  const { language } = useLanguage()
  const t = featuredModuleTranslations[language] || featuredModuleTranslations.en

  const features = [
    {
      icon: Calendar,
      title: t.features.roomBooking.title,
      description: t.features.roomBooking.description
    },
    {
      icon: Users,
      title: t.features.guestManagement.title,
      description: t.features.guestManagement.description
    },
    {
      icon: BarChart3,
      title: t.features.revenueAnalytics.title,
      description: t.features.revenueAnalytics.description
    },
    {
      icon: Settings,
      title: t.features.staffCoordination.title,
      description: t.features.staffCoordination.description
    }
  ]

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>{t.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-sysora-midnight">
                {t.title}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-sysora-mint" />
                    </div>
                    <h3 className="font-semibold text-sysora-midnight">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed pl-13">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onCreateAccount}
              className="btn-primary flex items-center space-x-2 text-lg"
            >
              <span>{t.cta}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Feature Preview */}
          <div className="relative">
            <div className="card bg-gradient-to-br from-sysora-midnight to-sysora-midnight/90 text-white p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{t.demo.title}</h3>
                  <div className="bg-sysora-mint px-3 py-1 rounded-full text-xs font-medium text-sysora-midnight">
                    {t.demo.badge}
                  </div>
                </div>

                {/* Booking Form Preview */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">{t.demo.checkIn}</div>
                      <div className="bg-white/10 p-3 rounded-xl text-sm">
                        Dec 15, 2024
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">{t.demo.checkOut}</div>
                      <div className="bg-white/10 p-3 rounded-xl text-sm">
                        Dec 18, 2024
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">{t.demo.roomType}</div>
                    <div className="bg-white/10 p-3 rounded-xl text-sm">
                      Deluxe Suite - $120/night
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">{t.demo.guestInfo}</div>
                    <div className="bg-white/10 p-3 rounded-xl text-sm">
                      John Smith - Premium Member
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">{t.demo.available}</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {t.demo.room} 205
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-white card p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-sysora-mint">98%</div>
                <div className="text-xs text-gray-600">{t.demo.uptime}</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white card p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-sysora-mint">24/7</div>
                <div className="text-xs text-gray-600">{t.demo.support}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedModule
