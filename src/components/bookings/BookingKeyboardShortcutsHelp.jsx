import React from 'react';
import {
  X,
  Keyboard,
  Search,
  Grid,
  List,
  Check,
  Users,
  Eye,
  AlertCircle,
  Clock,
  Edit3,
  Copy,
  Trash2,
  Move,
  MousePointer,
  Zap,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';

const BookingKeyboardShortcutsHelp = ({ onClose }) => {
  const shortcutCategories = [
    {
      title: 'Navigation',
      icon: ArrowUp,
      shortcuts: [
        { keys: ['↑', '↓', '←', '→'], description: 'Navigate between bookings' },
        { keys: ['Tab'], description: 'Navigate between elements' },
        { keys: ['Enter'], description: 'Open booking details' },
        { keys: ['Escape'], description: 'Close modals/cancel actions' },
        { keys: ['Page Up'], description: 'Previous page' },
        { keys: ['Page Down'], description: 'Next page' }
      ]
    },
    {
      title: 'Search & Filter',
      icon: Search,
      shortcuts: [
        { keys: ['Ctrl', 'F'], description: 'Focus search field' },
        { keys: ['Ctrl', 'K'], description: 'Quick search' },
        { keys: ['/'], description: 'Start search' },
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Advanced filters' }
      ]
    },
    {
      title: 'View Controls',
      icon: Grid,
      shortcuts: [
        { keys: ['G'], description: 'Switch to card view' },
        { keys: ['L'], description: 'Switch to list view' },
        { keys: ['T'], description: 'Toggle timeline view' },
        { keys: ['K'], description: 'Toggle calendar view' },
        { keys: ['F11'], description: 'Toggle fullscreen' }
      ]
    },
    {
      title: 'Selection',
      icon: MousePointer,
      shortcuts: [
        { keys: ['Ctrl', 'A'], description: 'Select all bookings' },
        { keys: ['Ctrl', 'D'], description: 'Deselect all bookings' },
        { keys: ['Ctrl', 'Click'], description: 'Toggle booking selection' },
        { keys: ['Shift', 'Click'], description: 'Select range of bookings' },
        { keys: ['Space'], description: 'Toggle current booking selection' }
      ]
    },
    {
      title: 'Status Changes',
      icon: Check,
      shortcuts: [
        { keys: ['P'], description: 'Set selected bookings to Pending', color: 'text-yellow-600' },
        { keys: ['C'], description: 'Confirm selected bookings', color: 'text-blue-600' },
        { keys: ['I'], description: 'Check in selected bookings', color: 'text-green-600' },
        { keys: ['O'], description: 'Check out selected bookings', color: 'text-gray-600' },
        { keys: ['X'], description: 'Cancel selected bookings', color: 'text-red-600' },
        { keys: ['N'], description: 'Mark as No Show', color: 'text-orange-600' }
      ]
    },
    {
      title: 'Booking Management',
      icon: Calendar,
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'Create new booking' },
        { keys: ['Ctrl', 'E'], description: 'Edit selected booking' },
        { keys: ['Ctrl', 'C'], description: 'Copy booking' },
        { keys: ['Ctrl', 'V'], description: 'Paste booking' },
        { keys: ['Delete'], description: 'Delete selected bookings' },
        { keys: ['F2'], description: 'Edit booking name' }
      ]
    },
    {
      title: 'Payment & Billing',
      icon: CreditCard,
      shortcuts: [
        { keys: ['Ctrl', 'P'], description: 'Process payment' },
        { keys: ['Ctrl', 'I'], description: 'Generate invoice' },
        { keys: ['Ctrl', 'R'], description: 'Process refund' },
        { keys: ['Ctrl', 'B'], description: 'View billing details' },
        { keys: ['Ctrl', 'Shift', 'P'], description: 'Print invoice' }
      ]
    },
    {
      title: 'Communication',
      icon: Mail,
      shortcuts: [
        { keys: ['Ctrl', 'M'], description: 'Send email to guest' },
        { keys: ['Ctrl', 'T'], description: 'Call guest' },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Send confirmation' },
        { keys: ['Ctrl', 'Shift', 'R'], description: 'Send reminder' },
        { keys: ['Ctrl', 'Shift', 'M'], description: 'Send message' }
      ]
    },
    {
      title: 'Editing',
      icon: Edit3,
      shortcuts: [
        { keys: ['F2'], description: 'Edit guest name' },
        { keys: ['Double Click'], description: 'Inline edit field' },
        { keys: ['Enter'], description: 'Save inline edit' },
        { keys: ['Escape'], description: 'Cancel inline edit' },
        { keys: ['Ctrl', 'S'], description: 'Save changes' }
      ]
    },
    {
      title: 'Advanced',
      icon: Settings,
      shortcuts: [
        { keys: ['?'], description: 'Show this help dialog' },
        { keys: ['Ctrl', 'Shift', 'P'], description: 'Command palette' },
        { keys: ['Ctrl', 'R'], description: 'Refresh booking data' },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Export selected bookings' },
        { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
        { keys: ['Ctrl', 'Y'], description: 'Redo last action' }
      ]
    }
  ];

  const KeyBadge = ({ keyName, isModifier = false }) => (
    <span className={`
      inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-mono font-semibold
      ${isModifier 
        ? 'bg-sysora-mint/20 text-sysora-midnight border border-sysora-mint/30' 
        : 'bg-gray-100 text-gray-700 border border-gray-200'
      }
      min-w-[24px] h-6
    `}>
      {keyName}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight to-blue-800 text-white space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl lg:rounded-2xl">
              <Keyboard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Booking Keyboard Shortcuts</h2>
              <p className="text-blue-100/80 text-sm sm:text-base">Master the advanced booking management controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl transition-colors self-end sm:self-auto"
            title="Close (Escape)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {shortcutCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-3 sm:space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-sysora-mint/10 rounded-lg sm:rounded-xl">
                      <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sysora-mint" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>

                  {/* Shortcuts List */}
                  <div className="space-y-2 sm:space-y-3">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <div
                        key={shortcutIndex}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm sm:text-base ${shortcut.color || 'text-gray-900'}`}>
                            {shortcut.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 justify-end sm:justify-start">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <KeyBadge
                                keyName={key}
                                isModifier={['Ctrl', 'Shift', 'Alt', 'Cmd'].includes(key)}
                              />
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 text-xs mx-1">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pro Tips */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-sysora-mint/10 to-blue-50 rounded-xl lg:rounded-2xl border border-sysora-mint/20">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 sm:p-2 bg-sysora-mint/20 rounded-lg sm:rounded-xl flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-sysora-mint" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Pro Tips for Booking Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
                  <div className="space-y-2">
                    <p>• <strong>Drag & Drop:</strong> Drag bookings to reorder or change status</p>
                    <p>• <strong>Context Menu:</strong> Right-click any booking for quick actions</p>
                    <p>• <strong>Inline Editing:</strong> Double-click amounts and dates to edit</p>
                    <p>• <strong>Timeline View:</strong> Use 'T' to see bookings in timeline format</p>
                  </div>
                  <div className="space-y-2">
                    <p>• <strong>Bulk Operations:</strong> Select multiple bookings for batch actions</p>
                    <p>• <strong>Quick Status:</strong> Use P/C/I/O/X/N for instant status changes</p>
                    <p>• <strong>Smart Search:</strong> Search by guest name, booking number, or room</p>
                    <p>• <strong>Calendar View:</strong> Use 'K' to see bookings in calendar format</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl lg:rounded-2xl">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3">Status Quick Reference</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="P" />
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="C" />
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span>Confirmed</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="I" />
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span>Checked In</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="O" />
                <UserX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                <span>Checked Out</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="X" />
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                <span>Cancelled</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <KeyBadge keyName="N" />
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                <span>No Show</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500">
              <div className="text-center sm:text-left">
                <span>💡 Tip: Press <KeyBadge keyName="?" /> anytime to open this help</span>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <span>Sysora Advanced Booking Management</span>
                <div className="w-2 h-2 bg-sysora-mint rounded-full"></div>
                <span>v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingKeyboardShortcutsHelp;
