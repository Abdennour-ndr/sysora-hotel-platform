import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key,
  Lock,
  Unlock,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Save,
  RotateCcw,
  Copy,
  Download,
  Upload,
  Globe,
  Database,
  CreditCard,
  BarChart3,
  FileText,
  Calendar,
  Bed,
  Coffee,
  Star,
  Activity,
  Layers,
  Brain
} from 'lucide-react';

const PermissionsManager = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPermissionsData();
  }, []);

  const loadPermissionsData = async () => {
    setLoading(true);
    try {
      // Load permissions data
      const permissionsData = [
        // Core System Permissions
        { id: 'system.admin', name: 'System Administration', description: 'Full system access and configuration', category: 'system', level: 'critical', module: 'Core' },
        { id: 'system.settings', name: 'System Settings', description: 'Modify system configuration and preferences', category: 'system', level: 'high', module: 'Core' },
        { id: 'system.backup', name: 'Backup & Restore', description: 'Create and restore system backups', category: 'system', level: 'high', module: 'Core' },
        { id: 'system.logs', name: 'System Logs', description: 'View and manage system logs', category: 'system', level: 'medium', module: 'Core' },
        
        // User Management Permissions
        { id: 'users.view', name: 'View Users', description: 'View user profiles and information', category: 'users', level: 'low', module: 'User Management' },
        { id: 'users.create', name: 'Create Users', description: 'Add new users to the system', category: 'users', level: 'high', module: 'User Management' },
        { id: 'users.edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'users', level: 'medium', module: 'User Management' },
        { id: 'users.delete', name: 'Delete Users', description: 'Remove users from the system', category: 'users', level: 'high', module: 'User Management' },
        { id: 'users.permissions', name: 'Manage Permissions', description: 'Assign and modify user permissions', category: 'users', level: 'critical', module: 'User Management' },
        
        // Hotel Operations Permissions
        { id: 'rooms.view', name: 'View Rooms', description: 'View room information and status', category: 'operations', level: 'low', module: 'Room Management' },
        { id: 'rooms.manage', name: 'Manage Rooms', description: 'Add, edit, and configure rooms', category: 'operations', level: 'medium', module: 'Room Management' },
        { id: 'rooms.maintenance', name: 'Room Maintenance', description: 'Manage room maintenance and housekeeping', category: 'operations', level: 'medium', module: 'Room Management' },
        
        // Reservations Permissions
        { id: 'reservations.view', name: 'View Reservations', description: 'View booking information', category: 'reservations', level: 'low', module: 'Reservations' },
        { id: 'reservations.create', name: 'Create Reservations', description: 'Make new bookings', category: 'reservations', level: 'medium', module: 'Reservations' },
        { id: 'reservations.edit', name: 'Edit Reservations', description: 'Modify existing bookings', category: 'reservations', level: 'medium', module: 'Reservations' },
        { id: 'reservations.cancel', name: 'Cancel Reservations', description: 'Cancel bookings and process refunds', category: 'reservations', level: 'high', module: 'Reservations' },
        { id: 'checkin.manage', name: 'Check-in Management', description: 'Process guest check-ins', category: 'reservations', level: 'medium', module: 'Reservations' },
        { id: 'checkout.manage', name: 'Check-out Management', description: 'Process guest check-outs', category: 'reservations', level: 'medium', module: 'Reservations' },
        
        // Financial Permissions
        { id: 'payments.view', name: 'View Payments', description: 'View payment transactions', category: 'financial', level: 'medium', module: 'Payments' },
        { id: 'payments.process', name: 'Process Payments', description: 'Handle payment transactions', category: 'financial', level: 'high', module: 'Payments' },
        { id: 'payments.refund', name: 'Process Refunds', description: 'Issue refunds and credits', category: 'financial', level: 'high', module: 'Payments' },
        { id: 'billing.manage', name: 'Billing Management', description: 'Generate and manage invoices', category: 'financial', level: 'medium', module: 'Payments' },
        { id: 'reports.financial', name: 'Financial Reports', description: 'Access financial reports and analytics', category: 'financial', level: 'medium', module: 'Analytics' },
        
        // Analytics & Reports Permissions
        { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'analytics', level: 'low', module: 'Analytics' },
        { id: 'analytics.advanced', name: 'Advanced Analytics', description: 'Access detailed analytics and insights', category: 'analytics', level: 'medium', module: 'Analytics' },
        { id: 'reports.view', name: 'View Reports', description: 'Access standard reports', category: 'analytics', level: 'low', module: 'Analytics' },
        { id: 'reports.create', name: 'Create Reports', description: 'Generate custom reports', category: 'analytics', level: 'medium', module: 'Analytics' },
        { id: 'reports.export', name: 'Export Reports', description: 'Download and export report data', category: 'analytics', level: 'medium', module: 'Analytics' },
        
        // Content Management Permissions
        { id: 'cms.view', name: 'View Content', description: 'View website content and media', category: 'content', level: 'low', module: 'CMS' },
        { id: 'cms.edit', name: 'Edit Content', description: 'Create and modify content', category: 'content', level: 'medium', module: 'CMS' },
        { id: 'cms.publish', name: 'Publish Content', description: 'Publish content to website', category: 'content', level: 'high', module: 'CMS' },
        { id: 'cms.media', name: 'Media Management', description: 'Upload and manage media files', category: 'content', level: 'medium', module: 'CMS' },
        { id: 'cms.themes', name: 'Theme Management', description: 'Customize website themes and design', category: 'content', level: 'high', module: 'CMS' },
        
        // AI & Automation Permissions
        { id: 'ai.insights', name: 'AI Insights', description: 'Access AI-powered insights and recommendations', category: 'ai', level: 'medium', module: 'AI' },
        { id: 'ai.automation', name: 'AI Automation', description: 'Configure AI automation rules', category: 'ai', level: 'high', module: 'AI' },
        { id: 'ai.training', name: 'AI Training', description: 'Train and configure AI models', category: 'ai', level: 'critical', module: 'AI' },
        
        // Security Permissions
        { id: 'security.audit', name: 'Security Audit', description: 'View security logs and audit trails', category: 'security', level: 'high', module: 'Security' },
        { id: 'security.monitoring', name: 'Security Monitoring', description: 'Monitor security events and alerts', category: 'security', level: 'high', module: 'Security' },
        { id: 'security.config', name: 'Security Configuration', description: 'Configure security settings and policies', category: 'security', level: 'critical', module: 'Security' }
      ];

      // Load roles data
      const rolesData = [
        {
          id: 'role-001',
          name: 'Hotel Manager',
          description: 'Full access to all hotel management functions',
          level: 'executive',
          userCount: 1,
          permissions: ['system.admin', 'system.settings', 'users.view', 'users.create', 'users.edit', 'users.permissions', 'rooms.view', 'rooms.manage', 'reservations.view', 'reservations.create', 'reservations.edit', 'reservations.cancel', 'payments.view', 'payments.process', 'analytics.view', 'analytics.advanced', 'reports.view', 'reports.create', 'cms.view', 'cms.edit', 'cms.publish', 'ai.insights']
        },
        {
          id: 'role-002',
          name: 'Front Desk Manager',
          description: 'Manage reservations, guests, and front office operations',
          level: 'management',
          userCount: 1,
          permissions: ['rooms.view', 'reservations.view', 'reservations.create', 'reservations.edit', 'checkin.manage', 'checkout.manage', 'payments.view', 'payments.process', 'analytics.view', 'reports.view']
        },
        {
          id: 'role-003',
          name: 'Housekeeping Supervisor',
          description: 'Oversee room cleaning and maintenance operations',
          level: 'supervisor',
          userCount: 1,
          permissions: ['rooms.view', 'rooms.maintenance', 'reservations.view', 'analytics.view']
        },
        {
          id: 'role-004',
          name: 'Accountant',
          description: 'Handle financial transactions and reporting',
          level: 'specialist',
          userCount: 1,
          permissions: ['payments.view', 'payments.process', 'payments.refund', 'billing.manage', 'reports.financial', 'analytics.view', 'reports.view', 'reports.export']
        },
        {
          id: 'role-005',
          name: 'Security Officer',
          description: 'Monitor security and access control',
          level: 'specialist',
          userCount: 1,
          permissions: ['security.audit', 'security.monitoring', 'system.logs', 'users.view']
        },
        {
          id: 'role-006',
          name: 'Marketing Specialist',
          description: 'Manage marketing campaigns and content',
          level: 'specialist',
          userCount: 1,
          permissions: ['cms.view', 'cms.edit', 'cms.publish', 'cms.media', 'analytics.view', 'analytics.advanced', 'reports.view', 'reports.create', 'ai.insights']
        }
      ];

      // Create permission matrix
      const matrix = {};
      rolesData.forEach(role => {
        matrix[role.id] = {};
        permissionsData.forEach(permission => {
          matrix[role.id][permission.id] = role.permissions.includes(permission.id);
        });
      });

      setPermissions(permissionsData);
      setRoles(rolesData);
      setPermissionMatrix(matrix);
      setSelectedRole(rolesData[0]);
    } catch (error) {
      console.error('Error loading permissions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'system': return <Settings className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'operations': return <Bed className="w-4 h-4" />;
      case 'reservations': return <Calendar className="w-4 h-4" />;
      case 'financial': return <CreditCard className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'content': return <Layers className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const handlePermissionToggle = (roleId, permissionId) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId][permissionId]
      }
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Update roles with new permissions
      const updatedRoles = roles.map(role => ({
        ...role,
        permissions: permissions
          .filter(permission => permissionMatrix[role.id][permission.id])
          .map(permission => permission.id)
      }));
      
      setRoles(updatedRoles);
      setHasChanges(false);
      window.showToast && window.showToast('Permissions updated successfully', 'success');
    } catch (error) {
      console.error('Error saving permissions:', error);
      window.showToast && window.showToast('Failed to save permissions', 'error');
    }
  };

  const handleResetChanges = () => {
    loadPermissionsData();
    setHasChanges(false);
  };

  const categories = [...new Set(permissions.map(p => p.category))];
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Permissions Manager</h2>
              <p className="text-purple-100">Configure role-based access control and permissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <>
                <button 
                  onClick={handleResetChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Permission Matrix ({filteredPermissions.length} permissions)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure which permissions each role has access to
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 z-10">
                  Permission
                </th>
                {roles.map(role => (
                  <th key={role.id} className="text-center py-3 px-4 text-sm font-medium text-gray-600 min-w-[120px]">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-medium">{role.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{role.level}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPermissions.map(permission => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getCategoryIcon(permission.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{permission.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPermissionLevelColor(permission.level)}`}>
                            {permission.level}
                          </span>
                          <span className="text-xs text-gray-500">{permission.module}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {roles.map(role => (
                    <td key={role.id} className="py-4 px-4 text-center">
                      <button
                        onClick={() => handlePermissionToggle(role.id, permission.id)}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          permissionMatrix[role.id]?.[permission.id]
                            ? 'bg-green-100 border-green-500 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {permissionMatrix[role.id]?.[permission.id] ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPermissions.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No permissions found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'No permissions available.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Permission Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Categories</h3>
          <div className="space-y-3">
            {categories.map(category => {
              const categoryPermissions = permissions.filter(p => p.category === category);
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(category)}
                    <span className="font-medium text-gray-900 capitalize">{category}</span>
                  </div>
                  <span className="text-sm text-gray-600">{categoryPermissions.length} permissions</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Summary</h3>
          <div className="space-y-3">
            {roles.map(role => {
              const rolePermissions = permissions.filter(p => permissionMatrix[role.id]?.[p.id]);
              return (
                <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{role.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{role.level} level</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {rolePermissions.length} permissions
                    </span>
                    <p className="text-xs text-gray-500">{role.userCount} users</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Changes Warning */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Unsaved Changes</h3>
              <p className="text-yellow-700 mt-1">
                You have made changes to the permission matrix. Don't forget to save your changes.
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={handleResetChanges}
                className="px-4 py-2 text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsManager;
