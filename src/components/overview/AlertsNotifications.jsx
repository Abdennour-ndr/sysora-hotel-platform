import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  XCircle,
  X,
  Eye,
  EyeOff,
  Filter,
  Clock,
  Star,
  TrendingUp,
  Settings,
  Zap,
  Shield,
  Users,
  DollarSign,
  Calendar,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';

const AlertsNotifications = ({ data, loading, onRefresh }) => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    if (data?.alerts) {
      setAlerts(data.alerts);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showRead && alert.read) return false;
    if (filter === 'all') return true;
    return alert.type === filter || alert.priority === filter;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && !alert.read).length;

  // Generate system alerts based on data
  const generateSystemAlerts = () => {
    const systemAlerts = [];
    
    if (data?.overview?.occupancyRate > 90) {
      systemAlerts.push({
        id: 'high-occupancy',
        type: 'warning',
        title: 'High Occupancy Alert',
        message: `Hotel occupancy is at ${data.overview.occupancyRate.toFixed(1)}% - consider overbooking management`,
        timestamp: new Date().toISOString(),
        priority: 'medium',
        read: false,
        category: 'operations'
      });
    }
    
    if (data?.today?.maintenanceRequests > 5) {
      systemAlerts.push({
        id: 'maintenance-backlog',
        type: 'warning',
        title: 'Maintenance Backlog',
        message: `${data.today.maintenanceRequests} maintenance requests pending attention`,
        timestamp: new Date().toISOString(),
        priority: 'high',
        read: false,
        category: 'maintenance'
      });
    }
    
    if (data?.revenue?.growth > 10) {
      systemAlerts.push({
        id: 'revenue-growth',
        type: 'success',
        title: 'Excellent Revenue Growth',
        message: `Revenue increased by ${data.revenue.growth.toFixed(1)}% compared to last month`,
        timestamp: new Date().toISOString(),
        priority: 'low',
        read: false,
        category: 'revenue'
      });
    }
    
    if (data?.today?.pendingReservations > 15) {
      systemAlerts.push({
        id: 'pending-reservations',
        type: 'info',
        title: 'High Pending Reservations',
        message: `${data.today.pendingReservations} reservations require confirmation`,
        timestamp: new Date().toISOString(),
        priority: 'medium',
        read: false,
        category: 'reservations'
      });
    }
    
    return systemAlerts;
  };

  const systemAlerts = generateSystemAlerts();
  const allAlerts = [...alerts, ...systemAlerts];
  const displayAlerts = allAlerts.filter(alert => {
    if (!showRead && alert.read) return false;
    if (filter === 'all') return true;
    return alert.type === filter || alert.priority === filter;
  });

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-sysora-midnight">Alerts & Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {unreadCount} unread
            </span>
          )}
          {highPriorityCount > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              {highPriorityCount} urgent
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowRead(!showRead)}
            className="p-2 text-gray-600 hover:text-sysora-mint transition-colors"
            title={showRead ? 'Hide Read' : 'Show Read'}
          >
            {showRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-sysora-mint transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-sysora-mint hover:text-sysora-midnight transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'warning', 'error', 'success', 'info', 'high', 'medium', 'low'].map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === filterOption
                ? 'bg-sysora-mint text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption === 'all' ? 'All' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {displayAlerts.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start space-x-3 p-4 border rounded-xl transition-all duration-200 ${
                getAlertBgColor(alert.type)
              } ${alert.read ? 'opacity-75' : 'shadow-sm hover:shadow-md'}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </span>
                      {alert.category && (
                        <span className="px-2 py-0.5 bg-gray-200 rounded-full">
                          {alert.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'All caught up! No new notifications at the moment.'
              : `No notifications matching the ${filter} filter.`
            }
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {displayAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">
              View All Alerts
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
              Alert Settings
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors">
              Export Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsNotifications;
