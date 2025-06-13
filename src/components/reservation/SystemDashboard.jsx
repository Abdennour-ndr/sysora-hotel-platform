import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import systemMonitor from '../../services/SystemMonitor';

const SystemDashboard = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [healthChecks, setHealthChecks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen) {
      initializeMonitoring();
      fetchSystemData();
      
      let interval;
      if (autoRefresh) {
        interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen, autoRefresh]);

  const initializeMonitoring = async () => {
    setLoading(true);
    try {
      await systemMonitor.initialize();
      console.log('✅ System monitoring initialized');
    } catch (error) {
      console.error('❌ Failed to initialize monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemData = async () => {
    try {
      const status = systemMonitor.getSystemStatus();
      const checks = systemMonitor.getAllHealthChecks();
      const systemAlerts = systemMonitor.getAllAlerts();
      const performance = systemMonitor.getPerformanceData(3600000); // Last hour

      setSystemStatus(status);
      setHealthChecks(checks);
      setAlerts(systemAlerts);
      setPerformanceData(performance);
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHealthCheckIcon = (type) => {
    const icons = {
      critical: Database,
      performance: Activity,
      resource: Cpu,
      quality: TrendingUp,
      service: Zap
    };
    return icons[type] || Monitor;
  };

  const formatUptime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const acknowledgeAlert = (alertId) => {
    systemMonitor.acknowledgeAlert(alertId);
    fetchSystemData();
  };

  const downloadSystemReport = () => {
    const report = systemMonitor.generateSystemReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Monitor className="w-6 h-6 mr-3" />
                System Dashboard
              </h2>
              <p className="text-blue-100">Real-time system monitoring and diagnostics</p>
            </div>
            <div className="flex items-center space-x-3">
              {systemStatus && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  systemStatus.overall === 'healthy' ? 'bg-green-500' :
                  systemStatus.overall === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-sm font-medium capitalize">{systemStatus.overall}</span>
                </div>
              )}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh ? 'bg-blue-600 text-white' : 'bg-white/20 text-blue-100'
                }`}
                title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
              >
                {autoRefresh ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={fetchSystemData}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'health', label: 'Health Checks', icon: CheckCircle },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'alerts' && alerts.filter(a => !a.acknowledged).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {alerts.filter(a => !a.acknowledged).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Initializing system monitoring...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {selectedTab === 'overview' && systemStatus && (
                <div className="space-y-6">
                  {/* System Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Monitor className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemStatus.overall)}`}>
                          {systemStatus.overall}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">System Status</h3>
                        <div className="text-2xl font-bold text-gray-900 capitalize">{systemStatus.overall}</div>
                        <p className="text-sm text-gray-500">Overall system health</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{systemStatus.checks.healthy}</div>
                          <div className="text-sm text-gray-600">of {systemStatus.checks.total}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Healthy Checks</h3>
                        <p className="text-sm text-gray-500">Services running normally</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                          <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{systemStatus.checks.warnings}</div>
                          <div className="text-sm text-gray-600">warnings</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Warnings</h3>
                        <p className="text-sm text-gray-500">Issues requiring attention</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{formatUptime(systemStatus.uptime)}</div>
                          <div className="text-sm text-gray-600">uptime</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">System Uptime</h3>
                        <p className="text-sm text-gray-500">Continuous operation</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Health Overview */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Check Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {healthChecks.slice(0, 6).map(check => {
                        const IconComponent = getHealthCheckIcon(check.type);
                        return (
                          <div key={check.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{check.name}</span>
                                {getStatusIcon(check.status)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {check.lastResult?.responseTime ? `${check.lastResult.responseTime}ms` : 'No data'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  {alerts.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                      <div className="space-y-3">
                        {alerts.slice(0, 5).map(alert => (
                          <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                            alert.level === 'critical' ? 'border-red-500 bg-red-50' :
                            alert.level === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{alert.title}</div>
                                <div className="text-sm text-gray-600">{alert.message}</div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {alert.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Health Checks Tab */}
              {selectedTab === 'health' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {healthChecks.map(check => {
                      const IconComponent = getHealthCheckIcon(check.type);
                      return (
                        <div key={check.id} className="bg-white rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{check.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{check.type} check</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(check.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                                {check.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Last Check:</span>
                                <div className="font-medium">
                                  {check.lastCheck ? check.lastCheck.toLocaleString() : 'Never'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Response Time:</span>
                                <div className="font-medium">
                                  {check.lastResult?.responseTime ? `${check.lastResult.responseTime}ms` : 'N/A'}
                                </div>
                              </div>
                            </div>

                            {check.lastResult?.message && (
                              <div className="text-sm">
                                <span className="text-gray-600">Message:</span>
                                <div className="font-medium">{check.lastResult.message}</div>
                              </div>
                            )}

                            {check.lastResult?.details && Object.keys(check.lastResult.details).length > 0 && (
                              <div className="text-sm">
                                <span className="text-gray-600">Details:</span>
                                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                                  {JSON.stringify(check.lastResult.details, null, 2)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alerts Tab */}
              {selectedTab === 'alerts' && (
                <div className="space-y-6">
                  {alerts.length > 0 ? (
                    <div className="space-y-4">
                      {alerts.map(alert => (
                        <div key={alert.id} className={`bg-white rounded-xl p-6 border-l-4 ${
                          alert.level === 'critical' ? 'border-red-500' :
                          alert.level === 'warning' ? 'border-yellow-500' :
                          'border-blue-500'
                        } border border-gray-200`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                alert.level === 'critical' ? 'bg-red-100' :
                                alert.level === 'warning' ? 'bg-yellow-100' :
                                'bg-blue-100'
                              }`}>
                                {alert.level === 'critical' ? (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                ) : alert.level === 'warning' ? (
                                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <CheckCircle className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                {alert.timestamp.toLocaleString()}
                              </span>
                              {!alert.acknowledged && (
                                <button
                                  onClick={() => acknowledgeAlert(alert.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Acknowledge
                                </button>
                              )}
                            </div>
                          </div>
                          {alert.acknowledged && (
                            <div className="text-sm text-gray-500">
                              Acknowledged at {alert.acknowledgedAt?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
                      <p className="text-gray-600">All systems are running smoothly.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Performance Tab */}
              {selectedTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Memory Usage */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Cpu className="w-5 h-5 mr-2 text-purple-600" />
                        Memory Usage
                      </h3>
                      {performanceData.length > 0 && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                              {formatBytes(performanceData[performanceData.length - 1]?.memory.used || 0)}
                            </div>
                            <div className="text-sm text-gray-600">
                              of {formatBytes(performanceData[performanceData.length - 1]?.memory.total || 0)}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, (performanceData[performanceData.length - 1]?.memory.used / performanceData[performanceData.length - 1]?.memory.total) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Data Points:</span>
                          <span className="font-medium">{performanceData.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monitoring Duration:</span>
                          <span className="font-medium">{formatUptime(systemStatus?.uptime || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Last Update:</span>
                          <span className="font-medium">
                            {systemStatus?.lastUpdate ? systemStatus.lastUpdate.toLocaleTimeString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Chart Placeholder */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Performance chart visualization</p>
                        <p className="text-sm text-gray-500">Chart component would be implemented here</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            System Monitor v1.0 • Auto-refresh: {autoRefresh ? 'On' : 'Off'} • Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadSystemReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;
