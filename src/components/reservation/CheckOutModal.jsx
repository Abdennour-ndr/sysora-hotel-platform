import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  FileText,
  Star,
  Clock,
  CheckCircle,
  Printer,
  Calculator,
  ShoppingCart
} from 'lucide-react';

const CheckOutModal = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [checkOutData, setCheckOutData] = useState({
    actualCheckOutTime: new Date().toISOString().slice(0, 16),
    additionalCharges: [],
    minibarCharges: 0,
    phoneCharges: 0,
    laundryCharges: 0,
    damageCharges: 0,
    lateCheckoutFee: 0,
    roomCondition: 'good',
    keyCardsReturned: 0,
    guestRating: 0,
    guestFeedback: '',
    notes: '',
    finalAmount: 0,
    paymentMethod: 'cash',
    refundAmount: 0,
    printReceipt: true,
    sendEmailReceipt: false
  });
  const [errors, setErrors] = useState({});
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);

  useEffect(() => {
    if (isOpen && reservation) {
      calculateFinalAmount();
      setCheckOutData(prev => ({
        ...prev,
        keyCardsReturned: reservation.keyCardsIssued || 1
      }));
    }
  }, [isOpen, reservation]);

  const calculateFinalAmount = () => {
    if (!reservation) return;

    const baseAmount = reservation.totalAmount || 0;
    const paidAmount = reservation.paidAmount || 0;
    const additionalTotal = checkOutData.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const extraCharges = checkOutData.minibarCharges + checkOutData.phoneCharges +
                        checkOutData.laundryCharges + checkOutData.damageCharges +
                        checkOutData.lateCheckoutFee;

    const finalAmount = baseAmount + additionalTotal + extraCharges;
    const balanceDue = finalAmount - paidAmount;

    setCheckOutData(prev => ({
      ...prev,
      finalAmount,
      refundAmount: balanceDue < 0 ? Math.abs(balanceDue) : 0
    }));
  };

  useEffect(() => {
    calculateFinalAmount();
  }, [
    checkOutData.additionalCharges,
    checkOutData.minibarCharges,
    checkOutData.phoneCharges,
    checkOutData.laundryCharges,
    checkOutData.damageCharges,
    checkOutData.lateCheckoutFee
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCheckOutData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addAdditionalCharge = () => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: [
        ...prev.additionalCharges,
        { description: '', amount: 0, category: 'other' }
      ]
    }));
  };

  const updateAdditionalCharge = (index, field, value) => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.map((charge, i) =>
        i === index ? { ...charge, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : charge
      )
    }));
  };

  const removeAdditionalCharge = (index) => {
    setCheckOutData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (checkOutData.keyCardsReturned < 0) {
      newErrors.keyCardsReturned = 'Key cards returned cannot be negative';
    }

    if (checkOutData.guestRating < 0 || checkOutData.guestRating > 5) {
      newErrors.guestRating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckOut = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...checkOutData,
            actualCheckOutDate: new Date(checkOutData.actualCheckOutTime)
          })
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Guest checked out successfully', 'success');
        onUpdate(data.data);
        onClose();
      } else {
        window.showToast && window.showToast(data.message || 'Failed to check out guest', 'error');
      }
    } catch (error) {
      console.error('Check-out error:', error);
      window.showToast && window.showToast('Error during check-out process', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.showToast && window.showToast('Receipt printing initiated', 'info');
  };

  if (!isOpen || !reservation) return null;

  const balanceDue = checkOutData.finalAmount - (reservation.paidAmount || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Guest Check-Out</h2>
              <p className="text-emerald-100">
                {reservation.guestId?.firstName} {reservation.guestId?.lastName} - Room {reservation.roomId?.number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Charges & Services */}
            <div className="space-y-6">
              {/* Bill Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Bill Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Room Charges:</span>
                    <span className="font-medium">{(reservation.totalAmount || 0).toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Already Paid:</span>
                    <span className="font-medium text-green-600">-{(reservation.paidAmount || 0).toLocaleString()} DZD</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Balance Due:</span>
                    <span className={balanceDue >= 0 ? 'text-red-600' : 'text-green-600'}>
                      {balanceDue >= 0 ? '+' : ''}{balanceDue.toLocaleString()} DZD
                    </span>
                  </div>
                  {checkOutData.refundAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-medium">
                      <span>Refund Amount:</span>
                      <span>{checkOutData.refundAmount.toLocaleString()} DZD</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Charges */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
                    Additional Charges
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAdditionalCharges(!showAdditionalCharges)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    {showAdditionalCharges ? 'Hide' : 'Show'} Details
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minibar (DZD)
                    </label>
                    <input
                      type="number"
                      name="minibarCharges"
                      value={checkOutData.minibarCharges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Charges (DZD)
                    </label>
                    <input
                      type="number"
                      name="phoneCharges"
                      value={checkOutData.phoneCharges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Laundry (DZD)
                    </label>
                    <input
                      type="number"
                      name="laundryCharges"
                      value={checkOutData.laundryCharges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Damage Charges (DZD)
                    </label>
                    <input
                      type="number"
                      name="damageCharges"
                      value={checkOutData.damageCharges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Late Checkout Fee (DZD)
                    </label>
                    <input
                      type="number"
                      name="lateCheckoutFee"
                      value={checkOutData.lateCheckoutFee}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {showAdditionalCharges && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">Custom Charges</h4>
                      <button
                        type="button"
                        onClick={addAdditionalCharge}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Add Charge
                      </button>
                    </div>

                    {checkOutData.additionalCharges.map((charge, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border">
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={charge.description}
                            onChange={(e) => updateAdditionalCharge(index, 'description', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={charge.amount}
                            onChange={(e) => updateAdditionalCharge(index, 'amount', e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalCharge(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Check-out Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  Check-out Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Check-out Time
                    </label>
                    <input
                      type="datetime-local"
                      name="actualCheckOutTime"
                      value={checkOutData.actualCheckOutTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Cards Returned
                      </label>
                      <input
                        type="number"
                        name="keyCardsReturned"
                        value={checkOutData.keyCardsReturned}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.keyCardsReturned ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.keyCardsReturned && (
                        <p className="text-red-500 text-xs mt-1">{errors.keyCardsReturned}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Condition
                      </label>
                      <select
                        name="roomCondition"
                        value={checkOutData.roomCondition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Feedback */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Payment Information
                </h3>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {checkOutData.finalAmount.toLocaleString()} DZD
                      </div>
                      <div className="text-sm text-gray-600">Final Amount</div>
                    </div>
                  </div>

                  {balanceDue !== 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method for Balance
                      </label>
                      <select
                        name="paymentMethod"
                        value={checkOutData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_payment">Mobile Payment</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="printReceipt"
                        name="printReceipt"
                        checked={checkOutData.printReceipt}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor="printReceipt" className="text-sm text-gray-700">
                        Print Receipt
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sendEmailReceipt"
                        name="sendEmailReceipt"
                        checked={checkOutData.sendEmailReceipt}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor="sendEmailReceipt" className="text-sm text-gray-700">
                        Email Receipt
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Feedback */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Guest Feedback
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCheckOutData(prev => ({ ...prev, guestRating: star }))}
                          className={`p-1 rounded ${
                            star <= checkOutData.guestRating
                              ? 'text-yellow-500'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {checkOutData.guestRating > 0 ? `${checkOutData.guestRating}/5` : 'No rating'}
                      </span>
                    </div>
                    {errors.guestRating && (
                      <p className="text-red-500 text-xs mt-1">{errors.guestRating}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Feedback
                    </label>
                    <textarea
                      name="guestFeedback"
                      value={checkOutData.guestFeedback}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Guest comments about their stay..."
                    />
                  </div>
                </div>
              </div>

              {/* Staff Notes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Staff Notes
                </h3>

                <div>
                  <textarea
                    name="notes"
                    value={checkOutData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Internal notes about check-out process..."
                  />
                </div>
              </div>

              {/* Print Services */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Printer className="w-5 h-5 mr-2 text-gray-600" />
                  Print Services
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Final Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.showToast && window.showToast('Invoice printing initiated', 'info')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            <div>Reservation: {reservation.reservationNumber}</div>
            <div>Check-in: {new Date(reservation.checkInDate).toLocaleDateString()}</div>
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
              onClick={handleCheckOut}
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
                  <span>Complete Check-Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal;