import React, { useState } from 'react';
import {
  Home,
  Bed,
  Calendar,
  Users,
  Coffee,
  FileText,
  CreditCard,
  BarChart3,
  Brain,
  Shield,
  UserCog,
  Settings,
  ChevronDown,
  ChevronUp,
  Crown,
  TrendingUp
} from 'lucide-react';

const ManagerNavigation = ({ activeTab, onTabChange }) => {
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);

  // Core operational tabs
  const coreTabs = [
    {
      id: 'overview',
      name: 'Dashboard',
      icon: Home,
      description: 'Comprehensive overview and analytics',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'rooms',
      name: 'Room Management',
      icon: Bed,
      description: 'Advanced room control and status',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'checkin-checkout',
      name: 'Check-In/Out',
      icon: Calendar,
      description: 'Guest arrival and departure processing',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'guests',
      name: 'Guest Management',
      icon: Users,
      description: 'Complete guest profiles and history',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      icon: Coffee,
      description: 'Task management and scheduling',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'reservations',
      name: 'Reservations',
      icon: Calendar,
      description: 'Booking management and control',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'shift-report',
      name: 'Reports',
      icon: FileText,
      description: 'Operational reports and insights',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // Advanced management tabs
  const advancedTabs = [
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      description: 'Financial transactions and billing',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Business intelligence and metrics',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      icon: Brain,
      description: 'Smart recommendations and forecasting',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Access control and monitoring',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'users',
      name: 'Staff Management',
      icon: UserCog,
      description: 'User roles and permissions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'settings',
      name: 'Hotel Settings',
      icon: Settings,
      description: 'Configuration and preferences',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // Get current tabs to display
  const currentTabs = [...coreTabs, ...advancedTabs];

  // Handle tab change
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setShowAdvancedMenu(false);
  };

  // Get tab info
  const getTabInfo = (tabId) => {
    return currentTabs.find(tab => tab.id === tabId);
  };

  const activeTabInfo = getTabInfo(activeTab);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Manager Dashboard</span>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <span className="text-xs font-medium text-yellow-800">Full Access</span>
            </div>
          </div>

          {/* Active Tab Info */}
          {activeTabInfo && (
            <div className="hidden md:flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${activeTabInfo.bgColor}`}>
                <activeTabInfo.icon className={`w-4 h-4 ${activeTabInfo.color}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{activeTabInfo.name}</div>
                <div className="text-xs text-gray-500">{activeTabInfo.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide py-4">
            {coreTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span>{tab.name}</span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}

            {/* Advanced Menu Toggle */}
            <button
              onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
              className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                advancedTabs.some(tab => tab.id === activeTab)
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className={`w-5 h-5 transition-all duration-300 ${
                advancedTabs.some(tab => tab.id === activeTab) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
              }`} />
              <span>Advanced</span>
              {showAdvancedMenu ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              {currentTabs.length} Features Available
            </div>
          </div>
        </div>

        {/* Advanced Menu Dropdown */}
        {showAdvancedMenu && (
          <div className="pb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {advancedTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-white shadow-md border-2 border-blue-200'
                          : 'hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${tab.bgColor}`}>
                        <Icon className={`w-5 h-5 ${tab.color}`} />
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                          {tab.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerNavigation;
