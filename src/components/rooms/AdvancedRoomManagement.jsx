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

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms = [
      {
        id: '1',
        number: '101',
        name: 'Deluxe Ocean View',
        type: 'deluxe',
        status: 'available',
        basePrice: 15000,
        currency: 'DZD',
        maxOccupancy: 2,
        floor: 1,
        amenities: ['wifi', 'ac', 'tv', 'minibar'],
        images: [],
        description: 'Beautiful ocean view room with modern amenities',
        lastCleaned: new Date(),
        isSelected: false,
        order: 0
      },
      {
        id: '2',
        number: '102',
        name: 'Standard Room',
        type: 'standard',
        status: 'occupied',
        basePrice: 8000,
        currency: 'DZD',
        maxOccupancy: 2,
        floor: 1,
        amenities: ['wifi', 'ac', 'tv'],
        images: [],
        description: 'Comfortable standard room',
        lastCleaned: new Date(),
        isSelected: false,
        order: 1
      },
      {
        id: '3',
        number: '201',
        name: 'Presidential Suite',
        type: 'presidential',
        status: 'cleaning',
        basePrice: 35000,
        currency: 'DZD',
        maxOccupancy: 4,
        floor: 2,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'jacuzzi', 'balcony'],
        images: [],
        description: 'Luxurious presidential suite with premium amenities',
        lastCleaned: new Date(),
        isSelected: false,
        order: 2
      },
      {
        id: '4',
        number: '202',
        name: 'Family Suite',
        type: 'suite',
        status: 'maintenance',
        basePrice: 22000,
        currency: 'DZD',
        maxOccupancy: 6,
        floor: 2,
        amenities: ['wifi', 'ac', 'tv', 'kitchenette'],
        images: [],
        description: 'Spacious family suite with kitchenette',
        lastCleaned: new Date(),
        isSelected: false,
        order: 3
      }
    ];
    
    setRooms(mockRooms);
    setFilteredRooms(mockRooms);
    setLoading(false);
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
            
            <button className="flex items-center space-x-2 p-4 bg-blue-600/90 hover:bg-blue-600 rounded-2xl transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            
            <button className="flex items-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-colors font-semibold">
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
        />
      )}

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
};

export default AdvancedRoomManagement;
