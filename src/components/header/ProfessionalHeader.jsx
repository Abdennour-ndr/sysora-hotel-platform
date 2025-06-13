import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings,
  User,
  HelpCircle,
  Plus,
  Calendar,
  Users,
  Bed,
  TrendingUp,
  Activity,
  ChevronDown,
  LogOut,
  Shield,
  Moon,
  Sun,
  Globe,
  Zap
} from 'lucide-react';
import SysoraLogo from '../SysoraLogo';

const ProfessionalHeader = ({ 
  user, 
  hotel, 
  onQuickAction, 
  notifications = [], 
  onNotificationClick,
  onUserMenuClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quickStats, setQuickStats] = useState({
    availableRooms: 0,
    todayBookings: 0,
    activeGuests: 0,
    revenue: 0
  });

  // Mock quick stats - replace with real data
  useEffect(() => {
    // Simulate loading quick stats
    setQuickStats({
      availableRooms: 12,
      todayBookings: 8,
      activeGuests: 24,
      revenue: 15420
    });
  }, []);

  // Quick action buttons
  const quickActions = [
    {
      id: 'new-booking',
      label: 'New Booking',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'add-guest',
      label: 'Add Guest',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      shortcut: 'Ctrl+G'
    },
    {
      id: 'add-room',
      label: 'Add Room',
      icon: Bed,
      color: 'bg-purple-500 hover:bg-purple-600',
      shortcut: 'Ctrl+R'
    }
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search
      console.log('Searching for:', searchQuery);
    }
  };

  // Handle quick action
  const handleQuickAction = (actionId) => {
    onQuickAction?.(actionId);
  };

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 items-center h-20">
          
          {/* Left Section - Logo & Hotel Info */}
          <div className="col-span-12 md:col-span-4 flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <SysoraLogo size="sm" iconOnly={true} className="w-10 h-10" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-sysora-midnight">{hotel?.name}</h1>
                <p className="text-xs text-gray-500">{hotel?.subdomain}.sysora.com</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">{quickStats.availableRooms}</span> available
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{quickStats.todayBookings}</span> today
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - Search & Quick Actions */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Global Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guests, rooms, bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint focus:bg-white transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-sysora-mint hover:text-sysora-mint-dark transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Quick Action Buttons */}
              <div className="hidden xl:flex items-center justify-center space-x-2 mt-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 ${action.color}`}
                      title={`${action.label} (${action.shortcut})`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Notifications & User Menu */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-end space-x-3">
            
            {/* System Status */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700 font-medium">Online</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <span className="text-sm text-gray-500">{unreadCount} new</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification, index) => (
                        <div
                          key={index}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => onNotificationClick?.(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${notification.type === 'booking' ? 'bg-blue-100' : 'bg-green-100'}`}>
                              <Calendar className={`w-4 h-4 ${notification.type === 'booking' ? 'text-blue-600' : 'text-green-600'}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-sysora-mint hover:text-sysora-mint-dark font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help Center */}
            <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-xl flex items-center justify-center text-white font-semibold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-xl flex items-center justify-center text-white font-semibold">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.fullName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Preferences</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Security</span>
                    </button>
                    <hr className="my-2" />
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
