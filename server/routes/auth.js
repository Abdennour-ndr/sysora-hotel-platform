import express from 'express';
import bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Check workspace existence
router.get('/check-workspace/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    console.log(`🏢 Checking workspace: ${subdomain}`);

    // Find hotel by subdomain
    const hotel = await Hotel.findOne({ subdomain: subdomain.toLowerCase() });

    if (hotel) {
      console.log(`✅ Workspace found: ${hotel.name}`);
      res.json({
        exists: true,
        workspace: {
          id: hotel._id,
          name: hotel.name,
          subdomain: hotel.subdomain
        }
      });
    } else {
      console.log(`❌ Workspace not found: ${subdomain}`);
      res.json({
        exists: false,
        message: 'Workspace not found'
      });
    }

  } catch (error) {
    console.error('Workspace check error:', error);
    res.status(500).json({
      exists: false,
      error: 'Failed to check workspace'
    });
  }
});

// Workspace login (subdomain + credentials)
router.post('/workspace-login', async (req, res) => {
  try {
    const { subdomain, email, password } = req.body;
    console.log(`🔐 Workspace login attempt: ${email} @ ${subdomain}`);

    // Validate required fields
    if (!subdomain || !email || !password) {
      return res.status(400).json({
        error: 'All fields are required',
        required: ['subdomain', 'email', 'password']
      });
    }

    // Find hotel by subdomain
    const hotel = await Hotel.findOne({ subdomain: subdomain.toLowerCase() });
    if (!hotel) {
      console.log(`❌ Hotel not found: ${subdomain}`);
      return res.status(404).json({
        error: 'Workspace not found'
      });
    }

    // Find user by email and hotel
    const user = await User.findOne({
      email: email.toLowerCase(),
      hotelId: hotel._id
    });
    if (!user) {
      console.log(`❌ User not found: ${email} in ${subdomain}`);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    console.log(`✅ Workspace login successful: ${email} @ ${subdomain}`);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        hotel: {
          id: hotel._id,
          name: hotel.name,
          subdomain: hotel.subdomain,
          workspaceUrl: `https://${hotel.subdomain}.sysora.app`
        },
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Workspace login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Login user (legacy - for backward compatibility)
router.post('/login', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database temporarily unavailable',
        message: 'Login service is currently offline. Please try again later.',
        demo: true
      });
    }

    const { email, password } = req.body;
    console.log(`🔐 Login attempt for: ${email}`);

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        required: ['email', 'password']
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Get hotel information
    const hotel = await Hotel.findById(user.hotelId);
    if (!hotel) {
      console.log(`❌ Hotel not found for user: ${email}`);
      return res.status(404).json({
        error: 'Workspace not found'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    console.log(`✅ Login successful for: ${email}`);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        hotel: {
          id: hotel._id,
          name: hotel.name,
          subdomain: hotel.subdomain,
          workspaceUrl: `https://${hotel.subdomain}.sysora.app`
        },
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Register new hotel and owner
router.post('/register-hotel', async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database temporarily unavailable',
        message: 'Registration service is currently offline. Please try again later.',
        demo: true
      });
    }

    const { fullName, companyName, email, password, employeeCount, subdomain, selectedPlan } = req.body;

    // Validate required fields
    if (!fullName || !companyName || !email || !password || !employeeCount || !subdomain) {
      return res.status(400).json({
        error: 'All fields are required',
        required: ['fullName', 'companyName', 'email', 'password', 'employeeCount', 'subdomain']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-zA-Z0-9-]+$/;
    if (!subdomainRegex.test(subdomain) || subdomain.length < 3) {
      return res.status(400).json({
        error: 'Invalid subdomain format. Must be at least 3 characters and contain only letters, numbers, and hyphens'
      });
    }

    // Check if subdomain is already taken
    const existingHotel = await Hotel.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingHotel) {
      return res.status(409).json({ error: 'Subdomain already taken' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create hotel
    const hotel = new Hotel({
      name: companyName,
      subdomain: subdomain.toLowerCase(),
      email: email.toLowerCase(),
      owner: {
        fullName,
        email: email.toLowerCase()
      },
      employeeCount,
      subscription: {
        plan: 'trial',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days trial
        trialUsed: true
      }
    });

    await hotel.save();

    // Create owner user with provided password
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: password, // Use the password provided by user
      hotelId: hotel._id,
      role: 'owner'
    });

    await user.save();

    // Update hotel subscription with selected plan
    if (selectedPlan) {
      hotel.subscription.plan = selectedPlan;
      await hotel.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Hotel registered successfully',
      data: {
        hotel: {
          id: hotel._id,
          name: hotel.name,
          subdomain: hotel.subdomain,
          workspaceUrl: `https://${hotel.subdomain}.sysora.com`,
          plan: selectedPlan || 'standard'
        },
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Hotel registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Enhanced Login with better error handling
router.post('/login-enhanced', async (req, res) => {
  try {
    const { email, password, subdomain } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('hotelId');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check if hotel is active
    if (!user.hotelId.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Hotel account is deactivated'
      });
    }

    // If subdomain is provided, verify it matches user's hotel
    if (subdomain && subdomain !== user.hotelId.subdomain) {
      return res.status(401).json({
        success: false,
        error: 'Invalid subdomain for this account'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        },
        hotel: {
          id: user.hotelId._id,
          name: user.hotelId.name,
          subdomain: user.hotelId.subdomain
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          permissions: req.user.permissions,
          phone: req.user.phone,
          avatar: req.user.avatar,
          lastLogin: req.user.lastLogin
        },
        hotel: {
          id: req.hotel._id,
          name: req.hotel.name,
          subdomain: req.hotel.subdomain,
          subscription: req.hotel.subscription,
          settings: req.hotel.settings
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`🔍 Checking email availability for: ${email}`);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`❌ Invalid email format: ${email}`);
      return res.status(400).json({
        available: false,
        error: 'Invalid email format'
      });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log(`📧 Email check result for ${email.toLowerCase()}: ${existingUser ? 'EXISTS' : 'AVAILABLE'}`);

    res.json({
      available: !existingUser,
      email: email.toLowerCase()
    });

  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      available: false,
      error: 'Failed to check email availability'
    });
  }
});

// Check subdomain availability
router.get('/check-subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    console.log(`🔍 Checking subdomain availability for: ${subdomain}`);

    // Validate subdomain format
    const subdomainRegex = /^[a-zA-Z0-9-]+$/;
    if (!subdomainRegex.test(subdomain) || subdomain.length < 3) {
      console.log(`❌ Invalid subdomain format: ${subdomain}`);
      return res.status(400).json({
        available: false,
        error: 'Invalid subdomain format'
      });
    }

    // Check reserved subdomains
    const reservedSubdomains = ['admin', 'api', 'www', 'mail', 'test', 'demo', 'app', 'dashboard'];
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      console.log(`❌ Reserved subdomain: ${subdomain}`);
      return res.json({ available: false, error: 'Subdomain is reserved' });
    }

    // Check if subdomain exists
    const existingHotel = await Hotel.findOne({ subdomain: subdomain.toLowerCase() });
    const isAvailable = !existingHotel;
    console.log(`🏨 Subdomain check result for ${subdomain.toLowerCase()}: ${isAvailable ? 'AVAILABLE' : 'EXISTS'}`);

    res.json({
      available: isAvailable,
      subdomain: subdomain.toLowerCase()
    });

  } catch (error) {
    console.error('Subdomain check error:', error);
    res.status(500).json({
      available: false,
      error: 'Failed to check subdomain availability'
    });
  }
});

// Clear test data (for development only)
router.delete('/clear-test-data/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not allowed in production' });
    }

    console.log(`🗑️ Clearing test data for email: ${email}`);

    // Find and delete user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Delete associated hotel
      await Hotel.findByIdAndDelete(user.hotelId);
      // Delete user
      await User.findByIdAndDelete(user._id);
      console.log(`✅ Cleared test data for: ${email}`);
    }

    res.json({
      success: true,
      message: 'Test data cleared successfully'
    });
  } catch (error) {
    console.error('Clear test data error:', error);
    res.status(500).json({ error: 'Failed to clear test data' });
  }
});

// Create test workspace (for development only)
router.post('/create-test-workspace', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not allowed in production' });
    }

    console.log(`🧪 Creating test workspace`);

    // Create test hotel
    const testHotel = new Hotel({
      name: 'فندق الاختبار',
      subdomain: 'test-hotel',
      email: 'test@example.com',
      employeeCount: '1-5',
      owner: {
        fullName: 'مدير الاختبار',
        email: 'test@example.com'
      },
      settings: {
        timezone: 'Africa/Algiers',
        currency: {
          code: 'DZD',
          symbol: 'دج',
          name: 'الدينار الجزائري',
          position: 'after'
        }
      },
      subscription: {
        plan: 'standard',
        status: 'trial',
        trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    });

    await testHotel.save();

    // Create test user
    const testUser = new User({
      fullName: 'مدير الاختبار',
      email: 'test@example.com',
      password: 'test123',
      hotelId: testHotel._id,
      role: 'owner'
    });

    await testUser.save();

    console.log(`✅ Test workspace created: test-hotel.sysora.app`);

    res.json({
      success: true,
      message: 'Test workspace created successfully',
      data: {
        hotel: {
          name: testHotel.name,
          subdomain: testHotel.subdomain,
          workspaceUrl: `https://${testHotel.subdomain}.sysora.app`
        },
        user: {
          email: testUser.email,
          password: 'test123',
          role: testUser.role
        }
      }
    });
  } catch (error) {
    console.error('Create test workspace error:', error);
    res.status(500).json({ error: 'Failed to create test workspace' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`🔐 Forgot password request for: ${email}`);

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      console.log(`❌ User not found for forgot password: ${email}`);
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link

    // For demo purposes, we'll just log it
    console.log(`✅ Password reset requested for: ${email}`);
    console.log(`🔗 Reset link would be sent to: ${email}`);

    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request'
    });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just log the logout
    console.log(`User ${req.user.email} logged out at ${new Date()}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
