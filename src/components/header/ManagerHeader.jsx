import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Settings,
  Shield,
  LogOut,
  Plus,
  Calendar,
  Users,
  Bed,
  BarChart3,
  Crown,
  ChevronDown,
} from 'lucide-react';
import SysoraLogo from '../SysoraLogo';

const ManagerHeader = ({ 
  user, 
  hotel, 
  notifications = [], 
  onQuickAction,
  onAccountAction 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    todayCheckIns: 0,
    todayRevenue: 0
  });

  // Load quick stats
  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/dashboard/quick-stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuickStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading quick stats:', error);
      // Set fallback stats
      setQuickStats({
        totalRooms: 50,
        occupiedRooms: 32,
        todayCheckIns: 8,
        todayRevenue: 15420
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const quickActions = [
    {
      id: 'new-booking',
      name: 'New Booking',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'add-guest',
      name: 'Add Guest',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'add-room',
      name: 'Add Room',
      icon: Bed,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'view-analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const accountMenuItems = [
    {
      id: 'notifications',
      name: 'View All Notifications',
      icon: Bell,
      description: 'Manage all notifications'
    },
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: User,
      description: 'Update personal information'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: Settings,
      description: 'Dashboard and system preferences'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password and security settings'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 items-center h-20">
          
          {/* Left Section - Logo & Hotel Info */}
          <div className="col-span-12 md:col-span-3 flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <SysoraLogo size="sm" iconOnly={true} className="w-10 h-10" />
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-gray-900">{hotel?.name}</h1>
                  <Crown className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500">{hotel?.subdomain}.sysora.com</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search & Quick Stats */}
          <div className="col-span-12 md:col-span-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guests, rooms, reservations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{quickStats.occupiedRooms}/{quickStats.totalRooms}</div>
                <div className="text-xs text-gray-500">Occupancy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{quickStats.todayCheckIns}</div>
                <div className="text-xs text-gray-500">Check-ins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">${quickStats.todayRevenue}</div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{Math.round((quickStats.occupiedRooms / quickStats.totalRooms) * 100)}%</div>
                <div className="text-xs text-gray-500">Rate</div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions & User Menu */}
          <div className="col-span-12 md:col-span-3 flex items-center justify-end space-x-3">
            
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onQuickAction(action.id)}
                  className={`p-2 rounded-lg text-white transition-colors ${action.color}`}
                  title={action.name}
                >
                  <action.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => onAccountAction('notifications')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'M'}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                        {user?.fullName?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.fullName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-gray-400 flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Manager</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {accountMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onAccountAction(item.id);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={() => {
                        onAccountAction('logout');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-sm text-red-500">End your session</div>
                      </div>
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

export default ManagerHeader;
