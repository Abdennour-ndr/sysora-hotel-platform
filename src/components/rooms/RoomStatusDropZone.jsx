import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  Check,
  Users,
  Sparkles,
  Wrench,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

const RoomStatusDropZone = ({ status, count, onStatusChange }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `status-${status}`,
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'available':
        return {
          icon: Check,
          label: 'Available',
          description: 'Ready for guests',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          hoverBg: 'hover:bg-green-100',
          activeBg: 'bg-green-100',
          gradient: 'from-green-50 to-green-100'
        };
      case 'occupied':
        return {
          icon: Users,
          label: 'Occupied',
          description: 'Guest checked in',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          hoverBg: 'hover:bg-red-100',
          activeBg: 'bg-red-100',
          gradient: 'from-red-50 to-red-100'
        };
      case 'cleaning':
        return {
          icon: Sparkles,
          label: 'Cleaning',
          description: 'Being cleaned',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          hoverBg: 'hover:bg-yellow-100',
          activeBg: 'bg-yellow-100',
          gradient: 'from-yellow-50 to-yellow-100'
        };
      case 'maintenance':
        return {
          icon: Wrench,
          label: 'Maintenance',
          description: 'Under repair',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          hoverBg: 'hover:bg-gray-100',
          activeBg: 'bg-gray-100',
          gradient: 'from-gray-50 to-gray-100'
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

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${config.bgColor} ${config.borderColor} ${config.hoverBg}
        ${isOver ? `${config.activeBg} border-dashed scale-105 shadow-lg` : 'border-solid'}
        group hover:shadow-md
      `}
    >
      {/* Drop Indicator */}
      {isOver && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-sysora-mint bg-sysora-mint/5 flex items-center justify-center">
          <div className="text-sysora-mint font-semibold text-lg animate-pulse">
            Drop to change status
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`transition-opacity duration-200 ${isOver ? 'opacity-50' : 'opacity-100'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {config.label}
              </h3>
              <p className={`text-sm ${config.textColor} opacity-70`}>
                {config.description}
              </p>
            </div>
          </div>
          
          {/* Count Badge */}
          <div className={`
            px-4 py-2 rounded-xl font-bold text-2xl
            ${config.bgColor} ${config.textColor} border ${config.borderColor}
            group-hover:scale-110 transition-transform duration-200
          `}>
            {count}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${config.textColor}`}>
              Room Distribution
            </span>
            <span className={`text-sm ${config.textColor} opacity-70`}>
              {count} rooms
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2 border border-gray-200">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
              style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-4 h-4 ${config.iconColor}`} />
              <div>
                <div className={`text-sm font-semibold ${config.textColor}`}>
                  Today
                </div>
                <div className={`text-xs ${config.textColor} opacity-70`}>
                  +{Math.floor(Math.random() * 5)} changes
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-center space-x-2">
              <Activity className={`w-4 h-4 ${config.iconColor}`} />
              <div>
                <div className={`text-sm font-semibold ${config.textColor}`}>
                  Avg Time
                </div>
                <div className={`text-xs ${config.textColor} opacity-70`}>
                  {status === 'cleaning' ? '45min' : 
                   status === 'maintenance' ? '2.5hrs' :
                   status === 'occupied' ? '2.1 days' : '1.2hrs'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific Information */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          {status === 'available' && (
            <div className="flex items-center space-x-2">
              <Check className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm ${config.textColor}`}>
                Ready for immediate booking
              </span>
            </div>
          )}
          
          {status === 'occupied' && (
            <div className="flex items-center space-x-2">
              <Clock className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm ${config.textColor}`}>
                {Math.floor(Math.random() * 3) + 1} checkout(s) today
              </span>
            </div>
          )}
          
          {status === 'cleaning' && (
            <div className="flex items-center space-x-2">
              <Sparkles className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm ${config.textColor}`}>
                {Math.floor(Math.random() * 2) + 1} in progress
              </span>
            </div>
          )}
          
          {status === 'maintenance' && (
            <div className="flex items-center space-x-2">
              <Wrench className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm ${config.textColor}`}>
                {Math.floor(Math.random() * 2) + 1} pending repair(s)
              </span>
            </div>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${config.textColor} opacity-50`}>
              Drag rooms here to change status
            </span>
            <div className={`
              px-2 py-1 rounded text-xs font-mono
              ${config.bgColor} ${config.textColor} border ${config.borderColor}
            `}>
              {status === 'available' ? '1' :
               status === 'occupied' ? '2' :
               status === 'cleaning' ? '3' : '4'}
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

export default RoomStatusDropZone;
