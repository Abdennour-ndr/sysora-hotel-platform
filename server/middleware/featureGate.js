import { SubscriptionPlan } from '../models/SubscriptionPlan.js';
import Hotel from '../models/Hotel.js';

// Middleware to check if user has access to a specific feature
export const requireFeature = (featureKey) => {
  return async (req, res, next) => {
    try {
      // Get user's hotel and subscription
      const hotel = await Hotel.findById(req.user.hotelId._id)
        .populate('subscription.planId');

      if (!hotel) {
        return res.status(404).json({ 
          error: 'Hotel not found',
          featureRequired: featureKey
        });
      }

      // Check if trial is expired
      if (hotel.subscription.status === 'trial') {
        const now = new Date();
        const trialEnd = new Date(hotel.subscription.endDate);
        
        if (now > trialEnd) {
          return res.status(403).json({
            error: 'Trial expired',
            message: 'Your trial period has expired. Please upgrade to continue using this feature.',
            featureRequired: featureKey,
            upgradeRequired: true
          });
        }
      }

      // Check if subscription is active
      if (!['trial', 'active'].includes(hotel.subscription.status)) {
        return res.status(403).json({
          error: 'Subscription inactive',
          message: 'Your subscription is not active. Please update your payment method.',
          featureRequired: featureKey,
          upgradeRequired: true
        });
      }

      // Get the subscription plan
      const plan = hotel.subscription.planId;
      
      if (!plan) {
        // Default trial features
        const trialFeatures = [
          'basic_rooms',
          'basic_reservations',
          'basic_guests',
          'basic_dashboard'
        ];
        
        if (!trialFeatures.includes(featureKey)) {
          return res.status(403).json({
            error: 'Feature not available in trial',
            message: 'This feature is not available in the trial version.',
            featureRequired: featureKey,
            upgradeRequired: true
          });
        }
      } else {
        // Check if feature is included in the plan
        const hasFeature = plan.hasFeature(featureKey);
        
        if (!hasFeature) {
          return res.status(403).json({
            error: 'Feature not included in plan',
            message: `This feature is not included in your ${plan.name} plan.`,
            featureRequired: featureKey,
            currentPlan: plan.name,
            upgradeRequired: true
          });
        }
      }

      // Add subscription info to request for further use
      req.subscription = hotel.subscription;
      req.plan = plan;
      
      next();
    } catch (error) {
      console.error('Feature gate error:', error);
      res.status(500).json({ 
        error: 'Failed to check feature access',
        featureRequired: featureKey
      });
    }
  };
};

// Middleware to check usage limits
export const checkUsageLimit = (featureKey, currentUsage) => {
  return async (req, res, next) => {
    try {
      const plan = req.plan;
      
      if (!plan) {
        // Trial limits
        const trialLimits = {
          'rooms': 10,
          'users': 2,
          'reservations_per_month': 50,
          'storage_mb': 100
        };
        
        const limit = trialLimits[featureKey];
        if (limit && currentUsage >= limit) {
          return res.status(403).json({
            error: 'Usage limit exceeded',
            message: `You have reached the limit of ${limit} for ${featureKey} in the trial version.`,
            featureRequired: featureKey,
            currentUsage,
            limit,
            upgradeRequired: true
          });
        }
      } else {
        const limit = plan.getFeatureLimit(featureKey);
        
        // -1 means unlimited
        if (limit !== -1 && currentUsage >= limit) {
          return res.status(403).json({
            error: 'Usage limit exceeded',
            message: `You have reached the limit of ${limit} for ${featureKey} in your ${plan.name} plan.`,
            featureRequired: featureKey,
            currentUsage,
            limit,
            currentPlan: plan.name,
            upgradeRequired: true
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Usage limit check error:', error);
      res.status(500).json({ 
        error: 'Failed to check usage limit',
        featureRequired: featureKey
      });
    }
  };
};

// Middleware to add subscription context to all requests
export const addSubscriptionContext = async (req, res, next) => {
  try {
    if (req.user && req.user.hotelId) {
      const hotel = await Hotel.findById(req.user.hotelId._id)
        .populate('subscription.planId');
      
      if (hotel) {
        req.subscription = hotel.subscription;
        req.plan = hotel.subscription.planId;
        
        // Add helper methods
        req.hasFeature = (featureKey) => {
          if (!req.plan) {
            // Trial features
            const trialFeatures = [
              'basic_rooms',
              'basic_reservations', 
              'basic_guests',
              'basic_dashboard'
            ];
            return trialFeatures.includes(featureKey);
          }
          return req.plan.hasFeature(featureKey);
        };
        
        req.getFeatureLimit = (featureKey) => {
          if (!req.plan) {
            const trialLimits = {
              'rooms': 10,
              'users': 2,
              'reservations_per_month': 50,
              'storage_mb': 100
            };
            return trialLimits[featureKey] || 0;
          }
          return req.plan.getFeatureLimit(featureKey);
        };
        
        req.isTrialExpired = () => {
          if (hotel.subscription.status !== 'trial') return false;
          return new Date() > new Date(hotel.subscription.endDate);
        };
      }
    }
    
    next();
  } catch (error) {
    console.error('Add subscription context error:', error);
    next(); // Continue even if this fails
  }
};

// Feature definitions for easy reference
export const FEATURES = {
  // Core Hotel Management
  BASIC_ROOMS: 'basic_rooms',
  ADVANCED_ROOMS: 'advanced_rooms',
  ROOM_TYPES: 'room_types',
  ROOM_AMENITIES: 'room_amenities',
  
  // Reservations
  BASIC_RESERVATIONS: 'basic_reservations',
  ADVANCED_RESERVATIONS: 'advanced_reservations',
  ONLINE_BOOKING: 'online_booking',
  CHANNEL_MANAGER: 'channel_manager',
  
  // Guest Management
  BASIC_GUESTS: 'basic_guests',
  GUEST_PROFILES: 'guest_profiles',
  GUEST_COMMUNICATION: 'guest_communication',
  GUEST_PREFERENCES: 'guest_preferences',
  
  // Payments & Billing
  BASIC_PAYMENTS: 'basic_payments',
  ADVANCED_BILLING: 'advanced_billing',
  PAYMENT_GATEWAY: 'payment_gateway',
  INVOICING: 'invoicing',
  
  // Reports & Analytics
  BASIC_REPORTS: 'basic_reports',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  CUSTOM_REPORTS: 'custom_reports',
  REVENUE_MANAGEMENT: 'revenue_management',
  
  // Integrations
  API_ACCESS: 'api_access',
  THIRD_PARTY_INTEGRATIONS: 'third_party_integrations',
  WEBHOOK_SUPPORT: 'webhook_support',
  
  // Advanced Features
  MULTI_PROPERTY: 'multi_property',
  WHITE_LABEL: 'white_label',
  CUSTOM_BRANDING: 'custom_branding',
  PRIORITY_SUPPORT: 'priority_support',
  
  // Future Modules
  RESTAURANT_POS: 'restaurant_pos',
  INVENTORY_MANAGEMENT: 'inventory_management',
  STAFF_MANAGEMENT: 'staff_management',
  MAINTENANCE_TRACKING: 'maintenance_tracking'
};

// Usage limit keys
export const USAGE_LIMITS = {
  ROOMS: 'rooms',
  USERS: 'users',
  RESERVATIONS_PER_MONTH: 'reservations_per_month',
  STORAGE_MB: 'storage_mb',
  API_CALLS_PER_MONTH: 'api_calls_per_month'
};

export default {
  requireFeature,
  checkUsageLimit,
  addSubscriptionContext,
  FEATURES,
  USAGE_LIMITS
};
