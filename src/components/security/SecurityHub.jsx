import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users,
  Key,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
  Globe,
  Database,
  Wifi,
  Monitor,
  Smartphone,
  RefreshCw,
  Download,
  Bell,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';

import UserManagement from './UserManagement';
import PermissionsManager from './PermissionsManager';
import SecurityMonitor from './SecurityMonitor';
import AuditLogger from './AuditLogger';

const SecurityHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityOverview, setSecurityOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityOverview();
  }, []);

  const loadSecurityOverview = async () => {
    setLoading(true);
    try {
      // Load comprehensive security overview
      const overview = {
        securityScore: 87.5,
        threatLevel: 'low',
        complianceStatus: 'compliant',
        lastSecurityScan: '2024-12-15T11:30:00Z',
        
        // User Statistics
        userStats: {
          totalUsers: 6,
          activeUsers: 4,
          lockedUsers: 1,
          inactiveUsers: 1,
          adminUsers: 1,
          twoFactorEnabled: 3,
          twoFactorCoverage: 50
        },
        
        // Permission Statistics
        permissionStats: {
          totalRoles: 6,
          customRoles: 1,
          systemRoles: 5,
          totalPermissions: 35,
          highRiskPermissions: 8,
          criticalPermissions: 4
        },
        
        // Security Events
        securityEvents: {
          totalAlerts: 5,
          activeAlerts: 2,
          resolvedAlerts: 3,
          criticalAlerts: 1,
          highRiskEvents: 3,
          blockedAttempts: 47,
          failedLogins: 12
        },
        
        // Audit Statistics
        auditStats: {
          totalLogs: 10,
          todayLogs: 8,
          successfulActions: 7,
          failedActions: 2,
          blockedActions: 1,
          highRiskActions: 3
        },
        
        // System Health
        systemHealth: {
          uptime: 99.9,
          systemLoad: 65,
          memoryUsage: 72,
          diskUsage: 45,
          networkLatency: 12,
          errorRate: 0.8
        },
        
        // Compliance Metrics
        compliance: {
          passwordPolicy: 'strong',
          sessionTimeout: 30,
          encryptionStatus: 'enabled',
          backupStatus: 'automated',
          updateStatus: 'current',
          vulnerabilityScore: 92
        },
        
        // Recent Activities
        recentActivities: [
          {
            id: 1,
            type: 'security_scan',
            title: 'Security Scan Completed',
            description: 'Automated security scan completed with no critical issues',
            timestamp: '2024-12-15T11:30:00Z',
            severity: 'info'
          },
          {
            id: 2,
            type: 'user_locked',
            title: 'User Account Locked',
            description: 'User account locked due to multiple failed login attempts',
            timestamp: '2024-12-15T11:00:00Z',
            severity: 'warning'
          },
          {
            id: 3,
            type: 'permission_change',
            title: 'Permissions Modified',
            description: 'User permissions updated for Marketing Specialist role',
            timestamp: '2024-12-15T10:30:00Z',
            severity: 'info'
          },
          {
            id: 4,
            type: 'unauthorized_access',
            title: 'Unauthorized Access Blocked',
            description: 'Blocked unauthorized access attempt to admin panel',
            timestamp: '2024-12-15T10:00:00Z',
            severity: 'critical'
          },
          {
            id: 5,
            type: 'backup_completed',
            title: 'Backup Completed',
            description: 'Daily automated backup completed successfully',
            timestamp: '2024-12-15T09:30:00Z',
            severity: 'success'
          }
        ],
        
        // Security Recommendations
        recommendations: [
          {
            id: 1,
            priority: 'high',
            title: 'Enable Two-Factor Authentication',
            description: 'Only 50% of users have 2FA enabled. Consider enforcing 2FA for all users.',
            action: 'Configure 2FA policy',
            impact: 'Significantly improves account security'
          },
          {
            id: 2,
            priority: 'medium',
            title: 'Review User Permissions',
            description: 'Some users have permissions that may not be necessary for their roles.',
            action: 'Audit user permissions',
            impact: 'Reduces security risk from over-privileged accounts'
          },
          {
            id: 3,
            priority: 'medium',
            title: 'Update Security Policies',
            description: 'Security policies should be reviewed and updated quarterly.',
            action: 'Schedule policy review',
            impact: 'Ensures compliance with latest security standards'
          },
          {
            id: 4,
            priority: 'low',
            title: 'Security Training',
            description: 'Consider providing security awareness training for all users.',
            action: 'Plan training sessions',
            impact: 'Improves overall security awareness'
          }
        ]
      };

      setSecurityOverview(overview);
    } catch (error) {
      console.error('Error loading security overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Security Overview', icon: Shield },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'permissions', name: 'Permissions', icon: Key },
    { id: 'monitoring', name: 'Security Monitor', icon: Activity },
    { id: 'audit', name: 'Audit Logs', icon: FileText }
  ];

  const getSecurityScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
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
            <p className="text-gray-600">Loading security hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Security & Access Control Hub</h2>
              <p className="text-indigo-100">Comprehensive security management and monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(securityOverview?.threatLevel)} animate-pulse`}></div>
              <span className="text-sm capitalize">{securityOverview?.threatLevel} Threat Level</span>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSecurityScoreBg(securityOverview?.securityScore)} ${getSecurityScoreColor(securityOverview?.securityScore)}`}>
              {securityOverview?.securityScore}% Security Score
            </div>
            
            <button 
              onClick={loadSecurityOverview}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {securityOverview && (
          <div className="mt-4 text-sm text-indigo-100">
            Last security scan: {formatDate(securityOverview.lastSecurityScan)} • Status: {securityOverview.complianceStatus}
          </div>
        )}
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
          {activeTab === 'overview' && securityOverview && (
            <div className="space-y-6">
              {/* Security Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">USERS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-900">{securityOverview.userStats.totalUsers}</div>
                    <div className="text-sm text-blue-700">
                      {securityOverview.userStats.activeUsers} active, {securityOverview.userStats.lockedUsers} locked
                    </div>
                    <div className="text-xs text-blue-600">
                      {securityOverview.userStats.twoFactorCoverage}% have 2FA
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">PERMISSIONS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-900">{securityOverview.permissionStats.totalPermissions}</div>
                    <div className="text-sm text-purple-700">
                      {securityOverview.permissionStats.totalRoles} roles configured
                    </div>
                    <div className="text-xs text-purple-600">
                      {securityOverview.permissionStats.criticalPermissions} critical permissions
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-red-600 font-medium">ALERTS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-900">{securityOverview.securityEvents.activeAlerts}</div>
                    <div className="text-sm text-red-700">
                      {securityOverview.securityEvents.totalAlerts} total alerts
                    </div>
                    <div className="text-xs text-red-600">
                      {securityOverview.securityEvents.criticalAlerts} critical
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">AUDIT LOGS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-900">{securityOverview.auditStats.todayLogs}</div>
                    <div className="text-sm text-green-700">
                      {securityOverview.auditStats.totalLogs} total logs
                    </div>
                    <div className="text-xs text-green-600">
                      {securityOverview.auditStats.successfulActions} successful actions
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities and Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Security Activities */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Activities</h3>
                  <div className="space-y-4">
                    {securityOverview.recentActivities.slice(0, 5).map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getSeverityIcon(activity.severity)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <span className="text-xs text-gray-500 mt-2 block">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Recommendations */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
                  <div className="space-y-4">
                    {securityOverview.recommendations.slice(0, 4).map(recommendation => (
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
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            {recommendation.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Health and Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">System Uptime</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${securityOverview.systemHealth.uptime}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-green-600">{securityOverview.systemHealth.uptime}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">System Load</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              securityOverview.systemHealth.systemLoad > 80 ? 'bg-red-500' :
                              securityOverview.systemHealth.systemLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${securityOverview.systemHealth.systemLoad}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{securityOverview.systemHealth.systemLoad}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Memory Usage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              securityOverview.systemHealth.memoryUsage > 80 ? 'bg-red-500' :
                              securityOverview.systemHealth.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${securityOverview.systemHealth.memoryUsage}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{securityOverview.systemHealth.memoryUsage}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Error Rate</span>
                      <span className={`font-medium ${securityOverview.systemHealth.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                        {securityOverview.systemHealth.errorRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Password Policy</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium capitalize">
                        {securityOverview.compliance.passwordPolicy}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Session Timeout</span>
                      <span className="font-medium text-gray-900">
                        {securityOverview.compliance.sessionTimeout} minutes
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Encryption</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium capitalize">
                        {securityOverview.compliance.encryptionStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Backup Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium capitalize">
                        {securityOverview.compliance.backupStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vulnerability Score</span>
                      <span className="font-medium text-green-600">
                        {securityOverview.compliance.vulnerabilityScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'permissions' && <PermissionsManager />}
          {activeTab === 'monitoring' && <SecurityMonitor />}
          {activeTab === 'audit' && <AuditLogger />}
        </div>
      </div>
    </div>
  );
};

export default SecurityHub;
