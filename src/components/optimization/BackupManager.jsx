import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Settings,
  Calendar,
  HardDrive,
  Cloud,
  Shield,
  Archive,
  FileText,
  Trash2,
  Eye,
  Copy,
  RotateCcw,
  Server,
  Lock,
  Unlock,
  Zap,
  Activity
} from 'lucide-react';

const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [backupSettings, setBackupSettings] = useState(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    setLoading(true);
    try {
      // Load backup settings
      const settings = {
        autoBackup: {
          enabled: true,
          frequency: 'daily',
          time: '02:00',
          retention: 30,
          compression: true,
          encryption: true
        },
        storage: {
          local: { enabled: true, path: '/backups/local', usage: 45.2, capacity: 500 },
          cloud: { enabled: true, provider: 'AWS S3', usage: 12.8, capacity: 1000 },
          remote: { enabled: false, url: '', usage: 0, capacity: 0 }
        },
        notifications: {
          email: true,
          webhook: false,
          onSuccess: true,
          onFailure: true,
          onWarning: true
        },
        security: {
          encryption: 'AES-256',
          compression: 'gzip',
          verification: true,
          integrity: true
        }
      };

      // Load backup history
      const backupHistory = [
        {
          id: 'backup-001',
          name: 'Daily Backup - 2024-12-15',
          type: 'full',
          status: 'completed',
          createdAt: '2024-12-15T02:00:00Z',
          completedAt: '2024-12-15T02:15:00Z',
          size: 2.8,
          location: 'local',
          encrypted: true,
          compressed: true,
          tables: ['users', 'reservations', 'rooms', 'payments', 'analytics', 'security'],
          duration: 15,
          verification: 'passed'
        },
        {
          id: 'backup-002',
          name: 'Weekly Backup - 2024-12-14',
          type: 'full',
          status: 'completed',
          createdAt: '2024-12-14T02:00:00Z',
          completedAt: '2024-12-14T02:22:00Z',
          size: 2.9,
          location: 'cloud',
          encrypted: true,
          compressed: true,
          tables: ['users', 'reservations', 'rooms', 'payments', 'analytics', 'security'],
          duration: 22,
          verification: 'passed'
        },
        {
          id: 'backup-003',
          name: 'Manual Backup - 2024-12-13',
          type: 'incremental',
          status: 'completed',
          createdAt: '2024-12-13T14:30:00Z',
          completedAt: '2024-12-13T14:35:00Z',
          size: 0.5,
          location: 'local',
          encrypted: true,
          compressed: true,
          tables: ['reservations', 'payments'],
          duration: 5,
          verification: 'passed'
        },
        {
          id: 'backup-004',
          name: 'Daily Backup - 2024-12-12',
          type: 'full',
          status: 'failed',
          createdAt: '2024-12-12T02:00:00Z',
          completedAt: null,
          size: 0,
          location: 'local',
          encrypted: false,
          compressed: false,
          tables: [],
          duration: 0,
          verification: 'failed',
          error: 'Insufficient disk space'
        },
        {
          id: 'backup-005',
          name: 'Daily Backup - 2024-12-11',
          type: 'full',
          status: 'completed',
          createdAt: '2024-12-11T02:00:00Z',
          completedAt: '2024-12-11T02:18:00Z',
          size: 2.7,
          location: 'cloud',
          encrypted: true,
          compressed: true,
          tables: ['users', 'reservations', 'rooms', 'payments', 'analytics', 'security'],
          duration: 18,
          verification: 'passed'
        },
        {
          id: 'backup-006',
          name: 'System Backup - 2024-12-10',
          type: 'system',
          status: 'completed',
          createdAt: '2024-12-10T01:00:00Z',
          completedAt: '2024-12-10T01:45:00Z',
          size: 5.2,
          location: 'cloud',
          encrypted: true,
          compressed: true,
          tables: ['all_system_data'],
          duration: 45,
          verification: 'passed'
        }
      ];

      setBackupSettings(settings);
      setBackups(backupHistory);
    } catch (error) {
      console.error('Error loading backup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'full': return <Database className="w-4 h-4 text-blue-600" />;
      case 'incremental': return <Archive className="w-4 h-4 text-green-600" />;
      case 'system': return <Server className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLocationIcon = (location) => {
    switch (location) {
      case 'local': return <HardDrive className="w-4 h-4 text-gray-600" />;
      case 'cloud': return <Cloud className="w-4 h-4 text-blue-600" />;
      case 'remote': return <Server className="w-4 h-4 text-purple-600" />;
      default: return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateBackup = async (type = 'full') => {
    setIsCreatingBackup(true);
    try {
      // Simulate backup creation
      const newBackup = {
        id: `backup-${Date.now()}`,
        name: `Manual ${type} Backup - ${new Date().toLocaleDateString()}`,
        type,
        status: 'running',
        createdAt: new Date().toISOString(),
        completedAt: null,
        size: 0,
        location: 'local',
        encrypted: true,
        compressed: true,
        tables: type === 'full' ? ['users', 'reservations', 'rooms', 'payments', 'analytics', 'security'] : ['reservations'],
        duration: 0,
        verification: 'pending'
      };

      setBackups(prev => [newBackup, ...prev]);

      // Simulate backup progress
      await new Promise(resolve => setTimeout(resolve, 3000));

      setBackups(prev => prev.map(backup => 
        backup.id === newBackup.id 
          ? {
              ...backup,
              status: 'completed',
              completedAt: new Date().toISOString(),
              size: Math.random() * 2 + 1,
              duration: Math.floor(Math.random() * 20) + 5,
              verification: 'passed'
            }
          : backup
      ));

      window.showToast && window.showToast('Backup created successfully', 'success');
    } catch (error) {
      console.error('Error creating backup:', error);
      window.showToast && window.showToast('Failed to create backup', 'error');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return;
    }

    setIsRestoring(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 5000));
      window.showToast && window.showToast('Backup restored successfully', 'success');
    } catch (error) {
      console.error('Error restoring backup:', error);
      window.showToast && window.showToast('Failed to restore backup', 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
      window.showToast && window.showToast('Backup deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting backup:', error);
      window.showToast && window.showToast('Failed to delete backup', 'error');
    }
  };

  const formatSize = (sizeGB) => {
    if (sizeGB < 1) return `${(sizeGB * 1024).toFixed(0)} MB`;
    return `${sizeGB.toFixed(1)} GB`;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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

  const completedBackups = backups.filter(b => b.status === 'completed').length;
  const failedBackups = backups.filter(b => b.status === 'failed').length;
  const totalSize = backups.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.size, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading backup data...</p>
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
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Backup & Recovery Manager</h2>
              <p className="text-blue-100">Automated backup system with disaster recovery</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleCreateBackup('full')}
              disabled={isCreatingBackup || isRestoring}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Create Backup</span>
            </button>
            
            <button 
              onClick={loadBackupData}
              disabled={isCreatingBackup || isRestoring}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${(isCreatingBackup || isRestoring) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-blue-100">
          Auto backup: {backupSettings?.autoBackup.enabled ? 'Enabled' : 'Disabled'} • 
          Next backup: Today at {backupSettings?.autoBackup.time} • 
          Retention: {backupSettings?.autoBackup.retention} days
        </div>
      </div>

      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-green-600 font-medium">SUCCESSFUL</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-900">{completedBackups}</div>
            <div className="text-sm text-green-700">
              {formatSize(totalSize)} total
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-600 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-red-600 font-medium">FAILED</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-900">{failedBackups}</div>
            <div className="text-sm text-red-700">
              Requires attention
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-medium">LOCAL STORAGE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-900">{backupSettings?.storage.local.usage}%</div>
            <div className="text-sm text-blue-700">
              {backupSettings?.storage.local.capacity} GB capacity
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-purple-600 font-medium">CLOUD STORAGE</span>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-900">{backupSettings?.storage.cloud.usage}%</div>
            <div className="text-sm text-purple-700">
              {backupSettings?.storage.cloud.capacity} GB capacity
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Backup History ({backups.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Backup</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Size</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Created</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backups.map(backup => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{backup.name}</p>
                      <p className="text-sm text-gray-600">
                        {backup.tables.length} tables • {formatDuration(backup.duration)}
                      </p>
                      {backup.error && (
                        <p className="text-sm text-red-600 mt-1">{backup.error}</p>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(backup.type)}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {backup.type}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {backup.size > 0 ? formatSize(backup.size) : '-'}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getLocationIcon(backup.location)}
                      <span className="text-sm text-gray-900 capitalize">
                        {backup.location}
                      </span>
                      {backup.encrypted && <Lock className="w-3 h-3 text-green-600" />}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(backup.createdAt)}</p>
                      {backup.completedAt && (
                        <p className="text-xs text-gray-600">
                          Completed: {formatDate(backup.completedAt)}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedBackup(backup)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleRestoreBackup(backup.id)}
                            disabled={isRestoring}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Restore Backup"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Download Backup"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Backup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {backups.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No backups found</h3>
            <p className="text-gray-600 mb-6">Create your first backup to get started.</p>
            <button
              onClick={() => handleCreateBackup('full')}
              disabled={isCreatingBackup}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Create First Backup
            </button>
          </div>
        )}
      </div>

      {/* Backup Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto Backup</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                backupSettings?.autoBackup.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {backupSettings?.autoBackup.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Frequency</span>
              <span className="font-medium text-gray-900 capitalize">
                {backupSettings?.autoBackup.frequency}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Backup Time</span>
              <span className="font-medium text-gray-900">
                {backupSettings?.autoBackup.time}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Retention Period</span>
              <span className="font-medium text-gray-900">
                {backupSettings?.autoBackup.retention} days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Compression</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                backupSettings?.autoBackup.compression ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {backupSettings?.autoBackup.compression ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Encryption</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                backupSettings?.autoBackup.encryption ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {backupSettings?.autoBackup.encryption ? 'AES-256' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Locations</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Local Storage</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  backupSettings?.storage.local.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {backupSettings?.storage.local.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${backupSettings?.storage.local.usage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {backupSettings?.storage.local.usage}% used of {backupSettings?.storage.local.capacity} GB
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">Cloud Storage</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  backupSettings?.storage.cloud.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {backupSettings?.storage.cloud.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${backupSettings?.storage.cloud.usage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {backupSettings?.storage.cloud.usage}% used of {backupSettings?.storage.cloud.capacity} GB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCreateBackup('full')}
            disabled={isCreatingBackup || isRestoring}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Database className="w-5 h-5 text-blue-600" />
            <span>Full Backup</span>
          </button>

          <button
            onClick={() => handleCreateBackup('incremental')}
            disabled={isCreatingBackup || isRestoring}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Archive className="w-5 h-5 text-green-600" />
            <span>Incremental Backup</span>
          </button>

          <button
            onClick={() => handleCreateBackup('system')}
            disabled={isCreatingBackup || isRestoring}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Server className="w-5 h-5 text-purple-600" />
            <span>System Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
