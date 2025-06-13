import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  Home,
  Wrench,
  Shirt,
  Coffee,
  Car,
  Star,
  BarChart3,
  Users,
  Calendar,
  Bell,
  TrendingUp
} from 'lucide-react';
import ServiceManagement from './ServiceManagement';
import ServiceRequestManagement from './ServiceRequestManagement';
import HousekeepingServices from './HousekeepingServices';
import MaintenanceServices from './MaintenanceServices';
import LaundryServices from './LaundryServices';
import ServicesWidget from '../ServicesWidget';

const Services = ({ reservations = [], rooms = [], customers = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      description: 'Service overview and statistics'
    },
    {
      id: 'management',
      name: 'Service Management',
      icon: Settings,
      description: 'Manage all hotel services'
    },
    {
      id: 'requests',
      name: 'Service Requests',
      icon: MessageSquare,
      description: 'Track and manage service requests'
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      icon: Home,
      description: 'Cleaning and maintenance tasks'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: Wrench,
      description: 'Facility maintenance and repairs'
    },
    {
      id: 'laundry',
      name: 'Laundry Services',
      icon: Shirt,
      description: 'Laundry and dry cleaning'
    },
    {
      id: 'room_service',
      name: 'Room Service',
      icon: Coffee,
      description: 'Food and beverage delivery',
      comingSoon: true
    },
    {
      id: 'concierge',
      name: 'Concierge',
      icon: Bell,
      description: 'Guest assistance and recommendations',
      comingSoon: true
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Service Overview Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Services Overview</h2>
                  <p className="text-blue-100">Comprehensive view of all hotel services and operations</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-xs text-green-600">+2 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                    <p className="text-xs text-yellow-600">Needs attention</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Housekeeping Tasks</p>
                    <p className="text-2xl font-bold text-green-600">15</p>
                    <p className="text-xs text-green-600">5 completed today</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Service Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">45,200 DZD</p>
                    <p className="text-xs text-green-600">+12% this week</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Room Service', icon: Coffee, count: 45, color: 'bg-orange-500' },
                  { name: 'Housekeeping', icon: Home, count: 32, color: 'bg-blue-500' },
                  { name: 'Maintenance', icon: Wrench, count: 18, color: 'bg-red-500' },
                  { name: 'Laundry', icon: Shirt, count: 28, color: 'bg-purple-500' },
                  { name: 'Transportation', icon: Car, count: 12, color: 'bg-green-500' },
                  { name: 'Spa & Wellness', icon: Star, count: 8, color: 'bg-pink-500' },
                  { name: 'Concierge', icon: Bell, count: 22, color: 'bg-indigo-500' },
                  { name: 'Other Services', icon: Settings, count: 15, color: 'bg-gray-500' }
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${category.color} rounded-2xl flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.count} requests</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Services Widget */}
            <ServicesWidget />
          </div>
        );

      case 'management':
        return <ServiceManagement />;

      case 'requests':
        return <ServiceRequestManagement />;

      case 'housekeeping':
        return <HousekeepingServices />;

      case 'maintenance':
        return <MaintenanceServices />;

      case 'laundry':
        return <LaundryServices />;

      default:
        return (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 mb-6">This service module is under development and will be available soon.</p>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Services Management</h1>
            <p className="text-purple-100">Comprehensive hotel service management system</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.comingSoon) {
                      window.showToast && window.showToast(`${tab.name} feature coming soon`, 'info');
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : tab.comingSoon
                      ? 'border-transparent text-gray-400 hover:text-gray-500 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={tab.comingSoon}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.comingSoon && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Services;
