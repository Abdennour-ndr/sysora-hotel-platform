import express from 'express';
import Service from '../models/Service.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all services for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, isActive, featured, page = 1, limit = 20 } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId };
    if (category) filter.category = category;
    if (isActive !== undefined) filter['availability.isActive'] = isActive === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get services with pagination
    const [services, totalCount] = await Promise.all([
      Service.find(filter)
        .populate('createdBy', 'fullName')
        .populate('assignedStaff.userId', 'fullName')
        .sort({ popularityScore: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Service.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + services.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    })
    .populate('createdBy', 'fullName')
    .populate('updatedBy', 'fullName')
    .populate('assignedStaff.userId', 'fullName role');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create new service
router.post('/', authenticateToken, requirePermission('manage_services'), async (req, res) => {
  try {
    const {
      name,
      nameAr,
      description,
      descriptionAr,
      category,
      pricing,
      availability,
      options,
      requirements,
      staffRequired,
      assignedStaff,
      location,
      locationDetails,
      estimatedDuration,
      images,
      terms,
      tags
    } = req.body;

    // Validate required fields
    if (!name || !category || !pricing || !pricing.basePrice) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['name', 'category', 'pricing.basePrice']
      });
    }

    // Create service
    const service = new Service({
      hotelId: req.user.hotelId._id,
      name,
      nameAr,
      description,
      descriptionAr,
      category,
      pricing: {
        ...pricing,
        currency: pricing.currency || req.hotel.settings.currency || 'USD'
      },
      availability: availability || {},
      options: options || [],
      requirements: requirements || {},
      staffRequired: staffRequired || 0,
      assignedStaff: assignedStaff || [],
      location,
      locationDetails,
      estimatedDuration: estimatedDuration || 30,
      images: images || [],
      terms: terms || {},
      tags: tags || [],
      createdBy: req.user._id
    });

    await service.save();

    const populatedService = await Service.findById(service._id)
      .populate('createdBy', 'fullName')
      .populate('assignedStaff.userId', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: populatedService
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
router.put('/:id', authenticateToken, requirePermission('manage_services'), async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Update service
    const updateData = { ...req.body };
    delete updateData.hotelId; // Prevent changing hotel association
    updateData.updatedBy = req.user._id;

    Object.assign(service, updateData);
    await service.save();

    const updatedService = await Service.findById(service._id)
      .populate('createdBy', 'fullName')
      .populate('updatedBy', 'fullName')
      .populate('assignedStaff.userId', 'fullName');

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', authenticateToken, requirePermission('manage_services'), async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if service has active requests
    const activeRequests = await ServiceRequest.countDocuments({
      serviceId: req.params.id,
      status: { $in: ['pending', 'confirmed', 'scheduled', 'in_progress'] }
    });

    if (activeRequests > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete service with active requests',
        activeRequests
      });
    }

    // Soft delete by deactivating
    service.availability.isActive = false;
    service.updatedBy = req.user._id;
    await service.save();

    res.json({
      success: true,
      message: 'Service deactivated successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get service requests
router.get('/:id/requests', authenticateToken, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Verify service belongs to hotel
    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Build filter
    const filter = { serviceId: req.params.id };
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.requestedDateTime = {};
      if (startDate) filter.requestedDateTime.$gte = new Date(startDate);
      if (endDate) filter.requestedDateTime.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get service requests
    const [requests, totalCount] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('guestId', 'firstName lastName email phone')
        .populate('reservationId', 'reservationNumber')
        .populate('roomId', 'number')
        .populate('assignedStaff.userId', 'fullName')
        .sort({ requestedDateTime: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ServiceRequest.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        service: {
          id: service._id,
          name: service.name,
          category: service.category
        },
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

// Calculate service price
router.post('/:id/calculate-price', authenticateToken, async (req, res) => {
  try {
    const { quantity = 1, duration, options = [] } = req.body;

    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (!service.availability.isActive) {
      return res.status(400).json({ error: 'Service is not available' });
    }

    try {
      const calculatedPrice = service.calculatePrice(quantity, duration, options);
      
      res.json({
        success: true,
        data: {
          serviceId: service._id,
          serviceName: service.name,
          basePrice: service.pricing.basePrice,
          pricingType: service.pricing.type,
          quantity,
          duration,
          selectedOptions: options,
          calculatedPrice,
          currency: service.pricing.currency
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error('Calculate service price error:', error);
    res.status(500).json({ error: 'Failed to calculate service price' });
  }
});

// Check service availability
router.post('/:id/check-availability', authenticateToken, async (req, res) => {
  try {
    const { dateTime } = req.body;

    if (!dateTime) {
      return res.status(400).json({ error: 'DateTime is required' });
    }

    const service = await Service.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const requestedDateTime = new Date(dateTime);
    const isAvailable = service.isAvailableAt(requestedDateTime);

    // Check for conflicting requests if advance booking is required
    let conflictingRequests = [];
    if (service.availability.advanceBooking.required) {
      const startTime = new Date(requestedDateTime.getTime() - (service.estimatedDuration * 60000));
      const endTime = new Date(requestedDateTime.getTime() + (service.estimatedDuration * 60000));

      conflictingRequests = await ServiceRequest.find({
        serviceId: service._id,
        status: { $in: ['confirmed', 'scheduled', 'in_progress'] },
        $or: [
          {
            scheduledDateTime: { $gte: startTime, $lte: endTime }
          },
          {
            requestedDateTime: { $gte: startTime, $lte: endTime }
          }
        ]
      }).populate('guestId', 'firstName lastName');
    }

    res.json({
      success: true,
      data: {
        serviceId: service._id,
        serviceName: service.name,
        requestedDateTime,
        isAvailable: isAvailable && conflictingRequests.length === 0,
        scheduleAvailable: isAvailable,
        hasConflicts: conflictingRequests.length > 0,
        conflictingRequests: conflictingRequests.map(req => ({
          id: req._id,
          requestNumber: req.requestNumber,
          guest: req.guestId ? `${req.guestId.firstName} ${req.guestId.lastName}` : 'Unknown',
          scheduledDateTime: req.scheduledDateTime || req.requestedDateTime,
          status: req.status
        })),
        estimatedDuration: service.estimatedDuration,
        advanceBookingRequired: service.availability.advanceBooking.required,
        minimumAdvanceHours: service.availability.advanceBooking.minimumHours
      }
    });
  } catch (error) {
    console.error('Check service availability error:', error);
    res.status(500).json({ error: 'Failed to check service availability' });
  }
});

// Get service categories
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    const categories = await Service.distinct('category', {
      hotelId: req.user.hotelId._id,
      'availability.isActive': true
    });

    const categoryStats = await Service.aggregate([
      {
        $match: {
          hotelId: req.user.hotelId._id,
          'availability.isActive': true
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$pricing.basePrice' },
          totalBookings: { $sum: '$stats.totalBookings' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        stats: categoryStats
      }
    });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
});

export default router;
