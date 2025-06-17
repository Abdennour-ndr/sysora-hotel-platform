import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles, Zap, Clock, Shield, Star } from 'lucide-react';
import { Button, Card } from '../ui';

/**
 * Modern Call-to-Action Section for Sysora Landing Page
 * Final conversion section with compelling offer
 */
const ModernCTASection = ({ onGetStarted }) => {
  const benefits = [
    { icon: <CheckCircle className="w-5 h-5" />, text: '14-day free trial' },
    { icon: <Clock className="w-5 h-5" />, text: 'Setup in 5 minutes' },
    { icon: <Shield className="w-5 h-5" />, text: 'No credit card required' },
    { icon: <Star className="w-5 h-5" />, text: '30-day money-back guarantee' }
  ];

  const urgencyFeatures = [
    'Save 15+ hours per week',
    'Increase revenue by 25%',
    'Real-time analytics dashboard',
    '24/7 Arabic customer support'
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-light via-white to-sysora-light overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-sysora-mint/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative container-responsive">
        <div className="max-w-6xl mx-auto">
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              variant="elevated"
              className="relative overflow-hidden bg-gradient-to-br from-white via-white to-sysora-light/50 border-2 border-sysora-mint/20"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sysora-mint/10 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
              
              <Card.Content className="relative p-12 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <div className="space-y-8">
                    {/* Badge */}
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-4 py-2 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Limited Time Offer</span>
                    </motion.div>

                    {/* Headline */}
                    <div className="space-y-4">
                      <motion.h2
                        className="text-4xl lg:text-5xl font-bold text-sysora-midnight leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        Ready to Transform Your
                        <span className="block text-sysora-mint">Hotel Operations?</span>
                      </motion.h2>

                      <motion.p
                        className="text-xl text-neutral-600 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                      >
                        Join 500+ hotels already using Sysora to streamline operations, 
                        increase revenue, and provide exceptional guest experiences.
                      </motion.p>
                    </div>

                    {/* Urgency Features */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      {urgencyFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                        >
                          <CheckCircle className="w-5 h-5 text-sysora-mint flex-shrink-0" />
                          <span className="text-neutral-700">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      <Button
                        variant="gradient"
                        size="lg"
                        onClick={onGetStarted}
                        icon={<Zap className="w-5 h-5" />}
                        className="text-lg px-8 py-4 shadow-mint-lg hover:shadow-mint-xl"
                      >
                        Start Free Trial Now
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.open('/hotel-demo', '_blank')}
                        className="text-lg px-8 py-4"
                      >
                        Watch Demo
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 text-sm text-neutral-600"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                        >
                          <div className="text-success-500">
                            {benefit.icon}
                          </div>
                          <span>{benefit.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Right Content - Visual Element */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {/* Success Metrics Card */}
                    <Card
                      variant="glass"
                      className="relative backdrop-blur-xl border-white/20 shadow-2xl"
                    >
                      <Card.Content className="p-8">
                        <div className="text-center space-y-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-full flex items-center justify-center mx-auto">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-sysora-midnight mb-2">
                              Transform Your Hotel Today
                            </h3>
                            <p className="text-neutral-600">
                              Join the digital revolution in hospitality
                            </p>
                          </div>

                          {/* Mini Stats */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-sysora-mint">500+</div>
                              <div className="text-xs text-neutral-500">Hotels</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-sysora-mint">99.9%</div>
                              <div className="text-xs text-neutral-500">Uptime</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-sysora-mint">25%</div>
                              <div className="text-xs text-neutral-500">Revenue ↗</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-sysora-mint">4.9★</div>
                              <div className="text-xs text-neutral-500">Rating</div>
                            </div>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>

                    {/* Floating Elements */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-20 h-20 bg-sysora-mint/20 rounded-full blur-xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
                      animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Bottom Trust Bar */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-neutral-500 mb-4">
              Trusted by leading hotels across Algeria
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-neutral-400 font-medium">Hotel Aurassi</div>
              <div className="text-neutral-400 font-medium">Sheraton</div>
              <div className="text-neutral-400 font-medium">Hilton</div>
              <div className="text-neutral-400 font-medium">Sofitel</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTASection;
