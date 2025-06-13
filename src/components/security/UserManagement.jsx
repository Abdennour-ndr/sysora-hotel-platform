import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus,
  Shield,
  Key,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Star,
  Award,
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsersAndRoles();
  }, []);

  const loadUsersAndRoles = async () => {
    setLoading(true);
    try {
      // Load users data
      const usersData = [
        {
          id: 'user-001',
          fullName: 'Ahmed Ben Ali',
          email: 'ahmed.benali@hotel.com',
          phone: '+213 555 123 456',
          role: 'Hotel Manager',
          roleId: 'role-001',
          status: 'active',
          lastLogin: '2024-12-15T10:30:00Z',
          createdAt: '2024-01-15T09:00:00Z',
          avatar: null,
          department: 'Management',
          location: 'Algiers',
          permissions: ['all'],
          loginAttempts: 0,
          isLocked: false,
          twoFactorEnabled: true,
          sessionCount: 3,
          lastActivity: '2024-12-15T11:45:00Z'
        },
        {
          id: 'user-002',
          fullName: 'Fatima Zahra',
          email: 'fatima.zahra@hotel.com',
          phone: '+213 555 234 567',
          role: 'Front Desk Manager',
          roleId: 'role-002',
          status: 'active',
          lastLogin: '2024-12-15T08:15:00Z',
          createdAt: '2024-02-20T10:30:00Z',
          avatar: null,
          department: 'Front Office',
          location: 'Algiers',
          permissions: ['reservations', 'guests', 'rooms'],
          loginAttempts: 0,
          isLocked: false,
          twoFactorEnabled: false,
          sessionCount: 1,
          lastActivity: '2024-12-15T09:20:00Z'
        },
        {
          id: 'user-003',
          fullName: 'Mohamed Salim',
          email: 'mohamed.salim@hotel.com',
          phone: '+213 555 345 678',
          role: 'Housekeeping Supervisor',
          roleId: 'role-003',
          status: 'active',
          lastLogin: '2024-12-14T16:45:00Z',
          createdAt: '2024-03-10T14:20:00Z',
          avatar: null,
          department: 'Housekeeping',
          location: 'Algiers',
          permissions: ['rooms', 'maintenance'],
          loginAttempts: 1,
          isLocked: false,
          twoFactorEnabled: true,
          sessionCount: 0,
          lastActivity: '2024-12-14T17:30:00Z'
        },
        {
          id: 'user-004',
          fullName: 'Amina Khelifi',
          email: 'amina.khelifi@hotel.com',
          phone: '+213 555 456 789',
          role: 'Accountant',
          roleId: 'role-004',
          status: 'inactive',
          lastLogin: '2024-12-10T12:00:00Z',
          createdAt: '2024-04-05T11:15:00Z',
          avatar: null,
          department: 'Finance',
          location: 'Algiers',
          permissions: ['payments', 'reports'],
          loginAttempts: 0,
          isLocked: false,
          twoFactorEnabled: false,
          sessionCount: 0,
          lastActivity: '2024-12-10T13:45:00Z'
        },
        {
          id: 'user-005',
          fullName: 'Youssef Brahimi',
          email: 'youssef.brahimi@hotel.com',
          phone: '+213 555 567 890',
          role: 'Security Officer',
          roleId: 'role-005',
          status: 'locked',
          lastLogin: '2024-12-12T20:30:00Z',
          createdAt: '2024-05-12T16:45:00Z',
          avatar: null,
          department: 'Security',
          location: 'Algiers',
          permissions: ['security', 'monitoring'],
          loginAttempts: 5,
          isLocked: true,
          twoFactorEnabled: true,
          sessionCount: 0,
          lastActivity: '2024-12-12T21:15:00Z'
        },
        {
          id: 'user-006',
          fullName: 'Leila Mansouri',
          email: 'leila.mansouri@hotel.com',
          phone: '+213 555 678 901',
          role: 'Marketing Specialist',
          roleId: 'role-006',
          status: 'active',
          lastLogin: '2024-12-15T09:45:00Z',
          createdAt: '2024-06-18T13:30:00Z',
          avatar: null,
          department: 'Marketing',
          location: 'Algiers',
          permissions: ['cms', 'analytics'],
          loginAttempts: 0,
          isLocked: false,
          twoFactorEnabled: false,
          sessionCount: 2,
          lastActivity: '2024-12-15T10:30:00Z'
        }
      ];

      // Load roles data
      const rolesData = [
        {
          id: 'role-001',
          name: 'Hotel Manager',
          description: 'Full access to all hotel management functions',
          permissions: ['all'],
          userCount: 1,
          level: 'executive',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: true
        },
        {
          id: 'role-002',
          name: 'Front Desk Manager',
          description: 'Manage reservations, guests, and front office operations',
          permissions: ['reservations', 'guests', 'rooms', 'checkin', 'checkout'],
          userCount: 1,
          level: 'management',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: true
        },
        {
          id: 'role-003',
          name: 'Housekeeping Supervisor',
          description: 'Oversee room cleaning and maintenance operations',
          permissions: ['rooms', 'maintenance', 'housekeeping'],
          userCount: 1,
          level: 'supervisor',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: true
        },
        {
          id: 'role-004',
          name: 'Accountant',
          description: 'Handle financial transactions and reporting',
          permissions: ['payments', 'reports', 'billing'],
          userCount: 1,
          level: 'specialist',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: true
        },
        {
          id: 'role-005',
          name: 'Security Officer',
          description: 'Monitor security and access control',
          permissions: ['security', 'monitoring', 'access'],
          userCount: 1,
          level: 'specialist',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: true
        },
        {
          id: 'role-006',
          name: 'Marketing Specialist',
          description: 'Manage marketing campaigns and content',
          permissions: ['cms', 'analytics', 'marketing'],
          userCount: 1,
          level: 'specialist',
          createdAt: '2024-01-01T00:00:00Z',
          isSystem: false
        }
      ];

      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading users and roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <Clock className="w-4 h-4 text-gray-600" />;
      case 'locked': return <Lock className="w-4 h-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleLevel = (level) => {
    const levels = {
      executive: { color: 'bg-purple-100 text-purple-800', icon: Award },
      management: { color: 'bg-blue-100 text-blue-800', icon: Star },
      supervisor: { color: 'bg-green-100 text-green-800', icon: UserCheck },
      specialist: { color: 'bg-orange-100 text-orange-800', icon: Users }
    };
    return levels[level] || levels.specialist;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUserAction = async (action, userId) => {
    try {
      switch (action) {
        case 'lock':
          setUsers(prev => prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'locked', isLocked: true }
              : user
          ));
          window.showToast && window.showToast('User locked successfully', 'success');
          break;
        case 'unlock':
          setUsers(prev => prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'active', isLocked: false, loginAttempts: 0 }
              : user
          ));
          window.showToast && window.showToast('User unlocked successfully', 'success');
          break;
        case 'activate':
          setUsers(prev => prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'active' }
              : user
          ));
          window.showToast && window.showToast('User activated successfully', 'success');
          break;
        case 'deactivate':
          setUsers(prev => prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'inactive' }
              : user
          ));
          window.showToast && window.showToast('User deactivated successfully', 'success');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
            window.showToast && window.showToast('User deleted successfully', 'success');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      window.showToast && window.showToast('Failed to perform action', 'error');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.roleId === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">User Management</h2>
              <p className="text-blue-100">Manage users, roles, and access permissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUserModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
            <button 
              onClick={() => setShowRoleModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Manage Roles</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">TOTAL USERS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-900">{users.length}</div>
            <div className="text-sm text-blue-700">
              {users.filter(u => u.status === 'active').length} active
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">ACTIVE USERS</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-green-700">
              {users.filter(u => u.sessionCount > 0).length} online now
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-purple-600 font-medium">ROLES</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-900">{roles.length}</div>
            <div className="text-sm text-purple-700">
              {roles.filter(r => !r.isSystem).length} custom roles
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-orange-600 font-medium">2FA ENABLED</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-900">
              {users.filter(u => u.twoFactorEnabled).length}
            </div>
            <div className="text-sm text-orange-700">
              {((users.filter(u => u.twoFactorEnabled).length / users.length) * 100).toFixed(0)}% coverage
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Login</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Security</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => {
                const roleInfo = roles.find(r => r.id === user.roleId);
                const levelInfo = getRoleLevel(roleInfo?.level || 'specialist');
                const LevelIcon = levelInfo.icon;

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <LevelIcon className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{user.role}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${levelInfo.color}`}>
                            {roleInfo?.level || 'specialist'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        {user.sessionCount > 0 && (
                          <span className="flex items-center space-x-1 text-xs text-green-600">
                            <Activity className="w-3 h-3" />
                            <span>Online</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                        <p className="text-gray-600">from {user.location}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {user.twoFactorEnabled ? (
                          <span className="flex items-center space-x-1 text-xs text-green-600">
                            <Shield className="w-3 h-3" />
                            <span>2FA</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-xs text-gray-500">
                            <Shield className="w-3 h-3" />
                            <span>No 2FA</span>
                          </span>
                        )}
                        {user.loginAttempts > 0 && (
                          <span className="flex items-center space-x-1 text-xs text-yellow-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{user.loginAttempts} attempts</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {user.status === 'locked' ? (
                          <button
                            onClick={() => handleUserAction('unlock', user.id)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Unlock User"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('lock', user.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Lock User"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction('deactivate', user.id)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction('activate', user.id)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => handleUserAction('delete', user.id)}
                                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'Create your first user to get started.'
              }
            </p>
            <button
              onClick={() => setShowUserModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
