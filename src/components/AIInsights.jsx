import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Zap,
  BarChart3,
  Target,
  Lightbulb,
  Settings,
  RefreshCw,
  Activity
} from 'lucide-react';
import SmartRecommendations from './ai/SmartRecommendations';
import DemandForecast from './ai/DemandForecast';
import AutomationHub from './ai/AutomationHub';
import AIControlCenter from './ai/AIControlCenter';
import AdvancedAnalytics from './ai/AdvancedAnalytics';
import RealTimeMonitor from './ai/RealTimeMonitor';
import ModelManager from './ai/ModelManager';
import { aiDataManager } from '../utils/aiDataManager';

const AIInsights = () => {
  console.log('🤖 AIInsights component loaded');
  
  const [activeTab, setActiveTab] = useState('control-center');
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Use AI Data Manager for advanced data fetching and caching
      const reservationsData = await aiDataManager.fetchWithCache(
        'reservations',
        async () => {
          const token = localStorage.getItem('sysora_token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return data.data?.reservations || [];
          }
          throw new Error('API failed');
        }
      );

      const roomsData = await aiDataManager.fetchWithCache(
        'rooms',
        async () => {
          const token = localStorage.getItem('sysora_token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return data.data?.rooms || [];
          }
          throw new Error('API failed');
        }
      );

      // Set data or fallback to mock data
      setReservations(reservationsData || generateMockReservations());
      setRooms(roomsData || generateMockRooms());

    } catch (error) {
      console.error('Error fetching data:', error);
      setReservations(generateMockReservations());
      setRooms(generateMockRooms());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReservations = () => {
    const mockReservations = [];
    const statuses = ['confirmed', 'checked_in', 'checked_out', 'cancelled'];
    
    for (let i = 0; i < 50; i++) {
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 60) - 30);
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
      
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const basePrice = 5000 + Math.floor(Math.random() * 10000);
      const totalAmount = nights * basePrice * (1 + Math.random() * 0.5);
      
      mockReservations.push({
        _id: `res_${i}`,
        reservationNumber: `RES${String(i).padStart(4, '0')}`,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        nights,
        totalAmount,
        paidAmount: Math.random() > 0.3 ? totalAmount : totalAmount * Math.random(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        adults: Math.floor(Math.random() * 4) + 1,
        children: Math.floor(Math.random() * 3),
        roomId: `room_${Math.floor(Math.random() * 10) + 1}`,
        guestId: {
          firstName: `Guest${i}`,
          lastName: `LastName${i}`,
          email: `guest${i}@example.com`
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return mockReservations;
  };

  const generateMockRooms = () => {
    const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential'];
    const mockRooms = [];
    
    for (let i = 1; i <= 30; i++) {
      mockRooms.push({
        _id: `room_${i}`,
        number: String(100 + i),
        type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
        basePrice: 5000 + Math.floor(Math.random() * 10000),
        capacity: Math.floor(Math.random() * 4) + 2,
        amenities: ['WiFi', 'TV', 'AC'],
        status: Math.random() > 0.2 ? 'available' : 'occupied'
      });
    }
    
    return mockRooms;
  };

  const tabs = [
    {
      id: 'control-center',
      name: 'Control Center',
      icon: Brain,
      description: 'AI system monitoring and control dashboard'
    },
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      icon: Lightbulb,
      description: 'AI-powered insights to optimize operations'
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: BarChart3,
      description: 'Deep insights and performance analysis'
    },
    {
      id: 'forecast',
      name: 'Demand Forecast',
      icon: TrendingUp,
      description: 'Predictive analytics for demand planning'
    },
    {
      id: 'automation',
      name: 'Automation Hub',
      icon: Zap,
      description: 'Intelligent workflows and automations'
    },
    {
      id: 'monitor',
      name: 'Real-Time Monitor',
      icon: Activity,
      description: 'Live system and business metrics'
    },
    {
      id: 'models',
      name: 'Model Manager',
      icon: Settings,
      description: 'Manage and monitor AI models'
    }
  ];

  const aiStats = {
    totalInsights: 12,
    activeAutomations: 5,
    forecastAccuracy: 94.2,
    timeSaved: 15.5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Insights & Automation</h2>
              <p className="text-purple-100">Intelligent analytics and automated workflows for your hotel</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
              <Settings className="w-4 h-4" />
              <span>AI Settings</span>
            </button>
          </div>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Insights</p>
                <p className="text-2xl font-bold">{aiStats.totalInsights}</p>
              </div>
              <Lightbulb className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Automations</p>
                <p className="text-2xl font-bold">{aiStats.activeAutomations}</p>
              </div>
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Forecast Accuracy</p>
                <p className="text-2xl font-bold">{aiStats.forecastAccuracy}%</p>
              </div>
              <Target className="w-6 h-6 text-green-300" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Hours Saved/Week</p>
                <p className="text-2xl font-bold">{aiStats.timeSaved}h</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading AI insights...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing your hotel data</p>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'control-center' && (
          <AIControlCenter reservations={reservations} rooms={rooms} />
        )}

        {!loading && activeTab === 'recommendations' && (
          <SmartRecommendations reservations={reservations} rooms={rooms} />
        )}

        {!loading && activeTab === 'analytics' && (
          <AdvancedAnalytics reservations={reservations} rooms={rooms} />
        )}

        {!loading && activeTab === 'forecast' && (
          <DemandForecast reservations={reservations} />
        )}

        {!loading && activeTab === 'automation' && (
          <AutomationHub />
        )}

        {!loading && activeTab === 'monitor' && (
          <RealTimeMonitor reservations={reservations} rooms={rooms} />
        )}

        {!loading && activeTab === 'models' && (
          <ModelManager reservations={reservations} rooms={rooms} />
        )}
      </div>

      {/* AI Assistant Prompt */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-gray-600">
              Need help interpreting these insights or want to create custom automations? 
              Our AI assistant can help you optimize your hotel operations.
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Ask AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
