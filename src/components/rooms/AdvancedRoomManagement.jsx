import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Bed,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  MoreVertical,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Settings,
  Keyboard,
  MousePointer,
  Move,
  Copy,
  Trash2,
  Eye,
  Star,
  Wifi,
  Coffee,
  Car,
  Tv,
  Bath,
  Wind
} from 'lucide-react';
import SortableRoomCard from './SortableRoomCard';
import RoomStatusDropZone from './RoomStatusDropZone';
import InlineEditField from './InlineEditField';
import ContextMenu from './ContextMenu';
import BulkActionsBar from './BulkActionsBar';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import ConfirmationDialog from '../common/ConfirmationDialog';

const AdvancedRoomManagement = () => {
  // State Management
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('number');
  const [draggedRoom, setDraggedRoom] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, room: null });

  // Modal states
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Refs
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);
  
  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load real data from API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('sysora_token');

        if (!token) {
          console.error('No auth token found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.rooms) {
            const formattedRooms = data.data.rooms.map((room, index) => ({
              id: room._id,
              number: room.number,
              name: room.name || `Room ${room.number}`,
              type: room.type,
              status: room.status,
              basePrice: room.basePrice,
              currency: room.currency || 'DZD',
              maxOccupancy: room.maxOccupancy,
              bedCount: room.bedCount,
              bedType: room.bedType,
              floor: room.floor,
              size: room.size,
              amenities: room.amenities || [],
              features: room.features || {},
              images: room.images || [],
              description: room.description || `${room.type} room`,
              lastCleaned: room.lastCleaned ? new Date(room.lastCleaned) : new Date(),
              isSelected: false,
              order: index
            }));

            setRooms(formattedRooms);
            setFilteredRooms(formattedRooms);
          } else {
            console.error('Failed to load rooms:', data.error);
            // Fallback to empty array
            setRooms([]);
            setFilteredRooms([]);
          }
        } else {
          console.error('Failed to fetch rooms:', response.status);
          // Fallback to empty array
          setRooms([]);
          setFilteredRooms([]);
        }
      } catch (error) {
        console.error('Error loading rooms:', error);
        // Fallback to empty array
        setRooms([]);
        setFilteredRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = rooms.filter(room => {
      const matchesSearch = 
        room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      const matchesType = typeFilter === 'all' || room.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort rooms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'number':
          return a.number.localeCompare(b.number);
        case 'price':
          return a.basePrice - b.basePrice;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'order':
          return a.order - b.order;
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, statusFilter, typeFilter, sortBy]);

  // Keyboard Shortcuts
  useHotkeys('ctrl+a', (e) => {
    e.preventDefault();
    setSelectedRooms(new Set(filteredRooms.map(room => room.id)));
  });

  useHotkeys('ctrl+d', (e) => {
    e.preventDefault();
    setSelectedRooms(new Set());
  });

  useHotkeys('ctrl+f', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  useHotkeys('escape', () => {
    setSelectedRooms(new Set());
    setEditingField(null);
    setContextMenu({ show: false, x: 0, y: 0, room: null });
  });

  useHotkeys('g', () => setViewMode('grid'));
  useHotkeys('l', () => setViewMode('list'));
  useHotkeys('?', () => setShowShortcuts(true));

  // Status change shortcuts
  useHotkeys('1', () => changeSelectedRoomsStatus('available'));
  useHotkeys('2', () => changeSelectedRoomsStatus('occupied'));
  useHotkeys('3', () => changeSelectedRoomsStatus('cleaning'));
  useHotkeys('4', () => changeSelectedRoomsStatus('maintenance'));

  // Drag and Drop Handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const room = rooms.find(r => r.id === active.id);
    setDraggedRoom(room);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedRoom(null);

    if (!over) return;

    // Handle status change by dropping on status zone
    if (over.id.startsWith('status-')) {
      const newStatus = over.id.replace('status-', '');
      handleStatusChange(active.id, newStatus);
      return;
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = rooms.findIndex(room => room.id === active.id);
      const newIndex = rooms.findIndex(room => room.id === over.id);
      
      const newRooms = arrayMove(rooms, oldIndex, newIndex).map((room, index) => ({
        ...room,
        order: index
      }));
      
      setRooms(newRooms);
      window.showToast && window.showToast('Room order updated', 'success');
    }
  };

  // Room Management Functions
  const handleStatusChange = useCallback((roomId, newStatus) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, status: newStatus } : room
    ));
    window.showToast && window.showToast(`Room status changed to ${newStatus}`, 'success');
  }, []);

  const changeSelectedRoomsStatus = (newStatus) => {
    if (selectedRooms.size === 0) return;
    
    setRooms(prev => prev.map(room => 
      selectedRooms.has(room.id) ? { ...room, status: newStatus } : room
    ));
    
    window.showToast && window.showToast(
      `${selectedRooms.size} room(s) status changed to ${newStatus}`, 
      'success'
    );
    setSelectedRooms(new Set());
  };

  const handleRoomSelect = (roomId, isSelected) => {
    setSelectedRooms(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(roomId);
      } else {
        newSet.delete(roomId);
      }
      return newSet;
    });
  };

  const handleInlineEdit = (roomId, field, value) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, [field]: value } : room
    ));
    setEditingField(null);
    window.showToast && window.showToast('Room updated successfully', 'success');
  };

  const handleContextMenu = (e, room) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      room
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      ac: Wind,
      tv: Tv,
      minibar: Coffee,
      parking: Car,
      jacuzzi: Bath,
      balcony: Star
    };
    return icons[amenity] || Star;
  };

  // Room management functions
  const handleAddRoom = async (roomData) => {
    try {
      const token = localStorage.getItem('sysora_token');

      // Create FormData to match API expectations
      const formData = new FormData();
      formData.append('roomData', JSON.stringify(roomData));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Reload rooms to get updated data
        window.location.reload(); // Simple reload for now
        window.showToast && window.showToast('Room added successfully', 'success');
        setShowAddRoomModal(false);
      } else {
        window.showToast && window.showToast(data.error || 'Failed to add room', 'error');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      window.showToast && window.showToast('Error adding room', 'error');
    }
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setShowEditRoomModal(true);
  };

  const handleDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${roomToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRooms(prev => prev.filter(room => room._id !== roomToDelete._id));
        window.showToast && window.showToast('Room deleted successfully', 'success');
        setShowDeleteConfirm(false);
        setRoomToDelete(null);
      } else {
        window.showToast && window.showToast(data.error || 'Failed to delete room', 'error');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      window.showToast && window.showToast('Error deleting room', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const refreshRooms = () => {
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-blue-800 to-sysora-midnight rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <Bed className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Advanced Room Management</h2>
                <p className="text-blue-100/80 text-lg">Interactive room operations with advanced controls</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['available', 'occupied', 'cleaning', 'maintenance'].map(status => {
                const count = rooms.filter(room => room.status === status).length;
                return (
                  <div key={status} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-blue-100/70 capitalize">{status}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors border border-white/20"
              title="Keyboard Shortcuts (Press ?)"
            >
              <Keyboard className="w-5 h-5" />
              <span className="sm:hidden">Shortcuts</span>
            </button>
            
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center space-x-2 p-4 bg-blue-600/90 hover:bg-blue-600 rounded-2xl transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setShowAddRoomModal(true)}
              className="flex items-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search rooms... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px]"
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
              className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px]"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-sysora-midnight shadow-sm' 
                    : 'text-gray-600 hover:text-sysora-midnight'
                }`}
                title="Grid View (G)"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-sysora-midnight shadow-sm' 
                    : 'text-gray-600 hover:text-sysora-midnight'
                }`}
                title="List View (L)"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white"
            >
              <option value="number">Sort by Number</option>
              <option value="price">Sort by Price</option>
              <option value="type">Sort by Type</option>
              <option value="status">Sort by Status</option>
              <option value="order">Custom Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Drop Zones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['available', 'occupied', 'cleaning', 'maintenance'].map(status => (
          <RoomStatusDropZone
            key={status}
            status={status}
            count={rooms.filter(room => room.status === status).length}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedRooms.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRooms.size}
          onStatusChange={changeSelectedRoomsStatus}
          onClearSelection={() => setSelectedRooms(new Set())}
        />
      )}

      {/* Rooms Display */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredRooms.map(room => room.id)} strategy={rectSortingStrategy}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map((room) => (
                <SortableRoomCard
                  key={room.id}
                  room={room}
                  isSelected={selectedRooms.has(room.id)}
                  onSelect={handleRoomSelect}
                  onContextMenu={handleContextMenu}
                  onInlineEdit={handleInlineEdit}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  getStatusColor={getStatusColor}
                  getAmenityIcon={getAmenityIcon}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <SortableRoomCard
                  key={room.id}
                  room={room}
                  isSelected={selectedRooms.has(room.id)}
                  onSelect={handleRoomSelect}
                  onContextMenu={handleContextMenu}
                  onInlineEdit={handleInlineEdit}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  getStatusColor={getStatusColor}
                  getAmenityIcon={getAmenityIcon}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </SortableContext>
        
        <DragOverlay>
          {draggedRoom ? (
            <div className="bg-white rounded-2xl border-2 border-sysora-mint shadow-2xl p-4 opacity-90 transform rotate-3">
              <div className="font-semibold text-sysora-midnight">
                Room {draggedRoom.number}
              </div>
              <div className="text-sm text-gray-600">{draggedRoom.name}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          room={contextMenu.room}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0, room: null })}
          onStatusChange={handleStatusChange}
          onEdit={(field) => setEditingField(`${contextMenu.room.id}-${field}`)}
          onEditRoom={handleEditRoom}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcuts(false)} />
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New Room</h3>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const roomData = {
                number: formData.get('number'),
                name: formData.get('name'),
                type: formData.get('type'),
                maxOccupancy: parseInt(formData.get('maxOccupancy')),
                basePrice: parseFloat(formData.get('basePrice')),
                floor: parseInt(formData.get('floor')),
                size: parseFloat(formData.get('size')),
                bedCount: parseInt(formData.get('bedCount')),
                bedType: formData.get('bedType'),
                amenities: formData.getAll('amenities'),
                description: formData.get('description')
              };
              handleAddRoom(roomData);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="e.g., 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="e.g., Deluxe Ocean View"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                  <select
                    name="type"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="">Select Type</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Occupancy *</label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (DZD) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="8000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <input
                    type="number"
                    name="floor"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  placeholder="Room description..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-sysora-mint text-sysora-midnight rounded-xl hover:bg-sysora-mint/90 transition-colors font-semibold"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Room Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={refreshRooms}
                className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Refresh Rooms</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Room Preferences</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Default Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditRoomModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Room: {selectedRoom.number}</h3>
              <button
                onClick={() => {
                  setShowEditRoomModal(false);
                  setSelectedRoom(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);

              const roomData = {
                number: formData.get('number'),
                name: formData.get('name'),
                type: formData.get('type'),
                maxOccupancy: parseInt(formData.get('maxOccupancy')),
                basePrice: parseFloat(formData.get('basePrice')),
                floor: parseInt(formData.get('floor')),
                size: parseFloat(formData.get('size')),
                bedCount: parseInt(formData.get('bedCount')),
                bedType: formData.get('bedType'),
                amenities: Array.from(formData.getAll('amenities')),
                description: formData.get('description')
              };

              try {
                const token = localStorage.getItem('sysora_token');
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${selectedRoom._id}`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(roomData)
                });

                const data = await response.json();
                if (data.success) {
                  window.showToast && window.showToast('Room updated successfully', 'success');
                  setShowEditRoomModal(false);
                  setSelectedRoom(null);
                  window.location.reload(); // Simple refresh
                } else {
                  window.showToast && window.showToast(data.error || 'Failed to update room', 'error');
                }
              } catch (error) {
                console.error('Error updating room:', error);
                window.showToast && window.showToast('Error updating room', 'error');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                  <input
                    type="text"
                    name="number"
                    required
                    defaultValue={selectedRoom.number}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedRoom.name}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                  <select
                    name="type"
                    required
                    defaultValue={selectedRoom.type}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Occupancy *</label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    required
                    min="1"
                    max="10"
                    defaultValue={selectedRoom.maxOccupancy}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (DZD) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={selectedRoom.basePrice}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <input
                    type="number"
                    name="floor"
                    min="0"
                    defaultValue={selectedRoom.floor}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size (m²)</label>
                  <input
                    type="number"
                    name="size"
                    min="0"
                    step="0.1"
                    defaultValue={selectedRoom.size}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bed Count</label>
                  <input
                    type="number"
                    name="bedCount"
                    min="1"
                    max="5"
                    defaultValue={selectedRoom.bedCount}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                  <select
                    name="bedType"
                    defaultValue={selectedRoom.bedType}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['WiFi', 'Air Conditioning', 'Television', 'Mini Fridge', 'Balcony', 'Room Service', 'Safe', 'Bathtub'].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="amenities"
                          value={amenity}
                          defaultChecked={selectedRoom.amenities?.includes(amenity)}
                          className="w-4 h-4 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    defaultValue={selectedRoom.description}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint"
                    placeholder="Room description..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditRoomModal(false);
                    setSelectedRoom(null);
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-sysora-mint text-sysora-midnight rounded-xl hover:bg-sysora-mint/90 transition-colors font-semibold"
                >
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRoomManagement;
