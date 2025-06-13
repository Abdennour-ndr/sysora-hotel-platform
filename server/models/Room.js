import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },

  // Basic Information
  number: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },

  // Room Type and Category
  type: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'suite', 'presidential']
  },
  category: {
    type: String,
    enum: ['standard', 'premium', 'luxury']
  },

  // Capacity
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  bedCount: {
    type: Number,
    required: true,
    min: 1
  },
  bedType: {
    type: String,
    enum: ['single', 'double', 'queen', 'king', 'sofa']
  },

  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'DZD'
  },

  // Room Details
  size: {
    type: Number, // in square meters
    min: 0
  },
  floor: {
    type: Number,
    min: 0
  },

  // Amenities
  amenities: [{
    type: String,
    enum: [
      'WiFi',
      'Air Conditioning',
      'Television',
      'Mini Fridge',
      'Safe',
      'Balcony',
      'Private Bathroom',
      'Jacuzzi',
      'Kitchenette'
    ]
  }],

  // Status
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'cleaning', 'out_of_order', 'dirty'],
    default: 'available'
  },

  // Cleaning Status
  cleaningStatus: {
    type: String,
    enum: ['clean', 'dirty', 'in_progress', 'inspected'],
    default: 'clean'
  },

  // Maintenance Status
  maintenanceStatus: {
    type: String,
    enum: ['good', 'needs_attention', 'under_repair', 'out_of_order'],
    default: 'good'
  },

  // Maintenance and Cleaning
  lastCleaned: Date,
  lastMaintenance: Date,
  maintenanceNotes: String,
  cleaningNotes: String,

  // Cleaning Requests
  cleaningRequests: [{
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Maintenance Requests
  maintenanceRequests: [{
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    issue: String,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: Number,
    notes: String
  }],

  // Room Features
  features: {
    hasBalcony: { type: Boolean, default: false },
    hasKitchen: { type: Boolean, default: false },
    hasLivingRoom: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    accessible: { type: Boolean, default: false }
  },

  // Images
  images: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    caption: String
  }],

  // Notes
  description: String,
  notes: String,

  // Availability
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
roomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to request cleaning
roomSchema.methods.requestCleaning = function(requestedBy, priority = 'normal', notes = '') {
  this.cleaningRequests.push({
    requestedBy,
    priority,
    notes,
    status: 'pending'
  });

  if (this.cleaningStatus === 'clean') {
    this.cleaningStatus = 'dirty';
  }

  return this.save();
};

// Method to start cleaning
roomSchema.methods.startCleaning = function(assignedTo) {
  const pendingRequest = this.cleaningRequests.find(req => req.status === 'pending');
  if (pendingRequest) {
    pendingRequest.status = 'in_progress';
    pendingRequest.assignedTo = assignedTo;
  }

  this.cleaningStatus = 'in_progress';
  this.status = 'cleaning';

  return this.save();
};

// Method to complete cleaning
roomSchema.methods.completeCleaning = function(completedBy, notes = '') {
  const inProgressRequest = this.cleaningRequests.find(req => req.status === 'in_progress');
  if (inProgressRequest) {
    inProgressRequest.status = 'completed';
    inProgressRequest.completedAt = new Date();
    inProgressRequest.completedBy = completedBy;
  }

  this.cleaningStatus = 'clean';
  this.lastCleaned = new Date();
  this.cleaningNotes = notes;

  // If no maintenance issues, make room available
  if (this.maintenanceStatus === 'good') {
    this.status = 'available';
  }

  return this.save();
};

// Method to request maintenance
roomSchema.methods.requestMaintenance = function(requestedBy, issue, priority = 'normal') {
  this.maintenanceRequests.push({
    requestedBy,
    issue,
    priority,
    status: 'pending'
  });

  this.maintenanceStatus = 'needs_attention';

  return this.save();
};

// Method to start maintenance
roomSchema.methods.startMaintenance = function(assignedTo) {
  const pendingRequest = this.maintenanceRequests.find(req => req.status === 'pending');
  if (pendingRequest) {
    pendingRequest.status = 'in_progress';
    pendingRequest.assignedTo = assignedTo;
  }

  this.maintenanceStatus = 'under_repair';
  this.status = 'maintenance';

  return this.save();
};

// Method to complete maintenance
roomSchema.methods.completeMaintenance = function(completedBy, cost = 0, notes = '') {
  const inProgressRequest = this.maintenanceRequests.find(req => req.status === 'in_progress');
  if (inProgressRequest) {
    inProgressRequest.status = 'completed';
    inProgressRequest.completedAt = new Date();
    inProgressRequest.completedBy = completedBy;
    inProgressRequest.cost = cost;
    inProgressRequest.notes = notes;
  }

  this.maintenanceStatus = 'good';
  this.lastMaintenance = new Date();
  this.maintenanceNotes = notes;

  // If room is clean, make it available
  if (this.cleaningStatus === 'clean') {
    this.status = 'available';
  } else {
    this.status = 'cleaning';
  }

  return this.save();
};

// Method to check if room is available for booking
roomSchema.methods.isAvailableForBooking = function() {
  return this.status === 'available' &&
         this.cleaningStatus === 'clean' &&
         this.maintenanceStatus === 'good' &&
         this.isActive;
};

// Virtual for pending cleaning requests count
roomSchema.virtual('pendingCleaningRequests').get(function() {
  return this.cleaningRequests.filter(req => req.status === 'pending').length;
});

// Virtual for pending maintenance requests count
roomSchema.virtual('pendingMaintenanceRequests').get(function() {
  return this.maintenanceRequests.filter(req => req.status === 'pending').length;
});

// Ensure room number is unique within a hotel
roomSchema.index({ hotelId: 1, number: 1 }, { unique: true });

// Create other indexes
roomSchema.index({ hotelId: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ isActive: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
