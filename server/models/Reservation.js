import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },

  // Guest Information
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },

  // Room Information
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

  // Reservation Details
  reservationNumber: {
    type: String,
    unique: true
    // removed required: true - will be generated automatically
  },

  // Dates
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  actualCheckInDate: Date,
  actualCheckOutDate: Date,

  // Guest Count
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  infants: {
    type: Number,
    default: 0,
    min: 0
  },

  // Pricing
  roomRate: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // Additional Charges
  additionalCharges: [{
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }],

  // Discounts
  discounts: [{
    description: String,
    amount: Number,
    percentage: Number,
    date: { type: Date, default: Date.now }
  }],

  // Status
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'checked_in',
      'checked_out',
      'cancelled',
      'no_show'
    ],
    default: 'pending'
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'online']
  },

  // Booking Source
  source: {
    type: String,
    enum: ['direct', 'phone', 'email', 'walk_in', 'booking_com', 'expedia', 'other'],
    default: 'direct'
  },

  // Special Requests
  specialRequests: [String],
  notes: String,

  // Confirmation
  confirmationSent: {
    type: Boolean,
    default: false
  },
  confirmationSentAt: Date,

  // Cancellation
  cancellationReason: String,
  cancellationDate: Date,
  cancellationFee: {
    type: Number,
    default: 0
  },

  // Check-in/Check-out
  checkInNotes: String,
  checkOutNotes: String,
  earlyCheckIn: {
    type: Boolean,
    default: false
  },
  lateCheckOut: {
    type: Boolean,
    default: false
  },

  // Additional Services
  services: [{
    name: String,
    description: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    date: { type: Date, default: Date.now }
  }],

  // Reviews and Feedback
  guestRating: {
    type: Number,
    min: 1,
    max: 5
  },
  guestReview: String,
  reviewDate: Date,

  // Staff Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Calculate total nights
reservationSchema.virtual('totalNights').get(function() {
  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Calculate remaining balance
reservationSchema.virtual('remainingBalance').get(function() {
  return this.totalAmount - this.paidAmount;
});

// Check if reservation is fully paid
reservationSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.totalAmount;
});

// Method to check in guest
reservationSchema.methods.checkIn = function(checkedInBy, notes = '') {
  this.status = 'checked_in';
  this.actualCheckInDate = new Date();
  this.checkedInBy = checkedInBy;
  this.checkInNotes = notes;

  return this.save();
};

// Method to check out guest
reservationSchema.methods.checkOut = function(checkedOutBy, notes = '') {
  this.status = 'checked_out';
  this.actualCheckOutDate = new Date();
  this.checkedOutBy = checkedOutBy;
  this.checkOutNotes = notes;

  return this.save();
};

// Method to cancel reservation
reservationSchema.methods.cancel = function(reason, cancellationFee = 0) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancellationDate = new Date();
  this.cancellationFee = cancellationFee;

  return this.save();
};

// Method to add payment
reservationSchema.methods.addPayment = function(amount, method, transactionId = '', paidBy, notes = '') {
  this.paidAmount += amount;

  // Update payment status
  if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = 'paid';
  } else if (this.paidAmount > 0) {
    this.paymentStatus = 'partial';
  }

  // Add to services array for tracking
  this.services.push({
    name: 'Payment',
    description: `Payment via ${method}`,
    price: amount,
    quantity: 1,
    date: new Date()
  });

  return this.save();
};

// Method to add service charge
reservationSchema.methods.addServiceCharge = function(name, description, price, quantity = 1) {
  this.services.push({
    name,
    description,
    price,
    quantity,
    date: new Date()
  });

  // Update total amount
  this.totalAmount += (price * quantity);

  return this.save();
};

// Method to apply discount
reservationSchema.methods.applyDiscount = function(description, amount, percentage = 0) {
  this.discounts.push({
    description,
    amount,
    percentage,
    date: new Date()
  });

  // Update total amount
  this.totalAmount -= amount;

  return this.save();
};

// Method to check if guest can check in
reservationSchema.methods.canCheckIn = function() {
  const today = new Date();
  const checkInDate = new Date(this.checkInDate);

  return this.status === 'confirmed' &&
         checkInDate <= today &&
         this.paymentStatus !== 'pending';
};

// Method to check if guest can check out
reservationSchema.methods.canCheckOut = function() {
  return this.status === 'checked_in';
};

// Pre-save hook for reservation number generation and updatedAt
reservationSchema.pre('save', async function(next) {
  try {
    // Update the updatedAt field
    this.updatedAt = new Date();

    // Generate reservation number for new reservations
    if (this.isNew && !this.reservationNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      // Find the last reservation for today
      const lastReservation = await this.constructor.findOne({
        reservationNumber: new RegExp(`^${year}${month}${day}`)
      }).sort({ reservationNumber: -1 });

      let sequence = 1;
      if (lastReservation && lastReservation.reservationNumber) {
        const lastSequence = parseInt(lastReservation.reservationNumber.slice(-4));
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }

      this.reservationNumber = `${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
      console.log('Generated reservation number:', this.reservationNumber);
    }
    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    next(error);
  }
});

// Create indexes
reservationSchema.index({ hotelId: 1 });
reservationSchema.index({ guestId: 1 });
reservationSchema.index({ roomId: 1 });
reservationSchema.index({ reservationNumber: 1 });
reservationSchema.index({ checkInDate: 1, checkOutDate: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ paymentStatus: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
