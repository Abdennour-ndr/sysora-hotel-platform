import React, { useState } from 'react';
import {
  UserCheck,
  UserX,
  Search,
  Calendar,
  Clock,
  User,
  Bed,
  RefreshCw,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, Button, Input, StatusBadge, LoadingSpinner, EmptyState, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

const ModernCheckInOut = ({ data, loading, onRefresh }) => {
  const { reservations } = data;
  const [activeTab, setActiveTab] = useState('checkin'); // checkin, checkout
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Check-In / Check-Out</h1>
            <p className="text-gray-600 mt-1">Process guest arrivals and departures</p>
          </div>
          <LoadingSpinner size="lg" />
        </div>
        
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Filter reservations based on active tab
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchQuery === '' ||
      `${reservation.guestId?.firstName} ${reservation.guestId?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.roomId?.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.reservationNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'checkin' 
      ? reservation.status === 'confirmed' 
      : reservation.status === 'checked_in';

    return matchesSearch && matchesTab;
  });

  const handleCheckIn = async (reservationId) => {
    try {
      // API call would go here
      console.log(`Checking in reservation ${reservationId}`);
      // Show success message
    } catch (error) {
      console.error('Error checking in guest:', error);
    }
  };

  const handleCheckOut = async (reservationId) => {
    try {
      // API call would go here
      console.log(`Checking out reservation ${reservationId}`);
      // Show success message
    } catch (error) {
      console.error('Error checking out guest:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ReservationCard = ({ reservation }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">
                {reservation.guestId?.firstName?.charAt(0) || 'G'}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {reservation.guestId?.firstName} {reservation.guestId?.lastName}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span>Room {reservation.roomId?.number}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>#{reservation.reservationNumber}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Check-in: {formatDate(reservation.checkInDate)}</span>
                <span>Check-out: {formatDate(reservation.checkOutDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ${reservation.totalAmount}
              </p>
              <StatusBadge status={reservation.status === 'confirmed' ? 'warning' : 'success'}>
                {reservation.status === 'confirmed' ? 'Pending' : 'Checked In'}
              </StatusBadge>
            </div>
            
            <Button
              onClick={() => activeTab === 'checkin' ? handleCheckIn(reservation._id) : handleCheckOut(reservation._id)}
              className={cn(
                "flex items-center space-x-2",
                activeTab === 'checkin' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {activeTab === 'checkin' ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Check In</span>
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  <span>Check Out</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Check-In / Check-Out</h1>
          <p className="text-gray-600 mt-1">Process guest arrivals and departures</p>
        </div>
        
        <Button
          variant="secondary"
          onClick={onRefresh}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('checkin')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                activeTab === 'checkin'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <UserCheck className="w-4 h-4" />
              <span>Check-In</span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                activeTab === 'checkin' ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {reservations.filter(r => r.status === 'confirmed').length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('checkout')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                activeTab === 'checkout'
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <UserX className="w-4 h-4" />
              <span>Check-Out</span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                activeTab === 'checkout' ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {reservations.filter(r => r.status === 'checked_in').length}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by guest name, room number, or reservation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={activeTab === 'checkin' ? UserCheck : UserX}
              title={`No ${activeTab === 'checkin' ? 'check-ins' : 'check-outs'} available`}
              description={`There are no guests ready for ${activeTab === 'checkin' ? 'check-in' : 'check-out'} at this time`}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <ReservationCard key={reservation._id} reservation={reservation} />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-600">Pending Check-ins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'checked_in').length}
                </p>
                <p className="text-sm text-gray-600">Pending Check-outs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {reservations.filter(r => r.status === 'checked_out').length}
                </p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernCheckInOut;
