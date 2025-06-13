import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, HelpCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CURRENT_PROMOTION, FREE_TRIAL } from '../constants/promotions';

const FAQ = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  // FAQ data with unified pricing information
  const faqs = [
    {
      question: "How long is the free trial?",
      answer: `You get ${FREE_TRIAL.duration} days completely free with full access to all features. ${FREE_TRIAL.requiresCreditCard ? 'Credit card required.' : 'No credit card required.'}`
    },
    {
      question: "What is the launch offer?",
      answer: `Our special launch offer gives you access to any plan for just $${CURRENT_PROMOTION.price} for ${CURRENT_PROMOTION.durationText}. This is a limited-time offer for early adopters only.`
    },
    {
      question: "What happens after the promotional period?",
      answer: `After the ${CURRENT_PROMOTION.durationText} promotional period, standard pricing applies: Small Hotels ($${CURRENT_PROMOTION.originalPricing.small.monthly}/month), Medium Hotels ($${CURRENT_PROMOTION.originalPricing.medium.monthly}/month), or Large Hotels ($${CURRENT_PROMOTION.originalPricing.large.monthly}/month).`
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time during the trial or promotional period. There are no cancellation fees or long-term commitments."
    },
    {
      question: "Are there any setup fees or hidden costs?",
      answer: "No, there are absolutely no setup fees, hidden costs, or additional charges. You only pay the promotional price during the offer period, then the standard monthly rate."
    },
    {
      question: "What features are included in each plan?",
      answer: "All plans include core hotel management features like room management, guest management, reservations, and payment processing. Higher plans add advanced features like channel management, analytics, and API access."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with SSL encryption, regular backups, and comply with international data protection standards. Your hotel data is safe and secure."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide 24/7 customer support via email and chat. Our team is always ready to help you get the most out of your hotel management system."
    },
    {
      question: "Can I import my existing data?",
      answer: "Yes, we provide data import tools and assistance to help you migrate from your existing system. Our support team can guide you through the process."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-sysora-mint/10 text-sysora-mint px-6 py-3 rounded-full font-medium">
            <HelpCircle className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-sysora-midnight">
            Got Questions? We've Got Answers
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our hotel management platform, pricing, and features.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-sysora-midnight pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-sysora-mint" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA - Responsive Design */}
        <div className="mt-16 px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-sysora-mint/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-sysora-mint" />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-sysora-midnight">
                  Still Have Questions?
                </h3>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Our support team is here to help you 24/7. Get in touch and we'll answer any questions you have.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="btn-primary px-6 py-3 text-sm md:text-base w-full sm:w-auto">
                  Contact Support
                </button>
                <button className="btn-secondary px-6 py-3 text-sm md:text-base w-full sm:w-auto">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-sysora-midnight">30-Day Guarantee</h4>
            <p className="text-gray-600 text-sm">Money-back guarantee if you're not satisfied</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-sysora-midnight">24/7 Support</h4>
            <p className="text-gray-600 text-sm">Round-the-clock customer support</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-sysora-midnight">Secure & Reliable</h4>
            <p className="text-gray-600 text-sm">Enterprise-grade security and 99.9% uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

FAQ.propTypes = {
  className: PropTypes.string,
  onContactSupport: PropTypes.func,
  onScheduleDemo: PropTypes.func
};

FAQ.defaultProps = {
  className: '',
  onContactSupport: () => {},
  onScheduleDemo: () => {}
};

export default FAQ;
