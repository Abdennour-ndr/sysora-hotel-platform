// Advanced Settings API Service
import { toast } from 'react-hot-toast';

class SettingsAPI {
  constructor() {
    this.baseURL = '/api/settings';
    this.cache = new Map();
    this.subscribers = new Set();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Event system for real-time updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, data) {
    this.subscribers.forEach(callback => callback(event, data));
  }

  // Advanced error handling with retry logic
  async withRetry(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await this.delay(this.retryDelay * Math.pow(2, i));
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cache management
  getCacheKey(section, id = null) {
    return id ? `${section}:${id}` : section;
  }

  setCache(key, data, ttl = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Validation system
  validateSettingsData(section, data) {
    const validators = {
      general: this.validateGeneralSettings,
      forms: this.validateFormSettings,
      notifications: this.validateNotificationSettings,
      security: this.validateSecuritySettings,
      appearance: this.validateAppearanceSettings,
      language: this.validateLanguageSettings
    };

    const validator = validators[section];
    if (!validator) {
      throw new Error(`No validator found for section: ${section}`);
    }

    return validator(data);
  }

  validateGeneralSettings(data) {
    const errors = {};

    if (!data.hotelName || data.hotelName.trim().length < 2) {
      errors.hotelName = 'Hotel name must be at least 2 characters';
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.phone || data.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (data.starRating < 1 || data.starRating > 5) {
      errors.starRating = 'Star rating must be between 1 and 5';
    }

    if (data.maxOccupancy < 1 || data.maxOccupancy > 20) {
      errors.maxOccupancy = 'Max occupancy must be between 1 and 20';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateFormSettings(data) {
    const errors = {};

    Object.keys(data).forEach(formType => {
      const form = data[formType];
      if (!form.fields || !Array.isArray(form.fields)) {
        errors[formType] = 'Fields must be an array';
        return;
      }

      form.fields.forEach((field, index) => {
        if (!field.name || field.name.trim().length < 1) {
          errors[`${formType}.fields.${index}.name`] = 'Field name is required';
        }

        if (!field.key || field.key.trim().length < 1) {
          errors[`${formType}.fields.${index}.key`] = 'Field key is required';
        }

        if (!field.type || !['text', 'email', 'tel', 'number', 'date', 'select', 'textarea', 'checkbox', 'radio'].includes(field.type)) {
          errors[`${formType}.fields.${index}.type`] = 'Invalid field type';
        }
      });
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateNotificationSettings(data) {
    const errors = {};
    const validChannels = ['email', 'sms', 'push'];
    const validEvents = ['newBooking', 'paymentReceived', 'checkIn', 'checkOut', 'cancellation'];

    validChannels.forEach(channel => {
      if (!data[channel] || typeof data[channel] !== 'object') {
        errors[channel] = `${channel} settings must be an object`;
        return;
      }

      validEvents.forEach(event => {
        if (typeof data[channel][event] !== 'boolean') {
          errors[`${channel}.${event}`] = `${event} must be a boolean value`;
        }
      });
    });

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateSecuritySettings(data) {
    const errors = {};

    if (typeof data.twoFactorAuth !== 'boolean') {
      errors.twoFactorAuth = 'Two-factor auth must be a boolean';
    }

    if (!data.sessionTimeout || data.sessionTimeout < 5 || data.sessionTimeout > 480) {
      errors.sessionTimeout = 'Session timeout must be between 5 and 480 minutes';
    }

    if (!data.loginAttempts || data.loginAttempts < 3 || data.loginAttempts > 10) {
      errors.loginAttempts = 'Login attempts must be between 3 and 10';
    }

    if (data.passwordPolicy) {
      if (data.passwordPolicy.minLength < 6 || data.passwordPolicy.minLength > 50) {
        errors['passwordPolicy.minLength'] = 'Password length must be between 6 and 50 characters';
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateAppearanceSettings(data) {
    const errors = {};

    if (!data.primaryColor || !/^#[0-9A-F]{6}$/i.test(data.primaryColor)) {
      errors.primaryColor = 'Primary color must be a valid hex color';
    }

    if (!data.theme || !['light', 'dark', 'auto'].includes(data.theme)) {
      errors.theme = 'Theme must be light, dark, or auto';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  validateLanguageSettings(data) {
    const errors = {};

    if (!data.defaultLanguage || !['en', 'fr', 'ar'].includes(data.defaultLanguage)) {
      errors.defaultLanguage = 'Default language must be en, fr, or ar';
    }

    if (!data.currency || !['USD', 'EUR', 'GBP', 'DZD', 'CAD'].includes(data.currency)) {
      errors.currency = 'Invalid currency code';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // API Methods
  async getAllSettings() {
    const cacheKey = 'all-settings';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    return this.withRetry(async () => {
      // Simulate API call - replace with actual API
      await this.delay(800);
      
      const settings = JSON.parse(localStorage.getItem('hotelSettings') || '{}');
      
      this.setCache(cacheKey, settings);
      this.notify('settings:loaded', settings);
      
      return {
        success: true,
        data: settings,
        timestamp: new Date().toISOString()
      };
    });
  }

  async getSettingsSection(section) {
    const cacheKey = this.getCacheKey(section);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    return this.withRetry(async () => {
      await this.delay(500);
      
      const allSettings = JSON.parse(localStorage.getItem('hotelSettings') || '{}');
      const sectionData = allSettings[section] || {};
      
      this.setCache(cacheKey, sectionData);
      this.notify('section:loaded', { section, data: sectionData });
      
      return {
        success: true,
        data: sectionData,
        section,
        timestamp: new Date().toISOString()
      };
    });
  }

  async updateSettingsSection(section, data) {
    // Validate data before saving
    const validation = this.validateSettingsData(section, data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`);
    }

    return this.withRetry(async () => {
      await this.delay(1000);
      
      // Get current settings
      const currentSettings = JSON.parse(localStorage.getItem('hotelSettings') || '{}');
      
      // Update section
      const updatedSettings = {
        ...currentSettings,
        [section]: data
      };
      
      // Save to localStorage
      localStorage.setItem('hotelSettings', JSON.stringify(updatedSettings));
      
      // Update cache
      this.setCache(this.getCacheKey(section), data);
      this.setCache('all-settings', updatedSettings);
      
      // Notify subscribers
      this.notify('section:updated', { section, data });
      this.notify('settings:changed', updatedSettings);
      
      return {
        success: true,
        data,
        section,
        timestamp: new Date().toISOString()
      };
    });
  }

  async saveAllSettings(settings) {
    // Validate all sections
    for (const [section, data] of Object.entries(settings)) {
      const validation = this.validateSettingsData(section, data);
      if (!validation.isValid) {
        throw new Error(`Validation failed for ${section}: ${JSON.stringify(validation.errors)}`);
      }
    }

    return this.withRetry(async () => {
      await this.delay(1500);
      
      // Save to localStorage
      localStorage.setItem('hotelSettings', JSON.stringify(settings));
      
      // Update cache
      this.clearCache();
      this.setCache('all-settings', settings);
      
      // Notify subscribers
      this.notify('settings:saved', settings);
      
      return {
        success: true,
        data: settings,
        timestamp: new Date().toISOString()
      };
    });
  }

  async resetSettings() {
    return this.withRetry(async () => {
      await this.delay(800);
      
      // Clear localStorage
      localStorage.removeItem('hotelSettings');
      
      // Clear cache
      this.clearCache();
      
      // Notify subscribers
      this.notify('settings:reset', {});
      
      return {
        success: true,
        message: 'Settings reset successfully',
        timestamp: new Date().toISOString()
      };
    });
  }

  async exportSettings() {
    const settings = JSON.parse(localStorage.getItem('hotelSettings') || '{}');
    
    const exportData = {
      settings,
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        hotelName: settings.general?.hotelName || 'Unknown Hotel'
      }
    };

    return {
      success: true,
      data: exportData,
      filename: `hotel-settings-${new Date().toISOString().split('T')[0]}.json`
    };
  }

  async importSettings(importData) {
    try {
      // Validate import data structure
      if (!importData.settings || typeof importData.settings !== 'object') {
        throw new Error('Invalid import data structure');
      }

      // Validate each section
      for (const [section, data] of Object.entries(importData.settings)) {
        const validation = this.validateSettingsData(section, data);
        if (!validation.isValid) {
          throw new Error(`Validation failed for ${section}: ${JSON.stringify(validation.errors)}`);
        }
      }

      // Save imported settings
      await this.saveAllSettings(importData.settings);

      return {
        success: true,
        message: 'Settings imported successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Backup and restore functionality
  async createBackup(name = null) {
    const settings = JSON.parse(localStorage.getItem('hotelSettings') || '{}');
    const backupName = name || `backup-${new Date().toISOString()}`;
    
    const backup = {
      name: backupName,
      settings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    // Save backup to localStorage
    const backups = JSON.parse(localStorage.getItem('settingsBackups') || '[]');
    backups.unshift(backup);
    
    // Keep only last 10 backups
    if (backups.length > 10) {
      backups.splice(10);
    }
    
    localStorage.setItem('settingsBackups', JSON.stringify(backups));

    this.notify('backup:created', backup);

    return {
      success: true,
      backup,
      message: 'Backup created successfully'
    };
  }

  async getBackups() {
    const backups = JSON.parse(localStorage.getItem('settingsBackups') || '[]');
    return {
      success: true,
      data: backups
    };
  }

  async restoreBackup(backupName) {
    const backups = JSON.parse(localStorage.getItem('settingsBackups') || '[]');
    const backup = backups.find(b => b.name === backupName);
    
    if (!backup) {
      throw new Error('Backup not found');
    }

    await this.saveAllSettings(backup.settings);

    this.notify('backup:restored', backup);

    return {
      success: true,
      message: 'Backup restored successfully',
      backup
    };
  }
}

// Create singleton instance
const settingsAPI = new SettingsAPI();

export default settingsAPI;
