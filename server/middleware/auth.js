import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const secret = process.env.JWT_SECRET || 'sysora-demo-secret-key-2024';
    const decoded = jwt.verify(token, secret);

    // Find user and populate hotel information
    const user = await User.findById(decoded.userId)
      .populate('hotelId')
      .select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check if hotel is active
    if (!user.hotelId.isActive) {
      return res.status(401).json({ error: 'Hotel account is deactivated' });
    }

    // Check subscription status (skip for demo accounts)
    if (!decoded.isDemo && user.hotelId.subscription.status !== 'active') {
      return res.status(402).json({
        error: 'Subscription required',
        subscriptionStatus: user.hotelId.subscription.status
      });
    }

    req.user = user;
    req.hotel = user.hotelId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Check if user has specific permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Use hasPermission method if available, otherwise check permissions array
    const hasPermission = req.user.hasPermission
      ? req.user.hasPermission(permission)
      : req.user.permissions && req.user.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permission,
        userRole: req.user.role,
        userPermissions: req.user.permissions
      });
    }

    next();
  };
};

// Check if user has any of the specified roles
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient role',
        required: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Check if user is hotel owner
export const requireOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'owner') {
    return res.status(403).json({
      error: 'Owner access required',
      userRole: req.user.role
    });
  }

  next();
};

// Validate hotel access (ensure user belongs to the hotel)
export const validateHotelAccess = (req, res, next) => {
  const hotelId = req.params.hotelId || req.body.hotelId || req.query.hotelId;

  if (hotelId && hotelId !== req.user.hotelId._id.toString()) {
    return res.status(403).json({
      error: 'Access denied - hotel mismatch',
      userHotel: req.user.hotelId._id,
      requestedHotel: hotelId
    });
  }

  next();
};

// Generate JWT token
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'sysora-demo-secret-key-2024';
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify subdomain and get hotel
export const verifySubdomain = async (req, res, next) => {
  try {
    const subdomain = req.headers['x-subdomain'] || req.query.subdomain;

    if (!subdomain) {
      return res.status(400).json({ error: 'Subdomain required' });
    }

    const hotel = await Hotel.findOne({ subdomain, isActive: true });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    req.hotel = hotel;
    next();
  } catch (error) {
    console.error('Subdomain verification error:', error);
    res.status(500).json({ error: 'Subdomain verification failed' });
  }
};

export default {
  authenticateToken,
  requirePermission,
  requireRole,
  requireOwner,
  validateHotelAccess,
  generateToken,
  verifySubdomain
};
