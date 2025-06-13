import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  CreditCard,
  Receipt,
  Plus,
  Minus,
  Printer,
  RefreshCw,
  PieChart
} from 'lucide-react';

const PaymentManagementEnhanced = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    method: 'cash',
    reference: '',
    notes: '',
    installmentPlan: false,
    installments: 1
  });
  const [paymentStats, setPaymentStats] = useState({
    totalPaid: 0,
    totalDue: 0,
    balance: 0,
    overpayment: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && reservation) {
      fetchPayments();
      calculatePaymentStats();
    }
  }, [isOpen, reservation]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/payments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const calculatePaymentStats = () => {
    if (!reservation) return;

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDue = reservation.totalAmount || 0;
    const balance = totalDue - totalPaid;
    const overpayment = balance < 0 ? Math.abs(balance) : 0;

    setPaymentStats({
      totalPaid,
      totalDue,
      balance: Math.max(0, balance),
      overpayment
    });

    // Set suggested payment amount
    if (balance > 0) {
      setNewPayment(prev => ({
        ...prev,
        amount: balance
      }));
    }
  };

  useEffect(() => {
    calculatePaymentStats();
  }, [payments, reservation]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPayment(prev => ({
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

  const validatePayment = () => {
    const newErrors = {};

    if (newPayment.amount <= 0) {
      newErrors.amount = 'Payment amount must be greater than 0';
    }

    if (!newPayment.method) {
      newErrors.method = 'Payment method is required';
    }

    if (newPayment.method === 'bank_transfer' && !newPayment.reference) {
      newErrors.reference = 'Reference number is required for bank transfers';
    }

    if (newPayment.installmentPlan && newPayment.installments < 2) {
      newErrors.installments = 'Installment plan must have at least 2 payments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPayment = async () => {
    if (!validatePayment()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/payments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...newPayment,
            reservationId: reservation._id
          })
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Payment added successfully', 'success');
        fetchPayments();
        onUpdate && onUpdate(data.data);
        
        // Reset form
        setNewPayment({
          amount: 0,
          method: 'cash',
          reference: '',
          notes: '',
          installmentPlan: false,
          installments: 1
        });
      } else {
        window.showToast && window.showToast(data.message || 'Failed to add payment', 'error');
      }
    } catch (error) {
      console.error('Add payment error:', error);
      window.showToast && window.showToast('Error adding payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId, amount) => {
    if (!confirm(`Are you sure you want to refund ${amount.toLocaleString()} DZD?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/${paymentId}/refund`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount })
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Refund processed successfully', 'success');
        fetchPayments();
        onUpdate && onUpdate(data.data);
      } else {
        window.showToast && window.showToast(data.message || 'Failed to process refund', 'error');
      }
    } catch (error) {
      console.error('Refund error:', error);
      window.showToast && window.showToast('Error processing refund', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (payment) => {
    // Simulate receipt printing
    window.showToast && window.showToast(`Receipt for payment ${payment._id} printing...`, 'info');
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'card':
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Cash',
      card: 'Credit Card',
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      mobile_payment: 'Mobile Payment',
      check: 'Check'
    };
    return labels[method] || method;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Payment Management</h2>
              <p className="text-green-100">
                {reservation.guestId?.firstName} {reservation.guestId?.lastName} - Room {reservation.roomId?.number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Payment Stats & New Payment */}
            <div className="space-y-6">
              {/* Payment Statistics */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Summary
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {paymentStats.totalDue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Due (DZD)</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {paymentStats.totalPaid.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Paid (DZD)</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${paymentStats.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {paymentStats.balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Balance Due (DZD)</div>
                  </div>

                  {paymentStats.overpayment > 0 && (
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {paymentStats.overpayment.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Overpayment (DZD)</div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Payment Progress</span>
                    <span>{Math.min(100, Math.round((paymentStats.totalPaid / paymentStats.totalDue) * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (paymentStats.totalPaid / paymentStats.totalDue) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Add New Payment */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Add Payment
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (DZD) *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={newPayment.amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        name="method"
                        value={newPayment.method}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.method ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_payment">Mobile Payment</option>
                        <option value="check">Check</option>
                      </select>
                      {errors.method && (
                        <p className="text-red-500 text-xs mt-1">{errors.method}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={newPayment.reference}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.reference ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Transaction reference (optional)"
                    />
                    {errors.reference && (
                      <p className="text-red-500 text-xs mt-1">{errors.reference}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPayment}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Payment History */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-purple-600" />
                    Payment History
                  </h3>
                  <button
                    onClick={fetchPayments}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <div key={payment._id} className="bg-white rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getPaymentMethodIcon(payment.method)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {payment.amount.toLocaleString()} DZD
                              </div>
                              <div className="text-sm text-gray-600">
                                {getPaymentMethodLabel(payment.method)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <button
                            onClick={() => handlePrintReceipt(payment)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print</span>
                          </button>
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleRefund(payment._id, payment.amount)}
                              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                              <span>Refund</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No payments recorded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Reservation: {reservation.reservationNumber} | Total Payments: {payments.length}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementEnhanced;
