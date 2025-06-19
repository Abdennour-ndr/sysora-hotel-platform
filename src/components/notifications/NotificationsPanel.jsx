import React, { useState } from 'react';
import {
  X,
  Bell,
  Check,
  Trash2,
  Filter,
  Search,
  Calendar,
  Users,
  Bed,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

const NotificationsPanel = ({ isOpen, onClose, notifications = [] }) => {
  const [filter, setFilter] = useState('all'); // all, unread, booking, maintenance, guest
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'guest':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'housekeeping':
        return <Bed className="w-5 h-5 text-yellow-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking':
        return 'border-l-blue-500 bg-blue-50';
      case 'guest':
        return 'border-l-green-500 bg-green-50';
      case 'maintenance':
        return 'border-l-red-500 bg-red-50';
      case 'housekeeping':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'system':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         notification.type === filter;
    
    const matchesSearch = searchQuery === '' ||
                         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (notificationId) => {
    // Implementation would update the notification status
    console.log('Mark as read:', notificationId);
  };

  const markAllAsRead = () => {
    // Implementation would mark all notifications as read
    console.log('Mark all as read');
  };

  const deleteNotification = (notificationId) => {
    // Implementation would delete the notification
    console.log('Delete notification:', notificationId);
  };

  const clearAll = () => {
    // Implementation would clear all notifications
    console.log('Clear all notifications');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {notifications.filter(n => !n.read).length} unread
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {[
                  { id: 'all', name: 'All' },
                  { id: 'unread', name: 'Unread' },
                  { id: 'booking', name: 'Bookings' },
                  { id: 'maintenance', name: 'Maintenance' },
                  { id: 'guest', name: 'Guests' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.name}
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-opacity-50' : 'bg-opacity-20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'maintenance' ? 'bg-red-100 text-red-800' :
                            notification.type === 'guest' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredNotifications.length} notifications</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
