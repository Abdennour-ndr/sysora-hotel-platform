import React from 'react';
import { 
  Bed, 
  TrendingUp, 
  CheckCircle, 
  DollarSign,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  Home,
  Star,
  Activity,
  Target
} from 'lucide-react';
import CurrencyDisplay from '../CurrencyDisplay';
import { useCurrency } from '../../contexts/CurrencyContext';

const OverviewStats = ({ data, loading }) => {
  const currency = useCurrency();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Rooms',
      value: data?.overview?.totalRooms || 0,
      icon: Bed,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      subtitle: `${data?.overview?.availableRooms || 0} available`,
      trend: null
    },
    {
      title: 'Occupancy Rate',
      value: `${data?.overview?.occupancyRate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtitle: `${data?.overview?.occupiedRooms || 0} occupied`,
      trend: data?.overview?.occupancyRate > 70 ? 'up' : data?.overview?.occupancyRate > 50 ? 'stable' : 'down'
    },
    {
      title: "Today's Check-ins",
      value: data?.today?.checkIns || 0,
      icon: CheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtitle: `${data?.today?.checkOuts || 0} check-outs`,
      trend: null
    },
    {
      title: 'Daily Revenue',
      value: (
        <CurrencyDisplay
          amount={data?.revenue?.daily || 0}
          currencyCode={currency.code}
          size="2xl"
          className="text-orange-600"
        />
      ),
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      subtitle: `${data?.revenue?.growth > 0 ? '+' : ''}${data?.revenue?.growth?.toFixed(1) || 0}% vs last month`,
      trend: data?.revenue?.growth > 0 ? 'up' : data?.revenue?.growth < 0 ? 'down' : 'stable'
    },
    {
      title: 'Total Guests',
      value: data?.overview?.totalGuests || 0,
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      subtitle: `${data?.today?.walkIns || 0} walk-ins today`,
      trend: null
    },
    {
      title: 'Pending Reservations',
      value: data?.today?.pendingReservations || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      subtitle: `${data?.today?.newReservations || 0} new today`,
      trend: null
    },
    {
      title: 'Average Stay',
      value: `${data?.performance?.averageStayDuration?.toFixed(1) || 0} days`,
      icon: Clock,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      subtitle: `${data?.performance?.repeatGuestRate?.toFixed(1) || 0}% repeat guests`,
      trend: null
    },
    {
      title: 'Satisfaction Score',
      value: `${data?.performance?.customerSatisfaction?.toFixed(1) || 0}/5`,
      icon: Star,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      subtitle: `${data?.performance?.staffEfficiency?.toFixed(1) || 0}% staff efficiency`,
      trend: data?.performance?.customerSatisfaction > 4.5 ? 'up' : data?.performance?.customerSatisfaction > 4 ? 'stable' : 'down'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  {stat.trend && getTrendIcon(stat.trend)}
                </div>
                <div className="text-2xl font-bold text-sysora-midnight mb-1">
                  {typeof stat.value === 'string' || typeof stat.value === 'number' ? stat.value : stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewStats;
