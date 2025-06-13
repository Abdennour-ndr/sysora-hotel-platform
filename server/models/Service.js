import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  // Service Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  nameAr: {
    type: String,
    trim: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  descriptionAr: {
    type: String,
    trim: true
  },
  
  // Category
  category: {
    type: String,
    required: true,
    enum: [
      'room_service',
      'laundry',
      'spa',
      'restaurant',
      'transportation',
      'entertainment',
      'business',
      'fitness',
      'concierge',
      'other'
    ]
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'per_hour', 'per_day', 'per_person', 'per_item', 'custom'],
      default: 'fixed'
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    minimumCharge: {
      type: Number,
      default: 0
    },
    maximumCharge: {
      type: Number
    }
  },
  
  // Availability
  availability: {
    isActive: {
      type: Boolean,
      default: true
    },
    schedule: {
      monday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      tuesday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      wednesday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      thursday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      friday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      saturday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      },
      sunday: {
        available: { type: Boolean, default: true },
        startTime: { type: String, default: '00:00' },
        endTime: { type: String, default: '23:59' }
      }
    },
    advanceBooking: {
      required: { type: Boolean, default: false },
      minimumHours: { type: Number, default: 0 },
      maximumDays: { type: Number, default: 30 }
    }
  },
  
  // Service Options
  options: [{
    name: String,
    nameAr: String,
    description: String,
    additionalPrice: {
      type: Number,
      default: 0
    },
    required: {
      type: Boolean,
      default: false
    }
  }],
  
  // Requirements
  requirements: {
    minimumGuests: {
      type: Number,
      default: 1
    },
    maximumGuests: {
      type: Number
    },
    ageRestriction: {
      minimum: Number,
      maximum: Number
    },
    specialRequirements: [String]
  },
  
  // Staff Assignment
  staffRequired: {
    type: Number,
    default: 0
  },
  
  assignedStaff: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Location
  location: {
    type: String,
    enum: ['in_room', 'lobby', 'restaurant', 'spa', 'pool', 'gym', 'external', 'other']
  },
  
  locationDetails: {
    type: String,
    trim: true
  },
  
  // Duration
  estimatedDuration: {
    type: Number, // in minutes
    default: 30
  },
  
  // Images
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Terms and Conditions
  terms: {
    cancellationPolicy: String,
    refundPolicy: String,
    specialTerms: [String]
  },
  
  // Statistics
  stats: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    lastBooked: Date
  },
  
  // SEO and Marketing
  tags: [String],
  
  featured: {
    type: Boolean,
    default: false
  },
  
  popularityScore: {
    type: Number,
    default: 0
  },
  
  // External Integration
  externalIds: {
    pos: String,
    accounting: String,
    inventory: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
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
serviceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for display name based on language
serviceSchema.virtual('displayName').get(function() {
  // This would be enhanced with proper i18n
  return this.nameAr || this.name;
});

// Virtual for display description based on language
serviceSchema.virtual('displayDescription').get(function() {
  // This would be enhanced with proper i18n
  return this.descriptionAr || this.description;
});

// Method to check if service is available at given time
serviceSchema.methods.isAvailableAt = function(dateTime) {
  const dayOfWeek = dateTime.toLocaleLowerCase();
  const time = dateTime.toTimeString().slice(0, 5);
  
  const daySchedule = this.availability.schedule[dayOfWeek];
  if (!daySchedule || !daySchedule.available) {
    return false;
  }
  
  return time >= daySchedule.startTime && time <= daySchedule.endTime;
};

// Method to calculate price for given parameters
serviceSchema.methods.calculatePrice = function(quantity = 1, duration = null, options = []) {
  let basePrice = this.pricing.basePrice;
  
  // Calculate based on pricing type
  switch (this.pricing.type) {
    case 'per_hour':
      basePrice *= (duration || 1);
      break;
    case 'per_person':
      basePrice *= quantity;
      break;
    case 'per_item':
      basePrice *= quantity;
      break;
    case 'per_day':
      basePrice *= Math.ceil((duration || 1) / 24);
      break;
  }
  
  // Add options pricing
  let optionsPrice = 0;
  if (options && options.length > 0) {
    for (const optionId of options) {
      const option = this.options.id(optionId);
      if (option) {
        optionsPrice += option.additionalPrice;
      }
    }
  }
  
  const totalPrice = basePrice + optionsPrice;
  
  // Apply minimum and maximum charges
  if (this.pricing.minimumCharge && totalPrice < this.pricing.minimumCharge) {
    return this.pricing.minimumCharge;
  }
  
  if (this.pricing.maximumCharge && totalPrice > this.pricing.maximumCharge) {
    return this.pricing.maximumCharge;
  }
  
  return totalPrice;
};

// Create indexes
serviceSchema.index({ hotelId: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ 'availability.isActive': 1 });
serviceSchema.index({ featured: 1 });
serviceSchema.index({ popularityScore: -1 });
serviceSchema.index({ tags: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
