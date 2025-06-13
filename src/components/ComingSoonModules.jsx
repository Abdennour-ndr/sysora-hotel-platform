import React from 'react'
import {
  Utensils,
  ShoppingCart,
  CreditCard,
  Cloud,
  Clock,
  Bell
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { comingSoonModulesTranslations } from '../translations/comingSoonModules'

const ComingSoonModules = () => {
  const { language } = useLanguage()
  const t = comingSoonModulesTranslations[language] || comingSoonModulesTranslations.en
  const modules = [
    {
      icon: Utensils,
      title: t.modules.restaurant.title,
      description: t.modules.restaurant.description,
      comingSoon: t.modules.restaurant.comingSoon
    },
    {
      icon: ShoppingCart,
      title: t.modules.erp.title,
      description: t.modules.erp.description,
      comingSoon: t.modules.erp.comingSoon
    },
    {
      icon: CreditCard,
      title: t.modules.pos.title,
      description: t.modules.pos.description,
      comingSoon: t.modules.pos.comingSoon
    },
    {
      icon: Cloud,
      title: t.modules.cloud.title,
      description: t.modules.cloud.description,
      comingSoon: t.modules.cloud.comingSoon
    }
  ]

  return (
    <section id="modules" className="section-padding bg-sysora-light">
      <div className="container-max">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sysora-midnight">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((module, index) => (
            <div key={index} className="relative group">
              <div className="card h-full opacity-60 group-hover:opacity-80 transition-opacity duration-300">
                {/* Coming Soon Badge */}
                <div className="absolute -top-3 -right-3 bg-sysora-mint text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{t.soon}</span>
                </div>

                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center group-hover:bg-sysora-mint/10 transition-colors duration-300">
                    <module.icon className="w-8 h-8 text-gray-400 group-hover:text-sysora-mint transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-500 group-hover:text-sysora-midnight transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{t.expected}</span>
                      <span className="text-sm font-medium text-sysora-mint">
                        {module.comingSoon}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notification Signup - Responsive Design */}
        <div className="mt-16 px-4">
          <div className="card max-w-lg mx-auto">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 text-sysora-mint" />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-sysora-midnight">
                  {t.notification.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {t.notification.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  type="email"
                  placeholder={t.notification.placeholder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-transparent text-sm md:text-base"
                />
                <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-white px-4 py-3 rounded-xl transition-colors duration-200 text-sm md:text-base whitespace-nowrap">
                  {t.notification.button}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComingSoonModules
