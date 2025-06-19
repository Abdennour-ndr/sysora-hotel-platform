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
  Building,
  Users,
  Eye,
  Edit,
  LogOut,
  Settings,
  Info,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Tv,
  Coffee,
  Car
} from 'lucide-react';
import { Card, CardContent } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

const GridBasedRoomManagement = ({ data, loading, onRefresh }) => {
  const { rooms: initialRooms } = data;
  
  // State Management
  const [rooms, setRooms] = useState(initialRooms || []);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Update rooms when data changes
  useEffect(() => {
    if (initialRooms) {
      setRooms(initialRooms);
      // Auto-select first room if none selected
      if (!selectedRoom && initialRooms.length > 0) {
        setSelectedRoom(initialRooms[0]);
      }
    }
  }, [initialRooms, selectedRoom]);

  // Enhanced filtering
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (room.currentGuest && room.currentGuest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || room.floor === parseInt(floorFilter);
    return matchesSearch && matchesStatus && matchesFloor;
  });

  // Enhanced statistics
  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    occupancyRate: rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0,
    revenue: rooms.filter(r => r.status === 'occupied').reduce((sum, room) => sum + (room.rate || 0), 0)
  };

  // Get unique floors
  const floors = [...new Set(rooms.map(room => room.floor || 1))].sort();

  // Status configuration with proper colors
  const statusConfig = {
    available: {
      label: 'Available',
      bgColor: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      textColor: 'text-white',
      borderColor: 'border-emerald-600',
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-800',
      icon: CheckCircle
    },
    occupied: {
      label: 'Occupied',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      textColor: 'text-white',
      borderColor: 'border-blue-600',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-800',
      icon: User
    },
    cleaning: {
      label: 'Cleaning',
      bgColor: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      textColor: 'text-white',
      borderColor: 'border-amber-600',
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-800',
      icon: Clock
    },
    maintenance: {
      label: 'Maintenance',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-600',
      lightBg: 'bg-red-50',
      lightText: 'text-red-800',
      icon: Wrench
    },
    out_of_order: {
      label: 'Out of Order',
      bgColor: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      textColor: 'text-white',
      borderColor: 'border-gray-600',
      lightBg: 'bg-gray-50',
      lightText: 'text-gray-800',
      icon: AlertTriangle
    }
  };

  // Handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
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
      
      // Update selected room if it's the one being changed
      if (selectedRoom && selectedRoom._id === roomId) {
        setSelectedRoom(prev => ({ ...prev, status: newStatus, lastUpdated: new Date().toISOString() }));
      }
      
    } catch (error) {
      console.error('Error updating room status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [roomId]: false }));
    }
  }, [selectedRoom]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="flex-1 grid grid-cols-8 gap-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="w-64 h-80 bg-gray-200 rounded"></div>
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
          <div className="py-3">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredRooms.length} of {rooms.length} rooms
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onRefresh}
                  className="flex items-center space-x-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center space-x-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
              </div>
            </div>

            {/* Compact Stats Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Available</span>
                    <span className="font-semibold text-gray-900">{roomStats.available}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Occupied</span>
                    <span className="font-semibold text-gray-900">{roomStats.occupied}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Cleaning</span>
                    <span className="font-semibold text-gray-900">{roomStats.cleaning}</span>
                  </div>
                  {roomStats.maintenance > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Maintenance</span>
                      <span className="font-semibold text-gray-900">{roomStats.maintenance}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Occupancy Rate</p>
                    <p className="text-lg font-bold text-gray-900">{roomStats.occupancyRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Daily Revenue</p>
                    <p className="text-lg font-bold text-gray-900">${roomStats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search room or guest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Floors</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex gap-4">
          {/* Room Grid */}
          <div className="flex-1">
            <RoomGrid
              rooms={filteredRooms}
              statusConfig={statusConfig}
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
              hoveredRoom={hoveredRoom}
              setHoveredRoom={setHoveredRoom}
            />
          </div>

          {/* Room Details Sidebar */}
          <div className="w-64">
            <RoomDetailsSidebar
              room={selectedRoom}
              statusConfig={statusConfig}
              onStatusChange={handleStatusChange}
              actionLoading={actionLoading[selectedRoom?._id]}
            />
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredRoom && (
        <RoomTooltip room={hoveredRoom} statusConfig={statusConfig} />
      )}
    </div>
  );
};

// Room Grid Component
const RoomGrid = ({ rooms, statusConfig, selectedRoom, onRoomSelect, hoveredRoom, setHoveredRoom }) => {
  if (rooms.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bed className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
        <p className="text-gray-600 mb-8">
          Try adjusting your search or filter criteria
        </p>
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add First Room</span>
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-gray-900">Floor Plan</h2>
        <p className="text-xs text-gray-600">Click room to view details</p>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
        {rooms.map((room) => {
          const config = statusConfig[room.status];
          const isSelected = selectedRoom?._id === room._id;

          return (
            <div
              key={room._id}
              onClick={() => onRoomSelect(room)}
              onMouseEnter={() => setHoveredRoom(room)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={cn(
                "relative w-12 h-12 rounded-md cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-md",
                config.bgColor,
                config.hoverColor,
                config.textColor,
                isSelected && "ring-2 ring-gray-900 ring-opacity-50 scale-110 shadow-md"
              )}
            >
              {/* Room Number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{room.number}</span>
              </div>

              {/* Guest Indicator */}
              {room.currentGuest && (
                <div className="absolute top-0.5 right-0.5">
                  <User className="w-2 h-2 text-white opacity-90" />
                </div>
              )}

              {/* Check-out Today Indicator */}
              {room.checkOutToday && (
                <div className="absolute top-0.5 left-0.5">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Legend */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center space-x-1">
                <div className={cn("w-3 h-3 rounded", config.bgColor)} />
                <span className="text-xs text-gray-600">{config.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Guest</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Check-out today</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Room Details Sidebar Component
const RoomDetailsSidebar = ({ room, statusConfig, onStatusChange, actionLoading }) => {
  if (!room) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bed className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Room</h3>
          <p className="text-gray-600">Click on any room in the grid to view details</p>
        </div>
      </Card>
    );
  }

  const config = statusConfig[room.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className={cn("px-4 py-3", config.lightBg)}>
        <div className="flex items-center space-x-3">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", config.bgColor)}>
            <span className="text-white font-bold text-lg">{room.number}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Room {room.number}</h2>
            <p className="text-sm text-gray-600 capitalize">{room.type || 'Standard'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Current Status</h3>
          <div className={cn("inline-flex items-center px-3 py-2 rounded-lg", config.lightBg, config.lightText)}>
            <StatusIcon className="w-4 h-4 mr-2" />
            <span className="font-medium">{config.label}</span>
          </div>
        </div>

        {/* Guest Information */}
        {room.currentGuest && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Guest Information</h3>
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">{room.currentGuest}</span>
              </div>
              {room.checkInDate && (
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Calendar className="w-4 h-4" />
                  <span>Check-in: {new Date(room.checkInDate).toLocaleDateString()}</span>
                </div>
              )}
              {room.checkOutDate && (
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Calendar className="w-4 h-4" />
                  <span>Check-out: {new Date(room.checkOutDate).toLocaleDateString()}</span>
                </div>
              )}
              {room.guestPhone && (
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Phone className="w-4 h-4" />
                  <span>{room.guestPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Room Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Room Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Floor</span>
              <span className="text-sm font-medium text-gray-900">{room.floor || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Type</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{room.type || 'Standard'}</span>
            </div>
            {room.rate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rate</span>
                <span className="text-sm font-medium text-gray-900">${room.rate}/night</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Capacity</span>
              <span className="text-sm font-medium text-gray-900">{room.capacity || 2} guests</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {room.amenities.map((amenity, index) => {
                const getAmenityIcon = (amenity) => {
                  switch (amenity.toLowerCase()) {
                    case 'wifi': return Wifi;
                    case 'tv': return Tv;
                    case 'coffee': return Coffee;
                    case 'parking': return Car;
                    default: return Coffee;
                  }
                };
                const IconComponent = getAmenityIcon(amenity);

                return (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 p-1.5 rounded">
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Actions</h3>

          {room.status === 'available' && (
            <button
              onClick={() => onStatusChange(room._id, 'occupied')}
              disabled={actionLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>{actionLoading ? 'Assigning...' : 'Assign Guest'}</span>
            </button>
          )}

          {room.status === 'occupied' && (
            <button
              onClick={() => onStatusChange(room._id, 'cleaning')}
              disabled={actionLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{actionLoading ? 'Processing...' : 'Check Out'}</span>
            </button>
          )}

          {room.status === 'cleaning' && (
            <button
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{actionLoading ? 'Completing...' : 'Mark Clean'}</span>
            </button>
          )}

          {room.status === 'maintenance' && (
            <button
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{actionLoading ? 'Completing...' : 'Complete Maintenance'}</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Last Updated */}
        {room.lastUpdated && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(room.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Room Tooltip Component
const RoomTooltip = ({ room, statusConfig }) => {
  const config = statusConfig[room.status];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-sm">
      <div className="flex items-center space-x-3 mb-2">
        <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold", config.bgColor)}>
          {room.number}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Room {room.number}</h4>
          <p className="text-sm text-gray-600">{config.label}</p>
        </div>
      </div>

      {room.currentGuest && (
        <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
          <User className="w-4 h-4" />
          <span>{room.currentGuest}</span>
        </div>
      )}

      {room.rate && (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <DollarSign className="w-4 h-4" />
          <span>${room.rate}/night</span>
        </div>
      )}
    </div>
  );
};

export default GridBasedRoomManagement;
