import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter,
  PieChart,
  Users,
  Home,
  CreditCard
} from 'lucide-react';

const FinancialReports = ({ reservations = [] }) => {
  const [dateRange, setDateRange] = useState('this_month');
  const [reportType, setReportType] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
  }, [dateRange, reportType, reservations]);

  const generateReport = () => {
    setLoading(true);
    
    // Filter reservations based on date range
    const filteredReservations = filterReservationsByDate(reservations, dateRange);
    
    let data = {};
    
    switch (reportType) {
      case 'revenue':
        data = generateRevenueReport(filteredReservations);
        break;
      case 'occupancy':
        data = generateOccupancyReport(filteredReservations);
        break;
      case 'payment_methods':
        data = generatePaymentMethodsReport(filteredReservations);
        break;
      case 'booking_sources':
        data = generateBookingSourcesReport(filteredReservations);
        break;
      default:
        data = generateRevenueReport(filteredReservations);
    }
    
    setReportData(data);
    setLoading(false);
  };

  const filterReservationsByDate = (reservations, range) => {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'this_week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'this_year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        return reservations;
    }

    return reservations.filter(reservation => {
      const checkInDate = new Date(reservation.checkInDate);
      return checkInDate >= startDate && checkInDate < endDate;
    });
  };

  const generateRevenueReport = (reservations) => {
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const totalPaid = reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    const totalPending = totalRevenue - totalPaid;
    
    // Group by date for chart
    const dailyRevenue = {};
    reservations.forEach(reservation => {
      const date = new Date(reservation.checkInDate).toLocaleDateString();
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (reservation.totalAmount || 0);
    });

    // Average daily rate
    const totalNights = reservations.reduce((sum, r) => sum + (r.nights || 1), 0);
    const adr = totalNights > 0 ? totalRevenue / totalNights : 0;

    return {
      summary: {
        totalRevenue,
        totalPaid,
        totalPending,
        averageDailyRate: adr,
        totalReservations: reservations.length
      },
      chartData: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue
      })),
      type: 'revenue'
    };
  };

  const generateOccupancyReport = (reservations) => {
    const totalRooms = 30; // This should come from API
    const occupiedNights = reservations.reduce((sum, r) => sum + (r.nights || 1), 0);
    const totalAvailableNights = totalRooms * getDaysInRange(dateRange);
    const occupancyRate = totalAvailableNights > 0 ? (occupiedNights / totalAvailableNights) * 100 : 0;

    // Group by room type
    const roomTypeOccupancy = {};
    reservations.forEach(reservation => {
      const roomType = reservation.roomId?.type || 'unknown';
      roomTypeOccupancy[roomType] = (roomTypeOccupancy[roomType] || 0) + (reservation.nights || 1);
    });

    return {
      summary: {
        occupancyRate,
        occupiedNights,
        totalAvailableNights,
        totalReservations: reservations.length
      },
      chartData: Object.entries(roomTypeOccupancy).map(([type, nights]) => ({
        type,
        nights,
        percentage: totalAvailableNights > 0 ? (nights / totalAvailableNights) * 100 : 0
      })),
      type: 'occupancy'
    };
  };

  const generatePaymentMethodsReport = (reservations) => {
    const paymentMethods = {
      cash: 0,
      credit_card: 0,
      bank_transfer: 0,
      pending: 0
    };

    reservations.forEach(reservation => {
      if (reservation.paidAmount > 0) {
        // This is simplified - in real app, you'd get actual payment methods from payment records
        const method = reservation.paymentMethod || 'cash';
        paymentMethods[method] = (paymentMethods[method] || 0) + reservation.paidAmount;
      }
      
      if (reservation.totalAmount > reservation.paidAmount) {
        paymentMethods.pending += (reservation.totalAmount - reservation.paidAmount);
      }
    });

    const totalAmount = Object.values(paymentMethods).reduce((sum, amount) => sum + amount, 0);

    return {
      summary: {
        totalAmount,
        methodsCount: Object.keys(paymentMethods).filter(key => paymentMethods[key] > 0).length
      },
      chartData: Object.entries(paymentMethods)
        .filter(([_, amount]) => amount > 0)
        .map(([method, amount]) => ({
          method: method.replace('_', ' ').toUpperCase(),
          amount,
          percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
        })),
      type: 'payment_methods'
    };
  };

  const generateBookingSourcesReport = (reservations) => {
    const sources = {};
    
    reservations.forEach(reservation => {
      const source = reservation.source || 'direct';
      sources[source] = (sources[source] || 0) + 1;
    });

    const totalBookings = reservations.length;

    return {
      summary: {
        totalBookings,
        sourcesCount: Object.keys(sources).length
      },
      chartData: Object.entries(sources).map(([source, count]) => ({
        source: source.replace('_', ' ').toUpperCase(),
        count,
        percentage: totalBookings > 0 ? (count / totalBookings) * 100 : 0
      })),
      type: 'booking_sources'
    };
  };

  const getDaysInRange = (range) => {
    switch (range) {
      case 'today': return 1;
      case 'this_week': return 7;
      case 'this_month': return 30; // Simplified
      case 'this_year': return 365; // Simplified
      default: return 30;
    }
  };

  const exportReport = () => {
    if (!reportData) return;

    let csvContent = '';
    
    switch (reportType) {
      case 'revenue':
        csvContent = [
          'Date,Revenue',
          ...reportData.chartData.map(item => `${item.date},${item.revenue}`)
        ].join('\n');
        break;
      case 'occupancy':
        csvContent = [
          'Room Type,Nights,Percentage',
          ...reportData.chartData.map(item => `${item.type},${item.nights},${item.percentage.toFixed(2)}%`)
        ].join('\n');
        break;
      case 'payment_methods':
        csvContent = [
          'Payment Method,Amount,Percentage',
          ...reportData.chartData.map(item => `${item.method},${item.amount},${item.percentage.toFixed(2)}%`)
        ].join('\n');
        break;
      case 'booking_sources':
        csvContent = [
          'Booking Source,Count,Percentage',
          ...reportData.chartData.map(item => `${item.source},${item.count},${item.percentage.toFixed(2)}%`)
        ].join('\n');
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    window.showToast && window.showToast('Report exported successfully', 'success');
  };

  const renderChart = () => {
    if (!reportData || !reportData.chartData) return null;

    switch (reportType) {
      case 'revenue':
        return (
          <div className="space-y-4">
            {reportData.chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.date}</span>
                <span className="text-lg font-bold text-green-600">{item.revenue.toLocaleString()} DZD</span>
              </div>
            ))}
          </div>
        );
      case 'occupancy':
        return (
          <div className="space-y-4">
            {reportData.chartData.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{item.type}</span>
                  <span className="text-sm font-bold text-purple-600">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{item.nights} nights</span>
              </div>
            ))}
          </div>
        );
      case 'payment_methods':
        return (
          <div className="space-y-4">
            {reportData.chartData.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.method}</span>
                  <span className="text-sm font-bold text-emerald-600">{item.amount.toLocaleString()} DZD</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        );
      case 'booking_sources':
        return (
          <div className="space-y-4">
            {reportData.chartData.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-bold text-blue-600">{item.count} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Financial Reports</h3>
        </div>
        <button
          onClick={exportReport}
          disabled={!reportData || loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue">Revenue Analysis</option>
            <option value="occupancy">Occupancy Report</option>
            <option value="payment_methods">Payment Methods</option>
            <option value="booking_sources">Booking Sources</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating report...</span>
        </div>
      )}

      {/* Report Content */}
      {!loading && reportData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportType === 'revenue' && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.totalRevenue.toLocaleString()} DZD</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Paid</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalPaid.toLocaleString()} DZD</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold text-orange-900">{reportData.summary.totalPending.toLocaleString()} DZD</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Avg Daily Rate</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.summary.averageDailyRate.toFixed(0)} DZD</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </>
            )}

            {reportType === 'occupancy' && (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.summary.occupancyRate.toFixed(1)}%</p>
                    </div>
                    <Home className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Occupied Nights</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.occupiedNights}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Available Nights</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalAvailableNights}</p>
                    </div>
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Reservations</p>
                      <p className="text-2xl font-bold text-orange-900">{reportData.summary.totalReservations}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {reportType === 'revenue' && 'Daily Revenue'}
              {reportType === 'occupancy' && 'Room Type Occupancy'}
              {reportType === 'payment_methods' && 'Payment Methods Distribution'}
              {reportType === 'booking_sources' && 'Booking Sources Distribution'}
            </h4>
            {renderChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
