// Consistent UI Components with Design Tokens
import React from 'react';
import { designTokens, getIconSize, getStatusColor, componentClasses } from '../../utils/designTokens';
import { cn } from '../../utils/cn';

// Consistent Icon Component
export const Icon = ({ 
  icon: IconComponent, 
  size = 'md', 
  className,
  ...props 
}) => {
  if (!IconComponent) return null;
  
  return (
    <IconComponent 
      className={cn(getIconSize(size), className)} 
      {...props} 
    />
  );
};

// Consistent Status Badge
export const ConsistentStatusBadge = ({ 
  status, 
  children, 
  icon: IconComponent,
  className 
}) => {
  const statusConfig = designTokens.colors.status[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border",
        statusConfig?.light,
        statusConfig?.text,
        statusConfig?.border,
        className
      )}
    >
      {IconComponent && (
        <Icon 
          icon={IconComponent} 
          size="xs" 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  );
};

// Consistent Stat Card
export const ConsistentStatCard = ({ 
  title, 
  value, 
  icon: IconComponent, 
  color = 'blue',
  onClick,
  className 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div
      className={cn(
        componentClasses.statCard,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          designTokens.components.statCard.iconContainer,
          colorClasses[color]
        )}>
          <Icon icon={IconComponent} size="lg" />
        </div>
        <div>
          <p className={designTokens.components.statCard.valueText}>
            {value}
          </p>
          <p className={designTokens.components.statCard.labelText}>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

// Consistent Action Button
export const ConsistentActionButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: IconComponent,
  loading,
  className,
  ...props 
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium",
    designTokens.components.button.transition,
    designTokens.components.button.focus,
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const variants = {
    primary: cn(
      designTokens.components.button.padding[size],
      designTokens.components.button.radius,
      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-sm"
    ),
    secondary: cn(
      designTokens.components.button.padding[size],
      designTokens.components.button.radius,
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm"
    ),
    ghost: cn(
      designTokens.components.button.padding[size],
      designTokens.components.button.radius,
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
    ),
    danger: cn(
      designTokens.components.button.padding[size],
      designTokens.components.button.radius,
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
    )
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {IconComponent && !loading && (
        <Icon 
          icon={IconComponent} 
          size="sm" 
          className={children ? "mr-2" : ""} 
        />
      )}
      {children}
    </button>
  );
};

// Consistent Room Card
export const ConsistentRoomCard = ({ 
  room, 
  onStatusChange, 
  onViewDetails, 
  actionLoading, 
  statusConfig,
  bulkSelection,
  setBulkSelection,
  className 
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const StatusIcon = statusConfig[room.status]?.icon;
  const isSelected = bulkSelection?.includes(room._id);

  const handleBulkSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setBulkSelection(prev => prev.filter(id => id !== room._id));
    } else {
      setBulkSelection(prev => [...prev, room._id]);
    }
  };

  return (
    <div className={cn(componentClasses.roomCard, className)}>
      <div className={componentClasses.card}>
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleBulkSelect}
            className="rounded border-gray-300"
          />
        </div>

        {/* Room Header */}
        <div className={cn(designTokens.components.roomCard.header, "ml-6")}>
          <div className="flex items-center space-x-3">
            <div className={designTokens.components.roomCard.roomNumber}>
              <span className="text-white font-bold">{room.number}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
              <p className="text-sm text-gray-600 capitalize">{room.type}</p>
              <p className="text-xs text-gray-500">Floor {room.floor || 1}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Icon 
              icon={StatusIcon} 
              size="md"
              className={cn(
                room.status === 'available' ? "text-emerald-600" :
                room.status === 'occupied' ? "text-blue-600" :
                room.status === 'cleaning' ? "text-amber-600" :
                room.status === 'maintenance' ? "text-red-600" :
                "text-gray-600"
              )}
            />
            <button
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <Icon icon={require('lucide-react').MoreHorizontal} size="sm" className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Room Status */}
        <div className="mb-4">
          <ConsistentStatusBadge 
            status={room.status}
            icon={StatusIcon}
          >
            {room.status.charAt(0).toUpperCase() + room.status.slice(1).replace('_', ' ')}
          </ConsistentStatusBadge>
        </div>

        {/* Room Details */}
        <div className="space-y-2 mb-4">
          {room.currentGuest && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon icon={require('lucide-react').User} size="sm" />
              <span>{room.currentGuest}</span>
            </div>
          )}

          {room.rate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon icon={require('lucide-react').DollarSign} size="sm" />
              <span>${room.rate}/night</span>
            </div>
          )}

          {room.amenities && room.amenities.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon icon={require('lucide-react').Coffee} size="sm" />
              <span>{room.amenities.slice(0, 2).join(', ')}{room.amenities.length > 2 ? '...' : ''}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={designTokens.components.roomCard.actions}>
          <ConsistentActionButton
            variant="secondary"
            size="sm"
            icon={require('lucide-react').Eye}
            onClick={() => onViewDetails(room)}
            className="flex-1"
          >
            Details
          </ConsistentActionButton>

          {statusConfig[room.status]?.actions?.includes('assign') && (
            <ConsistentActionButton
              variant="primary"
              size="sm"
              onClick={() => onStatusChange(room._id, 'occupied')}
              loading={actionLoading}
              className="flex-1"
            >
              Assign
            </ConsistentActionButton>
          )}

          {statusConfig[room.status]?.actions?.includes('checkout') && (
            <ConsistentActionButton
              variant="secondary"
              size="sm"
              onClick={() => onStatusChange(room._id, 'cleaning')}
              loading={actionLoading}
              className="flex-1"
            >
              Check Out
            </ConsistentActionButton>
          )}

          {statusConfig[room.status]?.actions?.includes('complete') && (
            <ConsistentActionButton
              variant="primary"
              size="sm"
              onClick={() => onStatusChange(room._id, 'available')}
              loading={actionLoading}
              className="flex-1"
            >
              Complete
            </ConsistentActionButton>
          )}
        </div>

        {/* Expanded Actions */}
        {showActions && (
          <div className={designTokens.components.roomCard.expandedActions}>
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={require('lucide-react').Wrench}
              onClick={() => onStatusChange(room._id, 'maintenance')}
              className="w-full justify-start"
            >
              Mark for Maintenance
            </ConsistentActionButton>
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={require('lucide-react').Edit}
              className="w-full justify-start"
            >
              Edit Room
            </ConsistentActionButton>
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={require('lucide-react').History}
              className="w-full justify-start"
            >
              View History
            </ConsistentActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

// Consistent Input Component
export const ConsistentInput = ({ 
  icon: IconComponent,
  error,
  className,
  ...props 
}) => (
  <div className="relative">
    {IconComponent && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon icon={IconComponent} size="sm" className="text-gray-400" />
      </div>
    )}
    <input
      className={cn(
        componentClasses.input,
        IconComponent && "pl-10",
        error && "border-red-300 focus:ring-red-500",
        className
      )}
      {...props}
    />
  </div>
);

// Consistent Notification
export const ConsistentNotification = ({ 
  type = 'info', 
  message, 
  onClose,
  className 
}) => {
  const typeConfig = {
    success: { border: 'border-l-emerald-500', bg: 'bg-white' },
    error: { border: 'border-l-red-500', bg: 'bg-white' },
    warning: { border: 'border-l-amber-500', bg: 'bg-white' },
    info: { border: 'border-l-blue-500', bg: 'bg-white' }
  };

  return (
    <div
      className={cn(
        designTokens.components.notification.padding,
        designTokens.components.notification.radius,
        designTokens.components.notification.shadow,
        designTokens.components.notification.border,
        designTokens.components.notification.maxWidth,
        typeConfig[type].bg,
        typeConfig[type].border,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon={require('lucide-react').X} size="sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  Icon,
  ConsistentStatusBadge,
  ConsistentStatCard,
  ConsistentActionButton,
  ConsistentRoomCard,
  ConsistentInput,
  ConsistentNotification
};
