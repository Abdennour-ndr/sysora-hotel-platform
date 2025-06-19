import React, { useState, useEffect } from 'react';
import {
  Bed,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Coffee,
  Search,
  Filter,
  RefreshCw,
  User,
  Calendar
} from 'lucide-react';

const SimpleRoomStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setRooms(data.data.rooms || []);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Fallback demo data
      setRooms([
        { _id: '1', number: '101', type: 'standard', status: 'available', cleaningStatus: 'clean' },
        { _id: '2', number: '102', type: 'deluxe', status: 'occupied', cleaningStatus: 'dirty', currentGuest: 'John Doe' },
        { _id: '3', number: '103', type: 'suite', status: 'cleaning', cleaningStatus: 'in_progress' },
        { _id: '4', number: '104', type: 'standard', status: 'maintenance', cleaningStatus: 'clean' },
        { _id: '5', number: '201', type: 'deluxe', status: 'available', cleaningStatus: 'clean' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateRoomStatus = async (roomId, newStatus) => {
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
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (response.ok) {
        setRooms(rooms.map(room => 
          room._id === roomId ? { ...room, status: newStatus } : room
        ));
        window.showToast && window.showToast(`Room ${rooms.find(r => r._id === roomId)?.number} status updated`, 'success');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      window.showToast && window.showToast('Failed to update room status', 'error');
    }
  };

  const requestCleaning = async (roomId) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/${roomId}/cleaning/request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            priority: 'normal',
            notes: 'Cleaning requested from room status'
          })
        }
      );

      if (response.ok) {
        setRooms(rooms.map(room => 
          room._id === roomId ? { ...room, status: 'cleaning', cleaningStatus: 'in_progress' } : room
        ));
        window.showToast && window.showToast('Cleaning request submitted', 'success');
      }
    } catch (error) {
      console.error('Error requesting cleaning:', error);
      window.showToast && window.showToast('Failed to request cleaning', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'occupied': return <User className="w-5 h-5 text-blue-600" />;
      case 'cleaning': return <Coffee className="w-5 h-5 text-yellow-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-red-600" />;
      default: return <Bed className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Bed className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Room Status</h2>
              <p className="text-green-100">View and update room availability</p>
            </div>
          </div>
          
          <button
            onClick={loadRooms}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.available}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.occupied}</div>
              <div className="text-sm text-gray-600">Occupied</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Coffee className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.cleaning}</div>
              <div className="text-sm text-gray-600">Cleaning</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">{statusCounts.maintenance}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sysora-mint focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sysora-mint focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-mint mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No rooms found</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(room.status)}
                  <span className="font-semibold text-gray-900">Room {room.number}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <div>Type: {room.type}</div>
                {room.currentGuest && (
                  <div>Guest: {room.currentGuest}</div>
                )}
              </div>

              <div className="flex space-x-2">
                {room.status === 'available' && (
                  <button
                    onClick={() => updateRoomStatus(room._id, 'occupied')}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Assign
                  </button>
                )}
                {room.status === 'occupied' && (
                  <button
                    onClick={() => requestCleaning(room._id)}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Clean
                  </button>
                )}
                {room.status === 'cleaning' && (
                  <button
                    onClick={() => updateRoomStatus(room._id, 'available')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Ready
                  </button>
                )}
                {room.status !== 'maintenance' && (
                  <button
                    onClick={() => updateRoomStatus(room._id, 'maintenance')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <Wrench className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleRoomStatus;
