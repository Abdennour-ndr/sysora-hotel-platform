import express from 'express';
import Guest from '../models/Guest.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Get all guests for the hotel
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 20, isVip, isBlacklisted } = req.query;
    const hotelId = req.user.hotelId._id;

    // Build filter
    const filter = { hotelId, isActive: true };
    
    if (isVip !== undefined) filter.isVip = isVip === 'true';
    if (isBlacklisted !== undefined) filter.isBlacklisted = isBlacklisted === 'true';

    // Add search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get guests with pagination
    const [guests, totalCount] = await Promise.all([
      Guest.find(filter)
        .sort({ lastName: 1, firstName: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Guest.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        guests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: skip + guests.length < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get guests error:', error);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// Get guest by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Get guest's reservation history
    const Reservation = (await import('../models/Reservation.js')).default;
    const reservations = await Reservation.find({ guestId: req.params.id })
      .populate('roomId', 'number type')
      .sort({ checkInDate: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        guest,
        reservationHistory: reservations.map(res => ({
          id: res._id,
          reservationNumber: res.reservationNumber,
          room: res.roomId ? {
            number: res.roomId.number,
            type: res.roomId.type
          } : null,
          checkInDate: res.checkInDate,
          checkOutDate: res.checkOutDate,
          status: res.status,
          totalAmount: res.totalAmount,
          paidAmount: res.paidAmount
        }))
      }
    });
  } catch (error) {
    console.error('Get guest error:', error);
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// Create new guest
router.post('/', authenticateToken, requirePermission('manage_guests'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      idType,
      idNumber,
      nationality,
      address,
      dateOfBirth,
      gender,
      preferences,
      emergencyContact,
      notes,
      allergies,
      specialNeeds
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'Required fields missing',
        required: ['firstName', 'lastName', 'email']
      });
    }

    // Check if guest email already exists
    const existingGuest = await Guest.findOne({
      hotelId: req.user.hotelId._id,
      email: email.toLowerCase(),
      isActive: true
    });

    if (existingGuest) {
      return res.status(409).json({ error: 'Guest with this email already exists' });
    }

    // Create guest
    const guest = new Guest({
      hotelId: req.user.hotelId._id,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      idType,
      idNumber,
      nationality,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      preferences: preferences || {},
      emergencyContact,
      notes,
      allergies: allergies || [],
      specialNeeds: specialNeeds || [],
      loyaltyProgram: {
        joinDate: new Date()
      }
    });

    await guest.save();

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: guest
    });
  } catch (error) {
    console.error('Create guest error:', error);
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

// Update guest
router.put('/:id', authenticateToken, requirePermission('manage_guests'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      idType,
      idNumber,
      nationality,
      address,
      dateOfBirth,
      gender,
      preferences,
      emergencyContact,
      notes,
      allergies,
      specialNeeds,
      isVip,
      vipNotes
    } = req.body;

    // Check if guest exists
    const guest = await Guest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // If email is being changed, check for conflicts
    if (email && email.toLowerCase() !== guest.email) {
      const existingGuest = await Guest.findOne({
        hotelId: req.user.hotelId._id,
        email: email.toLowerCase(),
        isActive: true,
        _id: { $ne: req.params.id }
      });

      if (existingGuest) {
        return res.status(409).json({ error: 'Guest with this email already exists' });
      }
    }

    // Update guest
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email.toLowerCase();
    if (phone !== undefined) updateData.phone = phone;
    if (idType) updateData.idType = idType;
    if (idNumber !== undefined) updateData.idNumber = idNumber;
    if (nationality) updateData.nationality = nationality;
    if (address) updateData.address = { ...guest.address, ...address };
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateData.gender = gender;
    if (preferences) updateData.preferences = { ...guest.preferences, ...preferences };
    if (emergencyContact) updateData.emergencyContact = { ...guest.emergencyContact, ...emergencyContact };
    if (notes !== undefined) updateData.notes = notes;
    if (allergies) updateData.allergies = allergies;
    if (specialNeeds) updateData.specialNeeds = specialNeeds;
    if (isVip !== undefined) updateData.isVip = isVip;
    if (vipNotes !== undefined) updateData.vipNotes = vipNotes;

    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Guest updated successfully',
      data: updatedGuest
    });
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// Add loyalty points
router.put('/:id/loyalty-points', authenticateToken, requirePermission('manage_guests'), async (req, res) => {
  try {
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ error: 'Valid points amount is required' });
    }

    const guest = await Guest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Add points
    guest.loyaltyProgram.points += points;

    // Update tier based on points
    if (guest.loyaltyProgram.points >= 10000) {
      guest.loyaltyProgram.tier = 'platinum';
    } else if (guest.loyaltyProgram.points >= 5000) {
      guest.loyaltyProgram.tier = 'gold';
    } else if (guest.loyaltyProgram.points >= 1000) {
      guest.loyaltyProgram.tier = 'silver';
    }

    await guest.save();

    res.json({
      success: true,
      message: 'Loyalty points added successfully',
      data: {
        guestId: guest._id,
        pointsAdded: points,
        totalPoints: guest.loyaltyProgram.points,
        tier: guest.loyaltyProgram.tier,
        reason
      }
    });
  } catch (error) {
    console.error('Add loyalty points error:', error);
    res.status(500).json({ error: 'Failed to add loyalty points' });
  }
});

// Blacklist/unblacklist guest
router.put('/:id/blacklist', authenticateToken, requirePermission('manage_guests'), async (req, res) => {
  try {
    const { isBlacklisted, reason } = req.body;

    if (isBlacklisted === undefined) {
      return res.status(400).json({ error: 'isBlacklisted field is required' });
    }

    const guest = await Guest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Update blacklist status
    guest.isBlacklisted = isBlacklisted;
    if (isBlacklisted) {
      guest.blacklistReason = reason;
      guest.blacklistDate = new Date();
    } else {
      guest.blacklistReason = undefined;
      guest.blacklistDate = undefined;
    }

    await guest.save();

    res.json({
      success: true,
      message: `Guest ${isBlacklisted ? 'blacklisted' : 'removed from blacklist'} successfully`,
      data: {
        guestId: guest._id,
        isBlacklisted: guest.isBlacklisted,
        blacklistReason: guest.blacklistReason,
        blacklistDate: guest.blacklistDate
      }
    });
  } catch (error) {
    console.error('Update blacklist status error:', error);
    res.status(500).json({ error: 'Failed to update blacklist status' });
  }
});

// Delete guest (soft delete)
router.delete('/:id', authenticateToken, requirePermission('manage_guests'), async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      hotelId: req.user.hotelId._id,
      isActive: true
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Check if guest has active reservations
    const Reservation = (await import('../models/Reservation.js')).default;
    const activeReservations = await Reservation.countDocuments({
      guestId: req.params.id,
      status: { $in: ['confirmed', 'checked_in'] }
    });

    if (activeReservations > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete guest with active reservations',
        activeReservations
      });
    }

    // Soft delete
    guest.isActive = false;
    await guest.save();

    res.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// Search guests by email or phone
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.params;
    const hotelId = req.user.hotelId._id;

    const guests = await Guest.find({
      hotelId,
      isActive: true,
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      data: guests.map(guest => ({
        id: guest._id,
        fullName: `${guest.firstName} ${guest.lastName}`,
        email: guest.email,
        phone: guest.phone,
        isVip: guest.isVip,
        isBlacklisted: guest.isBlacklisted,
        loyaltyTier: guest.loyaltyProgram.tier
      }))
    });
  } catch (error) {
    console.error('Search guests error:', error);
    res.status(500).json({ error: 'Failed to search guests' });
  }
});

export default router;
