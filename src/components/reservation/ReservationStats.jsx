import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ReservationStats = ({ reservations = [], onRefresh }) => {
  const [stats, setStats] = useState({
    todayArrivals: 0,
    todayDepartures: 0,
    currentOccupancy: 0,
    totalRooms: 0,
    todayRevenue: 0,
    pendingCheckIns: 0,
    lateCheckOuts: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Calculate real-time stats from reservations and fetch additional data
  useEffect(() => {
    calculateStats();
  }, [reservations]);

  const calculateStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sysora_token');

      if (!token) {
        setLoading(false);
        return;
      }

      // Get today's date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Calculate stats from reservations
      const todayArrivals = reservations.filter(r =>
        r.checkInDate?.split('T')[0] === todayStr &&
        (r.status === 'confirmed' || r.status === 'checked_in')
      ).length;

      const todayDepartures = reservations.filter(r =>
        r.checkOutDate?.split('T')[0] === todayStr &&
        r.status === 'checked_out'
      ).length;

      const pendingCheckIns = reservations.filter(r =>
        r.checkInDate?.split('T')[0] === todayStr &&
        r.status === 'confirmed'
      ).length;

      const lateCheckOuts = reservations.filter(r => {
        const checkOutDate = new Date(r.checkOutDate);
        return checkOutDate < today && r.status === 'checked_in';
      }).length;

      const currentOccupancy = reservations.filter(r =>
        r.status === 'checked_in'
      ).length;

      const todayRevenue = reservations
        .filter(r => r.checkInDate?.split('T')[0] === todayStr)
        .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

      // Fetch total rooms count
      let totalRooms = 0;
      try {
        const roomsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          totalRooms = roomsData.data?.rooms?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }

      const occupancyRate = totalRooms > 0 ? Math.round((currentOccupancy / totalRooms) * 100) : 0;

      setStats({
        todayArrivals,
        todayDepartures,
        currentOccupancy,
        totalRooms,
        todayRevenue,
        pendingCheckIns,
        lateCheckOuts,
        occupancyRate
      });

    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic changes and status
  const getChangeInfo = (current, type) => {
    switch (type) {
      case 'arrivals':
        return {
          change: current > 0 ? `${current} today` : "No arrivals",
          changeType: current > 0 ? "positive" : "neutral"
        };
      case 'departures':
        return {
          change: current > 0 ? `${current} today` : "No departures",
          changeType: current > 0 ? "positive" : "neutral"
        };
      case 'occupancy':
        return {
          change: `${stats.occupancyRate}% occupied`,
          changeType: stats.occupancyRate > 80 ? "warning" : stats.occupancyRate > 60 ? "positive" : "neutral"
        };
      case 'revenue':
        return {
          change: current > 0 ? "Revenue generated" : "No revenue",
          changeType: current > 0 ? "positive" : "neutral"
        };
      case 'pending':
        return {
          change: current > 5 ? "High volume" : current > 0 ? "Normal" : "All clear",
          changeType: current > 5 ? "warning" : current > 0 ? "neutral" : "positive"
        };
      case 'late':
        return {
          change: current > 0 ? "Attention needed" : "All clear",
          changeType: current > 0 ? "negative" : "positive"
        };
      default:
        return { change: "Normal", changeType: "neutral" };
    }
  };

  const statCards = [
    {
      title: "Today's Arrivals",
      value: stats.todayArrivals,
      icon: Calendar,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      ...getChangeInfo(stats.todayArrivals, 'arrivals'),
      onClick: () => onRefresh && onRefresh('arrivals')
    },
    {
      title: "Today's Departures",
      value: stats.todayDepartures,
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      ...getChangeInfo(stats.todayDepartures, 'departures'),
      onClick: () => onRefresh && onRefresh('departures')
    },
    {
      title: "Current Occupancy",
      value: `${stats.currentOccupancy}/${stats.totalRooms}`,
      icon: Home,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      subtitle: `${stats.occupancyRate}% occupied`,
      ...getChangeInfo(stats.currentOccupancy, 'occupancy'),
      onClick: () => onRefresh && onRefresh('occupancy')
    },
    {
      title: "Today's Revenue",
      value: `${stats.todayRevenue.toLocaleString()} DZD`,
      icon: DollarSign,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      ...getChangeInfo(stats.todayRevenue, 'revenue'),
      onClick: () => onRefresh && onRefresh('revenue')
    },
    {
      title: "Pending Check-ins",
      value: stats.pendingCheckIns,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      ...getChangeInfo(stats.pendingCheckIns, 'pending'),
      onClick: () => onRefresh && onRefresh('pending')
    },
    {
      title: "Late Check-outs",
      value: stats.lateCheckOuts,
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      ...getChangeInfo(stats.lateCheckOuts, 'late'),
      onClick: () => onRefresh && onRefresh('late')
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600'; 
      case 'warning': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;

        return (
          <div
            key={`stat-${stat.title.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={stat.onClick}
            className={`${stat.bgColor} rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} p-2 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {stat.title}
              </h3>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              {stat.subtitle && (
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReservationStats;
