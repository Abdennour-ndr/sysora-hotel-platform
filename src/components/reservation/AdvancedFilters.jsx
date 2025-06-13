import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Home, 
  CreditCard,
  X,
  RotateCcw,
  Download
} from 'lucide-react';

const AdvancedFilters = ({
  filters = {},
  onFiltersChange,
  onExport,
  totalCount = 0,
  filteredCount = 0,
  reservations = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    roomType: 'all',
    paymentStatus: 'all',
    source: 'all',
    checkInFrom: '',
    checkInTo: '',
    ...filters
  });

  // Calculate real counts from reservations
  const getStatusCounts = () => {
    const counts = {
      all: reservations.length,
      confirmed: 0,
      checked_in: 0,
      checked_out: 0,
      cancelled: 0,
      no_show: 0
    };

    reservations.forEach(reservation => {
      if (counts.hasOwnProperty(reservation.status)) {
        counts[reservation.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const statusOptions = [
    { value: 'all', label: 'All Statuses', count: statusCounts.all },
    { value: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed, color: 'bg-blue-100 text-blue-800' },
    { value: 'checked_in', label: 'Checked In', count: statusCounts.checked_in, color: 'bg-green-100 text-green-800' },
    { value: 'checked_out', label: 'Checked Out', count: statusCounts.checked_out, color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-100 text-red-800' },
    { value: 'no_show', label: 'No Show', count: statusCounts.no_show, color: 'bg-orange-100 text-orange-800' }
  ];

  const roomTypeOptions = [
    { value: 'all', label: 'All Room Types' },
    { value: 'standard', label: 'Standard' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Payment Status' },
    { value: 'paid', label: 'Fully Paid' },
    { value: 'partial', label: 'Partially Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overpaid', label: 'Overpaid' }
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'direct', label: 'Direct Booking' },
    { value: 'booking.com', label: 'Booking.com' },
    { value: 'expedia', label: 'Expedia' },
    { value: 'phone', label: 'Phone' },
    { value: 'walk_in', label: 'Walk-in' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      dateRange: 'all',
      roomType: 'all',
      paymentStatus: 'all',
      source: 'all',
      checkInFrom: '',
      checkInTo: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = [
        'Reservation Number',
        'Guest Name',
        'Email',
        'Phone',
        'Room Number',
        'Room Type',
        'Check-in Date',
        'Check-out Date',
        'Nights',
        'Adults',
        'Children',
        'Status',
        'Total Amount',
        'Paid Amount',
        'Payment Status',
        'Source',
        'Special Requests'
      ];

      const csvContent = [
        headers.join(','),
        ...reservations.map(reservation => [
          reservation.reservationNumber || '',
          `"${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}"`,
          reservation.guestId?.email || '',
          reservation.guestId?.phone || '',
          reservation.roomId?.number || '',
          reservation.roomId?.type || '',
          reservation.checkInDate ? new Date(reservation.checkInDate).toLocaleDateString() : '',
          reservation.checkOutDate ? new Date(reservation.checkOutDate).toLocaleDateString() : '',
          reservation.nights || '',
          reservation.adults || '',
          reservation.children || '',
          reservation.status || '',
          reservation.totalAmount || '',
          reservation.paidAmount || '',
          reservation.paymentStatus || '',
          reservation.source || '',
          `"${reservation.specialRequests || ''}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.showToast && window.showToast(`Exported ${reservations.length} reservations successfully`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      window.showToast && window.showToast('Failed to export reservations', 'error');
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredCount}</span> of{' '}
            <span className="font-medium text-gray-900">{totalCount}</span> reservations
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
          
          <button
            onClick={handleExport}
            disabled={reservations.length === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              reservations.length === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
            title={reservations.length === 0 ? 'No data to export' : `Export ${reservations.length} reservations`}
          >
            <Download className="w-4 h-4" />
            <span>Export ({reservations.length})</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>{isExpanded ? 'Less' : 'More'} Filters</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name, email, phone, or reservation number..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={localFilters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={localFilters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roomTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <select
              value={localFilters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Source</label>
              <select
                value={localFilters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {localFilters.dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in From</label>
                  <input
                    type="date"
                    value={localFilters.checkInFrom}
                    onChange={(e) => handleFilterChange('checkInFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in To</label>
                  <input
                    type="date"
                    value={localFilters.checkInTo}
                    onChange={(e) => handleFilterChange('checkInTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;
