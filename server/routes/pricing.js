import express from 'express';
import { SubscriptionPlan, Feature } from '../models/SubscriptionPlan.js';
import DiscountCode from '../models/DiscountCode.js';
import Hotel from '../models/Hotel.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';
import { createSampleData } from '../seeders/createSampleData.js';

const router = express.Router();

// ============================================================================
// DEVELOPMENT HELPER - CREATE SAMPLE DATA
// ============================================================================

// Create sample data (for development only)
router.post('/create-sample-data', async (req, res) => {
  try {
    const result = await createSampleData();
    res.json({
      success: true,
      message: 'Sample data created successfully',
      data: result
    });
  } catch (error) {
    console.error('Create sample data error:', error);
    res.status(500).json({ error: 'Failed to create sample data' });
  }
});

// ============================================================================
// SUBSCRIPTION PLANS MANAGEMENT
// ============================================================================

// Get all subscription plans (public)
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({
      'display.isVisible': true,
      isActive: true
    })
    .sort({ 'display.order': 1 })
    .populate('features.featureKey');

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get single plan details
router.get('/plans/:slug', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      slug: req.params.slug,
      isActive: true
    }).populate('features.featureKey');

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Admin: Get all plans (including hidden)
router.get('/admin/plans', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find()
      .sort({ 'display.order': 1 })
      .populate('createdBy', 'fullName')
      .populate('updatedBy', 'fullName');

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Admin get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Admin: Create new plan
router.post('/admin/plans', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const planData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const plan = new SubscriptionPlan(planData);
    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Admin: Update plan
router.put('/admin/plans/:id', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Admin: Delete plan
router.delete('/admin/plans/:id', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// ============================================================================
// FEATURES MANAGEMENT
// ============================================================================

// Get all features
router.get('/features', async (req, res) => {
  try {
    const features = await Feature.find({ isActive: true })
      .sort({ category: 1, order: 1 });

    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// Admin: Create feature
router.post('/admin/features', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();

    res.status(201).json({
      success: true,
      message: 'Feature created successfully',
      data: feature
    });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(500).json({ error: 'Failed to create feature' });
  }
});

// Admin: Update feature
router.put('/admin/features/:id', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.json({
      success: true,
      message: 'Feature updated successfully',
      data: feature
    });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// ============================================================================
// DISCOUNT CODES MANAGEMENT
// ============================================================================

// Validate discount code
router.post('/discount/validate', async (req, res) => {
  try {
    const { code, planType, billingCycle, amount } = req.body;

    const discount = await DiscountCode.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!discount) {
      return res.status(404).json({ error: 'Invalid discount code' });
    }

    if (!discount.isValid) {
      return res.status(400).json({ error: 'Discount code has expired or reached usage limit' });
    }

    // Check minimum amount requirement
    if (amount < discount.eligibility.minimumAmount) {
      return res.status(400).json({
        error: `Minimum amount required: ${discount.eligibility.minimumAmount}`
      });
    }

    const calculation = discount.calculateDiscount(amount);

    res.json({
      success: true,
      data: {
        code: discount.code,
        name: discount.name,
        description: discount.description,
        type: discount.type,
        value: discount.value,
        calculation
      }
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    res.status(500).json({ error: 'Failed to validate discount code' });
  }
});

// Admin: Get all discount codes
router.get('/admin/discounts', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const discounts = await DiscountCode.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName')
      .populate('updatedBy', 'fullName');

    res.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('Get discounts error:', error);
    res.status(500).json({ error: 'Failed to fetch discount codes' });
  }
});

// Admin: Create discount code
router.post('/admin/discounts', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const discountData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const discount = new DiscountCode(discountData);
    await discount.save();

    res.status(201).json({
      success: true,
      message: 'Discount code created successfully',
      data: discount
    });
  } catch (error) {
    console.error('Create discount error:', error);
    res.status(500).json({ error: 'Failed to create discount code' });
  }
});

// Admin: Update discount code
router.put('/admin/discounts/:id', authenticateToken, requirePermission('manage_pricing'), async (req, res) => {
  try {
    const discount = await DiscountCode.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    );

    if (!discount) {
      return res.status(404).json({ error: 'Discount code not found' });
    }

    res.json({
      success: true,
      message: 'Discount code updated successfully',
      data: discount
    });
  } catch (error) {
    console.error('Update discount error:', error);
    res.status(500).json({ error: 'Failed to update discount code' });
  }
});

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

// Get current subscription details
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id)
      .populate('subscription.planId');

    res.json({
      success: true,
      data: {
        subscription: hotel.subscription,
        plan: hotel.subscription.planId
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Check feature access
router.get('/features/check/:featureKey', authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId._id)
      .populate('subscription.planId');

    const plan = hotel.subscription.planId;
    const hasAccess = plan ? plan.hasFeature(req.params.featureKey) : false;
    const limit = plan ? plan.getFeatureLimit(req.params.featureKey) : 0;

    res.json({
      success: true,
      data: {
        hasAccess,
        limit,
        planName: plan ? plan.name : 'Trial'
      }
    });
  } catch (error) {
    console.error('Check feature error:', error);
    res.status(500).json({ error: 'Failed to check feature access' });
  }
});

export default router;
