import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Bed,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Coffee,
  Star,
  ArrowRight,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';

const ManagerOverview = ({ 
  stats = {}, 
  reservations = [], 
  rooms = [], 
  customers = [], 
  onTabChange,
  onShowGuestModal 
}) => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today'); // today, week, month
  const [dashboardMetrics, setDashboardMetrics] = useState({
    occupancyRate: 0,
    revenue: 0,
    adr: 0,
    revpar: 0,
    checkIns: 0,
    checkOuts: 0,
    pendingTasks: 0,
    vipGuests: 0
  });

  useEffect(() => {
    calculateMetrics();
  }, [reservations, rooms, customers, timeRange]);

  const calculateMetrics = () => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Calculate revenue based on time range
    const today = new Date();
    const filteredReservations = reservations.filter(res => {
      const resDate = new Date(res.checkInDate);
      switch (timeRange) {
        case 'today':
          return resDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return resDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return resDate >= monthAgo;
        default:
          return true;
      }
    });

    const revenue = filteredReservations.reduce((sum, res) => sum + (res.totalAmount || 0), 0);
    const adr = filteredReservations.length > 0 ? revenue / filteredReservations.length : 0;
    const revpar = totalRooms > 0 ? revenue / totalRooms : 0;

    const checkIns = reservations.filter(res => res.status === 'checked_in').length;
    const checkOuts = reservations.filter(res => res.status === 'checked_out').length;
    const vipGuests = customers.filter(guest => guest.isVip).length;

    setDashboardMetrics({
      occupancyRate: Math.round(occupancyRate),
      revenue: Math.round(revenue),
      adr: Math.round(adr),
      revpar: Math.round(revpar),
      checkIns,
      checkOuts,
      pendingTasks: 5, // This would come from housekeeping API
      vipGuests
    });
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      calculateMetrics();
      setLoading(false);
    }, 1000);
  };

  const MetricCard = ({ title, value, change, icon: Icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center mt-4 text-sm text-gray-500 group-hover:text-gray-700">
        <span>Click to access</span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your hotel operations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Occupancy Rate"
          value={`${dashboardMetrics.occupancyRate}%`}
          change={5.2}
          icon={Bed}
          color="text-blue-600"
          onClick={() => onTabChange('rooms')}
        />
        <MetricCard
          title="Revenue"
          value={`$${dashboardMetrics.revenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="text-green-600"
          onClick={() => onTabChange('analytics')}
        />
        <MetricCard
          title="ADR"
          value={`$${dashboardMetrics.adr}`}
          change={-2.1}
          icon={TrendingUp}
          color="text-purple-600"
          onClick={() => onTabChange('analytics')}
        />
        <MetricCard
          title="RevPAR"
          value={`$${dashboardMetrics.revpar}`}
          change={8.3}
          icon={Star}
          color="text-orange-600"
          onClick={() => onTabChange('analytics')}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Check-ins Today"
          value={dashboardMetrics.checkIns}
          icon={CheckCircle}
          color="text-green-600"
          onClick={() => onTabChange('checkin-checkout')}
        />
        <MetricCard
          title="Check-outs Today"
          value={dashboardMetrics.checkOuts}
          icon={Clock}
          color="text-blue-600"
          onClick={() => onTabChange('checkin-checkout')}
        />
        <MetricCard
          title="Pending Tasks"
          value={dashboardMetrics.pendingTasks}
          icon={AlertTriangle}
          color="text-yellow-600"
          onClick={() => onTabChange('housekeeping')}
        />
        <MetricCard
          title="VIP Guests"
          value={dashboardMetrics.vipGuests}
          icon={Star}
          color="text-purple-600"
          onClick={() => onTabChange('guests')}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="New Reservation"
            description="Create a new booking"
            icon={Calendar}
            color="bg-blue-600"
            onClick={() => onTabChange('reservations')}
          />
          <QuickActionCard
            title="Add Guest"
            description="Register new guest profile"
            icon={Users}
            color="bg-green-600"
            onClick={onShowGuestModal}
          />
          <QuickActionCard
            title="Room Management"
            description="Manage room status and availability"
            icon={Bed}
            color="bg-purple-600"
            onClick={() => onTabChange('rooms')}
          />
          <QuickActionCard
            title="Housekeeping Tasks"
            description="View and assign cleaning tasks"
            icon={Coffee}
            color="bg-teal-600"
            onClick={() => onTabChange('housekeeping')}
          />
          <QuickActionCard
            title="Analytics Dashboard"
            description="View detailed reports and insights"
            icon={TrendingUp}
            color="bg-orange-600"
            onClick={() => onTabChange('analytics')}
          />
          <QuickActionCard
            title="Staff Management"
            description="Manage users and permissions"
            icon={Users}
            color="bg-indigo-600"
            onClick={() => onTabChange('users')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
            <button
              onClick={() => onTabChange('reservations')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {reservations.slice(0, 5).map((reservation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">
                    {reservation.guestId?.firstName} {reservation.guestId?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Room {reservation.roomId?.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${reservation.totalAmount}</p>
                  <p className="text-xs text-gray-500">{reservation.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Room Status</h3>
            <button
              onClick={() => onTabChange('rooms')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Manage Rooms
            </button>
          </div>
          <div className="space-y-4">
            {[
              { status: 'Available', count: rooms.filter(r => r.status === 'available').length, color: 'bg-green-500' },
              { status: 'Occupied', count: rooms.filter(r => r.status === 'occupied').length, color: 'bg-blue-500' },
              { status: 'Cleaning', count: rooms.filter(r => r.status === 'cleaning').length, color: 'bg-yellow-500' },
              { status: 'Maintenance', count: rooms.filter(r => r.status === 'maintenance').length, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700">{item.status}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
