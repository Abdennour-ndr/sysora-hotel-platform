import React, { useState, useEffect } from 'react';
import { 
  Bed, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Calendar
} from 'lucide-react';

const RoomAnalytics = ({ rooms = [], reservations = [], timeframe = '30days' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateRoomAnalytics();
  }, [rooms, reservations, timeframe]);

  const calculateRoomAnalytics = () => {
    setLoading(true);
    
    try {
      const now = new Date();
      const daysBack = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      
      const filteredReservations = reservations.filter(r => 
        new Date(r.checkInDate) >= startDate
      );

      // Core metrics
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
      const availableRooms = rooms.filter(room => room.status === 'available').length;
      const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
      const outOfOrderRooms = rooms.filter(room => room.status === 'out_of_order').length;
      
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      
      // Revenue metrics
      const roomRevenue = filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      const averageDailyRate = filteredReservations.length > 0 ? roomRevenue / filteredReservations.length : 0;
      const revenuePerAvailableRoom = totalRooms > 0 ? roomRevenue / (totalRooms * daysBack) : 0;
      
      // Room type analysis
      const roomTypeAnalysis = {};
      rooms.forEach(room => {
        const type = room.type || 'Standard';
        if (!roomTypeAnalysis[type]) {
          roomTypeAnalysis[type] = {
            total: 0,
            occupied: 0,
            revenue: 0,
            averageRate: 0
          };
        }
        roomTypeAnalysis[type].total++;
        if (room.status === 'occupied') {
          roomTypeAnalysis[type].occupied++;
        }
      });
      
      // Calculate revenue by room type
      filteredReservations.forEach(reservation => {
        const roomType = reservation.roomType || 'Standard';
        if (roomTypeAnalysis[roomType]) {
          roomTypeAnalysis[roomType].revenue += reservation.totalAmount || 0;
        }
      });
      
      // Calculate average rates
      Object.keys(roomTypeAnalysis).forEach(type => {
        const typeReservations = filteredReservations.filter(r => (r.roomType || 'Standard') === type);
        roomTypeAnalysis[type].averageRate = typeReservations.length > 0 
          ? roomTypeAnalysis[type].revenue / typeReservations.length 
          : 0;
        roomTypeAnalysis[type].occupancyRate = roomTypeAnalysis[type].total > 0 
          ? (roomTypeAnalysis[type].occupied / roomTypeAnalysis[type].total) * 100 
          : 0;
      });
      
      // Performance trends (simulated)
      const dailyOccupancy = generateDailyOccupancy(daysBack);
      const hourlyCheckIns = generateHourlyCheckIns();
      
      // Growth calculations (simulated)
      const previousOccupancy = occupancyRate * 0.9;
      const occupancyGrowth = ((occupancyRate - previousOccupancy) / previousOccupancy) * 100;
      
      const previousRevenue = roomRevenue * 0.85;
      const revenueGrowth = ((roomRevenue - previousRevenue) / previousRevenue) * 100;

      setAnalytics({
        overview: {
          totalRooms,
          occupiedRooms,
          availableRooms,
          maintenanceRooms,
          outOfOrderRooms,
          occupancyRate,
          roomRevenue,
          averageDailyRate,
          revenuePerAvailableRoom,
          occupancyGrowth,
          revenueGrowth
        },
        roomTypes: roomTypeAnalysis,
        trends: {
          daily: dailyOccupancy,
          hourly: hourlyCheckIns
        },
        insights: generateRoomInsights(rooms, occupancyRate, roomTypeAnalysis)
      });
    } catch (error) {
      console.error('Error calculating room analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyOccupancy = (days) => {
    const dailyData = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const occupancy = Math.random() * 40 + 60; // 60-100% occupancy
      
      dailyData.push({
        date: date.toLocaleDateString(),
        occupancy: occupancy.toFixed(1),
        revenue: occupancy * 50 + Math.random() * 1000 // Simulated revenue
      });
    }
    
    return dailyData;
  };

  const generateHourlyCheckIns = () => {
    const hourlyData = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let checkIns = 0;
      
      // Peak check-in times (3-6 PM)
      if (hour >= 15 && hour <= 18) {
        checkIns = Math.floor(Math.random() * 15) + 10;
      } else if (hour >= 12 && hour <= 20) {
        checkIns = Math.floor(Math.random() * 8) + 3;
      } else {
        checkIns = Math.floor(Math.random() * 3);
      }
      
      hourlyData.push({
        hour,
        checkIns,
        timeLabel: `${hour.toString().padStart(2, '0')}:00`
      });
    }
    
    return hourlyData;
  };

  const generateRoomInsights = (rooms, occupancyRate, roomTypeAnalysis) => {
    const insights = [];
    
    // Occupancy insight
    if (occupancyRate > 90) {
      insights.push({
        type: 'success',
        title: 'High Occupancy Rate',
        description: `Excellent occupancy rate of ${occupancyRate.toFixed(1)}%`,
        impact: 'high',
        recommendation: 'Consider implementing dynamic pricing to maximize revenue'
      });
    } else if (occupancyRate < 70) {
      insights.push({
        type: 'warning',
        title: 'Low Occupancy Rate',
        description: `Occupancy rate of ${occupancyRate.toFixed(1)}% is below optimal`,
        impact: 'high',
        recommendation: 'Review pricing strategy and marketing campaigns'
      });
    }
    
    // Room type performance
    const bestPerformingType = Object.entries(roomTypeAnalysis)
      .sort((a, b) => b[1].occupancyRate - a[1].occupancyRate)[0];
    
    if (bestPerformingType) {
      insights.push({
        type: 'info',
        title: 'Top Performing Room Type',
        description: `${bestPerformingType[0]} rooms have the highest occupancy at ${bestPerformingType[1].occupancyRate.toFixed(1)}%`,
        impact: 'medium',
        recommendation: 'Consider increasing inventory of high-performing room types'
      });
    }
    
    // Maintenance insight
    const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
    if (maintenanceRooms > rooms.length * 0.1) {
      insights.push({
        type: 'warning',
        title: 'High Maintenance Rooms',
        description: `${maintenanceRooms} rooms are currently under maintenance`,
        impact: 'medium',
        recommendation: 'Review maintenance schedules to minimize revenue impact'
      });
    }
    
    return insights;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || !analytics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Room Analytics</h2>
          <p className="text-gray-600">Occupancy, performance, and revenue insights</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Bed className="w-4 h-4" />
          <span>Last {timeframe === '7days' ? '7 days' : timeframe === '30days' ? '30 days' : '90 days'}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Bed className="w-5 h-5 text-blue-600" />
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(analytics.overview.occupancyGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.overview.occupancyRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Occupancy Rate</div>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span className="text-xs font-medium">{formatPercentage(analytics.overview.revenueGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.roomRevenue)}</div>
          <div className="text-sm text-gray-600">Room Revenue</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <div className="text-xs text-gray-500">ADR</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.averageDailyRate)}</div>
          <div className="text-sm text-gray-600">Average Daily Rate</div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <div className="text-xs text-gray-500">RevPAR</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.revenuePerAvailableRoom)}</div>
          <div className="text-sm text-gray-600">Revenue per Available Room</div>
        </div>
      </div>

      {/* Room Status Distribution */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.occupiedRooms}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </div>
          
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.availableRooms}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.maintenanceRooms}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{analytics.overview.outOfOrderRooms}</div>
            <div className="text-sm text-gray-600">Out of Order</div>
          </div>
        </div>
      </div>

      {/* Room Type Performance */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Type Performance</h3>
        <div className="space-y-4">
          {Object.entries(analytics.roomTypes).map(([type, data]) => (
            <div key={type} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{type}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">{data.total} rooms</span>
                  <span className={`font-medium ${data.occupancyRate > 80 ? 'text-green-600' : data.occupancyRate > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {data.occupancyRate.toFixed(1)}% occupied
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Revenue</div>
                  <div className="font-medium">{formatCurrency(data.revenue)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Average Rate</div>
                  <div className="font-medium">{formatCurrency(data.averageRate)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Occupied/Total</div>
                  <div className="font-medium">{data.occupied}/{data.total}</div>
                </div>
              </div>
              
              {/* Occupancy bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${data.occupancyRate > 80 ? 'bg-green-500' : data.occupancyRate > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${data.occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {analytics.insights.map((insight, index) => {
            const typeConfig = {
              info: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              warning: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
              success: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
            };
            
            const config = typeConfig[insight.type] || typeConfig.info;
            
            return (
              <div key={index} className={`${config.bg} ${config.border} border rounded-lg p-4`}>
                <div className="flex items-start space-x-3">
                  <Activity className={`w-5 h-5 ${config.color} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`font-medium ${config.color}`}>{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        💡 {insight.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomAnalytics;
