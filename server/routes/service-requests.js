import express from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import Service from '../models/Service.js';
import Reservation from '../models/Reservation.js';
import Guest from '../models/Guest.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all service requests for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      priority,
      serviceId,
      guestId,
      assignedStaff,
      startDate, 
      endDate,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (serviceId) filter.serviceId = serviceId;
    if (guestId) filter.guestId = guestId;
    if (assignedStaff) filter['assignedStaff.userId'] = assignedStaff;
    
    if (startDate || endDate) {
      filter.requestedDateTime = {};
      if (startDate) filter.requestedDateTime.$gte = new Date(startDate);
      if (endDate) filter.requestedDateTime.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get service requests with pagination
    const [requests, totalCount] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('serviceId', 'name category pricing')
        .populate('guestId', 'firstName lastName email phone')
        .populate('reservationId', 'reservationNumber')
        .populate('roomId', 'number type')
        .populate('assignedStaff.userId', 'fullName')
        .populate('createdBy', 'fullName')
        .sort({ requestedDateTime: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ServiceRequest.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + requests.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// Get service request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    })
    .populate('serviceId')
    .populate('guestId')
    .populate('reservationId')
    .populate('roomId')
    .populate('assignedStaff.userId', 'fullName role')
    .populate('createdBy', 'fullName')
    .populate('updatedBy', 'fullName')
    .populate('statusHistory.userId', 'fullName')
    .populate('issues.reportedBy', 'fullName')
    .populate('issues.resolvedBy', 'fullName');

    if (!request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

// Create new service request
router.post('/', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const {
      serviceId,
      guestId,
      reservationId,
      roomId,
      quantity = 1,
      duration,
      selectedOptions = [],
      requestedDateTime,
      guestNotes,
      specialRequests = [],
      guestContact,
      priority = 'normal'
    } = req.body;

    // Validate required fields
    if (!serviceId || !guestId || !requestedDateTime) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['serviceId', 'guestId', 'requestedDateTime']
      });
    }

    // Verify service exists and belongs to hotel
    const service = await Service.findOne({
      _id: serviceId,
      hotelId: req.user.hotelId._id,
      'availability.isActive': true
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found or not available' });
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

    // Verify reservation if provided
    let reservation = null;
    if (reservationId) {
      reservation = await Reservation.findOne({
        _id: reservationId,
        hotelId: req.user.hotelId._id,
        guestId: guestId
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found or does not belong to guest' });
      }
    }

    // Check service availability
    const requestDateTime = new Date(requestedDateTime);
    if (!service.isAvailableAt(requestDateTime)) {
      return res.status(400).json({ error: 'Service is not available at the requested time' });
    }

    // Calculate pricing
    const basePrice = service.pricing.basePrice;
    let optionsPrice = 0;
    const validatedOptions = [];

    for (const optionId of selectedOptions) {
      const option = service.options.id(optionId);
      if (option) {
        optionsPrice += option.additionalPrice;
        validatedOptions.push({
          optionId: option._id,
          name: option.name,
          additionalPrice: option.additionalPrice
        });
      }
    }

    const totalPrice = service.calculatePrice(quantity, duration, selectedOptions);

    // Create service request
    const serviceRequest = new ServiceRequest({
      hotelId: req.user.hotelId._id,
      serviceId,
      guestId,
      reservationId,
      roomId,
      quantity,
      duration: duration || service.estimatedDuration,
      selectedOptions: validatedOptions,
      requestedDateTime: requestDateTime,
      basePrice,
      optionsPrice,
      totalPrice,
      currency: service.pricing.currency,
      guestNotes,
      specialRequests,
      guestContact,
      priority,
      createdBy: req.user._id
    });

    await serviceRequest.save();

    // Update service statistics
    service.stats.totalBookings += 1;
    service.stats.lastBooked = new Date();
    await service.save();

    // Populate the created request
    const populatedRequest = await ServiceRequest.findById(serviceRequest._id)
      .populate('serviceId', 'name category')
      .populate('guestId', 'firstName lastName email')
      .populate('reservationId', 'reservationNumber')
      .populate('roomId', 'number')
      .populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Create service request error:', error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// Update service request status
router.put('/:id/status', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const { status, notes = '' } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses
      });
    }

    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Update status using the method that handles history
    serviceRequest.updateStatus(status, req.user._id, notes);
    
    // Add specific notes based on status
    if (status === 'completed' && notes) {
      serviceRequest.completionNotes = notes;
    } else if (status === 'cancelled' && notes) {
      serviceRequest.cancellation.reason = notes;
    } else if (status === 'in_progress' && notes) {
      serviceRequest.serviceNotes = notes;
    }

    await serviceRequest.save();

    res.json({
      success: true,
      message: 'Service request status updated successfully',
      data: {
        id: serviceRequest._id,
        requestNumber: serviceRequest.requestNumber,
        status: serviceRequest.status,
        actualStartTime: serviceRequest.actualStartTime,
        actualCompletionTime: serviceRequest.actualCompletionTime
      }
    });
  } catch (error) {
    console.error('Update service request status error:', error);
    res.status(500).json({ error: 'Failed to update service request status' });
  }
});

// Assign staff to service request
router.put('/:id/assign-staff', authenticateToken, requirePermission('manage_reservations'), async (req, res) => {
  try {
    const { staffId, role, isPrimary = false } = req.body;

    if (!staffId) {
      return res.status(400).json({ error: 'Staff ID is required' });
    }

    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Verify staff belongs to hotel
    const User = (await import('../models/User.js')).default;
    const staff = await User.findOne({
      _id: staffId,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Assign staff using the method
    serviceRequest.assignStaff(staffId, role || staff.role, isPrimary);
    serviceRequest.updatedBy = req.user._id;
    await serviceRequest.save();

    const updatedRequest = await ServiceRequest.findById(serviceRequest._id)
      .populate('assignedStaff.userId', 'fullName role');

    res.json({
      success: true,
      message: 'Staff assigned successfully',
      data: {
        id: serviceRequest._id,
        requestNumber: serviceRequest.requestNumber,
        assignedStaff: updatedRequest.assignedStaff
      }
    });
  } catch (error) {
    console.error('Assign staff error:', error);
    res.status(500).json({ error: 'Failed to assign staff' });
  }
});

// Add guest feedback
router.put('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }

    const serviceRequest = await ServiceRequest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({ error: 'Can only add feedback to completed requests' });
    }

    // Update feedback
    serviceRequest.guestRating = rating;
    serviceRequest.guestFeedback = feedback;
    serviceRequest.feedbackDate = new Date();
    serviceRequest.updatedBy = req.user._id;
    await serviceRequest.save();

    // Update service average rating
    const Service = (await import('../models/Service.js')).default;
    const avgRating = await ServiceRequest.aggregate([
      {
        $match: {
          serviceId: serviceRequest.serviceId,
          guestRating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$guestRating' }
        }
      }
    ]);

    if (avgRating.length > 0) {
      await Service.findByIdAndUpdate(serviceRequest.serviceId, {
        'stats.averageRating': Math.round(avgRating[0].averageRating * 100) / 100
      });
    }

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: {
        id: serviceRequest._id,
        requestNumber: serviceRequest.requestNumber,
        rating: serviceRequest.guestRating,
        feedback: serviceRequest.guestFeedback,
        feedbackDate: serviceRequest.feedbackDate
      }
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// Get service request statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.requestedDateTime = {};
      if (startDate) dateFilter.requestedDateTime.$gte = new Date(startDate);
      if (endDate) dateFilter.requestedDateTime.$lte = new Date(endDate);
    }

    const [
      totalRequests,
      requestsByStatus,
      requestsByService,
      requestsByPriority,
      averageRating
    ] = await Promise.all([
      // Total requests count
      ServiceRequest.countDocuments({ hotelId, ...dateFilter }),
      
      // Requests by status
      ServiceRequest.aggregate([
        { $match: { hotelId, ...dateFilter } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ]),
      
      // Requests by service
      ServiceRequest.aggregate([
        { $match: { hotelId, ...dateFilter } },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $group: {
            _id: '$serviceId',
            serviceName: { $first: { $arrayElemAt: ['$service.name', 0] } },
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Requests by priority
      ServiceRequest.aggregate([
        { $match: { hotelId, ...dateFilter } },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Average rating
      ServiceRequest.aggregate([
        { 
          $match: { 
            hotelId, 
            guestRating: { $exists: true, $ne: null },
            ...dateFilter 
          } 
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$guestRating' },
            totalRatings: { $sum: 1 }
          }
        }
      ])
    ]);

    const rating = averageRating.length > 0 ? averageRating[0] : {
      averageRating: 0,
      totalRatings: 0
    };

    res.json({
      success: true,
      data: {
        totalRequests,
        requestsByStatus,
        requestsByService,
        requestsByPriority,
        averageRating: Math.round(rating.averageRating * 100) / 100,
        totalRatings: rating.totalRatings
      }
    });
  } catch (error) {
    console.error('Get service request statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch service request statistics' });
  }
});

export default router;
