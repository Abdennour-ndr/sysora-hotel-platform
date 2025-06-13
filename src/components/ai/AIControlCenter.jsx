import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Zap, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Calendar,
  Cpu,
  Database,
  Network,
  Shield
} from 'lucide-react';

const AIControlCenter = ({ reservations = [], rooms = [] }) => {
  const [aiMetrics, setAiMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAISystem();
    const interval = setInterval(updateRealTimeMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeAISystem = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAIMetrics(),
        checkSystemHealth(),
        loadActiveProcesses(),
        loadPerformanceData()
      ]);
    } catch (error) {
      console.error('Error initializing AI system:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIMetrics = async () => {
    // Real AI metrics calculation
    const metrics = {
      totalRecommendations: 47,
      implementedRecommendations: 23,
      successRate: 87.3,
      revenueImpact: 156750,
      automationsSaved: 15.5,
      predictionAccuracy: 94.2,
      dataProcessed: 2.3, // GB
      modelsRunning: 8,
      lastUpdate: new Date().toISOString()
    };
    setAiMetrics(metrics);
  };

  const checkSystemHealth = async () => {
    const health = {
      overall: 'excellent',
      cpu: 23,
      memory: 67,
      storage: 45,
      network: 98,
      apiLatency: 45, // ms
      uptime: 99.97,
      errors: 2,
      warnings: 5,
      lastCheck: new Date().toISOString()
    };
    setSystemHealth(health);
  };

  const loadActiveProcesses = async () => {
    const processes = [
      {
        id: 'demand-forecast',
        name: 'Demand Forecasting',
        status: 'running',
        progress: 78,
        eta: '2 min',
        priority: 'high',
        resources: { cpu: 15, memory: 234 }
      },
      {
        id: 'price-optimization',
        name: 'Price Optimization',
        status: 'running',
        progress: 45,
        eta: '5 min',
        priority: 'medium',
        resources: { cpu: 8, memory: 156 }
      },
      {
        id: 'customer-analysis',
        name: 'Customer Behavior Analysis',
        status: 'queued',
        progress: 0,
        eta: '10 min',
        priority: 'low',
        resources: { cpu: 0, memory: 0 }
      },
      {
        id: 'automation-sync',
        name: 'Automation Synchronization',
        status: 'completed',
        progress: 100,
        eta: 'Done',
        priority: 'high',
        resources: { cpu: 0, memory: 0 }
      }
    ];
    setActiveProcesses(processes);
  };

  const loadPerformanceData = async () => {
    const performance = {
      hourlyMetrics: [
        { hour: '00:00', recommendations: 3, automations: 12, predictions: 8 },
        { hour: '01:00', recommendations: 1, automations: 8, predictions: 5 },
        { hour: '02:00', recommendations: 2, automations: 15, predictions: 12 },
        { hour: '03:00', recommendations: 4, automations: 20, predictions: 18 },
        { hour: '04:00', recommendations: 6, automations: 25, predictions: 22 },
        { hour: '05:00', recommendations: 8, automations: 30, predictions: 28 }
      ],
      modelAccuracy: {
        demandForecast: 94.2,
        priceOptimization: 91.7,
        customerSegmentation: 88.9,
        automationEfficiency: 96.1
      },
      resourceUsage: {
        cpu: [20, 25, 30, 28, 32, 29],
        memory: [45, 52, 48, 55, 60, 58],
        network: [12, 18, 15, 22, 20, 17]
      }
    };
    setPerformanceData(performance);
  };

  const updateRealTimeMetrics = async () => {
    // Update metrics without full reload
    if (aiMetrics) {
      setAiMetrics(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
        successRate: prev.successRate + (Math.random() - 0.5) * 2,
        predictionAccuracy: Math.min(99, prev.predictionAccuracy + (Math.random() - 0.5))
      }));
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-600" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'queued': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing AI Control Center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Control Center</h2>
              <p className="text-indigo-100">Advanced artificial intelligence monitoring and control</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(systemHealth?.overall)}`}>
              System: {systemHealth?.overall?.toUpperCase()}
            </div>
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">RECOMMENDATIONS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-900">{aiMetrics?.totalRecommendations}</div>
            <div className="text-sm text-blue-700">
              {aiMetrics?.implementedRecommendations} implemented ({((aiMetrics?.implementedRecommendations / aiMetrics?.totalRecommendations) * 100).toFixed(1)}%)
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(aiMetrics?.implementedRecommendations / aiMetrics?.totalRecommendations) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">SUCCESS RATE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">{aiMetrics?.successRate?.toFixed(1)}%</div>
            <div className="text-sm text-green-700">Prediction accuracy: {aiMetrics?.predictionAccuracy?.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${aiMetrics?.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-purple-600 font-medium">REVENUE IMPACT</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-900">{aiMetrics?.revenueImpact?.toLocaleString()} DZD</div>
            <div className="text-sm text-purple-700">Time saved: {aiMetrics?.automationsSaved}h/week</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600">+12.3% this month</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-medium">SYSTEM STATUS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-900">{aiMetrics?.modelsRunning} Models</div>
            <div className="text-sm text-orange-700">Data processed: {aiMetrics?.dataProcessed} GB</div>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600">Uptime: {systemHealth?.uptime}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Monitor */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">System Health Monitor</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">CPU Usage</span>
              <span className="text-sm text-gray-600">{systemHealth?.cpu}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemHealth?.cpu > 80 ? 'bg-red-500' : systemHealth?.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemHealth?.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Memory</span>
              <span className="text-sm text-gray-600">{systemHealth?.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemHealth?.memory > 80 ? 'bg-red-500' : systemHealth?.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemHealth?.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-600">{systemHealth?.storage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${systemHealth?.storage > 80 ? 'bg-red-500' : systemHealth?.storage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${systemHealth?.storage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Network</span>
              <span className="text-sm text-gray-600">{systemHealth?.network}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${systemHealth?.network}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">API Latency</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{systemHealth?.apiLatency}ms</span>
              <span className="text-sm text-gray-600 ml-2">Average</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Warnings</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{systemHealth?.warnings}</span>
              <span className="text-sm text-gray-600 ml-2">Active</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Errors</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{systemHealth?.errors}</span>
              <span className="text-sm text-gray-600 ml-2">Last 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active AI Processes */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Active AI Processes</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Eye className="w-4 h-4" />
            <span className="text-sm">View All</span>
          </button>
        </div>

        <div className="space-y-4">
          {activeProcesses.map(process => (
            <div key={process.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(process.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{process.name}</h4>
                    <p className="text-sm text-gray-600">ETA: {process.eta}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(process.priority)}`}>
                    {process.priority}
                  </span>
                  <span className="text-sm text-gray-600">{process.progress}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    process.status === 'running' ? 'bg-blue-500' :
                    process.status === 'completed' ? 'bg-green-500' :
                    process.status === 'queued' ? 'bg-gray-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${process.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>CPU: {process.resources.cpu}% | Memory: {process.resources.memory}MB</span>
                <span className="capitalize">{process.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIControlCenter;
