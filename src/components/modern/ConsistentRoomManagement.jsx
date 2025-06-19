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
  CheckSquare,
  X
} from 'lucide-react';
import { Card, CardContent } from '../ui/DesignSystem';
import { 
  Icon,
  ConsistentStatusBadge,
  ConsistentStatCard,
  ConsistentActionButton,
  ConsistentRoomCard,
  ConsistentInput,
  ConsistentNotification
} from '../ui/ConsistentComponents';
import { RoomDetailsModal, AddRoomModal, BulkActionsModal } from './RoomManagementModals';
import { RoomListRow, FloorPlanView } from './RoomViewComponents';
import { designTokens, componentClasses } from '../../utils/designTokens';
import { cn } from '../../utils/cn';

const ConsistentRoomManagement = ({ data, loading, onRefresh }) => {
  const { rooms: initialRooms } = data;
  
  // State Management
  const [rooms, setRooms] = useState(initialRooms || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [bulkSelection, setBulkSelection] = useState([]);

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
            updatedBy: 'Current User'
          }
        : room
    ));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
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
      color: 'available', 
      icon: CheckCircle, 
      bgColor: 'bg-emerald-500',
      actions: ['assign', 'maintenance', 'cleaning']
    },
    occupied: { 
      color: 'occupied', 
      icon: User, 
      bgColor: 'bg-blue-500',
      actions: ['checkout', 'maintenance', 'extend']
    },
    cleaning: { 
      color: 'cleaning', 
      icon: Clock, 
      bgColor: 'bg-amber-500',
      actions: ['complete', 'maintenance', 'inspect']
    },
    maintenance: { 
      color: 'maintenance', 
      icon: Wrench, 
      bgColor: 'bg-red-500',
      actions: ['complete', 'out_of_order']
    },
    out_of_order: { 
      color: 'outOfOrder', 
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
            <h1 className={cn(designTokens.fontSize['2xl'], designTokens.fontWeight.semibold, "text-gray-900")}>
              Room Management
            </h1>
            <p className={cn(designTokens.fontSize.sm, "text-gray-600 mt-1")}>
              Advanced room control and monitoring
            </p>
          </div>
          <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className={componentClasses.card}>
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
            <ConsistentNotification
              key={notification.id}
              type={notification.type}
              message={notification.message}
              onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            />
          ))}
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(designTokens.fontSize['2xl'], designTokens.fontWeight.semibold, "text-gray-900")}>
            Room Management
          </h1>
          <p className={cn(designTokens.fontSize.sm, "text-gray-600 mt-1")}>
            Advanced room control and monitoring
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {bulkSelection.length > 0 && (
            <ConsistentActionButton
              variant="secondary"
              icon={CheckSquare}
              onClick={() => setShowBulkActions(true)}
            >
              Bulk Actions ({bulkSelection.length})
            </ConsistentActionButton>
          )}
          
          <ConsistentActionButton
            variant="secondary"
            icon={RefreshCw}
            onClick={onRefresh}
          >
            Refresh
          </ConsistentActionButton>
          
          <ConsistentActionButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddRoomModal(true)}
          >
            Add Room
          </ConsistentActionButton>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <ConsistentStatCard
          title="Total Rooms"
          value={roomStats.total}
          icon={Bed}
          color="gray"
        />

        {Object.entries(statusConfig).map(([status, config]) => (
          <ConsistentStatCard
            key={status}
            title={status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            value={roomStats[status] || 0}
            icon={config.icon}
            color={status === 'available' ? 'emerald' : 
                   status === 'occupied' ? 'blue' :
                   status === 'cleaning' ? 'amber' :
                   status === 'maintenance' ? 'red' : 'gray'}
            onClick={() => setStatusFilter(status)}
          />
        ))}

        <ConsistentStatCard
          title="Occupancy"
          value={`${roomStats.occupancyRate}%`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Advanced Filters and View Controls */}
      <Card className={componentClasses.card}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <ConsistentInput
              icon={Search}
              placeholder="Search rooms, guests, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(componentClasses.input, "w-40")}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="out_of_order">Out of Order</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={cn(componentClasses.input, "w-40")}
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>

            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className={cn(componentClasses.input, "w-32")}
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={cn(componentClasses.input, "w-32")}
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
              <option value="floor-plan">Floor Plan</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Room Display */}
      {filteredRooms.length === 0 ? (
        <Card className={componentClasses.card}>
          <div className="text-center py-12">
            <Icon icon={Bed} size="2xl" className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Try adjusting your search or filter criteria
            </p>
            <ConsistentActionButton
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddRoomModal(true)}
            >
              Add First Room
            </ConsistentActionButton>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <ConsistentRoomCard
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
            <Card className={componentClasses.card}>
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

export default ConsistentRoomManagement;
