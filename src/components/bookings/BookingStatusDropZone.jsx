import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  Check,
  Users,
  Eye,
  X,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  FileText,
  Bell
} from 'lucide-react';

const BookingStatusDropZone = ({ status, count, onStatusChange, getStatusColor, getStatusIcon }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `status-${status}`,
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          description: 'Awaiting confirmation',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          hoverBg: 'hover:bg-yellow-100',
          activeBg: 'bg-yellow-100',
          gradient: 'from-yellow-50 to-yellow-100'
        };
      case 'confirmed':
        return {
          icon: Check,
          label: 'Confirmed',
          description: 'Booking confirmed',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          hoverBg: 'hover:bg-blue-100',
          activeBg: 'bg-blue-100',
          gradient: 'from-blue-50 to-blue-100'
        };
      case 'checked_in':
        return {
          icon: Users,
          label: 'Checked In',
          description: 'Guest arrived',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          hoverBg: 'hover:bg-green-100',
          activeBg: 'bg-green-100',
          gradient: 'from-green-50 to-green-100'
        };
      case 'checked_out':
        return {
          icon: Eye,
          label: 'Checked Out',
          description: 'Stay completed',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          hoverBg: 'hover:bg-gray-100',
          activeBg: 'bg-gray-100',
          gradient: 'from-gray-50 to-gray-100'
        };
      case 'cancelled':
        return {
          icon: X,
          label: 'Cancelled',
          description: 'Booking cancelled',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          hoverBg: 'hover:bg-red-100',
          activeBg: 'bg-red-100',
          gradient: 'from-red-50 to-red-100'
        };
      case 'no_show':
        return {
          icon: AlertCircle,
          label: 'No Show',
          description: 'Guest did not arrive',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          hoverBg: 'hover:bg-orange-100',
          activeBg: 'bg-orange-100',
          gradient: 'from-orange-50 to-orange-100'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'Unknown',
          description: 'Unknown status',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          hoverBg: 'hover:bg-gray-100',
          activeBg: 'bg-gray-100',
          gradient: 'from-gray-50 to-gray-100'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  // Mock statistics for each status
  const getStatusStats = (status) => {
    switch (status) {
      case 'pending':
        return {
          todayCount: Math.floor(Math.random() * 5) + 1,
          avgProcessTime: '2.5 hrs',
          conversionRate: '85%'
        };
      case 'confirmed':
        return {
          todayCount: Math.floor(Math.random() * 8) + 2,
          avgProcessTime: '1.2 hrs',
          conversionRate: '92%'
        };
      case 'checked_in':
        return {
          todayCount: Math.floor(Math.random() * 6) + 1,
          avgProcessTime: '15 min',
          conversionRate: '98%'
        };
      case 'checked_out':
        return {
          todayCount: Math.floor(Math.random() * 4) + 1,
          avgProcessTime: '20 min',
          conversionRate: '100%'
        };
      case 'cancelled':
        return {
          todayCount: Math.floor(Math.random() * 3),
          avgProcessTime: '30 min',
          conversionRate: '0%'
        };
      case 'no_show':
        return {
          todayCount: Math.floor(Math.random() * 2),
          avgProcessTime: '2 hrs',
          conversionRate: '0%'
        };
      default:
        return {
          todayCount: 0,
          avgProcessTime: '0 min',
          conversionRate: '0%'
        };
    }
  };

  const stats = getStatusStats(status);

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-3 sm:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${config.bgColor} ${config.borderColor} ${config.hoverBg}
        ${isOver ? `${config.activeBg} border-dashed scale-105 shadow-lg` : 'border-solid'}
        group hover:shadow-md
      `}
    >
      {/* Drop Indicator */}
      {isOver && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-sysora-mint bg-sysora-mint/5 flex items-center justify-center">
          <div className="text-sysora-mint font-semibold text-sm animate-pulse">
            Drop to change status
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`transition-opacity duration-200 ${isOver ? 'opacity-50' : 'opacity-100'}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 sm:p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
              <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-xs sm:text-sm font-bold ${config.textColor} truncate`}>
                {config.label}
              </h3>
              <p className={`text-xs ${config.textColor} opacity-70 hidden sm:block`}>
                {config.description}
              </p>
            </div>
          </div>

          {/* Count Badge */}
          <div className={`
            px-2 sm:px-3 py-1 rounded-lg font-bold text-base sm:text-lg
            ${config.bgColor} ${config.textColor} border ${config.borderColor}
            group-hover:scale-110 transition-transform duration-200 self-end sm:self-auto
          `}>
            {count}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium ${config.textColor}`}>
              Distribution
            </span>
            <span className={`text-xs ${config.textColor} opacity-70`}>
              {count} bookings
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-1.5 border border-gray-200">
            <div
              className={`h-1.5 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
              style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
          <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Calendar className={`w-3 h-3 ${config.iconColor}`} />
                <span className={`text-xs font-medium ${config.textColor}`}>
                  Today
                </span>
              </div>
              <span className={`text-xs font-bold ${config.textColor}`}>
                +{stats.todayCount}
              </span>
            </div>
          </div>

          <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Activity className={`w-3 h-3 ${config.iconColor}`} />
                <span className={`text-xs font-medium ${config.textColor}`}>
                  Avg Time
                </span>
              </div>
              <span className={`text-xs font-bold ${config.textColor}`}>
                {stats.avgProcessTime}
              </span>
            </div>
          </div>
        </div>

        {/* Status-specific Information */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          {status === 'pending' && (
            <div className="flex items-center space-x-1">
              <Bell className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} awaiting confirmation
              </span>
            </div>
          )}
          
          {status === 'confirmed' && (
            <div className="flex items-center space-x-1">
              <Check className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} confirmed today
              </span>
            </div>
          )}
          
          {status === 'checked_in' && (
            <div className="flex items-center space-x-1">
              <Users className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} arrivals today
              </span>
            </div>
          )}
          
          {status === 'checked_out' && (
            <div className="flex items-center space-x-1">
              <Eye className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} departures today
              </span>
            </div>
          )}
          
          {status === 'cancelled' && (
            <div className="flex items-center space-x-1">
              <X className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} cancelled today
              </span>
            </div>
          )}
          
          {status === 'no_show' && (
            <div className="flex items-center space-x-1">
              <AlertCircle className={`w-3 h-3 ${config.iconColor}`} />
              <span className={`text-xs ${config.textColor}`}>
                {stats.todayCount} no-shows today
              </span>
            </div>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${config.textColor} opacity-50`}>
              Drag bookings here
            </span>
            <div className={`
              px-1.5 py-0.5 rounded text-xs font-mono
              ${config.bgColor} ${config.textColor} border ${config.borderColor}
            `}>
              {status === 'pending' ? 'P' :
               status === 'confirmed' ? 'C' :
               status === 'checked_in' ? 'I' :
               status === 'checked_out' ? 'O' :
               status === 'cancelled' ? 'X' : 'N'}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br ${config.gradient} pointer-events-none
      `} />
    </div>
  );
};

export default BookingStatusDropZone;
