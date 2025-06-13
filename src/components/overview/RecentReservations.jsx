import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  Download,
  RefreshCw,
  MoreHorizontal,
  Star,
  MessageSquare
} from 'lucide-react';
import CurrencyDisplay from '../CurrencyDisplay';
import { useCurrency } from '../../contexts/CurrencyContext';

const RecentReservations = ({ data, loading, onRefresh, onActionClick }) => {
  const currency = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Guest', 'Room', 'Check-in', 'Status', 'Amount'].map((header, index) => (
                    <th key={index} className="text-left py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    {[...Array(5)].map((_, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const reservations = data?.recentReservations || [];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = !searchTerm || 
      reservation.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.room?.number?.includes(searchTerm) ||
      reservation.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'checked_in':
        return <Clock className="w-4 h-4" />;
      case 'checked_out':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleDetails = (reservationId) => {
    setShowDetails(prev => ({
      ...prev,
      [reservationId]: !prev[reservationId]
    }));
  };

  const getReservationStats = () => {
    const stats = {
      total: reservations.length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      pending: reservations.filter(r => r.status === 'pending').length,
      checkedIn: reservations.filter(r => r.status === 'checked_in').length,
      totalValue: reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0)
    };
    return stats;
  };

  const stats = getReservationStats();

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-sysora-midnight">Recent Reservations</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredReservations.length} of {reservations.length} reservations
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-sysora-mint transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            className="p-2 text-gray-600 hover:text-sysora-mint transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-lg font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xs text-gray-600">Confirmed</p>
          <p className="text-lg font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-xl">
          <p className="text-xs text-gray-600">Pending</p>
          <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <p className="text-xs text-gray-600">Total Value</p>
          <CurrencyDisplay
            amount={stats.totalValue}
            currencyCode={currency.code}
            className="text-lg font-bold text-purple-600"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, email, room, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations Table */}
      {filteredReservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Room</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Check-in</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sysora-mint/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-sysora-mint" />
                        </div>
                        <div>
                          <p className="font-medium text-sysora-midnight">
                            {reservation.guest?.name || 'Unknown Guest'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reservation.guest?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-sysora-midnight">
                          Room {reservation.room?.number}
                        </span>
                        <p className="text-sm text-gray-500">{reservation.room?.type}</p>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-sm text-sysora-midnight font-medium">
                          {formatDate(reservation.checkInDate)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {formatTime(reservation.checkInDate)}
                        </p>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize">{reservation.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    
                    <td className="py-3 px-4">
                      <CurrencyDisplay
                        amount={reservation.totalAmount}
                        currencyCode={currency.code}
                        className="font-medium text-sysora-midnight"
                      />
                      <p className="text-xs text-gray-500">
                        {reservation.nights} night{reservation.nights !== 1 ? 's' : ''}
                      </p>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleDetails(reservation.id)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => onActionClick('edit-reservation', reservation)}
                          className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {showDetails[reservation.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="py-4 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3" />
                                <span>{reservation.guest?.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3" />
                                <span>{reservation.guest?.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="w-3 h-3" />
                                <span>{reservation.guests} guest{reservation.guests !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Reservation Details</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div>ID: {reservation.id}</div>
                              <div>Check-out: {formatDate(reservation.checkOutDate)}</div>
                              <div>Created: {formatDate(reservation.createdAt)}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                                Send Email
                              </button>
                              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
                                Call Guest
                              </button>
                              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors">
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching reservations' : 'No recent reservations'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first reservation to get started'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button 
              onClick={() => onActionClick('reservations')}
              className="btn-primary"
            >
              Create First Reservation
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentReservations;
