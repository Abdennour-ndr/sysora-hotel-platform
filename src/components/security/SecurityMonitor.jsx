import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Activity,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Wifi,
  WifiOff,
  User,
  Users,
  Key,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  Bell,
  BellOff,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Database,
  Server,
  Network,
  Cpu
} from 'lucide-react';

const SecurityMonitor = () => {
  const [securityData, setSecurityData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedAlertType, setSelectedAlertType] = useState('all');
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadSecurityData();
    if (isMonitoring) {
      startSecurityMonitoring();
    }
    return () => stopSecurityMonitoring();
  }, [isMonitoring, selectedTimeframe]);

  const startSecurityMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateSecurityData();
    }, 10000); // Update every 10 seconds
  };

  const stopSecurityMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      // Load security overview data
      const securityOverview = {
        threatLevel: 'low',
        activeThreats: 2,
        blockedAttempts: 47,
        activeSessions: 8,
        failedLogins: 12,
        suspiciousActivity: 3,
        systemHealth: 98.5,
        lastScan: '2024-12-15T11:30:00Z',
        uptime: 99.9,
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 8
        },
        securityScore: 87.5,
        complianceStatus: 'compliant'
      };

      // Load security alerts
      const alertsData = [
        {
          id: 'alert-001',
          type: 'failed_login',
          severity: 'medium',
          title: 'Multiple Failed Login Attempts',
          description: 'User youssef.brahimi@hotel.com has 5 consecutive failed login attempts',
          timestamp: '2024-12-15T11:45:00Z',
          source: 'Authentication System',
          ipAddress: '192.168.1.105',
          location: 'Algiers, Algeria',
          status: 'active',
          actions: ['lock_account', 'notify_admin']
        },
        {
          id: 'alert-002',
          type: 'suspicious_activity',
          severity: 'high',
          title: 'Unusual Access Pattern',
          description: 'Admin account accessed from new location outside business hours',
          timestamp: '2024-12-15T02:30:00Z',
          source: 'Access Control',
          ipAddress: '203.45.67.89',
          location: 'Unknown Location',
          status: 'investigating',
          actions: ['verify_identity', 'monitor_session']
        },
        {
          id: 'alert-003',
          type: 'permission_escalation',
          severity: 'critical',
          title: 'Unauthorized Permission Change',
          description: 'Attempt to modify system permissions without proper authorization',
          timestamp: '2024-12-15T10:15:00Z',
          source: 'Permission System',
          ipAddress: '192.168.1.87',
          location: 'Algiers, Algeria',
          status: 'blocked',
          actions: ['block_action', 'audit_user']
        },
        {
          id: 'alert-004',
          type: 'data_access',
          severity: 'low',
          title: 'Bulk Data Export',
          description: 'Large amount of customer data exported by marketing team',
          timestamp: '2024-12-15T09:20:00Z',
          source: 'Data Access Monitor',
          ipAddress: '192.168.1.45',
          location: 'Algiers, Algeria',
          status: 'resolved',
          actions: ['log_activity', 'notify_supervisor']
        },
        {
          id: 'alert-005',
          type: 'system_vulnerability',
          severity: 'medium',
          title: 'Security Update Available',
          description: 'New security patch available for payment processing module',
          timestamp: '2024-12-15T08:00:00Z',
          source: 'Vulnerability Scanner',
          ipAddress: 'system',
          location: 'System',
          status: 'pending',
          actions: ['schedule_update', 'test_patch']
        }
      ];

      // Load active sessions
      const sessionsData = [
        {
          id: 'session-001',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          role: 'Hotel Manager',
          ipAddress: '192.168.1.100',
          location: 'Algiers, Algeria',
          device: 'Windows Desktop',
          browser: 'Chrome 120.0',
          loginTime: '2024-12-15T08:30:00Z',
          lastActivity: '2024-12-15T11:45:00Z',
          status: 'active',
          riskLevel: 'low'
        },
        {
          id: 'session-002',
          userId: 'user-002',
          userName: 'Fatima Zahra',
          role: 'Front Desk Manager',
          ipAddress: '192.168.1.102',
          location: 'Algiers, Algeria',
          device: 'iPad',
          browser: 'Safari 17.0',
          loginTime: '2024-12-15T09:15:00Z',
          lastActivity: '2024-12-15T11:40:00Z',
          status: 'active',
          riskLevel: 'low'
        },
        {
          id: 'session-003',
          userId: 'user-006',
          userName: 'Leila Mansouri',
          role: 'Marketing Specialist',
          ipAddress: '192.168.1.45',
          location: 'Algiers, Algeria',
          device: 'MacBook Pro',
          browser: 'Chrome 120.0',
          loginTime: '2024-12-15T10:00:00Z',
          lastActivity: '2024-12-15T11:30:00Z',
          status: 'active',
          riskLevel: 'low'
        },
        {
          id: 'session-004',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          role: 'Hotel Manager',
          ipAddress: '203.45.67.89',
          location: 'Unknown Location',
          device: 'Android Phone',
          browser: 'Chrome Mobile',
          loginTime: '2024-12-15T02:30:00Z',
          lastActivity: '2024-12-15T02:45:00Z',
          status: 'suspicious',
          riskLevel: 'high'
        }
      ];

      // Load audit logs
      const auditData = [
        {
          id: 'audit-001',
          action: 'user_login',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          description: 'Successful login from desktop',
          timestamp: '2024-12-15T08:30:00Z',
          ipAddress: '192.168.1.100',
          result: 'success',
          riskLevel: 'low'
        },
        {
          id: 'audit-002',
          action: 'permission_change',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          description: 'Modified user permissions for user-006',
          timestamp: '2024-12-15T10:15:00Z',
          ipAddress: '192.168.1.100',
          result: 'success',
          riskLevel: 'medium'
        },
        {
          id: 'audit-003',
          action: 'data_export',
          userId: 'user-006',
          userName: 'Leila Mansouri',
          description: 'Exported customer analytics report',
          timestamp: '2024-12-15T09:20:00Z',
          ipAddress: '192.168.1.45',
          result: 'success',
          riskLevel: 'low'
        },
        {
          id: 'audit-004',
          action: 'failed_login',
          userId: 'user-005',
          userName: 'Youssef Brahimi',
          description: 'Failed login attempt - incorrect password',
          timestamp: '2024-12-15T11:45:00Z',
          ipAddress: '192.168.1.105',
          result: 'failed',
          riskLevel: 'medium'
        },
        {
          id: 'audit-005',
          action: 'system_access',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          description: 'Accessed system settings',
          timestamp: '2024-12-15T11:00:00Z',
          ipAddress: '203.45.67.89',
          result: 'success',
          riskLevel: 'high'
        }
      ];

      setSecurityData(securityOverview);
      setAlerts(alertsData);
      setActiveSessions(sessionsData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSecurityData = async () => {
    try {
      // Simulate real-time updates
      setSecurityData(prev => ({
        ...prev,
        activeSessions: Math.floor(Math.random() * 5) + 6,
        failedLogins: prev.failedLogins + Math.floor(Math.random() * 2),
        lastScan: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error updating security data:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
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

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('android') || device.toLowerCase().includes('iphone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
      return <Monitor className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAlertAction = async (alertId, action) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === 'resolve' ? 'resolved' : 'investigating' }
          : alert
      ));
      window.showToast && window.showToast(`Alert ${action}d successfully`, 'success');
    } catch (error) {
      console.error('Error handling alert action:', error);
      window.showToast && window.showToast('Failed to update alert', 'error');
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      if (action === 'terminate') {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
        window.showToast && window.showToast('Session terminated successfully', 'success');
      }
    } catch (error) {
      console.error('Error handling session action:', error);
      window.showToast && window.showToast('Failed to terminate session', 'error');
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    selectedAlertType === 'all' || alert.type === selectedAlertType
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading security monitor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Security Monitor</h2>
              <p className="text-red-100">Real-time security monitoring and threat detection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(securityData?.threatLevel)} animate-pulse`}></div>
              <span className="text-sm capitalize">{securityData?.threatLevel} Threat Level</span>
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`p-2 rounded-lg transition-colors ${
                isMonitoring 
                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isMonitoring ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={loadSecurityData}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {securityData && (
          <div className="mt-4 text-sm text-red-100">
            Last security scan: {formatDate(securityData.lastScan)} • System uptime: {securityData.uptime}%
          </div>
        )}
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-red-600 font-medium">ACTIVE THREATS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-900">{securityData?.activeThreats || 0}</div>
            <div className="text-sm text-red-700">
              {securityData?.blockedAttempts || 0} blocked attempts
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-medium">ACTIVE SESSIONS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-900">{securityData?.activeSessions || 0}</div>
            <div className="text-sm text-orange-700">
              {activeSessions.filter(s => s.riskLevel === 'high').length} high risk
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-yellow-600 font-medium">FAILED LOGINS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-900">{securityData?.failedLogins || 0}</div>
            <div className="text-sm text-yellow-700">
              {securityData?.suspiciousActivity || 0} suspicious activities
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">SECURITY SCORE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">{securityData?.securityScore || 0}%</div>
            <div className="text-sm text-green-700 capitalize">
              {securityData?.complianceStatus || 'unknown'} status
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Security Alerts ({filteredAlerts.length})
            </h3>
            <div className="flex items-center space-x-3">
              <select
                value={selectedAlertType}
                onChange={(e) => setSelectedAlertType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="failed_login">Failed Login</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="permission_escalation">Permission Escalation</option>
                <option value="data_access">Data Access</option>
                <option value="system_vulnerability">System Vulnerability</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAlerts.slice(0, 5).map(alert => (
            <div key={alert.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                        alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(alert.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>{alert.ipAddress}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'investigate')}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'resolve')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Resolve
                      </button>
                    </>
                  )}
                  {alert.status === 'investigating' && (
                    <button
                      onClick={() => handleAlertAction(alert.id, 'resolve')}
                      className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Security Alerts</h3>
            <p className="text-gray-600">All systems are secure and functioning normally.</p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Sessions ({activeSessions.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Device</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Login Time</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Risk Level</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeSessions.map(session => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{session.userName}</p>
                      <p className="text-sm text-gray-600">{session.role}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(session.device)}
                      <div>
                        <p className="text-sm text-gray-900">{session.device}</p>
                        <p className="text-xs text-gray-600">{session.browser}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{session.location}</p>
                      <p className="text-xs text-gray-600">{session.ipAddress}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(session.loginTime)}</p>
                      <p className="text-xs text-gray-600">Last: {formatDate(session.lastActivity)}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      session.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {session.riskLevel} risk
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSessionAction(session.id, 'view')}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSessionAction(session.id, 'terminate')}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Terminate Session"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitor;
