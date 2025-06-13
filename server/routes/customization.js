import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Hotel from '../models/Hotel.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Simple ping endpoint (no auth required)
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Customization routes are working',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for debugging
router.get('/test', authenticateToken, async (req, res) => {
  try {
    console.log('=== CUSTOMIZATION TEST ENDPOINT ===');

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in request' });
    }

    console.log('User ID:', req.user._id);
    console.log('User email:', req.user.email);
    console.log('User hotelId:', req.user.hotelId);

    // Check if user has hotelId
    if (!req.user.hotelId) {
      return res.status(400).json({ error: 'User has no hotel assigned' });
    }

    const hotelId = req.user.hotelId._id || req.user.hotelId;
    console.log('Looking for hotel with ID:', hotelId);

    const hotel = await Hotel.findById(hotelId);

    console.log('Hotel found:', !!hotel);
    if (hotel) {
      console.log('Hotel name:', hotel.name);
      console.log('Has customization:', !!hotel.customization);
      console.log('Customization keys:', hotel.customization ? Object.keys(hotel.customization) : 'none');
    }

    res.json({
      success: true,
      message: 'Test endpoint working',
      data: {
        userId: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        hotelId: hotelId,
        hotelFound: !!hotel,
        hotelName: hotel?.name,
        hasCustomization: !!hotel?.customization,
        customizationKeys: hotel?.customization ? Object.keys(hotel.customization) : []
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      error: 'Test failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Simple theme test endpoint
router.put('/test-theme', authenticateToken, async (req, res) => {
  try {
    console.log('=== THEME TEST ENDPOINT ===');
    console.log('Request body:', req.body);

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found in request' });
    }

    // Check if user has hotelId
    if (!req.user.hotelId) {
      return res.status(400).json({ error: 'User has no hotel assigned' });
    }

    const hotelId = req.user.hotelId._id || req.user.hotelId;
    console.log('Looking for hotel with ID:', hotelId);

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    console.log('Hotel found:', hotel.name);

    // Simple initialization
    if (!hotel.customization) {
      hotel.customization = {};
      console.log('Initialized customization object');
    }

    hotel.customization.theme = {
      primaryColor: req.body.primaryColor || '#000000',
      testField: 'test-value-' + Date.now()
    };

    console.log('Before save:', hotel.customization.theme);

    await hotel.save();

    console.log('Saved successfully');

    res.json({
      success: true,
      message: 'Theme test saved',
      data: hotel.customization.theme
    });
  } catch (error) {
    console.error('Theme test error:', error);
    res.status(500).json({
      error: 'Theme test failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/customization', req.user.hotelId._id.toString());

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const fieldName = file.fieldname;
    cb(null, `${fieldName}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.fieldname === 'logo' || file.fieldname === 'favicon') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for logo and favicon'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get current customization settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id).select('customization');

    res.json({
      success: true,
      data: hotel.customization || {}
    });
  } catch (error) {
    console.error('Get customization error:', error);
    res.status(500).json({ error: 'Failed to fetch customization settings' });
  }
});

// Update theme colors
router.put('/theme', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      sidebarColor,
      headerColor
    } = req.body;

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Update theme colors
    if (primaryColor) hotel.customization.theme.primaryColor = primaryColor;
    if (secondaryColor) hotel.customization.theme.secondaryColor = secondaryColor;
    if (accentColor) hotel.customization.theme.accentColor = accentColor;
    if (backgroundColor) hotel.customization.theme.backgroundColor = backgroundColor;
    if (textColor) hotel.customization.theme.textColor = textColor;
    if (sidebarColor) hotel.customization.theme.sidebarColor = sidebarColor;
    if (headerColor) hotel.customization.theme.headerColor = headerColor;

    await hotel.save();

    res.json({
      success: true,
      message: 'Theme colors updated successfully',
      data: hotel.customization.theme
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ error: 'Failed to update theme colors' });
  }
});

// Upload logo
router.post('/logo', authenticateToken, requirePermission('manage_settings'), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Delete old logo if exists
    if (hotel.customization.branding.logo) {
      const oldLogoPath = path.join(__dirname, '../../uploads/customization', req.user.hotelId._id.toString(), path.basename(hotel.customization.branding.logo));
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Update logo path
    const logoUrl = `/uploads/customization/${req.user.hotelId._id}/${req.file.filename}`;
    hotel.customization.branding.logo = logoUrl;

    await hotel.save();

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        logoUrl: logoUrl
      }
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Upload favicon
router.post('/favicon', authenticateToken, requirePermission('manage_settings'), upload.single('favicon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No favicon file uploaded' });
    }

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Delete old favicon if exists
    if (hotel.customization.branding.favicon) {
      const oldFaviconPath = path.join(__dirname, '../../uploads/customization', req.user.hotelId._id.toString(), path.basename(hotel.customization.branding.favicon));
      if (fs.existsSync(oldFaviconPath)) {
        fs.unlinkSync(oldFaviconPath);
      }
    }

    // Update favicon path
    const faviconUrl = `/uploads/customization/${req.user.hotelId._id}/${req.file.filename}`;
    hotel.customization.branding.favicon = faviconUrl;

    await hotel.save();

    res.json({
      success: true,
      message: 'Favicon uploaded successfully',
      data: {
        faviconUrl: faviconUrl
      }
    });
  } catch (error) {
    console.error('Upload favicon error:', error);
    res.status(500).json({ error: 'Failed to upload favicon' });
  }
});

// Update branding information
router.put('/branding', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const {
      logoText,
      companyName,
      tagline
    } = req.body;

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Update branding information
    if (logoText !== undefined) hotel.customization.branding.logoText = logoText;
    if (companyName !== undefined) hotel.customization.branding.companyName = companyName;
    if (tagline !== undefined) hotel.customization.branding.tagline = tagline;

    await hotel.save();

    res.json({
      success: true,
      message: 'Branding information updated successfully',
      data: hotel.customization.branding
    });
  } catch (error) {
    console.error('Update branding error:', error);
    res.status(500).json({ error: 'Failed to update branding information' });
  }
});

// Update dashboard layout
router.put('/dashboard', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const {
      layout,
      widgets,
      sidebarCollapsed,
      showWelcomeMessage
    } = req.body;

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Update dashboard settings
    if (layout) hotel.customization.dashboard.layout = layout;
    if (widgets) hotel.customization.dashboard.widgets = widgets;
    if (sidebarCollapsed !== undefined) hotel.customization.dashboard.sidebarCollapsed = sidebarCollapsed;
    if (showWelcomeMessage !== undefined) hotel.customization.dashboard.showWelcomeMessage = showWelcomeMessage;

    await hotel.save();

    res.json({
      success: true,
      message: 'Dashboard layout updated successfully',
      data: hotel.customization.dashboard
    });
  } catch (error) {
    console.error('Update dashboard layout error:', error);
    res.status(500).json({ error: 'Failed to update dashboard layout' });
  }
});

// Update UI preferences
router.put('/ui', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const {
      borderRadius,
      shadows,
      animations,
      density,
      fontSize
    } = req.body;

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Update UI preferences
    if (borderRadius) hotel.customization.ui.borderRadius = borderRadius;
    if (shadows !== undefined) hotel.customization.ui.shadows = shadows;
    if (animations !== undefined) hotel.customization.ui.animations = animations;
    if (density) hotel.customization.ui.density = density;
    if (fontSize) hotel.customization.ui.fontSize = fontSize;

    await hotel.save();

    res.json({
      success: true,
      message: 'UI preferences updated successfully',
      data: hotel.customization.ui
    });
  } catch (error) {
    console.error('Update UI preferences error:', error);
    res.status(500).json({ error: 'Failed to update UI preferences' });
  }
});

// Update custom CSS
router.put('/custom-css', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const { customCss } = req.body;

    if (customCss && customCss.length > 10000) {
      return res.status(400).json({ error: 'Custom CSS is too long (max 10,000 characters)' });
    }

    const hotel = await Hotel.findById(req.user.hotelId._id);

    hotel.customization.customCss = customCss || '';
    await hotel.save();

    res.json({
      success: true,
      message: 'Custom CSS updated successfully',
      data: {
        customCss: hotel.customization.customCss
      }
    });
  } catch (error) {
    console.error('Update custom CSS error:', error);
    res.status(500).json({ error: 'Failed to update custom CSS' });
  }
});

// Reset customization to defaults
router.post('/reset', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const { section } = req.body; // 'theme', 'branding', 'dashboard', 'ui', 'all'

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Delete uploaded files if resetting branding
    if (section === 'branding' || section === 'all') {
      const uploadPath = path.join(__dirname, '../../uploads/customization', req.user.hotelId._id.toString());
      if (fs.existsSync(uploadPath)) {
        fs.rmSync(uploadPath, { recursive: true, force: true });
      }
    }

    // Reset specific section or all
    switch (section) {
      case 'theme':
        hotel.customization.theme = {
          primaryColor: '#002D5B',
          secondaryColor: '#2EC4B6',
          accentColor: '#F9FAFB',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#FFFFFF',
          headerColor: '#FFFFFF'
        };
        break;

      case 'branding':
        hotel.customization.branding = {
          logo: null,
          logoText: null,
          favicon: null,
          companyName: null,
          tagline: null
        };
        break;

      case 'dashboard':
        hotel.customization.dashboard = {
          layout: 'grid',
          widgets: [],
          sidebarCollapsed: false,
          showWelcomeMessage: true
        };
        break;

      case 'ui':
        hotel.customization.ui = {
          borderRadius: 'medium',
          shadows: true,
          animations: true,
          density: 'comfortable',
          fontSize: 'medium'
        };
        break;

      case 'all':
      default:
        hotel.customization = {
          theme: {
            primaryColor: '#002D5B',
            secondaryColor: '#2EC4B6',
            accentColor: '#F9FAFB',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937',
            sidebarColor: '#FFFFFF',
            headerColor: '#FFFFFF'
          },
          branding: {
            logo: null,
            logoText: null,
            favicon: null,
            companyName: null,
            tagline: null
          },
          dashboard: {
            layout: 'grid',
            widgets: [],
            sidebarCollapsed: false,
            showWelcomeMessage: true
          },
          ui: {
            borderRadius: 'medium',
            shadows: true,
            animations: true,
            density: 'comfortable',
            fontSize: 'medium'
          },
          customCss: ''
        };
        break;
    }

    await hotel.save();

    res.json({
      success: true,
      message: `${section === 'all' ? 'All customization' : section} reset to defaults successfully`,
      data: hotel.customization
    });
  } catch (error) {
    console.error('Reset customization error:', error);
    res.status(500).json({ error: 'Failed to reset customization' });
  }
});

// Get available themes/presets
router.get('/presets', authenticateToken, async (req, res) => {
  try {
    const presets = [
      {
        id: 'sysora-default',
        name: 'Sysora Default',
        description: 'The default Sysora theme with midnight blue and mint colors',
        theme: {
          primaryColor: '#002D5B',
          secondaryColor: '#2EC4B6',
          accentColor: '#F9FAFB',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#FFFFFF',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        description: 'Calming ocean blue theme',
        theme: {
          primaryColor: '#0369A1',
          secondaryColor: '#0EA5E9',
          accentColor: '#F0F9FF',
          backgroundColor: '#FFFFFF',
          textColor: '#1E293B',
          sidebarColor: '#F8FAFC',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'forest-green',
        name: 'Forest Green',
        description: 'Natural forest green theme',
        theme: {
          primaryColor: '#166534',
          secondaryColor: '#22C55E',
          accentColor: '#F0FDF4',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#F9FDF9',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        description: 'Warm sunset orange theme',
        theme: {
          primaryColor: '#C2410C',
          secondaryColor: '#F97316',
          accentColor: '#FFF7ED',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#FFFBF5',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'royal-purple',
        name: 'Royal Purple',
        description: 'Elegant royal purple theme',
        theme: {
          primaryColor: '#7C3AED',
          secondaryColor: '#A855F7',
          accentColor: '#FAF5FF',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#FDFAFF',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'dark-mode',
        name: 'Dark Mode',
        description: 'Modern dark theme',
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#60A5FA',
          accentColor: '#1F2937',
          backgroundColor: '#111827',
          textColor: '#F9FAFB',
          sidebarColor: '#1F2937',
          headerColor: '#374151'
        }
      }
    ];

    res.json({
      success: true,
      data: presets
    });
  } catch (error) {
    console.error('Get presets error:', error);
    res.status(500).json({ error: 'Failed to fetch theme presets' });
  }
});

// Apply theme preset
router.post('/presets/:presetId', authenticateToken, requirePermission('manage_settings'), async (req, res) => {
  try {
    const { presetId } = req.params;

    // Get presets (hardcoded for now)
    const presets = [
      {
        id: 'sysora-default',
        name: 'سيسورا الافتراضي',
        description: 'الثيم الافتراضي لمنصة سيسورا',
        theme: {
          primaryColor: '#002D5B',
          secondaryColor: '#2EC4B6',
          accentColor: '#F9FAFB',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#F8FAFC',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'ocean-blue',
        name: 'أزرق المحيط',
        description: 'ثيم أزرق هادئ مستوحى من المحيط',
        theme: {
          primaryColor: '#1E40AF',
          secondaryColor: '#06B6D4',
          accentColor: '#F0F9FF',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#F8FAFC',
          headerColor: '#FFFFFF'
        }
      },
      {
        id: 'forest-green',
        name: 'أخضر الغابة',
        description: 'ثيم أخضر طبيعي مستوحى من الغابات',
        theme: {
          primaryColor: '#059669',
          secondaryColor: '#10B981',
          accentColor: '#F0FDF4',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          sidebarColor: '#F8FAFC',
          headerColor: '#FFFFFF'
        }
      }
    ];

    const preset = presets.find(p => p.id === presetId);
    if (!preset) {
      return res.status(404).json({ error: 'Theme preset not found' });
    }

    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Apply preset theme
    hotel.customization.theme = preset.theme;
    await hotel.save();

    res.json({
      success: true,
      message: `Theme preset "${preset.name}" applied successfully`,
      data: hotel.customization.theme
    });
  } catch (error) {
    console.error('Apply preset error:', error);
    res.status(500).json({ error: 'Failed to apply theme preset' });
  }
});

// Update theme
router.put('/theme', authenticateToken, async (req, res) => {
  try {
    const { primaryColor, secondaryColor, accentColor, backgroundColor, textColor, sidebarColor, headerColor } = req.body;

    console.log('Theme update request:', req.body);
    console.log('User hotel ID:', req.user.hotelId._id);

    const hotel = await Hotel.findById(req.user.hotelId._id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Initialize customization if it doesn't exist
    if (!hotel.customization) {
      hotel.customization = {};
    }

    // Initialize theme if it doesn't exist
    if (!hotel.customization.theme) {
      hotel.customization.theme = {
        primaryColor: '#002D5B',
        secondaryColor: '#2EC4B6',
        accentColor: '#F9FAFB',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        sidebarColor: '#F8FAFC',
        headerColor: '#FFFFFF'
      };
    }

    // Update theme colors
    if (primaryColor !== undefined) hotel.customization.theme.primaryColor = primaryColor;
    if (secondaryColor !== undefined) hotel.customization.theme.secondaryColor = secondaryColor;
    if (accentColor !== undefined) hotel.customization.theme.accentColor = accentColor;
    if (backgroundColor !== undefined) hotel.customization.theme.backgroundColor = backgroundColor;
    if (textColor !== undefined) hotel.customization.theme.textColor = textColor;
    if (sidebarColor !== undefined) hotel.customization.theme.sidebarColor = sidebarColor;
    if (headerColor !== undefined) hotel.customization.theme.headerColor = headerColor;

    console.log('Updated theme:', hotel.customization.theme);

    await hotel.save();

    console.log('Theme saved successfully');

    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: hotel.customization.theme
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({
      error: 'Failed to update theme',
      details: error.message
    });
  }
});

// Update branding settings
router.put('/branding', authenticateToken, async (req, res) => {
  try {
    const { companyName, description, phone, email, address, website, socialMedia } = req.body;

    console.log('Branding update request:', req.body);
    console.log('User hotel ID:', req.user.hotelId._id);

    const hotel = await Hotel.findById(req.user.hotelId._id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Initialize customization if it doesn't exist
    if (!hotel.customization) {
      hotel.customization = {};
    }

    // Initialize branding if it doesn't exist
    if (!hotel.customization.branding) {
      hotel.customization.branding = {
        logo: null,
        companyName: 'فندق سيسورا',
        description: 'فندق فاخر يقدم أفضل الخدمات الفندقية',
        phone: '+966501234567',
        email: 'info@sysora-hotel.com',
        address: 'الرياض، المملكة العربية السعودية',
        website: null,
        socialMedia: {
          facebook: null,
          twitter: null,
          instagram: null,
          linkedin: null
        }
      };
    }

    // Initialize socialMedia if it doesn't exist
    if (!hotel.customization.branding.socialMedia) {
      hotel.customization.branding.socialMedia = {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null
      };
    }

    // Update branding settings
    if (companyName !== undefined) hotel.customization.branding.companyName = companyName;
    if (description !== undefined) hotel.customization.branding.description = description;
    if (phone !== undefined) hotel.customization.branding.phone = phone;
    if (email !== undefined) hotel.customization.branding.email = email;
    if (address !== undefined) hotel.customization.branding.address = address;
    if (website !== undefined) hotel.customization.branding.website = website;
    if (socialMedia !== undefined) {
      hotel.customization.branding.socialMedia = {
        ...hotel.customization.branding.socialMedia,
        ...socialMedia
      };
    }

    console.log('Updated branding:', hotel.customization.branding);

    await hotel.save();

    console.log('Branding saved successfully');

    res.json({
      success: true,
      message: 'Branding settings updated successfully',
      data: hotel.customization.branding
    });
  } catch (error) {
    console.error('Update branding error:', error);
    res.status(500).json({
      error: 'Failed to update branding settings',
      details: error.message
    });
  }
});

// Update layout settings
router.put('/layout', authenticateToken, async (req, res) => {
  try {
    const { layout, sidebarPosition, widgets } = req.body;

    console.log('Layout update request:', req.body);
    console.log('User hotel ID:', req.user.hotelId._id);

    const hotel = await Hotel.findById(req.user.hotelId._id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Initialize customization if it doesn't exist
    if (!hotel.customization) {
      hotel.customization = {};
    }

    // Initialize dashboard if it doesn't exist
    if (!hotel.customization.dashboard) {
      hotel.customization.dashboard = {
        layout: 'grid',
        sidebarPosition: 'left',
        widgets: {
          showQuickStats: true,
          showRecentReservations: true,
          showQuickActions: true,
          showRevenueChart: true,
          showOccupancyChart: true
        }
      };
    }

    // Initialize widgets if it doesn't exist
    if (!hotel.customization.dashboard.widgets) {
      hotel.customization.dashboard.widgets = {
        showQuickStats: true,
        showRecentReservations: true,
        showQuickActions: true,
        showRevenueChart: true,
        showOccupancyChart: true
      };
    }

    // Update layout settings
    if (layout !== undefined) hotel.customization.dashboard.layout = layout;
    if (sidebarPosition !== undefined) hotel.customization.dashboard.sidebarPosition = sidebarPosition;
    if (widgets !== undefined) {
      hotel.customization.dashboard.widgets = {
        ...hotel.customization.dashboard.widgets,
        ...widgets
      };
    }

    console.log('Updated dashboard:', hotel.customization.dashboard);

    await hotel.save();

    console.log('Layout saved successfully');

    res.json({
      success: true,
      message: 'Layout settings updated successfully',
      data: hotel.customization.dashboard
    });
  } catch (error) {
    console.error('Update layout error:', error);
    res.status(500).json({
      error: 'Failed to update layout settings',
      details: error.message
    });
  }
});

// Update UI settings
router.put('/ui', authenticateToken, async (req, res) => {
  try {
    const { fontFamily, fontSize, borderRadius, animations, density, darkMode } = req.body;

    console.log('UI update request:', req.body);
    console.log('User hotel ID:', req.user.hotelId._id);

    const hotel = await Hotel.findById(req.user.hotelId._id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Initialize customization if it doesn't exist
    if (!hotel.customization) {
      hotel.customization = {};
    }

    // Initialize UI if it doesn't exist
    if (!hotel.customization.ui) {
      hotel.customization.ui = {
        fontFamily: 'Inter',
        fontSize: 'medium',
        borderRadius: 'medium',
        animations: {
          enabled: true,
          transitions: true,
          duration: 'normal'
        },
        density: 'comfortable',
        darkMode: false
      };
    }

    // Initialize animations if it doesn't exist
    if (!hotel.customization.ui.animations) {
      hotel.customization.ui.animations = {
        enabled: true,
        transitions: true,
        duration: 'normal'
      };
    }

    // Update UI settings
    if (fontFamily !== undefined) hotel.customization.ui.fontFamily = fontFamily;
    if (fontSize !== undefined) hotel.customization.ui.fontSize = fontSize;
    if (borderRadius !== undefined) hotel.customization.ui.borderRadius = borderRadius;
    if (density !== undefined) hotel.customization.ui.density = density;
    if (darkMode !== undefined) hotel.customization.ui.darkMode = darkMode;
    if (animations !== undefined) {
      hotel.customization.ui.animations = {
        ...hotel.customization.ui.animations,
        ...animations
      };
    }

    console.log('Updated UI:', hotel.customization.ui);

    await hotel.save();

    console.log('UI saved successfully');

    res.json({
      success: true,
      message: 'UI settings updated successfully',
      data: hotel.customization.ui
    });
  } catch (error) {
    console.error('Update UI error:', error);
    res.status(500).json({
      error: 'Failed to update UI settings',
      details: error.message
    });
  }
});

// Get all customization settings
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Initialize customization if it doesn't exist
    if (!hotel.customization) {
      hotel.customization = {};
    }

    // Initialize theme if it doesn't exist
    if (!hotel.customization.theme) {
      hotel.customization.theme = {
        primaryColor: '#002D5B',
        secondaryColor: '#2EC4B6',
        accentColor: '#F9FAFB',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        sidebarColor: '#F8FAFC',
        headerColor: '#FFFFFF'
      };
    }

    // Initialize branding if it doesn't exist
    if (!hotel.customization.branding) {
      hotel.customization.branding = {
        logo: null,
        companyName: 'فندق سيسورا',
        description: 'فندق فاخر يقدم أفضل الخدمات الفندقية',
        phone: '+966501234567',
        email: 'info@sysora-hotel.com',
        address: 'الرياض، المملكة العربية السعودية',
        website: null,
        socialMedia: {
          facebook: null,
          twitter: null,
          instagram: null,
          linkedin: null
        }
      };
    }

    // Initialize dashboard if it doesn't exist
    if (!hotel.customization.dashboard) {
      hotel.customization.dashboard = {
        layout: 'grid',
        sidebarPosition: 'left',
        widgets: {
          showQuickStats: true,
          showRecentReservations: true,
          showQuickActions: true,
          showRevenueChart: true,
          showOccupancyChart: true
        }
      };
    }

    // Initialize UI if it doesn't exist
    if (!hotel.customization.ui) {
      hotel.customization.ui = {
        fontFamily: 'Inter',
        fontSize: 'medium',
        borderRadius: 'medium',
        animations: {
          enabled: true,
          transitions: true,
          duration: 'normal'
        },
        density: 'comfortable',
        darkMode: false
      };
    }

    // Initialize customCss if it doesn't exist
    if (!hotel.customization.customCss) {
      hotel.customization.customCss = '';
    }

    // Save the initialized data
    await hotel.save();

    res.json({
      success: true,
      data: {
        theme: hotel.customization.theme,
        branding: hotel.customization.branding,
        dashboard: hotel.customization.dashboard,
        ui: hotel.customization.ui,
        customCss: hotel.customization.customCss
      }
    });
  } catch (error) {
    console.error('Get customization error:', error);
    res.status(500).json({ error: 'Failed to get customization settings' });
  }
});

// Reset all settings to default
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id);

    // Reset to default values
    hotel.customization = {
      theme: {
        primaryColor: '#002D5B',
        secondaryColor: '#2EC4B6',
        accentColor: '#F9FAFB',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        sidebarColor: '#FFFFFF',
        headerColor: '#FFFFFF'
      },
      branding: {
        logo: hotel.customization.branding.logo, // Keep existing logo
        companyName: 'فندق سيسورا',
        description: 'فندق فاخر يقدم أفضل الخدمات الفندقية',
        phone: '+966501234567',
        email: 'info@sysora-hotel.com',
        address: 'الرياض، المملكة العربية السعودية'
      },
      dashboard: {
        layout: 'grid',
        sidebarPosition: 'left',
        widgets: {
          showQuickStats: true,
          showRecentReservations: true,
          showQuickActions: true,
          showRevenueChart: true,
          showOccupancyChart: true
        }
      },
      ui: {
        fontFamily: 'Inter',
        fontSize: 'medium',
        borderRadius: 'medium',
        animations: {
          enabled: true,
          transitions: true,
          duration: 'normal'
        },
        density: 'comfortable',
        darkMode: false
      },
      customCss: ''
    };

    await hotel.save();

    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      data: hotel.customization
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

export default router;
