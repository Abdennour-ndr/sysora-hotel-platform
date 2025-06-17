import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  PieChart,
  BarChart3,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  Globe,
  Shield,
  Settings,
  Link,
  Zap,
  Lock
} from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';
import FinancialReports from './FinancialReports';
import CurrencyManager from './CurrencyManager';

const AdvancedPaymentSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [reservations, setReservations] = useState([]);

  // Fetch real data from API
  useEffect(() => {
    fetchPayments();
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setReservations(data.data.reservations);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Transform API data to match component format
        const transformedPayments = data.data.payments.map(payment => ({
          id: payment._id,
          paymentNumber: payment.paymentNumber,
          reservationNumber: payment.reservationId?.reservationNumber || 'N/A',
          guestName: payment.reservationId?.guestId ?
            `${payment.reservationId.guestId.firstName} ${payment.reservationId.guestId.lastName}` : 'Unknown Guest',
          amount: payment.amount,
          currency: payment.currency?.code || 'DZD',
          method: payment.paymentMethod,
          status: payment.status,
          date: payment.paymentDate,
          gateway: payment.gateway || null,
          transactionId: payment.transactionId || null,
          fees: payment.fees || 0,
          netAmount: payment.amount - (payment.fees || 0)
        }));

        setPayments(transformedPayments);

        // Calculate real stats
        const totalAmount = transformedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const completedPayments = transformedPayments.filter(p => p.status === 'completed').length;
        const pendingPayments = transformedPayments.filter(p => p.status === 'pending').length;
        const failedPayments = transformedPayments.filter(p => p.status === 'failed').length;
        const averagePayment = transformedPayments.length > 0 ? totalAmount / transformedPayments.length : 0;

        // Calculate payment methods distribution
        const methodCounts = transformedPayments.reduce((acc, payment) => {
          acc[payment.method] = (acc[payment.method] || 0) + 1;
          return acc;
        }, {});

        const totalPaymentsCount = transformedPayments.length;
        const paymentMethods = Object.keys(methodCounts).reduce((acc, method) => {
          acc[method] = Math.round((methodCounts[method] / totalPaymentsCount) * 100);
          return acc;
        }, {});

        setPaymentStats({
          totalRevenue: totalAmount,
          totalPayments: transformedPayments.length,
          averagePayment: Math.round(averagePayment),
          pendingAmount: transformedPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
          completedPayments,
          failedPayments,
          refundedAmount: transformedPayments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
          monthlyGrowth: 0, // Would need historical data to calculate
          paymentMethods,
          dailyRevenue: [] // Would need to group by date
        });
      } else {
        console.error('Failed to fetch payments:', data.error);
        // Fallback to empty data
        setPayments([]);
        setPaymentStats({
          totalRevenue: 0,
          totalPayments: 0,
          averagePayment: 0,
          pendingAmount: 0,
          completedPayments: 0,
          failedPayments: 0,
          refundedAmount: 0,
          monthlyGrowth: 0,
          paymentMethods: {},
          dailyRevenue: []
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Fallback to empty data
      setPayments([]);
      setPaymentStats({
        totalRevenue: 0,
        totalPayments: 0,
        averagePayment: 0,
        pendingAmount: 0,
        completedPayments: 0,
        failedPayments: 0,
        refundedAmount: 0,
        monthlyGrowth: 0,
        paymentMethods: {},
        dailyRevenue: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const paymentData = {
      reservationId: formData.get('reservationId'),
      amount: parseFloat(formData.get('amount')),
      paymentMethod: formData.get('paymentMethod'),
      description: formData.get('description'),
      notes: formData.get('notes')
    };

    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      if (data.success) {
        window.showToast && window.showToast('Payment added successfully', 'success');
        setShowAddPaymentModal(false);
        fetchPayments(); // Refresh payments list
      } else {
        window.showToast && window.showToast(data.error || 'Failed to add payment', 'error');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      window.showToast && window.showToast('Error adding payment', 'error');
    }
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get method icon
  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'bank_transfer':
        return <Building className="w-5 h-5 text-green-600" />;
      case 'cash':
        return <Wallet className="w-5 h-5 text-yellow-600" />;
      case 'mobile_payment':
        return <Globe className="w-5 h-5 text-purple-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-blue-800 to-sysora-midnight rounded-3xl p-8 text-white shadow-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <CreditCard className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Advanced Payment System</h2>
                <p className="text-blue-100/80 text-lg">Complete financial management & analytics</p>
              </div>
            </div>
            
            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{paymentStats.totalRevenue?.toLocaleString()} DZD</p>
                    <p className="text-sm text-blue-100/70">Total Revenue</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{paymentStats.totalPayments}</p>
                    <p className="text-sm text-blue-100/70">Total Payments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{paymentStats.pendingAmount?.toLocaleString()} DZD</p>
                    <p className="text-sm text-blue-100/70">Pending</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <ArrowUpRight className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+{paymentStats.monthlyGrowth}%</p>
                    <p className="text-sm text-blue-100/70">Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setLoading(!loading)}
              className={`flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm ${loading ? 'animate-spin' : 'hover:scale-105'}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="sm:hidden">Refresh</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600/90 hover:bg-blue-600 rounded-2xl transition-all duration-300 border border-blue-500/30 hover:scale-105">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
            
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="flex items-center justify-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Payment</span>
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex items-center justify-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-sysora-mint/20"
            >
              <FileText className="w-5 h-5" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
        <div className="flex flex-wrap items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'payments', name: 'Payments', icon: CreditCard },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'invoices', name: 'Invoices', icon: FileText },
              { id: 'gateways', name: 'Gateways', icon: Shield },
              { id: 'currencies', name: 'Currencies', icon: Globe }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-sysora-mint text-sysora-midnight shadow-lg'
                      : 'text-gray-600 hover:text-sysora-midnight hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>
      </div>

      {/* Payments Tab Content */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Search & Filter Payments</h3>
                <p className="text-gray-500">Find and organize payment records efficiently</p>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by payment #, guest name, or reservation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">✅ Completed</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="failed">❌ Failed</option>
                    <option value="refunded">🔄 Refunded</option>
                  </select>

                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px]"
                  >
                    <option value="all">All Methods</option>
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                    <option value="cash">💵 Cash</option>
                    <option value="mobile_payment">📱 Mobile Payment</option>
                  </select>

                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px]"
                  >
                    <option value="today">📅 Today</option>
                    <option value="this_week">📅 This Week</option>
                    <option value="this_month">📅 This Month</option>
                    <option value="last_month">📅 Last Month</option>
                    <option value="custom">📅 Custom Range</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Guest & Reservation</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount & Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status & Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-sysora-mint/10 rounded-xl flex items-center justify-center">
                            {getMethodIcon(payment.method)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{payment.paymentNumber}</p>
                            <p className="text-sm text-gray-500">{payment.transactionId || 'No transaction ID'}</p>
                            {payment.gateway && (
                              <p className="text-xs text-blue-600">via {payment.gateway}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.guestName}</p>
                          <p className="text-sm text-gray-500">{payment.reservationNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-lg text-gray-900">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {payment.method.replace('_', ' ')}
                          </p>
                          {payment.fees > 0 && (
                            <p className="text-xs text-red-500">
                              Fee: -{payment.fees.toLocaleString()} {payment.currency}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedReservation({ 
                                _id: payment.id,
                                reservationNumber: payment.reservationNumber,
                                totalAmount: payment.amount,
                                guestId: { firstName: payment.guestName.split(' ')[0], lastName: payment.guestName.split(' ')[1] || '' }
                              });
                              setShowInvoiceModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Generate Invoice"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Completed Payments</h3>
                    <p className="text-sm text-gray-500">Successfully processed</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{paymentStats.completedPayments}</span>
              </div>
              <div className="text-sm text-gray-500">
                Success rate: {((paymentStats.completedPayments / paymentStats.totalPayments) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pending Payments</h3>
                    <p className="text-sm text-gray-500">Awaiting processing</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {paymentStats.totalPayments - paymentStats.completedPayments - paymentStats.failedPayments}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Amount: {paymentStats.pendingAmount?.toLocaleString()} DZD
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Average Payment</h3>
                    <p className="text-sm text-gray-500">Per transaction</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {paymentStats.averagePayment?.toLocaleString()} DZD
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Based on {paymentStats.totalPayments} payments
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <ArrowDownRight className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Refunded Amount</h3>
                    <p className="text-sm text-gray-500">Total refunds</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {paymentStats.refundedAmount?.toLocaleString()} DZD
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {paymentStats.failedPayments} failed payments
              </div>
            </div>
          </div>

          {/* Payment Methods Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Payment Methods</span>
            </h3>
            <div className="space-y-4">
              {Object.entries(paymentStats.paymentMethods || {}).map(([method, percentage]) => (
                <div key={method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(method)}
                      <span className="text-sm font-medium capitalize">
                        {method.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sysora-mint h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways Tab Content */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          {/* Gateway Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stripe Gateway */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Stripe</h3>
                    <p className="text-sm text-gray-500">International payments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">2.9% + 30¢</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Settlement:</span>
                  <span className="font-semibold">2-7 days</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                  Configure Settings
                </button>
              </div>
            </div>

            {/* PayPal Gateway */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">PayPal</h3>
                    <p className="text-sm text-gray-500">Global digital wallet</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">97.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">3.4% + fixed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Settlement:</span>
                  <span className="font-semibold">1-3 days</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                  Configure Settings
                </button>
              </div>
            </div>

            {/* CIB Gateway (Algeria) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CIB Bank</h3>
                    <p className="text-sm text-gray-500">Local Algerian bank</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-600">Pending</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">95.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">1.5% + 50 DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Settlement:</span>
                  <span className="font-semibold">1-2 days</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-colors font-medium">
                  Setup Integration
                </button>
              </div>
            </div>
          </div>

          {/* Gateway Configuration */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Payment Gateway Configuration</h3>
                <p className="text-gray-500 mt-1">Manage your payment processing settings</p>
              </div>
              <button className="flex items-center space-x-2 bg-sysora-mint text-sysora-midnight px-6 py-3 rounded-xl hover:bg-sysora-mint/90 transition-colors font-semibold">
                <Plus className="w-5 h-5" />
                <span>Add Gateway</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Security Settings */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">SSL Encryption</p>
                        <p className="text-sm text-gray-500">Secure data transmission</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Enabled</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">PCI DSS Compliance</p>
                        <p className="text-sm text-gray-500">Payment card industry standards</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Certified</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Fraud Detection</p>
                        <p className="text-sm text-gray-500">AI-powered fraud prevention</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Settings */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Processing Settings</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint">
                        <option value="DZD">Algerian Dinar (DZD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="15"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-capture Payments
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
                        />
                        <span className="text-sm text-gray-600">
                          Automatically capture authorized payments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Monitoring */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>Real-time Transaction Monitoring</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-green-600">Successful Today</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">98.2%</div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
            </div>

            <div className="text-center">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <FinancialReports />
      )}

      {/* Currencies Tab Content */}
      {activeTab === 'currencies' && (
        <CurrencyManager />
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Payment</h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPayment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reservation *</label>
                  <select
                    name="reservationId"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="">Select Reservation</option>
                    {reservations.map((reservation) => (
                      <option key={reservation._id} value={reservation._id}>
                        {reservation.reservationNumber} - {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">💵 Cash</option>
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="debit_card">💳 Debit Card</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                    <option value="mobile_payment">📱 Mobile Payment</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    name="description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="Payment description..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal */}
      {showInvoiceModal && (
        <InvoiceGenerator
          reservation={selectedReservation}
          payments={[]}
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedReservation(null);
          }}
        />
      )}
    </div>
  );
};

export default AdvancedPaymentSystem;
