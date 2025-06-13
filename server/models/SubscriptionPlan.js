import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['core', 'advanced', 'premium', 'enterprise'],
    default: 'core'
  },
  module: {
    type: String,
    enum: ['hotel', 'restaurant', 'pos', 'erp', 'analytics', 'integrations'],
    default: 'hotel'
  },
  status: {
    type: String,
    enum: ['available', 'soon', 'planned'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const subscriptionPlanSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  tagline: String,
  
  // Pricing
  pricing: {
    monthly: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    yearly: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      },
      discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    }
  },

  // Trial Configuration
  trial: {
    enabled: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 3 // days
    },
    requiresCreditCard: {
      type: Boolean,
      default: false
    }
  },

  // Promotional Pricing
  promo: {
    enabled: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      min: 0
    },
    duration: {
      type: Number,
      default: 90 // days
    },
    description: String,
    eligibility: {
      type: String,
      enum: ['first_time_only', 'returning_users', 'all'],
      default: 'first_time_only'
    }
  },

  // Features included in this plan
  features: [{
    featureKey: {
      type: String,
      required: true
    },
    included: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    notes: String
  }],

  // Limits and Quotas
  limits: {
    users: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    hotels: {
      type: Number,
      default: 1
    },
    rooms: {
      type: Number,
      default: -1
    },
    reservations: {
      type: Number,
      default: -1
    },
    storage: {
      type: Number,
      default: 5000 // MB
    },
    apiCalls: {
      type: Number,
      default: 10000 // per month
    }
  },

  // Display Settings
  display: {
    isVisible: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#3B82F6'
    },
    icon: String
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for yearly savings
subscriptionPlanSchema.virtual('yearlySavings').get(function() {
  const monthlyTotal = this.pricing.monthly.amount * 12;
  const yearlyTotal = this.pricing.yearly.amount;
  return monthlyTotal - yearlyTotal;
});

// Virtual for yearly savings percentage
subscriptionPlanSchema.virtual('yearlySavingsPercentage').get(function() {
  const monthlyTotal = this.pricing.monthly.amount * 12;
  const yearlyTotal = this.pricing.yearly.amount;
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
});

// Method to check if feature is included
subscriptionPlanSchema.methods.hasFeature = function(featureKey) {
  const feature = this.features.find(f => f.featureKey === featureKey);
  return feature ? feature.included : false;
};

// Method to get feature limit
subscriptionPlanSchema.methods.getFeatureLimit = function(featureKey) {
  const feature = this.features.find(f => f.featureKey === featureKey);
  return feature ? feature.limit : 0;
};

// Create indexes
subscriptionPlanSchema.index({ slug: 1 });
subscriptionPlanSchema.index({ 'display.isVisible': 1 });
subscriptionPlanSchema.index({ 'display.order': 1 });
subscriptionPlanSchema.index({ isActive: 1 });

// Feature model
const Feature = mongoose.model('Feature', featureSchema);
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export { Feature, SubscriptionPlan };
export default SubscriptionPlan;
