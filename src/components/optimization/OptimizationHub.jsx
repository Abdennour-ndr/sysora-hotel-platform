import React, { useState, useEffect } from 'react';
import {
  Zap,
  Database,
  Heart,
  TrendingUp,
  Activity,
  Target,
  Rocket,
  Shield,
  RefreshCw,
  BarChart3,
  Award
} from 'lucide-react';

import PerformanceOptimizer from './PerformanceOptimizer';
import BackupManager from './BackupManager';
import SystemHealthMonitor from './SystemHealthMonitor';

const OptimizationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationOverview, setOptimizationOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptimizationOverview();
  }, []);

  const loadOptimizationOverview = async () => {
    setLoading(true);
    try {
      // Load comprehensive optimization overview
      const overview = {
        summary: {
          overallScore: 91.2,
          performanceScore: 87.5,
          securityScore: 94.8,
          reliabilityScore: 89.3,
          lastOptimized: '2024-12-15T10:30:00Z'
        },
        
        // Performance Metrics
        performance: {
          coreWebVitals: {
            lcp: { value: 1.2, status: 'good' },
            fid: { value: 45, status: 'good' },
            cls: { value: 0.08, status: 'good' }
          },
          loadTime: 1.2,
          bundleSize: 18.6,
          cacheHitRate: 94.5,
          optimizationsApplied: 4,
          optimizationsAvailable: 6
        },
        
        // System Health
        systemHealth: {
          cpu: { usage: 45.2, status: 'normal' },
          memory: { usage: 42.5, status: 'normal' },
          disk: { usage: 24, status: 'normal' },
          network: { latency: 12, status: 'normal' },
          uptime: 99.9,
          activeAlerts: 2
        },
        
        // Backup Status
        backup: {
          lastBackup: '2024-12-15T02:00:00Z',
          backupStatus: 'completed',
          totalBackups: 6,
          successfulBackups: 5,
          failedBackups: 1,
          totalSize: 16.8,
          autoBackupEnabled: true
        },
        
        // Security Status
        security: {
          sslScore: 95,
          vulnerabilities: 0,
          securityHeaders: 8,
          encryptionStatus: 'enabled',
          firewallStatus: 'active',
          lastSecurityScan: '2024-12-15T11:30:00Z'
        },
        
        // Optimization Recommendations
        recommendations: [
          {
            id: 'image-optimization',
            category: 'performance',
            priority: 'high',
            title: 'Optimize Remaining Images',
            description: 'Convert 47 images to WebP format for better compression',
            impact: 'Reduce image payload by 40%',
            effort: 'low',
            estimatedSavings: '6.8 MB'
          },
          {
            id: 'lazy-loading',
            category: 'performance',
            priority: 'medium',
            title: 'Implement Advanced Lazy Loading',
            description: 'Add intersection observer-based lazy loading for components',
            impact: 'Reduce initial bundle size by 25%',
            effort: 'medium',
            estimatedSavings: '4.2 MB'
          },
          {
            id: 'database-indexing',
            category: 'performance',
            priority: 'high',
            title: 'Database Query Optimization',
            description: 'Add indexes for frequently queried columns',
            impact: 'Reduce query time by 60%',
            effort: 'medium',
            estimatedSavings: '300ms'
          },
          {
            id: 'backup-retention',
            category: 'reliability',
            priority: 'medium',
            title: 'Optimize Backup Retention',
            description: 'Implement intelligent backup retention policy',
            impact: 'Reduce storage usage by 30%',
            effort: 'low',
            estimatedSavings: '5.2 GB'
          }
        ],
        
        // Recent Activities
        recentActivities: [
          {
            id: 1,
            type: 'optimization',
            title: 'Code Splitting Applied',
            description: 'Enhanced code splitting implemented for better caching',
            timestamp: '2024-12-15T10:30:00Z',
            impact: '+2.1 MB savings',
            status: 'completed'
          },
          {
            id: 2,
            type: 'backup',
            title: 'Daily Backup Completed',
            description: 'Automated daily backup completed successfully',
            timestamp: '2024-12-15T02:00:00Z',
            impact: '2.8 GB backed up',
            status: 'completed'
          },
          {
            id: 3,
            type: 'security',
            title: 'Security Scan Completed',
            description: 'Automated security scan found no vulnerabilities',
            timestamp: '2024-12-15T11:30:00Z',
            impact: '0 threats detected',
            status: 'completed'
          },
          {
            id: 4,
            type: 'performance',
            title: 'CDN Implementation',
            description: 'Content Delivery Network configured for static assets',
            timestamp: '2024-12-14T16:45:00Z',
            impact: '+1.5s load time improvement',
            status: 'completed'
          }
        ],
        
        // System Statistics
        statistics: {
          totalOptimizations: 12,
          performanceImprovements: 8,
          securityEnhancements: 6,
          reliabilityUpgrades: 4,
          totalSavings: {
            size: '15.2 MB',
            time: '3.8s',
            storage: '12.4 GB'
          }
        }
      };

      setOptimizationOverview(overview);
    } catch (error) {
      console.error('Error loading optimization overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'health', name: 'System Health', icon: Heart },
    { id: 'backup', name: 'Backup & Recovery', icon: Database }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
      case 'normal':
      case 'completed':
      case 'active':
      case 'enabled':
        return 'text-green-600';
      case 'warning':
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
      case 'critical':
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'backup': return <Database className="w-4 h-4 text-green-600" />;
      case 'security': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'performance': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading optimization hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Rocket className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Optimization & Performance Hub</h2>
              <p className="text-purple-100">Comprehensive system optimization and monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(optimizationOverview?.summary.overallScore)} ${getScoreColor(optimizationOverview?.summary.overallScore)}`}>
              {optimizationOverview?.summary.overallScore.toFixed(1)}% Overall Score
            </div>
            
            <button 
              onClick={loadOptimizationOverview}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-purple-100">
          Last optimized: {formatDate(optimizationOverview?.summary.lastOptimized)} • 
          {optimizationOverview?.statistics.totalOptimizations} optimizations applied • 
          {optimizationOverview?.recommendations.length} recommendations available
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && optimizationOverview && (
            <div className="space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`rounded-xl p-6 border-2 ${getScoreBg(optimizationOverview.summary.performanceScore)} border-opacity-20`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">PERFORMANCE</span>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getScoreColor(optimizationOverview.summary.performanceScore)}`}>
                      {optimizationOverview.summary.performanceScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700">
                      {optimizationOverview.performance.loadTime}s load time
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-6 border-2 ${getScoreBg(optimizationOverview.summary.securityScore)} border-opacity-20`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">SECURITY</span>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getScoreColor(optimizationOverview.summary.securityScore)}`}>
                      {optimizationOverview.summary.securityScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-700">
                      {optimizationOverview.security.vulnerabilities} vulnerabilities
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-6 border-2 ${getScoreBg(optimizationOverview.summary.reliabilityScore)} border-opacity-20`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">RELIABILITY</span>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getScoreColor(optimizationOverview.summary.reliabilityScore)}`}>
                      {optimizationOverview.summary.reliabilityScore.toFixed(1)}%
                    </div>
                    <div className="text-sm text-purple-700">
                      {optimizationOverview.systemHealth.uptime}% uptime
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-orange-600 font-medium">OPTIMIZATIONS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-900">
                      {optimizationOverview.performance.optimizationsApplied}/{optimizationOverview.performance.optimizationsAvailable}
                    </div>
                    <div className="text-sm text-orange-700">
                      {optimizationOverview.recommendations.length} pending
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations and Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Optimization Recommendations */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
                  <div className="space-y-4">
                    {optimizationOverview.recommendations.slice(0, 4).map(recommendation => (
                      <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{recommendation.impact}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-blue-600 font-medium">
                              Save: {recommendation.estimatedSavings}
                            </span>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {optimizationOverview.recentActivities.slice(0, 4).map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                            <span className="text-xs text-green-600 font-medium">{activity.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Core Web Vitals</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.performance.coreWebVitals.lcp.status)}`}>
                        {optimizationOverview.performance.coreWebVitals.lcp.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Bundle Size</span>
                      <span className="text-sm font-medium">{optimizationOverview.performance.bundleSize} MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cache Hit Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {optimizationOverview.performance.cacheHitRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Load Time</span>
                      <span className="text-sm font-medium">{optimizationOverview.performance.loadTime}s</span>
                    </div>
                  </div>
                </div>

                {/* System Health Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.systemHealth.cpu.status)}`}>
                        {optimizationOverview.systemHealth.cpu.usage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.systemHealth.memory.status)}`}>
                        {optimizationOverview.systemHealth.memory.usage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Disk Usage</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.systemHealth.disk.status)}`}>
                        {optimizationOverview.systemHealth.disk.usage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Alerts</span>
                      <span className={`text-sm font-medium ${
                        optimizationOverview.systemHealth.activeAlerts > 0 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {optimizationOverview.systemHealth.activeAlerts}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Backup & Security Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Backup</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.backup.backupStatus)}`}>
                        {formatDate(optimizationOverview.backup.lastBackup)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Backup Success Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {((optimizationOverview.backup.successfulBackups / optimizationOverview.backup.totalBackups) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">SSL Score</span>
                      <span className="text-sm font-medium text-green-600">
                        {optimizationOverview.security.sslScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Security Status</span>
                      <span className={`text-sm font-medium ${getStatusColor(optimizationOverview.security.firewallStatus)}`}>
                        {optimizationOverview.security.firewallStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Statistics */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{optimizationOverview.statistics.performanceImprovements}</div>
                    <p className="text-sm text-blue-700">Performance Improvements</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">{optimizationOverview.statistics.securityEnhancements}</div>
                    <p className="text-sm text-green-700">Security Enhancements</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">{optimizationOverview.statistics.reliabilityUpgrades}</div>
                    <p className="text-sm text-purple-700">Reliability Upgrades</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">{optimizationOverview.statistics.totalOptimizations}</div>
                    <p className="text-sm text-orange-700">Total Optimizations</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Total Savings Achieved</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{optimizationOverview.statistics.totalSavings.size}</div>
                      <p className="text-xs text-gray-600">Size Reduction</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{optimizationOverview.statistics.totalSavings.time}</div>
                      <p className="text-xs text-gray-600">Time Saved</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{optimizationOverview.statistics.totalSavings.storage}</div>
                      <p className="text-xs text-gray-600">Storage Saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && <PerformanceOptimizer />}
          {activeTab === 'health' && <SystemHealthMonitor />}
          {activeTab === 'backup' && <BackupManager />}
        </div>
      </div>
    </div>
  );
};

export default OptimizationHub;
