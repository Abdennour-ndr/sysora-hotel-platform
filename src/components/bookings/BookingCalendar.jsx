import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Eye,
  Users,
  Clock,
  DollarSign,
  MoreVertical
} from 'lucide-react';

const BookingCalendar = ({ bookings, onBookingClick, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getCalendarDays = () => {
    if (viewMode === 'week') {
      return getWeekDays();
    }
    return getMonthDays();
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      const targetDate = new Date(date);
      
      // Reset time to compare dates only
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      
      return targetDate >= checkIn && targetDate < checkOut;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'checked_in':
        return 'bg-green-200 text-green-800 border-green-300';
      case 'checked_out':
        return 'bg-gray-200 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'no_show':
        return 'bg-orange-200 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  };

  const formatCurrency = (amount, currency = 'DZD') => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
              <h3 className="text-xl font-bold text-gray-900">Booking Calendar</h3>
              <p className="text-sm text-gray-600">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })} - {bookings.length} bookings
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {['month', 'week'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-sysora-midnight shadow-sm'
                      : 'text-gray-600 hover:text-sysora-midnight'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                className="p-2 text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
                className="p-2 text-gray-600 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid grid-cols-7 gap-1 ${viewMode === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
          {calendarDays.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  relative min-h-[120px] p-2 border border-gray-100 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer
                  ${isTodayDate ? 'bg-sysora-mint/5 border-sysora-mint/30' : 'bg-white hover:bg-gray-50'}
                  ${!isCurrentMonthDay && viewMode === 'month' ? 'opacity-40' : ''}
                `}
                onClick={() => setSelectedDate(date)}
              >
                {/* Date Number */}
                <div className={`
                  text-sm font-semibold mb-2
                  ${isTodayDate ? 'text-sysora-mint' : isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {date.getDate()}
                  {isTodayDate && (
                    <div className="w-2 h-2 bg-sysora-mint rounded-full mx-auto mt-1"></div>
                  )}
                </div>

                {/* Bookings */}
                <div className="space-y-1">
                  {dayBookings.slice(0, viewMode === 'month' ? 3 : 8).map((booking) => (
                    <div
                      key={booking.id}
                      className={`
                        text-xs p-1 rounded border cursor-pointer transition-all duration-200 hover:scale-105
                        ${getStatusColor(booking.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick && onBookingClick(booking);
                      }}
                      title={`${booking.guestName} - ${booking.reservationNumber}`}
                    >
                      <div className="font-medium truncate">
                        {booking.guestName}
                      </div>
                      <div className="truncate opacity-75">
                        Room {booking.roomNumber}
                      </div>
                    </div>
                  ))}
                  
                  {dayBookings.length > (viewMode === 'month' ? 3 : 8) && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayBookings.length - (viewMode === 'month' ? 3 : 8)} more
                    </div>
                  )}
                </div>

                {/* Add Booking Button */}
                {dayBookings.length === 0 && (
                  <button
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-sysora-mint/5 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add booking for date:', date);
                    }}
                  >
                    <Plus className="w-6 h-6 text-sysora-mint" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            {(() => {
              const dayBookings = getBookingsForDate(selectedDate);
              
              if (dayBookings.length === 0) {
                return (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No bookings for this date</p>
                    <button className="mt-3 px-4 py-2 bg-sysora-mint text-white rounded-lg hover:bg-sysora-mint/90 transition-colors">
                      Add Booking
                    </button>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onBookingClick && onBookingClick(booking)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status).split(' ')[0]}`}></div>
                          <div>
                            <div className="font-semibold text-gray-900">{booking.guestName}</div>
                            <div className="text-sm text-gray-600">{booking.reservationNumber}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-sysora-mint">
                            {formatCurrency(booking.totalAmount, booking.currency)}
                          </div>
                          <div className="text-sm text-gray-600">Room {booking.roomNumber}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{booking.adults + booking.children} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.nights} nights</span>
                          </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

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
                <div className={`w-4 h-4 rounded border ${getStatusColor(status)}`}></div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
