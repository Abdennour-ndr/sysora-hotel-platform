import mongoose from 'mongoose';

const fieldConfigSchema = new mongoose.Schema({
  // Field Information
  fieldKey: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    enum: ['text', 'email', 'tel', 'number', 'select', 'textarea', 'date', 'checkbox', 'file'],
    required: true
  },
  
  // Field Configuration
  isRequired: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  
  // Display Configuration
  placeholder: String,
  helpText: String,
  order: {
    type: Number,
    default: 0
  },
  
  // Validation Rules
  validation: {
    minLength: Number,
    maxLength: Number,
    pattern: String,
    customMessage: String
  },
  
  // Options for select fields
  options: [{
    value: String,
    label: String,
    isDefault: Boolean
  }],
  
  // Conditional Display
  conditionalDisplay: {
    dependsOn: String, // field key that this field depends on
    condition: String, // 'equals', 'not_equals', 'contains', etc.
    value: String // value to compare against
  }
}, { _id: false });

const formConfigurationSchema = new mongoose.Schema({
  // Hotel Association
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  // Form Information
  formType: {
    type: String,
    enum: ['guest', 'room', 'booking', 'payment', 'service'],
    required: true
  },
  formName: {
    type: String,
    required: true
  },
  formDescription: String,
  
  // Form Configuration
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Fields Configuration
  fields: [fieldConfigSchema],
  
  // Form Settings
  settings: {
    allowDuplicates: {
      type: Boolean,
      default: false
    },
    autoSave: {
      type: Boolean,
      default: false
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    multiStep: {
      type: Boolean,
      default: false
    },
    steps: [{
      stepName: String,
      stepFields: [String] // array of field keys
    }]
  },
  
  // Notifications
  notifications: {
    onSubmit: {
      enabled: Boolean,
      recipients: [String], // email addresses
      template: String
    },
    onUpdate: {
      enabled: Boolean,
      recipients: [String],
      template: String
    }
  },
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
formConfigurationSchema.index({ hotelId: 1, formType: 1 });
formConfigurationSchema.index({ hotelId: 1, isActive: 1 });

// Virtual for field count
formConfigurationSchema.virtual('fieldCount').get(function() {
  return this.fields ? this.fields.length : 0;
});

// Virtual for required field count
formConfigurationSchema.virtual('requiredFieldCount').get(function() {
  return this.fields ? this.fields.filter(field => field.isRequired).length : 0;
});

// Methods
formConfigurationSchema.methods.getFieldByKey = function(fieldKey) {
  return this.fields.find(field => field.fieldKey === fieldKey);
};

formConfigurationSchema.methods.getVisibleFields = function() {
  return this.fields.filter(field => field.isVisible).sort((a, b) => a.order - b.order);
};

formConfigurationSchema.methods.getRequiredFields = function() {
  return this.fields.filter(field => field.isRequired && field.isVisible);
};

formConfigurationSchema.methods.validateFieldData = function(fieldKey, value) {
  const field = this.getFieldByKey(fieldKey);
  if (!field) return { isValid: false, message: 'Field not found' };
  
  // Check if required
  if (field.isRequired && (!value || value.toString().trim() === '')) {
    return { isValid: false, message: `${field.fieldName} مطلوب` };
  }
  
  // Check validation rules
  if (value && field.validation) {
    const { minLength, maxLength, pattern } = field.validation;
    
    if (minLength && value.length < minLength) {
      return { isValid: false, message: `${field.fieldName} يجب أن يكون ${minLength} أحرف على الأقل` };
    }
    
    if (maxLength && value.length > maxLength) {
      return { isValid: false, message: `${field.fieldName} يجب أن يكون ${maxLength} أحرف كحد أقصى` };
    }
    
    if (pattern && !new RegExp(pattern).test(value)) {
      return { isValid: false, message: field.validation.customMessage || `${field.fieldName} غير صحيح` };
    }
  }
  
  return { isValid: true };
};

// Static methods
formConfigurationSchema.statics.getDefaultGuestFields = function() {
  return [
    {
      fieldKey: 'firstName',
      fieldName: 'الاسم الأول',
      fieldType: 'text',
      isRequired: true,
      isVisible: true,
      placeholder: 'أحمد',
      order: 1,
      validation: { minLength: 2, maxLength: 50 }
    },
    {
      fieldKey: 'lastName',
      fieldName: 'الاسم الأخير',
      fieldType: 'text',
      isRequired: true,
      isVisible: true,
      placeholder: 'محمد',
      order: 2,
      validation: { minLength: 2, maxLength: 50 }
    },
    {
      fieldKey: 'email',
      fieldName: 'البريد الإلكتروني',
      fieldType: 'email',
      isRequired: false,
      isVisible: true,
      placeholder: 'ahmed@example.com',
      order: 3,
      validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
    },
    {
      fieldKey: 'phone',
      fieldName: 'رقم الهاتف',
      fieldType: 'tel',
      isRequired: true,
      isVisible: true,
      placeholder: '+213 555 123 456',
      order: 4,
      validation: { minLength: 10, maxLength: 15 }
    },
    {
      fieldKey: 'idNumber',
      fieldName: 'رقم الهوية',
      fieldType: 'text',
      isRequired: true,
      isVisible: true,
      placeholder: '1234567890',
      order: 5,
      validation: { minLength: 8, maxLength: 20 }
    },
    {
      fieldKey: 'idType',
      fieldName: 'نوع الهوية',
      fieldType: 'select',
      isRequired: true,
      isVisible: true,
      order: 6,
      options: [
        { value: 'national_id', label: 'هوية وطنية', isDefault: true },
        { value: 'passport', label: 'جواز سفر', isDefault: false },
        { value: 'driving_license', label: 'رخصة قيادة', isDefault: false }
      ]
    },
    {
      fieldKey: 'nationality',
      fieldName: 'الجنسية',
      fieldType: 'text',
      isRequired: false,
      isVisible: true,
      placeholder: 'الجزائر',
      order: 7
    },
    {
      fieldKey: 'dateOfBirth',
      fieldName: 'تاريخ الميلاد',
      fieldType: 'date',
      isRequired: false,
      isVisible: true,
      order: 8
    },
    {
      fieldKey: 'address',
      fieldName: 'العنوان',
      fieldType: 'textarea',
      isRequired: false,
      isVisible: true,
      placeholder: 'العنوان الكامل',
      order: 9
    },
    {
      fieldKey: 'vipStatus',
      fieldName: 'حالة VIP',
      fieldType: 'select',
      isRequired: false,
      isVisible: true,
      order: 10,
      options: [
        { value: 'none', label: 'عادي', isDefault: true },
        { value: 'silver', label: 'فضي', isDefault: false },
        { value: 'gold', label: 'ذهبي', isDefault: false },
        { value: 'platinum', label: 'بلاتيني', isDefault: false }
      ]
    },
    {
      fieldKey: 'notes',
      fieldName: 'ملاحظات',
      fieldType: 'textarea',
      isRequired: false,
      isVisible: true,
      placeholder: 'ملاحظات إضافية',
      order: 11
    }
  ];
};

formConfigurationSchema.statics.getDefaultRoomFields = function() {
  return [
    {
      fieldKey: 'number',
      fieldName: 'رقم الغرفة',
      fieldType: 'text',
      isRequired: true,
      isVisible: true,
      placeholder: '101',
      order: 1,
      validation: { minLength: 1, maxLength: 10 }
    },
    {
      fieldKey: 'name',
      fieldName: 'اسم الغرفة',
      fieldType: 'text',
      isRequired: false,
      isVisible: true,
      placeholder: 'غرفة الملك',
      order: 2,
      validation: { maxLength: 100 }
    },
    {
      fieldKey: 'type',
      fieldName: 'نوع الغرفة',
      fieldType: 'select',
      isRequired: true,
      isVisible: true,
      order: 3,
      options: [
        { value: 'standard', label: 'عادية', isDefault: true },
        { value: 'deluxe', label: 'فاخرة', isDefault: false },
        { value: 'suite', label: 'جناح', isDefault: false },
        { value: 'presidential', label: 'رئاسية', isDefault: false }
      ]
    },
    {
      fieldKey: 'floor',
      fieldName: 'الطابق',
      fieldType: 'number',
      isRequired: true,
      isVisible: true,
      placeholder: '1',
      order: 4,
      validation: { minLength: 1, maxLength: 2 }
    },
    {
      fieldKey: 'maxOccupancy',
      fieldName: 'السعة القصوى',
      fieldType: 'number',
      isRequired: true,
      isVisible: true,
      placeholder: '2',
      order: 5,
      validation: { minLength: 1, maxLength: 2 }
    },
    {
      fieldKey: 'bedCount',
      fieldName: 'عدد الأسرة',
      fieldType: 'number',
      isRequired: false,
      isVisible: true,
      placeholder: '1',
      order: 6
    },
    {
      fieldKey: 'bedType',
      fieldName: 'نوع السرير',
      fieldType: 'select',
      isRequired: false,
      isVisible: true,
      order: 7,
      options: [
        { value: 'single', label: 'مفرد', isDefault: false },
        { value: 'double', label: 'مزدوج', isDefault: true },
        { value: 'queen', label: 'كوين', isDefault: false },
        { value: 'king', label: 'كينغ', isDefault: false }
      ]
    },
    {
      fieldKey: 'basePrice',
      fieldName: 'السعر الأساسي',
      fieldType: 'number',
      isRequired: true,
      isVisible: true,
      placeholder: '5000',
      order: 8,
      validation: { minLength: 1 }
    },
    {
      fieldKey: 'size',
      fieldName: 'المساحة (م²)',
      fieldType: 'number',
      isRequired: false,
      isVisible: true,
      placeholder: '25',
      order: 9
    },
    {
      fieldKey: 'description',
      fieldName: 'الوصف',
      fieldType: 'textarea',
      isRequired: false,
      isVisible: true,
      placeholder: 'وصف الغرفة',
      order: 10
    },
    {
      fieldKey: 'amenities',
      fieldName: 'المرافق',
      fieldType: 'checkbox',
      isRequired: false,
      isVisible: true,
      order: 11,
      options: [
        { value: 'wifi', label: 'WiFi', isDefault: false },
        { value: 'ac', label: 'تكييف', isDefault: false },
        { value: 'tv', label: 'تلفزيون', isDefault: false },
        { value: 'minibar', label: 'ثلاجة صغيرة', isDefault: false },
        { value: 'safe', label: 'خزنة', isDefault: false },
        { value: 'balcony', label: 'شرفة', isDefault: false },
        { value: 'bathroom', label: 'حمام خاص', isDefault: false },
        { value: 'jacuzzi', label: 'جاكوزي', isDefault: false }
      ]
    }
  ];
};

const FormConfiguration = mongoose.model('FormConfiguration', formConfigurationSchema);

export default FormConfiguration;
