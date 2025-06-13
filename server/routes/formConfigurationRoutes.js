import express from 'express';
import {
  getFormConfiguration,
  updateFormConfiguration,
  getAllFormConfigurations,
  createFormConfiguration,
  deleteFormConfiguration,
  resetFormConfiguration,
  validateFormData,
  getFieldOptions
} from '../controllers/formConfigurationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Public routes (for all authenticated users)
router.get('/', getAllFormConfigurations);
router.get('/:formType', getFormConfiguration);
router.post('/:formType/validate', validateFormData);
router.get('/:formType/field/:fieldKey/options', getFieldOptions);

// Admin only routes
router.post('/', createFormConfiguration);
router.put('/:id', updateFormConfiguration);
router.delete('/:id', deleteFormConfiguration);
router.post('/:formType/reset', resetFormConfiguration);

export default router;
