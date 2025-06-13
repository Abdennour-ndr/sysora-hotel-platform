import mongoose from 'mongoose';

const discountCodeSchema = new mongoose.Schema({
  // Basic Information
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,

  // Discount Configuration
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // Validity Period
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },

  // Usage Limits
  usageLimit: {
    total: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    perUser: {
      type: Number,
      default: 1
    }
  },
  usageCount: {
    type: Number,
    default: 0
  },

  // Eligibility Rules
  eligibility: {
    userType: {
      type: String,
      enum: ['all', 'new_users', 'existing_users', 'trial_users'],
      default: 'all'
    },
    planTypes: [{
      type: String,
      enum: ['basic', 'standard', 'premium', 'enterprise']
    }],
    billingCycle: {
      type: String,
      enum: ['all', 'monthly', 'yearly'],
      default: 'all'
    },
    minimumAmount: {
      type: Number,
      default: 0
    },
    maximumDiscount: {
      type: Number,
      default: -1 // -1 means no maximum
    }
  },

  // Conditional Logic
  conditions: {
    firstTimeOnly: {
      type: Boolean,
      default: false
    },
    requiresTrialExpiry: {
      type: Boolean,
      default: false
    },
    userBehavior: {
      type: String,
      enum: ['any', 'trial_expired', 'subscription_cancelled', 'downgrade_attempt'],
      default: 'any'
    },
    geolocation: [{
      country: String,
      region: String
    }]
  },

  // Auto-Application Rules
  autoApply: {
    enabled: {
      type: Boolean,
      default: false
    },
    triggers: [{
      type: String,
      enum: ['trial_expiry', 'subscription_cancellation', 'failed_payment', 'downgrade']
    }],
    priority: {
      type: Number,
      default: 0
    }
  },

  // Tracking and Analytics
  usage: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    originalAmount: Number,
    discountAmount: Number,
    finalAmount: Number,
    planType: String,
    billingCycle: String
  }],

  // Status and Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['seasonal', 'promotional', 'loyalty', 'referral', 'recovery'],
    default: 'promotional'
  },
  tags: [String],

  // Admin Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining uses
discountCodeSchema.virtual('remainingUses').get(function() {
  if (this.usageLimit.total === -1) return -1; // unlimited
  return Math.max(0, this.usageLimit.total - this.usageCount);
});

// Virtual for is expired
discountCodeSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for is valid
discountCodeSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && this.remainingUses !== 0;
});

// Method to check if user is eligible
discountCodeSchema.methods.isUserEligible = function(user, planType, billingCycle) {
  // Check user type eligibility
  if (this.eligibility.userType !== 'all') {
    // Add logic based on user type
    // This would need to be implemented based on user model
  }

  // Check plan type eligibility
  if (this.eligibility.planTypes.length > 0 && !this.eligibility.planTypes.includes(planType)) {
    return false;
  }

  // Check billing cycle eligibility
  if (this.eligibility.billingCycle !== 'all' && this.eligibility.billingCycle !== billingCycle) {
    return false;
  }

  // Check if first time only
  if (this.conditions.firstTimeOnly) {
    const hasUsed = this.usage.some(u => u.userId.toString() === user._id.toString());
    if (hasUsed) return false;
  }

  return true;
};

// Method to calculate discount amount
discountCodeSchema.methods.calculateDiscount = function(originalAmount) {
  let discountAmount = 0;

  if (this.type === 'percentage') {
    discountAmount = (originalAmount * this.value) / 100;
  } else if (this.type === 'fixed_amount') {
    discountAmount = this.value;
  }

  // Apply maximum discount limit if set
  if (this.eligibility.maximumDiscount > 0) {
    discountAmount = Math.min(discountAmount, this.eligibility.maximumDiscount);
  }

  // Ensure discount doesn't exceed original amount
  discountAmount = Math.min(discountAmount, originalAmount);

  return {
    originalAmount,
    discountAmount,
    finalAmount: originalAmount - discountAmount,
    discountPercentage: (discountAmount / originalAmount) * 100
  };
};

// Method to apply discount
discountCodeSchema.methods.applyDiscount = function(user, hotel, originalAmount, planType, billingCycle) {
  const calculation = this.calculateDiscount(originalAmount);
  
  // Record usage
  this.usage.push({
    userId: user._id,
    hotelId: hotel._id,
    appliedAt: new Date(),
    originalAmount: calculation.originalAmount,
    discountAmount: calculation.discountAmount,
    finalAmount: calculation.finalAmount,
    planType,
    billingCycle
  });

  // Increment usage count
  this.usageCount += 1;

  return calculation;
};

// Create indexes
discountCodeSchema.index({ code: 1 });
discountCodeSchema.index({ validFrom: 1, validUntil: 1 });
discountCodeSchema.index({ isActive: 1 });
discountCodeSchema.index({ 'autoApply.enabled': 1 });
discountCodeSchema.index({ category: 1 });

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);

export default DiscountCode;
