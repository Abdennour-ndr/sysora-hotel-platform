import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, TrendingUp, Bot, Monitor, Zap, Activity, CheckCircle, Users, Clock, Calendar, FileText } from 'lucide-react';
import ComprehensiveAnalyticsHub from './analytics/ComprehensiveAnalyticsHub';
import UnifiedReportsCenter from './unified/UnifiedReportsCenter';
import UnifiedAnalyticsCenter from './unified/UnifiedAnalyticsCenter';
import UnifiedMonitorCenter from './unified/UnifiedMonitorCenter';
import AddReservationModal from './AddReservationModal';
import ReservationStats from './reservation/ReservationStats';
import AdvancedFilters from './reservation/AdvancedFilters';
import ReservationTable from './reservation/ReservationTable';
import ReservationTimeline from './reservation/ReservationTimeline';
import EditReservationModal from './reservation/EditReservationModal';
import PaymentManagementModal from './reservation/PaymentManagementModal';
import PaymentManagementEnhanced from './reservation/PaymentManagementEnhanced';
import CheckInModal from './reservation/CheckInModal';
import CheckOutModal from './reservation/CheckOutModal';
import AdvancedAnalytics from './reservation/AdvancedAnalytics';
import SmartNotifications from './reservation/SmartNotifications';
import AutomationManager from './reservation/AutomationManager';
import SystemDashboard from './reservation/SystemDashboard';
import FinancialReports from './reservation/FinancialReports';
import AdvancedBookingManagement from './bookings/AdvancedBookingManagement';

const ReservationManagement = () => {
  console.log('🏨 ReservationManagement component loaded');
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('checkInDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // New modals state
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEnhancedPaymentModal, setShowEnhancedPaymentModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showSmartNotifications, setShowSmartNotifications] = useState(false);
  const [showAutomationManager, setShowAutomationManager] = useState(false);
  const [showSystemDashboard, setShowSystemDashboard] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAdvancedBookings, setShowAdvancedBookings] = useState(false);
  const [showComprehensiveAnalytics, setShowComprehensiveAnalytics] = useState(false);
  const [showUnifiedReports, setShowUnifiedReports] = useState(false);
  const [showUnifiedAnalytics, setShowUnifiedAnalytics] = useState(false);
  const [showUnifiedMonitor, setShowUnifiedMonitor] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      console.log('📋 Fetching reservations...');
      setLoading(true);
      const token = localStorage.getItem('sysora_token');
      
      if (!token) {
        console.error('❌ No auth token found');
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations?${params}`;
      console.log('🌐 Fetching from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ Reservations loaded:', data.data.reservations.length);
        setReservations(data.data.reservations || []);
      } else {
        console.error('❌ Failed to fetch reservations:', data.message);
        setReservations([]);
      }
    } catch (error) {
      console.error('💥 Fetch reservations error:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Handle reservation cancellation
  const handleCancelReservation = async (reservationId) => {
    const reason = window.prompt('Cancellation reason:');
    if (!reason) return;

    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        window.showToast && window.showToast('Reservation cancelled successfully', 'success');
        fetchReservations();
      } else {
        window.showToast && window.showToast(data.error || 'Failed to cancel reservation', 'error');
      }
    } catch (error) {
      console.error('Cancel reservation error:', error);
      window.showToast && window.showToast('Error cancelling reservation', 'error');
    }
  };

  // Handle new reservation save
  const handleSaveReservation = (newReservation) => {
    setReservations(prev => [newReservation, ...prev]);
  };

  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Filters are applied in real-time via filteredReservations
  };

  // Handle table sorting
  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
    
    const sorted = [...reservations].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
      
      // Handle nested properties
      if (column.includes('.')) {
        const keys = column.split('.');
        aValue = keys.reduce((obj, key) => obj?.[key], a);
        bValue = keys.reduce((obj, key) => obj?.[key], b);
      }
      
      // Handle dates
      if (column.includes('Date')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setReservations(sorted);
  };

  // Handle table actions
  const handleTableAction = (action, reservation) => {
    console.log('🔍 Table action triggered:', { action, reservationId: reservation?._id });

    switch (action) {
      case 'view':
        console.log('🔍 Opening timeline for:', reservation);
        setSelectedReservation(reservation);
        setShowTimelineModal(true);
        break;
      case 'edit':
        console.log('🔍 Opening edit modal for:', reservation);
        setSelectedReservation(reservation);
        setShowEditModal(true);
        console.log('🔍 State after setting edit modal:', {
          selectedReservation: reservation,
          showEditModal: true
        });
        break;
      case 'payment':
        console.log('🔍 Opening payment modal for:', reservation);
        setSelectedReservation(reservation);
        setShowEnhancedPaymentModal(true);
        break;
      case 'checkin':
        console.log('🔍 Opening check-in modal for:', reservation);
        setSelectedReservation(reservation);
        setShowCheckInModal(true);
        break;
      case 'checkout':
        console.log('🔍 Opening check-out modal for:', reservation);
        setSelectedReservation(reservation);
        setShowCheckOutModal(true);
        break;
      case 'delete':
        handleCancelReservation(reservation._id);
        break;
      case 'refresh':
        // Refresh data after actions like check-in, check-out, payment
        fetchReservations();
        break;
      default:
        break;
    }
  };

  // Handle modal close
  const closeAllModals = () => {
    setSelectedReservation(null);
    setShowTimelineModal(false);
    setShowEditModal(false);
    setShowPaymentModal(false);
    setShowEnhancedPaymentModal(false);
    setShowCheckInModal(false);
    setShowCheckOutModal(false);
    setShowAdvancedAnalytics(false);
    setShowSmartNotifications(false);
  };

  // Handle reservation update
  const handleReservationUpdate = (updatedReservation) => {
    if (updatedReservation) {
      setReservations(prev =>
        prev.map(r => r._id === updatedReservation._id ? updatedReservation : r)
      );
    }
    fetchReservations(); // Refresh to get latest data
    closeAllModals();
  };

  // Handle stats card clicks for filtering
  const handleStatsRefresh = (type) => {
    switch (type) {
      case 'arrivals':
        setFilters({
          ...filters,
          dateRange: 'today',
          status: 'confirmed'
        });
        break;
      case 'departures':
        setFilters({
          ...filters,
          dateRange: 'today',
          status: 'checked_out'
        });
        break;
      case 'occupancy':
        setFilters({
          ...filters,
          status: 'checked_in'
        });
        break;
      case 'pending':
        setFilters({
          ...filters,
          status: 'pending'
        });
        break;
      case 'late':
        setFilters({
          ...filters,
          status: 'overdue'
        });
        break;
      default:
        fetchReservations();
        break;
    }
  };

  // Handle export
  const handleExport = () => {
    console.log('Exporting reservations...');
    window.showToast && window.showToast('Export feature coming soon!', 'info');
  };

  // Filter reservations based on current filters
  const filteredReservations = reservations.filter(reservation => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const guestName = `${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`.toLowerCase();
      const email = reservation.guestId?.email?.toLowerCase() || '';
      const reservationNumber = reservation.reservationNumber?.toLowerCase() || '';
      const roomNumber = reservation.roomId?.number?.toString() || '';
      
      if (!guestName.includes(searchTerm) && 
          !email.includes(searchTerm) && 
          !reservationNumber.includes(searchTerm) && 
          !roomNumber.includes(searchTerm)) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && reservation.status !== filters.status) {
      return false;
    }
    
    // Add more filters as needed
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Top */}
        <div className="bg-gradient-to-r from-sysora-midnight to-blue-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sysora-mint/20 rounded-xl">
                <Calendar className="w-6 h-6 text-sysora-mint" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Reservation Management</h1>
                <p className="text-blue-100/80 text-sm">Comprehensive booking operations & guest management</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAdvancedBookings(!showAdvancedBookings)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAdvancedBookings
                    ? 'bg-sysora-mint text-sysora-midnight'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Advanced
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-sysora-mint text-sysora-midnight px-4 py-2 rounded-lg text-sm font-medium hover:bg-sysora-mint/90 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                New Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Statistics Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Reservation Overview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-sysora-mint text-sysora-midnight'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('detailed')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'detailed'
                  ? 'bg-sysora-mint text-sysora-midnight'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {[
            {
              label: 'Total',
              value: reservations.length,
              icon: BarChart3,
              color: 'bg-blue-50 text-blue-600',
              iconBg: 'bg-blue-100'
            },
            {
              label: 'Active',
              value: filteredReservations.length,
              icon: TrendingUp,
              color: 'bg-green-50 text-green-600',
              iconBg: 'bg-green-100'
            },
            {
              label: 'Confirmed',
              value: reservations.filter(r => r.status === 'confirmed').length,
              icon: CheckCircle,
              color: 'bg-emerald-50 text-emerald-600',
              iconBg: 'bg-emerald-100'
            },
            {
              label: 'Checked In',
              value: reservations.filter(r => r.status === 'checked_in').length,
              icon: Users,
              color: 'bg-purple-50 text-purple-600',
              iconBg: 'bg-purple-100'
            },
            {
              label: 'Pending',
              value: reservations.filter(r => r.status === 'pending').length,
              icon: Clock,
              color: 'bg-yellow-50 text-yellow-600',
              iconBg: 'bg-yellow-100'
            },
            {
              label: 'Today',
              value: reservations.filter(r => {
                const today = new Date().toDateString();
                return new Date(r.checkInDate).toDateString() === today;
              }).length,
              icon: Calendar,
              color: 'bg-indigo-50 text-indigo-600',
              iconBg: 'bg-indigo-100'
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`w-4 h-4 ${stat.color.split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAdvancedBookings(!showAdvancedBookings)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showAdvancedBookings
                ? 'bg-sysora-mint text-sysora-midnight'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Advanced Management</span>
          </button>

          <button
            onClick={() => setShowUnifiedReports(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Reports Center</span>
          </button>

          <button
            onClick={() => setShowUnifiedMonitor(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            <Monitor className="w-4 h-4" />
            <span>Monitor Center</span>
          </button>

          <button
            onClick={() => setShowUnifiedAnalytics(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics Center</span>
          </button>

          <button
            onClick={() => setShowComprehensiveAnalytics(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-sysora-mint text-sysora-midnight hover:bg-sysora-mint/90 rounded-lg font-medium transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Comprehensive Analytics</span>
          </button>

          <button
            onClick={() => setShowAutomationManager(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Automation</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <ReservationStats
        reservations={reservations}
        onRefresh={handleStatsRefresh}
      />

      {/* Advanced Booking Management */}
      {showAdvancedBookings ? (
        <AdvancedBookingManagement />
      ) : (
        <>
          {/* Financial Reports */}
          {showReports && (
            <FinancialReports reservations={filteredReservations} />
          )}

          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            totalCount={reservations.length}
            filteredCount={filteredReservations.length}
            reservations={filteredReservations}
          />

          {/* Advanced Reservations Table */}
          <ReservationTable
            reservations={filteredReservations}
            onAction={handleTableAction}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </>
      )}

      {/* Add Reservation Modal */}
      {showAddModal && (
        <AddReservationModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveReservation}
        />
      )}

      {/* Timeline Modal */}
      {showTimelineModal && selectedReservation && (
        <ReservationTimeline
          reservation={selectedReservation}
          onUpdate={handleReservationUpdate}
          onClose={closeAllModals}
        />
      )}

      {/* Edit Reservation Modal */}
      {console.log('🔍 Rendering edit modal check:', {
        showEditModal,
        hasSelectedReservation: !!selectedReservation,
        selectedReservationId: selectedReservation?._id
      })}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          isOpen={showEditModal}
          onClose={closeAllModals}
          onSave={handleReservationUpdate}
        />
      )}

      {/* Debug Modal State */}
      {showEditModal && !selectedReservation && (
        <div className="fixed inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-red-600 font-bold">DEBUG: Modal State Error</h3>
            <p>showEditModal: {showEditModal.toString()}</p>
            <p>selectedReservation: {selectedReservation ? 'exists' : 'null'}</p>
            <button onClick={closeAllModals} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
              Close Debug
            </button>
          </div>
        </div>
      )}


      {/* Payment Management Modal */}
      {showPaymentModal && selectedReservation && (
        <PaymentManagementModal
          reservation={selectedReservation}
          isOpen={showPaymentModal}
          onClose={closeAllModals}
          onUpdate={handleReservationUpdate}
        />
      )}

      {/* Enhanced Payment Management Modal */}
      {showEnhancedPaymentModal && selectedReservation && (
        <PaymentManagementEnhanced
          reservation={selectedReservation}
          isOpen={showEnhancedPaymentModal}
          onClose={closeAllModals}
          onUpdate={handleReservationUpdate}
        />
      )}

      {/* Check-In Modal */}
      {showCheckInModal && selectedReservation && (
        <CheckInModal
          reservation={selectedReservation}
          isOpen={showCheckInModal}
          onClose={closeAllModals}
          onUpdate={handleReservationUpdate}
        />
      )}

      {/* Check-Out Modal */}
      {showCheckOutModal && selectedReservation && (
        <CheckOutModal
          reservation={selectedReservation}
          isOpen={showCheckOutModal}
          onClose={closeAllModals}
          onUpdate={handleReservationUpdate}
        />
      )}

      {/* Advanced Analytics Modal */}
      {showAdvancedAnalytics && (
        <AdvancedAnalytics
          reservations={reservations}
          isOpen={showAdvancedAnalytics}
          onClose={() => setShowAdvancedAnalytics(false)}
        />
      )}

      {/* Smart Notifications Modal */}
      {showSmartNotifications && (
        <SmartNotifications
          reservations={reservations}
          isOpen={showSmartNotifications}
          onClose={() => setShowSmartNotifications(false)}
        />
      )}

      {/* Automation Manager Modal */}
      {showAutomationManager && (
        <AutomationManager
          isOpen={showAutomationManager}
          onClose={() => setShowAutomationManager(false)}
        />
      )}

      {/* System Dashboard Modal */}
      {showSystemDashboard && (
        <SystemDashboard
          isOpen={showSystemDashboard}
          onClose={() => setShowSystemDashboard(false)}
        />
      )}

      {/* Comprehensive Analytics Modal */}
      {showComprehensiveAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight to-blue-800 text-white">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-xl font-bold">Comprehensive Analytics Hub</h2>
              </div>
              <button
                onClick={() => setShowComprehensiveAnalytics(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <ComprehensiveAnalyticsHub
                reservations={reservations}
                rooms={[]} // You can pass actual rooms data here
                guests={[]} // You can pass actual guests data here
                payments={[]} // You can pass actual payments data here
                operations={[]} // You can pass actual operations data here
                security={[]} // You can pass actual security data here
              />
            </div>
          </div>
        </div>
      )}

      {/* Unified Reports Center Modal */}
      {showUnifiedReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight to-blue-800 text-white">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold">Unified Reports Center</h2>
              </div>
              <button
                onClick={() => setShowUnifiedReports(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <UnifiedReportsCenter
                reservations={reservations}
                rooms={[]} // You can pass actual rooms data here
                guests={[]} // You can pass actual guests data here
                payments={[]} // You can pass actual payments data here
                operations={[]} // You can pass actual operations data here
              />
            </div>
          </div>
        </div>
      )}

      {/* Unified Analytics Center Modal */}
      {showUnifiedAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-xl font-bold">Unified Analytics Center</h2>
              </div>
              <button
                onClick={() => setShowUnifiedAnalytics(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <UnifiedAnalyticsCenter
                reservations={reservations}
                rooms={[]} // You can pass actual rooms data here
                guests={[]} // You can pass actual guests data here
                payments={[]} // You can pass actual payments data here
                operations={[]} // You can pass actual operations data here
              />
            </div>
          </div>
        </div>
      )}

      {/* Unified Monitor Center Modal */}
      {showUnifiedMonitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center space-x-3">
                <Monitor className="w-6 h-6" />
                <h2 className="text-xl font-bold">Unified Monitor Center</h2>
              </div>
              <button
                onClick={() => setShowUnifiedMonitor(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <UnifiedMonitorCenter
                systemData={{}}
                securityData={{}}
                userActivity={[]}
                alerts={[]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
