import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

const router = express.Router();

// Admin users (hardcoded for security)
const ADMIN_USERS = [
  {
    id: 'admin_1',
    email: 'admin@sysora.app',
    password: '$2a$10$3fjsCJu5heHkOOddLN.KZ.6AMjmvlJs6g/W/vYJnKm/v8jgYWsnny', // admin123
    fullName: 'مشرف النظام',
    role: 'super_admin'
  },
  {
    id: 'admin_2',
    email: 'support@sysora.app',
    password: '$2a$10$3fjsCJu5heHkOOddLN.KZ.6AMjmvlJs6g/W/vYJnKm/v8jgYWsnny', // admin123
    fullName: 'فريق الدعم',
    role: 'super_admin'
  }
];

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 Admin login attempt for: ${email}`);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان',
        required: ['email', 'password']
      });
    }

    // Find admin user
    const adminUser = ADMIN_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!adminUser) {
      console.log(`❌ Admin not found: ${email}`);
      return res.status(401).json({
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for admin: ${email}`);
      return res.status(401).json({
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        type: 'admin'
      },
      process.env.JWT_SECRET || 'sysora_admin_secret_key_2024',
      { expiresIn: '24h' }
    );

    console.log(`✅ Admin login successful: ${email}`);

    // Return success response
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: adminUser.id,
          fullName: adminUser.fullName,
          email: adminUser.email,
          role: adminUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.' });
  }
});

// Get current admin user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sysora_admin_secret_key_2024');

    // Find admin user
    const adminUser = ADMIN_USERS.find(user => user.id === decoded.id);
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin user' });
    }

    // Return admin user info
    res.json({
      success: true,
      user: {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Admin me error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const totalHotels = await Hotel.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeHotels = await Hotel.countDocuments({ isActive: true });
    const trialHotels = await Hotel.countDocuments({ 'subscription.plan': 'trial' });

    res.json({
      success: true,
      data: {
        totalHotels,
        totalUsers,
        activeHotels,
        trialHotels
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sysora_admin_secret_key_2024');

    // Find admin user
    const adminUser = ADMIN_USERS.find(user => user.id === decoded.id);
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin user' });
    }

    const hotels = await Hotel.find()
      .select('name subdomain email subscription isActive createdAt owner')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: hotels
    });

  } catch (error) {
    console.error('Admin hotels fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sysora_admin_secret_key_2024');

    // Find admin user
    const adminUser = ADMIN_USERS.find(user => user.id === decoded.id);
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin user' });
    }

    const users = await User.find()
      .populate('hotelId', 'name subdomain')
      .select('fullName email role isActive lastLogin createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
