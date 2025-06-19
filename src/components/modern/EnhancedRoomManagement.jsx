import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Settings,
  History,
  Bell,
  CheckSquare,
  X
} from 'lucide-react';
import { Card, CardContent, Button, Input, Select, StatusBadge, LoadingSpinner, EmptyState, Modal } from '../ui/DesignSystem';
import { RoomDetailsModal, AddRoomModal, BulkActionsModal } from './RoomManagementModals';
import { RoomListRow, FloorPlanView } from './RoomViewComponents';
import { cn } from '../../utils/cn';

const EnhancedRoomManagement = ({ data, loading, onRefresh }) => {
  const { rooms: initialRooms } = data;
  
  // State Management
  const [rooms, setRooms] = useState(initialRooms || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, floor-plan
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

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

  // Enhanced status change with optimistic updates
  const handleStatusChange = useCallback(async (roomId, newStatus, notes = '') => {
    setActionLoading(prev => ({ ...prev, [roomId]: true }));
    
    // Optimistic update
    const originalRooms = [...rooms];
    setRooms(prev => prev.map(room => 
      room._id === roomId 
        ? { 
            ...room, 
            status: newStatus, 
            lastUpdated: new Date().toISOString(),
            updatedBy: 'Current User' // This would come from auth context
          }
        : room
    ));

    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${roomId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: newStatus, 
            notes,
            timestamp: new Date().toISOString()
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update room status');
      }

      const updatedRoom = await response.json();
      
      // Update with server response
      setRooms(prev => prev.map(room => 
        room._id === roomId ? { ...room, ...updatedRoom.data } : room
      ));

      // Add success notification
      addNotification(`Room ${rooms.find(r => r._id === roomId)?.number} status updated to ${newStatus}`, 'success');
      
    } catch (error) {
      console.error('Error updating room status:', error);
      
      // Revert optimistic update
      setRooms(originalRooms);
      
      // Add error notification
      addNotification('Failed to update room status. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [roomId]: false }));
    }
  }, [rooms]);

  // Bulk operations
  const handleBulkStatusChange = async (newStatus) => {
    const promises = bulkSelection.map(roomId => handleStatusChange(roomId, newStatus));
    await Promise.all(promises);
    setBulkSelection([]);
    setShowBulkActions(false);
  };

  // Notification system
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Room details modal
  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  // Get unique floors for filter
  const floors = [...new Set(rooms.map(room => room.floor || 1))].sort();

  // Enhanced status configuration
  const statusConfig = {
    available: { 
      color: 'success', 
      icon: CheckCircle, 
      bgColor: 'bg-emerald-500',
      actions: ['assign', 'maintenance', 'cleaning']
    },
    occupied: { 
      color: 'info', 
      icon: User, 
      bgColor: 'bg-blue-500',
      actions: ['checkout', 'maintenance', 'extend']
    },
    cleaning: { 
      color: 'warning', 
      icon: Clock, 
      bgColor: 'bg-amber-500',
      actions: ['complete', 'maintenance', 'inspect']
    },
    maintenance: { 
      color: 'error', 
      icon: Wrench, 
      bgColor: 'bg-red-500',
      actions: ['complete', 'out_of_order']
    },
    out_of_order: { 
      color: 'neutral', 
      icon: AlertTriangle, 
      bgColor: 'bg-gray-500',
      actions: ['maintenance', 'available']
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
            <p className="text-gray-600 mt-1">Advanced room control and monitoring</p>
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

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-lg shadow-lg border-l-4 bg-white max-w-sm",
                notification.type === 'success' ? "border-l-emerald-500" :
                notification.type === 'error' ? "border-l-red-500" :
                notification.type === 'warning' ? "border-l-amber-500" :
                "border-l-blue-500"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Advanced room control and monitoring</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {bulkSelection.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => setShowBulkActions(true)}
              className="flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Bulk Actions ({bulkSelection.length})</span>
            </Button>
          )}
          
          <Button
            variant="secondary"
            onClick={onRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          
          <Button
            onClick={() => setShowAddRoomModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bed className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{roomStats.total}</p>
              <p className="text-sm text-gray-600">Total Rooms</p>
            </div>
          </div>
        </Card>

        {Object.entries(statusConfig).map(([status, config]) => (
          <Card key={status} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
            <div className="flex items-center space-x-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.bgColor)}>
                <config.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{roomStats[status] || 0}</p>
                <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{roomStats.occupancyRate}%</p>
              <p className="text-sm text-gray-600">Occupancy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Filters and View Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search rooms, guests, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
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
                <option value="out_of_order">Out of Order</option>
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
                <option value="presidential">Presidential</option>
              </Select>

              <Select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Floors</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
                ))}
              </Select>

              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-32"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
                <option value="floor-plan">Floor Plan</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Display */}
      {filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={Bed}
              title="No rooms found"
              description="Try adjusting your search or filter criteria"
              action={
                <Button onClick={() => setShowAddRoomModal(true)} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Room
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <EnhancedRoomCard
                  key={room._id}
                  room={room}
                  onStatusChange={handleStatusChange}
                  onViewDetails={openRoomDetails}
                  actionLoading={actionLoading[room._id]}
                  statusConfig={statusConfig}
                  bulkSelection={bulkSelection}
                  setBulkSelection={setBulkSelection}
                />
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={bulkSelection.length === filteredRooms.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkSelection(filteredRooms.map(r => r._id));
                              } else {
                                setBulkSelection([]);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRooms.map((room) => (
                        <RoomListRow
                          key={room._id}
                          room={room}
                          onStatusChange={handleStatusChange}
                          onViewDetails={openRoomDetails}
                          actionLoading={actionLoading[room._id]}
                          statusConfig={statusConfig}
                          bulkSelection={bulkSelection}
                          setBulkSelection={setBulkSelection}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'floor-plan' && (
            <FloorPlanView
              rooms={filteredRooms}
              floors={floors}
              onRoomClick={openRoomDetails}
              statusConfig={statusConfig}
            />
          )}
        </>
      )}

      {/* Modals */}
      <RoomDetailsModal
        room={selectedRoom}
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onStatusChange={handleStatusChange}
        statusConfig={statusConfig}
      />

      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onRoomAdded={(newRoom) => {
          setRooms(prev => [...prev, newRoom]);
          addNotification(`Room ${newRoom.number} added successfully`, 'success');
        }}
      />

      <BulkActionsModal
        isOpen={showBulkActions}
        onClose={() => setShowBulkActions(false)}
        selectedRooms={bulkSelection}
        rooms={rooms}
        onBulkAction={handleBulkStatusChange}
        statusConfig={statusConfig}
      />
    </div>
  );
};

// Enhanced Room Card Component
const EnhancedRoomCard = ({
  room,
  onStatusChange,
  onViewDetails,
  actionLoading,
  statusConfig,
  bulkSelection,
  setBulkSelection
}) => {
  const [showActions, setShowActions] = useState(false);
  const StatusIcon = statusConfig[room.status]?.icon || Bed;
  const isSelected = bulkSelection.includes(room._id);

  const handleBulkSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setBulkSelection(prev => prev.filter(id => id !== room._id));
    } else {
      setBulkSelection(prev => [...prev, room._id]);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 relative">
      <CardContent className="p-4">
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
        <div className="flex items-start justify-between mb-4 ml-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{room.number}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
              <p className="text-sm text-gray-600 capitalize">{room.type}</p>
              <p className="text-xs text-gray-500">Floor {room.floor || 1}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusIcon className={cn(
              "w-5 h-5",
              room.status === 'available' ? "text-emerald-600" :
              room.status === 'occupied' ? "text-blue-600" :
              room.status === 'cleaning' ? "text-amber-600" :
              room.status === 'maintenance' ? "text-red-600" :
              "text-gray-600"
            )} />
            <button
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Room Status */}
        <div className="mb-4">
          <StatusBadge status={statusConfig[room.status]?.color || 'neutral'}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1).replace('_', ' ')}
          </StatusBadge>
        </div>

        {/* Room Details */}
        <div className="space-y-2 mb-4">
          {room.currentGuest && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{room.currentGuest}</span>
            </div>
          )}

          {room.rate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>${room.rate}/night</span>
            </div>
          )}

          {room.amenities && room.amenities.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Coffee className="w-4 h-4" />
              <span>{room.amenities.slice(0, 2).join(', ')}{room.amenities.length > 2 ? '...' : ''}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewDetails(room)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </Button>

          {statusConfig[room.status]?.actions?.includes('assign') && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStatusChange(room._id, 'occupied')}
              disabled={actionLoading}
              className="flex-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Assign'}
            </Button>
          )}

          {statusConfig[room.status]?.actions?.includes('checkout') && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onStatusChange(room._id, 'cleaning')}
              disabled={actionLoading}
              className="flex-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Check Out'}
            </Button>
          )}

          {statusConfig[room.status]?.actions?.includes('complete') && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStatusChange(room._id, 'available')}
              disabled={actionLoading}
              className="flex-1"
            >
              {actionLoading ? <LoadingSpinner size="sm" /> : 'Complete'}
            </Button>
          )}
        </div>

        {/* Expanded Actions */}
        {showActions && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onStatusChange(room._id, 'maintenance')}
              className="w-full justify-start"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Mark for Maintenance
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {/* Open edit modal */}}
              className="w-full justify-start"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Room
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {/* Open history modal */}}
              className="w-full justify-start"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRoomManagement;
