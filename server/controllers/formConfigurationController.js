import FormConfiguration from '../models/FormConfiguration.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { AppError } from '../utils/appError.js';

// @desc    Get form configuration
// @route   GET /api/form-config/:formType
// @access  Private
export const getFormConfiguration = asyncHandler(async (req, res) => {
  const { formType } = req.params;
  const hotelId = req.user.hotelId;

  let formConfig = await FormConfiguration.findOne({
    hotelId,
    formType,
    isActive: true
  });

  // If no configuration exists, create default one
  if (!formConfig) {
    formConfig = await createDefaultFormConfiguration(hotelId, formType, req.user._id);
  }

  res.status(200).json({
    success: true,
    data: formConfig
  });
});

// @desc    Update form configuration
// @route   PUT /api/form-config/:id
// @access  Private (Admin only)
export const updateFormConfiguration = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotelId = req.user.hotelId;

  // Check if user has admin permissions
  if (!req.user.permissions.includes('manage_settings') && req.user.role !== 'admin') {
    throw new AppError('ليس لديك صلاحية لتعديل إعدادات النماذج', 403);
  }

  const formConfig = await FormConfiguration.findOne({
    _id: id,
    hotelId
  });

  if (!formConfig) {
    throw new AppError('إعدادات النموذج غير موجودة', 404);
  }

  // Update configuration
  const updatedConfig = await FormConfiguration.findByIdAndUpdate(
    id,
    {
      ...req.body,
      updatedBy: req.user._id
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedConfig,
    message: 'تم تحديث إعدادات النموذج بنجاح'
  });
});

// @desc    Get all form configurations for hotel
// @route   GET /api/form-config
// @access  Private
export const getAllFormConfigurations = asyncHandler(async (req, res) => {
  const hotelId = req.user.hotelId;

  const formConfigs = await FormConfiguration.find({
    hotelId,
    isActive: true
  }).sort({ formType: 1 });

  res.status(200).json({
    success: true,
    count: formConfigs.length,
    data: formConfigs
  });
});

// @desc    Create form configuration
// @route   POST /api/form-config
// @access  Private (Admin only)
export const createFormConfiguration = asyncHandler(async (req, res) => {
  const hotelId = req.user.hotelId;

  // Check if user has admin permissions
  if (!req.user.permissions.includes('manage_settings') && req.user.role !== 'admin') {
    throw new AppError('ليس لديك صلاحية لإنشاء إعدادات النماذج', 403);
  }

  // Check if configuration already exists
  const existingConfig = await FormConfiguration.findOne({
    hotelId,
    formType: req.body.formType,
    isActive: true
  });

  if (existingConfig) {
    throw new AppError('إعدادات هذا النموذج موجودة بالفعل', 400);
  }

  const formConfig = await FormConfiguration.create({
    ...req.body,
    hotelId,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: formConfig,
    message: 'تم إنشاء إعدادات النموذج بنجاح'
  });
});

// @desc    Delete form configuration
// @route   DELETE /api/form-config/:id
// @access  Private (Admin only)
export const deleteFormConfiguration = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotelId = req.user.hotelId;

  // Check if user has admin permissions
  if (!req.user.permissions.includes('manage_settings') && req.user.role !== 'admin') {
    throw new AppError('ليس لديك صلاحية لحذف إعدادات النماذج', 403);
  }

  const formConfig = await FormConfiguration.findOne({
    _id: id,
    hotelId
  });

  if (!formConfig) {
    throw new AppError('إعدادات النموذج غير موجودة', 404);
  }

  // Soft delete by setting isActive to false
  await FormConfiguration.findByIdAndUpdate(id, {
    isActive: false,
    updatedBy: req.user._id
  });

  res.status(200).json({
    success: true,
    message: 'تم حذف إعدادات النموذج بنجاح'
  });
});

// @desc    Reset form configuration to default
// @route   POST /api/form-config/:formType/reset
// @access  Private (Admin only)
export const resetFormConfiguration = asyncHandler(async (req, res) => {
  const { formType } = req.params;
  const hotelId = req.user.hotelId;

  // Check if user has admin permissions
  if (!req.user.permissions.includes('manage_settings') && req.user.role !== 'admin') {
    throw new AppError('ليس لديك صلاحية لإعادة تعيين إعدادات النماذج', 403);
  }

  // Deactivate existing configuration
  await FormConfiguration.updateMany(
    { hotelId, formType },
    { isActive: false, updatedBy: req.user._id }
  );

  // Create new default configuration
  const formConfig = await createDefaultFormConfiguration(hotelId, formType, req.user._id);

  res.status(200).json({
    success: true,
    data: formConfig,
    message: 'تم إعادة تعيين إعدادات النموذج إلى الافتراضية'
  });
});

// @desc    Validate form data against configuration
// @route   POST /api/form-config/:formType/validate
// @access  Private
export const validateFormData = asyncHandler(async (req, res) => {
  const { formType } = req.params;
  const { formData } = req.body;
  const hotelId = req.user.hotelId;

  const formConfig = await FormConfiguration.findOne({
    hotelId,
    formType,
    isActive: true
  });

  if (!formConfig) {
    throw new AppError('إعدادات النموذج غير موجودة', 404);
  }

  const errors = {};
  const visibleFields = formConfig.getVisibleFields();

  // Validate each field
  for (const field of visibleFields) {
    const value = formData[field.fieldKey];
    const validation = formConfig.validateFieldData(field.fieldKey, value);
    
    if (!validation.isValid) {
      errors[field.fieldKey] = validation.message;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  res.status(200).json({
    success: true,
    data: {
      isValid,
      errors,
      validatedFields: visibleFields.map(f => f.fieldKey)
    }
  });
});

// @desc    Get field options for select fields
// @route   GET /api/form-config/:formType/field/:fieldKey/options
// @access  Private
export const getFieldOptions = asyncHandler(async (req, res) => {
  const { formType, fieldKey } = req.params;
  const hotelId = req.user.hotelId;

  const formConfig = await FormConfiguration.findOne({
    hotelId,
    formType,
    isActive: true
  });

  if (!formConfig) {
    throw new AppError('إعدادات النموذج غير موجودة', 404);
  }

  const field = formConfig.getFieldByKey(fieldKey);

  if (!field) {
    throw new AppError('الحقل غير موجود', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      fieldKey,
      fieldName: field.fieldName,
      fieldType: field.fieldType,
      options: field.options || []
    }
  });
});

// Helper function to create default form configuration
const createDefaultFormConfiguration = async (hotelId, formType, userId) => {
  let defaultFields = [];
  let formName = '';
  let formDescription = '';

  switch (formType) {
    case 'guest':
      defaultFields = FormConfiguration.getDefaultGuestFields();
      formName = 'نموذج إضافة ضيف';
      formDescription = 'نموذج لإضافة ضيف جديد إلى النظام';
      break;
    case 'room':
      defaultFields = FormConfiguration.getDefaultRoomFields();
      formName = 'نموذج إضافة غرفة';
      formDescription = 'نموذج لإضافة غرفة جديدة إلى الفندق';
      break;
    default:
      throw new AppError('نوع النموذج غير مدعوم', 400);
  }

  const formConfig = await FormConfiguration.create({
    hotelId,
    formType,
    formName,
    formDescription,
    fields: defaultFields,
    createdBy: userId,
    settings: {
      allowDuplicates: false,
      autoSave: false,
      showProgress: false,
      multiStep: false
    }
  });

  return formConfig;
};

export default {
  getFormConfiguration,
  updateFormConfiguration,
  getAllFormConfigurations,
  createFormConfiguration,
  deleteFormConfiguration,
  resetFormConfiguration,
  validateFormData,
  getFieldOptions
};
