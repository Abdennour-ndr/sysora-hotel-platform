import express from 'express';
import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';
import Guest from '../models/Guest.js';
import Payment from '../models/Payment.js';
import { authenticateToken, requirePermission, requireOwner } from '../middleware/auth.js';

const router = express.Router();

// Get hotel information
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel profile error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel profile' });
  }
});

// Update hotel information
router.put('/profile', authenticateToken, requirePermission('manage_hotel'), async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      settings
    } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (settings) updateData.settings = { ...req.hotel.settings, ...settings };

    const hotel = await Hotel.findByIdAndUpdate(
      req.user.hotelId._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Hotel profile updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel profile error:', error);
    res.status(500).json({ error: 'Failed to update hotel profile' });
  }
});

// Get hotel dashboard statistics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const hotelId = req.user.hotelId._id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Import models here to avoid circular dependencies
    const Room = (await import('../models/Room.js')).default;
    const Reservation = (await import('../models/Reservation.js')).default;
    const Guest = (await import('../models/Guest.js')).default;

    // Get basic counts
    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalGuests,
      todayCheckIns,
      todayCheckOuts,
      pendingReservations
    ] = await Promise.all([
      Room.countDocuments({ hotelId, isActive: true }),
      Room.countDocuments({ hotelId, status: 'available', isActive: true }),
      Room.countDocuments({ hotelId, status: 'occupied', isActive: true }),
      Guest.countDocuments({ hotelId, isActive: true }),
      Reservation.countDocuments({
        hotelId,
        checkInDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['confirmed', 'checked_in'] }
      }),
      Reservation.countDocuments({
        hotelId,
        checkOutDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'checked_in'
      }),
      Reservation.countDocuments({
        hotelId,
        status: 'pending'
      })
    ]);

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Get recent reservations
    const recentReservations = await Reservation.find({ hotelId })
      .populate('guestId', 'firstName lastName email')
      .populate('roomId', 'number type')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get revenue for current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyRevenue = await Reservation.aggregate([
      {
        $match: {
          hotelId: hotelId,
          status: { $in: ['checked_out', 'checked_in'] },
          checkInDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$paidAmount' },
          totalReservations: { $sum: 1 }
        }
      }
    ]);

    const revenue = monthlyRevenue.length > 0 ? monthlyRevenue[0] : { totalRevenue: 0, totalReservations: 0 };

    res.json({
      success: true,
      data: {
        overview: {
          totalRooms,
          availableRooms,
          occupiedRooms,
          occupancyRate,
          totalGuests
        },
        today: {
          checkIns: todayCheckIns,
          checkOuts: todayCheckOuts,
          pendingReservations
        },
        revenue: {
          monthly: revenue.totalRevenue,
          reservationsCount: revenue.totalReservations
        },
        recentReservations: recentReservations.map(reservation => ({
          id: reservation._id,
          reservationNumber: reservation.reservationNumber,
          guest: reservation.guestId ? {
            name: `${reservation.guestId.firstName} ${reservation.guestId.lastName}`,
            email: reservation.guestId.email
          } : null,
          room: reservation.roomId ? {
            number: reservation.roomId.number,
            type: reservation.roomId.type
          } : null,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          status: reservation.status,
          totalAmount: reservation.totalAmount
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update hotel settings
router.put('/settings', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({ error: 'Settings data is required' });
    }

    const hotel = await Hotel.findByIdAndUpdate(
      req.user.hotelId._id,
      {
        $set: {
          settings: { ...req.hotel.settings, ...settings },
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Hotel settings updated successfully',
      data: {
        settings: hotel.settings
      }
    });
  } catch (error) {
    console.error('Update hotel settings error:', error);
    res.status(500).json({ error: 'Failed to update hotel settings' });
  }
});

// Update currency settings specifically
router.put('/currency', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const { code, symbol, name, position } = req.body;

    // Validate currency data
    if (!code || !symbol || !name) {
      return res.status(400).json({
        success: false,
        message: 'Currency code, symbol, and name are required'
      });
    }

    // Update currency settings
    const currencySettings = {
      code,
      symbol,
      name,
      position: position || 'after'
    };

    const hotel = await Hotel.findByIdAndUpdate(
      req.user.hotelId._id,
      {
        $set: {
          'settings.currency': currencySettings,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Currency settings updated successfully',
      data: {
        currency: hotel.settings.currency
      }
    });
  } catch (error) {
    console.error('Update currency settings error:', error);
    res.status(500).json({ error: 'Failed to update currency settings' });
  }
});

// Get subscription information
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id).select('subscription');

    res.json({
      success: true,
      data: {
        subscription: hotel.subscription,
        daysRemaining: Math.ceil((hotel.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription information' });
  }
});

// Deactivate hotel (owner only)
router.put('/deactivate', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { reason } = req.body;

    await Hotel.findByIdAndUpdate(
      req.user.hotelId._id,
      {
        isActive: false,
        deactivationReason: reason,
        deactivatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Hotel account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate hotel error:', error);
    res.status(500).json({ error: 'Failed to deactivate hotel account' });
  }
});

export default router;
