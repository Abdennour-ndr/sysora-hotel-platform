import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  AlertTriangle,
  DollarSign,
  Bed,
  Coffee,
  Settings,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Activity,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';
import CurrencyDisplay from '../CurrencyDisplay';
import { useCurrency } from '../../contexts/CurrencyContext';

const TodayActivity = ({ data, loading, onRefresh }) => {
  const currency = useCurrency();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activities = [
    {
      id: 'checkins',
      icon: CheckCircle,
      label: 'Check-ins',
      value: data?.today?.checkIns || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Guests checked in today',
      trend: 'up'
    },
    {
      id: 'checkouts',
      icon: XCircle,
      label: 'Check-outs',
      value: data?.today?.checkOuts || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Guests checked out today',
      trend: 'stable'
    },
    {
      id: 'reservations',
      icon: Calendar,
      label: 'New Reservations',
      value: data?.today?.newReservations || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Reservations made today',
      trend: 'up'
    },
    {
      id: 'pending',
      icon: AlertTriangle,
      label: 'Pending Reservations',
      value: data?.today?.pendingReservations || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Awaiting confirmation',
      trend: 'stable'
    },
    {
      id: 'walkins',
      icon: Users,
      label: 'Walk-ins',
      value: data?.today?.walkIns || 0,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Guests without reservation',
      trend: 'up'
    },
    {
      id: 'revenue',
      icon: DollarSign,
      label: 'Daily Revenue',
      value: (
        <CurrencyDisplay
          amount={data?.revenue?.daily || 0}
          currencyCode={currency.code}
          className="font-semibold text-sysora-midnight"
        />
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Revenue generated today',
      trend: 'up'
    },
    {
      id: 'roomservice',
      icon: Coffee,
      label: 'Room Service Orders',
      value: data?.today?.roomServiceOrders || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Orders placed today',
      trend: 'stable'
    },
    {
      id: 'maintenance',
      icon: Settings,
      label: 'Maintenance Requests',
      value: data?.today?.maintenanceRequests || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Requests submitted today',
      trend: 'down'
    },
    {
      id: 'complaints',
      icon: MessageSquare,
      label: 'Complaints',
      value: data?.today?.complaints || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Customer complaints',
      trend: 'down'
    },
    {
      id: 'compliments',
      icon: ThumbsUp,
      label: 'Compliments',
      value: data?.today?.compliments || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Customer compliments',
      trend: 'up'
    }
  ];

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => {
        switch (selectedFilter) {
          case 'positive':
            return activity.trend === 'up' || activity.id === 'compliments';
          case 'attention':
            return activity.trend === 'down' || activity.id === 'pending' || activity.id === 'maintenance' || activity.id === 'complaints';
          case 'revenue':
            return activity.id === 'revenue' || activity.id === 'reservations' || activity.id === 'checkins';
          default:
            return true;
        }
      });

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />;
      case 'stable':
        return <Activity className="w-3 h-3 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sysora-midnight">Today's Activity</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
          >
            <option value="all">All Activities</option>
            <option value="positive">Positive Trends</option>
            <option value="attention">Needs Attention</option>
            <option value="revenue">Revenue Related</option>
          </select>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 text-gray-600 hover:text-sysora-mint transition-colors"
            title="Toggle Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRefresh}
            className="p-1 text-gray-600 hover:text-sysora-mint transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className={`flex items-center justify-between p-3 ${activity.bgColor} rounded-2xl hover:shadow-sm transition-all duration-200 group`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                  {getTrendIcon(activity.trend)}
                </div>
                <div>
                  <span className="text-sm font-medium text-sysora-midnight">{activity.label}</span>
                  {showDetails && (
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-sysora-midnight">
                  {typeof activity.value === 'object' ? activity.value : activity.value}
                </span>
                {showDetails && activity.id === 'revenue' && (
                  <p className="text-xs text-gray-600 mt-1">
                    +{data?.revenue?.growth?.toFixed(1) || 0}% vs yesterday
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Total Guests</p>
            <p className="text-lg font-bold text-sysora-midnight">{data?.overview?.totalGuests || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Occupancy</p>
            <p className="text-lg font-bold text-sysora-midnight">{data?.overview?.occupancyRate?.toFixed(1) || 0}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Avg. Rate</p>
            <CurrencyDisplay
              amount={data?.overview?.averageRate || 0}
              currencyCode={currency.code}
              className="text-lg font-bold text-sysora-midnight"
            />
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {data?.today && (
        <div className="mt-4 p-3 bg-gradient-to-r from-sysora-mint/10 to-blue-50 rounded-xl">
          <h4 className="text-sm font-semibold text-sysora-midnight mb-2">Quick Insights</h4>
          <div className="text-xs text-gray-700 space-y-1">
            {data.today.checkIns > data.today.checkOuts && (
              <p>• More check-ins than check-outs today (+{data.today.checkIns - data.today.checkOuts})</p>
            )}
            {data.today.newReservations > 5 && (
              <p>• Strong booking activity with {data.today.newReservations} new reservations</p>
            )}
            {data.today.complaints === 0 && (
              <p>• No complaints received today - excellent service!</p>
            )}
            {data.today.compliments > 0 && (
              <p>• {data.today.compliments} customer compliments received</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayActivity;
