import React from 'react';
import {
  X,
  Keyboard,
  Search,
  Grid,
  List,
  Check,
  Users,
  Sparkles,
  Wrench,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Move,
  MousePointer,
  Zap,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const KeyboardShortcutsHelp = ({ onClose }) => {
  const shortcutCategories = [
    {
      title: 'Navigation',
      icon: ArrowUp,
      shortcuts: [
        { keys: ['↑', '↓', '←', '→'], description: 'Navigate between rooms' },
        { keys: ['Tab'], description: 'Navigate between elements' },
        { keys: ['Enter'], description: 'Open room details' },
        { keys: ['Escape'], description: 'Close modals/cancel actions' },
        { keys: ['Home'], description: 'Go to first room' },
        { keys: ['End'], description: 'Go to last room' }
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
        { keys: ['G'], description: 'Switch to grid view' },
        { keys: ['L'], description: 'Switch to list view' },
        { keys: ['Ctrl', '+'], description: 'Zoom in (larger cards)' },
        { keys: ['Ctrl', '-'], description: 'Zoom out (smaller cards)' },
        { keys: ['F11'], description: 'Toggle fullscreen' }
      ]
    },
    {
      title: 'Selection',
      icon: MousePointer,
      shortcuts: [
        { keys: ['Ctrl', 'A'], description: 'Select all rooms' },
        { keys: ['Ctrl', 'D'], description: 'Deselect all rooms' },
        { keys: ['Ctrl', 'Click'], description: 'Toggle room selection' },
        { keys: ['Shift', 'Click'], description: 'Select range of rooms' },
        { keys: ['Space'], description: 'Toggle current room selection' }
      ]
    },
    {
      title: 'Status Changes',
      icon: Check,
      shortcuts: [
        { keys: ['1'], description: 'Set selected rooms to Available', color: 'text-green-600' },
        { keys: ['2'], description: 'Set selected rooms to Occupied', color: 'text-red-600' },
        { keys: ['3'], description: 'Set selected rooms to Cleaning', color: 'text-yellow-600' },
        { keys: ['4'], description: 'Set selected rooms to Maintenance', color: 'text-gray-600' },
        { keys: ['R'], description: 'Quick cleaning request' }
      ]
    },
    {
      title: 'Editing',
      icon: Edit3,
      shortcuts: [
        { keys: ['F2'], description: 'Edit room name' },
        { keys: ['Double Click'], description: 'Inline edit field' },
        { keys: ['Enter'], description: 'Save inline edit' },
        { keys: ['Escape'], description: 'Cancel inline edit' },
        { keys: ['Ctrl', 'S'], description: 'Save changes' }
      ]
    },
    {
      title: 'Actions',
      icon: Zap,
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'Add new room' },
        { keys: ['Ctrl', 'E'], description: 'Edit selected room' },
        { keys: ['Ctrl', 'C'], description: 'Copy room' },
        { keys: ['Ctrl', 'V'], description: 'Paste room' },
        { keys: ['Delete'], description: 'Delete selected rooms' },
        { keys: ['Right Click'], description: 'Open context menu' }
      ]
    },
    {
      title: 'Advanced',
      icon: Settings,
      shortcuts: [
        { keys: ['?'], description: 'Show this help dialog' },
        { keys: ['Ctrl', 'Shift', 'P'], description: 'Command palette' },
        { keys: ['Ctrl', 'R'], description: 'Refresh room data' },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Export selected rooms' },
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight to-blue-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <p className="text-blue-100/80">Master the advanced room management controls</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Close (Escape)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {shortcutCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-sysora-mint/10 rounded-xl">
                      <CategoryIcon className="w-5 h-5 text-sysora-mint" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>

                  {/* Shortcuts List */}
                  <div className="space-y-3">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <div
                        key={shortcutIndex}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className={`font-medium ${shortcut.color || 'text-gray-900'}`}>
                            {shortcut.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
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
          <div className="mt-8 p-6 bg-gradient-to-r from-sysora-mint/10 to-blue-50 rounded-2xl border border-sysora-mint/20">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sysora-mint/20 rounded-xl flex-shrink-0">
                <Zap className="w-5 h-5 text-sysora-mint" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="space-y-2">
                    <p>• <strong>Drag & Drop:</strong> Drag rooms to reorder or change status</p>
                    <p>• <strong>Context Menu:</strong> Right-click any room for quick actions</p>
                    <p>• <strong>Inline Editing:</strong> Double-click prices and names to edit</p>
                  </div>
                  <div className="space-y-2">
                    <p>• <strong>Bulk Operations:</strong> Select multiple rooms for batch actions</p>
                    <p>• <strong>Quick Status:</strong> Use number keys 1-4 for instant status changes</p>
                    <p>• <strong>Smart Search:</strong> Search by room number, name, or description</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>💡 Tip: Press <KeyBadge keyName="?" /> anytime to open this help</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Sysora Advanced Room Management</span>
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

export default KeyboardShortcutsHelp;
