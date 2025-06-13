import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Clock,
  Save,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const GeneralSettingsFixed = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    hotelName: '',
    description: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    starRating: 5,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    maxOccupancy: 4,
    currency: 'USD',
    timezone: 'America/New_York',
    logo: null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSettings({
          hotelName: 'Grand Hotel',
          description: 'A luxury hotel in the heart of the city',
          address: '123 Main Street',
          city: 'New York',
          country: 'United States',
          phone: '+1 555 123 4567',
          email: 'info@grandhotel.com',
          website: 'https://grandhotel.com',
          starRating: 5,
          checkInTime: '15:00',
          checkOutTime: '11:00',
          maxOccupancy: 4,
          currency: 'USD',
          timezone: 'America/New_York',
          logo: null
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }

    if (!settings.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(settings.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!settings.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully');
      
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    if (onSettingsChange) {
      onSettingsChange();
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('logo', e.target.result);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hotel Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Hotel Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Name *
            </label>
            <input
              type="text"
              value={settings.hotelName}
              onChange={(e) => handleChange('hotelName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent ${
                errors.hotelName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter hotel name"
            />
            {errors.hotelName && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.hotelName}</span>
              </p>
            )}
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Star Rating
            </label>
            <select
              value={settings.starRating}
              onChange={(e) => handleChange('starRating', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map(stars => (
                <option key={stars} value={stars}>
                  {stars} Star{stars > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="Brief description of your hotel..."
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Hotel Logo</h3>
        </div>

        <div className="flex items-center space-x-6">
          {/* Logo Preview */}
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Hotel Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Upload Button */}
          <div>
            <label className="flex items-center space-x-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG up to 2MB. Recommended: 200x200px
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="New York"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={settings.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="United States"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+1 555 123 4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="info@hotel.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              placeholder="https://hotel.com"
            />
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Operational Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Check-in Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Time
            </label>
            <input
              type="time"
              value={settings.checkInTime}
              onChange={(e) => handleChange('checkInTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            />
          </div>

          {/* Check-out Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Time
            </label>
            <input
              type="time"
              value={settings.checkOutTime}
              onChange={(e) => handleChange('checkOutTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            />
          </div>

          {/* Max Occupancy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Occupancy
            </label>
            <input
              type="number"
              value={settings.maxOccupancy}
              onChange={(e) => handleChange('maxOccupancy', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
              min="1"
              max="20"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-primary focus:border-transparent"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="DZD">Algerian Dinar (DZD)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettingsFixed;
