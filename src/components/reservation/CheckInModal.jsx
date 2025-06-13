import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  CreditCard, 
  Key, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Printer,
  Camera,
  FileText,
  DollarSign
} from 'lucide-react';

const CheckInModal = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [checkInData, setCheckInData] = useState({
    actualCheckInTime: new Date().toISOString().slice(0, 16),
    guestIdVerified: false,
    idDocumentType: '',
    idDocumentNumber: '',
    additionalGuests: [],
    specialRequests: '',
    keyCardsIssued: 1,
    depositAmount: 0,
    depositMethod: 'cash',
    notes: '',
    roomCondition: 'clean',
    amenitiesExplained: false,
    wifiCredentialsProvided: false,
    emergencyContactsProvided: false
  });
  const [errors, setErrors] = useState({});
  const [showPaymentSection, setShowPaymentSection] = useState(false);

  useEffect(() => {
    if (isOpen && reservation) {
      // Pre-fill data based on reservation
      setCheckInData(prev => ({
        ...prev,
        specialRequests: reservation.specialRequests || '',
        keyCardsIssued: Math.max(1, (reservation.adults || 1) + (reservation.children || 0)),
        depositAmount: calculateDepositAmount(reservation)
      }));
    }
  }, [isOpen, reservation]);

  const calculateDepositAmount = (reservation) => {
    // Calculate suggested deposit (typically 1 night rate or fixed amount)
    const nightlyRate = reservation.roomRate || 0;
    const suggestedDeposit = Math.max(nightlyRate, 5000); // Minimum 5000 DZD
    return suggestedDeposit;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCheckInData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addAdditionalGuest = () => {
    setCheckInData(prev => ({
      ...prev,
      additionalGuests: [
        ...prev.additionalGuests,
        { name: '', idType: '', idNumber: '', relationship: '' }
      ]
    }));
  };

  const updateAdditionalGuest = (index, field, value) => {
    setCheckInData(prev => ({
      ...prev,
      additionalGuests: prev.additionalGuests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      )
    }));
  };

  const removeAdditionalGuest = (index) => {
    setCheckInData(prev => ({
      ...prev,
      additionalGuests: prev.additionalGuests.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!checkInData.guestIdVerified) {
      newErrors.guestIdVerified = 'Guest ID verification is required';
    }

    if (!checkInData.idDocumentType) {
      newErrors.idDocumentType = 'ID document type is required';
    }

    if (!checkInData.idDocumentNumber) {
      newErrors.idDocumentNumber = 'ID document number is required';
    }

    if (checkInData.keyCardsIssued < 1) {
      newErrors.keyCardsIssued = 'At least one key card must be issued';
    }

    if (checkInData.depositAmount < 0) {
      newErrors.depositAmount = 'Deposit amount cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...checkInData,
            actualCheckInDate: new Date(checkInData.actualCheckInTime)
          })
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Guest checked in successfully', 'success');
        onUpdate(data.data);
        onClose();
      } else {
        window.showToast && window.showToast(data.message || 'Failed to check in guest', 'error');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      window.showToast && window.showToast('Error during check-in process', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintKeyCard = () => {
    // Simulate key card printing
    window.showToast && window.showToast('Key card printing initiated', 'info');
  };

  const handlePrintWelcomeLetter = () => {
    // Simulate welcome letter printing
    window.showToast && window.showToast('Welcome letter printing initiated', 'info');
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Guest Check-In</h2>
              <p className="text-blue-100">
                {reservation.guestId?.firstName} {reservation.guestId?.lastName} - Room {reservation.roomId?.number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Guest Information */}
            <div className="space-y-6">
              {/* Guest Verification */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Guest Verification
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="guestIdVerified"
                      name="guestIdVerified"
                      checked={checkInData.guestIdVerified}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="guestIdVerified" className="text-sm font-medium text-gray-700">
                      Guest identity verified
                    </label>
                  </div>
                  {errors.guestIdVerified && (
                    <p className="text-red-500 text-xs">{errors.guestIdVerified}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Document Type *
                      </label>
                      <select
                        name="idDocumentType"
                        value={checkInData.idDocumentType}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.idDocumentType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Type</option>
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="driving_license">Driving License</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.idDocumentType && (
                        <p className="text-red-500 text-xs mt-1">{errors.idDocumentType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Number *
                      </label>
                      <input
                        type="text"
                        name="idDocumentNumber"
                        value={checkInData.idDocumentNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.idDocumentNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter ID number"
                      />
                      {errors.idDocumentNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.idDocumentNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Guests */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Additional Guests
                  </h3>
                  <button
                    type="button"
                    onClick={addAdditionalGuest}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Guest
                  </button>
                </div>

                {checkInData.additionalGuests.map((guest, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 mb-3 border">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={guest.name}
                        onChange={(e) => updateAdditionalGuest(index, 'name', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={guest.relationship}
                        onChange={(e) => updateAdditionalGuest(index, 'relationship', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={guest.idType}
                        onChange={(e) => updateAdditionalGuest(index, 'idType', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="">ID Type</option>
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="ID Number"
                        value={guest.idNumber}
                        onChange={(e) => updateAdditionalGuest(index, 'idNumber', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalGuest(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Check-in Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Check-in Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Check-in Time
                    </label>
                    <input
                      type="datetime-local"
                      name="actualCheckInTime"
                      value={checkInData.actualCheckInTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Cards to Issue
                    </label>
                    <input
                      type="number"
                      name="keyCardsIssued"
                      value={checkInData.keyCardsIssued}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.keyCardsIssued ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.keyCardsIssued && (
                      <p className="text-red-500 text-xs mt-1">{errors.keyCardsIssued}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Condition
                    </label>
                    <select
                      name="roomCondition"
                      value={checkInData.roomCondition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="clean">Clean & Ready</option>
                      <option value="maintenance">Needs Maintenance</option>
                      <option value="cleaning">Needs Cleaning</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Services & Payment */}
            <div className="space-y-6">
              {/* Services Checklist */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                  Services Checklist
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="amenitiesExplained"
                      name="amenitiesExplained"
                      checked={checkInData.amenitiesExplained}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="amenitiesExplained" className="text-sm text-gray-700">
                      Hotel amenities explained to guest
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="wifiCredentialsProvided"
                      name="wifiCredentialsProvided"
                      checked={checkInData.wifiCredentialsProvided}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="wifiCredentialsProvided" className="text-sm text-gray-700">
                      WiFi credentials provided
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="emergencyContactsProvided"
                      name="emergencyContactsProvided"
                      checked={checkInData.emergencyContactsProvided}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="emergencyContactsProvided" className="text-sm text-gray-700">
                      Emergency contacts provided
                    </label>
                  </div>
                </div>
              </div>

              {/* Deposit & Payment */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                  Deposit & Payment
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deposit Amount (DZD)
                      </label>
                      <input
                        type="number"
                        name="depositAmount"
                        value={checkInData.depositAmount}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.depositAmount ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.depositAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.depositAmount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        name="depositMethod"
                        value={checkInData.depositMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_payment">Mobile Payment</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPaymentSection(!showPaymentSection)}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {showPaymentSection ? 'Hide' : 'Show'} Payment Details
                  </button>
                </div>
              </div>

              {/* Special Requests & Notes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Special Requests & Notes
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={checkInData.specialRequests}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requests from guest..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Notes
                    </label>
                    <textarea
                      name="notes"
                      value={checkInData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional notes about check-in process..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Printer className="w-5 h-5 mr-2 text-gray-600" />
                  Print Services
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePrintKeyCard}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    <span>Print Key Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintWelcomeLetter}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Welcome Letter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Reservation: {reservation.reservationNumber} | Room: {reservation.roomId?.number}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Check-In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
