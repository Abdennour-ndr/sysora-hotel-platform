import React, { useEffect, useRef } from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  CreditCard,
  FileText,
  Users,
  Check,
  X,
  Clock,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  Bed,
  Settings,
  Star,
  MapPin,
  Bell,
  Zap,
  DollarSign,
  Download,
  Send,
  UserCheck,
  UserX,
  RefreshCw
} from 'lucide-react';

const BookingContextMenu = ({ x, y, booking, onClose, onStatusChange, onEdit }) => {
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

  const formatCurrency = (amount, currency = 'DZD') => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRemainingBalance = () => {
    return booking.totalAmount - booking.paidAmount;
  };

  const menuItems = [
    {
      group: 'View & Edit',
      items: [
        {
          icon: Eye,
          label: 'View Details',
          shortcut: 'Enter',
          action: () => {
            console.log('View booking details:', booking.id);
            onClose();
          }
        },
        {
          icon: Edit3,
          label: 'Edit Booking',
          shortcut: 'F2',
          action: () => {
            console.log('Edit booking:', booking.id);
            onClose();
          }
        },
        {
          icon: Calendar,
          label: 'Modify Dates',
          action: () => {
            console.log('Modify dates:', booking.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Quick Edit',
      items: [
        {
          icon: DollarSign,
          label: 'Edit Amount',
          action: () => {
            onEdit('totalAmount');
            onClose();
          }
        },
        {
          icon: Users,
          label: 'Edit Guest Info',
          action: () => {
            onEdit('guestName');
            onClose();
          }
        },
        {
          icon: FileText,
          label: 'Edit Notes',
          action: () => {
            onEdit('notes');
            onClose();
          }
        },
        {
          icon: Bed,
          label: 'Change Room',
          action: () => {
            console.log('Change room:', booking.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Status Changes',
      items: [
        {
          icon: Clock,
          label: 'Set Pending',
          shortcut: 'P',
          color: 'text-yellow-600',
          disabled: booking.status === 'pending',
          action: () => {
            onStatusChange(booking.id, 'pending');
            onClose();
          }
        },
        {
          icon: Check,
          label: 'Confirm Booking',
          shortcut: 'C',
          color: 'text-blue-600',
          disabled: booking.status === 'confirmed',
          action: () => {
            onStatusChange(booking.id, 'confirmed');
            onClose();
          }
        },
        {
          icon: UserCheck,
          label: 'Check In',
          shortcut: 'I',
          color: 'text-green-600',
          disabled: booking.status === 'checked_in',
          action: () => {
            onStatusChange(booking.id, 'checked_in');
            onClose();
          }
        },
        {
          icon: UserX,
          label: 'Check Out',
          shortcut: 'O',
          color: 'text-gray-600',
          disabled: booking.status === 'checked_out',
          action: () => {
            onStatusChange(booking.id, 'checked_out');
            onClose();
          }
        },
        {
          icon: X,
          label: 'Cancel Booking',
          shortcut: 'X',
          color: 'text-red-600',
          disabled: booking.status === 'cancelled',
          action: () => {
            onStatusChange(booking.id, 'cancelled');
            onClose();
          }
        },
        {
          icon: AlertCircle,
          label: 'Mark No Show',
          shortcut: 'N',
          color: 'text-orange-600',
          disabled: booking.status === 'no_show',
          action: () => {
            onStatusChange(booking.id, 'no_show');
            onClose();
          }
        }
      ]
    },
    {
      group: 'Payment & Billing',
      items: [
        {
          icon: CreditCard,
          label: 'Process Payment',
          action: () => {
            console.log('Process payment:', booking.id);
            onClose();
          }
        },
        {
          icon: FileText,
          label: 'Generate Invoice',
          action: () => {
            console.log('Generate invoice:', booking.id);
            onClose();
          }
        },
        {
          icon: Download,
          label: 'Download Receipt',
          action: () => {
            console.log('Download receipt:', booking.id);
            onClose();
          }
        },
        {
          icon: RefreshCw,
          label: 'Refund Payment',
          color: 'text-orange-600',
          disabled: booking.paidAmount === 0,
          action: () => {
            console.log('Refund payment:', booking.id);
            onClose();
          }
        }
      ]
    },
    {
      group: 'Communication',
      items: [
        {
          icon: Mail,
          label: 'Send Email',
          action: () => {
            console.log('Send email to:', booking.guestEmail);
            onClose();
          }
        },
        {
          icon: Phone,
          label: 'Call Guest',
          action: () => {
            console.log('Call guest:', booking.guestPhone);
            onClose();
          }
        },
        {
          icon: Send,
          label: 'Send Confirmation',
          action: () => {
            console.log('Send confirmation:', booking.id);
            onClose();
          }
        },
        {
          icon: Bell,
          label: 'Send Reminder',
          action: () => {
            console.log('Send reminder:', booking.id);
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
          label: 'Duplicate Booking',
          shortcut: 'Ctrl+D',
          action: () => {
            console.log('Duplicate booking:', booking.id);
            onClose();
          }
        },
        {
          icon: Star,
          label: 'Add to Favorites',
          action: () => {
            console.log('Add to favorites:', booking.id);
            onClose();
          }
        },
        {
          icon: Settings,
          label: 'Booking Settings',
          action: () => {
            console.log('Booking settings:', booking.id);
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
          label: 'Delete Booking',
          shortcut: 'Del',
          color: 'text-red-600 hover:bg-red-50',
          action: () => {
            if (window.confirm(`Are you sure you want to delete booking ${booking.reservationNumber}?`)) {
              console.log('Delete booking:', booking.id);
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
        className="absolute bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 min-w-[300px] max-w-[350px] z-50"
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
              <Calendar className="w-5 h-5 text-sysora-mint" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{booking.reservationNumber}</h3>
              <p className="text-sm text-gray-500">{booking.guestName}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">Room {booking.roomNumber}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 capitalize">
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-blue-600 font-medium">Total Amount</div>
              <div className="text-blue-800 font-bold">
                {formatCurrency(booking.totalAmount, booking.currency)}
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <div className="text-green-600 font-medium">
                {getRemainingBalance() > 0 ? 'Remaining' : 'Paid'}
              </div>
              <div className={`font-bold ${getRemainingBalance() > 0 ? 'text-red-600' : 'text-green-800'}`}>
                {getRemainingBalance() > 0 
                  ? formatCurrency(getRemainingBalance(), booking.currency)
                  : 'Fully Paid'
                }
              </div>
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
              <span>
                {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingContextMenu;
