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

  // Basic tabs for beginners
  const basicTabs = [
    { 
      id: 'overview', 
      name: 'Dashboard', 
      icon: Home, 
      description: 'Main overview and quick stats',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'rooms', 
      name: 'Rooms', 
      icon: Bed, 
      description: 'Manage hotel rooms and status',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'reservations', 
      name: 'Bookings', 
      icon: Calendar, 
      description: 'Handle reservations and check-ins',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: 'guests', 
      name: 'Guests', 
      icon: Users, 
      description: 'Manage guest profiles and history',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'payments', 
      name: 'Finance', 
      icon: CreditCard, 
      description: 'Payments, invoices and reports',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  // Advanced tabs for professionals
  const advancedTabs = [
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Advanced reports and insights',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      id: 'ai-insights', 
      name: 'AI Tools', 
      icon: Brain, 
      description: 'Smart pricing and predictions',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      id: 'services', 
      name: 'Services', 
      icon: Coffee, 
      description: 'Housekeeping and maintenance',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      description: 'System configuration',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  // Get current tabs based on mode
  const currentTabs = isAdvancedMode ? [...basicTabs, ...advancedTabs] : basicTabs;

  // Handle tab change
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setShowAdvancedMenu(false);
  };

  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
    setShowAdvancedMenu(false);
  };

  // Get tab info
  const getTabInfo = (tabId) => {
    return [...basicTabs, ...advancedTabs].find(tab => tab.id === tabId);
  };

  const activeTabInfo = getTabInfo(activeTab);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sysora-mint" />
              <span className="text-sm font-medium text-gray-700">Interface Mode:</span>
            </div>
            <button
              onClick={toggleAdvancedMode}
              className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-2">
                {isAdvancedMode ? (
                  <ToggleRight className="w-5 h-5 text-sysora-mint" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
                <span className={`text-sm font-medium ${isAdvancedMode ? 'text-sysora-mint' : 'text-gray-600'}`}>
                  {isAdvancedMode ? 'Professional' : 'Simplified'}
                </span>
              </div>
              <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                {isAdvancedMode ? 'All features' : 'Essential features'}
              </div>
            </button>
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
              const isAdvanced = advancedTabs.some(advTab => advTab.id === tab.id);
              
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
                  
                  {/* Advanced Badge */}
                  {isAdvanced && !isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-sysora-mint rounded-full opacity-60"></div>
                  )}
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sysora-midnight rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <button className="btn-icon-secondary">
              <TrendingUp className="w-4 h-4" />
            </button>
            <button className="btn-icon-primary">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Mode Indicator */}
        {isAdvancedMode && (
          <div className="py-2">
            <div className="flex items-center space-x-2 text-xs text-sysora-mint">
              <Brain className="w-3 h-3" />
              <span>Professional mode active - All features unlocked</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartNavigation;
