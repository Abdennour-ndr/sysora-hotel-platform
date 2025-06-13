import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Calendar,
  Plus,
  Search,
  Grid,
  List,
  Filter,
  MoreVertical,
  Edit3,
  Save,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  Settings,
  Keyboard,
  MousePointer,
  Move,
  Copy,
  Trash2,
  Eye,
  Users,
  Bed,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Bell,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import SortableBookingCard from './SortableBookingCard';
import BookingStatusDropZone from './BookingStatusDropZone';
import BookingContextMenu from './BookingContextMenu';
import BookingBulkActionsBar from './BookingBulkActionsBar';
import BookingKeyboardShortcutsHelp from './BookingKeyboardShortcutsHelp';
import BookingTimeline from './BookingTimeline';
import BookingCalendar from './BookingCalendar';

const AdvancedBookingManagement = () => {
  // State Management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('checkInDate');
  const [draggedBooking, setDraggedBooking] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, booking: null });
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Refs
  const searchInputRef = useRef(null);
  const containerRef = useRef(null);
  
  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock data for demonstration
  useEffect(() => {
    const mockBookings = [
      {
        id: '1',
        reservationNumber: 'RSV-2024-001',
        guestName: 'Ahmed Ben Ali',
        guestEmail: 'ahmed@example.com',
        guestPhone: '+213 555 123 456',
        roomNumber: '101',
        roomType: 'Deluxe Ocean View',
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-18'),
        adults: 2,
        children: 1,
        infants: 0,
        status: 'confirmed',
        totalAmount: 45000,
        paidAmount: 15000,
        currency: 'DZD',
        source: 'direct',
        specialRequests: ['Late check-in', 'Extra bed'],
        notes: 'VIP guest - provide welcome amenities',
        createdAt: new Date('2024-01-10'),
        nights: 3,
        order: 0
      },
      {
        id: '2',
        reservationNumber: 'RSV-2024-002',
        guestName: 'Sarah Johnson',
        guestEmail: 'sarah@example.com',
        guestPhone: '+1 555 987 654',
        roomNumber: '205',
        roomType: 'Presidential Suite',
        checkInDate: new Date('2024-01-16'),
        checkOutDate: new Date('2024-01-20'),
        adults: 2,
        children: 0,
        infants: 0,
        status: 'checked_in',
        totalAmount: 140000,
        paidAmount: 140000,
        currency: 'DZD',
        source: 'booking.com',
        specialRequests: ['Airport transfer', 'Spa appointment'],
        notes: 'Honeymoon package',
        createdAt: new Date('2024-01-12'),
        nights: 4,
        order: 1
      },
      {
        id: '3',
        reservationNumber: 'RSV-2024-003',
        guestName: 'Mohamed Benali',
        guestEmail: 'mohamed@example.com',
        guestPhone: '+213 555 789 123',
        roomNumber: '102',
        roomType: 'Standard Room',
        checkInDate: new Date('2024-01-14'),
        checkOutDate: new Date('2024-01-16'),
        adults: 1,
        children: 0,
        infants: 0,
        status: 'checked_out',
        totalAmount: 16000,
        paidAmount: 16000,
        currency: 'DZD',
        source: 'phone',
        specialRequests: [],
        notes: 'Business traveler',
        createdAt: new Date('2024-01-13'),
        nights: 2,
        order: 2
      },
      {
        id: '4',
        reservationNumber: 'RSV-2024-004',
        guestName: 'Fatima Zahra',
        guestEmail: 'fatima@example.com',
        guestPhone: '+213 555 456 789',
        roomNumber: '301',
        roomType: 'Family Suite',
        checkInDate: new Date('2024-01-20'),
        checkOutDate: new Date('2024-01-25'),
        adults: 2,
        children: 2,
        infants: 1,
        status: 'pending',
        totalAmount: 110000,
        paidAmount: 0,
        currency: 'DZD',
        source: 'website',
        specialRequests: ['Baby crib', 'High chair'],
        notes: 'Family vacation',
        createdAt: new Date('2024-01-18'),
        nights: 5,
        order: 3
      }
    ];
    
    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
    setLoading(false);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const today = new Date();
        const bookingDate = new Date(booking.checkInDate);
        
        switch (dateFilter) {
          case 'today':
            matchesDate = bookingDate.toDateString() === today.toDateString();
            break;
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            matchesDate = bookingDate.toDateString() === tomorrow.toDateString();
            break;
          case 'this_week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesDate = bookingDate >= weekStart && bookingDate <= weekEnd;
            break;
          case 'this_month':
            matchesDate = bookingDate.getMonth() === today.getMonth() && 
                         bookingDate.getFullYear() === today.getFullYear();
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'checkInDate':
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        case 'guestName':
          return a.guestName.localeCompare(b.guestName);
        case 'totalAmount':
          return b.totalAmount - a.totalAmount;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'order':
          return a.order - b.order;
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter, sortBy]);

  // Keyboard Shortcuts
  useHotkeys('ctrl+a', (e) => {
    e.preventDefault();
    setSelectedBookings(new Set(filteredBookings.map(booking => booking.id)));
  });

  useHotkeys('ctrl+d', (e) => {
    e.preventDefault();
    setSelectedBookings(new Set());
  });

  useHotkeys('ctrl+f', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    console.log('Create new booking');
  });

  useHotkeys('escape', () => {
    setSelectedBookings(new Set());
    setEditingField(null);
    setContextMenu({ show: false, x: 0, y: 0, booking: null });
  });

  useHotkeys('g', () => setViewMode('cards'));
  useHotkeys('l', () => setViewMode('list'));
  useHotkeys('t', () => setShowTimeline(!showTimeline));
  useHotkeys('k', () => setShowCalendar(!showCalendar));
  useHotkeys('?', () => setShowShortcuts(true));

  // Status change shortcuts
  useHotkeys('c', () => changeSelectedBookingsStatus('confirmed'));
  useHotkeys('i', () => changeSelectedBookingsStatus('checked_in'));
  useHotkeys('o', () => changeSelectedBookingsStatus('checked_out'));
  useHotkeys('x', () => changeSelectedBookingsStatus('cancelled'));
  useHotkeys('n', () => changeSelectedBookingsStatus('no_show'));

  // Drag and Drop Handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const booking = bookings.find(b => b.id === active.id);
    setDraggedBooking(booking);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedBooking(null);

    if (!over) return;

    // Handle status change by dropping on status zone
    if (over.id.startsWith('status-')) {
      const newStatus = over.id.replace('status-', '');
      handleStatusChange(active.id, newStatus);
      return;
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = bookings.findIndex(booking => booking.id === active.id);
      const newIndex = bookings.findIndex(booking => booking.id === over.id);
      
      const newBookings = arrayMove(bookings, oldIndex, newIndex).map((booking, index) => ({
        ...booking,
        order: index
      }));
      
      setBookings(newBookings);
      window.showToast && window.showToast('Booking order updated', 'success');
    }
  };

  // Booking Management Functions
  const handleStatusChange = useCallback((bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    window.showToast && window.showToast(`Booking status changed to ${newStatus}`, 'success');
  }, []);

  const changeSelectedBookingsStatus = (newStatus) => {
    if (selectedBookings.size === 0) return;
    
    setBookings(prev => prev.map(booking => 
      selectedBookings.has(booking.id) ? { ...booking, status: newStatus } : booking
    ));
    
    window.showToast && window.showToast(
      `${selectedBookings.size} booking(s) status changed to ${newStatus}`, 
      'success'
    );
    setSelectedBookings(new Set());
  };

  const handleBookingSelect = (bookingId, isSelected) => {
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(bookingId);
      } else {
        newSet.delete(bookingId);
      }
      return newSet;
    });
  };

  const handleInlineEdit = (bookingId, field, value) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, [field]: value } : booking
    ));
    setEditingField(null);
    window.showToast && window.showToast('Booking updated successfully', 'success');
  };

  const handleContextMenu = (e, booking) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      booking
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return Check;
      case 'checked_in':
        return Users;
      case 'checked_out':
        return Eye;
      case 'cancelled':
        return X;
      case 'no_show':
        return AlertCircle;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-blue-800 to-sysora-midnight rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl">
        <div className="flex flex-col space-y-4 lg:space-y-6">
          {/* Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-sysora-mint/20 rounded-xl lg:rounded-2xl">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">Advanced Booking Management</h2>
                <p className="text-blue-100/80 text-sm sm:text-base lg:text-lg">Interactive booking operations with smart controls</p>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowShortcuts(true)}
                className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-xl lg:rounded-2xl transition-colors border border-white/20 min-w-0"
                title="Keyboard Shortcuts (Press ?)"
              >
                <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Shortcuts</span>
              </button>

              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className={`flex items-center justify-center space-x-2 p-3 sm:p-4 rounded-xl lg:rounded-2xl transition-colors border border-white/20 min-w-0 ${
                  showTimeline ? 'bg-sysora-mint text-sysora-midnight' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Toggle Timeline (T)"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Timeline</span>
              </button>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex items-center justify-center space-x-2 p-3 sm:p-4 rounded-xl lg:rounded-2xl transition-colors border border-white/20 min-w-0 ${
                  showCalendar ? 'bg-sysora-mint text-sysora-midnight' : 'bg-white/10 hover:bg-white/20'
                }`}
                title="Toggle Calendar (K)"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Calendar</span>
              </button>

              <button className="flex items-center justify-center space-x-2 sm:space-x-3 bg-sysora-mint text-sysora-midnight px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl lg:rounded-2xl hover:bg-sysora-mint/90 transition-colors font-semibold text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'].map(status => {
              const count = bookings.filter(booking => booking.status === status).length;
              const StatusIcon = getStatusIcon(status);
              return (
                <div key={status} className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sysora-mint mx-auto sm:mx-0" />
                    <div className="text-center sm:text-left">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold">{count}</div>
                      <div className="text-xs sm:text-sm text-blue-100/70 capitalize leading-tight">{status.replace('_', ' ')}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {showTimeline && (
        <BookingTimeline 
          bookings={filteredBookings}
          onBookingClick={(booking) => console.log('Timeline booking clicked:', booking)}
          onDateChange={(booking, newDate) => console.log('Date changed:', booking, newDate)}
        />
      )}

      {/* Calendar View */}
      {showCalendar && (
        <BookingCalendar 
          bookings={filteredBookings}
          onBookingClick={(booking) => console.log('Calendar booking clicked:', booking)}
          onDateChange={(booking, newDate) => console.log('Date changed:', booking, newDate)}
        />
      )}

      {/* Controls Bar - Responsive */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg">
        <div className="space-y-4">
          {/* Search Section */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search bookings... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint transition-all bg-gray-50 focus:bg-white text-sm sm:text-base"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white text-sm sm:text-base min-w-0 sm:min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white text-sm sm:text-base min-w-0 sm:min-w-[140px]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white text-sm sm:text-base min-w-0 sm:min-w-[140px]"
              >
                <option value="checkInDate">Sort by Check-in</option>
                <option value="guestName">Sort by Guest</option>
                <option value="totalAmount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
                <option value="createdAt">Sort by Created</option>
                <option value="order">Custom Order</option>
              </select>
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 sm:p-3 rounded-md transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-sysora-midnight shadow-sm'
                      : 'text-gray-600 hover:text-sysora-midnight'
                  }`}
                  title="Card View (G)"
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-sysora-midnight shadow-sm'
                      : 'text-gray-600 hover:text-sysora-midnight'
                  }`}
                  title="List View (L)"
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Drop Zones - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'].map(status => (
          <BookingStatusDropZone
            key={status}
            status={status}
            count={bookings.filter(booking => booking.status === status).length}
            onStatusChange={handleStatusChange}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedBookings.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedBookings.size}
          onStatusChange={changeSelectedBookingsStatus}
          onClearSelection={() => setSelectedBookings(new Set())}
          selectedBookings={Array.from(selectedBookings).map(id => 
            bookings.find(b => b.id === id)
          )}
        />
      )}

      {/* Bookings Display */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredBookings.map(booking => booking.id)} strategy={verticalListSortingStrategy}>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBookings.map((booking) => (
                <SortableBookingCard
                  key={booking.id}
                  booking={booking}
                  isSelected={selectedBookings.has(booking.id)}
                  onSelect={handleBookingSelect}
                  onContextMenu={handleContextMenu}
                  onInlineEdit={handleInlineEdit}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredBookings.map((booking) => (
                <SortableBookingCard
                  key={booking.id}
                  booking={booking}
                  isSelected={selectedBookings.has(booking.id)}
                  onSelect={handleBookingSelect}
                  onContextMenu={handleContextMenu}
                  onInlineEdit={handleInlineEdit}
                  editingField={editingField}
                  setEditingField={setEditingField}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  viewMode="list"
                />
              ))}
            </div>
          )}
        </SortableContext>
        
        <DragOverlay>
          {draggedBooking ? (
            <div className="bg-white rounded-2xl border-2 border-sysora-mint shadow-2xl p-4 opacity-90 transform rotate-3">
              <div className="font-semibold text-sysora-midnight">
                {draggedBooking.reservationNumber}
              </div>
              <div className="text-sm text-gray-600">{draggedBooking.guestName}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          booking={contextMenu.booking}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0, booking: null })}
          onStatusChange={handleStatusChange}
          onEdit={(field) => setEditingField(`${contextMenu.booking.id}-${field}`)}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <KeyboardShortcutsHelp onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
};

export default AdvancedBookingManagement;
