import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Receipt,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PaymentsWidget = () => {
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPayments(data.data.payments);
      }
    } catch (error) {
      console.error('Fetch payments error:', error);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPaymentStats(data.data);
      }
    } catch (error) {
      console.error('Fetch payment stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return CreditCard;
      case 'cash':
        return DollarSign;
      default:
        return Receipt;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overpaid':
        return 'bg-emerald-100 text-emerald-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'failed':
        return AlertCircle;
      default:
        return Receipt;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                ${paymentStats?.revenue?.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Revenue</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                ${paymentStats?.revenue?.net || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refunds</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                ${paymentStats?.revenue?.refunds || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Payment</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                ${paymentStats?.revenue?.average || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-sysora-mint" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overpayments</p>
              <p className="text-2xl font-bold text-emerald-600">
                +${paymentStats?.revenue?.overpaid || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-emerald-600">
              💡 Additional amounts paid by customers
            </p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sysora-midnight">Recent Payments</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert('View all payments feature coming soon')}
              className="text-sm text-sysora-mint hover:text-sysora-midnight transition-colors"
            >
              View All
            </button>
            <button
              onClick={() => alert('Add new payment feature coming soon')}
              className="p-2 text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => {
              const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);
              const StatusIcon = getStatusIcon(payment.status);

              return (
                <div key={payment._id} className="flex items-center justify-between p-4 bg-sysora-light rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <PaymentIcon className="w-6 h-6 text-sysora-midnight" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sysora-midnight">
                          {payment.paymentNumber}
                        </p>
                        <StatusIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        {payment.reservationId?.reservationNumber || 'Reservation not specified'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.paymentDate).toLocaleDateString('en')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sysora-midnight text-lg">
                      ${payment.amount}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {payment.paymentMethod}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent payments</p>
            <button
              onClick={() => alert('Add new payment feature coming soon')}
              className="mt-2 text-sysora-mint hover:text-sysora-midnight transition-colors"
            >
              Add New Payment
            </button>
          </div>
        )}
      </div>

      {/* Payment Methods Breakdown */}
      {paymentStats?.paymentsByMethod && paymentStats.paymentsByMethod.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-sysora-midnight mb-4">Payment Methods Distribution</h3>
          <div className="space-y-3">
            {paymentStats.paymentsByMethod.map((method) => {
              const total = paymentStats.paymentsByMethod.reduce((sum, m) => sum + m.totalAmount, 0);
              const percentage = total > 0 ? Math.round((method.totalAmount / total) * 100) : 0;

              return (
                <div key={method._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sysora-mint/10 rounded-lg flex items-center justify-center">
                      {React.createElement(getPaymentMethodIcon(method._id), {
                        className: "w-4 h-4 text-sysora-mint"
                      })}
                    </div>
                    <span className="text-sm font-medium text-sysora-midnight">
                      {method._id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-sysora-midnight">
                        ${method.totalAmount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method.count} payments
                      </p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sysora-mint h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsWidget;
