import React, { useState } from 'react';
import {
  Check,
  Users,
  Eye,
  X,
  AlertCircle,
  Clock,
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
  CreditCard,
  Mail,
  Phone,
  Download,
  Send,
  RefreshCw,
  UserCheck,
  UserX
} from 'lucide-react';

const BookingBulkActionsBar = ({ selectedCount, onStatusChange, onClearSelection, selectedBookings }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);

  const statusActions = [
    {
      status: 'pending',
      icon: Clock,
      label: 'Set Pending',
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      shortcut: 'P'
    },
    {
      status: 'confirmed',
      icon: Check,
      label: 'Confirm',
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      shortcut: 'C'
    },
    {
      status: 'checked_in',
      icon: UserCheck,
      label: 'Check In',
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      shortcut: 'I'
    },
    {
      status: 'checked_out',
      icon: UserX,
      label: 'Check Out',
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      shortcut: 'O'
    },
    {
      status: 'cancelled',
      icon: X,
      label: 'Cancel',
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      shortcut: 'X'
    },
    {
      status: 'no_show',
      icon: AlertCircle,
      label: 'No Show',
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      shortcut: 'N'
    }
  ];

  const bulkActions = [
    {
      icon: Copy,
      label: 'Duplicate Bookings',
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
      icon: CreditCard,
      label: 'Process Payments',
      action: () => handleBulkAction('payments'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      icon: FileText,
      label: 'Generate Invoices',
      action: () => handleBulkAction('invoices'),
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    }
  ];

  const advancedActions = [
    {
      icon: Mail,
      label: 'Send Emails',
      action: () => handleBulkAction('emails'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      icon: Send,
      label: 'Send Confirmations',
      action: () => handleBulkAction('confirmations'),
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      icon: Calendar,
      label: 'Reschedule Bookings',
      action: () => handleBulkAction('reschedule'),
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    },
    {
      icon: Download,
      label: 'Export Data',
      action: () => handleBulkAction('export'),
      color: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
    },
    {
      icon: RefreshCw,
      label: 'Refund Payments',
      action: () => setShowConfirmation('refund'),
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      dangerous: true
    },
    {
      icon: Trash2,
      label: 'Delete Bookings',
      action: () => setShowConfirmation('delete'),
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      dangerous: true
    }
  ];

  const handleStatusChange = (status) => {
    onStatusChange(status);
    window.showToast && window.showToast(
      `${selectedCount} booking(s) status changed to ${status}`,
      'success'
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on ${selectedCount} bookings`);
    
    switch (action) {
      case 'duplicate':
        window.showToast && window.showToast(
          `${selectedCount} booking(s) duplicated successfully`,
          'success'
        );
        break;
      case 'edit':
        window.showToast && window.showToast(
          `Opening bulk edit for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'payments':
        window.showToast && window.showToast(
          `Processing payments for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'invoices':
        window.showToast && window.showToast(
          `Generating invoices for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'emails':
        window.showToast && window.showToast(
          `Sending emails for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'confirmations':
        window.showToast && window.showToast(
          `Sending confirmations for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'reschedule':
        window.showToast && window.showToast(
          `Rescheduling ${selectedCount} booking(s)`,
          'info'
        );
        break;
      case 'export':
        window.showToast && window.showToast(
          `Exporting data for ${selectedCount} booking(s)`,
          'info'
        );
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting ${selectedCount} bookings`);
    window.showToast && window.showToast(
      `${selectedCount} booking(s) deleted successfully`,
      'success'
    );
    setShowConfirmation(null);
    onClearSelection();
  };

  const handleConfirmRefund = () => {
    console.log(`Refunding ${selectedCount} bookings`);
    window.showToast && window.showToast(
      `Refunds processed for ${selectedCount} booking(s)`,
      'success'
    );
    setShowConfirmation(null);
    onClearSelection();
  };

  const getTotalAmount = () => {
    return selectedBookings.reduce((total, booking) => total + booking.totalAmount, 0);
  };

  const getTotalPaid = () => {
    return selectedBookings.reduce((total, booking) => total + booking.paidAmount, 0);
  };

  const formatCurrency = (amount, currency = 'DZD') => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-40">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 w-full sm:min-w-[600px] sm:max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sysora-mint rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">{selectedCount}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {selectedCount} booking{selectedCount > 1 ? 's' : ''} selected
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Total: {formatCurrency(getTotalAmount())} | Paid: {formatCurrency(getTotalPaid())}
                </p>
              </div>
            </div>

            <button
              onClick={onClearSelection}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors self-end sm:self-auto"
              title="Clear selection (Escape)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Status Actions */}
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Change Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {statusActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    className={`
                      flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200
                      ${action.color} hover:scale-105 active:scale-95 text-xs sm:text-sm
                    `}
                    title={`${action.label} (${action.shortcut})`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden text-xs">{action.label.split(' ')[0]}</span>
                    <span className="text-xs opacity-70 bg-white/30 px-1 rounded mt-1 sm:mt-0">
                      {action.shortcut}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Bulk Actions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {bulkActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={`bulk-${index}`}
                    onClick={action.action}
                    className={`
                      flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200
                      ${action.color} hover:scale-105 active:scale-95 text-xs sm:text-sm
                    `}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                    <span className="text-center">{action.label}</span>
                  </button>
                );
              })}

              {/* Advanced Actions Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`
                  flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200
                  bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95 text-xs sm:text-sm
                `}
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                <span>Advanced</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Actions */}
          {showAdvanced && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Advanced Actions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {advancedActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={`advanced-${index}`}
                      onClick={action.action}
                      className={`
                        flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200
                        ${action.color} hover:scale-105 active:scale-95 text-xs sm:text-sm
                        ${action.dangerous ? 'ring-1 sm:ring-2 ring-red-200' : ''}
                      `}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                      <span className="text-center">{action.label}</span>
                      {action.dangerous && (
                        <AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3 text-red-500 mt-1 sm:mt-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs text-gray-500">
              <div className="text-center sm:text-left">
                <span className="hidden sm:inline">Shortcuts: P/C/I/O/X/N for status, Ctrl+A select all, Escape to clear</span>
                <span className="sm:hidden">Use keyboard shortcuts for quick actions</span>
              </div>
              <div className="text-center sm:text-right">
                <span>Selected: {selectedCount} | Total: {formatCurrency(getTotalAmount())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirmation === 'delete' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete {selectedCount} Booking{selectedCount > 1 ? 's' : ''}?
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
                    Deleting these bookings will permanently remove all associated data,
                    including payment records, guest information, and communication history.
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
                Delete {selectedCount} Booking{selectedCount > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation === 'refund' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Refund {selectedCount} Booking{selectedCount > 1 ? 's' : ''}?
                </h3>
                <p className="text-sm text-gray-500">
                  Total refund amount: {formatCurrency(getTotalPaid())}
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Refund Process:</p>
                  <p>
                    This will process refunds for all paid amounts in the selected bookings.
                    The refund will be processed through the original payment method.
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
                onClick={handleConfirmRefund}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
              >
                Process Refunds
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingBulkActionsBar;
