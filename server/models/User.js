import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },

  // Role and Permissions
  role: {
    type: String,
    enum: ['owner', 'manager', 'receptionist', 'cleaning_staff', 'maintenance_staff'],
    default: 'receptionist'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_hotel',
      'manage_users',
      'manage_rooms',
      'manage_reservations',
      'manage_guests',
      'manage_payments',
      'manage_services',
      'view_reports',
      'manage_settings',
      'check_in_out',
      'room_cleaning',
      'room_maintenance',
      'view_dashboard'
    ]
  }],

  // Profile Information
  phone: String,
  avatar: String,

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // Security
  lastLogin: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,

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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  // Owner has all permissions
  if (this.role === 'owner') {
    return true;
  }

  return this.permissions.includes(permission);
};

// Method to check if user can access room
userSchema.methods.canAccessRoom = function(roomId) {
  return this.hasPermission('manage_rooms') ||
         this.hasPermission('room_cleaning') ||
         this.hasPermission('room_maintenance');
};

// Method to check if user can manage bookings
userSchema.methods.canManageBookings = function() {
  return this.hasPermission('manage_reservations');
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    switch (this.role) {
      case 'owner':
        this.permissions = [
          'manage_hotel',
          'manage_users',
          'manage_rooms',
          'manage_reservations',
          'manage_guests',
          'manage_payments',
          'manage_services',
          'view_reports',
          'manage_settings',
          'check_in_out',
          'view_dashboard'
        ];
        break;
      case 'manager':
        this.permissions = [
          'manage_rooms',
          'manage_reservations',
          'manage_guests',
          'manage_payments',
          'manage_services',
          'view_reports',
          'check_in_out',
          'view_dashboard'
        ];
        break;
      case 'receptionist':
        this.permissions = [
          'manage_reservations',
          'manage_guests',
          'check_in_out',
          'view_dashboard'
        ];
        break;
      case 'cleaning_staff':
        this.permissions = [
          'room_cleaning',
          'view_dashboard'
        ];
        break;
      case 'maintenance_staff':
        this.permissions = [
          'room_maintenance',
          'view_dashboard'
        ];
        break;
    }
  }
  next();
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ hotelId: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
