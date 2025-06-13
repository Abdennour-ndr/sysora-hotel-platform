import jwt from 'jsonwebtoken';

// Admin users (same as in admin.js)
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

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find admin user
    const adminUser = ADMIN_USERS.find(user => user.id === decoded.userId);
    
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin token' });
    }

    // Check if user is super admin
    if (adminUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Insufficient privileges' });
    }

    // Add admin user to request
    req.admin = adminUser;
    next();
    
  } catch (error) {
    console.error('Admin authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export default authenticateAdmin;
