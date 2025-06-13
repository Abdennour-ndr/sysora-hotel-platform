import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Bed, 
  TrendingUp,
  Plus,
  Search,
  Settings,
  Bell,
  Coffee,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  Zap,
  BarChart3,
  Camera,
  Wifi,
  Car,
  Utensils
} from 'lucide-react';

const QuickActions = ({ onActionClick, data }) => {
  const [showAllActions, setShowAllActions] = useState(false);

  const primaryActions = [
    {
      id: 'new-reservation',
      title: 'New Reservation',
      description: 'Create a new booking',
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      action: () => onActionClick('reservations'),
      shortcut: 'Ctrl+N'
    },
    {
      id: 'add-guest',
      title: 'Add Guest',
      description: 'Register new guest',
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      action: () => onActionClick('add-guest'),
      shortcut: 'Ctrl+G'
    },
    {
      id: 'manage-rooms',
      title: 'Manage Rooms',
      description: 'Room status & settings',
      icon: Bed,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => onActionClick('rooms'),
      shortcut: 'Ctrl+R'
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      action: () => onActionClick('analytics'),
      shortcut: 'Ctrl+A'
    }
  ];

  const secondaryActions = [
    {
      id: 'quick-checkin',
      title: 'Quick Check-in',
      description: 'Fast guest check-in',
      icon: Plus,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      action: () => onActionClick('quick-checkin')
    },
    {
      id: 'search-guest',
      title: 'Search Guest',
      description: 'Find guest records',
      icon: Search,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      action: () => onActionClick('search-guest')
    },
    {
      id: 'room-service',
      title: 'Room Service',
      description: 'Manage orders',
      icon: Coffee,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      action: () => onActionClick('services')
    },
    {
      id: 'payments',
      title: 'Process Payment',
      description: 'Handle transactions',
      icon: CreditCard,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      action: () => onActionClick('payments')
    },
    {
      id: 'maintenance',
      title: 'Maintenance Request',
      description: 'Report issues',
      icon: Settings,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      action: () => onActionClick('maintenance')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View alerts',
      icon: Bell,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      action: () => onActionClick('notifications')
    },
    {
      id: 'security',
      title: 'Security Center',
      description: 'Access controls',
      icon: Shield,
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      action: () => onActionClick('security')
    },
    {
      id: 'optimization',
      title: 'Performance Hub',
      description: 'System optimization',
      icon: Zap,
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      action: () => onActionClick('optimization')
    }
  ];

  const utilityActions = [
    {
      id: 'contact-guest',
      title: 'Contact Guest',
      description: 'Call or message',
      icon: Phone,
      color: 'bg-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500'
    },
    {
      id: 'send-email',
      title: 'Send Email',
      description: 'Email communications',
      icon: Mail,
      color: 'bg-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500'
    },
    {
      id: 'location-services',
      title: 'Location Services',
      description: 'Maps & directions',
      icon: MapPin,
      color: 'bg-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-500'
    },
    {
      id: 'schedule',
      title: 'Schedule Manager',
      description: 'Staff scheduling',
      icon: Clock,
      color: 'bg-orange-400',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-500'
    }
  ];

  const actionsToShow = showAllActions 
    ? [...primaryActions, ...secondaryActions, ...utilityActions]
    : primaryActions;

  const getUrgentActions = () => {
    const urgent = [];
    
    if (data?.today?.pendingReservations > 10) {
      urgent.push({
        title: 'High Pending Reservations',
        description: `${data.today.pendingReservations} reservations need attention`,
        action: () => onActionClick('reservations'),
        priority: 'high'
      });
    }
    
    if (data?.today?.maintenanceRequests > 5) {
      urgent.push({
        title: 'Multiple Maintenance Requests',
        description: `${data.today.maintenanceRequests} requests pending`,
        action: () => onActionClick('maintenance'),
        priority: 'medium'
      });
    }
    
    if (data?.overview?.occupancyRate > 90) {
      urgent.push({
        title: 'High Occupancy Alert',
        description: 'Consider overbooking management',
        action: () => onActionClick('rooms'),
        priority: 'medium'
      });
    }
    
    return urgent;
  };

  const urgentActions = getUrgentActions();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sysora-midnight">Quick Actions</h3>
        <button
          onClick={() => setShowAllActions(!showAllActions)}
          className="text-sm text-sysora-mint hover:text-sysora-midnight transition-colors"
        >
          {showAllActions ? 'Show Less' : 'Show All'}
        </button>
      </div>

      {/* Urgent Actions Alert */}
      {urgentActions.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Urgent Actions Required
          </h4>
          <div className="space-y-2">
            {urgentActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full text-left p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
              >
                <p className="text-sm font-medium text-red-800">{action.title}</p>
                <p className="text-xs text-red-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Actions Grid */}
      <div className={`grid ${showAllActions ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'} gap-4`}>
        {actionsToShow.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-4 ${action.bgColor} rounded-2xl text-center hover:shadow-md transition-all duration-200 group relative`}
              title={action.shortcut ? `${action.description} (${action.shortcut})` : action.description}
            >
              <Icon className={`w-6 h-6 ${action.textColor} mx-auto mb-2 group-hover:scale-110 transition-transform duration-200`} />
              <span className="text-sm font-medium text-sysora-midnight block">{action.title}</span>
              {!showAllActions && (
                <span className="text-xs text-gray-500 block mt-1">{action.description}</span>
              )}
              {action.shortcut && (
                <span className="absolute top-1 right-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.shortcut.replace('Ctrl+', '⌘')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      {!showAllActions && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-sysora-midnight mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Available Rooms</p>
              <p className="text-lg font-bold text-blue-600">{data?.overview?.availableRooms || 0}</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Today's Arrivals</p>
              <p className="text-lg font-bold text-green-600">{data?.today?.checkIns || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      {showAllActions && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {primaryActions.filter(a => a.shortcut).map(action => (
              <div key={action.id} className="flex justify-between">
                <span>{action.title}</span>
                <span className="font-mono">{action.shortcut}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
