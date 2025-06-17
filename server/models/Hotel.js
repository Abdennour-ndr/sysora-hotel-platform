import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9-]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },

  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },

  // Owner Information
  owner: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: String
  },

  // Business Information
  employeeCount: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201+']
  },

  // Subscription Information
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan'
    },
    plan: {
      type: String,
      enum: ['trial', 'small-hotels', 'medium-hotels', 'large-hotels', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['trial', 'active', 'past_due', 'cancelled', 'suspended'],
      default: 'trial'
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // 3 days trial by default
        return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      }
    },
    trialUsed: {
      type: Boolean,
      default: false
    },
    trialStartDate: Date,
    trialEndDate: Date,
    promoUsed: {
      type: Boolean,
      default: false
    },
    promoCode: String,
    promoEndDate: Date,
    nextBillingDate: Date,
    lastPaymentDate: Date,
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'manual'],
      default: 'credit_card'
    },
    autoRenew: {
      type: Boolean,
      default: true
    }
  },

  // Hotel Settings
  settings: {
    timezone: {
      type: String,
      default: 'Africa/Algiers'
    },
    currency: {
      code: {
        type: String,
        default: 'DZD'
      },
      symbol: {
        type: String,
        default: 'دج'
      },
      name: {
        type: String,
        default: 'الدينار الجزائري'
      },
      position: {
        type: String,
        enum: ['before', 'after'],
        default: 'after'
      }
    },
    language: {
      type: String,
      default: 'ar'
    },
    checkInTime: {
      type: String,
      default: '15:00'
    },
    checkOutTime: {
      type: String,
      default: '11:00'
    }
  },

  // Customization Settings
  customization: {
    // Theme and Colors
    theme: {
      primaryColor: {
        type: String,
        default: '#002D5B' // sysora-midnight
      },
      secondaryColor: {
        type: String,
        default: '#2EC4B6' // sysora-mint
      },
      accentColor: {
        type: String,
        default: '#F9FAFB' // sysora-light
      },
      backgroundColor: {
        type: String,
        default: '#FFFFFF'
      },
      textColor: {
        type: String,
        default: '#1F2937'
      },
      sidebarColor: {
        type: String,
        default: '#FFFFFF'
      },
      headerColor: {
        type: String,
        default: '#FFFFFF'
      }
    },

    // Logo and Branding
    branding: {
      logo: {
        type: String, // URL to uploaded logo
        default: null
      },
      logoText: {
        type: String,
        default: null
      },
      favicon: {
        type: String,
        default: null
      },
      companyName: {
        type: String,
        default: 'فندق سيسورا'
      },
      description: {
        type: String,
        default: 'فندق فاخر يقدم أفضل الخدمات الفندقية'
      },
      phone: {
        type: String,
        default: '+966501234567'
      },
      email: {
        type: String,
        default: 'info@sysora-hotel.com'
      },
      address: {
        type: String,
        default: 'الرياض، المملكة العربية السعودية'
      },
      website: {
        type: String,
        default: null
      },
      tagline: {
        type: String,
        default: null
      },
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
      }
    },

    // Dashboard Layout
    dashboard: {
      layout: {
        type: String,
        enum: ['grid', 'list', 'cards', 'compact'],
        default: 'grid'
      },
      sidebarPosition: {
        type: String,
        enum: ['left', 'right'],
        default: 'left'
      },
      widgets: {
        showQuickStats: {
          type: Boolean,
          default: true
        },
        showRecentReservations: {
          type: Boolean,
          default: true
        },
        showQuickActions: {
          type: Boolean,
          default: true
        },
        showRevenueChart: {
          type: Boolean,
          default: true
        },
        showOccupancyChart: {
          type: Boolean,
          default: true
        }
      },
      sidebarCollapsed: {
        type: Boolean,
        default: false
      },
      showWelcomeMessage: {
        type: Boolean,
        default: true
      }
    },

    // UI Preferences
    ui: {
      fontFamily: {
        type: String,
        enum: ['Inter', 'Poppins', 'Cairo', 'Tajawal'],
        default: 'Inter'
      },
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      borderRadius: {
        type: String,
        enum: ['none', 'small', 'medium', 'large'],
        default: 'medium'
      },
      shadows: {
        type: Boolean,
        default: true
      },
      animations: {
        enabled: {
          type: Boolean,
          default: true
        },
        transitions: {
          type: Boolean,
          default: true
        },
        duration: {
          type: String,
          enum: ['fast', 'normal', 'slow'],
          default: 'normal'
        }
      },
      density: {
        type: String,
        enum: ['compact', 'comfortable', 'spacious'],
        default: 'comfortable'
      },
      darkMode: {
        type: Boolean,
        default: false
      }
    },

    // Custom CSS
    customCss: {
      type: String,
      default: ''
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
hotelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
hotelSchema.index({ subdomain: 1 });
hotelSchema.index({ email: 1 });
hotelSchema.index({ 'owner.email': 1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
