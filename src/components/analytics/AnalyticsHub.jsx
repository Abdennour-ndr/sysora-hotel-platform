import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText,
  Activity,
  Target,
  Settings,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Eye,
  Star,
  Clock,
  Users,
  DollarSign,
  Bed,
  Coffee,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react';

import AnalyticsDashboard from './AnalyticsDashboard';
import ReportsCenter from './ReportsCenter';
import ForecastingHub from './ForecastingHub';
import PerformanceMonitor from './PerformanceMonitor';

const AnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsOverview();
  }, []);

  const loadAnalyticsOverview = async () => {
    setLoading(true);
    try {
      // Load overview data for the hub
      const overview = {
        summary: {
          totalRevenue: 2456789,
          revenueGrowth: 12.5,
          totalBookings: 1247,
          bookingsGrowth: 8.3,
          occupancyRate: 87.2,
          occupancyGrowth: 5.7,
          guestSatisfaction: 4.7,
          satisfactionGrowth: 3.2
        },
        recentReports: [
          {
            id: 'revenue-summary',
            name: 'Revenue Summary',
            lastGenerated: '2024-12-15T08:30:00Z',
            status: 'completed',
            downloads: 156
          },
          {
            id: 'occupancy-analysis',
            name: 'Occupancy Analysis',
            lastGenerated: '2024-12-14T16:45:00Z',
            status: 'completed',
            downloads: 89
          },
          {
            id: 'guest-satisfaction',
            name: 'Guest Satisfaction',
            lastGenerated: '2024-12-12T14:20:00Z',
            status: 'completed',
            downloads: 234
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'warning',
            title: 'Revenue Below Target',
            message: 'Current month revenue is 8% below target',
            timestamp: '2024-12-15T10:30:00Z'
          },
          {
            id: 2,
            type: 'info',
            title: 'New Report Available',
            message: 'Monthly financial report has been generated',
            timestamp: '2024-12-15T09:15:00Z'
          },
          {
            id: 3,
            type: 'success',
            title: 'Forecast Updated',
            message: 'Q1 2025 forecasts have been updated with 94% accuracy',
            timestamp: '2024-12-15T08:45:00Z'
          }
        ],
        quickStats: {
          totalReports: 47,
          scheduledReports: 12,
          activeForecasts: 8,
          monitoringAlerts: 3
        }
      };

      setAnalyticsOverview(overview);
    } catch (error) {
      console.error('Error loading analytics overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'dashboard', name: 'Analytics Dashboard', icon: TrendingUp },
    { id: 'reports', name: 'Reports Center', icon: FileText },
    { id: 'forecasting', name: 'Forecasting', icon: Target },
    { id: 'monitoring', name: 'Performance Monitor', icon: Activity }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Analytics & Intelligence Hub</h2>
              <p className="text-indigo-100">Comprehensive business analytics and reporting platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">REVENUE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(analyticsOverview.summary.totalRevenue)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +{analyticsOverview.summary.revenueGrowth}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">BOOKINGS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-900">
                      {analyticsOverview.summary.totalBookings.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +{analyticsOverview.summary.bookingsGrowth}%
                      </span>
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
                      {analyticsOverview.summary.occupancyRate}%
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +{analyticsOverview.summary.occupancyGrowth}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-orange-600 font-medium">SATISFACTION</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-900">
                      {analyticsOverview.summary.guestSatisfaction}/5.0
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        +{analyticsOverview.summary.satisfactionGrowth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                    <button 
                      onClick={() => setActiveTab('reports')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {analyticsOverview.recentReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{report.name}</h4>
                          <p className="text-sm text-gray-600">{formatDate(report.lastGenerated)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
                    <button 
                      onClick={() => setActiveTab('monitoring')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {analyticsOverview.alerts.map(alert => (
                      <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm mt-1">{alert.message}</p>
                            <span className="text-xs mt-2 block">{formatDate(alert.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{analyticsOverview.quickStats.totalReports}</div>
                    <p className="text-sm text-blue-700">Total Reports</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{analyticsOverview.quickStats.scheduledReports}</div>
                    <p className="text-sm text-green-700">Scheduled Reports</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{analyticsOverview.quickStats.activeForecasts}</div>
                    <p className="text-sm text-purple-700">Active Forecasts</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">{analyticsOverview.quickStats.monitoringAlerts}</div>
                    <p className="text-sm text-orange-700">Active Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <AnalyticsDashboard />}
          {activeTab === 'reports' && <ReportsCenter />}
          {activeTab === 'forecasting' && <ForecastingHub />}
          {activeTab === 'monitoring' && <PerformanceMonitor />}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;
