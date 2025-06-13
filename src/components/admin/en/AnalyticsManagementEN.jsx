import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  ArrowUp,
  ArrowDown,
  Percent,
  Clock,
  Globe,
  Activity
} from 'lucide-react';

const AnalyticsManagementEN = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in real app this would come from API
  const analyticsData = {
    overview: {
      totalRevenue: 125000,
      revenueGrowth: 12.5,
      totalUsers: 2847,
      userGrowth: 8.3,
      totalHotels: 156,
      hotelGrowth: 15.2,
      conversionRate: 23.8,
      conversionGrowth: -2.1
    },
    chartData: {
      revenue: [
        { month: 'January', value: 85000 },
        { month: 'February', value: 92000 },
        { month: 'March', value: 78000 },
        { month: 'April', value: 105000 },
        { month: 'May', value: 118000 },
        { month: 'June', value: 125000 }
      ],
      users: [
        { month: 'January', value: 1200 },
        { month: 'February', value: 1450 },
        { month: 'March', value: 1680 },
        { month: 'April', value: 2100 },
        { month: 'May', value: 2450 },
        { month: 'June', value: 2847 }
      ]
    },
    topHotels: [
      { name: 'Ritz Carlton Hotel', revenue: 25000, growth: 15.2 },
      { name: 'Four Seasons Hotel', revenue: 22000, growth: 12.8 },
      { name: 'Hilton Hotel', revenue: 18500, growth: 8.9 },
      { name: 'Marriott Hotel', revenue: 16200, growth: 6.4 },
      { name: 'Sheraton Hotel', revenue: 14800, growth: 4.2 }
    ]
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const GrowthIndicator = ({ value, isPositive }) => (
    <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      <span className="text-sm font-medium">{Math.abs(value)}%</span>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sysora-midnight">Advanced Analytics</h2>
          <p className="text-gray-600">Detailed reports and analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className={`p-3 text-gray-600 hover:text-sysora-midnight hover:bg-gray-50 rounded-2xl transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight px-4 py-2 rounded-2xl font-medium transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <GrowthIndicator value={analyticsData.overview.revenueGrowth} isPositive={true} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <GrowthIndicator value={analyticsData.overview.userGrowth} isPositive={true} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(analyticsData.overview.totalUsers)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active users</p>
          </div>
        </div>

        {/* Total Hotels */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Building className="w-7 h-7 text-purple-600" />
            </div>
            <GrowthIndicator value={analyticsData.overview.hotelGrowth} isPositive={true} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Hotels</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(analyticsData.overview.totalHotels)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Registered hotels</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <Percent className="w-7 h-7 text-yellow-600" />
            </div>
            <GrowthIndicator value={analyticsData.overview.conversionGrowth} isPositive={false} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {analyticsData.overview.conversionRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Visitors to customers</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          
          {/* Simple Bar Chart Representation */}
          <div className="space-y-4">
            {analyticsData.chartData.revenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-16">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                      style={{ width: `${(item.value / 125000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hotels */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Hotels</h3>
            <button className="text-sysora-mint hover:text-sysora-mint/80 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {analyticsData.topHotels.map((hotel, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-sysora-mint" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{hotel.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(hotel.revenue)}</p>
                  </div>
                </div>
                <GrowthIndicator value={hotel.growth} isPositive={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sysora-mint" />
            <span className="text-sm text-gray-600">Live updates</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New hotel registration</p>
              <p className="text-xs text-gray-500">Ritz Carlton - Riyadh</p>
            </div>
            <span className="text-xs text-gray-500">5 minutes ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New subscription</p>
              <p className="text-xs text-gray-500">Premium plan - $299/month</p>
            </div>
            <span className="text-xs text-gray-500">12 minutes ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-2xl">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Plan upgrade</p>
              <p className="text-xs text-gray-500">Upgraded from Basic to Standard</p>
            </div>
            <span className="text-xs text-gray-500">25 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManagementEN;
