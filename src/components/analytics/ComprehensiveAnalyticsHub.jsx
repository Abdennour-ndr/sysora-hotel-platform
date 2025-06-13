import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bed, 
  CreditCard, 
  Calendar,
  Activity,
  Target,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Star,
  Clock,
  DollarSign,
  Coffee,
  Shield,
  Zap,
  Brain,
  Globe,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Layers
} from 'lucide-react';

// Import specialized analytics components
import BookingAnalytics from './sections/BookingAnalytics';
import RoomAnalytics from './sections/RoomAnalytics';
import GuestAnalytics from './sections/GuestAnalytics';
import PaymentAnalytics from './sections/PaymentAnalytics';
import OperationalAnalytics from './sections/OperationalAnalytics';
import AIAnalytics from './sections/AIAnalytics';
import SecurityAnalytics from './sections/SecurityAnalytics';
import PerformanceAnalytics from './sections/PerformanceAnalytics';

const ComprehensiveAnalyticsHub = ({ 
  reservations = [], 
  rooms = [], 
  guests = [], 
  payments = [],
  operations = [],
  security = []
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({});

  // Analytics sections configuration
  const analyticsSections = [
    {
      id: 'overview',
      title: 'Overview',
      subtitle: 'Complete platform insights',
      icon: BarChart3,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Comprehensive view of all platform metrics'
    },
    {
      id: 'bookings',
      title: 'Bookings',
      subtitle: 'Reservation analytics',
      icon: Calendar,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Booking trends, conversion rates, and revenue analysis'
    },
    {
      id: 'rooms',
      title: 'Rooms',
      subtitle: 'Occupancy & performance',
      icon: Bed,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Room utilization, pricing, and availability insights'
    },
    {
      id: 'guests',
      title: 'Guests',
      subtitle: 'Customer insights',
      icon: Users,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Guest behavior, satisfaction, and loyalty metrics'
    },
    {
      id: 'payments',
      title: 'Payments',
      subtitle: 'Financial analytics',
      icon: CreditCard,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: 'Revenue streams, payment methods, and financial health'
    },
    {
      id: 'operations',
      title: 'Operations',
      subtitle: 'Operational efficiency',
      icon: Activity,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Staff performance, service quality, and operational KPIs'
    },
    {
      id: 'ai',
      title: 'AI Insights',
      subtitle: 'Machine learning analytics',
      icon: Brain,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'AI-powered predictions and intelligent recommendations'
    },
    {
      id: 'security',
      title: 'Security',
      subtitle: 'Security monitoring',
      icon: Shield,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Security events, access logs, and threat analysis'
    },
    {
      id: 'performance',
      title: 'Performance',
      subtitle: 'System performance',
      icon: Zap,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'System metrics, response times, and resource usage'
    }
  ];

  useEffect(() => {
    loadAnalyticsOverview();
    startRealTimeUpdates();
  }, [selectedTimeframe]);

  const loadAnalyticsOverview = async () => {
    setLoading(true);
    try {
      // Calculate comprehensive overview metrics
      const overview = {
        totalMetrics: {
          totalBookings: reservations.length,
          totalRevenue: reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
          totalGuests: guests.length,
          occupancyRate: calculateOccupancyRate(),
          averageRating: calculateAverageRating(),
          conversionRate: calculateConversionRate()
        },
        sectionMetrics: {
          bookings: {
            count: reservations.length,
            growth: calculateGrowth('bookings'),
            trend: 'up',
            status: 'healthy'
          },
          rooms: {
            count: rooms.length,
            occupancy: calculateOccupancyRate(),
            trend: 'up',
            status: 'optimal'
          },
          guests: {
            count: guests.length,
            satisfaction: calculateAverageRating(),
            trend: 'up',
            status: 'excellent'
          },
          payments: {
            revenue: reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
            growth: calculateGrowth('revenue'),
            trend: 'up',
            status: 'strong'
          }
        },
        alerts: generateAlerts(),
        insights: generateInsights()
      };

      setAnalyticsOverview(overview);
    } catch (error) {
      console.error('Error loading analytics overview:', error);
    } finally {
      setLoading(false);
    }
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

  const calculateOccupancyRate = () => {
    if (rooms.length === 0) return 0;
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    return Math.round((occupiedRooms / rooms.length) * 100);
  };

  const calculateAverageRating = () => {
    const ratings = reservations.filter(r => r.rating).map(r => r.rating);
    if (ratings.length === 0) return 0;
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
  };

  const calculateConversionRate = () => {
    // Simulated conversion rate calculation
    return 85.3;
  };

  const calculateGrowth = (metric) => {
    // Simulated growth calculation
    return Math.floor(Math.random() * 20) + 5;
  };

  const generateAlerts = () => {
    return [
      {
        type: 'warning',
        message: 'Room occupancy below target (85%)',
        section: 'rooms',
        priority: 'medium'
      },
      {
        type: 'info',
        message: 'New AI insights available',
        section: 'ai',
        priority: 'low'
      }
    ];
  };

  const generateInsights = () => {
    return [
      {
        title: 'Peak booking hours',
        description: 'Most bookings occur between 2-4 PM',
        impact: 'high',
        section: 'bookings'
      },
      {
        title: 'Guest satisfaction trend',
        description: 'Rating increased by 0.3 points this month',
        impact: 'positive',
        section: 'guests'
      }
    ];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-sysora-mint mx-auto mb-4" />
          <p className="text-gray-600">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Top */}
        <div className="bg-gradient-to-r from-sysora-midnight to-blue-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sysora-mint/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-sysora-mint" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Comprehensive Analytics</h1>
                <p className="text-blue-100/80 text-sm">Complete platform insights and intelligence</p>
              </div>
            </div>
            
            {/* Real-time Status */}
            <div className="flex items-center space-x-4 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <div>Last update: {realTimeData.lastUpdate}</div>
            </div>
          </div>
        </div>

        {/* Quick Overview Stats */}
        {analyticsOverview && (
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{analyticsOverview.totalMetrics.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analyticsOverview.totalMetrics.totalRevenue)}</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{analyticsOverview.totalMetrics.totalGuests}</div>
                <div className="text-sm text-gray-600">Guests</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{formatPercentage(analyticsOverview.totalMetrics.occupancyRate)}</div>
                <div className="text-sm text-gray-600">Occupancy</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{analyticsOverview.totalMetrics.averageRating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{formatPercentage(analyticsOverview.totalMetrics.conversionRate)}</div>
                <div className="text-sm text-gray-600">Conversion</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-sysora-mint' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${section.lightColor}`}>
                  <Icon className={`w-6 h-6 ${section.textColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                  
                  {/* Section-specific metrics */}
                  {analyticsOverview?.sectionMetrics[section.id] && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">{section.subtitle}</div>
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          +{analyticsOverview.sectionMetrics[section.id].growth || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {activeSection === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>
            {/* Overview content will be rendered here */}
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Comprehensive overview dashboard coming soon...</p>
            </div>
          </div>
        )}
        
        {activeSection === 'bookings' && (
          <BookingAnalytics 
            reservations={reservations} 
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'rooms' && (
          <RoomAnalytics 
            rooms={rooms} 
            reservations={reservations}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'guests' && (
          <GuestAnalytics 
            guests={guests} 
            reservations={reservations}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'payments' && (
          <PaymentAnalytics 
            payments={payments} 
            reservations={reservations}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'operations' && (
          <OperationalAnalytics 
            operations={operations}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'ai' && (
          <AIAnalytics 
            data={{ reservations, rooms, guests }}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'security' && (
          <SecurityAnalytics 
            security={security}
            timeframe={selectedTimeframe}
          />
        )}
        
        {activeSection === 'performance' && (
          <PerformanceAnalytics 
            timeframe={selectedTimeframe}
          />
        )}
      </div>
    </div>
  );
};

export default ComprehensiveAnalyticsHub;
