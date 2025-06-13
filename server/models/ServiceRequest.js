import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  // Request Details
  requestNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Service and Reservation
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  
  // Request Details
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  
  duration: {
    type: Number, // in minutes
    default: 30
  },
  
  // Selected Options
  selectedOptions: [{
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    additionalPrice: Number
  }],
  
  // Scheduling
  requestedDateTime: {
    type: Date,
    required: true
  },
  
  scheduledDateTime: {
    type: Date
  },
  
  estimatedCompletionTime: {
    type: Date
  },
  
  actualStartTime: {
    type: Date
  },
  
  actualCompletionTime: {
    type: Date
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: true
  },
  
  optionsPrice: {
    type: Number,
    default: 0
  },
  
  totalPrice: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Status
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'scheduled',
      'in_progress',
      'completed',
      'cancelled',
      'no_show'
    ],
    default: 'pending'
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Staff Assignment
  assignedStaff: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    assignedAt: {
      type: Date,
      default: Date.now
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Guest Information
  guestNotes: {
    type: String,
    trim: true
  },
  
  specialRequests: [String],
  
  guestContact: {
    phone: String,
    email: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'room_phone', 'in_person'],
      default: 'room_phone'
    }
  },
  
  // Service Execution
  serviceNotes: {
    type: String,
    trim: true
  },
  
  completionNotes: {
    type: String,
    trim: true
  },
  
  // Quality and Feedback
  guestRating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  guestFeedback: {
    type: String,
    trim: true
  },
  
  feedbackDate: {
    type: Date
  },
  
  // Issues and Resolution
  issues: [{
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Billing
  billing: {
    addedToReservation: {
      type: Boolean,
      default: false
    },
    addedAt: Date,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'waived'],
      default: 'pending'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  },
  
  // Cancellation
  cancellation: {
    reason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    cancellationFee: {
      type: Number,
      default: 0
    }
  },
  
  // Audit Trail
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
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
serviceRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate request number before saving
serviceRequestSchema.pre('save', async function(next) {
  if (this.isNew && !this.requestNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last service request for today
    const lastRequest = await this.constructor.findOne({
      requestNumber: new RegExp(`^SR${year}${month}${day}`)
    }).sort({ requestNumber: -1 });
    
    let sequence = 1;
    if (lastRequest) {
      const lastSequence = parseInt(lastRequest.requestNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.requestNumber = `SR${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history when status changes
serviceRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      userId: this.updatedBy
    });
  }
  next();
});

// Virtual for total duration in hours
serviceRequestSchema.virtual('durationHours').get(function() {
  return Math.round((this.duration / 60) * 100) / 100;
});

// Virtual for actual service duration
serviceRequestSchema.virtual('actualDuration').get(function() {
  if (this.actualStartTime && this.actualCompletionTime) {
    return Math.round(((this.actualCompletionTime - this.actualStartTime) / (1000 * 60)) * 100) / 100;
  }
  return null;
});

// Method to update status with history
serviceRequestSchema.methods.updateStatus = function(newStatus, userId, notes = '') {
  this.status = newStatus;
  this.updatedBy = userId;
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    userId: userId,
    notes: notes
  });
  
  // Update specific timestamps based on status
  switch (newStatus) {
    case 'in_progress':
      this.actualStartTime = new Date();
      break;
    case 'completed':
      this.actualCompletionTime = new Date();
      break;
    case 'cancelled':
      this.cancellation.cancelledAt = new Date();
      this.cancellation.cancelledBy = userId;
      break;
  }
};

// Method to assign staff
serviceRequestSchema.methods.assignStaff = function(userId, role, isPrimary = false) {
  // Remove existing assignment for this user
  this.assignedStaff = this.assignedStaff.filter(staff => 
    staff.userId.toString() !== userId.toString()
  );
  
  // Add new assignment
  this.assignedStaff.push({
    userId,
    role,
    isPrimary,
    assignedAt: new Date()
  });
};

// Create indexes
serviceRequestSchema.index({ hotelId: 1 });
serviceRequestSchema.index({ serviceId: 1 });
serviceRequestSchema.index({ reservationId: 1 });
serviceRequestSchema.index({ guestId: 1 });
serviceRequestSchema.index({ roomId: 1 });
serviceRequestSchema.index({ requestNumber: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ priority: 1 });
serviceRequestSchema.index({ requestedDateTime: 1 });
serviceRequestSchema.index({ scheduledDateTime: 1 });
serviceRequestSchema.index({ 'assignedStaff.userId': 1 });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
