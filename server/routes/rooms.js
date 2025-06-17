import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Room from '../models/Room.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/rooms';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'room-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all rooms for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId, isActive: true };
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get rooms with pagination
    const [rooms, totalCount] = await Promise.all([
      Room.find(filter)
        .sort({ number: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Room.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + rooms.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create new room with images
router.post('/', authenticateToken, requirePermission('manage_rooms'), upload.array('images', 10), async (req, res) => {
  try {
    console.log('🚀 Creating room with images...');
    console.log('📦 Request body keys:', Object.keys(req.body));
    console.log('📁 Files received:', req.files?.length || 0);
    console.log('📦 Raw body:', req.body);

    // Parse room data from form
    let roomData;
    try {
      console.log('🔍 Parsing roomData:', req.body.roomData);
      roomData = JSON.parse(req.body.roomData);
      console.log('✅ Room data parsed successfully:', roomData);
    } catch (error) {
      console.error('❌ Error parsing room data:', error);
      return res.status(400).json({ error: 'Invalid room data format' });
    }

    const {
      number,
      name,
      type,
      category,
      maxOccupancy,
      bedCount,
      bedType,
      basePrice,
      size,
      floor,
      amenities,
      features,
      description,
      notes
    } = roomData;

    // Validate required fields
    if (!number || !type || !maxOccupancy || !basePrice) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['number', 'type', 'maxOccupancy', 'basePrice']
      });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({
      hotelId: req.user.hotelId._id,
      number,
      isActive: true
    });

    if (existingRoom) {
      return res.status(409).json({ error: 'Room number already exists' });
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Processing ${req.files.length} uploaded images`);

      req.files.forEach((file, index) => {
        console.log(`📸 Processing image ${index + 1}:`, {
          filename: file.filename,
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        });

        // Parse image metadata if available
        let imageData = {};
        try {
          const imageDataKey = `imageData_${index}`;
          console.log(`🔍 Looking for metadata key: ${imageDataKey}`);
          if (req.body[imageDataKey]) {
            imageData = JSON.parse(req.body[imageDataKey]);
            console.log(`✅ Image metadata ${index}:`, imageData);
          } else {
            console.log(`⚠️ No metadata found for image ${index}`);
          }
        } catch (error) {
          console.error(`❌ Error parsing image metadata ${index}:`, error);
        }

        const imageObj = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          isPrimary: imageData.isPrimary || false,
          uploadedAt: new Date()
        };

        images.push(imageObj);
        console.log(`✅ Image ${index + 1} processed:`, imageObj);
      });

      // Ensure at least one image is marked as primary
      if (images.length > 0 && !images.some(img => img.isPrimary)) {
        console.log('🌟 Setting first image as primary');
        images[0].isPrimary = true;
      }

      console.log(`✅ Total images processed: ${images.length}`);
      console.log('📸 Final images array:', images);
    } else {
      console.log('⚠️ No files received in request');
    }

    // Create room with default values
    console.log('🏨 Creating room object with data:', {
      number,
      name: name || `Room ${number}`,
      type,
      imagesCount: images.length
    });

    const room = new Room({
      hotelId: req.user.hotelId._id,
      number,
      name: name || `Room ${number}`,
      type,
      category: category || 'standard',
      maxOccupancy,
      bedCount: bedCount || Math.min(maxOccupancy, 2),
      bedType: bedType || 'single',
      basePrice,
      size: size || null,
      floor: floor || 1,
      amenities: amenities || [],
      features: features || {},
      description: description || '',
      notes: notes || '',
      images: images,
      currency: req.user.hotelId.settings?.currency?.code || 'DZD'
    });

    console.log('💾 Saving room with images:', room.images.length);
    console.log('📸 Room images before save:', room.images);

    await room.save();

    console.log('✅ Room saved successfully with ID:', room._id);
    console.log('📸 Room images after save:', room.images.length);

    res.status(201).json({
      success: true,
      message: `Room created successfully${images.length > 0 ? ` with ${images.length} image(s)` : ''}`,
      data: room
    });
  } catch (error) {
    console.error('Create room error:', error);

    // Clean up uploaded files if room creation failed
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    }

    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room
router.put('/:id', authenticateToken, requirePermission('manage_rooms'), upload.array('images', 10), async (req, res) => {
  try {
    console.log('🔄 Updating room with ID:', req.params.id);
    console.log('📝 Request body:', req.body);
    console.log('📸 Files received:', req.files ? req.files.length : 0);

    // Parse roomData if it exists (for FormData requests)
    let roomData = {};
    if (req.body.roomData) {
      try {
        roomData = JSON.parse(req.body.roomData);
        console.log('📋 Parsed room data:', roomData);
      } catch (error) {
        console.error('❌ Error parsing roomData:', error);
        return res.status(400).json({ error: 'Invalid roomData format' });
      }
    } else {
      // Use direct body data (for JSON requests)
      roomData = req.body;
    }

    const {
      number,
      name,
      type,
      category,
      maxOccupancy,
      bedCount,
      bedType,
      basePrice,
      size,
      floor,
      amenities,
      features,
      description,
      notes
    } = roomData;

    // Check if room exists
    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Process new images if provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      console.log('📸 Processing new images...');

      req.files.forEach((file, index) => {
        console.log(`📸 Processing image ${index + 1}:`, file.filename);

        // Get image metadata if provided
        let imageMetadata = {};
        try {
          const metadataKey = `imageData_${index}`;
          if (req.body[metadataKey]) {
            imageMetadata = JSON.parse(req.body[metadataKey]);
          }
        } catch (error) {
          console.log(`⚠️ Error parsing metadata for image ${index}:`, error);
        }

        const imageObj = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          isPrimary: imageMetadata.isPrimary || false,
          description: imageMetadata.description || '',
          uploadedAt: new Date(),
          uploadedBy: req.user._id
        };

        newImages.push(imageObj);
        console.log(`✅ New image ${index + 1} processed:`, imageObj);
      });

      console.log(`✅ Total new images processed: ${newImages.length}`);
    }

    // If room number is being changed, check for conflicts
    if (number && number !== room.number) {
      const existingRoom = await Room.findOne({
        hotelId: req.user.hotelId._id,
        number,
        isActive: true,
        _id: { $ne: req.params.id }
      });

      if (existingRoom) {
        return res.status(409).json({ error: 'Room number already exists' });
      }
    }

    // Update room
    const updateData = {};
    if (number) updateData.number = number;
    if (name !== undefined) updateData.name = name;
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (maxOccupancy) updateData.maxOccupancy = maxOccupancy;
    if (bedCount) updateData.bedCount = bedCount;
    if (bedType) updateData.bedType = bedType;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (size !== undefined) updateData.size = size;
    if (floor !== undefined) updateData.floor = floor;
    if (amenities) updateData.amenities = amenities;
    if (features) updateData.features = { ...room.features, ...features };
    if (description !== undefined) updateData.description = description;
    if (notes !== undefined) updateData.notes = notes;

    // Handle images update
    if (newImages.length > 0) {
      // Add new images to existing ones
      const existingImages = room.images || [];
      const allImages = [...existingImages, ...newImages];

      // Ensure only one primary image
      if (newImages.some(img => img.isPrimary)) {
        // Remove primary flag from existing images
        allImages.forEach(img => {
          if (!newImages.includes(img)) {
            img.isPrimary = false;
          }
        });
      } else if (existingImages.length === 0 && newImages.length > 0) {
        // Set first new image as primary if no existing images
        newImages[0].isPrimary = true;
      }

      updateData.images = allImages;
      console.log(`📸 Updated images: ${allImages.length} total (${newImages.length} new)`);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Room updated successfully${newImages.length > 0 ? ` with ${newImages.length} new image(s)` : ''}`,
      data: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);

    // Clean up uploaded files if room update failed
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    }

    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Update room status
router.put('/:id/status', authenticateToken, requirePermission('manage_rooms'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning', 'out_of_order'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses
      });
    }

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Update room status
    room.status = status;
    if (notes) room.notes = notes;

    // Update maintenance/cleaning timestamps
    if (status === 'maintenance') {
      room.lastMaintenance = new Date();
      if (notes) room.maintenanceNotes = notes;
    } else if (status === 'cleaning') {
      room.lastCleaned = new Date();
    }

    await room.save();

    res.json({
      success: true,
      message: 'Room status updated successfully',
      data: {
        id: room._id,
        number: room.number,
        status: room.status,
        lastCleaned: room.lastCleaned,
        lastMaintenance: room.lastMaintenance
      }
    });
  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({ error: 'Failed to update room status' });
  }
});

// Delete room (soft delete)
router.delete('/:id', authenticateToken, requirePermission('manage_rooms'), async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if room has active reservations
    const Reservation = (await import('../models/Reservation.js')).default;
    const activeReservations = await Reservation.countDocuments({
      roomId: req.params.id,
      status: { $in: ['confirmed', 'checked_in'] }
    });

    if (activeReservations > 0) {
      return res.status(400).json({
        error: 'Cannot delete room with active reservations',
        activeReservations
      });
    }

    // Soft delete
    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Get room availability for date range
router.get('/:id/availability', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check for overlapping reservations
    const Reservation = (await import('../models/Reservation.js')).default;
    const overlappingReservations = await Reservation.find({
      roomId: req.params.id,
      status: { $in: ['confirmed', 'checked_in'] },
      $or: [
        {
          checkInDate: { $lte: new Date(endDate) },
          checkOutDate: { $gte: new Date(startDate) }
        }
      ]
    }).populate('guestId', 'firstName lastName');

    const isAvailable = overlappingReservations.length === 0 && room.status === 'available';

    res.json({
      success: true,
      data: {
        roomId: room._id,
        roomNumber: room.number,
        isAvailable,
        roomStatus: room.status,
        conflictingReservations: overlappingReservations.map(res => ({
          id: res._id,
          reservationNumber: res.reservationNumber,
          guest: res.guestId ? `${res.guestId.firstName} ${res.guestId.lastName}` : 'Unknown',
          checkInDate: res.checkInDate,
          checkOutDate: res.checkOutDate,
          status: res.status
        }))
      }
    });
  } catch (error) {
    console.error('Check room availability error:', error);
    res.status(500).json({ error: 'Failed to check room availability' });
  }
});

// Request room cleaning
router.post('/:id/cleaning/request', authenticateToken, async (req, res) => {
  try {
    const { priority = 'normal', notes = '' } = req.body;

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.requestCleaning(req.user._id, priority, notes);

    res.json({
      success: true,
      message: 'Cleaning request submitted successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        cleaningStatus: room.cleaningStatus,
        pendingRequests: room.pendingCleaningRequests
      }
    });
  } catch (error) {
    console.error('Request cleaning error:', error);
    res.status(500).json({ error: 'Failed to request cleaning' });
  }
});

// Start room cleaning
router.post('/:id/cleaning/start', authenticateToken, requirePermission('room_cleaning'), async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.startCleaning(req.user._id);

    res.json({
      success: true,
      message: 'Cleaning started successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        status: room.status,
        cleaningStatus: room.cleaningStatus
      }
    });
  } catch (error) {
    console.error('Start cleaning error:', error);
    res.status(500).json({ error: 'Failed to start cleaning' });
  }
});

// Complete room cleaning
router.post('/:id/cleaning/complete', authenticateToken, requirePermission('room_cleaning'), async (req, res) => {
  try {
    const { notes = '' } = req.body;

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.completeCleaning(req.user._id, notes);

    res.json({
      success: true,
      message: 'Cleaning completed successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        status: room.status,
        cleaningStatus: room.cleaningStatus,
        lastCleaned: room.lastCleaned
      }
    });
  } catch (error) {
    console.error('Complete cleaning error:', error);
    res.status(500).json({ error: 'Failed to complete cleaning' });
  }
});

// Request room maintenance
router.post('/:id/maintenance/request', authenticateToken, async (req, res) => {
  try {
    const { issue, priority = 'normal' } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue description is required' });
    }

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.requestMaintenance(req.user._id, issue, priority);

    res.json({
      success: true,
      message: 'Maintenance request submitted successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        maintenanceStatus: room.maintenanceStatus,
        pendingRequests: room.pendingMaintenanceRequests
      }
    });
  } catch (error) {
    console.error('Request maintenance error:', error);
    res.status(500).json({ error: 'Failed to request maintenance' });
  }
});

// Start room maintenance
router.post('/:id/maintenance/start', authenticateToken, requirePermission('room_maintenance'), async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.startMaintenance(req.user._id);

    res.json({
      success: true,
      message: 'Maintenance started successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        status: room.status,
        maintenanceStatus: room.maintenanceStatus
      }
    });
  } catch (error) {
    console.error('Start maintenance error:', error);
    res.status(500).json({ error: 'Failed to start maintenance' });
  }
});

// Complete room maintenance
router.post('/:id/maintenance/complete', authenticateToken, requirePermission('room_maintenance'), async (req, res) => {
  try {
    const { cost = 0, notes = '' } = req.body;

    const room = await Room.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await room.completeMaintenance(req.user._id, cost, notes);

    res.json({
      success: true,
      message: 'Maintenance completed successfully',
      data: {
        roomId: room._id,
        roomNumber: room.number,
        status: room.status,
        maintenanceStatus: room.maintenanceStatus,
        lastMaintenance: room.lastMaintenance
      }
    });
  } catch (error) {
    console.error('Complete maintenance error:', error);
    res.status(500).json({ error: 'Failed to complete maintenance' });
  }
});

// Get cleaning requests for all rooms
router.get('/cleaning/requests', authenticateToken, requirePermission('room_cleaning'), async (req, res) => {
  try {
    const { status = 'pending' } = req.query;

    const rooms = await Room.find({
      hotelId: req.user.hotelId._id,
      isActive: true,
      'cleaningRequests.status': status
    }).populate('cleaningRequests.requestedBy', 'fullName')
      .populate('cleaningRequests.assignedTo', 'fullName');

    const requests = [];
    rooms.forEach(room => {
      room.cleaningRequests
        .filter(req => req.status === status)
        .forEach(request => {
          requests.push({
            id: request._id,
            roomId: room._id,
            roomNumber: room.number,
            requestedBy: request.requestedBy,
            requestedAt: request.requestedAt,
            priority: request.priority,
            notes: request.notes,
            status: request.status,
            assignedTo: request.assignedTo
          });
        });
    });

    res.json({
      success: true,
      data: requests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    });
  } catch (error) {
    console.error('Get cleaning requests error:', error);
    res.status(500).json({ error: 'Failed to get cleaning requests' });
  }
});

// Get maintenance requests for all rooms
router.get('/maintenance/requests', authenticateToken, requirePermission('room_maintenance'), async (req, res) => {
  try {
    const { status = 'pending' } = req.query;

    const rooms = await Room.find({
      hotelId: req.user.hotelId._id,
      isActive: true,
      'maintenanceRequests.status': status
    }).populate('maintenanceRequests.requestedBy', 'fullName')
      .populate('maintenanceRequests.assignedTo', 'fullName');

    const requests = [];
    rooms.forEach(room => {
      room.maintenanceRequests
        .filter(req => req.status === status)
        .forEach(request => {
          requests.push({
            id: request._id,
            roomId: room._id,
            roomNumber: room.number,
            requestedBy: request.requestedBy,
            requestedAt: request.requestedAt,
            issue: request.issue,
            priority: request.priority,
            status: request.status,
            assignedTo: request.assignedTo,
            cost: request.cost,
            notes: request.notes
          });
        });
    });

    res.json({
      success: true,
      data: requests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({ error: 'Failed to get maintenance requests' });
  }
});

// Serve room images
router.get('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join('uploads', 'rooms', filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send file
    res.sendFile(path.resolve(imagePath));
  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

export default router;
