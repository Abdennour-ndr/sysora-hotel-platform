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
  X,
  Filter,
  Grid,
  List,
  MapPin,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  MoreHorizontal,
  Eye,
  Edit,
  History,
  Coffee
} from 'lucide-react';
import { Card, CardContent } from '../ui/DesignSystem';
import { 
  Icon,
  ConsistentStatusBadge,
  ConsistentStatCard,
  ConsistentActionButton,
  ConsistentInput,
  ConsistentNotification
} from '../ui/ConsistentComponents';
import { RoomDetailsModal, AddRoomModal, BulkActionsModal } from './RoomManagementModals';
import { RoomListRow, FloorPlanView } from './RoomViewComponents';
import { designTokens, componentClasses } from '../../utils/designTokens';
import { cn } from '../../utils/cn';

const ProfessionalRoomManagement = ({ data, loading, onRefresh }) => {
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  // View mode options
  const viewModes = [
    { id: 'grid', label: 'Grid', icon: Grid },
    { id: 'list', label: 'List', icon: List },
    { id: 'floor-plan', label: 'Floor Plan', icon: MapPin }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading State with Professional Layout */}
        <div className="flex h-screen">
          {/* Sidebar Skeleton */}
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
              
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Professional Layout Container */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Left Sidebar - Control Panel */}
        <div className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-80"
        )}>
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Room Control</h1>
                  <p className="text-sm text-gray-600 mt-1">Management Center</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quick Stats in Sidebar */}
          {!sidebarCollapsed && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Available</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{roomStats.available}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Occupied</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{roomStats.occupied}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">Cleaning</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{roomStats.cleaning}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Maintenance</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{roomStats.maintenance}</span>
                </div>
              </div>
            </div>
          )}

          {/* Filters Section */}
          {!sidebarCollapsed && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_order">Out of Order</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Floor</label>
                  <select
                    value={floorFilter}
                    onChange={(e) => setFloorFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Floors</option>
                    {floors.map(floor => (
                      <option key={floor} value={floor}>Floor {floor}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="p-6 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <ConsistentActionButton
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowAddRoomModal(true)}
                  className="w-full justify-start"
                >
                  Add New Room
                </ConsistentActionButton>
                
                <ConsistentActionButton
                  variant="secondary"
                  icon={RefreshCw}
                  onClick={onRefresh}
                  className="w-full justify-start"
                >
                  Refresh Data
                </ConsistentActionButton>
                
                {bulkSelection.length > 0 && (
                  <ConsistentActionButton
                    variant="secondary"
                    icon={CheckSquare}
                    onClick={() => setShowBulkActions(true)}
                    className="w-full justify-start"
                  >
                    Bulk Actions ({bulkSelection.length})
                  </ConsistentActionButton>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
                  <p className="text-sm text-gray-600">
                    {filteredRooms.length} of {rooms.length} rooms • {roomStats.occupancyRate}% occupied
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                        viewMode === mode.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{roomStats.occupancyRate}%</p>
                  <p className="text-xs text-gray-600">Occupancy Rate</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">${roomStats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Daily Revenue</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{roomStats.total}</p>
                  <p className="text-xs text-gray-600">Total Rooms</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">

              {/* Room Display */}
              {filteredRooms.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bed className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
                    <p className="text-gray-600 mb-6 max-w-sm">
                      Try adjusting your search or filter criteria to find rooms
                    </p>
                    <ConsistentActionButton
                      variant="primary"
                      icon={Plus}
                      onClick={() => setShowAddRoomModal(true)}
                    >
                      Add First Room
                    </ConsistentActionButton>
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                    <Card className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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
            </div>
          </div>
        </div>
      </div>

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

// Enhanced Room Card Component for Professional Layout
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
  const isSelected = bulkSelection?.includes(room._id);

  const handleBulkSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setBulkSelection(prev => prev.filter(id => id !== room._id));
    } else {
      setBulkSelection(prev => [...prev, room._id]);
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'available':
        return 'from-emerald-500 to-emerald-600';
      case 'occupied':
        return 'from-blue-500 to-blue-600';
      case 'cleaning':
        return 'from-amber-500 to-amber-600';
      case 'maintenance':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
      {/* Status Indicator Strip */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        getStatusGradient(room.status)
      )} />

      <CardContent className="p-6">
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleBulkSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Room Header */}
        <div className="flex items-start justify-between mb-4 ml-6">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br",
              getStatusGradient(room.status)
            )}>
              {room.number}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Room {room.number}</h3>
              <p className="text-sm text-gray-600 capitalize font-medium">{room.type}</p>
              <p className="text-xs text-gray-500">Floor {room.floor || 1}</p>
            </div>
          </div>

          <button
            onClick={() => setShowActions(!showActions)}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Room Status Badge */}
        <div className="mb-4">
          <div className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold",
            room.status === 'available' ? "bg-emerald-100 text-emerald-800" :
            room.status === 'occupied' ? "bg-blue-100 text-blue-800" :
            room.status === 'cleaning' ? "bg-amber-100 text-amber-800" :
            room.status === 'maintenance' ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          )}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {room.status.charAt(0).toUpperCase() + room.status.slice(1).replace('_', ' ')}
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-3 mb-6">
          {room.currentGuest && (
            <div className="flex items-center space-x-2 text-sm text-gray-700 bg-blue-50 p-2 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{room.currentGuest}</span>
            </div>
          )}

          {room.rate && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>Rate</span>
              </div>
              <span className="font-bold text-gray-900">${room.rate}/night</span>
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
          <ConsistentActionButton
            variant="secondary"
            size="sm"
            icon={Eye}
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
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={Wrench}
              onClick={() => onStatusChange(room._id, 'maintenance')}
              className="w-full justify-start"
            >
              Mark for Maintenance
            </ConsistentActionButton>
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={Edit}
              className="w-full justify-start"
            >
              Edit Room
            </ConsistentActionButton>
            <ConsistentActionButton
              variant="ghost"
              size="sm"
              icon={History}
              className="w-full justify-start"
            >
              View History
            </ConsistentActionButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalRoomManagement;
