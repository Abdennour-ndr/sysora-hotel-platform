import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2,
  Receipt,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const PaymentManagementModal = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: 'cash',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [addingPayment, setAddingPayment] = useState(false);

  useEffect(() => {
    if (isOpen && reservation) {
      fetchPayments();
    }
  }, [isOpen, reservation]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sysora_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data?.payments || generateDefaultPayments());
      } else {
        setPayments(generateDefaultPayments());
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments(generateDefaultPayments());
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultPayments = () => {
    const payments = [];
    
    if (reservation.paidAmount > 0) {
      payments.push({
        id: 1,
        amount: reservation.paidAmount,
        method: 'cash',
        date: new Date(reservation.createdAt || Date.now()),
        notes: 'Initial payment',
        status: 'completed',
        createdBy: 'System'
      });
    }

    return payments;
  };

  const addPayment = async () => {
    if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
      window.showToast && window.showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      setAddingPayment(true);
      const token = localStorage.getItem('sysora_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(newPayment.amount),
          method: newPayment.method,
          notes: newPayment.notes,
          date: newPayment.date
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add payment to local state
        const payment = {
          id: Date.now(),
          amount: parseFloat(newPayment.amount),
          method: newPayment.method,
          date: new Date(newPayment.date),
          notes: newPayment.notes,
          status: 'completed',
          createdBy: 'Current User'
        };
        
        setPayments(prev => [...prev, payment]);
        
        // Reset form
        setNewPayment({
          amount: '',
          method: 'cash',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });

        window.showToast && window.showToast('Payment added successfully', 'success');
        onUpdate?.();
      } else {
        const errorData = await response.json();
        window.showToast && window.showToast(errorData.error || 'Failed to add payment', 'error');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      window.showToast && window.showToast('Error adding payment', 'error');
    } finally {
      setAddingPayment(false);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    try {
      const token = localStorage.getItem('sysora_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
        window.showToast && window.showToast('Payment deleted successfully', 'success');
        onUpdate?.();
      } else {
        window.showToast && window.showToast('Failed to delete payment', 'error');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      window.showToast && window.showToast('Error deleting payment', 'error');
    }
  };

  const generateReceipt = (payment) => {
    // Generate a simple receipt
    const receiptContent = `
SYSORA HOTEL MANAGEMENT
Payment Receipt

Reservation: ${reservation.reservationNumber}
Guest: ${reservation.guestId?.firstName} ${reservation.guestId?.lastName}
Room: ${reservation.roomId?.number}

Payment Details:
Amount: ${payment.amount.toLocaleString()} DZD
Method: ${payment.method.toUpperCase()}
Date: ${new Date(payment.date).toLocaleDateString()}
Notes: ${payment.notes || 'N/A'}

Thank you for your payment!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${reservation.reservationNumber}_${payment.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'cash': return '💵';
      default: return '💰';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalAmount = reservation.totalAmount || 0;
  const remainingAmount = totalAmount - totalPaid;
  const overpaidAmount = remainingAmount < 0 ? Math.abs(remainingAmount) : 0;

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Payment Management</h2>
              <p className="text-emerald-100">#{reservation.reservationNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-emerald-100 text-sm">Total Amount</p>
              <p className="text-xl font-bold">{totalAmount.toLocaleString()} DZD</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-emerald-100 text-sm">Total Paid</p>
              <p className="text-xl font-bold">{totalPaid.toLocaleString()} DZD</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-emerald-100 text-sm">
                {overpaidAmount > 0 ? 'Overpaid' : 'Remaining'}
              </p>
              <p className={`text-xl font-bold ${overpaidAmount > 0 ? 'text-yellow-200' : remainingAmount > 0 ? 'text-red-200' : 'text-green-200'}`}>
                {overpaidAmount > 0 ? `+${overpaidAmount.toLocaleString()}` : Math.abs(remainingAmount).toLocaleString()} DZD
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-emerald-100 text-sm">Status</p>
              <p className="text-xl font-bold">
                {remainingAmount <= 0 ? (overpaidAmount > 0 ? 'Overpaid' : 'Paid') : 'Partial'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Payment History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span className="ml-3 text-gray-600">Loading payments...</span>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No payments recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getPaymentMethodIcon(payment.method)}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {payment.amount.toLocaleString()} DZD
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {payment.method.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {payment.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {payment.status}
                          </span>
                          <button
                            onClick={() => generateReceipt(payment)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePayment(payment.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Payment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
                        {payment.notes && <p>Notes: {payment.notes}</p>}
                        <p>Added by: {payment.createdBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Add Payment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Payment</h3>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Amount (DZD)
                  </label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {remainingAmount > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Remaining: {remainingAmount.toLocaleString()} DZD
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment Method
                  </label>
                  <select
                    value={newPayment.method}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Payment notes or reference..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  onClick={addPayment}
                  disabled={!newPayment.amount || addingPayment}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingPayment ? 'Adding Payment...' : 'Add Payment'}</span>
                </button>

                {/* Quick Amount Buttons */}
                {remainingAmount > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick amounts:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setNewPayment(prev => ({ ...prev, amount: remainingAmount.toString() }))}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Full Amount
                      </button>
                      <button
                        onClick={() => setNewPayment(prev => ({ ...prev, amount: (remainingAmount / 2).toString() }))}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Half Amount
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementModal;
