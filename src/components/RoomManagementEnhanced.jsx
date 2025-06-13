import React, { useState, useEffect } from 'react';
import {
  Bed,
  Plus,
  Edit,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Wrench,
  Sparkles,
  Eye,
  Users,
  Grid,
  List,
  Star,
  TrendingUp,
  Activity,
  RefreshCw,
  Image,
  Wifi,
  Coffee,
  X
} from 'lucide-react';
import AddRoomModal from './AddRoomModal';
import EditRoomModal from './EditRoomModal';
import MaintenanceRequestModal from './MaintenanceRequestModal';
import CurrencyDisplay, { useCurrency } from './CurrencyDisplay';

const RoomManagementEnhanced = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Get current hotel currency
  const currency = useCurrency();

  useEffect(() => {
    fetchRooms();
  }, [statusFilter, typeFilter, searchTerm, sortBy]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sysora_token');
      const params = new URLSearchParams();

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRooms(data.data.rooms);
        setStats(data.data.stats || {});
      } else {
        console.error('Failed to fetch rooms:', data.message);
      }
    } catch (error) {
      console.error('Fetch rooms error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Room status updated successfully', 'success');
        fetchRooms();
      } else {
        window.showToast && window.showToast(data.message || 'Failed to update room status', 'error');
      }
    } catch (error) {
      console.error('Update room status error:', error);
      window.showToast && window.showToast('Error updating room status', 'error');
    }
  };

  const requestCleaning = async (roomId, priority = 'normal') => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${roomId}/cleaning/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priority,
          notes: 'Cleaning request from room management'
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Cleaning request submitted successfully', 'success');
        fetchRooms();
      } else {
        window.showToast && window.showToast(data.message || 'Failed to request cleaning', 'error');
      }
    } catch (error) {
      console.error('Request cleaning error:', error);
      window.showToast && window.showToast('Error requesting cleaning', 'error');
    }
  };

  const requestMaintenance = (room) => {
    setSelectedRoom(room);
    setShowMaintenanceModal(true);
  };

  const viewRoomDetails = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleMaintenanceSubmit = async (maintenanceData) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${maintenanceData.roomId}/maintenance/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issue: maintenanceData.issue,
          priority: maintenanceData.priority,
          category: maintenanceData.category,
          description: maintenanceData.description
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Maintenance request submitted successfully', 'success');
        fetchRooms();
      } else {
        window.showToast && window.showToast(data.message || 'Failed to request maintenance', 'error');
      }
    } catch (error) {
      console.error('Request maintenance error:', error);
      window.showToast && window.showToast('Error requesting maintenance', 'error');
    }
  };

  const handleSaveRoom = (newRoom) => {
    setRooms(prev => [...prev, newRoom]);
  };

  const handleEditRoom = (updatedRoom) => {
    setRooms(prev => prev.map(room =>
      room._id === updatedRoom._id ? updatedRoom : room
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'occupied':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'cleaning':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'out_of_order':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'out_of_order':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      available: 'Available',
      occupied: 'Occupied',
      cleaning: 'Cleaning',
      maintenance: 'Maintenance',
      out_of_order: 'Out of Order'
    };
    return statusMap[status] || status;
  };

  const getRoomTypeIcon = (type) => {
    switch (type) {
      case 'suite':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'presidential':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'deluxe':
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Bed className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAmenityIcons = (amenities) => {
    const iconMap = {
      'WiFi': <Wifi className="w-3 h-3" />,
      'Air Conditioning': <Activity className="w-3 h-3" />,
      'Television': <Activity className="w-3 h-3" />,
      'Mini Fridge': <Activity className="w-3 h-3" />,
      'Safe': <Activity className="w-3 h-3" />,
      'Balcony': <Activity className="w-3 h-3" />,
      'Private Bathroom': <Activity className="w-3 h-3" />,
      'Jacuzzi': <Activity className="w-3 h-3" />,
      'Kitchenette': <Coffee className="w-3 h-3" />
    };
    
    return amenities?.slice(0, 3).map((amenity) => (
      <div key={amenity} className="flex items-center space-x-1 text-xs text-gray-600">
        {iconMap[amenity] || <Activity className="w-3 h-3" />}
        <span className="hidden sm:inline">{amenity}</span>
      </div>
    ));
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'number':
        return a.number.localeCompare(b.number);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'price':
        return b.basePrice - a.basePrice;
      case 'capacity':
        return b.maxOccupancy - a.maxOccupancy;
      case 'floor':
        return a.floor - b.floor;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sysora-midnight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Improved Design */}
      <div className="bg-gradient-to-r from-sysora-midnight via-sysora-midnight to-blue-900 rounded-3xl p-8 text-white shadow-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <Bed className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Room Management</h2>
                <p className="text-blue-100/80 text-lg">Comprehensive room operations & status control</p>
              </div>
            </div>

            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sysora-mint/20 rounded-lg">
                    <Bed className="w-5 h-5 text-sysora-mint" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rooms.length}</p>
                    <p className="text-sm text-blue-100/70">Total Rooms</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.available || 0}</p>
                    <p className="text-sm text-blue-100/70">Available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.occupied || 0}</p>
                    <p className="text-sm text-blue-100/70">Occupied</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.cleaning || 0}</p>
                    <p className="text-sm text-blue-100/70">Cleaning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              className={`flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm ${refreshing ? 'animate-spin' : 'hover:scale-105'}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="sm:hidden">Refresh</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-sysora-mint/20"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:border-sysora-mint/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{getStatusText(status)}</p>
                  <p className="text-4xl font-bold text-gray-900 group-hover:text-sysora-midnight transition-colors">{count}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+2.5%</span>
                  </div>
                  <span className="text-xs text-gray-400">vs last week</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-sysora-mint/10 group-hover:to-sysora-mint/20 transition-all duration-300">
                {getStatusIcon(status)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Capacity</span>
                <span>{Math.round((count / rooms.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-sysora-mint to-sysora-mint/80 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((count / rooms.length) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters and Controls */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Rooms</h3>
              <p className="text-gray-500 mt-1">Find and organize rooms efficiently</p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {sortedRooms.length} of {rooms.length} rooms
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Enhanced Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by room number, type, or amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Enhanced Filter Dropdowns */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px] text-gray-900 font-medium cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="available">✅ Available</option>
                    <option value="occupied">👥 Occupied</option>
                    <option value="cleaning">✨ Cleaning</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="out_of_order">❌ Out of Order</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px] text-gray-900 font-medium cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="standard">🛏️ Standard</option>
                    <option value="deluxe">⭐ Deluxe</option>
                    <option value="suite">👑 Suite</option>
                    <option value="presidential">💎 Presidential</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[180px] text-gray-900 font-medium cursor-pointer"
                  >
                    <option value="number">📊 Sort by Number</option>
                    <option value="type">🏷️ Sort by Type</option>
                    <option value="price">💰 Sort by Price</option>
                    <option value="capacity">👥 Sort by Capacity</option>
                    <option value="floor">🏢 Sort by Floor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced View Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex items-center space-x-1 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-medium ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-md text-sysora-midnight'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-medium ${
                    viewMode === 'list'
                      ? 'bg-white shadow-md text-sysora-midnight'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Rooms Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Room Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    {getRoomTypeIcon(room.type)}
                    <span className="text-xs font-medium text-gray-700">{room.type}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => viewRoomDetails(room)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sysora-midnight/10 rounded-lg">
                      <Bed className="w-5 h-5 text-sysora-midnight" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Room {room.number}</h3>
                      <p className="text-sm text-gray-500">Floor {room.floor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CurrencyDisplay
                      amount={room.basePrice}
                      currencyCode={currency.code}
                      className="font-bold text-lg text-sysora-midnight"
                    />
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{room.maxOccupancy} guests</span>
                    </div>
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amenities:</span>
                      <div className="flex items-center space-x-2">
                        {getAmenityIcons(room.amenities)}
                        {room.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowEditModal(true);
                      }}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => viewRoomDetails(room)}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => requestCleaning(room._id)}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-all border border-yellow-200"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Clean</span>
                    </button>
                    <button
                      onClick={() => requestMaintenance(room)}
                      className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all border border-orange-200"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Maintain</span>
                    </button>
                  </div>

                  {/* Status Selector */}
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room._id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_order">Out of Order</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedRooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-sysora-midnight/10 rounded-lg overflow-hidden">
                          {room.images && room.images.length > 0 ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/image/${room.images.find(img => img.isPrimary)?.filename || room.images[0]?.filename}`}
                              alt={`Room ${room.number}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center" style={{ display: room.images && room.images.length > 0 ? 'none' : 'flex' }}>
                            <Bed className="w-5 h-5 text-sysora-midnight" />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Room {room.number}</div>
                          <div className="text-sm text-gray-500">
                            Floor {room.floor}
                            {room.images && room.images.length > 0 && (
                              <span className="ml-2 text-emerald-600">• {room.images.length} photo{room.images.length !== 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoomTypeIcon(room.type)}
                        <span className="font-medium text-gray-900">{room.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                        {getStatusIcon(room.status)}
                        <span className="ml-2">{getStatusText(room.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{room.maxOccupancy} guests</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CurrencyDisplay
                        amount={room.basePrice}
                        currencyCode={currency.code}
                        className="font-semibold text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewRoomDetails(room)}
                          className="p-2 text-gray-600 hover:text-sysora-midnight hover:bg-gray-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Room"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestCleaning(room._id)}
                          className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-all"
                          title="Request Cleaning"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestMaintenance(room)}
                          className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all"
                          title="Request Maintenance"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedRooms.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bed className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No rooms match your current filters. Try adjusting your search criteria.'
              : 'Get started by adding your first room to the system.'
            }
          </p>
          {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-sysora-midnight text-white px-6 py-3 rounded-xl hover:bg-sysora-midnight/90 transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Room</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <AddRoomModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveRoom}
      />

      <EditRoomModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditRoom}
        room={selectedRoom}
      />

      <MaintenanceRequestModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onSubmit={handleMaintenanceSubmit}
        room={selectedRoom}
      />

      {/* Room Details Modal */}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sysora-midnight/10 rounded-xl">
                    <Bed className="w-8 h-8 text-sysora-midnight" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Room {selectedRoom.number}</h2>
                    <p className="text-gray-600">{selectedRoom.type} • Floor {selectedRoom.floor}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Room Images */}
                <div className="space-y-4">
                  {/* Primary Image */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    {selectedRoom.images && selectedRoom.images.length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/image/${selectedRoom.images.find(img => img.isPrimary)?.filename || selectedRoom.images[0]?.filename}`}
                        alt={`Room ${selectedRoom.number}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: selectedRoom.images && selectedRoom.images.length > 0 ? 'none' : 'flex' }}>
                      <div className="text-center">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No images available</p>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  {selectedRoom.images && selectedRoom.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedRoom.images.slice(0, 3).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/image/${image.filename}`}
                            alt={`Room ${selectedRoom.number} - ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRoom.status)}`}>
                          {getStatusText(selectedRoom.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedRoom.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{selectedRoom.maxOccupancy} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Floor:</span>
                        <span className="font-medium">{selectedRoom.floor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <CurrencyDisplay
                          amount={selectedRoom.basePrice}
                          currencyCode={currency.code}
                          className="font-semibold text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRoom.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRoom.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                      <p className="text-gray-600">{selectedRoom.description}</p>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowEditModal(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-sysora-midnight text-white rounded-xl hover:bg-sysora-midnight/90 transition-all font-semibold"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Edit Room</span>
                    </button>
                    <button
                      onClick={() => requestCleaning(selectedRoom._id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all font-semibold"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Request Cleaning</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementEnhanced;
