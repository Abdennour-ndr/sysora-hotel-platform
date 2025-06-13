import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useCurrency } from './CurrencyDisplay';

const EditRoomModal = ({ isOpen, onClose, onSave, room }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'standard',
    floor: 1,
    maxOccupancy: 2,
    basePrice: '',
    description: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Get current hotel currency
  const currency = useCurrency();

  const roomTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Presidential' }
  ];

  const amenitiesList = [
    'WiFi',
    'Air Conditioning',
    'Television',
    'Mini Fridge',
    'Safe',
    'Balcony',
    'Private Bathroom',
    'Jacuzzi',
    'Kitchenette'
  ];

  // Load room data when modal opens
  useEffect(() => {
    if (isOpen && room) {
      setFormData({
        number: room.number || '',
        type: room.type || 'standard',
        floor: room.floor || 1,
        maxOccupancy: room.maxOccupancy || 2,
        basePrice: room.basePrice || '',
        description: room.description || '',
        amenities: room.amenities || []
      });
      setErrors({});
    }
  }, [isOpen, room]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Price must be greater than zero';
    }

    if (formData.maxOccupancy < 1) {
      newErrors.maxOccupancy = 'Capacity must be at least one person';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${room._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          floor: parseInt(formData.floor),
          maxOccupancy: parseInt(formData.maxOccupancy),
          bedCount: Math.min(parseInt(formData.maxOccupancy), 2),
          bedType: 'single',
          name: `Room ${formData.number}`
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSave(data.data);
        handleClose();
        window.showToast && window.showToast('Room updated successfully', 'success');
      } else {
        window.showToast && window.showToast(data.message || 'Failed to update room', 'error');
      }
    } catch (error) {
      console.error('Update room error:', error);
      window.showToast && window.showToast('Error updating room', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      number: '',
      type: 'standard',
      floor: 1,
      maxOccupancy: 2,
      basePrice: '',
      description: '',
      amenities: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Room</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Example: 101"
              />
              {errors.number && (
                <p className="text-red-500 text-xs mt-1">{errors.number}</p>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Occupancy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                name="maxOccupancy"
                value={formData.maxOccupancy}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxOccupancy ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maxOccupancy && (
                <p className="text-red-500 text-xs mt-1">{errors.maxOccupancy}</p>
              )}
            </div>

            {/* Base Price */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price ({currency.nameEn || currency.name}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.basePrice ? 'border-red-500' : 'border-gray-300'
                  } ${currency.position === 'before' ? 'pl-12' : 'pr-12'}`}
                  placeholder={currency.code === 'DZD' ? 'Example: 15000.00' : 'Example: 150.00'}
                />
                <div className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500 ${
                  currency.position === 'before' ? 'left-3' : 'right-3'
                }`}>
                  {currency.symbol}
                </div>
              </div>
              {errors.basePrice && (
                <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Price in {currency.nameEn || currency.name} ({currency.code})
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room description and features..."
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities & Services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
