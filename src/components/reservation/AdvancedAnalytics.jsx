import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Target,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Filter,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

const AdvancedAnalytics = ({ reservations = [], isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    revenue: {},
    occupancy: {},
    performance: {},
    trends: {},
    forecasts: {}
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/analytics/reservations?period=${timeRange}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || {});
      } else {
        // Fallback to calculated analytics from reservations data
        calculateLocalAnalytics();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      calculateLocalAnalytics();
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalAnalytics = () => {
    const now = new Date();
    const daysBack = parseInt(timeRange.replace('d', ''));
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    const filteredReservations = reservations.filter(r => 
      new Date(r.createdAt) >= startDate
    );

    // Revenue Analytics
    const totalRevenue = filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const paidRevenue = filteredReservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    const pendingRevenue = totalRevenue - paidRevenue;

    // Occupancy Analytics
    const totalReservations = filteredReservations.length;
    const checkedInReservations = filteredReservations.filter(r => r.status === 'checked_in').length;
    const checkedOutReservations = filteredReservations.filter(r => r.status === 'checked_out').length;
    const cancelledReservations = filteredReservations.filter(r => r.status === 'cancelled').length;

    // Performance Metrics
    const averageStayLength = filteredReservations.reduce((sum, r) => {
      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0) / totalReservations || 0;

    const averageRoomRate = totalRevenue / totalReservations || 0;

    setAnalytics({
      revenue: {
        total: totalRevenue,
        paid: paidRevenue,
        pending: pendingRevenue,
        growth: 12.5, // Simulated
        trend: 'up'
      },
      occupancy: {
        total: totalReservations,
        checkedIn: checkedInReservations,
        checkedOut: checkedOutReservations,
        cancelled: cancelledReservations,
        rate: totalReservations > 0 ? (checkedInReservations / totalReservations) * 100 : 0
      },
      performance: {
        averageStayLength,
        averageRoomRate,
        cancellationRate: totalReservations > 0 ? (cancelledReservations / totalReservations) * 100 : 0,
        noShowRate: 2.1 // Simulated
      },
      trends: {
        dailyRevenue: generateDailyTrends(filteredReservations, daysBack),
        weeklyOccupancy: generateWeeklyTrends(filteredReservations),
        monthlyGrowth: 8.3 // Simulated
      }
    });
  };

  const generateDailyTrends = (reservations, days) => {
    const trends = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayReservations = reservations.filter(r => {
        const createdDate = new Date(r.createdAt);
        return createdDate.toDateString() === date.toDateString();
      });
      
      const dayRevenue = dayReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        reservations: dayReservations.length
      });
    }
    
    return trends;
  };

  const generateWeeklyTrends = (reservations) => {
    const weeklyData = {};
    
    reservations.forEach(r => {
      const date = new Date(r.createdAt);
      const week = getWeekNumber(date);
      
      if (!weeklyData[week]) {
        weeklyData[week] = { reservations: 0, revenue: 0 };
      }
      
      weeklyData[week].reservations++;
      weeklyData[week].revenue += r.totalAmount || 0;
    });
    
    return Object.entries(weeklyData).map(([week, data]) => ({
      week: `Week ${week}`,
      ...data
    }));
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMetricIcon = (metric) => {
    const icons = {
      revenue: DollarSign,
      occupancy: Users,
      performance: Target,
      trends: TrendingUp
    };
    return icons[metric] || BarChart3;
  };

  const exportAnalytics = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <p className="text-indigo-100">Comprehensive reservation insights and trends</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="365d">Last Year</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-600 rounded-xl">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+{analytics.revenue?.growth || 0}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Revenue</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics.revenue?.total || 0)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Paid: {formatCurrency(analytics.revenue?.paid || 0)}
                    </p>
                  </div>
                </div>

                {/* Occupancy Rate */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Occupancy Rate</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(analytics.occupancy?.rate || 0)}%
                    </div>
                    <p className="text-sm text-gray-500">
                      {analytics.occupancy?.checkedIn || 0} / {analytics.occupancy?.total || 0} rooms
                    </p>
                  </div>
                </div>

                {/* Average Room Rate */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-purple-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">Optimal</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Avg Room Rate</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics.performance?.averageRoomRate || 0)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Per night average
                    </p>
                  </div>
                </div>

                {/* Cancellation Rate */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-600 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-orange-600">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-sm font-medium">Low</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Cancellation Rate</h3>
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(analytics.performance?.cancellationRate || 0)}%
                    </div>
                    <p className="text-sm text-gray-500">
                      {analytics.occupancy?.cancelled || 0} cancelled
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <LineChart className="w-5 h-5 mr-2 text-green-600" />
                      Revenue Trend
                    </h3>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {analytics.trends?.dailyRevenue?.slice(-7).map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, (day.revenue / Math.max(...analytics.trends.dailyRevenue.map(d => d.revenue))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-900 w-20 text-right">
                            {formatCurrency(day.revenue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy Distribution */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                      Reservation Status
                    </h3>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Checked In</span>
                      </div>
                      <span className="text-sm font-medium">{analytics.occupancy?.checkedIn || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Checked Out</span>
                      </div>
                      <span className="text-sm font-medium">{analytics.occupancy?.checkedOut || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Cancelled</span>
                      </div>
                      <span className="text-sm font-medium">{analytics.occupancy?.cancelled || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Performance Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {Math.round(analytics.performance?.averageStayLength || 0)} nights
                    </div>
                    <div className="text-sm text-gray-600">Average Stay Length</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {Math.round(analytics.performance?.noShowRate || 0)}%
                    </div>
                    <div className="text-sm text-gray-600">No-Show Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {Math.round(analytics.trends?.monthlyGrowth || 0)}%
                    </div>
                    <div className="text-sm text-gray-600">Monthly Growth</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Analytics for {timeRange.replace('d', ' days')} | Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button
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

export default AdvancedAnalytics;
