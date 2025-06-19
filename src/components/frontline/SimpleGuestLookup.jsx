import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Plus,
  Eye,
  UserPlus,
  Clock,
  Bed,
  CreditCard
} from 'lucide-react';

const SimpleGuestLookup = ({ onShowGuestModal }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchGuests();
    } else {
      setGuests([]);
    }
  }, [searchQuery]);

  const searchGuests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/guests?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setGuests(data.data.guests || []);
      }
    } catch (error) {
      console.error('Error searching guests:', error);
      // Fallback demo data
      if (searchQuery.toLowerCase().includes('john')) {
        setGuests([
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            nationality: 'US',
            totalStays: 3,
            lastStay: '2024-01-15',
            isVip: false,
            preferences: ['Non-smoking', 'High floor']
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createQuickGuest = () => {
    if (onShowGuestModal) {
      onShowGuestModal();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const GuestCard = ({ guest }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
            {guest.firstName?.charAt(0)}{guest.lastName?.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {guest.firstName} {guest.lastName}
              {guest.isVip && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  VIP
                </span>
              )}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{guest.email}</span>
              </div>
              {guest.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{guest.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setSelectedGuest(guest)}
          className="px-4 py-2 bg-sysora-mint text-sysora-midnight rounded-lg font-medium hover:bg-sysora-mint-dark transition-colors"
        >
          View Details
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Total Stays</div>
          <div className="font-medium">{guest.totalStays || 0}</div>
        </div>
        <div>
          <div className="text-gray-500">Last Stay</div>
          <div className="font-medium">{formatDate(guest.lastStay)}</div>
        </div>
      </div>
    </div>
  );

  const GuestDetailsModal = ({ guest, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Guest Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
              {guest.firstName?.charAt(0)}{guest.lastName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {guest.firstName} {guest.lastName}
                {guest.isVip && (
                  <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    VIP Guest
                  </span>
                )}
              </h3>
              <p className="text-gray-600">{guest.nationality}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{guest.email}</span>
                </div>
                {guest.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{guest.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Stay History</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{guest.totalStays || 0} total stays</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Last stay: {formatDate(guest.lastStay)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          {guest.preferences && guest.preferences.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {guest.preferences.map((pref, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Create Reservation
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Guest Lookup</h2>
              <p className="text-orange-100">Search guests and create profiles</p>
            </div>
          </div>
          
          <button
            onClick={createQuickGuest}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, email, or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sysora-mint focus:border-transparent"
        />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-mint mx-auto"></div>
            <p className="text-gray-500 mt-2">Searching guests...</p>
          </div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Enter at least 2 characters to search</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No guests found</p>
            <button
              onClick={createQuickGuest}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-sysora-mint text-sysora-midnight rounded-lg font-medium hover:bg-sysora-mint-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Guest</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {guests.map((guest) => (
              <GuestCard key={guest._id} guest={guest} />
            ))}
          </div>
        )}
      </div>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <GuestDetailsModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
        />
      )}
    </div>
  );
};

export default SimpleGuestLookup;
