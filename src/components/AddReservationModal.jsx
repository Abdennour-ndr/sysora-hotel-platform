import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, User, Bed, CreditCard, Banknote, Smartphone } from 'lucide-react';
import QuickAddGuestModal from './QuickAddGuestModal';
import QuickAddRoomModal from './QuickAddRoomModal';
import PaymentDetailsCard from './PaymentDetailsCard';

const AddReservationModal = ({ isOpen, onClose, onSave }) => {
  // Function to get today's date
  const getTodayDate = () => {
    const today = new Date();
    // Ensure we get the local date, not UTC
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get tomorrow's date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Ensure we get the local date, not UTC
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    guestId: '',
    roomId: '',
    checkInDate: getTodayDate(), // Today's date automatically
    checkOutDate: getTomorrowDate(), // Tomorrow's date automatically
    adults: 1,
    children: 0,
    specialRequests: '',
    source: 'direct',
    // Payment fields
    paymentMethod: 'cash',
    paidAmount: 0,
    paymentStatus: 'pending'
  });
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGuests();
      fetchAvailableRooms();
    }
  }, [isOpen]);

  const fetchGuests = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/guests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setGuests(data.data.guests || []);
      }
    } catch (error) {
      console.error('Fetch guests error:', error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const params = new URLSearchParams();
      params.append('available', 'true');

      if (formData.checkInDate && formData.checkOutDate) {
        params.append('checkIn', formData.checkInDate);
        params.append('checkOut', formData.checkOutDate);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRooms(data.data.rooms || []);
        // Immediate calculation - no timeout
        if (formData.roomId && formData.checkInDate && formData.checkOutDate) {
          calculateTotal();
        }
      }
    } catch (error) {
      console.error('Fetch rooms error:', error);
    }
  };

  const getRoomPrice = (roomId) => {
    const selectedRoom = rooms.find(room => room._id === roomId);
    return selectedRoom ? selectedRoom.basePrice : 0;
  };

  const calculateTotal = useCallback(() => {
    // Quick validation
    if (!formData.roomId || !formData.checkInDate || !formData.checkOutDate || rooms.length === 0) {
      setTotalAmount(0);
      return;
    }

    // Find room
    const room = rooms.find(r => r._id === formData.roomId);
    if (!room || !room.basePrice) {
      setTotalAmount(0);
      return;
    }

    // Calculate nights
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      setTotalAmount(0);
      return;
    }

    // Calculate total
    const baseAmount = nights * room.basePrice;
    const taxes = baseAmount * 0.10; // 10% tax
    const total = baseAmount + taxes;

    setTotalAmount(total);
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate, rooms]);

  // Single useEffect for all calculation triggers
  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If check-in date is changed, automatically update check-out date
    if (name === 'checkInDate' && value) {
      const checkInDate = new Date(value);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);

      setFormData(prev => ({
        ...prev,
        [name]: value,
        checkOutDate: checkOutDate.toISOString().split('T')[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Refresh available rooms when dates change
    if (name === 'checkInDate' || name === 'checkOutDate') {
      setTimeout(() => fetchAvailableRooms(), 100);
    }

    // Immediate calculation for relevant fields
    if (name === 'roomId' || name === 'checkInDate' || name === 'checkOutDate') {
      // Direct call - no timeout needed
      calculateTotal();
    }
  };



  const validateForm = () => {
    const newErrors = {};

    if (!formData.guestId) {
      newErrors.guestId = 'Please select a guest';
    }

    if (!formData.roomId) {
      newErrors.roomId = 'Please select a room';
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);

      if (checkIn >= checkOut) {
        newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }

      // Fix date comparison - compare dates only, not time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = new Date(formData.checkInDate);
      checkInDate.setHours(0, 0, 0, 0);

      // Allow today's date and future dates only
      if (checkInDate < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past';
      }
    }

    if (formData.adults < 1) {
      newErrors.adults = 'At least one adult is required';
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestId: formData.guestId,
          roomId: formData.roomId,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          adults: parseInt(formData.adults) || 1,
          children: parseInt(formData.children) || 0,
          infants: 0, // default
          roomRate: getRoomPrice(formData.roomId),
          specialRequests: formData.specialRequests || '',
          notes: '',
          source: formData.source || 'direct',
          paymentMethod: formData.paymentMethod || 'cash',
          paidAmount: parseFloat(formData.paidAmount) || 0,
          paymentStatus: formData.paidAmount > totalAmount ? 'overpaid' : formData.paidAmount === totalAmount ? 'paid' : formData.paidAmount > 0 ? 'partial' : 'pending'
        })
      });

      const data = await response.json();
      console.log('Add reservation response:', { status: response.status, data });
      console.log('Sent data:', {
        guestId: formData.guestId,
        roomId: formData.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        adults: parseInt(formData.adults) || 1,
        children: parseInt(formData.children) || 0,
        infants: 0,
        roomRate: getRoomPrice(formData.roomId),
        specialRequests: formData.specialRequests || '',
        notes: '',
        source: formData.source || 'direct',
        paymentMethod: 'cash'
      });

      if (response.ok && data.success) {
        onSave(data.data);
        handleClose();
        window.showToast && window.showToast('Reservation created successfully', 'success');
      } else {
        console.error('Add reservation failed:', data);

        // Display detailed error message
        let errorMessage = 'Failed to create reservation';

        if (data.error === 'Validation failed' && data.details) {
          const missingFields = data.details.map(d => d.field).join(', ');
          errorMessage = `Missing required fields: ${missingFields}`;
        } else if (data.error === 'Duplicate reservation number') {
          errorMessage = 'Duplicate reservation number, please try again';
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }

        window.showToast && window.showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Add reservation error:', error);
      window.showToast && window.showToast('Error creating reservation: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = (newGuest) => {
    setGuests(prev => [...prev, newGuest]);
    setFormData(prev => ({ ...prev, guestId: newGuest._id }));
    setShowAddGuestModal(false);
  };

  const handleAddRoom = (newRoom) => {
    setRooms(prev => [...prev, newRoom]);
    setFormData(prev => ({ ...prev, roomId: newRoom._id }));
    setShowAddRoomModal(false);
  };

  const handleClose = () => {
    setFormData({
      guestId: '',
      roomId: '',
      checkInDate: getTodayDate(), // Reset to today's date
      checkOutDate: getTomorrowDate(), // Reset to tomorrow's date
      adults: 1,
      children: 0,
      specialRequests: '',
      source: 'direct',
      // Reset payment fields
      paymentMethod: 'cash',
      paidAmount: 0,
      paymentStatus: 'pending'
    });
    setErrors({});
    setTotalAmount(0);
    setShowAddGuestModal(false);
    setShowAddRoomModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Reservation</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guest Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest *
              </label>
              <div className="space-y-2">
                <select
                  name="guestId"
                  value={formData.guestId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.guestId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Guest</option>
                  {guests.map(guest => (
                    <option key={guest._id} value={guest._id}>
                      {guest.firstName} {guest.lastName} - {guest.email}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 w-full justify-center"
                >
                  <User className="w-4 h-4" />
                  <span>Add New Customer</span>
                </button>
              </div>
              {errors.guestId && (
                <p className="text-red-500 text-xs mt-1">{errors.guestId}</p>
              )}
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room *
              </label>
              <div className="space-y-2">
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.roomId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      Room {room.number} - {room.type} ({room.basePrice} DZD/night)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 w-full justify-center"
                >
                  <Bed className="w-4 h-4" />
                  <span>Add New Room</span>
                </button>
              </div>
              {errors.roomId && (
                <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>
              )}
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date *
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.checkInDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.checkInDate && (
                <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date *
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.checkOutDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.checkOutDate && (
                <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>
              )}
            </div>

            {/* Adults */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults *
              </label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.adults ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.adults && (
                <p className="text-red-500 text-xs mt-1">{errors.adults}</p>
              )}
            </div>

            {/* Children */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children
              </label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requests for the guest..."
            />
          </div>

          {/* Payment Section */}
          {formData.roomId && formData.checkInDate && formData.checkOutDate && (
            <div className="space-y-4">


              {/* Enhanced Payment Details Card */}
              <PaymentDetailsCard
                totalAmount={totalAmount || 0}
                paidAmount={parseFloat(formData.paidAmount) || 0}
                currency="DZD"
                size="default"
                showPercentage={true}
                showIcons={true}
              />

              {/* Payment Method and Amount Input */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Details
                </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'cash', label: 'Cash', icon: Banknote, color: 'text-green-600 bg-green-50 border-green-200' },
                      { value: 'card', label: 'Credit Card', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                      { value: 'transfer', label: 'Bank Transfer', icon: Smartphone, color: 'text-purple-600 bg-purple-50 border-purple-200' }
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.paymentMethod === method.value;
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
                          className={`w-full p-3 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                            isSelected
                              ? method.color + ' ring-2 ring-offset-2 ring-current'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-gray-400'}`} />
                          <span className={`font-medium ${isSelected ? 'text-current' : 'text-gray-600'}`}>
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                      placeholder="0.00"
                      title="You can enter an amount higher than the total amount"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      DZD
                    </div>
                  </div>

                  {/* Quick payment buttons */}
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paidAmount: 0 }))}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      No Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paidAmount: totalAmount / 2 }))}
                      className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      Half Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paidAmount: totalAmount }))}
                      className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                    >
                      Full Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paidAmount: totalAmount * 1.1 }))}
                      className="px-3 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                    >
                      With Extra
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

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
              disabled={loading || !formData.guestId || !formData.roomId || !formData.checkInDate || !formData.checkOutDate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Create Reservation'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Add Guest Modal */}
      <QuickAddGuestModal
        isOpen={showAddGuestModal}
        onClose={() => setShowAddGuestModal(false)}
        onSave={handleAddGuest}
      />

      {/* Quick Add Room Modal */}
      <QuickAddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onSave={handleAddRoom}
      />
    </div>
  );
};

export default AddReservationModal;
