import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  // Reservation Association
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  
  // Payment Details
  paymentNumber: {
    type: String,
    unique: true
    // removed required: true - will be generated automatically
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'online', 'check', 'mobile_payment']
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  
  // Transaction Details
  transactionId: {
    type: String, // External transaction ID from payment gateway
    sparse: true
  },
  
  reference: {
    type: String, // Internal reference or receipt number
    sparse: true
  },
  
  // Card Details (if applicable)
  cardDetails: {
    lastFourDigits: String,
    cardType: String, // visa, mastercard, amex, etc.
    cardHolderName: String
  },
  
  // Bank Transfer Details (if applicable)
  bankDetails: {
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    transferReference: String
  },
  
  // Payment Gateway Details
  gateway: {
    provider: String, // stripe, paypal, square, etc.
    gatewayTransactionId: String,
    gatewayResponse: {
      type: Map,
      of: String
    }
  },
  
  // Dates
  paymentDate: {
    type: Date,
    default: Date.now
  },
  
  dueDate: {
    type: Date
  },
  
  processedAt: {
    type: Date
  },
  
  // Refund Information
  refund: {
    amount: {
      type: Number,
      default: 0
    },
    reason: String,
    refundDate: Date,
    refundTransactionId: String,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Additional Information
  description: String,
  notes: String,
  
  // Receipt Information
  receipt: {
    number: String,
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: Date
  },
  
  // Tax Information
  tax: {
    amount: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    },
    taxId: String
  },
  
  // Fees
  fees: {
    processingFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    otherFees: {
      type: Number,
      default: 0
    }
  },
  
  // Staff Information
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Audit Trail
  auditLog: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: String,
    oldValue: String,
    newValue: String
  }],
  
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

// Update the updatedAt field and generate payment number before saving
paymentSchema.pre('save', async function(next) {
  try {
    // Update the updatedAt field
    this.updatedAt = new Date();

    // Generate payment number for new payments
    if (this.isNew && !this.paymentNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      // Find the last payment for today
      const lastPayment = await this.constructor.findOne({
        paymentNumber: new RegExp(`^PAY${year}${month}${day}`)
      }).sort({ paymentNumber: -1 });

      let sequence = 1;
      if (lastPayment && lastPayment.paymentNumber) {
        const lastSequence = parseInt(lastPayment.paymentNumber.slice(-4));
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }

      this.paymentNumber = `PAY${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
      console.log('Generated payment number:', this.paymentNumber);
    }
    next();
  } catch (error) {
    console.error('Error in payment pre-save hook:', error);
    next(error);
  }
});

// Virtual for net amount (amount - fees)
paymentSchema.virtual('netAmount').get(function() {
  const totalFees = (this.fees.processingFee || 0) + 
                   (this.fees.serviceFee || 0) + 
                   (this.fees.otherFees || 0);
  return this.amount - totalFees;
});

// Virtual for total amount including tax
paymentSchema.virtual('totalAmount').get(function() {
  return this.amount + (this.tax.amount || 0);
});

// Virtual for refunded amount
paymentSchema.virtual('refundedAmount').get(function() {
  return this.refund.amount || 0;
});

// Method to add audit log entry
paymentSchema.methods.addAuditLog = function(action, userId, details, oldValue = null, newValue = null) {
  this.auditLog.push({
    action,
    userId,
    details,
    oldValue,
    newValue,
    timestamp: new Date()
  });
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, userId) {
  if (amount > this.amount - this.refundedAmount) {
    throw new Error('Refund amount exceeds available amount');
  }
  
  this.refund.amount = (this.refund.amount || 0) + amount;
  this.refund.reason = reason;
  this.refund.refundDate = new Date();
  this.refund.refundedBy = userId;
  
  if (this.refund.amount >= this.amount) {
    this.status = 'refunded';
  } else {
    this.status = 'partial_refund';
  }
  
  this.addAuditLog('refund_processed', userId, `Refund of ${amount} processed. Reason: ${reason}`);
};

// Create indexes
paymentSchema.index({ hotelId: 1 });
paymentSchema.index({ reservationId: 1 });
paymentSchema.index({ paymentNumber: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
