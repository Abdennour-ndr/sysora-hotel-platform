import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  Calendar, 
  Shield,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button, Card } from './ui';

/**
 * Modern FAQ Section for Sysora Landing Page
 * Updated to match the new design system and landing page style
 */
const ModernFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How long is the free trial?",
      answer: "You get 3 days completely free with full access to all features. No credit card required to start your trial."
    },
    {
      question: "What is the launch offer?",
      answer: "Early adopters get access to any plan for just $5 for the first 3 months. This is a limited-time offer for the first 1000 hotels that sign up."
    },
    {
      question: "What happens after the promotional period?",
      answer: "After the 3-month promotional period, you'll be charged the regular monthly rate for your chosen plan. You can cancel or change plans anytime."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely! There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your account settings."
    },
    {
      question: "Are there any setup fees or hidden costs?",
      answer: "No setup fees, no hidden costs. What you see is what you pay. We believe in transparent pricing with no surprises."
    },
    {
      question: "What features are included in each plan?",
      answer: "Each plan builds on the previous one. Small Hotels includes core features, Medium Hotels adds analytics and reporting, Large Hotels includes advanced integrations and multi-property support."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at your next billing cycle."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption, regular security audits, and comply with international data protection standards. Your data is safe with us."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support in Arabic, English, and French. Our local team understands the Algerian market and hospitality industry."
    },
    {
      question: "Can I import my existing data?",
      answer: "Yes, our team will help you migrate your existing guest data, reservations, and settings from your current system at no extra cost."
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Contact Support",
      description: "Get help from our expert team",
      action: "Chat Now",
      iconBg: "bg-sysora-mint/10",
      iconColor: "text-sysora-mint"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Schedule Demo",
      description: "See Sysora in action",
      action: "Book Demo",
      iconBg: "bg-info-100",
      iconColor: "text-info-600"
    }
  ];

  const guarantees = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "30-Day Guarantee",
      description: "Money-back guarantee if you're not satisfied",
      iconBg: "bg-success-100",
      iconColor: "text-success-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      iconBg: "bg-warning-100",
      iconColor: "text-warning-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime",
      iconBg: "bg-info-100",
      iconColor: "text-info-600"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-sysora-light via-white to-neutral-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-sysora-mint/5 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
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
            <HelpCircle className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-sysora-midnight mb-6">
            Got Questions?
            <span className="block bg-gradient-to-r from-sysora-mint to-sysora-mint-dark bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our hotel management platform, 
            pricing, and features.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card 
                    className={`transition-all duration-200 cursor-pointer ${
                      openIndex === index 
                        ? 'border-sysora-mint shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <Card.Content className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-sysora-midnight pr-4">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-neutral-500" />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-neutral-200 mt-4">
                              <p className="text-neutral-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Support Sidebar */}
          <div className="space-y-8">
            {/* Support Options */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-xl font-bold text-sysora-midnight mb-6">
                Still Have Questions?
              </h3>
              <p className="text-neutral-600 mb-6">
                Our support team is here to help you 24/7. Get in touch and we'll answer any questions you have.
              </p>
              
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card hover className="cursor-pointer">
                      <Card.Content className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${option.iconBg} rounded-xl flex items-center justify-center ${option.iconColor}`}>
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sysora-midnight mb-1">
                              {option.title}
                            </h4>
                            <p className="text-sm text-neutral-600 mb-3">
                              {option.description}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<ArrowRight className="w-4 h-4" />}
                              className="text-xs"
                            >
                              {option.action}
                            </Button>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Guarantees */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card variant="gradient" className="bg-gradient-to-br from-sysora-mint/5 to-blue-500/5">
                <Card.Content className="p-6">
                  <div className="text-center mb-6">
                    <Sparkles className="w-8 h-8 text-sysora-mint mx-auto mb-3" />
                    <h4 className="font-bold text-sysora-midnight">
                      Why Choose Sysora?
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    {guarantees.map((guarantee, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <div className={`w-8 h-8 ${guarantee.iconBg} rounded-lg flex items-center justify-center ${guarantee.iconColor} flex-shrink-0`}>
                          {guarantee.icon}
                        </div>
                        <div>
                          <h5 className="font-semibold text-sysora-midnight text-sm">
                            {guarantee.title}
                          </h5>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {guarantee.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFAQ;
