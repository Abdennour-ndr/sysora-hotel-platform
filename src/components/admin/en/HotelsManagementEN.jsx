import React, { useState } from 'react';
import {
  Building,
  Users,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  MoreVertical,
  MapPin,
  Mail,
  Phone,
  Star,
  Clock
} from 'lucide-react';

const HotelsManagementEN = ({ hotels = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHotels, setSelectedHotels] = useState([]);

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && hotel.isActive) ||
                         (filterStatus === 'inactive' && !hotel.isActive) ||
                         (filterStatus === 'trial' && hotel.subscription?.plan === 'trial');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (hotel) => {
    if (!hotel.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
    
    if (hotel.subscription?.plan === 'trial') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Trial
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const planColors = {
      trial: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      standard: 'bg-purple-100 text-purple-800',
      premium: 'bg-yellow-100 text-yellow-800',
      enterprise: 'bg-green-100 text-green-800'
    };

    const planNames = {
      trial: 'Trial',
      basic: 'Basic',
      standard: 'Standard',
      premium: 'Premium',
      enterprise: 'Enterprise'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[plan] || planColors.trial}`}>
        {planNames[plan] || plan}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-sysora-midnight">Hotel Management</h2>
          <p className="text-sm sm:text-base text-gray-600">View and manage all hotels</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="bg-sysora-mint hover:bg-sysora-mint/90 text-sysora-midnight px-4 py-2 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span className="text-sm sm:text-base">Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-white min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="trial">Trial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-sysora-midnight">{hotels.length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Hotels</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-green-600">{hotels.filter(h => h.isActive).length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">{hotels.filter(h => h.subscription?.plan === 'trial').length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Trial</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-red-600">{hotels.filter(h => !h.isActive).length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Inactive</p>
          </div>
        </div>
      </div>

      {/* Hotels Table/Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-sysora-mint" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {hotel.subdomain}.sysora.app
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {hotel.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(hotel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(hotel.subscription?.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(hotel.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-sysora-mint hover:text-sysora-mint/80 p-2 rounded-xl hover:bg-sysora-mint/10 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-xl hover:bg-blue-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredHotels.map((hotel) => (
            <div key={hotel._id} className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-sysora-mint" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.subdomain}.sysora.app</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(hotel)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Plan</p>
                  <div className="mt-1">{getPlanBadge(hotel.subscription?.plan)}</div>
                </div>
                <div>
                  <p className="text-gray-500">Registration</p>
                  <p className="font-medium text-gray-900">{formatDate(hotel.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900">{hotel.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="text-gray-900">{hotel.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                <button className="text-sysora-mint hover:text-sysora-mint/80 p-2 rounded-xl hover:bg-sysora-mint/10 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-xl hover:bg-blue-50 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Building className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500">No hotels match the search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsManagementEN;
