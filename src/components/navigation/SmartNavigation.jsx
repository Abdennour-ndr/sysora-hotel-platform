import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bed, 
  Calendar, 
  Users, 
  CreditCard,
  BarChart3,
  Brain,
  Settings,
  Coffee,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const SmartNavigation = ({ activeTab, onTabChange, userLevel = 'beginner' }) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(userLevel === 'professional');
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);

  // Essential tabs for frontline staff (≤7 features)
  const essentialTabs = [
    {
      id: 'overview',
      name: 'Dashboard',
      icon: Home,
      description: 'Daily overview and shift summary',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'rooms',
      name: 'Room Status',
      icon: Bed,
      description: 'View and update room availability',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'checkin-checkout',
      name: 'Check-In/Out',
      icon: Calendar,
      description: 'Process guest arrivals and departures',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'guests',
      name: 'Guest Lookup',
      icon: Users,
      description: 'Search guests and create profiles',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      icon: Coffee,
      description: 'Daily cleaning tasks and assignments',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'reservations',
      name: 'Reservations',
      icon: Calendar,
      description: 'Lookup and manage bookings',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'shift-report',
      name: 'Shift Report',
      icon: BarChart3,
      description: 'Daily summary and handover',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // Removed non-essential features for frontline staff:
  // - Advanced Analytics & Revenue Reports (defer: management-level)
  // - AI Insights & Predictive Analytics (defer: not used daily)
  // - Payment Processing & Billing (defer: separate POS systems)
  // - Marketing Tools & Communications (defer: management function)
  // - User Management & Permissions (defer: administrative)
  // - Hotel Settings & Configuration (defer: management approval)
  // - Integration Management (defer: IT responsibility)
  // - Advanced Guest Loyalty Programs (defer: adds complexity)
  // - Detailed Maintenance Tracking (defer: maintenance dept)
  // - Multi-language Support (defer: interface complexity)

  // Use only essential tabs for frontline staff
  const currentTabs = essentialTabs;

  // Handle tab change
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  // Get tab info
  const getTabInfo = (tabId) => {
    return essentialTabs.find(tab => tab.id === tabId);
  };

  const activeTabInfo = getTabInfo(activeTab);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sysora-mint" />
              <span className="text-sm font-medium text-gray-700">Frontline Staff Dashboard</span>
            </div>
            <div className="px-3 py-1 bg-sysora-mint bg-opacity-10 rounded-full">
              <span className="text-xs font-medium text-sysora-mint">Essential Features Only</span>
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
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`group relative flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-sysora-mint text-sysora-midnight shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'text-sysora-midnight' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span>{tab.name}</span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sysora-midnight rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Essential Actions Only */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              7 Essential Features
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartNavigation;
