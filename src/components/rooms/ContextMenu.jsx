import React, { useEffect, useRef } from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  Sparkles,
  Wrench,
  Users,
  Check,
  Image,
  DollarSign,
  Settings,
  Calendar,
  BarChart3,
  FileText,
  Star,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';

const ContextMenu = ({ x, y, room, onClose, onStatusChange, onEdit }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu within viewport
  const adjustPosition = () => {
    if (!menuRef.current) return { x, y };

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (x + menuRect.width > viewportWidth) {
      adjustedX = x - menuRect.width;
    }

    // Adjust vertical position
    if (y + menuRect.height > viewportHeight) {
      adjustedY = y - menuRect.height;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const position = adjustPosition();

  const menuItems = [
    {
      group: 'View & Edit',
      items: [
        {
          icon: Eye,
          label: 'View Details',
          shortcut: 'Enter',
          action: () => {
            console.log('View room details:', room.id);
            onClose();
          }
        },
        {
          icon: Edit3,
          label: 'Edit Room',
          shortcut: 'F2',
          action: () => {
            console.log('Edit room:', room.id);
            onClose();
          }
        },
        {
          icon: Image,
          label: 'Manage Images',
          action: () => {
            console.log('Manage images:', room.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Quick Actions',
      items: [
        {
          icon: DollarSign,
          label: 'Edit Price',
          action: () => {
            onEdit('basePrice');
            onClose();
          }
        },
        {
          icon: Edit3,
          label: 'Edit Name',
          action: () => {
            onEdit('name');
            onClose();
          }
        },
        {
          icon: FileText,
          label: 'Edit Description',
          action: () => {
            onEdit('description');
            onClose();
          }
        }
      ]
    },
    {
      group: 'Status Changes',
      items: [
        {
          icon: Check,
          label: 'Set Available',
          shortcut: '1',
          color: 'text-green-600',
          disabled: room.status === 'available',
          action: () => {
            onStatusChange(room.id, 'available');
            onClose();
          }
        },
        {
          icon: Users,
          label: 'Set Occupied',
          shortcut: '2',
          color: 'text-red-600',
          disabled: room.status === 'occupied',
          action: () => {
            onStatusChange(room.id, 'occupied');
            onClose();
          }
        },
        {
          icon: Sparkles,
          label: 'Request Cleaning',
          shortcut: '3',
          color: 'text-yellow-600',
          disabled: room.status === 'cleaning',
          action: () => {
            onStatusChange(room.id, 'cleaning');
            onClose();
          }
        },
        {
          icon: Wrench,
          label: 'Request Maintenance',
          shortcut: '4',
          color: 'text-gray-600',
          disabled: room.status === 'maintenance',
          action: () => {
            onStatusChange(room.id, 'maintenance');
            onClose();
          }
        }
      ]
    },
    {
      group: 'Operations',
      items: [
        {
          icon: Copy,
          label: 'Duplicate Room',
          shortcut: 'Ctrl+D',
          action: () => {
            console.log('Duplicate room:', room.id);
            onClose();
          }
        },
        {
          icon: Calendar,
          label: 'View Schedule',
          action: () => {
            console.log('View room schedule:', room.id);
            onClose();
          }
        },
        {
          icon: BarChart3,
          label: 'View Analytics',
          action: () => {
            console.log('View room analytics:', room.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Advanced',
      items: [
        {
          icon: Settings,
          label: 'Room Settings',
          action: () => {
            console.log('Room settings:', room.id);
            onClose();
          }
        },
        {
          icon: Star,
          label: 'Add to Favorites',
          action: () => {
            console.log('Add to favorites:', room.id);
            onClose();
          }
        },
        {
          icon: Zap,
          label: 'Quick Actions',
          action: () => {
            console.log('Quick actions:', room.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Danger Zone',
      items: [
        {
          icon: Trash2,
          label: 'Delete Room',
          shortcut: 'Del',
          color: 'text-red-600 hover:bg-red-50',
          action: () => {
            if (window.confirm(`Are you sure you want to delete room ${room.number}?`)) {
              console.log('Delete room:', room.id);
              onClose();
            }
          }
        }
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={menuRef}
        className="absolute bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 min-w-[280px] max-w-[320px] z-50"
        style={{
          left: position.x,
          top: position.y,
          pointerEvents: 'auto'
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sysora-mint/10 rounded-xl flex items-center justify-center">
              <span className="text-sysora-mint font-bold">{room.number}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{room.name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {room.type} • {room.status}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-h-96 overflow-y-auto">
          {menuItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Header */}
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                {group.group}
              </div>
              
              {/* Group Items */}
              <div className="py-1">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      disabled={item.disabled}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                        ${item.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : `text-gray-700 hover:bg-gray-50 ${item.color || ''}`
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {item.shortcut && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3" />
              <span>Floor {room.floor}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;
