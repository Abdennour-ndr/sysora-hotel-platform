import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Database,
  Server,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
  Eye,
  Bell,
  Lock
} from 'lucide-react';

const SystemHealthMonitor = () => {
  const [healthData, setHealthData] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadHealthData();
    if (isMonitoring) {
      startHealthMonitoring();
    }
    return () => stopHealthMonitoring();
  }, [isMonitoring]);

  const startHealthMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateHealthData();
    }, 5000); // Update every 5 seconds
  };

  const stopHealthMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const healthMetrics = {
        overall: {
          status: 'healthy',
          score: 94.5,
          uptime: 99.9,
          lastCheck: new Date().toISOString()
        },
        
        // System Resources
        system: {
          cpu: {
            usage: 45.2,
            cores: 8,
            temperature: 65,
            frequency: 3.2,
            processes: 156,
            status: 'normal'
          },
          memory: {
            used: 6.8,
            total: 16,
            percentage: 42.5,
            available: 9.2,
            cached: 2.1,
            status: 'normal'
          },
          disk: {
            used: 120,
            total: 500,
            percentage: 24,
            available: 380,
            readSpeed: 450,
            writeSpeed: 380,
            status: 'normal'
          },
          network: {
            latency: 12,
            bandwidth: 1000,
            usage: 15.5,
            packetsIn: 1250,
            packetsOut: 980,
            errors: 0,
            status: 'normal'
          }
        },
        
        // Application Health
        application: {
          webServer: {
            status: 'running',
            port: 3000,
            connections: 45,
            responseTime: 85,
            errorRate: 0.2,
            uptime: 99.8
          },
          database: {
            status: 'running',
            connections: 12,
            queryTime: 15,
            cacheHitRate: 94.5,
            lockWaits: 0,
            uptime: 99.9
          },
          apiGateway: {
            status: 'running',
            requests: 2450,
            responseTime: 120,
            errorRate: 0.1,
            throughput: 150,
            uptime: 99.7
          },
          cache: {
            status: 'running',
            hitRate: 96.2,
            memory: 2.1,
            keys: 15420,
            evictions: 23,
            uptime: 99.9
          }
        },
        
        // Security Health
        security: {
          firewall: {
            status: 'active',
            rules: 45,
            blocked: 127,
            allowed: 15420,
            threats: 0,
            uptime: 100
          },
          ssl: {
            status: 'valid',
            expiry: '2025-06-15',
            strength: 'A+',
            protocols: ['TLS 1.3'],
            ciphers: 'Strong',
            uptime: 100
          },
          antivirus: {
            status: 'active',
            lastScan: '2024-12-15T02:00:00Z',
            threats: 0,
            quarantine: 0,
            definitions: 'Updated',
            uptime: 99.9
          }
        },
        
        // Performance Metrics
        performance: {
          responseTime: {
            avg: 85,
            p95: 150,
            p99: 280,
            trend: 'stable'
          },
          throughput: {
            requests: 2450,
            rps: 15.2,
            peak: 45.8,
            trend: 'increasing'
          },
          errors: {
            rate: 0.2,
            count: 5,
            types: ['timeout', 'validation'],
            trend: 'decreasing'
          },
          availability: {
            current: 99.9,
            target: 99.5,
            sla: 99.0,
            trend: 'stable'
          }
        }
      };

      // Generate alerts based on health data
      const systemAlerts = [];
      
      if (healthMetrics.system.cpu.usage > 80) {
        systemAlerts.push({
          id: 'cpu-high',
          type: 'warning',
          title: 'High CPU Usage',
          message: `CPU usage is at ${healthMetrics.system.cpu.usage}%`,
          timestamp: new Date().toISOString(),
          severity: 'medium'
        });
      }
      
      if (healthMetrics.system.memory.percentage > 85) {
        systemAlerts.push({
          id: 'memory-high',
          type: 'warning',
          title: 'High Memory Usage',
          message: `Memory usage is at ${healthMetrics.system.memory.percentage}%`,
          timestamp: new Date().toISOString(),
          severity: 'medium'
        });
      }
      
      if (healthMetrics.application.database.queryTime > 100) {
        systemAlerts.push({
          id: 'db-slow',
          type: 'warning',
          title: 'Slow Database Queries',
          message: `Average query time is ${healthMetrics.application.database.queryTime}ms`,
          timestamp: new Date().toISOString(),
          severity: 'low'
        });
      }

      // Generate historical data for trends
      const historical = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        historical.push({
          timestamp: time.toISOString(),
          cpu: Math.random() * 20 + 35,
          memory: Math.random() * 15 + 35,
          disk: Math.random() * 10 + 20,
          network: Math.random() * 10 + 10,
          responseTime: Math.random() * 50 + 60
        });
      }

      setHealthData(healthMetrics);
      setAlerts(systemAlerts);
      setHistoricalData(historical);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHealthData = async () => {
    if (!healthData) return;
    
    try {
      // Simulate real-time updates
      setHealthData(prev => ({
        ...prev,
        system: {
          ...prev.system,
          cpu: {
            ...prev.system.cpu,
            usage: Math.max(20, Math.min(90, prev.system.cpu.usage + (Math.random() - 0.5) * 10))
          },
          memory: {
            ...prev.system.memory,
            percentage: Math.max(20, Math.min(85, prev.system.memory.percentage + (Math.random() - 0.5) * 5))
          },
          network: {
            ...prev.system.network,
            latency: Math.max(5, Math.min(50, prev.system.network.latency + (Math.random() - 0.5) * 5))
          }
        },
        overall: {
          ...prev.overall,
          lastCheck: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error updating health data:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
      case 'active':
      case 'valid':
      case 'normal':
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

  const formatUptime = (uptime) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system health data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">System Health Monitor</h2>
              <p className="text-green-100">Real-time system health and performance monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                healthData?.overall.status === 'healthy' ? 'bg-green-400' :
                healthData?.overall.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
              } animate-pulse`}></div>
              <span className="text-sm capitalize">{healthData?.overall.status}</span>
            </div>
            
            <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
              Score: {healthData?.overall.score.toFixed(1)}%
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`p-2 rounded-lg transition-colors ${
                isMonitoring 
                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isMonitoring ? <Eye className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={loadHealthData}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-green-100">
          Last check: {formatDate(healthData?.overall.lastCheck)} • 
          Uptime: {formatUptime(healthData?.overall.uptime)} • 
          {alerts.length} active alerts
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-900">CPU</span>
            </div>
            {getStatusIcon(healthData?.system.cpu.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usage</span>
              <span className="font-medium">{healthData?.system.cpu.usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  healthData?.system.cpu.usage > 80 ? 'bg-red-500' :
                  healthData?.system.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${healthData?.system.cpu.usage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Cores: {healthData?.system.cpu.cores}</div>
              <div>Temp: {healthData?.system.cpu.temperature}°C</div>
              <div>Freq: {healthData?.system.cpu.frequency} GHz</div>
              <div>Proc: {healthData?.system.cpu.processes}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MemoryStick className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-900">Memory</span>
            </div>
            {getStatusIcon(healthData?.system.memory.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usage</span>
              <span className="font-medium">{healthData?.system.memory.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  healthData?.system.memory.percentage > 80 ? 'bg-red-500' :
                  healthData?.system.memory.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${healthData?.system.memory.percentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Used: {healthData?.system.memory.used} GB</div>
              <div>Total: {healthData?.system.memory.total} GB</div>
              <div>Available: {healthData?.system.memory.available} GB</div>
              <div>Cached: {healthData?.system.memory.cached} GB</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Disk</span>
            </div>
            {getStatusIcon(healthData?.system.disk.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usage</span>
              <span className="font-medium">{healthData?.system.disk.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  healthData?.system.disk.percentage > 80 ? 'bg-red-500' :
                  healthData?.system.disk.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${healthData?.system.disk.percentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Used: {healthData?.system.disk.used} GB</div>
              <div>Total: {healthData?.system.disk.total} GB</div>
              <div>Read: {healthData?.system.disk.readSpeed} MB/s</div>
              <div>Write: {healthData?.system.disk.writeSpeed} MB/s</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Network className="w-6 h-6 text-orange-600" />
              <span className="font-medium text-gray-900">Network</span>
            </div>
            {getStatusIcon(healthData?.system.network.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Latency</span>
              <span className="font-medium">{healthData?.system.network.latency}ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  healthData?.system.network.latency > 50 ? 'bg-red-500' :
                  healthData?.system.network.latency > 25 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (healthData?.system.network.latency / 100) * 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>In: {healthData?.system.network.packetsIn}</div>
              <div>Out: {healthData?.system.network.packetsOut}</div>
              <div>Usage: {healthData?.system.network.usage}%</div>
              <div>Errors: {healthData?.system.network.errors}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Services */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Web Server</span>
              </div>
              {getStatusIcon(healthData?.application.webServer.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Port</span>
                <span>{healthData?.application.webServer.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connections</span>
                <span>{healthData?.application.webServer.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time</span>
                <span>{healthData?.application.webServer.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600">{formatUptime(healthData?.application.webServer.uptime)}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Database</span>
              </div>
              {getStatusIcon(healthData?.application.database.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Connections</span>
                <span>{healthData?.application.database.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Query Time</span>
                <span>{healthData?.application.database.queryTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cache Hit</span>
                <span>{healthData?.application.database.cacheHitRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600">{formatUptime(healthData?.application.database.uptime)}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">API Gateway</span>
              </div>
              {getStatusIcon(healthData?.application.apiGateway.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Requests</span>
                <span>{healthData?.application.apiGateway.requests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time</span>
                <span>{healthData?.application.apiGateway.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Throughput</span>
                <span>{healthData?.application.apiGateway.throughput} req/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600">{formatUptime(healthData?.application.apiGateway.uptime)}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Cache</span>
              </div>
              {getStatusIcon(healthData?.application.cache.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hit Rate</span>
                <span>{healthData?.application.cache.hitRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Memory</span>
                <span>{healthData?.application.cache.memory} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Keys</span>
                <span>{healthData?.application.cache.keys.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600">{formatUptime(healthData?.application.cache.uptime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Firewall</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthData?.security.firewall.status)}
                <span className="text-sm font-medium capitalize">{healthData?.security.firewall.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">SSL Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthData?.security.ssl.status)}
                <span className="text-sm font-medium">{healthData?.security.ssl.strength}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Antivirus</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(healthData?.security.antivirus.status)}
                <span className="text-sm font-medium capitalize">{healthData?.security.antivirus.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="font-medium">{healthData?.performance.responseTime.avg}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Requests/sec</span>
              <span className="font-medium">{healthData?.performance.throughput.rps}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Error Rate</span>
              <span className={`font-medium ${
                healthData?.performance.errors.rate > 1 ? 'text-red-600' : 'text-green-600'
              }`}>
                {healthData?.performance.errors.rate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Availability</span>
              <span className="font-medium text-green-600">
                {formatUptime(healthData?.performance.availability.current)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-yellow-800">{alert.title}</h4>
                      <p className="text-xs text-yellow-700 mt-1">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No active alerts</p>
                <p className="text-xs text-gray-500">All systems operating normally</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
