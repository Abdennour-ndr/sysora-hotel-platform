import React, { useState, useEffect, useCallback } from 'react';
import {
  Bed,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  User,
  RefreshCw,
  Plus,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  Filter,
  Grid,
  List,
  MapPin,
  Wifi,
  Tv,
  Coffee,
  Car,
  Shield,
  Phone,
  Eye,
  Edit,
  MoreHorizontal,
  ChevronDown,
  Building,
  Users
} from 'lucide-react';
import { Card, CardContent } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

const OptimizedRoomManagement = ({ data, loading, onRefresh }) => {
  const { rooms: initialRooms } = data;
  
  // State Management
  const [rooms, setRooms] = useState(initialRooms || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [viewMode, setViewMode] = useState('status'); // status, grid, list
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Update rooms when data changes
  useEffect(() => {
    if (initialRooms) {
      setRooms(initialRooms);
    }
  }, [initialRooms]);

  // Enhanced filtering
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (room.currentGuest && room.currentGuest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    const matchesFloor = floorFilter === 'all' || room.floor === parseInt(floorFilter);
    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  // Enhanced statistics
  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    outOfOrder: rooms.filter(r => r.status === 'out_of_order').length,
    occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0,
    revenue: rooms.filter(r => r.status === 'occupied').reduce((sum, room) => sum + (room.rate || 0), 0)
  };

  // Group rooms by status
  const roomsByStatus = {
    available: rooms.filter(r => r.status === 'available'),
    occupied: rooms.filter(r => r.status === 'occupied'),
    cleaning: rooms.filter(r => r.status === 'cleaning'),
    maintenance: rooms.filter(r => r.status === 'maintenance'),
    out_of_order: rooms.filter(r => r.status === 'out_of_order')
  };

  // Status configuration
  const statusConfig = {
    available: {
      label: 'Available',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      icon: CheckCircle,
      iconColor: 'text-emerald-600'
    },
    occupied: {
      label: 'Occupied',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: User,
      iconColor: 'text-blue-600'
    },
    cleaning: {
      label: 'Cleaning',
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      icon: Clock,
      iconColor: 'text-amber-600'
    },
    maintenance: {
      label: 'Maintenance',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: Wrench,
      iconColor: 'text-red-600'
    },
    out_of_order: {
      label: 'Out of Order',
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      icon: AlertTriangle,
      iconColor: 'text-gray-600'
    }
  };

  // Handle status change
  const handleStatusChange = useCallback(async (roomId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [roomId]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRooms(prev => prev.map(room => 
        room._id === roomId 
          ? { ...room, status: newStatus, lastUpdated: new Date().toISOString() }
          : room
      ));
      
    } catch (error) {
      console.error('Error updating room status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [roomId]: false }));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Page Title */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
                <p className="text-gray-600 mt-2">
                  {filteredRooms.length} of {rooms.length} rooms • Today: {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onRefresh}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
              </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Occupancy Rate */}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-blue-100 text-sm font-medium mb-1">Occupancy Rate</p>
                      <p className="text-3xl font-bold truncate">{roomStats.occupancyRate}%</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Revenue */}
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-emerald-100 text-sm font-medium mb-1">Daily Revenue</p>
                      <p className="text-3xl font-bold truncate">${roomStats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <DollarSign className="w-8 h-8 text-emerald-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Rooms */}
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-purple-100 text-sm font-medium mb-1">Total Rooms</p>
                      <p className="text-3xl font-bold truncate">{roomStats.total}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Building className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Guests */}
              <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-amber-100 text-sm font-medium mb-1">Active Guests</p>
                      <p className="text-3xl font-bold truncate">{roomStats.occupied}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Users className="w-8 h-8 text-amber-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms, guests, or amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-0"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-0"
                >
                  <option value="all">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('status')}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                      viewMode === 'status' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    By Status
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                      viewMode === 'grid' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'status' ? (
          <StatusBasedView
            roomsByStatus={roomsByStatus}
            statusConfig={statusConfig}
            onStatusChange={handleStatusChange}
            actionLoading={actionLoading}
          />
        ) : (
          <GridView
            rooms={filteredRooms}
            statusConfig={statusConfig}
            onStatusChange={handleStatusChange}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};

// Status-based view component
const StatusBasedView = ({ roomsByStatus, statusConfig, onStatusChange, actionLoading }) => {
  return (
    <div className="space-y-12">
      {Object.entries(roomsByStatus).map(([status, rooms]) => {
        if (rooms.length === 0) return null;

        const config = statusConfig[status];
        const StatusIcon = config.icon;

        return (
          <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Status Header */}
            <div className={cn("px-6 py-4 border-b border-gray-200", config.bgColor)}>
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center bg-white shadow-sm"
                )}>
                  <StatusIcon className={cn("w-6 h-6", config.iconColor)} />
                </div>
                <div>
                  <h2 className={cn("text-xl font-bold", config.textColor)}>{config.label}</h2>
                  <p className={cn("text-sm", config.textColor, "opacity-80")}>{rooms.length} rooms available</p>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    statusConfig={statusConfig}
                    onStatusChange={onStatusChange}
                    actionLoading={actionLoading[room._id]}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Grid view component
const GridView = ({ rooms, statusConfig, onStatusChange, actionLoading }) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bed className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Try adjusting your search or filter criteria to find rooms
        </p>
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add First Room</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          statusConfig={statusConfig}
          onStatusChange={onStatusChange}
          actionLoading={actionLoading[room._id]}
        />
      ))}
    </div>
  );
};

// Enhanced Room Card Component
const RoomCard = ({ room, statusConfig, onStatusChange, actionLoading }) => {
  const [showActions, setShowActions] = useState(false);
  const config = statusConfig[room.status];
  const StatusIcon = config.icon;

  // Amenities icons mapping
  const amenityIcons = {
    wifi: Wifi,
    tv: Tv,
    coffee: Coffee,
    parking: Car,
    safe: Shield,
    phone: Phone
  };

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden",
      config.borderColor,
      "border-2"
    )}>
      {/* Status Strip */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        config.color === 'emerald' ? 'bg-emerald-500' :
        config.color === 'blue' ? 'bg-blue-500' :
        config.color === 'amber' ? 'bg-amber-500' :
        config.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
      )} />

      <CardContent className="p-6">
        {/* Room Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Room Number */}
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl",
              config.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
              config.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
              config.color === 'amber' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
              config.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600' :
              'bg-gradient-to-br from-gray-500 to-gray-600'
            )}>
              {room.number}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-lg">Room {room.number}</h3>
              <p className="text-sm text-gray-600 capitalize font-medium">{room.type}</p>
              <p className="text-xs text-gray-500">Floor {room.floor || 1}</p>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Room</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <div className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold",
            config.bgColor,
            config.textColor
          )}>
            <StatusIcon className={cn("w-4 h-4 mr-2", config.iconColor)} />
            {config.label}
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-3 mb-6">
          {/* Guest Info */}
          {room.currentGuest && (
            <div className="flex items-center space-x-2 text-sm bg-blue-50 p-3 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{room.currentGuest}</p>
                <p className="text-xs text-blue-600">Current Guest</p>
              </div>
            </div>
          )}

          {/* Rate */}
          {room.rate && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Rate</span>
              </div>
              <span className="font-bold text-gray-900">${room.rate}/night</span>
            </div>
          )}

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 4).map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity.toLowerCase()] || Coffee;
                  return (
                    <div key={index} className="flex items-center space-x-1 bg-white px-2 py-1 rounded text-xs">
                      <IconComponent className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-700 capitalize">{amenity}</span>
                    </div>
                  );
                })}
                {room.amenities.length > 4 && (
                  <span className="text-xs text-gray-500">+{room.amenities.length - 4} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          {room.status === 'available' && (
            <button
              onClick={() => onStatusChange(room._id, 'occupied')}
              disabled={actionLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Assigning...' : 'Assign Guest'}
            </button>
          )}

          {room.status === 'occupied' && (
            <button
              onClick={() => onStatusChange(room._id, 'cleaning')}
              disabled={actionLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Check Out'}
            </button>
          )}

          {room.status === 'cleaning' && (
            <button
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Completing...' : 'Mark Clean'}
            </button>
          )}

          {room.status === 'maintenance' && (
            <button
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Completing...' : 'Complete Maintenance'}
            </button>
          )}

          {/* Secondary Action */}
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
            View Details
          </button>
        </div>

        {/* Last Updated */}
        {room.lastUpdated && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(room.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedRoomManagement;
