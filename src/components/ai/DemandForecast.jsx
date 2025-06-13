import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import predictionEngine from '../../services/PredictionEngine';
import aiEngine from '../../services/AIEngine';

const DemandForecast = ({ reservations = [] }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    generateForecast();
  }, [reservations, selectedPeriod]);

  const generateForecast = async () => {
    setLoading(true);

    try {
      // Real AI processing with actual data analysis
      const forecastData = await calculateDemandForecast();
      setForecast(forecastData);
    } catch (error) {
      console.error('Error generating forecast:', error);
      window.showToast && window.showToast('Error generating demand forecast', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateDemandForecast = async () => {
    const periods = {
      '7days': 7,
      '14days': 14,
      '30days': 30,
      '90days': 90
    };

    const days = periods[selectedPeriod];

    try {
      // Initialize AI engines if not already done
      if (!predictionEngine.isInitialized) {
        await predictionEngine.initialize({
          reservations,
          rooms: [],
          customers: []
        });
      }

      if (!aiEngine.isInitialized) {
        await aiEngine.initialize({
          reservations,
          rooms: [],
          customers: []
        });
      }

      // Get AI-powered demand predictions
      const aiPredictions = await predictionEngine.predict('demandForecast', {
        startDate: new Date()
      }, days);

      // Analyze real reservation data for comparison
      const realHistoricalData = analyzeRealHistoricalData(days);

      // Combine AI predictions with traditional analysis
      const enhancedPredictions = await enhanceWithAIPredictions(aiPredictions, realHistoricalData);

      return {
        period: selectedPeriod,
        days,
        historical: realHistoricalData,
        predictions: enhancedPredictions,
        aiPredictions: aiPredictions,
        insights: generateAdvancedInsights(enhancedPredictions, realHistoricalData, aiPredictions),
        confidence: Math.max(calculateRealConfidence(realHistoricalData), aiPredictions.accuracy * 100),
        trends: analyzeRealTrends(enhancedPredictions, realHistoricalData),
        aiEnhanced: true
      };
    } catch (error) {
      console.error('AI prediction failed, falling back to traditional analysis:', error);

      // Fallback to traditional analysis
      const realHistoricalData = analyzeRealHistoricalData(days);
      const predictions = await generateAdvancedPredictions(realHistoricalData, days);

      return {
        period: selectedPeriod,
        days,
        historical: realHistoricalData,
        predictions,
        insights: generateAdvancedInsights(predictions, realHistoricalData),
        confidence: calculateRealConfidence(realHistoricalData),
        trends: analyzeRealTrends(predictions, realHistoricalData),
        aiEnhanced: false
      };
    }
  };

  // Enhance traditional predictions with AI insights
  const enhanceWithAIPredictions = async (aiPredictions, historicalData) => {
    const enhancedPredictions = [];

    if (!aiPredictions.predictions || aiPredictions.predictions.length === 0) {
      // Fallback to traditional predictions
      return await generateAdvancedPredictions(historicalData, aiPredictions.horizon || 7);
    }

    aiPredictions.predictions.forEach((aiPred, index) => {
      const date = new Date(aiPred.date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Calculate enhanced metrics using AI prediction as base
      const aiBookings = aiPred.prediction;
      const totalRooms = 30; // Should come from actual rooms data
      const occupancyRate = Math.min(100, (aiBookings / totalRooms) * 100);

      // Estimate revenue based on AI prediction and historical patterns
      const avgRoomRate = historicalData.length > 0
        ? historicalData.reduce((sum, d) => sum + d.revenue, 0) / historicalData.reduce((sum, d) => sum + d.bookings, 1)
        : 5000; // Default room rate in DZD

      const estimatedRevenue = aiBookings * avgRoomRate;

      enhancedPredictions.push({
        date: aiPred.date,
        occupancy: Math.round(occupancyRate),
        bookings: Math.round(aiBookings),
        revenue: Math.round(estimatedRevenue),
        confidence: Math.round(aiPred.confidence * 100),
        dayOfWeek,
        isWeekend,
        aiEnhanced: true,
        factors: {
          ...aiPred.factors,
          aiPrediction: aiBookings,
          traditionalEstimate: Math.round(occupancyRate * 0.3) // Traditional estimate for comparison
        }
      });
    });

    return enhancedPredictions;
  };



  const analyzeRealHistoricalData = (days) => {
    const data = [];
    const currentDate = new Date();

    // Analyze actual reservation data for the past period
    for (let i = days; i >= 1; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);

      // Filter reservations for this specific date
      const dayReservations = reservations.filter(r => {
        const checkInDate = new Date(r.checkInDate);
        return checkInDate.toDateString() === date.toDateString();
      });

      const dayRevenue = dayReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      const dayBookings = dayReservations.length;

      // Calculate occupancy based on actual data
      const totalRooms = 30; // This should come from rooms.length in real implementation
      const occupancy = totalRooms > 0 ? (dayBookings / totalRooms) * 100 : 0;

      data.push({
        date: date.toISOString().split('T')[0],
        occupancy: Math.min(100, occupancy),
        bookings: dayBookings,
        revenue: dayRevenue,
        dayOfWeek: date.getDay(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        actualData: true
      });
    }

    return data;
  };

  const generateAdvancedPredictions = async (historical, days) => {
    const predictions = [];

    // Calculate trends from real data
    const recentTrend = calculateMovingAverage(historical.slice(-7));
    const seasonalPattern = calculateSeasonalPattern(historical);
    const weeklyPattern = calculateWeeklyPattern(historical);

    for (let i = 1; i <= Math.min(days, 30); i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Advanced prediction algorithm
      const basePrediction = recentTrend.occupancy;
      const seasonalAdjustment = seasonalPattern[date.getMonth()] || 0;
      const weeklyAdjustment = weeklyPattern[dayOfWeek] || 0;
      const trendAdjustment = calculateTrendAdjustment(historical, i);

      const predictedOccupancy = Math.max(0, Math.min(100,
        basePrediction + seasonalAdjustment + weeklyAdjustment + trendAdjustment
      ));

      // Calculate confidence based on data quality and prediction distance
      const confidence = Math.max(60, 95 - (i * 1.5) - (historical.length < 14 ? 10 : 0));

      predictions.push({
        date: date.toISOString().split('T')[0],
        occupancy: Math.round(predictedOccupancy),
        bookings: Math.round(predictedOccupancy * 0.3),
        revenue: Math.round(predictedOccupancy * 150 * 30),
        confidence: Math.round(confidence),
        dayOfWeek,
        isWeekend,
        factors: {
          base: basePrediction,
          seasonal: seasonalAdjustment,
          weekly: weeklyAdjustment,
          trend: trendAdjustment
        }
      });
    }

    return predictions;
  };

  const calculateMovingAverage = (data) => {
    if (data.length === 0) return { occupancy: 50, revenue: 0, bookings: 0 };

    const avgOccupancy = data.reduce((sum, d) => sum + d.occupancy, 0) / data.length;
    const avgRevenue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;
    const avgBookings = data.reduce((sum, d) => sum + d.bookings, 0) / data.length;

    return {
      occupancy: avgOccupancy,
      revenue: avgRevenue,
      bookings: avgBookings
    };
  };

  const calculateSeasonalPattern = (historical) => {
    const monthlyData = {};

    historical.forEach(day => {
      const month = new Date(day.date).getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(day.occupancy);
    });

    const seasonalPattern = {};
    Object.keys(monthlyData).forEach(month => {
      const avgOccupancy = monthlyData[month].reduce((sum, occ) => sum + occ, 0) / monthlyData[month].length;
      const overallAvg = historical.reduce((sum, d) => sum + d.occupancy, 0) / historical.length;
      seasonalPattern[month] = avgOccupancy - overallAvg;
    });

    return seasonalPattern;
  };

  const calculateWeeklyPattern = (historical) => {
    const weeklyData = {};

    historical.forEach(day => {
      const dayOfWeek = day.dayOfWeek;
      if (!weeklyData[dayOfWeek]) {
        weeklyData[dayOfWeek] = [];
      }
      weeklyData[dayOfWeek].push(day.occupancy);
    });

    const weeklyPattern = {};
    Object.keys(weeklyData).forEach(day => {
      const avgOccupancy = weeklyData[day].reduce((sum, occ) => sum + occ, 0) / weeklyData[day].length;
      const overallAvg = historical.reduce((sum, d) => sum + d.occupancy, 0) / historical.length;
      weeklyPattern[day] = avgOccupancy - overallAvg;
    });

    return weeklyPattern;
  };

  const calculateTrendAdjustment = (historical, daysAhead) => {
    if (historical.length < 7) return 0;

    const recent = historical.slice(-7);
    const earlier = historical.slice(-14, -7);

    if (earlier.length === 0) return 0;

    const recentAvg = recent.reduce((sum, d) => sum + d.occupancy, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + d.occupancy, 0) / earlier.length;

    const weeklyTrend = recentAvg - earlierAvg;
    const dailyTrend = weeklyTrend / 7;

    return dailyTrend * daysAhead * 0.5; // Dampen the trend effect
  };

  const generateAdvancedInsights = (predictions, historical, aiPredictions = null) => {
    const insights = [];

    // AI-enhanced insights if available
    if (aiPredictions && aiPredictions.summary) {
      insights.push({
        id: 'ai-summary',
        type: 'ai-insight',
        title: 'AI Forecast Summary',
        description: `AI predicts ${aiPredictions.summary.totalPredicted} total bookings with ${aiPredictions.summary.trend} trend. Average daily: ${aiPredictions.summary.averageDaily.toFixed(1)} bookings.`,
        icon: Zap,
        color: 'purple'
      });
    }

    // Peak demand periods
    const peakDays = predictions.filter(p => p.occupancy > 85);
    if (peakDays.length > 0) {
      insights.push({
        id: 'peak-demand',
        type: 'opportunity',
        title: 'High Demand Periods Detected',
        description: `${peakDays.length} days with occupancy above 85%. Consider premium pricing.`,
        icon: TrendingUp,
        color: 'green'
      });
    }

    // Low demand periods
    const lowDays = predictions.filter(p => p.occupancy < 50);
    if (lowDays.length > 0) {
      insights.push({
        id: 'low-demand',
        type: 'warning',
        title: 'Low Demand Alert',
        description: `${lowDays.length} days with occupancy below 50%. Promotional campaigns recommended.`,
        icon: AlertTriangle,
        color: 'orange'
      });
    }

    // Weekend vs weekday analysis
    const weekendPredictions = predictions.filter(p => p.isWeekend);
    const weekdayPredictions = predictions.filter(p => !p.isWeekend);

    if (weekendPredictions.length > 0 && weekdayPredictions.length > 0) {
      const weekendAvg = weekendPredictions.reduce((sum, p) => sum + p.occupancy, 0) / weekendPredictions.length;
      const weekdayAvg = weekdayPredictions.reduce((sum, p) => sum + p.occupancy, 0) / weekdayPredictions.length;

      if (weekendAvg > weekdayAvg + 20) {
        insights.push({
          id: 'weekend-demand',
          type: 'info',
          title: 'Strong Weekend Demand',
          description: `Weekend occupancy (${weekendAvg.toFixed(1)}%) significantly higher than weekdays (${weekdayAvg.toFixed(1)}%).`,
          icon: Calendar,
          color: 'blue'
        });
      }
    }

    // AI confidence insight
    if (aiPredictions && aiPredictions.accuracy) {
      const confidenceLevel = aiPredictions.accuracy * 100;
      if (confidenceLevel > 85) {
        insights.push({
          id: 'ai-confidence',
          type: 'success',
          title: 'High AI Confidence',
          description: `AI model shows ${confidenceLevel.toFixed(1)}% confidence in predictions. Reliable forecasting available.`,
          icon: Target,
          color: 'green'
        });
      } else if (confidenceLevel < 70) {
        insights.push({
          id: 'ai-confidence-low',
          type: 'warning',
          title: 'Limited AI Confidence',
          description: `AI model confidence is ${confidenceLevel.toFixed(1)}%. More historical data needed for better predictions.`,
          icon: AlertTriangle,
          color: 'orange'
        });
      }
    }

    return insights;
  };

  const calculateRealConfidence = (historical) => {
    if (historical.length === 0) return 60;

    // Calculate confidence based on data quality and consistency
    const dataQuality = Math.min(100, (historical.length / 30) * 100); // More data = higher confidence
    const variance = calculateVariance(historical.map(d => d.occupancy));
    const consistency = Math.max(0, 100 - variance);

    return Math.max(60, Math.min(95, (dataQuality + consistency) / 2));
  };

  const analyzeRealTrends = (predictions, historical) => {
    const trend = calculateTrend([...historical, ...predictions.slice(0, 7)]);

    let direction;
    if (trend > 2) {
      direction = 'increasing';
    } else if (trend < -2) {
      direction = 'decreasing';
    } else {
      direction = 'stable';
    }

    let description;
    if (trend > 2) {
      description = 'Demand is trending upward';
    } else if (trend < -2) {
      description = 'Demand is trending downward';
    } else {
      description = 'Demand is relatively stable';
    }

    return {
      direction,
      strength: Math.abs(trend),
      description
    };
  };

  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.occupancy, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.occupancy, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  };

  const calculateVariance = (values) => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  };

  const periods = [
    { id: '7days', name: '7 Days', icon: Clock },
    { id: '14days', name: '14 Days', icon: Calendar },
    { id: '30days', name: '30 Days', icon: BarChart3 },
    { id: '90days', name: '90 Days', icon: TrendingUp }
  ];

  const getInsightColor = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'increasing': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'decreasing': return <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />;
      default: return <Target className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Demand Forecast</h3>
            <p className="text-gray-600">AI-powered predictions for optimal planning</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            {forecast?.confidence.toFixed(0)}% Confidence
          </span>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {periods.map(period => {
          const IconComponent = period.icon;
          return (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{period.name}</span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing patterns and generating forecast...</p>
            <p className="text-sm text-gray-500 mt-2">Processing {selectedPeriod} of data</p>
          </div>
        </div>
      )}

      {/* Forecast Results */}
      {!loading && forecast && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Avg Predicted Occupancy</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(forecast.predictions.reduce((sum, p) => sum + p.occupancy, 0) / forecast.predictions.length).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Expected Revenue</p>
                  <p className="text-2xl font-bold text-green-900">
                    {(forecast.predictions.reduce((sum, p) => sum + p.revenue, 0) / 1000).toFixed(0)}K DZD
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Peak Demand Days</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {forecast.predictions.filter(p => p.occupancy > 85).length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Trend Direction</p>
                  <p className="text-lg font-bold text-orange-900 capitalize">
                    {forecast.trends.direction}
                  </p>
                </div>
                {getTrendIcon(forecast.trends.direction)}
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Forecast</h4>
            <div className="space-y-2">
              {forecast.predictions.slice(0, 14).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-700 w-20">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            day.occupancy > 85 ? 'bg-red-500' :
                            day.occupancy > 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${day.occupancy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="font-medium text-gray-900">{day.occupancy}%</span>
                    <span className="text-gray-600">{day.confidence}% confidence</span>
                    {day.isWeekend && <span className="text-blue-600 text-xs">Weekend</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forecast.insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div
                    key={insight.id || `insight-${index}`}
                    className={`border rounded-xl p-4 ${getInsightColor(insight.color)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">{insight.title}</h5>
                        <p className="text-sm text-gray-700">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Trend Analysis</h4>
                <p className="text-gray-600 mt-1">{forecast.trends.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(forecast.trends.direction)}
                  <span className="text-lg font-bold text-gray-900 capitalize">
                    {forecast.trends.direction}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Strength: {forecast.trends.strength.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandForecast;
