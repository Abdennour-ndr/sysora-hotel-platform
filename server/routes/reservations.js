import express from 'express';
import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';
import Guest from '../models/Guest.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all reservations for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      checkInDate,
      checkOutDate,
      roomId,
      guestId,
      page = 1,
      limit = 20
    } = req.query;

    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId };

    if (status) filter.status = status;
    if (roomId) filter.roomId = roomId;
    if (guestId) filter.guestId = guestId;

    if (checkInDate || checkOutDate) {
      filter.checkInDate = {};
      if (checkInDate) filter.checkInDate.$gte = new Date(checkInDate);
      if (checkOutDate) filter.checkInDate.$lte = new Date(checkOutDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reservations with pagination
    const [reservations, totalCount] = await Promise.all([
      Reservation.find(filter)
        .populate('guestId', 'firstName lastName email phone')
        .populate('roomId', 'number type basePrice')
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Reservation.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        reservations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + reservations.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Get reservation by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    })
    .populate('guestId')
    .populate('roomId')
    .populate('createdBy', 'fullName')
    .populate('checkedInBy', 'fullName')
    .populate('checkedOutBy', 'fullName');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// Create new reservation
router.post('/', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const {
      guestId,
      roomId,
      checkInDate,
      checkOutDate,
      adults,
      children = 0,
      infants = 0,
      roomRate,
      specialRequests = [],
      notes,
      source = 'direct',
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!guestId || !roomId || !checkInDate || !checkOutDate || !adults || !roomRate) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['guestId', 'roomId', 'checkInDate', 'checkOutDate', 'adults', 'roomRate']
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Allow check-in from today onwards (final fix for timezone)
    const now = new Date();

    // Get date strings for comparison (YYYY-MM-DD format)
    const todayStr = now.toISOString().split('T')[0];
    const checkInStr = checkIn.toISOString().split('T')[0];

    console.log('Date validation (final fix):', {
      now: now.toISOString(),
      todayStr,
      checkIn: checkIn.toISOString(),
      checkInStr,
      comparison: checkInStr < todayStr
    });

    if (checkInStr < todayStr) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }

    // Verify guest exists and belongs to hotel
    const guest = await Guest.findOne({
      _id: guestId,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Check if guest is blacklisted
    if (guest.isBlacklisted) {
      return res.status(400).json({
        error: 'Cannot create reservation for blacklisted guest',
        reason: guest.blacklistReason
      });
    }

    // Verify room exists and belongs to hotel
    const room = await Room.findOne({
      _id: roomId,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check room capacity
    const totalGuests = adults + children + infants;
    if (totalGuests > room.maxOccupancy) {
      return res.status(400).json({
        error: 'Guest count exceeds room capacity',
        maxOccupancy: room.maxOccupancy,
        requestedGuests: totalGuests
      });
    }

    // Check room availability
    const overlappingReservations = await Reservation.countDocuments({
      roomId,
      status: { $in: ['confirmed', 'checked_in'] },
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn }
        }
      ]
    });

    if (overlappingReservations > 0) {
      return res.status(409).json({ error: 'Room is not available for the selected dates' });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = roomRate * nights;

    // Create reservation
    console.log('Creating reservation with data:', {
      hotelId: req.user.hotelId._id,
      guestId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children,
      infants,
      roomRate,
      totalAmount,
      specialRequests,
      notes,
      source,
      paymentMethod,
      createdBy: req.user._id,
      currency: req.user.hotelId.settings?.currency || 'DZD'
    });

    const reservation = new Reservation({
      hotelId: req.user.hotelId._id,
      guestId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children,
      infants,
      roomRate,
      totalAmount,
      specialRequests,
      notes,
      source,
      paymentMethod,
      createdBy: req.user._id,
      currency: req.user.hotelId.settings?.currency || 'DZD'
    });

    console.log('Reservation before save:', {
      reservationNumber: reservation.reservationNumber,
      isNew: reservation.isNew
    });

    await reservation.save();

    console.log('Reservation after save:', {
      reservationNumber: reservation.reservationNumber,
      _id: reservation._id
    });

    // Update guest stats
    guest.totalStays += 1;
    guest.lastStayDate = checkIn;
    await guest.save();

    // Populate the created reservation
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'number type')
      .populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: populatedReservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Send more detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
        message: 'Please check the required fields'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate reservation number',
        message: 'A reservation with this number already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to create reservation',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update reservation
router.put('/:id', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      adults,
      children,
      infants,
      roomRate,
      specialRequests,
      notes,
      paymentMethod
    } = req.body;

    // Find reservation
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    }).populate('roomId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if reservation can be modified
    if (reservation.status === 'checked_out' || reservation.status === 'cancelled') {
      return res.status(400).json({
        error: 'Cannot modify completed or cancelled reservation',
        status: reservation.status
      });
    }

    // Validate dates if provided
    if (checkInDate || checkOutDate) {
      const newCheckIn = checkInDate ? new Date(checkInDate) : reservation.checkInDate;
      const newCheckOut = checkOutDate ? new Date(checkOutDate) : reservation.checkOutDate;

      if (newCheckIn >= newCheckOut) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date' });
      }

      // Check room availability for new dates (excluding current reservation)
      if (checkInDate || checkOutDate) {
        const overlappingReservations = await Reservation.countDocuments({
          roomId: reservation.roomId._id,
          _id: { $ne: req.params.id },
          status: { $in: ['confirmed', 'checked_in'] },
          $or: [
            {
              checkInDate: { $lte: newCheckOut },
              checkOutDate: { $gte: newCheckIn }
            }
          ]
        });

        if (overlappingReservations > 0) {
          return res.status(409).json({ error: 'Room is not available for the new dates' });
        }
      }
    }

    // Check room capacity if guest count changed
    if (adults || children || infants) {
      const newAdults = adults || reservation.adults;
      const newChildren = children || reservation.children;
      const newInfants = infants || reservation.infants;
      const totalGuests = newAdults + newChildren + newInfants;

      if (totalGuests > reservation.roomId.maxOccupancy) {
        return res.status(400).json({
          error: 'Guest count exceeds room capacity',
          maxOccupancy: reservation.roomId.maxOccupancy,
          requestedGuests: totalGuests
        });
      }
    }

    // Update reservation
    const updateData = {};
    if (checkInDate) updateData.checkInDate = new Date(checkInDate);
    if (checkOutDate) updateData.checkOutDate = new Date(checkOutDate);
    if (adults) updateData.adults = adults;
    if (children !== undefined) updateData.children = children;
    if (infants !== undefined) updateData.infants = infants;
    if (roomRate) updateData.roomRate = roomRate;
    if (specialRequests) updateData.specialRequests = specialRequests;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    // Recalculate total amount if dates or rate changed
    if (checkInDate || checkOutDate || roomRate) {
      const newCheckIn = updateData.checkInDate || reservation.checkInDate;
      const newCheckOut = updateData.checkOutDate || reservation.checkOutDate;
      const newRate = updateData.roomRate || reservation.roomRate;
      const nights = Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24));
      updateData.totalAmount = newRate * nights;
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('guestId', 'firstName lastName email phone')
    .populate('roomId', 'number type')
    .populate('createdBy', 'fullName');

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updatedReservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Update reservation status
router.put('/:id/status', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    }).populate('roomId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update reservation status
    reservation.status = status;
    if (notes) {
      if (status === 'checked_in') {
        reservation.checkInNotes = notes;
        reservation.actualCheckInDate = new Date();
        reservation.checkedInBy = req.user._id;
        // Update room status to occupied
        await Room.findByIdAndUpdate(reservation.roomId._id, { status: 'occupied' });
      } else if (status === 'checked_out') {
        reservation.checkOutNotes = notes;
        reservation.actualCheckOutDate = new Date();
        reservation.checkedOutBy = req.user._id;
        // Update room status to cleaning
        await Room.findByIdAndUpdate(reservation.roomId._id, { status: 'cleaning' });
      } else if (status === 'cancelled') {
        reservation.cancellationReason = notes;
        reservation.cancellationDate = new Date();
      }
    }

    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: {
        id: reservation._id,
        reservationNumber: reservation.reservationNumber,
        status: reservation.status,
        actualCheckInDate: reservation.actualCheckInDate,
        actualCheckOutDate: reservation.actualCheckOutDate
      }
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
});

// Check-in guest
router.post('/:id/checkin', authenticateToken, requirePermission('check_in_out'), async (req, res) => {
  try {
    const { notes = '' } = req.body;

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    }).populate('roomId').populate('guestId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if guest can check in
    if (!reservation.canCheckIn()) {
      return res.status(400).json({
        error: 'Guest cannot check in',
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        checkInDate: reservation.checkInDate
      });
    }

    // Perform check-in
    await reservation.checkIn(req.user._id, notes);

    // Update room status
    const room = await Room.findById(reservation.roomId._id);
    room.status = 'occupied';
    await room.save();

    res.json({
      success: true,
      message: 'Guest checked in successfully',
      data: {
        reservationNumber: reservation.reservationNumber,
        guestName: `${reservation.guestId.firstName} ${reservation.guestId.lastName}`,
        roomNumber: reservation.roomId.number,
        checkInTime: reservation.actualCheckInDate,
        status: reservation.status
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to check in guest' });
  }
});

// Check-out guest
router.post('/:id/checkout', authenticateToken, requirePermission('check_in_out'), async (req, res) => {
  try {
    const { notes = '', additionalCharges = [] } = req.body;

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    }).populate('roomId').populate('guestId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if guest can check out
    if (!reservation.canCheckOut()) {
      return res.status(400).json({
        error: 'Guest cannot check out',
        status: reservation.status
      });
    }

    // Add any additional charges
    for (const charge of additionalCharges) {
      await reservation.addServiceCharge(charge.name, charge.description, charge.price, charge.quantity);
    }

    // Perform check-out
    await reservation.checkOut(req.user._id, notes);

    // Update room status to cleaning
    const room = await Room.findById(reservation.roomId._id);
    room.status = 'cleaning';
    room.cleaningStatus = 'dirty';
    await room.save();

    // Request cleaning automatically
    await room.requestCleaning(req.user._id, 'normal', 'Post check-out cleaning');

    res.json({
      success: true,
      message: 'Guest checked out successfully',
      data: {
        reservationNumber: reservation.reservationNumber,
        guestName: `${reservation.guestId.firstName} ${reservation.guestId.lastName}`,
        roomNumber: reservation.roomId.number,
        checkOutTime: reservation.actualCheckOutDate,
        totalAmount: reservation.totalAmount,
        remainingBalance: reservation.remainingBalance,
        status: reservation.status
      }
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Failed to check out guest' });
  }
});

// Add payment to reservation
router.post('/:id/payments', authenticateToken, requirePermission('manage_payments'), async (req, res) => {
  try {
    const { amount, method, transactionId = '', notes = '' } = req.body;

    if (!amount || !method) {
      return res.status(400).json({
        error: 'Amount and payment method are required'
      });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if payment amount is valid
    if (amount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be positive' });
    }

    if (amount > reservation.remainingBalance) {
      return res.status(400).json({
        error: 'Payment amount exceeds remaining balance',
        remainingBalance: reservation.remainingBalance
      });
    }

    // Add payment
    await reservation.addPayment(amount, method, transactionId, req.user._id, notes);

    // Create payment record
    const Payment = (await import('../models/Payment.js')).default;
    const payment = new Payment({
      hotelId: req.user.hotelId._id,
      reservationId: reservation._id,
      guestId: reservation.guestId,
      amount,
      paymentMethod: method,
      transactionId,
      status: 'completed',
      processedBy: req.user._id,
      notes
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Payment added successfully',
      data: {
        paymentId: payment._id,
        reservationNumber: reservation.reservationNumber,
        amount,
        method,
        remainingBalance: reservation.remainingBalance,
        paymentStatus: reservation.paymentStatus
      }
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Failed to add payment' });
  }
});

// Cancel reservation
router.post('/:id/cancel', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const { reason, cancellationFee = 0 } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Cancellation reason is required' });
    }

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    }).populate('roomId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Reservation is already cancelled' });
    }

    if (reservation.status === 'checked_out') {
      return res.status(400).json({ error: 'Cannot cancel completed reservation' });
    }

    // Cancel reservation
    await reservation.cancel(reason, cancellationFee);

    // Free up the room if it was occupied
    if (reservation.status === 'checked_in') {
      const room = await Room.findById(reservation.roomId._id);
      room.status = 'cleaning';
      room.cleaningStatus = 'dirty';
      await room.save();
    }

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: {
        reservationNumber: reservation.reservationNumber,
        status: reservation.status,
        cancellationReason: reservation.cancellationReason,
        cancellationFee: reservation.cancellationFee,
        cancellationDate: reservation.cancellationDate
      }
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

// Get reservation statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.checkInDate = {};
      if (startDate) dateFilter.checkInDate.$gte = new Date(startDate);
      if (endDate) dateFilter.checkInDate.$lte = new Date(endDate);
    }

    // Get reservation statistics
    const stats = await Reservation.aggregate([
      {
        $match: {
          hotelId: hotelId,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    // Get today's check-ins and check-outs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayCheckIns, todayCheckOuts, currentOccupancy] = await Promise.all([
      Reservation.countDocuments({
        hotelId,
        checkInDate: { $gte: today, $lt: tomorrow },
        status: { $in: ['confirmed', 'checked_in'] }
      }),
      Reservation.countDocuments({
        hotelId,
        checkOutDate: { $gte: today, $lt: tomorrow },
        status: 'checked_in'
      }),
      Reservation.countDocuments({
        hotelId,
        status: 'checked_in'
      })
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            revenue: stat.totalRevenue,
            paid: stat.totalPaid
          };
          return acc;
        }, {}),
        todayCheckIns,
        todayCheckOuts,
        currentOccupancy,
        totalStats: stats.reduce((acc, stat) => {
          acc.totalReservations += stat.count;
          acc.totalRevenue += stat.totalRevenue;
          acc.totalPaid += stat.totalPaid;
          return acc;
        }, { totalReservations: 0, totalRevenue: 0, totalPaid: 0 })
      }
    });
  } catch (error) {
    console.error('Get reservation stats error:', error);
    res.status(500).json({ error: 'Failed to get reservation statistics' });
  }
});

export default router;
