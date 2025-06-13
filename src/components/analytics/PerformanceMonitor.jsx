import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Bed,
  Star,
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
  BarChart3,
  PieChart,
  LineChart,
  Monitor,
  Smartphone,
  Tablet,
  Globe
} from 'lucide-react';

const PerformanceMonitor = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000);
  const [selectedView, setSelectedView] = useState('overview');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isMonitoring) {
      startPerformanceMonitoring();
    } else {
      stopPerformanceMonitoring();
    }

    return () => stopPerformanceMonitoring();
  }, [isMonitoring, updateInterval]);

  const startPerformanceMonitoring = () => {
    updatePerformanceData();
    intervalRef.current = setInterval(() => {
      updatePerformanceData();
    }, updateInterval);
  };

  const stopPerformanceMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updatePerformanceData = async () => {
    try {
      const newData = await fetchPerformanceMetrics();
      setPerformanceData(newData);

      const newKpis = await fetchKPIs();
      setKpis(newKpis);

      const newAlerts = checkPerformanceAlerts(newData, newKpis);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
      }

      setIsConnected(true);
    } catch (error) {
      console.error('Error updating performance data:', error);
      setIsConnected(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    const baseTime = new Date();
    return {
      timestamp: baseTime.toISOString(),
      revenue: {
        current: Math.floor(Math.random() * 50000) + 150000,
        hourly: Math.floor(Math.random() * 5000) + 8000,
        daily: Math.floor(Math.random() * 100000) + 180000,
        target: 200000,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        growth: (Math.random() - 0.5) * 20
      },
      occupancy: {
        current: Math.floor(Math.random() * 20) + 75,
        available: Math.floor(Math.random() * 15) + 8,
        checkedIn: Math.floor(Math.random() * 80) + 120,
        checkedOut: Math.floor(Math.random() * 30) + 15,
        target: 85,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      bookings: {
        current: Math.floor(Math.random() * 20) + 45,
        pending: Math.floor(Math.random() * 10) + 5,
        confirmed: Math.floor(Math.random() * 15) + 35,
        cancelled: Math.floor(Math.random() * 5) + 2,
        target: 50,
        conversionRate: Math.floor(Math.random() * 10) + 85
      },
      guests: {
        active: Math.floor(Math.random() * 50) + 200,
        newToday: Math.floor(Math.random() * 20) + 15,
        returning: Math.floor(Math.random() * 30) + 25,
        satisfaction: (Math.random() * 1) + 4.2,
        complaints: Math.floor(Math.random() * 3) + 1
      },
      operations: {
        staffOnDuty: Math.floor(Math.random() * 10) + 25,
        tasksCompleted: Math.floor(Math.random() * 20) + 80,
        tasksPending: Math.floor(Math.random() * 10) + 5,
        maintenanceIssues: Math.floor(Math.random() * 3) + 1,
        responseTime: Math.floor(Math.random() * 10) + 8
      },
      technology: {
        systemLoad: Math.floor(Math.random() * 30) + 45,
        apiLatency: Math.floor(Math.random() * 50) + 80,
        errorRate: Math.random() * 2,
        uptime: 99.8 + (Math.random() * 0.2),
        activeConnections: Math.floor(Math.random() * 100) + 150
      }
    };
  };

  const fetchKPIs = async () => {
    return {
      financial: {
        revenuePerRoom: Math.floor(Math.random() * 5000) + 15000,
        profitMargin: Math.floor(Math.random() * 10) + 25,
        costPerGuest: Math.floor(Math.random() * 2000) + 3000,
        revenueGrowth: (Math.random() - 0.5) * 20
      },
      operational: {
        averageStayDuration: (Math.random() * 2) + 2.5,
        checkInTime: Math.floor(Math.random() * 30) + 15,
        checkOutTime: Math.floor(Math.random() * 20) + 10,
        roomTurnoverTime: Math.floor(Math.random() * 20) + 35
      },
      customer: {
        nps: Math.floor(Math.random() * 20) + 70,
        repeatCustomerRate: Math.floor(Math.random() * 15) + 30,
        averageRating: (Math.random() * 1) + 4.3,
        responseTime: Math.floor(Math.random() * 10) + 5
      },
      marketing: {
        conversionRate: Math.floor(Math.random() * 5) + 12,
        costPerAcquisition: Math.floor(Math.random() * 1000) + 2000,
        marketingROI: Math.floor(Math.random() * 100) + 250,
        websiteTraffic: Math.floor(Math.random() * 500) + 1200
      }
    };
  };

  const checkPerformanceAlerts = (data, kpis) => {
    const alerts = [];
    const now = new Date();

    // Revenue alerts
    if (data.revenue.current < data.revenue.target * 0.8) {
      alerts.push({
        id: `alert-${now.getTime()}-1`,
        type: 'warning',
        category: 'revenue',
        title: 'Revenue Below Target',
        message: `Current revenue is ${((data.revenue.current / data.revenue.target) * 100).toFixed(1)}% of target`,
        timestamp: now.toISOString(),
        severity: 'medium'
      });
    }

    // Occupancy alerts
    if (data.occupancy.current < data.occupancy.target * 0.9) {
      alerts.push({
        id: `alert-${now.getTime()}-2`,
        type: 'info',
        category: 'occupancy',
        title: 'Low Occupancy Rate',
        message: `Occupancy at ${data.occupancy.current}%, below target of ${data.occupancy.target}%`,
        timestamp: now.toISOString(),
        severity: 'low'
      });
    }

    // Technology alerts
    if (data.technology.systemLoad > 80) {
      alerts.push({
        id: `alert-${now.getTime()}-3`,
        type: 'error',
        category: 'technology',
        title: 'High System Load',
        message: `System load at ${data.technology.systemLoad}%`,
        timestamp: now.toISOString(),
        severity: 'high'
      });
    }

    // Guest satisfaction alerts
    if (data.guests.satisfaction < 4.0) {
      alerts.push({
        id: `alert-${now.getTime()}-4`,
        type: 'warning',
        category: 'customer',
        title: 'Low Guest Satisfaction',
        message: `Average satisfaction score: ${data.guests.satisfaction.toFixed(1)}/5.0`,
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const views = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'operational', name: 'Operations', icon: Settings },
    { id: 'customer', name: 'Customer', icon: Users },
    { id: 'technology', name: 'Technology', icon: Monitor }
  ];

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
              <h2 className="text-2xl font-bold">Performance Monitor</h2>
              <p className="text-green-100">Real-time business performance tracking</p>
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
              onClick={updatePerformanceData}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {performanceData && (
          <div className="mt-4 text-sm text-green-100">
            Last updated: {formatTime(performanceData.timestamp)}
          </div>
        )}
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                  selectedView === view.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <view.icon className="w-5 h-5" />
                <span>{view.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Performance Content */}
        <div className="p-6">
          {selectedView === 'overview' && performanceData && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">REVENUE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(performanceData.revenue.current)}
                    </div>
                    <div className="text-sm text-green-700">
                      Target: {formatCurrency(performanceData.revenue.target)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${performanceData.revenue.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-xs text-green-600">
                        {performanceData.revenue.growth > 0 ? '+' : ''}{performanceData.revenue.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">OCCUPANCY</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-900">
                      {performanceData.occupancy.current}%
                    </div>
                    <div className="text-sm text-blue-700">
                      {performanceData.occupancy.available} rooms available
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${performanceData.occupancy.current}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">BOOKINGS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-900">
                      {performanceData.bookings.current}
                    </div>
                    <div className="text-sm text-purple-700">
                      {performanceData.bookings.conversionRate}% conversion
                    </div>
                    <div className="flex items-center justify-between text-xs text-purple-600">
                      <span>Confirmed: {performanceData.bookings.confirmed}</span>
                      <span>Pending: {performanceData.bookings.pending}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-orange-600 font-medium">SATISFACTION</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-900">
                      {performanceData.guests.satisfaction.toFixed(1)}/5.0
                    </div>
                    <div className="text-sm text-orange-700">
                      {performanceData.guests.active} active guests
                    </div>
                    <div className="flex items-center justify-between text-xs text-orange-600">
                      <span>New: {performanceData.guests.newToday}</span>
                      <span>Returning: {performanceData.guests.returning}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Staff on Duty</span>
                      <span className="font-medium">{performanceData.operations.staffOnDuty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tasks Completed</span>
                      <span className="font-medium text-green-600">{performanceData.operations.tasksCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tasks Pending</span>
                      <span className="font-medium text-yellow-600">{performanceData.operations.tasksPending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Maintenance Issues</span>
                      <span className="font-medium text-red-600">{performanceData.operations.maintenanceIssues}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg Response Time</span>
                      <span className="font-medium">{performanceData.operations.responseTime} min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">System Load</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              performanceData.technology.systemLoad > 80 ? 'bg-red-500' :
                              performanceData.technology.systemLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${performanceData.technology.systemLoad}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{performanceData.technology.systemLoad}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">API Latency</span>
                      <span className="font-medium">{performanceData.technology.apiLatency}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Error Rate</span>
                      <span className={`font-medium ${performanceData.technology.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                        {performanceData.technology.errorRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-medium text-green-600">{performanceData.technology.uptime.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Connections</span>
                      <span className="font-medium">{performanceData.technology.activeConnections}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other views would be implemented here */}
          {selectedView !== 'overview' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {views.find(v => v.id === selectedView)?.name} View
              </h3>
              <p className="text-gray-600">Detailed {selectedView} metrics coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;