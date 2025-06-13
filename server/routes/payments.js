import express from 'express';
import Payment from '../models/Payment.js';
import Reservation from '../models/Reservation.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all payments for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      paymentMethod, 
      startDate, 
      endDate, 
      reservationId,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId };
    
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (reservationId) filter.reservationId = reservationId;
    
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      Payment.find(filter)
        .populate('reservationId', 'reservationNumber checkInDate checkOutDate totalAmount')
        .populate('reservationId.guestId', 'firstName lastName email')
        .populate('processedBy', 'fullName')
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payment.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + payments.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    })
    .populate('reservationId')
    .populate('reservationId.guestId')
    .populate('processedBy', 'fullName')
    .populate('approvedBy', 'fullName')
    .populate('refund.refundedBy', 'fullName')
    .populate('auditLog.userId', 'fullName');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create new payment
router.post('/', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const {
      reservationId,
      amount,
      paymentMethod,
      transactionId,
      reference,
      cardDetails,
      bankDetails,
      description,
      notes
    } = req.body;

    // Validate required fields
    if (!reservationId || !amount || !paymentMethod) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['reservationId', 'amount', 'paymentMethod']
      });
    }

    // Verify reservation exists and belongs to hotel
    const reservation = await Reservation.findOne({
      _id: reservationId,
      hotelId: req.user.hotelId._id
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if payment amount is valid
    const totalPaid = await Payment.aggregate([
      {
        $match: {
          reservationId: reservation._id,
          status: { $in: ['completed', 'pending'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$amount' }
        }
      }
    ]);

    const currentPaid = totalPaid.length > 0 ? totalPaid[0].totalPaid : 0;
    const remainingAmount = reservation.totalAmount - currentPaid;

    if (amount > remainingAmount) {
      return res.status(400).json({ 
        error: 'Payment amount exceeds remaining balance',
        remainingAmount,
        requestedAmount: amount
      });
    }

    // Create payment
    const payment = new Payment({
      hotelId: req.user.hotelId._id,
      reservationId,
      amount,
      paymentMethod,
      transactionId,
      reference,
      cardDetails,
      bankDetails,
      description,
      notes,
      processedBy: req.user._id,
      currency: req.hotel.settings.currency || 'USD',
      status: 'completed' // Default to completed for manual payments
    });

    await payment.save();

    // Update reservation payment status
    const newTotalPaid = currentPaid + amount;
    if (newTotalPaid >= reservation.totalAmount) {
      reservation.paymentStatus = 'paid';
    } else {
      reservation.paymentStatus = 'partial';
    }
    reservation.paidAmount = newTotalPaid;
    await reservation.save();

    // Populate the created payment
    const populatedPayment = await Payment.findById(payment._id)
      .populate('reservationId', 'reservationNumber')
      .populate('processedBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: populatedPayment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Update payment
router.put('/:id', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      transactionId,
      reference,
      description,
      notes,
      status
    } = req.body;

    // Find payment
    const payment = await Payment.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if payment can be modified
    if (payment.status === 'refunded') {
      return res.status(400).json({ 
        error: 'Cannot modify refunded payment'
      });
    }

    // Store old values for audit
    const oldAmount = payment.amount;
    const oldStatus = payment.status;

    // Update payment
    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (transactionId !== undefined) updateData.transactionId = transactionId;
    if (reference !== undefined) updateData.reference = reference;
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    // Add audit log entry
    if (amount !== undefined && amount !== oldAmount) {
      payment.addAuditLog(
        'amount_updated',
        req.user._id,
        `Amount changed from ${oldAmount} to ${amount}`,
        oldAmount.toString(),
        amount.toString()
      );
    }

    if (status && status !== oldStatus) {
      payment.addAuditLog(
        'status_updated',
        req.user._id,
        `Status changed from ${oldStatus} to ${status}`,
        oldStatus,
        status
      );
    }

    Object.assign(payment, updateData);
    payment.updatedBy = req.user._id;
    await payment.save();

    // Update reservation payment status if amount changed
    if (amount !== undefined && amount !== oldAmount) {
      const reservation = await Reservation.findById(payment.reservationId);
      const totalPaid = await Payment.aggregate([
        {
          $match: {
            reservationId: reservation._id,
            status: { $in: ['completed', 'pending'] }
          }
        },
        {
          $group: {
            _id: null,
            totalPaid: { $sum: '$amount' }
          }
        }
      ]);

      const newTotalPaid = totalPaid.length > 0 ? totalPaid[0].totalPaid : 0;
      if (newTotalPaid >= reservation.totalAmount) {
        reservation.paymentStatus = 'paid';
      } else if (newTotalPaid > 0) {
        reservation.paymentStatus = 'partial';
      } else {
        reservation.paymentStatus = 'pending';
      }
      reservation.paidAmount = newTotalPaid;
      await reservation.save();
    }

    const updatedPayment = await Payment.findById(payment._id)
      .populate('reservationId', 'reservationNumber')
      .populate('processedBy', 'fullName');

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Process refund
router.post('/:id/refund', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || !reason) {
      return res.status(400).json({
        error: 'Refund amount and reason are required'
      });
    }

    const payment = await Payment.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if refund is possible
    const availableForRefund = payment.amount - (payment.refund.amount || 0);
    if (amount > availableForRefund) {
      return res.status(400).json({
        error: 'Refund amount exceeds available amount',
        availableForRefund,
        requestedAmount: amount
      });
    }

    // Process refund
    payment.processRefund(amount, reason, req.user._id);
    await payment.save();

    // Update reservation payment status
    const reservation = await Reservation.findById(payment.reservationId);
    const totalPaid = await Payment.aggregate([
      {
        $match: {
          reservationId: reservation._id,
          status: { $in: ['completed', 'partial_refund'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: { $subtract: ['$amount', { $ifNull: ['$refund.amount', 0] }] } }
        }
      }
    ]);

    const newTotalPaid = totalPaid.length > 0 ? totalPaid[0].totalPaid : 0;
    if (newTotalPaid >= reservation.totalAmount) {
      reservation.paymentStatus = 'paid';
    } else if (newTotalPaid > 0) {
      reservation.paymentStatus = 'partial';
    } else {
      reservation.paymentStatus = 'pending';
    }
    reservation.paidAmount = newTotalPaid;
    await reservation.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        paymentId: payment._id,
        refundAmount: amount,
        totalRefunded: payment.refund.amount,
        newStatus: payment.status
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// Get payment statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.paymentDate = {};
      if (startDate) dateFilter.paymentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.paymentDate.$lte = new Date(endDate);
    }

    const [
      totalPayments,
      paymentsByMethod,
      paymentsByStatus,
      revenueStats
    ] = await Promise.all([
      // Total payments count
      Payment.countDocuments({ hotelId, ...dateFilter }),
      
      // Payments by method
      Payment.aggregate([
        { $match: { hotelId, ...dateFilter } },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      
      // Payments by status
      Payment.aggregate([
        { $match: { hotelId, ...dateFilter } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      
      // Revenue statistics
      Payment.aggregate([
        { $match: { hotelId, status: 'completed', ...dateFilter } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            averagePayment: { $avg: '$amount' },
            totalRefunds: { $sum: '$refund.amount' }
          }
        }
      ])
    ]);

    const revenue = revenueStats.length > 0 ? revenueStats[0] : {
      totalRevenue: 0,
      averagePayment: 0,
      totalRefunds: 0
    };

    res.json({
      success: true,
      data: {
        totalPayments,
        paymentsByMethod,
        paymentsByStatus,
        revenue: {
          total: revenue.totalRevenue,
          average: Math.round(revenue.averagePayment * 100) / 100,
          refunds: revenue.totalRefunds || 0,
          net: revenue.totalRevenue - (revenue.totalRefunds || 0)
        }
      }
    });
  } catch (error) {
    console.error('Get payment statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch payment statistics' });
  }
});

export default router;
