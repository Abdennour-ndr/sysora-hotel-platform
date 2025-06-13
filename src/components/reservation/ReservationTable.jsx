import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Home
} from 'lucide-react';

const ReservationTable = ({
  reservations = [],
  onAction,
  loading = false,
  sortBy = 'checkInDate',
  sortOrder = 'asc',
  onSort
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Handle real actions with API calls
  const handleAction = async (action, reservation) => {
    try {
      const token = localStorage.getItem('sysora_token');
      if (!token) {
        window.showToast && window.showToast('Authentication required', 'error');
        return;
      }

      switch (action) {
        case 'checkin':
          if (!window.confirm(`Check in ${reservation.guestId?.firstName} ${reservation.guestId?.lastName}?`)) return;

          const checkinResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkin`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: 'Check-in from reservation table' })
          });

          if (checkinResponse.ok) {
            window.showToast && window.showToast('Guest checked in successfully', 'success');
            onAction?.('refresh');
          } else {
            const errorData = await checkinResponse.json();
            window.showToast && window.showToast(errorData.error || 'Failed to check in guest', 'error');
          }
          break;

        case 'checkout':
          if (!window.confirm(`Check out ${reservation.guestId?.firstName} ${reservation.guestId?.lastName}?`)) return;

          const checkoutResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/checkout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: 'Check-out from reservation table' })
          });

          if (checkoutResponse.ok) {
            window.showToast && window.showToast('Guest checked out successfully', 'success');
            onAction?.('refresh');
          } else {
            const errorData = await checkoutResponse.json();
            window.showToast && window.showToast(errorData.error || 'Failed to check out guest', 'error');
          }
          break;

        case 'payment':
          const amount = window.prompt('Enter payment amount (DZD):');
          if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            window.showToast && window.showToast('Please enter a valid amount', 'warning');
            return;
          }

          const method = window.prompt('Payment method (cash/credit_card/bank_transfer):', 'cash');
          if (!method) return;

          const paymentResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/payments`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: parseFloat(amount),
              method,
              notes: 'Payment from reservation table'
            })
          });

          if (paymentResponse.ok) {
            window.showToast && window.showToast('Payment added successfully', 'success');
            onAction?.('refresh');
          } else {
            const errorData = await paymentResponse.json();
            window.showToast && window.showToast(errorData.error || 'Failed to add payment', 'error');
          }
          break;

        default:
          onAction?.(action, reservation);
          break;
      }
    } catch (error) {
      console.error('Action error:', error);
      window.showToast && window.showToast('An error occurred', 'error');
    }
  };

  const toggleRowExpansion = (reservationId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(reservationId)) {
      newExpanded.delete(reservationId);
    } else {
      newExpanded.add(reservationId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleRowSelection = (reservationId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(reservationId)) {
      newSelected.delete(reservationId);
    } else {
      newSelected.add(reservationId);
    }
    setSelectedRows(newSelected);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        label: 'Confirmed', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle 
      },
      checked_in: { 
        label: 'Checked In', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle 
      },
      checked_out: { 
        label: 'Checked Out', 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: CheckCircle 
      },
      cancelled: { 
        label: 'Cancelled', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle 
      },
      no_show: { 
        label: 'No Show', 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Clock 
      }
    };

    const config = statusConfig[status] || statusConfig.confirmed;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus, paidAmount, totalAmount) => {
    const percentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
    
    const statusConfig = {
      paid: { 
        label: 'Fully Paid', 
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      },
      partial: { 
        label: `${percentage.toFixed(0)}% Paid`, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      },
      pending: { 
        label: 'Pending', 
        className: 'bg-gray-100 text-gray-800 border-gray-200' 
      },
      overpaid: { 
        label: 'Overpaid', 
        className: 'bg-purple-100 text-purple-800 border-purple-200' 
      }
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} DZD`;
  };

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort?.(column, newOrder);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new reservation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(reservations.map(r => r._id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('checkInDate')}
              >
                Check-in {getSortIcon('checkInDate')}
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('checkOutDate')}
              >
                Check-out {getSortIcon('checkOutDate')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('totalAmount')}
              >
                Amount {getSortIcon('totalAmount')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <React.Fragment key={reservation._id}>
                {/* Main Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(reservation._id)}
                      onChange={() => toggleRowSelection(reservation._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleRowExpansion(reservation._id)}
                        className="mr-2 p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedRows.has(reservation._id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.guest?.firstName} {reservation.guest?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{reservation.reservationNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(reservation.checkInDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(reservation.checkOutDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      Room {reservation.room?.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.room?.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(reservation.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentStatusBadge(
                      reservation.paymentStatus, 
                      reservation.paidAmount, 
                      reservation.totalAmount
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Check-in button for confirmed reservations */}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleAction('checkin', reservation)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Check In Guest"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Check-out button for checked-in reservations */}
                      {reservation.status === 'checked_in' && (
                        <button
                          onClick={() => handleAction('checkout', reservation)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Check Out Guest"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Payment button for unpaid/partially paid reservations */}
                      {(reservation.paymentStatus === 'pending' || reservation.paymentStatus === 'partial') && (
                        <button
                          onClick={() => handleAction('payment', reservation)}
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Add Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}

                      {/* View button */}
                      <button
                        onClick={() => onAction?.('view', reservation)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => onAction?.('edit', reservation)}
                        className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Edit Reservation"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Cancel/Delete button for active reservations */}
                      {reservation.status !== 'cancelled' && reservation.status !== 'checked_out' && (
                        <button
                          onClick={() => onAction?.('delete', reservation)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRows.has(reservation._id) && (
                  <tr className="bg-gray-50">
                    <td colSpan="9" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Guest Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Guest Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {reservation.guest?.email}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {reservation.guest?.phone}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              {reservation.adults} Adults, {reservation.children} Children
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Booking Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="text-gray-600">
                              <span className="font-medium">Source:</span> {reservation.source}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Nights:</span> {reservation.nights}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Rate:</span> {formatCurrency(reservation.roomRate)}/night
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payment Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="text-gray-600">
                              <span className="font-medium">Total:</span> {formatCurrency(reservation.totalAmount)}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Paid:</span> {formatCurrency(reservation.paidAmount)}
                            </div>
                            <div className="text-gray-600">
                              <span className="font-medium">Balance:</span> {formatCurrency(reservation.totalAmount - reservation.paidAmount)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {reservation.specialRequests && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                          <p className="text-sm text-gray-600">{reservation.specialRequests}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
