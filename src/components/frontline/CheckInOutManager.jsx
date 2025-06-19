import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  Search,
  Calendar,
  Bed,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  CreditCard,
  Key,
  FileText
} from 'lucide-react';

const CheckInOutManager = () => {
  const [activeAction, setActiveAction] = useState('checkin'); // 'checkin' or 'checkout'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load today's reservations
  useEffect(() => {
    loadTodaysReservations();
  }, []);

  const loadTodaysReservations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations?date=${today}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setReservations(data.data.reservations || []);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      // Fallback demo data
      setReservations([
        {
          _id: '1',
          reservationNumber: 'RES001',
          guestId: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1234567890' },
          roomId: { number: '101', type: 'deluxe' },
          checkInDate: new Date().toISOString(),
          checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed',
          totalAmount: 250
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (reservation) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            actualCheckInTime: new Date().toISOString(),
            notes: 'Checked in via frontline dashboard'
          })
        }
      );

      if (response.ok) {
        window.showToast && window.showToast('Guest checked in successfully', 'success');
        loadTodaysReservations();
        setSelectedReservation(null);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      window.showToast && window.showToast('Failed to check in guest', 'error');
    }
  };

  const handleCheckOut = async (reservation) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            actualCheckOutTime: new Date().toISOString(),
            notes: 'Checked out via frontline dashboard'
          })
        }
      );

      if (response.ok) {
        window.showToast && window.showToast('Guest checked out successfully', 'success');
        loadTodaysReservations();
        setSelectedReservation(null);
      }
    } catch (error) {
      console.error('Check-out error:', error);
      window.showToast && window.showToast('Failed to check out guest', 'error');
    }
  };

  const filteredReservations = reservations.filter(res => {
    const searchLower = searchQuery.toLowerCase();
    const guestName = `${res.guestId?.firstName} ${res.guestId?.lastName}`.toLowerCase();
    const roomNumber = res.roomId?.number?.toLowerCase() || '';
    const reservationNumber = res.reservationNumber?.toLowerCase() || '';
    
    return guestName.includes(searchLower) || 
           roomNumber.includes(searchLower) || 
           reservationNumber.includes(searchLower);
  });

  const getReservationsForAction = () => {
    if (activeAction === 'checkin') {
      return filteredReservations.filter(res => res.status === 'confirmed');
    } else {
      return filteredReservations.filter(res => res.status === 'checked_in');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Check-In / Check-Out</h2>
              <p className="text-blue-100">Process guest arrivals and departures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toggle */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveAction('checkin')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeAction === 'checkin'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Check-In</span>
        </button>
        <button
          onClick={() => setActiveAction('checkout')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeAction === 'checkout'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <UserX className="w-5 h-5" />
          <span>Check-Out</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by guest name, room number, or reservation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sysora-mint focus:border-transparent"
        />
      </div>

      {/* Reservations List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-mint mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading reservations...</p>
          </div>
        ) : getReservationsForAction().length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No reservations available for {activeAction === 'checkin' ? 'check-in' : 'check-out'}
            </p>
          </div>
        ) : (
          getReservationsForAction().map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                    {reservation.guestId?.firstName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">#{reservation.reservationNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span>Room {reservation.roomId?.number}</span>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => activeAction === 'checkin' ? handleCheckIn(reservation) : handleCheckOut(reservation)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      activeAction === 'checkin'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {activeAction === 'checkin' ? 'Check In' : 'Check Out'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckInOutManager;
