import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  Building,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PricingManagementEN from '../../components/admin/en/PricingManagementEN';
import HotelsManagementEN from '../../components/admin/en/HotelsManagementEN';
import UsersManagementEN from '../../components/admin/en/UsersManagementEN';
import AnalyticsManagementEN from '../../components/admin/en/AnalyticsManagementEN';
import SystemSettings from '../../components/admin/SystemSettings';
import LanguageSelector from '../../components/LanguageSelector';

const AdminDashboardEN = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarItems = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: BarChart3,
      description: 'Platform statistics and insights'
    },
    { 
      id: 'hotels', 
      name: 'Hotel Management', 
      icon: Building,
      description: 'View and manage all hotels'
    },
    { 
      id: 'users', 
      name: 'User Management', 
      icon: Users,
      description: 'Manage platform users'
    },
    { 
      id: 'pricing', 
      name: 'Pricing & Plans', 
      icon: DollarSign,
      description: 'Manage subscription plans'
    },
    { 
      id: 'analytics', 
      name: 'Advanced Analytics', 
      icon: BarChart3,
      description: 'Detailed reports and analytics'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      description: 'Notification settings'
    },
    { 
      id: 'reports', 
      name: 'Financial Reports', 
      icon: RefreshCw,
      description: 'Revenue and sales reports'
    },
    { 
      id: 'support', 
      name: 'Technical Support', 
      icon: Shield,
      description: 'Manage support requests'
    },
    { 
      id: 'backup', 
      name: 'Backup Management', 
      icon: CheckCircle,
      description: 'Manage system backups'
    },
    { 
      id: 'logs', 
      name: 'System Logs', 
      icon: Search,
      description: 'View activity logs'
    }
  ];

  // Reset state when component mounts (language change)
  useEffect(() => {
    setActiveTab('overview');
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user from localStorage
        const userData = localStorage.getItem('adminUser');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Fetch dashboard stats
        const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setDashboardStats(stats);
        }

        // Fetch hotels
        const hotelsResponse = await fetch('http://localhost:5000/api/admin/hotels', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (hotelsResponse.ok) {
          const hotelsData = await hotelsResponse.json();
          setHotels(hotelsData);
        }

        // Fetch users
        const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin-login';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sysora-mint mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar-en ${sidebarCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-sysora-midnight to-sysora-midnight/90 shadow-2xl transition-all duration-300 ${
        sidebarOpen ? 'open' : ''
      }`}>
        {/* Header */}
        <div className="sidebar-header flex items-center justify-between h-20 px-4 border-b border-white/10">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sysora-mint rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-sysora-midnight" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Sysora</span>
                <p className="text-xs text-sysora-mint">Admin Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-sysora-mint rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-sysora-midnight" />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Collapse/Expand Button - Desktop Only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={sidebarCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
            
            {/* Close Button - Mobile Only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="sidebar-user-info px-4 py-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-sysora-mint/20 rounded-2xl flex items-center justify-center">
                <span className="text-sysora-mint font-bold text-lg">
                  {user?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user?.fullName}</p>
                <p className="text-sysora-mint text-sm">System Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Avatar */}
        {sidebarCollapsed && (
          <div className="sidebar-user-info px-4 py-4 border-b border-white/10 flex justify-center">
            <div className="w-10 h-10 bg-sysora-mint/20 rounded-2xl flex items-center justify-center">
              <span className="text-sysora-mint font-bold text-sm">
                {user?.fullName?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-navigation space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sysora-mint text-sysora-midnight shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sysora-midnight' : 'text-white/80 group-hover:text-white'} ${sidebarCollapsed ? '' : 'flex-shrink-0'}`} />
                  {!sidebarCollapsed && (
                    <div className="text-left">
                      <div className={`${isActive ? 'text-sysora-midnight' : 'text-white/80 group-hover:text-white'}`}>
                        {item.name}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-sysora-midnight/70' : 'text-white/50'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom p-4 space-y-2">
          {/* Settings Button */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-2xl text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-sysora-mint text-sysora-midnight'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <Settings className="w-5 h-5" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-2xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`admin-main-content-en transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Top header */}
        <header className="admin-header bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-sysora-midnight hover:bg-gray-50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h1 className="text-2xl font-bold text-sysora-midnight">
                  {sidebarItems.find(item => item.id === activeTab)?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {sidebarItems.find(item => item.id === activeTab)?.description || 'Manage Sysora Platform'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector variant="header" />

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search system..."
                  className="admin-search pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-3 text-gray-600 hover:text-sysora-midnight hover:bg-gray-50 rounded-2xl transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sysora-mint/20 rounded-2xl flex items-center justify-center">
                  <span className="text-sysora-midnight font-bold text-sm">
                    {user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="admin-content bg-gray-50/50">
          {activeTab === 'overview' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              {/* Welcome Section */}
              <div className="admin-welcome welcome-section bg-gradient-to-r from-sysora-midnight to-sysora-midnight/90 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                      Welcome, {user?.fullName}! 👋
                    </h2>
                    <p className="text-sysora-mint text-base lg:text-lg">
                      Here's a comprehensive overview of Sysora platform performance
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className={`p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors ${refreshing ? 'animate-spin' : ''}`}
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="admin-cards-grid">
                {/* Total Hotels */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">+12%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Hotels</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardStats?.totalHotels || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Registered hotels on platform</p>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">+8%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardStats?.totalUsers || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active platform users</p>
                  </div>
                </div>

                {/* Active Hotels */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">+5%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Hotels</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardStats?.activeHotels || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Currently active hotels</p>
                  </div>
                </div>

                {/* Trial Hotels */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ArrowDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-500 font-medium">-3%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trial Period</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {dashboardStats?.trialHotels || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hotels in trial period</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="admin-activity bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New hotel registered</p>
                      <p className="text-xs text-gray-500">Grand Hotel Plaza - 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New user signup</p>
                      <p className="text-xs text-gray-500">john.doe@example.com - 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-xs text-gray-500">Premium plan subscription - 10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <PricingManagementEN />
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <HotelsManagementEN hotels={hotels} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <UsersManagementEN users={users} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <AnalyticsManagementEN />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <SystemSettings />
            </div>
          )}

          {/* Placeholder sections for new menu items */}
          {(activeTab === 'notifications' || activeTab === 'reports' || activeTab === 'support' || activeTab === 'backup' || activeTab === 'logs') && (
            <div className="admin-section space-y-4 lg:space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-sysora-mint/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'notifications' && <Bell className="w-8 h-8 text-sysora-mint" />}
                  {activeTab === 'reports' && <RefreshCw className="w-8 h-8 text-sysora-mint" />}
                  {activeTab === 'support' && <Shield className="w-8 h-8 text-sysora-mint" />}
                  {activeTab === 'backup' && <CheckCircle className="w-8 h-8 text-sysora-mint" />}
                  {activeTab === 'logs' && <Search className="w-8 h-8 text-sysora-mint" />}
                </div>
                <h2 className="text-2xl font-bold text-sysora-midnight mb-2">
                  {sidebarItems.find(item => item.id === activeTab)?.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {sidebarItems.find(item => item.id === activeTab)?.description}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-800 text-sm">
                    🚧 This section is under development and will be added soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardEN;
