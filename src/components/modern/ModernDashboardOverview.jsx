import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Bed,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, MetricCard, Button, LoadingSpinner, EmptyState } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

const ModernDashboardOverview = ({ data, loading, onRefresh, onTabChange }) => {
  const { stats, rooms, reservations } = data;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, here's what's happening today</p>
          </div>
          <LoadingSpinner size="lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate || 0}%`,
      change: '+5.2%',
      trend: 'up',
      icon: Bed,
      onClick: () => onTabChange('rooms')
    },
    {
      title: 'Revenue Today',
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      onClick: () => onTabChange('reservations')
    },
    {
      title: 'Check-ins Today',
      value: stats.checkInsToday || 0,
      change: '+3',
      trend: 'up',
      icon: Users,
      onClick: () => onTabChange('checkin-checkout')
    },
    {
      title: 'Available Rooms',
      value: `${stats.availableRooms || 0}/${stats.totalRooms || 0}`,
      change: '-2',
      trend: 'down',
      icon: Calendar,
      onClick: () => onTabChange('rooms')
    }
  ];

  const recentActivity = [
    { id: 1, type: 'checkin', guest: 'Sarah Johnson', room: '205', time: '2 min ago' },
    { id: 2, type: 'booking', guest: 'Michael Chen', room: '301', time: '15 min ago' },
    { id: 3, type: 'checkout', guest: 'Emma Wilson', room: '102', time: '1 hour ago' },
    { id: 4, type: 'maintenance', guest: null, room: '404', time: '2 hours ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin': return '🔑';
      case 'checkout': return '👋';
      case 'booking': return '📅';
      case 'maintenance': return '🔧';
      default: return '📋';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'checkin': return 'text-emerald-600 bg-emerald-50';
      case 'checkout': return 'text-blue-600 bg-blue-50';
      case 'booking': return 'text-purple-600 bg-purple-50';
      case 'maintenance': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, here's what's happening today</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            onClick={metric.onClick}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Room Status Overview */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Room Status</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange('rooms')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6">
              {rooms.length === 0 ? (
                <EmptyState
                  icon={Bed}
                  title="No room data"
                  description="Room information will appear here once available"
                />
              ) : (
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { status: 'Available', count: rooms.filter(r => r.status === 'available').length, color: 'bg-emerald-500' },
                      { status: 'Occupied', count: rooms.filter(r => r.status === 'occupied').length, color: 'bg-blue-500' },
                      { status: 'Cleaning', count: rooms.filter(r => r.status === 'cleaning').length, color: 'bg-amber-500' },
                      { status: 'Maintenance', count: rooms.filter(r => r.status === 'maintenance').length, color: 'bg-red-500' }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", item.color)} />
                        <div className="text-2xl font-semibold text-gray-900">{item.count}</div>
                        <div className="text-sm text-gray-600">{item.status}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Room Updates */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Recent Updates</h4>
                    {rooms.slice(0, 3).map((room) => (
                      <div key={room._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-900">
                            {room.number}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Room {room.number}</p>
                            <p className="text-xs text-gray-600 capitalize">{room.type}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-medium",
                          room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                          room.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                          room.status === 'cleaning' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {room.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm",
                        getActivityColor(activity.type)
                      )}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.guest ? (
                            <>
                              {activity.guest}
                              {activity.type === 'checkin' && ' checked in'}
                              {activity.type === 'checkout' && ' checked out'}
                              {activity.type === 'booking' && ' made a booking'}
                            </>
                          ) : (
                            'Maintenance scheduled'
                          )}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-600">Room {activity.room}</p>
                          <span className="text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'New Reservation', description: 'Create booking', action: () => onTabChange('reservations') },
              { title: 'Check-in Guest', description: 'Process arrival', action: () => onTabChange('checkin-checkout') },
              { title: 'Room Assignment', description: 'Manage rooms', action: () => onTabChange('rooms') },
              { title: 'Housekeeping', description: 'Assign tasks', action: () => onTabChange('housekeeping') }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <h4 className="font-medium text-gray-900 group-hover:text-gray-700">{action.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                <ArrowUpRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 transition-colors" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboardOverview;
