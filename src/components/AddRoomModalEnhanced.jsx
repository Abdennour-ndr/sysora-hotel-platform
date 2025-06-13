import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Bed,
  Home,
  Users,
  DollarSign,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  Zap,
  Activity
} from 'lucide-react';
import { useCurrency } from './CurrencyDisplay';
import ImageUploadManager from './ImageUploadManager';

const AddRoomModalEnhanced = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: 'standard',
    category: 'standard',
    floor: 1,
    maxOccupancy: 2,
    bedCount: 1,
    bedType: 'single',
    basePrice: '',
    size: '',
    description: '',
    amenities: [],
    images: [],
    features: {
      hasBalcony: false,
      hasKitchen: false,
      hasLivingRoom: false,
      smokingAllowed: false,
      petFriendly: false,
      accessible: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [roomNumberExists, setRoomNumberExists] = useState(false);
  const [checkingRoomNumber, setCheckingRoomNumber] = useState(false);

  // Get current hotel currency
  const currency = useCurrency();

  const steps = [
    { id: 1, title: 'Basic Info', icon: Home, description: 'Room number, type, and location' },
    { id: 2, title: 'Capacity & Beds', icon: Users, description: 'Occupancy and bed configuration' },
    { id: 3, title: 'Pricing & Size', icon: DollarSign, description: 'Price and room dimensions' },
    { id: 4, title: 'Images', icon: Eye, description: 'Upload room photos' },
    { id: 5, title: 'Amenities & Features', icon: Star, description: 'Services and special features' }
  ];

  const roomTypes = [
    { value: 'standard', label: 'Standard', icon: Bed, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'deluxe', label: 'Deluxe', icon: Star, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { value: 'suite', label: 'Suite', icon: Home, color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'presidential', label: 'Presidential', icon: Shield, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
  ];

  const roomCategories = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const bedTypes = [
    { value: 'single', label: 'Single Bed', icon: '🛏️' },
    { value: 'double', label: 'Double Bed', icon: '🛏️' },
    { value: 'queen', label: 'Queen Bed', icon: '🛏️' },
    { value: 'king', label: 'King Bed', icon: '🛏️' },
    { value: 'sofa', label: 'Sofa Bed', icon: '🛋️' }
  ];

  const amenitiesList = [
    { name: 'WiFi', icon: Wifi, category: 'connectivity' },
    { name: 'Air Conditioning', icon: Activity, category: 'comfort' },
    { name: 'Television', icon: Activity, category: 'entertainment' },
    { name: 'Mini Fridge', icon: Activity, category: 'convenience' },
    { name: 'Safe', icon: Shield, category: 'security' },
    { name: 'Balcony', icon: Eye, category: 'view' },
    { name: 'Private Bathroom', icon: Activity, category: 'comfort' },
    { name: 'Jacuzzi', icon: Activity, category: 'luxury' },
    { name: 'Kitchenette', icon: Coffee, category: 'convenience' }
  ];

  // Check if room number exists
  const checkRoomNumber = async (roomNumber) => {
    if (!roomNumber.trim()) {
      setRoomNumberExists(false);
      return;
    }

    setCheckingRoomNumber(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms?search=${roomNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const exists = data.data.rooms.some(room => room.number === roomNumber);
        setRoomNumberExists(exists);
      }
    } catch (error) {
      console.error('Check room number error:', error);
    } finally {
      setCheckingRoomNumber(false);
    }
  };

  // Debounced room number check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.number) {
        checkRoomNumber(formData.number);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.number]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('features.')) {
      const featureName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [featureName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-generate room name if not manually set
    if (name === 'number' && value) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `Room ${value}`
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

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.number.trim()) {
          newErrors.number = 'Room number is required';
        } else if (roomNumberExists) {
          newErrors.number = 'Room number already exists';
        }
        if (!formData.name.trim()) {
          newErrors.name = 'Room name is required';
        }
        break;
      case 2:
        if (formData.maxOccupancy < 1) {
          newErrors.maxOccupancy = 'Capacity must be at least one person';
        }
        if (formData.bedCount < 1) {
          newErrors.bedCount = 'At least one bed is required';
        }
        break;
      case 3:
        if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
          newErrors.basePrice = 'Price must be greater than zero';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps
    let allValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (!allValid || roomNumberExists) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');

      // Prepare form data for file upload
      const formDataToSend = new FormData();

      // Add basic room data
      const roomData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        floor: parseInt(formData.floor),
        maxOccupancy: parseInt(formData.maxOccupancy),
        bedCount: parseInt(formData.bedCount),
        size: formData.size ? parseFloat(formData.size) : null
      };

      // Remove images from room data as they'll be sent separately
      delete roomData.images;

      console.log('🏨 Preparing room data:', roomData);
      console.log('📸 Images to upload:', formData.images.length);

      // Add room data as JSON string
      formDataToSend.append('roomData', JSON.stringify(roomData));
      console.log('✅ Room data added to FormData');

      // Add images
      formData.images.forEach((image, index) => {
        console.log(`📸 Adding image ${index + 1}:`, {
          name: image.name,
          size: image.file.size,
          isPrimary: image.isPrimary
        });

        formDataToSend.append('images', image.file);
        formDataToSend.append(`imageData_${index}`, JSON.stringify({
          isPrimary: image.isPrimary,
          name: image.name
        }));
      });

      console.log('✅ All images added to FormData');

      console.log('📡 Sending request to server...');

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formDataToSend
      });

      console.log('📡 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ Room created successfully:', {
          roomId: data.data._id,
          roomNumber: data.data.number,
          imagesCount: data.data.images?.length || 0
        });

        onSave(data.data);
        handleClose();
        window.showToast && window.showToast(`Room added successfully with ${data.data.images?.length || 0} images`, 'success');
      } else {
        console.error('❌ Failed to create room:', data);
        window.showToast && window.showToast(data.message || 'Failed to add room', 'error');
      }
    } catch (error) {
      console.error('Add room error:', error);
      window.showToast && window.showToast('Error adding room', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up image URLs to prevent memory leaks
    formData.images.forEach(image => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
      }
    });

    setFormData({
      number: '',
      name: '',
      type: 'standard',
      category: 'standard',
      floor: 1,
      maxOccupancy: 2,
      bedCount: 1,
      bedType: 'single',
      basePrice: '',
      size: '',
      description: '',
      amenities: [],
      images: [],
      features: {
        hasBalcony: false,
        hasKitchen: false,
        hasLivingRoom: false,
        smokingAllowed: false,
        petFriendly: false,
        accessible: false
      }
    });
    setCurrentStep(1);
    setErrors({});
    setRoomNumberExists(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bed className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Room</h2>
                <p className="text-blue-100">Create a new room for your hotel</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${
                    currentStep >= step.id ? 'text-white' : 'text-blue-300'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      currentStep >= step.id
                        ? 'bg-emerald-400 text-blue-900'
                        : 'bg-white/20'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="hidden md:block">
                      <div className="font-semibold text-sm">{step.title}</div>
                      <div className="text-xs opacity-80">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-emerald-400' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Room Information</h3>
                  <p className="text-gray-600">Enter the basic details for your new room</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                          errors.number ? 'border-red-500' : roomNumberExists ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 101, A-205"
                      />
                      {checkingRoomNumber && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-sysora-mint border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {!checkingRoomNumber && formData.number && !roomNumberExists && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                      {roomNumberExists && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {errors.number && (
                      <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                    )}
                    {roomNumberExists && (
                      <p className="text-red-500 text-sm mt-1">This room number already exists</p>
                    )}
                  </div>

                  {/* Room Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Deluxe Ocean View"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Room Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {roomTypes.map(type => (
                        <label key={type.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-4 border-2 rounded-xl transition-all ${
                            formData.type === type.value
                              ? type.color
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <type.icon className="w-5 h-5" />
                              <span className="font-medium">{type.label}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Floor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor
                    </label>
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Room Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    {roomCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Step 1 of 4: Basic Information
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Capacity & Beds */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Capacity & Bed Configuration</h3>
                  <p className="text-gray-600">Set the occupancy and bed details for this room</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Max Occupancy */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maximum Occupancy *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="maxOccupancy"
                        value={formData.maxOccupancy}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                          errors.maxOccupancy ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Number of guests"
                      />
                    </div>
                    {errors.maxOccupancy && (
                      <p className="text-red-500 text-sm mt-1">{errors.maxOccupancy}</p>
                    )}
                  </div>

                  {/* Bed Count */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Beds *
                    </label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="bedCount"
                        value={formData.bedCount}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                          errors.bedCount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Number of beds"
                      />
                    </div>
                    {errors.bedCount && (
                      <p className="text-red-500 text-sm mt-1">{errors.bedCount}</p>
                    )}
                  </div>
                </div>

                {/* Bed Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bed Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {bedTypes.map(bed => (
                      <label key={bed.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="bedType"
                          value={bed.value}
                          checked={formData.bedType === bed.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl transition-all text-center ${
                          formData.bedType === bed.value
                            ? 'border-emerald-500 bg-emerald-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="text-2xl mb-2">{bed.icon}</div>
                          <div className="font-medium text-sm">{bed.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Step 2 of 4: Capacity & Beds
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Size */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pricing & Room Size</h3>
                  <p className="text-gray-600">Set the base price and room dimensions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Base Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Base Price ({currency.nameEn || currency.name}) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                          errors.basePrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={currency.code === 'DZD' ? '15000.00' : '150.00'}
                      />
                    </div>
                    {errors.basePrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Price per night in {currency.nameEn || currency.name} ({currency.code})
                    </p>
                  </div>

                  {/* Room Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room Size (m²)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="e.g., 25.5"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Room area in square meters
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                    placeholder="Describe the room features, view, and special characteristics..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Detailed description for guests
                  </p>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Step 3 of 4: Pricing & Size
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Images */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Room Images</h3>
                  <p className="text-gray-600">Upload photos to showcase your room</p>
                </div>

                <ImageUploadManager
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={10}
                  maxSizePerImage={5}
                />

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Step 4 of 5: Room Images
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Amenities & Features */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Amenities & Special Features</h3>
                  <p className="text-gray-600">Select the amenities and features available in this room</p>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Room Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map(amenity => (
                      <label key={amenity.name} className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.name)}
                          onChange={() => handleAmenityChange(amenity.name)}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl transition-all ${
                          formData.amenities.includes(amenity.name)
                            ? 'border-emerald-500 bg-emerald-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <amenity.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{amenity.name}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Special Features
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.hasBalcony"
                        checked={formData.features.hasBalcony}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Eye className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Has Balcony</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.hasKitchen"
                        checked={formData.features.hasKitchen}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Coffee className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Has Kitchen</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.hasLivingRoom"
                        checked={formData.features.hasLivingRoom}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Home className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Has Living Room</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.smokingAllowed"
                        checked={formData.features.smokingAllowed}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Smoking Allowed</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.petFriendly"
                        checked={formData.features.petFriendly}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Pet Friendly</span>
                    </label>

                    <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="features.accessible"
                        checked={formData.features.accessible}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Wheelchair Accessible</span>
                    </label>
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Room Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Room:</span>
                      <span className="ml-2 font-medium">{formData.name || formData.number}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{roomTypes.find(t => t.value === formData.type)?.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacity:</span>
                      <span className="ml-2 font-medium">{formData.maxOccupancy} guests</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Beds:</span>
                      <span className="ml-2 font-medium">{formData.bedCount} {bedTypes.find(b => b.value === formData.bedType)?.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <span className="ml-2 font-medium">{currency.symbol}{formData.basePrice} {currency.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Images:</span>
                      <span className="ml-2 font-medium">{formData.images.length} uploaded</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amenities:</span>
                      <span className="ml-2 font-medium">{formData.amenities.length} selected</span>
                    </div>
                  </div>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Step 5 of 5: Final Review
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || roomNumberExists}
                    className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Creating...' : 'Create Room'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Enhanced Footer with Navigation */}
        <div className="border-t-2 border-gray-200 bg-white shadow-lg">
          {/* Step Progress Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-emerald-50">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : currentStep === step.id - 1
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-xs font-semibold ${
                        currentStep >= step.id ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        Step {step.id}
                      </div>
                      <div className={`text-xs ${
                        currentStep >= step.id ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? 'bg-emerald-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <div className="flex items-center">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-xl hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>
                ) : (
                  <div className="w-24"></div> // Spacer
                )}
              </div>

              {/* Step Counter */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 font-medium">
                  Step {currentStep} of {steps.length}
                </div>
                <div className="flex space-x-1">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentStep >= step.id ? 'bg-emerald-500 scale-110' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Next/Submit Button */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
                  >
                    <span>Next Step</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || roomNumberExists}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 disabled:transform-none"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? 'Creating Room...' : 'Create Room'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModalEnhanced;
