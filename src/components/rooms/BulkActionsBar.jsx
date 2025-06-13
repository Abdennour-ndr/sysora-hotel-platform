import React, { useState } from 'react';
import {
  Check,
  Users,
  Sparkles,
  Wrench,
  X,
  Trash2,
  Copy,
  Edit3,
  DollarSign,
  Settings,
  ChevronDown,
  AlertTriangle,
  Zap,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onStatusChange, onClearSelection }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);

  const statusActions = [
    {
      status: 'available',
      icon: Check,
      label: 'Set Available',
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      shortcut: '1'
    },
    {
      status: 'occupied',
      icon: Users,
      label: 'Set Occupied',
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      shortcut: '2'
    },
    {
      status: 'cleaning',
      icon: Sparkles,
      label: 'Request Cleaning',
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      shortcut: '3'
    },
    {
      status: 'maintenance',
      icon: Wrench,
      label: 'Request Maintenance',
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      shortcut: '4'
    }
  ];

  const bulkActions = [
    {
      icon: Copy,
      label: 'Duplicate Rooms',
      action: () => handleBulkAction('duplicate'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      icon: Edit3,
      label: 'Bulk Edit',
      action: () => handleBulkAction('edit'),
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      icon: DollarSign,
      label: 'Update Prices',
      action: () => handleBulkAction('prices'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      icon: FileText,
      label: 'Export Data',
      action: () => handleBulkAction('export'),
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    }
  ];

  const advancedActions = [
    {
      icon: Calendar,
      label: 'Schedule Actions',
      action: () => handleBulkAction('schedule'),
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    {
      icon: BarChart3,
      label: 'Generate Report',
      action: () => handleBulkAction('report'),
      color: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
    },
    {
      icon: Settings,
      label: 'Bulk Settings',
      action: () => handleBulkAction('settings'),
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    {
      icon: Trash2,
      label: 'Delete Rooms',
      action: () => setShowConfirmation('delete'),
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      dangerous: true
    }
  ];

  const handleStatusChange = (status) => {
    onStatusChange(status);
    window.showToast && window.showToast(
      `${selectedCount} room(s) status changed to ${status}`,
      'success'
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on ${selectedCount} rooms`);
    
    switch (action) {
      case 'duplicate':
        window.showToast && window.showToast(
          `${selectedCount} room(s) duplicated successfully`,
          'success'
        );
        break;
      case 'edit':
        window.showToast && window.showToast(
          `Opening bulk edit for ${selectedCount} room(s)`,
          'info'
        );
        break;
      case 'prices':
        window.showToast && window.showToast(
          `Price update modal opened for ${selectedCount} room(s)`,
          'info'
        );
        break;
      case 'export':
        window.showToast && window.showToast(
          `Exporting data for ${selectedCount} room(s)`,
          'info'
        );
        break;
      case 'schedule':
        window.showToast && window.showToast(
          `Schedule actions for ${selectedCount} room(s)`,
          'info'
        );
        break;
      case 'report':
        window.showToast && window.showToast(
          `Generating report for ${selectedCount} room(s)`,
          'info'
        );
        break;
      case 'settings':
        window.showToast && window.showToast(
          `Opening settings for ${selectedCount} room(s)`,
          'info'
        );
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting ${selectedCount} rooms`);
    window.showToast && window.showToast(
      `${selectedCount} room(s) deleted successfully`,
      'success'
    );
    setShowConfirmation(null);
    onClearSelection();
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[600px] max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sysora-mint rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">{selectedCount}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedCount} room{selectedCount > 1 ? 's' : ''} selected
                </h3>
                <p className="text-sm text-gray-500">
                  Choose an action to apply to selected rooms
                </p>
              </div>
            </div>
            
            <button
              onClick={onClearSelection}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear selection (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Actions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Change Status</h4>
            <div className="flex items-center space-x-2">
              {statusActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${action.color} hover:scale-105 active:scale-95
                    `}
                    title={`${action.label} (${action.shortcut})`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                    <span className="text-xs opacity-70 bg-white/30 px-1 rounded">
                      {action.shortcut}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bulk Actions</h4>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {bulkActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                      ${action.color} hover:scale-105 active:scale-95
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
              
              {/* Advanced Actions Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                  bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95
                `}
              >
                <Zap className="w-4 h-4" />
                <span>Advanced</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Actions */}
          {showAdvanced && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Advanced Actions</h4>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {advancedActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                        ${action.color} hover:scale-105 active:scale-95
                        ${action.dangerous ? 'ring-2 ring-red-200' : ''}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{action.label}</span>
                      {action.dangerous && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Shortcuts: 1-4 for status, Ctrl+A select all, Escape to clear</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Selected: {selectedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation === 'delete' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete {selectedCount} Room{selectedCount > 1 ? 's' : ''}?
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Warning:</p>
                  <p>
                    Deleting these rooms will permanently remove all associated data,
                    including reservations, maintenance records, and images.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmation(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Delete {selectedCount} Room{selectedCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;
