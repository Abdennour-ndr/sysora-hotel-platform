import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Zap,
  Cpu,
  MemoryStick,
  Network,
  HardDrive,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const PerformanceOptimizer = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(loadPerformanceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate comprehensive performance metrics
      const metrics = {
        overall: {
          score: 87.5,
          grade: 'A',
          status: 'good',
          lastOptimized: '2024-12-15T10:30:00Z'
        },
        
        // Core Web Vitals
        coreWebVitals: {
          lcp: { value: 1.2, threshold: 2.5, status: 'good' }, // Largest Contentful Paint
          fid: { value: 45, threshold: 100, status: 'good' }, // First Input Delay
          cls: { value: 0.08, threshold: 0.1, status: 'good' }, // Cumulative Layout Shift
          fcp: { value: 0.9, threshold: 1.8, status: 'good' }, // First Contentful Paint
          ttfb: { value: 180, threshold: 600, status: 'good' } // Time to First Byte
        },
        
        // System Performance
        system: {
          cpu: { usage: 45, cores: 8, temperature: 65 },
          memory: { used: 6.2, total: 16, percentage: 38.75 },
          disk: { used: 120, total: 500, percentage: 24 },
          network: { latency: 12, bandwidth: 1000, usage: 15.5 }
        },
        
        // Application Performance
        application: {
          bundleSize: { js: 2.8, css: 0.6, images: 15.2, total: 18.6 },
          loadTime: { initial: 1.2, interactive: 2.1, complete: 3.4 },
          cacheHitRate: 94.5,
          apiResponseTime: 85,
          databaseQueryTime: 12,
          errorRate: 0.3
        },
        
        // User Experience
        userExperience: {
          pageViews: 15420,
          bounceRate: 32.5,
          sessionDuration: 4.2,
          conversionRate: 12.8,
          userSatisfaction: 4.6,
          mobileUsage: 68.3
        },
        
        // Resource Usage
        resources: {
          components: { total: 156, lazy: 89, optimized: 134 },
          images: { total: 245, optimized: 198, webp: 156 },
          fonts: { total: 8, preloaded: 6, optimized: 7 },
          scripts: { total: 23, minified: 20, compressed: 18 }
        },
        
        // Security Performance
        security: {
          sslScore: 95,
          securityHeaders: 8,
          vulnerabilities: 0,
          encryptionStrength: 'AES-256',
          certificateExpiry: '2025-06-15'
        }
      };

      // Generate optimization suggestions
      const suggestions = [
        {
          id: 'lazy-loading',
          category: 'performance',
          priority: 'high',
          title: 'Implement Advanced Lazy Loading',
          description: 'Add intersection observer-based lazy loading for images and components',
          impact: 'Reduce initial bundle size by 25%',
          effort: 'medium',
          savings: { size: '4.2 MB', time: '0.8s' },
          implemented: false
        },
        {
          id: 'code-splitting',
          category: 'performance',
          priority: 'high',
          title: 'Enhanced Code Splitting',
          description: 'Split large components into smaller chunks for better caching',
          impact: 'Improve cache efficiency by 30%',
          effort: 'high',
          savings: { size: '2.1 MB', time: '0.5s' },
          implemented: true
        },
        {
          id: 'image-optimization',
          category: 'assets',
          priority: 'medium',
          title: 'Advanced Image Optimization',
          description: 'Convert remaining images to WebP and implement responsive images',
          impact: 'Reduce image payload by 40%',
          effort: 'low',
          savings: { size: '6.8 MB', time: '1.2s' },
          implemented: false
        },
        {
          id: 'service-worker',
          category: 'caching',
          priority: 'medium',
          title: 'Service Worker Implementation',
          description: 'Add service worker for offline functionality and better caching',
          impact: 'Improve offline experience and cache hit rate',
          effort: 'high',
          savings: { size: '0 MB', time: '2.1s' },
          implemented: false
        },
        {
          id: 'database-indexing',
          category: 'backend',
          priority: 'high',
          title: 'Database Query Optimization',
          description: 'Add indexes and optimize slow queries',
          impact: 'Reduce database response time by 60%',
          effort: 'medium',
          savings: { size: '0 MB', time: '0.3s' },
          implemented: false
        },
        {
          id: 'cdn-implementation',
          category: 'infrastructure',
          priority: 'medium',
          title: 'CDN for Static Assets',
          description: 'Implement CDN for faster global content delivery',
          impact: 'Reduce load time by 40% globally',
          effort: 'low',
          savings: { size: '0 MB', time: '1.5s' },
          implemented: true
        }
      ];

      setPerformanceMetrics(metrics);
      setOptimizationSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getScoreColor = useCallback((score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getScoreBg = useCallback((score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const handleOptimization = useCallback(async (suggestionId) => {
    setIsOptimizing(true);
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOptimizationSuggestions(prev => 
        prev.map(suggestion => 
          suggestion.id === suggestionId 
            ? { ...suggestion, implemented: true }
            : suggestion
        )
      );
      
      // Update performance score
      setPerformanceMetrics(prev => ({
        ...prev,
        overall: {
          ...prev.overall,
          score: Math.min(100, prev.overall.score + Math.random() * 5),
          lastOptimized: new Date().toISOString()
        }
      }));
      
      window.showToast && window.showToast('Optimization applied successfully', 'success');
    } catch (error) {
      console.error('Error applying optimization:', error);
      window.showToast && window.showToast('Failed to apply optimization', 'error');
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const formatBytes = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatTime = useCallback((seconds) => {
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
    return `${seconds.toFixed(1)}s`;
  }, []);

  const implementedOptimizations = useMemo(() => 
    optimizationSuggestions.filter(s => s.implemented).length
  , [optimizationSuggestions]);

  const totalOptimizations = useMemo(() => 
    optimizationSuggestions.length
  , [optimizationSuggestions]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading performance data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Performance Optimizer</h2>
              <p className="text-green-100">Advanced performance monitoring and optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(performanceMetrics?.overall.score)} ${getScoreColor(performanceMetrics?.overall.score)}`}>
              {performanceMetrics?.overall.score.toFixed(1)}% Grade {performanceMetrics?.overall.grade}
            </div>
            
            <button 
              onClick={loadPerformanceData}
              disabled={isOptimizing}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-green-100">
          Last optimized: {new Date(performanceMetrics?.overall.lastOptimized).toLocaleString()} • 
          {implementedOptimizations}/{totalOptimizations} optimizations applied
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {performanceMetrics && Object.entries(performanceMetrics.coreWebVitals).map(([key, metric]) => (
            <div key={key} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={metric.status === 'good' ? '#10B981' : metric.status === 'needs-improvement' ? '#F59E0B' : '#EF4444'}
                    strokeWidth="3"
                    strokeDasharray={`${(metric.value / metric.threshold) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                    {key === 'cls' ? metric.value.toFixed(2) : 
                     key.includes('time') || key === 'ttfb' ? `${metric.value}ms` : 
                     `${metric.value}s`}
                  </span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 uppercase text-xs tracking-wide">{key}</h4>
              <p className={`text-xs mt-1 ${getStatusColor(metric.status)}`}>
                {metric.status.replace('-', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Resources</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">CPU Usage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      performanceMetrics?.system.cpu.usage > 80 ? 'bg-red-500' :
                      performanceMetrics?.system.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${performanceMetrics?.system.cpu.usage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {performanceMetrics?.system.cpu.usage}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MemoryStick className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Memory Usage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      performanceMetrics?.system.memory.percentage > 80 ? 'bg-red-500' :
                      performanceMetrics?.system.memory.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${performanceMetrics?.system.memory.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {performanceMetrics?.system.memory.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HardDrive className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Disk Usage</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      performanceMetrics?.system.disk.percentage > 80 ? 'bg-red-500' :
                      performanceMetrics?.system.disk.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${performanceMetrics?.system.disk.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">
                  {performanceMetrics?.system.disk.percentage}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Network className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">Network Latency</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${
                  performanceMetrics?.system.network.latency > 50 ? 'text-red-600' :
                  performanceMetrics?.system.network.latency > 25 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {performanceMetrics?.system.network.latency}ms
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Bundle Size</span>
              <span className="font-medium text-gray-900">
                {formatBytes(performanceMetrics?.application.bundleSize.total * 1024 * 1024)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Load Time</span>
              <span className="font-medium text-gray-900">
                {formatTime(performanceMetrics?.application.loadTime.complete)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Cache Hit Rate</span>
              <span className="font-medium text-green-600">
                {performanceMetrics?.application.cacheHitRate}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">API Response Time</span>
              <span className="font-medium text-gray-900">
                {performanceMetrics?.application.apiResponseTime}ms
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Error Rate</span>
              <span className={`font-medium ${
                performanceMetrics?.application.errorRate > 1 ? 'text-red-600' : 'text-green-600'
              }`}>
                {performanceMetrics?.application.errorRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Optimization Suggestions</h3>
        <div className="space-y-4">
          {optimizationSuggestions.map(suggestion => (
            <div key={suggestion.id} className={`border rounded-lg p-4 ${
              suggestion.implemented ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                    {suggestion.implemented && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Impact: {suggestion.impact}</span>
                    <span>Effort: {suggestion.effort}</span>
                    <span>Savings: {suggestion.savings.size} / {suggestion.savings.time}</span>
                  </div>
                </div>

                <div className="ml-4">
                  {!suggestion.implemented ? (
                    <button
                      onClick={() => handleOptimization(suggestion.id)}
                      disabled={isOptimizing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isOptimizing ? 'Optimizing...' : 'Apply'}
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                      Applied
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Experience</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Page Views</span>
              <span className="font-medium">{performanceMetrics?.userExperience.pageViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bounce Rate</span>
              <span className="font-medium">{performanceMetrics?.userExperience.bounceRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Session Duration</span>
              <span className="font-medium">{performanceMetrics?.userExperience.sessionDuration} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-medium text-green-600">{performanceMetrics?.userExperience.conversionRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Optimization</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Components</span>
              <span className="font-medium">
                {performanceMetrics?.resources.components.optimized}/{performanceMetrics?.resources.components.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Images</span>
              <span className="font-medium">
                {performanceMetrics?.resources.images.optimized}/{performanceMetrics?.resources.images.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fonts</span>
              <span className="font-medium">
                {performanceMetrics?.resources.fonts.optimized}/{performanceMetrics?.resources.fonts.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Scripts</span>
              <span className="font-medium">
                {performanceMetrics?.resources.scripts.compressed}/{performanceMetrics?.resources.scripts.total}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">SSL Score</span>
              <span className="font-medium text-green-600">{performanceMetrics?.security.sslScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Security Headers</span>
              <span className="font-medium">{performanceMetrics?.security.securityHeaders}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Vulnerabilities</span>
              <span className="font-medium text-green-600">{performanceMetrics?.security.vulnerabilities}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Encryption</span>
              <span className="font-medium">{performanceMetrics?.security.encryptionStrength}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizer;
