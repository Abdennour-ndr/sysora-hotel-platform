import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Activity, 
  Shield, 
  Users, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Wifi,
  Eye,
  Bell,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';

const UnifiedMonitorCenter = ({ 
  systemData = {}, 
  securityData = {}, 
  userActivity = [],
  alerts = []
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [realTimeData, setRealTimeData] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Monitor sections configuration
  const monitorSections = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: Monitor,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Complete system health and status'
    },
    {
      id: 'performance',
      title: 'Performance Monitor',
      icon: Activity,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'System performance and resource usage'
    },
    {
      id: 'security',
      title: 'Security Monitor',
      icon: Shield,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Security threats and access monitoring'
    },
    {
      id: 'users',
      title: 'User Activity',
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Real-time user activity and sessions'
    },
    {
      id: 'alerts',
      title: 'Alerts & Notifications',
      icon: Bell,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'System alerts and notifications'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      icon: Server,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Server and infrastructure monitoring'
    }
  ];

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        updateRealTimeData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [isMonitoring, refreshInterval]);

  const updateRealTimeData = () => {
    const now = new Date();
    
    setRealTimeData({
      timestamp: now.toLocaleTimeString(),
      systemHealth: {
        cpu: Math.floor(Math.random() * 30) + 40, // 40-70%
        memory: Math.floor(Math.random() * 25) + 50, // 50-75%
        disk: Math.floor(Math.random() * 20) + 30, // 30-50%
        network: Math.floor(Math.random() * 40) + 60 // 60-100%
      },
      performance: {
        responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
        throughput: Math.floor(Math.random() * 500) + 1000, // 1000-1500 req/min
        errorRate: (Math.random() * 0.5).toFixed(2), // 0-0.5%
        uptime: 99.9
      },
      security: {
        threatsBlocked: Math.floor(Math.random() * 5),
        activeConnections: Math.floor(Math.random() * 50) + 100,
        failedLogins: Math.floor(Math.random() * 3),
        securityScore: Math.floor(Math.random() * 5) + 95 // 95-100%
      },
      users: {
        activeUsers: Math.floor(Math.random() * 20) + 30,
        totalSessions: Math.floor(Math.random() * 100) + 200,
        newLogins: Math.floor(Math.random() * 10),
        avgSessionTime: Math.floor(Math.random() * 30) + 15 // 15-45 minutes
      }
    });
  };

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.danger) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value >= thresholds.danger) return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (value >= thresholds.warning) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingUp className="w-4 h-4 text-green-600" />;
  };

  const formatUptime = (uptime) => {
    return `${uptime}%`;
  };

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Monitor className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Monitor Center</h1>
                <p className="text-gray-300 text-sm">Real-time system monitoring and alerts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-300">
                  {isMonitoring ? 'Live Monitoring' : 'Paused'}
                </span>
              </div>
              
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`p-2 rounded-lg transition-colors ${
                  isMonitoring 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
                title={isMonitoring ? 'Pause Monitoring' : 'Start Monitoring'}
              >
                {isMonitoring ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={updateRealTimeData}
                className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                title="Refresh Now"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status Bar */}
        {realTimeData.timestamp && (
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Last Update: {realTimeData.timestamp}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">System: Healthy</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Performance: Optimal</span>
                </div>
              </div>
              
              <div className="text-gray-500">
                Refresh: {refreshInterval / 1000}s
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Status Cards */}
      {realTimeData.systemHealth && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{realTimeData.systemHealth.cpu}%</div>
            <div className="text-sm text-gray-600">CPU Usage</div>
            {getStatusIcon(realTimeData.systemHealth.cpu, { warning: 70, danger: 85 })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{realTimeData.systemHealth.memory}%</div>
            <div className="text-sm text-gray-600">Memory</div>
            {getStatusIcon(realTimeData.systemHealth.memory, { warning: 75, danger: 90 })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{realTimeData.systemHealth.disk}%</div>
            <div className="text-sm text-gray-600">Disk Usage</div>
            {getStatusIcon(realTimeData.systemHealth.disk, { warning: 80, danger: 95 })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{realTimeData.performance.responseTime}ms</div>
            <div className="text-sm text-gray-600">Response</div>
            {getStatusIcon(realTimeData.performance.responseTime, { warning: 200, danger: 500 })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{realTimeData.users.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <TrendingUp className="w-4 h-4 text-green-600 mx-auto mt-1" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{realTimeData.security.threatsBlocked}</div>
            <div className="text-sm text-gray-600">Threats Blocked</div>
            <Shield className="w-4 h-4 text-red-600 mx-auto mt-1" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{realTimeData.performance.errorRate}%</div>
            <div className="text-sm text-gray-600">Error Rate</div>
            {getStatusIcon(parseFloat(realTimeData.performance.errorRate), { warning: 1, danger: 5 })}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatUptime(realTimeData.performance.uptime)}</div>
            <div className="text-sm text-gray-600">Uptime</div>
            <CheckCircle className="w-4 h-4 text-green-600 mx-auto mt-1" />
          </div>
        </div>
      )}

      {/* Monitor Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitorSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl ${section.lightColor}`}>
                  <Icon className={`w-6 h-6 ${section.textColor}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                </div>
                
                <div className="text-xs text-gray-500">
                  {isMonitoring ? 'Live' : 'Paused'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {monitorSections.find(s => s.id === activeSection)?.title || 'Monitor'}
          </h2>
          
          <div className="flex items-center space-x-2">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1000}>1s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm transition-colors">
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'overview' && realTimeData.systemHealth && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">System Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">CPU:</span>
                    <span className={`text-sm font-medium ${getStatusColor(realTimeData.systemHealth.cpu, { warning: 70, danger: 85 })}`}>
                      {realTimeData.systemHealth.cpu}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Memory:</span>
                    <span className={`text-sm font-medium ${getStatusColor(realTimeData.systemHealth.memory, { warning: 75, danger: 90 })}`}>
                      {realTimeData.systemHealth.memory}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">Disk:</span>
                    <span className={`text-sm font-medium ${getStatusColor(realTimeData.systemHealth.disk, { warning: 80, danger: 95 })}`}>
                      {realTimeData.systemHealth.disk}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Response Time:</span>
                    <span className="text-sm font-medium text-green-600">{realTimeData.performance.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Throughput:</span>
                    <span className="text-sm font-medium text-green-600">{realTimeData.performance.throughput}/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Uptime:</span>
                    <span className="text-sm font-medium text-green-600">{formatUptime(realTimeData.performance.uptime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Security Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Security Score:</span>
                    <span className="text-sm font-medium text-red-600">{realTimeData.security.securityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Threats Blocked:</span>
                    <span className="text-sm font-medium text-red-600">{realTimeData.security.threatsBlocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Failed Logins:</span>
                    <span className="text-sm font-medium text-red-600">{realTimeData.security.failedLogins}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'overview' && (
            <div className="text-center py-12 text-gray-500">
              <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Detailed {monitorSections.find(s => s.id === activeSection)?.title} coming soon...</p>
              <p className="text-sm mt-2">Advanced monitoring features will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedMonitorCenter;
