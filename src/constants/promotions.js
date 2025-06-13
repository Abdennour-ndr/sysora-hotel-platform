/**
 * 🎯 Unified Promotion Configuration
 * 
 * This file contains the single source of truth for all promotional offers
 * across the entire landing page to ensure consistency and prevent conflicts.
 * 
 * Last Updated: December 2024
 * Purpose: Fix pricing conflicts across LimitedTimeOffer, PricingSection, and SignupForm
 */

// 🚀 Current Active Promotion
export const CURRENT_PROMOTION = {
  // Basic Info
  enabled: true,
  name: 'Launch Offer',
  
  // Pricing
  price: 5,
  currency: 'USD',
  duration: 90, // days (3 months)
  durationText: '3 months',
  
  // Original Pricing (after promotion)
  originalPricing: {
    small: { monthly: 9, yearly: 90 },
    medium: { monthly: 29, yearly: 290 },
    large: { monthly: 79, yearly: 790 }
  },
  
  // Display Text
  description: 'Launch Offer: $5 for 3 months',
  shortDescription: '$5 for 3 months',
  note: 'Limited time offer for early adopters',
  badge: '🎉 Launch Offer',
  
  // Eligibility
  eligibility: 'first_time_only',
  requiresCreditCard: false,
  
  // Marketing Messages
  urgency: 'Limited time offer',
  savings: 'Save up to 94%',
  
  // Terms
  terms: [
    'Valid for new customers only',
    'After promotional period, standard pricing applies',
    'Cancel anytime during trial or promotional period',
    'No setup fees or hidden costs'
  ]
};

// 🆓 Free Trial Configuration
export const FREE_TRIAL = {
  enabled: true,
  duration: 3, // days
  requiresCreditCard: false,
  description: '3-day free trial',
  note: 'No credit card required'
};

// 📊 Enhanced Statistics (More Convincing Numbers)
export const PLATFORM_STATS = {
  hotels: {
    value: 500,
    suffix: '+',
    label: 'Hotels',
    description: 'Active hotels using our platform'
  },
  bookings: {
    value: 50,
    suffix: 'K+', 
    label: 'Bookings',
    description: 'Total bookings processed'
  },
  uptime: {
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
    description: 'Platform reliability'
  },
  satisfaction: {
    value: 4.8,
    suffix: '/5',
    label: 'Rating',
    description: 'Customer satisfaction score'
  }
};

// 🎯 Call-to-Action Messages
export const CTA_MESSAGES = {
  primary: 'Start Your Free Trial',
  secondary: 'Get Started for $5',
  urgency: 'Limited Time - Start Now',
  trial: 'Try Free for 3 Days',
  promotion: 'Claim Launch Offer'
};

// 🏷️ Plan Configurations with Unified Pricing
export const PRICING_PLANS = [
  {
    id: 'small-hotels',
    name: 'Small Hotels',
    description: 'Perfect for small hotels and guesthouses',
    icon: 'Star',
    
    // Promotional Pricing
    promo: {
      enabled: CURRENT_PROMOTION.enabled,
      price: CURRENT_PROMOTION.price,
      duration: CURRENT_PROMOTION.durationText,
      description: CURRENT_PROMOTION.description
    },
    
    // Regular Pricing
    pricing: {
      monthly: CURRENT_PROMOTION.originalPricing.small.monthly,
      yearly: CURRENT_PROMOTION.originalPricing.small.yearly,
      yearlyDiscount: 17
    },
    
    // Features
    features: [
      'Room Management',
      'Guest Management',
      'Reservation System', 
      'Housekeeping Management',
      'Payment Processing',
      'Interface Customization',
      'Revenue Tracking'
    ],
    
    popular: false
  },
  
  {
    id: 'medium-hotels',
    name: 'Medium Hotels',
    description: 'Ideal for growing medium-sized hotels',
    icon: 'Zap',
    
    // Promotional Pricing
    promo: {
      enabled: CURRENT_PROMOTION.enabled,
      price: CURRENT_PROMOTION.price,
      duration: CURRENT_PROMOTION.durationText,
      description: CURRENT_PROMOTION.description
    },
    
    // Regular Pricing
    pricing: {
      monthly: CURRENT_PROMOTION.originalPricing.medium.monthly,
      yearly: CURRENT_PROMOTION.originalPricing.medium.yearly,
      yearlyDiscount: 17
    },
    
    // Features
    features: [
      'All Small Hotels features',
      'Channel Management',
      'Periodic Reports',
      'Smart Notifications',
      'Advanced Analytics',
      'Multi-room Types',
      'Staff Management'
    ],
    
    popular: true
  },
  
  {
    id: 'large-hotels',
    name: 'Large Hotels & Chains',
    description: 'For large hotels and hotel chains',
    icon: 'Crown',
    
    // Promotional Pricing
    promo: {
      enabled: CURRENT_PROMOTION.enabled,
      price: CURRENT_PROMOTION.price,
      duration: CURRENT_PROMOTION.durationText,
      description: CURRENT_PROMOTION.description
    },
    
    // Regular Pricing
    pricing: {
      monthly: CURRENT_PROMOTION.originalPricing.large.monthly,
      yearly: CURRENT_PROMOTION.originalPricing.large.yearly,
      yearlyDiscount: 17
    },
    
    // Features
    features: [
      'All Medium Hotels features',
      'Revenue Management',
      'API Access',
      'Guest Communication',
      'Payment Gateway',
      'Multi-property Support',
      'Advanced Reporting',
      'Custom Integrations'
    ],
    
    popular: false
  }
];

// 🎨 UI Configuration
export const UI_CONFIG = {
  colors: {
    promotion: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    popular: 'bg-gradient-to-r from-sysora-mint to-emerald-500',
    primary: 'bg-sysora-mint hover:bg-sysora-mint/90',
    secondary: 'bg-sysora-light hover:bg-gray-100'
  },
  
  animations: {
    counter: {
      duration: 2500,
      easing: 'easeOutQuart'
    },
    fadeIn: {
      duration: 1000,
      delay: 500
    }
  }
};

// 📈 Marketing Messages
export const MARKETING_MESSAGES = {
  hero: {
    title: 'Smart Hotel Management Platform',
    subtitle: 'Streamline your hotel operations with our comprehensive management system. From reservations to billing, everything you need in one place.',
    cta: CTA_MESSAGES.primary
  },
  
  promotion: {
    badge: CURRENT_PROMOTION.badge,
    title: `Get Started for Just $${CURRENT_PROMOTION.price}`,
    subtitle: `Enjoy full access to Hotel Management System for ${FREE_TRIAL.duration} days free trial, then pay only $${CURRENT_PROMOTION.price} for the next ${CURRENT_PROMOTION.durationText}. Afterwards, standard plans apply.`,
    urgency: CURRENT_PROMOTION.urgency
  },
  
  social_proof: {
    stats_title: 'Trusted by Hotels Worldwide',
    testimonials_title: 'What Our Customers Say',
    guarantee: '30-day money-back guarantee'
  }
};

// 🔄 Export all configurations
export default {
  CURRENT_PROMOTION,
  FREE_TRIAL,
  PLATFORM_STATS,
  CTA_MESSAGES,
  PRICING_PLANS,
  UI_CONFIG,
  MARKETING_MESSAGES
};
