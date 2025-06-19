import React, { useState } from 'react';
import {
  Bed,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  User,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, Button, Input, Select, StatusBadge, LoadingSpinner, EmptyState } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

const ModernRoomStatus = ({ data, loading, onRefresh }) => {
  const { rooms } = data;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage room status</p>
          </div>
          <LoadingSpinner size="lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusCounts = {
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'occupied': return User;
      case 'cleaning': return Clock;
      case 'maintenance': return Wrench;
      default: return Bed;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'info';
      case 'cleaning': return 'warning';
      case 'maintenance': return 'error';
      default: return 'neutral';
    }
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      // API call would go here
      console.log(`Changing room ${roomId} status to ${newStatus}`);
      // Optimistic update would be implemented here
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  };

  const RoomCard = ({ room }) => {
    const StatusIcon = getStatusIcon(room.status);
    
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">{room.number}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Room {room.number}</h3>
                <p className="text-sm text-gray-600 capitalize">{room.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <StatusIcon className={cn(
                "w-4 h-4",
                room.status === 'available' ? "text-emerald-600" :
                room.status === 'occupied' ? "text-blue-600" :
                room.status === 'cleaning' ? "text-amber-600" :
                "text-red-600"
              )} />
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <StatusBadge status={getStatusColor(room.status)}>
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </StatusBadge>

            {room.currentGuest && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Guest:</span> {room.currentGuest}
              </div>
            )}

            <div className="flex space-x-2">
              {room.status === 'available' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusChange(room._id, 'occupied')}
                  className="flex-1"
                >
                  Assign
                </Button>
              )}
              
              {room.status === 'occupied' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleStatusChange(room._id, 'cleaning')}
                  className="flex-1"
                >
                  Check Out
                </Button>
              )}
              
              {room.status === 'cleaning' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatusChange(room._id, 'available')}
                  className="flex-1"
                >
                  Mark Clean
                </Button>
              )}
              
              {room.status !== 'maintenance' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatusChange(room._id, 'maintenance')}
                  className="px-2"
                >
                  <Wrench className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage room status</p>
        </div>
        
        <Button
          variant="secondary"
          onClick={onRefresh}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available', count: statusCounts.available, color: 'bg-emerald-500', icon: CheckCircle },
          { label: 'Occupied', count: statusCounts.occupied, color: 'bg-blue-500', icon: User },
          { label: 'Cleaning', count: statusCounts.cleaning, color: 'bg-amber-500', icon: Clock },
          { label: 'Maintenance', count: statusCounts.maintenance, color: 'bg-red-500', icon: Wrench }
        ].map((status, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", status.color)}>
                <status.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{status.count}</p>
                <p className="text-sm text-gray-600">{status.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </Select>
              
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-40"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={Bed}
              title="No rooms found"
              description="Try adjusting your search or filter criteria"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernRoomStatus;
