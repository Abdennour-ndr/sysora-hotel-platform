import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  ArrowRight, 
  Sparkles,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button, Card } from './ui';
import { useLanguage } from '../contexts/LanguageContext';
import { pricingSectionTranslations } from '../translations/pricingSection';
import { PRICING_PLANS, CURRENT_PROMOTION } from '../constants/promotions';

/**
 * Modern Pricing Section for Sysora Landing Page
 * Updated to match the new design system and landing page style
 */
const ModernPricingSection = () => {
  const { language } = useLanguage();
  const t = pricingSectionTranslations[language] || pricingSectionTranslations.en;

  // Use unified pricing plans from constants
  const iconMap = {
    'Star': Star,
    'Zap': Zap,
    'Crown': Crown
  };

  const plans = PRICING_PLANS.map(plan => ({
    ...plan,
    icon: iconMap[plan.icon] || Star,
    price: plan.pricing.monthly,
    promoPrice: plan.promo.price,
    promoDuration: plan.promo.duration
  }));

  const trustFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: t.features.noSetupFees.title,
      description: t.features.noSetupFees.description,
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: t.features.cancelAnytime.title,
      description: t.features.cancelAnytime.description,
      iconBg: 'bg-info-100',
      iconColor: 'text-info-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t.features.support247.title,
      description: t.features.support247.description,
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-sysora-light via-white to-neutral-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-sysora-mint/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-6 py-3 rounded-full font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Star className="w-5 h-5" />
            <span>{t.trialBadge}</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-sysora-midnight mb-6">
            {t.title}
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant="elevated"
                  hover
                  className={`h-full relative overflow-hidden ${
                    plan.popular 
                      ? 'border-2 border-sysora-mint shadow-mint-lg' 
                      : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <div className="bg-gradient-to-r from-sysora-mint to-sysora-mint-dark text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Most Popular</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Background Gradient */}
                  <div className={`absolute inset-0 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-sysora-mint/5 via-transparent to-blue-500/5' 
                      : 'bg-gradient-to-br from-neutral-50/50 to-transparent'
                  }`} />

                  <Card.Content className="relative p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-br from-sysora-mint to-sysora-mint-dark text-white shadow-mint' 
                          : 'bg-sysora-mint/10 text-sysora-mint'
                      }`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-sysora-midnight mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-neutral-600">
                        {plan.description}
                      </p>
                    </div>

                    {/* Launch Offer */}
                    <motion.div
                      className="relative mb-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 rounded-xl p-4 relative overflow-hidden">
                        {/* Sparkle Effect */}
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 text-warning-500" />
                        </motion.div>
                        
                        <div className="text-center">
                          <div className="text-warning-800 font-bold text-lg mb-1">
                            🎉 Launch Offer: ${plan.promoPrice}
                          </div>
                          <div className="text-warning-600 text-sm font-medium">
                            for {plan.promoDuration} (Early adopters only)
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Regular Pricing */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center space-x-1 mb-2">
                        <span className="text-4xl font-bold text-sysora-midnight">
                          ${plan.price}
                        </span>
                        <span className="text-neutral-600">/month</span>
                      </div>
                      <div className="text-sm text-neutral-500 mb-1">
                        After promotional period
                      </div>
                      <div className="text-xs text-neutral-400">
                        ${plan.price * 10}/year (Save 17%)
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-sysora-midnight mb-4">
                        {t.whatsIncluded}
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: featureIndex * 0.1, duration: 0.4 }}
                          >
                            <Check className="w-5 h-5 text-sysora-mint flex-shrink-0 mt-0.5" />
                            <span className="text-neutral-600 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="w-5 h-5" />}
                      className={`${
                        plan.popular 
                          ? 'shadow-mint-lg hover:shadow-mint-xl' 
                          : 'hover:border-sysora-mint hover:text-sysora-mint'
                      }`}
                    >
                      {t.startTrial}
                    </Button>
                  </Card.Content>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Features */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-200">
                <Card.Content className="p-6">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center ${feature.iconColor} mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-sysora-midnight mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernPricingSection;
