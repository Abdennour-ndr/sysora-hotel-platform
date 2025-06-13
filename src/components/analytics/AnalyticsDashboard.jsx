import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Bed,
  Star,
  Clock,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Brain,
  Database
} from 'lucide-react';
import realDataAnalyticsService from '../../services/RealDataAnalyticsService';

const AnalyticsDashboard = ({ reservations = [], rooms = [], customers = [] }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedMetric, reservations, rooms, customers]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Initialize service with real data
      await realDataAnalyticsService.initialize({
        reservations,
        rooms,
        customers
      });

      // Get comprehensive analytics from real data
      const realAnalytics = await realDataAnalyticsService.getComprehensiveAnalytics(
        reservations, rooms, customers
      );

      if (realAnalytics.realData) {
        // Use real data analytics
        setAnalyticsData(realAnalytics);
        setDataQuality(realAnalytics.dataQuality);
        setIsRealData(true);
      } else {
        // Fallback to simulated data if real data is insufficient
        const data = await generateFallbackData();
        setAnalyticsData(data);
        setIsRealData(false);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Load fallback data on error
      const fallbackData = await generateFallbackData();
      setAnalyticsData(fallbackData);
      setIsRealData(false);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackData = async () => {
    try {
      // Fallback to simulated data when real data is not available
      const data = {
        overview: {
          totalRevenue: 2456789,
          revenueGrowth: 12.5,
          totalBookings: 1247,
          bookingsGrowth: 8.3,
          occupancyRate: 87.2,
          occupancyGrowth: 5.7,
          averageRate: 15600,
          rateGrowth: -2.1,
          totalGuests: 3456,
          guestsGrowth: 15.2,
          repeatCustomers: 34.7,
          repeatGrowth: 7.8
        },
        revenueBreakdown: {
          rooms: { amount: 1847592, percentage: 75.2, growth: 11.3 },
          services: { amount: 368947, percentage: 15.0, growth: 18.7 },
          dining: { amount: 184473, percentage: 7.5, growth: 22.1 },
          other: { amount: 55777, percentage: 2.3, growth: -5.4 }
        },
        bookingChannels: {
          direct: { bookings: 498, percentage: 39.9, revenue: 982456 },
          online: { bookings: 374, percentage: 30.0, revenue: 736789 },
          walkIn: { bookings: 249, percentage: 20.0, revenue: 491234 },
          corporate: { bookings: 126, percentage: 10.1, revenue: 246310 }
        },
        guestDemographics: {
          ageGroups: {
            '18-25': { count: 345, percentage: 10.0 },
            '26-35': { count: 1038, percentage: 30.0 },
            '36-45': { count: 1211, percentage: 35.0 },
            '46-55': { count: 691, percentage: 20.0 },
            '56+': { count: 173, percentage: 5.0 }
          },
          countries: {
            'Algeria': { count: 1728, percentage: 50.0 },
            'France': { count: 691, percentage: 20.0 },
            'Tunisia': { count: 519, percentage: 15.0 },
            'Morocco': { count: 346, percentage: 10.0 },
            'Other': { count: 173, percentage: 5.0 }
          },
          purposes: {
            'Business': { count: 1728, percentage: 50.0 },
            'Leisure': { count: 1038, percentage: 30.0 },
            'Conference': { count: 519, percentage: 15.0 },
            'Other': { count: 173, percentage: 5.0 }
          }
        },
        performanceMetrics: {
          averageStayDuration: 2.3,
          checkInTime: '14:32',
          checkOutTime: '11:18',
          roomTurnoverTime: '45 min',
          guestSatisfaction: 4.7,
          reviewScore: 4.6,
          responseTime: '12 min',
          complaintResolution: '2.4 hours'
        },
        trends: {
          daily: generateDailyTrends(30),
          weekly: generateWeeklyTrends(12),
          monthly: generateMonthlyTrends(12),
          hourly: generateHourlyTrends(24)
        },
        forecasts: {
          nextMonth: {
            revenue: 2678456,
            bookings: 1372,
            occupancy: 89.5,
            confidence: 87.3
          },
          nextQuarter: {
            revenue: 7845123,
            bookings: 4016,
            occupancy: 85.7,
            confidence: 82.1
          }
        }
      };

      setAnalyticsData(data);
      return data;
    } catch (error) {
      console.error('Error generating fallback data:', error);
      return null;
    }
  };

  const generateDailyTrends = (days) => {
    const trends = [];
    for (let i = days; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 100000) + 50000,
        bookings: Math.floor(Math.random() * 50) + 20,
        occupancy: Math.floor(Math.random() * 30) + 70,
        guests: Math.floor(Math.random() * 150) + 80
      });
    }
    return trends;
  };

  const generateWeeklyTrends = (weeks) => {
    const trends = [];
    for (let i = weeks; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      trends.push({
        week: `Week ${weeks - i + 1}`,
        revenue: Math.floor(Math.random() * 500000) + 300000,
        bookings: Math.floor(Math.random() * 200) + 150,
        occupancy: Math.floor(Math.random() * 20) + 75,
        guests: Math.floor(Math.random() * 600) + 400
      });
    }
    return trends;
  };

  const generateMonthlyTrends = (months) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trends = [];
    for (let i = months; i >= 1; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      trends.push({
        month: monthNames[date.getMonth()],
        revenue: Math.floor(Math.random() * 2000000) + 1500000,
        bookings: Math.floor(Math.random() * 800) + 600,
        occupancy: Math.floor(Math.random() * 25) + 70,
        guests: Math.floor(Math.random() * 2500) + 2000
      });
    }
    return trends;
  };

  const generateHourlyTrends = (hours) => {
    const trends = [];
    for (let i = 0; i < hours; i++) {
      trends.push({
        hour: `${i.toString().padStart(2, '0')}:00`,
        checkIns: Math.floor(Math.random() * 20) + (i >= 14 && i <= 18 ? 30 : 5),
        checkOuts: Math.floor(Math.random() * 15) + (i >= 10 && i <= 12 ? 25 : 2),
        bookings: Math.floor(Math.random() * 10) + (i >= 9 && i <= 17 ? 15 : 2)
      });
    }
    return trends;
  };

  const getTrendIcon = (growth) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const periods = [
    { id: '7days', name: '7 Days' },
    { id: '30days', name: '30 Days' },
    { id: '90days', name: '90 Days' },
    { id: '365days', name: '1 Year' }
  ];

  const metrics = [
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'occupancy', name: 'Occupancy', icon: Bed },
    { id: 'guests', name: 'Guests', icon: Users }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                {isRealData && (
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full font-medium flex items-center space-x-1">
                    <Database className="w-4 h-4" />
                    <span>Real Data</span>
                  </span>
                )}
                {analyticsData?.aiAnalytics && (
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full font-medium flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>AI Enhanced</span>
                  </span>
                )}
              </div>
              <p className="text-blue-100">
                Comprehensive business intelligence and insights
                {dataQuality && (
                  <span className={`ml-2 font-medium ${
                    dataQuality.level === 'excellent' ? 'text-green-200' :
                    dataQuality.level === 'good' ? 'text-blue-200' :
                    dataQuality.level === 'fair' ? 'text-yellow-200' : 'text-red-200'
                  }`}>
                    • Data Quality: {dataQuality.level} ({dataQuality.score.toFixed(0)}%)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id} className="text-gray-900">
                  {period.name}
                </option>
              ))}
            </select>
            
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">REVENUE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.revenueGrowth)}`}>
              {getTrendIcon(analyticsData.overview.revenueGrowth)}
              <span>{formatPercentage(analyticsData.overview.revenueGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">BOOKINGS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-900">
              {analyticsData.overview.totalBookings.toLocaleString()}
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.bookingsGrowth)}`}>
              {getTrendIcon(analyticsData.overview.bookingsGrowth)}
              <span>{formatPercentage(analyticsData.overview.bookingsGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-purple-600 font-medium">OCCUPANCY</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-900">
              {analyticsData.overview.occupancyRate}%
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.occupancyGrowth)}`}>
              {getTrendIcon(analyticsData.overview.occupancyGrowth)}
              <span>{formatPercentage(analyticsData.overview.occupancyGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-medium">AVG RATE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(analyticsData.overview.averageRate)}
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.rateGrowth)}`}>
              {getTrendIcon(analyticsData.overview.rateGrowth)}
              <span>{formatPercentage(analyticsData.overview.rateGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-indigo-600 font-medium">GUESTS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-indigo-900">
              {analyticsData.overview.totalGuests.toLocaleString()}
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.guestsGrowth)}`}>
              {getTrendIcon(analyticsData.overview.guestsGrowth)}
              <span>{formatPercentage(analyticsData.overview.guestsGrowth)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-600 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-pink-600 font-medium">REPEAT</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-pink-900">
              {analyticsData.overview.repeatCustomers}%
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(analyticsData.overview.repeatGrowth)}`}>
              {getTrendIcon(analyticsData.overview.repeatGrowth)}
              <span>{formatPercentage(analyticsData.overview.repeatGrowth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(analyticsData.revenueBreakdown).map(([category, data]) => (
            <div key={category} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={category === 'rooms' ? '#3B82F6' : category === 'services' ? '#10B981' : category === 'dining' ? '#F59E0B' : '#6B7280'}
                    strokeWidth="3"
                    strokeDasharray={`${data.percentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{data.percentage}%</span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 capitalize mb-1">{category}</h4>
              <p className="text-sm text-gray-600 mb-2">{formatCurrency(data.amount)}</p>
              <div className={`flex items-center justify-center space-x-1 text-xs ${getTrendColor(data.growth)}`}>
                {getTrendIcon(data.growth)}
                <span>{formatPercentage(data.growth)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
