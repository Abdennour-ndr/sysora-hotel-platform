import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  Settings, 
  Download,
  Eye,
  EyeOff,
  Grid,
  List,
  Filter,
  Search,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Bell
} from 'lucide-react';

// Import our new components
import OverviewStats from './OverviewStats';
import TodayActivity from './TodayActivity';
import QuickActions from './QuickActions';
import RecentReservations from './RecentReservations';
import AlertsNotifications from './AlertsNotifications';
import { overviewDataService } from './OverviewDataService';

const EnhancedOverview = ({ onTabChange, onShowGuestModal }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(60); // seconds

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Set up data listener
    const unsubscribe = overviewDataService.addListener((newData) => {
      setData(newData);
      setLastUpdate(new Date());
      setLoading(false);
    });

    // Start auto refresh if enabled
    if (autoRefresh) {
      overviewDataService.startAutoRefresh(refreshInterval * 1000);
    }

    // Start live updates simulation
    overviewDataService.simulateLiveUpdates();

    return () => {
      unsubscribe();
      overviewDataService.stopAutoRefresh();
    };
  }, [autoRefresh, refreshInterval]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await overviewDataService.getData();
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading overview data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    overviewDataService.refreshData();
  }, []);

  const handleActionClick = useCallback((action, data) => {
    switch (action) {
      case 'reservations':
        onTabChange('reservations');
        break;
      case 'add-guest':
        onShowGuestModal(true);
        break;
      case 'rooms':
        onTabChange('rooms');
        break;
      case 'analytics':
        onTabChange('analytics');
        break;
      case 'services':
        onTabChange('services');
        break;
      case 'payments':
        onTabChange('payments');
        break;
      case 'security':
        onTabChange('security');
        break;
      case 'optimization':
        onTabChange('optimization');
        break;
      case 'quick-checkin':
        // Handle quick check-in
        window.showToast && window.showToast('Quick check-in feature coming soon', 'info');
        break;
      case 'search-guest':
        // Handle guest search
        window.showToast && window.showToast('Guest search feature coming soon', 'info');
        break;
      case 'maintenance':
        // Handle maintenance request
        window.showToast && window.showToast('Maintenance request feature coming soon', 'info');
        break;
      case 'notifications':
        // Handle notifications
        window.showToast && window.showToast('Notifications center coming soon', 'info');
        break;
      case 'edit-reservation':
        // Handle edit reservation
        window.showToast && window.showToast('Edit reservation feature coming soon', 'info');
        break;
      default:
        console.log('Unknown action:', action, data);
    }
  }, [onTabChange, onShowGuestModal]);

  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header Controls with Better Visual Hierarchy */}
      <div className="bg-gradient-to-r from-white to-sysora-light rounded-2xl p-6 border border-gray-100 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-2xl shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-sysora-midnight">Dashboard Overview</h2>
                <p className="text-lg text-gray-600 font-medium">Real-time hotel management insights</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mt-2">
                  <span className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {formatLastUpdate(lastUpdate)}</span>
                  </span>
                  {autoRefresh && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-semibold">Live Updates Active</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Control Panel */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-sysora-midnight'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-sysora-midnight'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">List</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  autoRefresh
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`${autoRefresh ? 'Disable' : 'Enable'} auto refresh`}
              >
                <Zap className="w-4 h-4" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-3 bg-gray-100 text-gray-600 hover:bg-sysora-mint/10 hover:text-sysora-mint rounded-xl transition-all duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                className="p-3 bg-gray-100 text-gray-600 hover:bg-sysora-mint/10 hover:text-sysora-mint rounded-xl transition-all duration-200"
                title="Export data"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                className="p-3 bg-gray-100 text-gray-600 hover:bg-sysora-mint/10 hover:text-sysora-mint rounded-xl transition-all duration-200"
                title="Dashboard settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <OverviewStats data={data} loading={loading} />

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        {/* Today's Activity */}
        <TodayActivity 
          data={data} 
          loading={loading} 
          onRefresh={handleRefresh}
        />

        {/* Quick Actions */}
        <QuickActions 
          data={data}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Alerts & Notifications */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        <div className={viewMode === 'grid' ? 'lg:col-span-2' : ''}>
          <RecentReservations 
            data={data} 
            loading={loading} 
            onRefresh={handleRefresh}
            onActionClick={handleActionClick}
          />
        </div>
        
        <div>
          <AlertsNotifications 
            data={data} 
            loading={loading} 
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Performance Insights */}
      {data?.performance && (
        <div className="card">
          <h3 className="text-lg font-semibold text-sysora-midnight mb-4">Performance Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Avg Stay Duration</p>
              <p className="text-lg font-bold text-blue-600">{data.performance.averageStayDuration} days</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Repeat Guests</p>
              <p className="text-lg font-bold text-green-600">{data.performance.repeatGuestRate.toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Response Time</p>
              <p className="text-lg font-bold text-purple-600">{data.performance.averageResponseTime}m</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <Bell className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Satisfaction</p>
              <p className="text-lg font-bold text-orange-600">{data.performance.customerSatisfaction}/5</p>
            </div>
          </div>
        </div>
      )}

      {/* Weather Widget */}
      {data?.weather && (
        <div className="card">
          <h3 className="text-lg font-semibold text-sysora-midnight mb-4">Local Weather - {data.weather.city}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-sysora-midnight">{data.weather.temperature}°C</p>
                <p className="text-sm text-gray-600">{data.weather.condition}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Humidity: {data.weather.humidity}%</p>
                <p>Wind: {data.weather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {data.weather.forecast.map((day, index) => (
                <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">{day.day}</p>
                  <p className="text-sm font-medium">{day.high}°/{day.low}°</p>
                  <p className="text-xs text-gray-500">{day.condition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOverview;
