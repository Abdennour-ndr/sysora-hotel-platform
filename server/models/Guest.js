import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
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
  phone: {
    type: String,
    trim: true
  },
  
  // Identification
  idType: {
    type: String,
    enum: ['passport', 'national_id', 'driving_license', 'other']
  },
  idNumber: {
    type: String,
    trim: true
  },
  nationality: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Demographics
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  
  // Guest Preferences
  preferences: {
    roomType: String,
    bedType: String,
    smokingRoom: { type: Boolean, default: false },
    floorPreference: String, // 'high', 'low', 'middle'
    specialRequests: [String]
  },
  
  // Loyalty Program
  loyaltyProgram: {
    memberId: String,
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    points: {
      type: Number,
      default: 0
    },
    joinDate: Date
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Guest History
  totalStays: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastStayDate: Date,
  
  // Special Notes
  notes: String,
  allergies: [String],
  specialNeeds: [String],
  
  // VIP Status
  isVip: {
    type: Boolean,
    default: false
  },
  vipNotes: String,
  
  // Blacklist
  isBlacklisted: {
    type: Boolean,
    default: false
  },
  blacklistReason: String,
  blacklistDate: Date,
  
  // Communication Preferences
  communicationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false }
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
guestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for full name
guestSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure email is unique within a hotel
guestSchema.index({ hotelId: 1, email: 1 }, { unique: true });

// Create other indexes
guestSchema.index({ hotelId: 1 });
guestSchema.index({ firstName: 1, lastName: 1 });
guestSchema.index({ email: 1 });
guestSchema.index({ phone: 1 });
guestSchema.index({ isVip: 1 });
guestSchema.index({ isBlacklisted: 1 });

const Guest = mongoose.model('Guest', guestSchema);

export default Guest;
