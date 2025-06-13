import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  Bed,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Brain,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Settings,
  ArrowUp,
  ArrowDown,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

const UnifiedAnalyticsCenter = ({ 
  reservations = [], 
  rooms = [], 
  guests = [], 
  payments = [],
  operations = []
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});

  // Analytics sections configuration
  const analyticsSections = [
    {
      id: 'overview',
      title: 'Overview Dashboard',
      icon: BarChart3,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Complete platform overview and key metrics'
    },
    {
      id: 'bookings',
      title: 'Bookings Analytics',
      icon: Calendar,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Reservation trends and booking performance'
    },
    {
      id: 'rooms',
      title: 'Rooms Analytics',
      icon: Bed,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Occupancy rates and room performance'
    },
    {
      id: 'guests',
      title: 'Guest Analytics',
      icon: Users,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Guest behavior and satisfaction insights'
    },
    {
      id: 'financial',
      title: 'Financial Analytics',
      icon: DollarSign,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: 'Revenue analysis and financial metrics'
    },
    {
      id: 'operational',
      title: 'Operational Analytics',
      icon: Activity,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Operational efficiency and performance'
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      icon: Brain,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'AI-powered predictions and forecasts'
    }
  ];

  useEffect(() => {
    loadAnalyticsData();
    startRealTimeUpdates();
  }, [selectedTimeframe, activeSection]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Calculate comprehensive analytics
      const analytics = calculateAnalytics();
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const now = new Date();
    const daysBack = selectedTimeframe === '7days' ? 7 : selectedTimeframe === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const filteredReservations = reservations.filter(r => 
      new Date(r.createdAt || r.checkInDate) >= startDate
    );

    // Overview metrics
    const overview = {
      totalBookings: filteredReservations.length,
      totalRevenue: filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
      occupancyRate: rooms.length > 0 ? (rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100 : 0,
      averageRating: calculateAverageRating(filteredReservations),
      guestCount: guests.length,
      conversionRate: 85.3, // Simulated
      bookingGrowth: calculateGrowth('bookings', filteredReservations.length),
      revenueGrowth: calculateGrowth('revenue', filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0))
    };

    // Section-specific analytics
    const sections = {
      bookings: calculateBookingAnalytics(filteredReservations),
      rooms: calculateRoomAnalytics(rooms, filteredReservations),
      guests: calculateGuestAnalytics(guests, filteredReservations),
      financial: calculateFinancialAnalytics(filteredReservations),
      operational: calculateOperationalAnalytics(operations),
      predictive: calculatePredictiveAnalytics(filteredReservations)
    };

    return { overview, sections };
  };

  const calculateAverageRating = (reservations) => {
    const ratings = reservations.filter(r => r.rating).map(r => r.rating);
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 0;
  };

  const calculateGrowth = (type, currentValue) => {
    // Simulate growth calculation
    const previousValue = currentValue * (0.85 + Math.random() * 0.3);
    return previousValue > 0 ? ((currentValue - previousValue) / previousValue * 100).toFixed(1) : 0;
  };

  const calculateBookingAnalytics = (reservations) => {
    return {
      totalBookings: reservations.length,
      confirmedBookings: reservations.filter(r => r.status === 'confirmed').length,
      pendingBookings: reservations.filter(r => r.status === 'pending').length,
      cancelledBookings: reservations.filter(r => r.status === 'cancelled').length,
      averageBookingValue: reservations.length > 0 ? reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0) / reservations.length : 0,
      bookingSources: {
        direct: Math.floor(reservations.length * 0.45),
        online: Math.floor(reservations.length * 0.35),
        phone: Math.floor(reservations.length * 0.15),
        walkin: Math.floor(reservations.length * 0.05)
      }
    };
  };

  const calculateRoomAnalytics = (rooms, reservations) => {
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
    
    return {
      totalRooms: rooms.length,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      occupancyRate: rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0,
      averageDailyRate: reservations.length > 0 ? reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0) / reservations.length : 0,
      revenuePerAvailableRoom: rooms.length > 0 ? reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0) / (rooms.length * 30) : 0
    };
  };

  const calculateGuestAnalytics = (guests, reservations) => {
    const ratingsData = reservations.filter(r => r.rating);
    const averageRating = ratingsData.length > 0 ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length : 0;
    
    return {
      totalGuests: guests.length,
      newGuests: Math.floor(guests.length * 0.3),
      returningGuests: Math.floor(guests.length * 0.7),
      averageRating: averageRating.toFixed(1),
      satisfactionRate: averageRating >= 4 ? 'Excellent' : averageRating >= 3 ? 'Good' : 'Needs Improvement',
      loyaltyRate: 68.5 // Simulated
    };
  };

  const calculateFinancialAnalytics = (reservations) => {
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const totalPaid = reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    
    return {
      totalRevenue,
      totalPaid,
      pendingAmount: totalRevenue - totalPaid,
      collectionRate: totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0,
      averageTransactionValue: reservations.length > 0 ? totalRevenue / reservations.length : 0,
      paymentMethods: {
        creditCard: Math.floor(totalRevenue * 0.65),
        debitCard: Math.floor(totalRevenue * 0.20),
        cash: Math.floor(totalRevenue * 0.10),
        bankTransfer: Math.floor(totalRevenue * 0.05)
      }
    };
  };

  const calculateOperationalAnalytics = (operations) => {
    return {
      efficiency: 92.5,
      staffUtilization: 87.3,
      serviceQuality: 4.6,
      responseTime: 12.5,
      taskCompletion: 94.8,
      customerSatisfaction: 4.7
    };
  };

  const calculatePredictiveAnalytics = (reservations) => {
    return {
      demandForecast: 'High',
      occupancyPrediction: 89.2,
      revenueForecast: reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0) * 1.15,
      seasonalTrends: 'Peak Season',
      recommendedActions: [
        'Increase pricing for weekend stays',
        'Promote off-peak bookings',
        'Focus on guest retention programs'
      ]
    };
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      setRealTimeData({
        lastUpdate: new Date().toLocaleTimeString(),
        activeUsers: Math.floor(Math.random() * 50) + 10,
        systemLoad: Math.floor(Math.random() * 30) + 40,
        responseTime: Math.floor(Math.random() * 100) + 50
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-sysora-mint mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-sysora-midnight to-blue-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sysora-mint/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-sysora-mint" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics Center</h1>
                <p className="text-blue-100/80 text-sm">Unified analytics and insights hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sysora-mint"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
              
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview Stats */}
        {analyticsData && (
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{analyticsData.overview.totalBookings}</div>
                <div className="text-xs text-gray-600">Bookings</div>
                <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {formatPercentage(analyticsData.overview.bookingGrowth)}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-600">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
                <div className="text-xs text-gray-600">Revenue</div>
                <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {formatPercentage(analyticsData.overview.revenueGrowth)}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{analyticsData.overview.guestCount}</div>
                <div className="text-xs text-gray-600">Guests</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{analyticsData.overview.occupancyRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Occupancy</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-yellow-600">{analyticsData.overview.averageRating}</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-indigo-600">{analyticsData.overview.conversionRate}%</div>
                <div className="text-xs text-gray-600">Conversion</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-600">{realTimeData.activeUsers || 0}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-600">{realTimeData.responseTime || 0}ms</div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {analyticsSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-sysora-mint' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl ${section.lightColor}`}>
                  <Icon className={`w-6 h-6 ${section.textColor}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                </div>
                
                {analyticsData?.sections[section.id] && (
                  <div className="text-xs text-gray-500">
                    Updated {realTimeData.lastUpdate || 'now'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {analyticsSections.find(s => s.id === activeSection)?.title || 'Analytics'}
          </h2>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-sysora-mint text-sysora-midnight hover:bg-sysora-mint/90 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'overview' && analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Booking Performance</h4>
                <div className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalBookings}</div>
                <div className="text-sm text-blue-700">Total bookings this period</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Revenue Growth</h4>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
                <div className="text-sm text-green-700">Total revenue generated</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Guest Satisfaction</h4>
                <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.averageRating}/5</div>
                <div className="text-sm text-purple-700">Average guest rating</div>
              </div>
            </div>
          )}

          {activeSection !== 'overview' && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Detailed {analyticsSections.find(s => s.id === activeSection)?.title} coming soon...</p>
              <p className="text-sm mt-2">Advanced analytics and insights will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAnalyticsCenter;
