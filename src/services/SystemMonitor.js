// System Monitor - Comprehensive monitoring and diagnostics for the reservation system
class SystemMonitor {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    this.metrics = new Map();
    this.alerts = [];
    this.performanceData = [];
    this.healthChecks = new Map();
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  // Initialize system monitoring
  async initialize() {
    console.log('📊 Initializing System Monitor...');
    
    try {
      await this.setupHealthChecks();
      await this.startPerformanceMonitoring();
      await this.initializeMetrics();
      
      this.isMonitoring = true;
      console.log('✅ System Monitor initialized successfully');
      
      return { success: true, message: 'System monitoring started' };
    } catch (error) {
      console.error('❌ Failed to initialize system monitor:', error);
      return { success: false, message: error.message };
    }
  }

  // Setup health checks
  async setupHealthChecks() {
    const healthChecks = [
      {
        id: 'database_connection',
        name: 'Database Connection',
        type: 'critical',
        endpoint: '/api/health/database',
        interval: 30000, // 30 seconds
        timeout: 5000,
        expectedStatus: 200
      },
      {
        id: 'api_response_time',
        name: 'API Response Time',
        type: 'performance',
        endpoint: '/api/health/ping',
        interval: 15000, // 15 seconds
        timeout: 3000,
        maxResponseTime: 1000
      },
      {
        id: 'memory_usage',
        name: 'Memory Usage',
        type: 'resource',
        check: this.checkMemoryUsage.bind(this),
        interval: 60000, // 1 minute
        threshold: 80 // 80% memory usage
      },
      {
        id: 'error_rate',
        name: 'Error Rate',
        type: 'quality',
        check: this.checkErrorRate.bind(this),
        interval: 300000, // 5 minutes
        threshold: 5 // 5% error rate
      },
      {
        id: 'automation_engine',
        name: 'Automation Engine',
        type: 'service',
        check: this.checkAutomationEngine.bind(this),
        interval: 120000, // 2 minutes
        expectedStatus: 'running'
      },
      {
        id: 'integration_hub',
        name: 'Integration Hub',
        type: 'service',
        check: this.checkIntegrationHub.bind(this),
        interval: 180000, // 3 minutes
        expectedStatus: 'connected'
      }
    ];

    healthChecks.forEach(check => {
      this.healthChecks.set(check.id, {
        ...check,
        status: 'unknown',
        lastCheck: null,
        lastResult: null,
        history: []
      });
      
      // Start periodic health check
      this.scheduleHealthCheck(check);
    });

    console.log(`🏥 Setup ${healthChecks.length} health checks`);
  }

  // Schedule health check
  scheduleHealthCheck(check) {
    const interval = setInterval(async () => {
      await this.performHealthCheck(check.id);
    }, check.interval);

    // Store interval for cleanup
    check.intervalId = interval;
    
    // Perform initial check
    setTimeout(() => this.performHealthCheck(check.id), 1000);
  }

  // Perform health check
  async performHealthCheck(checkId) {
    const check = this.healthChecks.get(checkId);
    if (!check) return;

    const startTime = Date.now();
    let result = {
      status: 'unknown',
      responseTime: 0,
      message: '',
      timestamp: new Date(),
      details: {}
    };

    try {
      if (check.endpoint) {
        // HTTP endpoint check
        result = await this.performHttpCheck(check);
      } else if (check.check) {
        // Custom check function
        result = await check.check();
      }

      result.responseTime = Date.now() - startTime;
      
      // Update check status
      check.status = result.status;
      check.lastCheck = new Date();
      check.lastResult = result;
      
      // Add to history (keep last 100 results)
      check.history.push(result);
      if (check.history.length > 100) {
        check.history.shift();
      }

      // Check for alerts
      this.checkForAlerts(check, result);

    } catch (error) {
      result = {
        status: 'error',
        responseTime: Date.now() - startTime,
        message: error.message,
        timestamp: new Date(),
        details: { error: error.toString() }
      };
      
      check.status = 'error';
      check.lastResult = result;
      
      this.createAlert('error', `Health check failed: ${check.name}`, error.message);
    }

    console.log(`🏥 Health check ${check.name}: ${result.status} (${result.responseTime}ms)`);
  }

  // Perform HTTP health check
  async performHttpCheck(check) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), check.timeout);

    try {
      const response = await fetch(`${this.apiBase}${check.endpoint}`, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sysora_token')}`
        }
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now();
      let status = 'healthy';
      let message = 'OK';

      if (response.status !== (check.expectedStatus || 200)) {
        status = 'unhealthy';
        message = `HTTP ${response.status}`;
      } else if (check.maxResponseTime && responseTime > check.maxResponseTime) {
        status = 'warning';
        message = `Slow response: ${responseTime}ms`;
      }

      return {
        status,
        message,
        timestamp: new Date(),
        details: {
          httpStatus: response.status,
          responseTime
        }
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Check memory usage
  async checkMemoryUsage() {
    try {
      const memInfo = performance.memory || {};
      const usedMemory = memInfo.usedJSHeapSize || 0;
      const totalMemory = memInfo.totalJSHeapSize || 0;
      const memoryUsage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

      let status = 'healthy';
      let message = `Memory usage: ${memoryUsage.toFixed(1)}%`;

      if (memoryUsage > 90) {
        status = 'critical';
        message = `Critical memory usage: ${memoryUsage.toFixed(1)}%`;
      } else if (memoryUsage > 80) {
        status = 'warning';
        message = `High memory usage: ${memoryUsage.toFixed(1)}%`;
      }

      return {
        status,
        message,
        timestamp: new Date(),
        details: {
          usedMemory: Math.round(usedMemory / 1024 / 1024), // MB
          totalMemory: Math.round(totalMemory / 1024 / 1024), // MB
          memoryUsage: memoryUsage.toFixed(1)
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Unable to check memory usage',
        timestamp: new Date(),
        details: { error: error.message }
      };
    }
  }

  // Check error rate
  async checkErrorRate() {
    try {
      // Get error metrics from the last hour
      const errorMetrics = this.getMetrics('errors', 3600000); // 1 hour
      const totalRequests = this.getMetrics('requests', 3600000);
      
      const errorRate = totalRequests > 0 ? (errorMetrics / totalRequests) * 100 : 0;

      let status = 'healthy';
      let message = `Error rate: ${errorRate.toFixed(2)}%`;

      if (errorRate > 10) {
        status = 'critical';
        message = `Critical error rate: ${errorRate.toFixed(2)}%`;
      } else if (errorRate > 5) {
        status = 'warning';
        message = `High error rate: ${errorRate.toFixed(2)}%`;
      }

      return {
        status,
        message,
        timestamp: new Date(),
        details: {
          errorCount: errorMetrics,
          totalRequests,
          errorRate: errorRate.toFixed(2)
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Unable to check error rate',
        timestamp: new Date(),
        details: { error: error.message }
      };
    }
  }

  // Check automation engine
  async checkAutomationEngine() {
    try {
      // Check if automation engine is imported and running
      const automationEngine = window.automationEngine || null;
      
      if (!automationEngine) {
        return {
          status: 'error',
          message: 'Automation engine not found',
          timestamp: new Date(),
          details: { available: false }
        };
      }

      const status = automationEngine.getStatus ? automationEngine.getStatus() : { isRunning: false };
      
      return {
        status: status.isRunning ? 'healthy' : 'warning',
        message: status.isRunning ? 'Automation engine running' : 'Automation engine stopped',
        timestamp: new Date(),
        details: status
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error checking automation engine',
        timestamp: new Date(),
        details: { error: error.message }
      };
    }
  }

  // Check integration hub
  async checkIntegrationHub() {
    try {
      // Check if integration hub is available
      const integrationHub = window.integrationHub || null;
      
      if (!integrationHub) {
        return {
          status: 'error',
          message: 'Integration hub not found',
          timestamp: new Date(),
          details: { available: false }
        };
      }

      const status = integrationHub.getIntegrationStatus ? integrationHub.getIntegrationStatus() : { connected: 0 };
      
      return {
        status: status.connected > 0 ? 'healthy' : 'warning',
        message: `${status.connected} integrations connected`,
        timestamp: new Date(),
        details: status
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error checking integration hub',
        timestamp: new Date(),
        details: { error: error.message }
      };
    }
  }

  // Check for alerts
  checkForAlerts(check, result) {
    if (result.status === 'critical' || result.status === 'error') {
      this.createAlert('critical', `${check.name} is ${result.status}`, result.message);
    } else if (result.status === 'warning') {
      this.createAlert('warning', `${check.name} warning`, result.message);
    }
  }

  // Create alert
  createAlert(level, title, message) {
    const alert = {
      id: Date.now().toString(),
      level,
      title,
      message,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.pop();
    }

    // Show toast notification for critical alerts
    if (level === 'critical' && window.showToast) {
      window.showToast(`${title}: ${message}`, 'error');
    }

    console.log(`🚨 Alert [${level.toUpperCase()}]: ${title} - ${message}`);
  }

  // Start performance monitoring
  async startPerformanceMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000); // Collect every 30 seconds

    console.log('📈 Performance monitoring started');
  }

  // Collect performance metrics
  collectPerformanceMetrics() {
    try {
      const now = Date.now();
      const memInfo = performance.memory || {};
      
      const metrics = {
        timestamp: now,
        memory: {
          used: memInfo.usedJSHeapSize || 0,
          total: memInfo.totalJSHeapSize || 0,
          limit: memInfo.jsHeapSizeLimit || 0
        },
        timing: {
          domContentLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart || 0,
          loadComplete: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0
        },
        navigation: {
          type: performance.navigation?.type || 0,
          redirectCount: performance.navigation?.redirectCount || 0
        }
      };

      this.performanceData.push(metrics);
      
      // Keep only last 1000 data points (about 8 hours at 30s intervals)
      if (this.performanceData.length > 1000) {
        this.performanceData.shift();
      }

      // Update metrics
      this.updateMetric('memory_usage', metrics.memory.used);
      this.updateMetric('memory_total', metrics.memory.total);
      
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  }

  // Initialize metrics
  async initializeMetrics() {
    const metricTypes = [
      'requests',
      'errors',
      'response_time',
      'memory_usage',
      'memory_total',
      'active_users',
      'reservations_created',
      'payments_processed'
    ];

    metricTypes.forEach(type => {
      this.metrics.set(type, []);
    });

    console.log('📊 Metrics initialized');
  }

  // Update metric
  updateMetric(type, value) {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }

    const metric = {
      timestamp: Date.now(),
      value
    };

    this.metrics.get(type).push(metric);
    
    // Keep only last 1000 data points
    const metrics = this.metrics.get(type);
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  // Get metrics
  getMetrics(type, timeRange = null) {
    const metrics = this.metrics.get(type) || [];
    
    if (!timeRange) {
      return metrics;
    }

    const cutoff = Date.now() - timeRange;
    return metrics.filter(metric => metric.timestamp >= cutoff);
  }

  // Get system status
  getSystemStatus() {
    const healthChecks = Array.from(this.healthChecks.values());
    const criticalIssues = healthChecks.filter(check => check.status === 'critical' || check.status === 'error').length;
    const warnings = healthChecks.filter(check => check.status === 'warning').length;
    const healthy = healthChecks.filter(check => check.status === 'healthy').length;

    let overallStatus = 'healthy';
    if (criticalIssues > 0) {
      overallStatus = 'critical';
    } else if (warnings > 0) {
      overallStatus = 'warning';
    }

    return {
      overall: overallStatus,
      checks: {
        total: healthChecks.length,
        healthy,
        warnings,
        critical: criticalIssues
      },
      alerts: {
        total: this.alerts.length,
        unacknowledged: this.alerts.filter(alert => !alert.acknowledged).length
      },
      uptime: this.getUptime(),
      lastUpdate: new Date()
    };
  }

  // Get uptime
  getUptime() {
    if (!this.isMonitoring) return 0;
    
    // Calculate uptime based on when monitoring started
    const startTime = this.performanceData.length > 0 ? this.performanceData[0].timestamp : Date.now();
    return Date.now() - startTime;
  }

  // Get all health checks
  getAllHealthChecks() {
    return Array.from(this.healthChecks.values());
  }

  // Get all alerts
  getAllAlerts() {
    return this.alerts;
  }

  // Acknowledge alert
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
    }
  }

  // Get performance data
  getPerformanceData(timeRange = null) {
    if (!timeRange) {
      return this.performanceData;
    }

    const cutoff = Date.now() - timeRange;
    return this.performanceData.filter(data => data.timestamp >= cutoff);
  }

  // Stop monitoring
  stop() {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    // Clear health check intervals
    this.healthChecks.forEach(check => {
      if (check.intervalId) {
        clearInterval(check.intervalId);
      }
    });

    console.log('🛑 System monitoring stopped');
  }

  // Generate system report
  generateSystemReport() {
    const status = this.getSystemStatus();
    const healthChecks = this.getAllHealthChecks();
    const recentAlerts = this.alerts.slice(0, 10);
    const performanceData = this.getPerformanceData(3600000); // Last hour

    return {
      generatedAt: new Date(),
      systemStatus: status,
      healthChecks: healthChecks.map(check => ({
        name: check.name,
        type: check.type,
        status: check.status,
        lastCheck: check.lastCheck,
        responseTime: check.lastResult?.responseTime || 0,
        message: check.lastResult?.message || ''
      })),
      recentAlerts,
      performance: {
        dataPoints: performanceData.length,
        averageMemoryUsage: this.calculateAverageMemoryUsage(performanceData),
        peakMemoryUsage: this.calculatePeakMemoryUsage(performanceData)
      },
      recommendations: this.generateRecommendations(status, healthChecks)
    };
  }

  // Calculate average memory usage
  calculateAverageMemoryUsage(data) {
    if (data.length === 0) return 0;
    
    const total = data.reduce((sum, point) => sum + point.memory.used, 0);
    return Math.round(total / data.length / 1024 / 1024); // MB
  }

  // Calculate peak memory usage
  calculatePeakMemoryUsage(data) {
    if (data.length === 0) return 0;
    
    const peak = Math.max(...data.map(point => point.memory.used));
    return Math.round(peak / 1024 / 1024); // MB
  }

  // Generate recommendations
  generateRecommendations(status, healthChecks) {
    const recommendations = [];

    if (status.checks.critical > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Critical Issues Detected',
        description: 'Address critical system issues immediately to prevent service disruption.'
      });
    }

    if (status.checks.warnings > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Performance Warnings',
        description: 'Monitor and optimize system performance to prevent future issues.'
      });
    }

    const memoryCheck = healthChecks.find(check => check.id === 'memory_usage');
    if (memoryCheck && memoryCheck.lastResult?.details?.memoryUsage > 70) {
      recommendations.push({
        priority: 'medium',
        title: 'High Memory Usage',
        description: 'Consider optimizing memory usage or increasing available memory.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        title: 'System Running Optimally',
        description: 'All systems are functioning normally. Continue regular monitoring.'
      });
    }

    return recommendations;
  }
}

// Create singleton instance
const systemMonitor = new SystemMonitor();

export default systemMonitor;
