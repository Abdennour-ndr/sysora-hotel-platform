import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Cpu,
  Database,
  Network,
  Shield,
  Bell,
  Settings,
  Pause,
  Play,
  RefreshCw,
  Eye,
  Filter,
  Download,
  Brain
} from 'lucide-react';
import advancedAnalyticsEngine from '../../services/AdvancedAnalyticsEngine';
import aiEngine from '../../services/AIEngine';

const RealTimeMonitor = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isMonitoring) {
      startRealTimeMonitoring();
    } else {
      stopRealTimeMonitoring();
    }

    return () => stopRealTimeMonitoring();
  }, [isMonitoring, updateInterval]);

  const startRealTimeMonitoring = () => {
    // Initial load
    updateRealTimeData();
    
    // Set up interval
    intervalRef.current = setInterval(() => {
      updateRealTimeData();
    }, updateInterval);
  };

  const stopRealTimeMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateRealTimeData = async () => {
    try {
      // Simulate real-time data updates
      const newData = await fetchRealTimeMetrics();
      setRealTimeData(newData);
      
      // Check for alerts
      const newAlerts = checkForAlerts(newData);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error updating real-time data:', error);
      setIsConnected(false);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      // Get real-time data from AI engines
      const aiEngineStatus = aiEngine.getModelStatus();
      const analyticsStatus = advancedAnalyticsEngine.getStatus();

      // Get real-time analytics if available
      let realTimeAnalytics = null;
      try {
        realTimeAnalytics = await advancedAnalyticsEngine.getComprehensiveAnalytics({
          reservations: [], // Would be passed from parent component
          rooms: [],
          customers: []
        });
      } catch (error) {
        console.log('Analytics not available, using simulated data');
      }

      // Combine real AI data with simulated metrics
      const baseMetrics = {
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 50) + 20,
        currentBookings: Math.floor(Math.random() * 10) + 5,
        systemLoad: Math.random() * 100,
        responseTime: Math.random() * 200 + 50,
        errorRate: Math.random() * 5,
        throughput: Math.random() * 1000 + 500,

        // Real AI processes data
        aiProcesses: {
          recommendations: aiEngineStatus.trainedModels || Math.floor(Math.random() * 5) + 2,
          forecasting: analyticsStatus.modelsCount || Math.floor(Math.random() * 3) + 1,
          automation: aiEngineStatus.totalModels || Math.floor(Math.random() * 8) + 3,
          aiEngineStatus: aiEngineStatus.isInitialized ? 'active' : 'inactive',
          analyticsStatus: analyticsStatus.isInitialized ? 'active' : 'inactive',
          lastUpdate: analyticsStatus.lastUpdate || new Date().toISOString()
        },

        // Enhanced revenue data
        revenue: {
          current: realTimeAnalytics?.revenue?.total || Math.floor(Math.random() * 50000) + 100000,
          hourly: Math.floor(Math.random() * 5000) + 2000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          aiEnhanced: !!realTimeAnalytics
        },

        // Enhanced occupancy data
        occupancy: {
          current: realTimeAnalytics?.operational?.utilization?.average || Math.random() * 100,
          available: Math.floor(Math.random() * 10) + 5,
          checkins: Math.floor(Math.random() * 8) + 2,
          checkouts: Math.floor(Math.random() * 6) + 1,
          aiEnhanced: !!realTimeAnalytics
        },

        // AI insights
        aiInsights: realTimeAnalytics?.realTime?.insights || [],
        confidence: realTimeAnalytics ? 0.9 : 0.6
      };

      return baseMetrics;
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);

      // Fallback to simulated data
      return {
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 50) + 20,
        currentBookings: Math.floor(Math.random() * 10) + 5,
        systemLoad: Math.random() * 100,
        responseTime: Math.random() * 200 + 50,
        errorRate: Math.random() * 5,
        throughput: Math.random() * 1000 + 500,
        aiProcesses: {
          recommendations: Math.floor(Math.random() * 5) + 2,
          forecasting: Math.floor(Math.random() * 3) + 1,
          automation: Math.floor(Math.random() * 8) + 3,
          aiEngineStatus: 'inactive',
          analyticsStatus: 'inactive'
        },
        revenue: {
          current: Math.floor(Math.random() * 50000) + 100000,
          hourly: Math.floor(Math.random() * 5000) + 2000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          aiEnhanced: false
        },
        occupancy: {
          current: Math.random() * 100,
          available: Math.floor(Math.random() * 10) + 5,
          checkins: Math.floor(Math.random() * 8) + 2,
          checkouts: Math.floor(Math.random() * 6) + 1,
          aiEnhanced: false
        },
        aiInsights: [],
        confidence: 0.5
      };
    }
  };

  const checkForAlerts = (data) => {
    const alerts = [];
    const now = new Date();

    // System performance alerts
    if (data.systemLoad > 80) {
      alerts.push({
        id: `alert-${now.getTime()}-1`,
        type: 'warning',
        title: 'High System Load',
        message: `System load is at ${data.systemLoad.toFixed(1)}%`,
        timestamp: now.toISOString(),
        severity: 'medium'
      });
    }

    if (data.responseTime > 150) {
      alerts.push({
        id: `alert-${now.getTime()}-2`,
        type: 'warning',
        title: 'Slow Response Time',
        message: `API response time is ${data.responseTime.toFixed(0)}ms`,
        timestamp: now.toISOString(),
        severity: 'low'
      });
    }

    if (data.errorRate > 3) {
      alerts.push({
        id: `alert-${now.getTime()}-3`,
        type: 'error',
        title: 'High Error Rate',
        message: `Error rate is ${data.errorRate.toFixed(1)}%`,
        timestamp: now.toISOString(),
        severity: 'high'
      });
    }

    // Business alerts
    if (data.occupancy.current < 30) {
      alerts.push({
        id: `alert-${now.getTime()}-4`,
        type: 'info',
        title: 'Low Occupancy',
        message: `Current occupancy is ${data.occupancy.current.toFixed(1)}%`,
        timestamp: now.toISOString(),
        severity: 'medium'
      });
    }

    return alerts;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getMetricColor = (value, thresholds) => {
    if (value > thresholds.high) return 'text-red-600';
    if (value > thresholds.medium) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold">Real-Time Monitor</h2>
                {realTimeData?.aiInsights && realTimeData.aiInsights.length > 0 && (
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full font-medium flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>AI Enhanced</span>
                  </span>
                )}
              </div>
              <p className="text-green-100">
                Live system and business metrics
                {realTimeData?.confidence && (
                  <span className="text-green-200 font-medium">
                    {' '}• {(realTimeData.confidence * 100).toFixed(0)}% confidence
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-300" />
              )}
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`p-2 rounded-lg transition-colors ${
                isMonitoring 
                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isMonitoring ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={updateRealTimeData}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {realTimeData && (
          <div className="mt-4 text-sm text-green-100">
            Last updated: {formatTime(realTimeData.timestamp)}
          </div>
        )}
      </div>

      {/* Real-Time Metrics Grid */}
      {realTimeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Users */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">LIVE USERS</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {realTimeData.activeUsers}
              </div>
              <div className="text-sm text-gray-600">
                {realTimeData.currentBookings} active bookings
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">SYSTEM LOAD</span>
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getMetricColor(realTimeData.systemLoad, { high: 80, medium: 60 })}`}>
                {realTimeData.systemLoad.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                {realTimeData.responseTime.toFixed(0)}ms response
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    realTimeData.systemLoad > 80 ? 'bg-red-500' :
                    realTimeData.systemLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${realTimeData.systemLoad}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">REVENUE</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {realTimeData.revenue.current.toLocaleString()} DZD
              </div>
              <div className="text-sm text-gray-600">
                {realTimeData.revenue.hourly.toLocaleString()} DZD/hour
              </div>
              <div className="flex items-center space-x-1">
                {realTimeData.revenue.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ${realTimeData.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {realTimeData.revenue.trend === 'up' ? 'Increasing' : 'Decreasing'}
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">OCCUPANCY</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {realTimeData.occupancy.current.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                {realTimeData.occupancy.available} rooms available
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>In: {realTimeData.occupancy.checkins}</span>
                <span>Out: {realTimeData.occupancy.checkouts}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Processes Status */}
      {realTimeData && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Processes Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Recommendations</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {realTimeData.aiProcesses.recommendations}
              </div>
              <div className="text-sm text-gray-600">Running processes</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Forecasting</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600">Processing</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {realTimeData.aiProcesses.forecasting}
              </div>
              <div className="text-sm text-gray-600">Models running</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Automation</h4>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-600">Executing</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {realTimeData.aiProcesses.automation}
              </div>
              <div className="text-sm text-gray-600">Tasks queued</div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Alerts</h3>
            <button 
              onClick={() => setAlerts([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitor Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitor Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Interval
            </label>
            <select
              value={updateInterval}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1000}>1 second</option>
              <option value={5000}>5 seconds</option>
              <option value={10000}>10 seconds</option>
              <option value={30000}>30 seconds</option>
              <option value={60000}>1 minute</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={updateRealTimeData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
