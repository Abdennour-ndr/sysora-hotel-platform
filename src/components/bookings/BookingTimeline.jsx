import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Eye,
  Edit3,
  MoreVertical
} from 'lucide-react';

const BookingTimeline = ({ bookings, onBookingClick, onDateChange }) => {
  const [timelineScale, setTimelineScale] = useState('day'); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const timelineRef = useRef(null);

  const getTimelineData = () => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    // Adjust date range based on scale
    switch (timelineScale) {
      case 'day':
        startDate.setDate(today.getDate() - 3);
        endDate.setDate(today.getDate() + 10);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 14);
        endDate.setDate(today.getDate() + 28);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        endDate.setMonth(today.getMonth() + 2);
        break;
      default:
        break;
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getTimelineData();

  const generateTimeSlots = () => {
    const slots = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      slots.push(new Date(current));
      
      switch (timelineScale) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
        default:
          break;
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getBookingPosition = (booking) => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const startOffset = Math.ceil((checkIn - startDate) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%` };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 border-yellow-400 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-200 border-blue-400 text-blue-800';
      case 'checked_in':
        return 'bg-green-200 border-green-400 text-green-800';
      case 'checked_out':
        return 'bg-gray-200 border-gray-400 text-gray-800';
      case 'cancelled':
        return 'bg-red-200 border-red-400 text-red-800';
      case 'no_show':
        return 'bg-orange-200 border-orange-400 text-orange-800';
      default:
        return 'bg-gray-200 border-gray-400 text-gray-800';
    }
  };

  const formatDate = (date) => {
    switch (timelineScale) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          weekday: 'short'
        });
      case 'week':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric'
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatCurrency = (amount, currency = 'DZD') => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const navigateTimeline = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (timelineScale) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 28 : -28));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-sysora-midnight/5 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sysora-mint/10 rounded-xl">
              <Calendar className="w-6 h-6 text-sysora-mint" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Booking Timeline</h3>
              <p className="text-sm text-gray-600">
                Visual timeline of all bookings ({bookings.length} total)
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Scale Controls */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {['day', 'week', 'month'].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setTimelineScale(scale)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timelineScale === scale
                      ? 'bg-white text-sysora-midnight shadow-sm'
                      : 'text-gray-600 hover:text-sysora-midnight'
                  }`}
                >
                  {scale.charAt(0).toUpperCase() + scale.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigateTimeline('prev')}
                className="p-2 text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                title="Previous period"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={resetToToday}
                className="p-2 text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                title="Go to today"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigateTimeline('next')}
                className="p-2 text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                title="Next period"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {/* Time Scale */}
        <div className="relative mb-6">
          <div className="flex border-b border-gray-200 pb-2">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex-1 text-center text-sm font-medium text-gray-600 border-r border-gray-100 last:border-r-0 px-2"
              >
                {formatDate(slot)}
              </div>
            ))}
          </div>
          
          {/* Today Indicator */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-sysora-mint opacity-50 pointer-events-none"
               style={{ left: '20%' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-sysora-mint text-white text-xs px-2 py-1 rounded">
              Today
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="space-y-3" ref={timelineRef}>
          {bookings.map((booking, index) => {
            const position = getBookingPosition(booking);
            const statusColor = getStatusColor(booking.status);
            
            return (
              <div
                key={booking.id}
                className="relative h-16 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Room Label */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gray-100 border-r border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {booking.roomNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.roomType.split(' ')[0]}
                    </div>
                  </div>
                </div>
                
                {/* Booking Bar */}
                <div
                  className={`absolute top-2 bottom-2 rounded-lg border-2 ${statusColor} cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105`}
                  style={{
                    left: `calc(80px + ${position.left})`,
                    width: `calc(${position.width} - 4px)`
                  }}
                  onClick={() => {
                    setSelectedBooking(booking);
                    onBookingClick && onBookingClick(booking);
                  }}
                >
                  <div className="p-2 h-full flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {booking.guestName}
                      </div>
                      <div className="text-xs opacity-75 truncate">
                        {booking.reservationNumber}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View booking:', booking.id);
                        }}
                        className="p-1 hover:bg-white/20 rounded"
                        title="View details"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit booking:', booking.id);
                        }}
                        className="p-1 hover:bg-white/20 rounded"
                        title="Edit booking"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Booking Info Tooltip */}
                <div className="absolute left-24 top-full mt-1 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <div className="font-semibold">{booking.guestName}</div>
                  <div>{booking.reservationNumber}</div>
                  <div>
                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                  <div>{formatCurrency(booking.totalAmount, booking.currency)}</div>
                  <div className="capitalize">{booking.status.replace('_', ' ')}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { status: 'pending', label: 'Pending' },
              { status: 'confirmed', label: 'Confirmed' },
              { status: 'checked_in', label: 'Checked In' },
              { status: 'checked_out', label: 'Checked Out' },
              { status: 'cancelled', label: 'Cancelled' },
              { status: 'no_show', label: 'No Show' }
            ].map(({ status, label }) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded border-2 ${getStatusColor(status)}`}></div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Booking Details */}
      {selectedBooking && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Booking Details</h4>
            <button
              onClick={() => setSelectedBooking(null)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Guest</div>
              <div className="font-semibold">{selectedBooking.guestName}</div>
              <div className="text-sm text-gray-600">{selectedBooking.guestEmail}</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Stay Period</div>
              <div className="font-semibold">
                {new Date(selectedBooking.checkInDate).toLocaleDateString()} - {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">{selectedBooking.nights} nights</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Amount</div>
              <div className="font-semibold text-sysora-mint">
                {formatCurrency(selectedBooking.totalAmount, selectedBooking.currency)}
              </div>
              <div className="text-sm text-gray-600">
                Paid: {formatCurrency(selectedBooking.paidAmount, selectedBooking.currency)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTimeline;
