import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  TrendingUp,
  Award,
  Heart,
  Clock,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Mock guest data
  useEffect(() => {
    const mockGuests = [
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: 'ahmed.hassan@email.com',
        phone: '+213 555 123 456',
        nationality: 'Algeria',
        dateOfBirth: '1985-03-15',
        address: 'Algiers, Algeria',
        membershipLevel: 'gold',
        totalStays: 12,
        totalSpent: 15420,
        lastStay: '2024-01-15',
        status: 'active',
        rating: 4.8,
        preferences: ['Non-smoking', 'High floor', 'City view'],
        loyaltyPoints: 2840,
        avatar: null
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 555 987 654',
        nationality: 'USA',
        dateOfBirth: '1990-07-22',
        address: 'New York, USA',
        membershipLevel: 'platinum',
        totalStays: 25,
        totalSpent: 45200,
        lastStay: '2024-01-20',
        status: 'active',
        rating: 4.9,
        preferences: ['Suite', 'Late checkout', 'Spa access'],
        loyaltyPoints: 5680,
        avatar: null
      },
      {
        id: 3,
        firstName: 'Mohamed',
        lastName: 'Benali',
        email: 'mohamed.benali@email.com',
        phone: '+213 555 789 123',
        nationality: 'Algeria',
        dateOfBirth: '1978-11-08',
        address: 'Oran, Algeria',
        membershipLevel: 'silver',
        totalStays: 8,
        totalSpent: 8900,
        lastStay: '2023-12-10',
        status: 'inactive',
        rating: 4.5,
        preferences: ['Business center', 'Early breakfast'],
        loyaltyPoints: 1200,
        avatar: null
      }
    ];
    setGuests(mockGuests);
  }, []);

  // Filter and sort guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    const matchesMembership = membershipFilter === 'all' || guest.membershipLevel === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'totalStays':
        return b.totalStays - a.totalStays;
      case 'lastStay':
        return new Date(b.lastStay) - new Date(a.lastStay);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Get membership badge color
  const getMembershipColor = (level) => {
    switch (level) {
      case 'platinum':
        return 'bg-gray-800 text-white';
      case 'gold':
        return 'bg-yellow-500 text-white';
      case 'silver':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-gray-600 bg-gray-50';
      case 'blocked':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate stats
  const stats = {
    total: guests.length,
    active: guests.filter(g => g.status === 'active').length,
    vip: guests.filter(g => ['gold', 'platinum'].includes(g.membershipLevel)).length,
    avgRating: guests.length > 0 ? (guests.reduce((sum, g) => sum + g.rating, 0) / guests.length).toFixed(1) : 0
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-sysora-midnight to-blue-900 rounded-3xl p-8 text-white shadow-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <Users className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Guest Management</h2>
                <p className="text-blue-100/80 text-lg">Comprehensive guest database & relationship management</p>
              </div>
            </div>
            
            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-blue-100/70">Total Guests</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.active}</p>
                    <p className="text-sm text-blue-100/70">Active</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.vip}</p>
                    <p className="text-sm text-blue-100/70">VIP Members</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.avgRating}</p>
                    <p className="text-sm text-blue-100/70">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setLoading(!loading)}
              className={`flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm ${loading ? 'animate-spin' : 'hover:scale-105'}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="sm:hidden">Refresh</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600/90 hover:bg-blue-600 rounded-2xl transition-all duration-300 border border-blue-500/30 hover:scale-105">
              <Upload className="w-5 h-5" />
              <span>Import</span>
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-sysora-mint/20"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Guest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Search & Filter Guests</h3>
              <p className="text-gray-500 mt-1">Find and organize guest profiles efficiently</p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredGuests.length} of {guests.length} guests
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px] text-gray-900 font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">✅ Active</option>
                <option value="inactive">⏸️ Inactive</option>
                <option value="blocked">❌ Blocked</option>
              </select>

              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[160px] text-gray-900 font-medium"
              >
                <option value="all">All Memberships</option>
                <option value="platinum">💎 Platinum</option>
                <option value="gold">🥇 Gold</option>
                <option value="silver">🥈 Silver</option>
                <option value="bronze">🥉 Bronze</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[180px] text-gray-900 font-medium"
              >
                <option value="name">📝 Sort by Name</option>
                <option value="totalSpent">💰 Sort by Spending</option>
                <option value="totalStays">🏨 Sort by Stays</option>
                <option value="lastStay">📅 Sort by Last Visit</option>
                <option value="rating">⭐ Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Guest Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sysora-mint to-sysora-mint-dark rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{guest.firstName} {guest.lastName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getMembershipColor(guest.membershipLevel)}`}>
                      {guest.membershipLevel.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(guest.status)}`}>
                      {guest.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{guest.rating}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{guest.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{guest.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{guest.nationality}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{guest.totalStays}</div>
                <div className="text-xs text-gray-500">Stays</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">${guest.totalSpent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Spent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{guest.loyaltyPoints}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-sysora-mint text-sysora-midnight rounded-xl hover:bg-sysora-mint/90 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGuests.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add First Guest
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestManagement;
