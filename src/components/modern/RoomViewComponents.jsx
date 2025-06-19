import React from 'react';
import {
  User,
  DollarSign,
  Clock,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Wrench,
  AlertTriangle,
  Bed
} from 'lucide-react';
import { Button, StatusBadge, LoadingSpinner } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

// Room List Row Component
export const RoomListRow = ({ 
  room, 
  onStatusChange, 
  onViewDetails, 
  actionLoading, 
  statusConfig,
  bulkSelection,
  setBulkSelection 
}) => {
  const isSelected = bulkSelection.includes(room._id);
  const StatusIcon = statusConfig[room.status]?.icon || Bed;

  const handleBulkSelect = (e) => {
    if (isSelected) {
      setBulkSelection(prev => prev.filter(id => id !== room._id));
    } else {
      setBulkSelection(prev => [...prev, room._id]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleBulkSelect}
          className="rounded border-gray-300"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{room.number}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Room {room.number}</div>
            <div className="text-sm text-gray-500">Floor {room.floor || 1}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 capitalize">{room.type}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <StatusIcon className={cn(
            "w-4 h-4",
            room.status === 'available' ? "text-emerald-600" :
            room.status === 'occupied' ? "text-blue-600" :
            room.status === 'cleaning' ? "text-amber-600" :
            room.status === 'maintenance' ? "text-red-600" :
            "text-gray-600"
          )} />
          <StatusBadge status={statusConfig[room.status]?.color || 'neutral'}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1).replace('_', ' ')}
          </StatusBadge>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {room.currentGuest || (
            <span className="text-gray-400 italic">No guest</span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {room.rate ? `$${room.rate}` : (
            <span className="text-gray-400 italic">Not set</span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDate(room.lastUpdated)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(room)}
            className="p-1"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {room.status === 'available' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStatusChange(room._id, 'occupied')}
              disabled={actionLoading}
              className="text-xs px-2 py-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Assign'}
            </Button>
          )}
          
          {room.status === 'occupied' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(room._id, 'cleaning')}
              disabled={actionLoading}
              className="text-xs px-2 py-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Check Out'}
            </Button>
          )}
          
          {room.status === 'cleaning' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="text-xs px-2 py-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Complete'}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// Floor Plan View Component
export const FloorPlanView = ({ rooms, floors, onRoomClick, statusConfig }) => {
  const getRoomsByFloor = (floor) => {
    return rooms.filter(room => (room.floor || 1) === floor);
  };

  const getRoomColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'occupied':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cleaning':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'maintenance':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'out_of_order':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {floors.map((floor) => {
        const floorRooms = getRoomsByFloor(floor);
        
        return (
          <div key={floor} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Floor {floor}
              </h3>
              <div className="text-sm text-gray-600">
                {floorRooms.length} rooms
              </div>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {floorRooms.map((room) => {
                const StatusIcon = statusConfig[room.status]?.icon || Bed;
                
                return (
                  <button
                    key={room._id}
                    onClick={() => onRoomClick(room)}
                    className={cn(
                      "relative p-3 rounded-lg border-2 transition-all hover:shadow-md group",
                      getRoomColor(room.status)
                    )}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm mb-1">{room.number}</div>
                      <StatusIcon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs opacity-75 capitalize">
                        {room.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    {room.currentGuest && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Room {room.number} - {room.type}
                      {room.currentGuest && (
                        <div>Guest: {room.currentGuest}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {floorRooms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No rooms on this floor
              </div>
            )}
          </div>
        );
      })}
      
      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg border-2 flex items-center justify-center",
                  getRoomColor(status)
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium capitalize">
                  {status.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
