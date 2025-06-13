import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Database,
  Key,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Globe,
  MapPin,
  Monitor,
  Smartphone
} from 'lucide-react';

const AuditLogger = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedResult, setSelectedResult] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [auditStats, setAuditStats] = useState(null);

  useEffect(() => {
    loadAuditData();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, selectedAction, selectedUser, selectedResult, selectedRisk, dateRange]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      // Load comprehensive audit logs
      const logsData = [
        {
          id: 'audit-001',
          timestamp: '2024-12-15T11:45:00Z',
          action: 'user_login',
          category: 'authentication',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          userRole: 'Hotel Manager',
          description: 'Successful login from desktop application',
          ipAddress: '192.168.1.100',
          location: 'Algiers, Algeria',
          device: 'Windows Desktop',
          browser: 'Chrome 120.0',
          result: 'success',
          riskLevel: 'low',
          sessionId: 'session-001',
          details: {
            loginMethod: 'password',
            twoFactorUsed: true,
            previousLogin: '2024-12-14T18:30:00Z'
          }
        },
        {
          id: 'audit-002',
          timestamp: '2024-12-15T11:30:00Z',
          action: 'permission_change',
          category: 'authorization',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          userRole: 'Hotel Manager',
          description: 'Modified user permissions for Marketing Specialist role',
          ipAddress: '192.168.1.100',
          location: 'Algiers, Algeria',
          device: 'Windows Desktop',
          browser: 'Chrome 120.0',
          result: 'success',
          riskLevel: 'high',
          sessionId: 'session-001',
          details: {
            targetUser: 'user-006',
            targetUserName: 'Leila Mansouri',
            permissionsAdded: ['cms.publish', 'analytics.advanced'],
            permissionsRemoved: []
          }
        },
        {
          id: 'audit-003',
          timestamp: '2024-12-15T11:15:00Z',
          action: 'data_export',
          category: 'data_access',
          userId: 'user-006',
          userName: 'Leila Mansouri',
          userRole: 'Marketing Specialist',
          description: 'Exported customer analytics report (500 records)',
          ipAddress: '192.168.1.45',
          location: 'Algiers, Algeria',
          device: 'MacBook Pro',
          browser: 'Chrome 120.0',
          result: 'success',
          riskLevel: 'medium',
          sessionId: 'session-003',
          details: {
            exportType: 'customer_analytics',
            recordCount: 500,
            fileFormat: 'CSV',
            fileSize: '2.3 MB'
          }
        },
        {
          id: 'audit-004',
          timestamp: '2024-12-15T11:00:00Z',
          action: 'failed_login',
          category: 'authentication',
          userId: 'user-005',
          userName: 'Youssef Brahimi',
          userRole: 'Security Officer',
          description: 'Failed login attempt - incorrect password (attempt 5/5)',
          ipAddress: '192.168.1.105',
          location: 'Algiers, Algeria',
          device: 'Android Phone',
          browser: 'Chrome Mobile',
          result: 'failed',
          riskLevel: 'high',
          sessionId: null,
          details: {
            failureReason: 'incorrect_password',
            attemptNumber: 5,
            accountLocked: true,
            lockoutDuration: '30 minutes'
          }
        },
        {
          id: 'audit-005',
          timestamp: '2024-12-15T10:45:00Z',
          action: 'system_settings',
          category: 'configuration',
          userId: 'user-001',
          userName: 'Ahmed Ben Ali',
          userRole: 'Hotel Manager',
          description: 'Updated security policy settings',
          ipAddress: '192.168.1.100',
          location: 'Algiers, Algeria',
          device: 'Windows Desktop',
          browser: 'Chrome 120.0',
          result: 'success',
          riskLevel: 'critical',
          sessionId: 'session-001',
          details: {
            settingsChanged: ['password_policy', 'session_timeout'],
            oldValues: { password_policy: 'medium', session_timeout: 60 },
            newValues: { password_policy: 'strong', session_timeout: 30 }
          }
        },
        {
          id: 'audit-006',
          timestamp: '2024-12-15T10:30:00Z',
          action: 'reservation_create',
          category: 'business_operation',
          userId: 'user-002',
          userName: 'Fatima Zahra',
          userRole: 'Front Desk Manager',
          description: 'Created new reservation for guest Ahmed Benali',
          ipAddress: '192.168.1.102',
          location: 'Algiers, Algeria',
          device: 'iPad',
          browser: 'Safari 17.0',
          result: 'success',
          riskLevel: 'low',
          sessionId: 'session-002',
          details: {
            reservationId: 'RES-2024-001234',
            guestName: 'Ahmed Benali',
            roomNumber: '205',
            checkInDate: '2024-12-20',
            checkOutDate: '2024-12-25',
            totalAmount: 45000
          }
        },
        {
          id: 'audit-007',
          timestamp: '2024-12-15T10:15:00Z',
          action: 'payment_process',
          category: 'financial',
          userId: 'user-004',
          userName: 'Amina Khelifi',
          userRole: 'Accountant',
          description: 'Processed payment for reservation RES-2024-001230',
          ipAddress: '192.168.1.87',
          location: 'Algiers, Algeria',
          device: 'Windows Desktop',
          browser: 'Firefox 121.0',
          result: 'success',
          riskLevel: 'medium',
          sessionId: 'session-004',
          details: {
            reservationId: 'RES-2024-001230',
            paymentMethod: 'credit_card',
            amount: 38500,
            currency: 'DZD',
            transactionId: 'TXN-789456123'
          }
        },
        {
          id: 'audit-008',
          timestamp: '2024-12-15T10:00:00Z',
          action: 'unauthorized_access',
          category: 'security_violation',
          userId: 'user-unknown',
          userName: 'Unknown User',
          userRole: 'Unknown',
          description: 'Attempted access to admin panel without proper authorization',
          ipAddress: '203.45.67.89',
          location: 'Unknown Location',
          device: 'Unknown Device',
          browser: 'Unknown Browser',
          result: 'blocked',
          riskLevel: 'critical',
          sessionId: null,
          details: {
            attemptedResource: '/admin/system-settings',
            blockReason: 'insufficient_permissions',
            alertGenerated: true,
            ipBlocked: true
          }
        },
        {
          id: 'audit-009',
          timestamp: '2024-12-15T09:45:00Z',
          action: 'room_maintenance',
          category: 'business_operation',
          userId: 'user-003',
          userName: 'Mohamed Salim',
          userRole: 'Housekeeping Supervisor',
          description: 'Marked room 301 as out of order for maintenance',
          ipAddress: '192.168.1.78',
          location: 'Algiers, Algeria',
          device: 'Android Tablet',
          browser: 'Chrome Mobile',
          result: 'success',
          riskLevel: 'low',
          sessionId: 'session-005',
          details: {
            roomNumber: '301',
            maintenanceType: 'plumbing_repair',
            estimatedDuration: '4 hours',
            priority: 'high'
          }
        },
        {
          id: 'audit-010',
          timestamp: '2024-12-15T09:30:00Z',
          action: 'backup_create',
          category: 'system_maintenance',
          userId: 'system',
          userName: 'System Automated',
          userRole: 'System',
          description: 'Automated daily backup completed successfully',
          ipAddress: 'localhost',
          location: 'Server',
          device: 'Server',
          browser: 'System Process',
          result: 'success',
          riskLevel: 'low',
          sessionId: null,
          details: {
            backupType: 'full_database',
            backupSize: '2.8 GB',
            backupLocation: '/backups/daily/2024-12-15',
            duration: '15 minutes'
          }
        }
      ];

      // Calculate audit statistics
      const stats = {
        totalLogs: logsData.length,
        todayLogs: logsData.filter(log => {
          const logDate = new Date(log.timestamp).toDateString();
          const today = new Date().toDateString();
          return logDate === today;
        }).length,
        successfulActions: logsData.filter(log => log.result === 'success').length,
        failedActions: logsData.filter(log => log.result === 'failed').length,
        blockedActions: logsData.filter(log => log.result === 'blocked').length,
        highRiskActions: logsData.filter(log => log.riskLevel === 'high' || log.riskLevel === 'critical').length,
        uniqueUsers: [...new Set(logsData.map(log => log.userId))].length,
        categories: {
          authentication: logsData.filter(log => log.category === 'authentication').length,
          authorization: logsData.filter(log => log.category === 'authorization').length,
          data_access: logsData.filter(log => log.category === 'data_access').length,
          configuration: logsData.filter(log => log.category === 'configuration').length,
          business_operation: logsData.filter(log => log.category === 'business_operation').length,
          financial: logsData.filter(log => log.category === 'financial').length,
          security_violation: logsData.filter(log => log.category === 'security_violation').length,
          system_maintenance: logsData.filter(log => log.category === 'system_maintenance').length
        }
      };

      setAuditLogs(logsData);
      setAuditStats(stats);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...auditLogs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    // Filter by action
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Filter by user
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userId === selectedUser);
    }

    // Filter by result
    if (selectedResult !== 'all') {
      filtered = filtered.filter(log => log.result === selectedResult);
    }

    // Filter by risk level
    if (selectedRisk !== 'all') {
      filtered = filtered.filter(log => log.riskLevel === selectedRisk);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let filterDate = new Date();

      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate);
      }
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_login': return <User className="w-4 h-4 text-blue-600" />;
      case 'failed_login': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'permission_change': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'data_export': return <Download className="w-4 h-4 text-orange-600" />;
      case 'system_settings': return <Settings className="w-4 h-4 text-gray-600" />;
      case 'reservation_create': return <Plus className="w-4 h-4 text-green-600" />;
      case 'payment_process': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'unauthorized_access': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'room_maintenance': return <Settings className="w-4 h-4 text-yellow-600" />;
      case 'backup_create': return <Database className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Description', 'IP Address', 'Result', 'Risk Level'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.userName,
        `"${log.description}"`,
        log.ipAddress,
        log.result,
        log.riskLevel
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, name: log.userName })))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading audit logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Audit & Logging</h2>
              <p className="text-gray-100">Comprehensive audit trail and activity monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={exportLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
            <button 
              onClick={loadAuditData}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">TOTAL LOGS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-900">{auditStats?.totalLogs || 0}</div>
            <div className="text-sm text-blue-700">
              {auditStats?.todayLogs || 0} today
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">SUCCESSFUL</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">{auditStats?.successfulActions || 0}</div>
            <div className="text-sm text-green-700">
              {auditStats?.failedActions || 0} failed
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-red-600 font-medium">HIGH RISK</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-900">{auditStats?.highRiskActions || 0}</div>
            <div className="text-sm text-red-700">
              {auditStats?.blockedActions || 0} blocked
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-purple-600 font-medium">UNIQUE USERS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-900">{auditStats?.uniqueUsers || 0}</div>
            <div className="text-sm text-purple-700">
              Active users
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Results</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Audit Logs ({filteredLogs.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Timestamp</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Action</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Result</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.slice(0, 20).map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{formatDate(log.timestamp)}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm font-medium text-gray-900">
                        {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                      <p className="text-xs text-gray-600">{log.userRole}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900 max-w-xs truncate" title={log.description}>
                      {log.description}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{log.location}</p>
                      <p className="text-xs text-gray-600">{log.ipAddress}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(log.result)}`}>
                      {log.result}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(log.riskLevel)}`}>
                      {log.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedAction !== 'all' || selectedUser !== 'all' || selectedResult !== 'all' || selectedRisk !== 'all' || dateRange !== 'all'
                ? 'Try adjusting your filter criteria.'
                : 'No audit logs available.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {auditStats && Object.entries(auditStats.categories).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <p className="text-sm text-gray-600 capitalize">
                {category.replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogger;
