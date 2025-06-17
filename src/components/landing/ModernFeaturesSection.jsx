import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  CreditCard, 
  Shield, 
  Smartphone,
  Clock,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card, Button } from '../ui';

/**
 * Modern Features Section for Sysora Landing Page
 * Showcases key features with interactive cards
 */
const ModernFeaturesSection = ({ onGetStarted }) => {
  const mainFeatures = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Smart Reservations',
      description: 'Intelligent booking system with real-time availability, automated confirmations, and guest preferences tracking.',
      benefits: ['Real-time sync', 'Auto-confirmation', 'Guest history'],
      color: 'sysora-mint',
      gradient: 'from-sysora-mint/10 to-sysora-mint/5'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Guest Management',
      description: 'Complete guest profiles with preferences, history, and personalized service recommendations.',
      benefits: ['Guest profiles', 'Preferences', 'Service history'],
      color: 'blue-500',
      gradient: 'from-blue-500/10 to-blue-500/5'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics & Reports',
      description: 'Real-time insights into occupancy, revenue, and performance with AI-powered recommendations.',
      benefits: ['Real-time data', 'AI insights', 'Custom reports'],
      color: 'purple-500',
      gradient: 'from-purple-500/10 to-purple-500/5'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Payment Processing',
      description: 'Secure payment gateway with multiple payment methods and automated billing.',
      benefits: ['Secure payments', 'Multiple methods', 'Auto-billing'],
      color: 'success-500',
      gradient: 'from-success-500/10 to-success-500/5'
    }
  ];

  const additionalFeatures = [
    { icon: <Shield className="w-5 h-5" />, title: 'Bank-level Security', description: 'SSL encryption & data protection' },
    { icon: <Smartphone className="w-5 h-5" />, title: 'Mobile Optimized', description: 'Works perfectly on all devices' },
    { icon: <Clock className="w-5 h-5" />, title: '24/7 Support', description: 'Round-the-clock assistance in Arabic' },
    { icon: <Globe className="w-5 h-5" />, title: 'Multi-language', description: 'Arabic, English, French support' },
    { icon: <Zap className="w-5 h-5" />, title: 'Lightning Fast', description: '99.9% uptime guarantee' },
    { icon: <CheckCircle className="w-5 h-5" />, title: 'Easy Setup', description: 'Get started in under 5 minutes' }
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
    <section id="features" className="section-padding bg-sysora-light">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-sysora-midnight mb-6">
            Everything You Need to
            <span className="block text-sysora-mint">Manage Your Hotel</span>
          </h2>
          
          <p className="text-xl text-neutral-600 leading-relaxed">
            From reservations to analytics, our comprehensive platform handles every aspect 
            of hotel management with intelligence and ease.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                variant="elevated"
                hover
                className={`h-full bg-gradient-to-br ${feature.gradient} border-l-4 border-l-${feature.color}`}
              >
                <Card.Content className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-16 h-16 bg-${feature.color}/10 rounded-xl flex items-center justify-center text-${feature.color}`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-sysora-midnight mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <CheckCircle className={`w-4 h-4 text-${feature.color}`} />
                            <span className="text-sm text-neutral-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-sysora-midnight text-center mb-8">
            Plus Many More Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-200">
                  <Card.Content className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-sysora-mint/10 rounded-lg flex items-center justify-center text-sysora-mint">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sysora-midnight mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card variant="gradient" className="p-8 lg:p-12">
            <Card.Content>
              <h3 className="text-2xl lg:text-3xl font-bold text-sysora-midnight mb-4">
                Ready to Transform Your Hotel Management?
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Join hundreds of hotels already using Sysora to streamline operations 
                and increase revenue. Start your free trial today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Pricing
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-neutral-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;
