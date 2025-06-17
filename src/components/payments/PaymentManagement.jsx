import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState('');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchReservations();
  }, []);

  const fetchPayments = async () => {
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
        setPayments(data.data.payments);
        
        // حساب الإحصائيات
        const totalAmount = data.data.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const completedPayments = data.data.payments.filter(p => p.status === 'completed').length;
        const pendingPayments = data.data.payments.filter(p => p.status === 'pending').length;
        
        setStats({
          totalAmount,
          totalPayments: data.data.payments.length,
          completedPayments,
          pendingPayments
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

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
        window.showToast && window.showToast('تم إضافة الدفعة بنجاح', 'success');
        setShowAddModal(false);
        fetchPayments();
      } else {
        window.showToast && window.showToast(data.error || 'فشل في إضافة الدفعة', 'error');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      window.showToast && window.showToast('خطأ في إضافة الدفعة', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'معلقة';
      case 'failed':
        return 'فاشلة';
      default:
        return status;
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'cash':
        return 'نقداً';
      case 'credit_card':
        return 'بطاقة ائتمان';
      case 'debit_card':
        return 'بطاقة خصم';
      case 'bank_transfer':
        return 'تحويل بنكي';
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMethod = !methodFilter || payment.paymentMethod === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-sysora-mint" />
        <span className="mr-2 text-gray-600">جاري تحميل الدفعات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sysora-midnight">إدارة الدفعات</h1>
          <p className="text-gray-600 mt-1">إدارة وتتبع جميع المدفوعات</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-sysora-mint text-sysora-midnight rounded-xl hover:bg-sysora-mint/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة دفعة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الدفعات</p>
              <p className="text-2xl font-bold text-sysora-midnight">{stats.totalAmount.toLocaleString()} دج</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد الدفعات</p>
              <p className="text-2xl font-bold text-sysora-midnight">{stats.totalPayments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">دفعات مكتملة</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedPayments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">دفعات معلقة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في الدفعات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
          >
            <option value="">جميع الحالات</option>
            <option value="completed">مكتملة</option>
            <option value="pending">معلقة</option>
            <option value="failed">فاشلة</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
          >
            <option value="">جميع طرق الدفع</option>
            <option value="cash">نقداً</option>
            <option value="credit_card">بطاقة ائتمان</option>
            <option value="debit_card">بطاقة خصم</option>
            <option value="bank_transfer">تحويل بنكي</option>
          </select>

          <button
            onClick={fetchPayments}
            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5 ml-2" />
            تحديث
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">رقم الدفعة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">رقم الحجز</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المبلغ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">طريقة الدفع</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.paymentNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.reservationId?.reservationNumber || 'غير محدد'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {payment.amount.toLocaleString()} {payment.currency?.symbol || 'دج'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getMethodText(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className="mr-2 text-sm">{getStatusText(payment.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.paymentDate).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-sysora-mint transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد دفعات</p>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">إضافة دفعة جديدة</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPayment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحجز *</label>
                  <select
                    name="reservationId"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="">اختر الحجز</option>
                    {reservations.map((reservation) => (
                      <option key={reservation._id} value={reservation._id}>
                        {reservation.reservationNumber} - {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع *</label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="">اختر طريقة الدفع</option>
                    <option value="cash">نقداً</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="debit_card">بطاقة خصم</option>
                    <option value="bank_transfer">تحويل بنكي</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <input
                    type="text"
                    name="description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="وصف الدفعة..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="ملاحظات إضافية..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-sysora-mint text-sysora-midnight rounded-xl hover:bg-sysora-mint/90 transition-colors font-semibold"
                >
                  إضافة الدفعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
