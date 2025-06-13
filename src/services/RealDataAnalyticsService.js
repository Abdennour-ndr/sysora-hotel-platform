// Real Data Analytics Service - Integration with actual hotel data
// Connects Analytics & Reports with real reservations, rooms, and customer data

import advancedAnalyticsEngine from './AdvancedAnalyticsEngine';
import aiEngine from './AIEngine';
import predictionEngine from './PredictionEngine';

class RealDataAnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.isInitialized = false;
    this.lastUpdate = null;
  }

  // Initialize service with real data
  async initialize(hotelData) {
    console.log('🔄 Initializing Real Data Analytics Service...');
    
    try {
      // Initialize AI engines with real data
      await advancedAnalyticsEngine.initialize(hotelData);
      await aiEngine.initialize(hotelData);
      await predictionEngine.initialize(hotelData);
      
      this.isInitialized = true;
      this.lastUpdate = new Date();
      
      console.log('✅ Real Data Analytics Service initialized successfully');
      return { success: true, message: 'Service ready with real data' };
    } catch (error) {
      console.error('❌ Failed to initialize Real Data Analytics Service:', error);
      return { success: false, error: error.message };
    }
  }

  // Get comprehensive analytics from real data
  async getComprehensiveAnalytics(reservations = [], rooms = [], customers = []) {
    const cacheKey = 'comprehensive_analytics';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Process real data
      const realData = {
        reservations: reservations || [],
        rooms: rooms || [],
        customers: customers || []
      };

      // Get analytics from AI engines
      const aiAnalytics = await advancedAnalyticsEngine.getComprehensiveAnalytics(realData);
      const predictions = await predictionEngine.predict('comprehensive', realData);
      
      // Calculate real metrics
      const overview = this.calculateRealOverview(realData);
      const trends = this.calculateRealTrends(realData);
      const performance = this.calculateRealPerformance(realData);
      const forecasts = this.calculateRealForecasts(realData, predictions);
      
      const analytics = {
        overview,
        trends,
        performance,
        forecasts,
        aiAnalytics,
        predictions,
        realData: true,
        confidence: aiAnalytics.kpis ? 0.95 : 0.8,
        lastUpdate: new Date().toISOString(),
        dataQuality: this.assessDataQuality(realData)
      };

      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting comprehensive analytics:', error);
      return this.getFallbackAnalytics();
    }
  }

  // Calculate real overview metrics from actual data
  calculateRealOverview(data) {
    const { reservations, rooms, customers } = data;
    
    // Revenue calculations
    const totalRevenue = reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const cancelledReservations = reservations.filter(r => r.status === 'cancelled');
    
    // Time-based calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentReservations = reservations.filter(r => 
      new Date(r.createdAt || r.checkInDate) >= thirtyDaysAgo
    );
    
    // Previous period for growth calculation
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
    const previousPeriodReservations = reservations.filter(r => {
      const date = new Date(r.createdAt || r.checkInDate);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });
    
    // Growth calculations
    const currentRevenue = recentReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const previousRevenue = previousPeriodReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    
    const currentBookings = recentReservations.length;
    const previousBookings = previousPeriodReservations.length;
    const bookingsGrowth = previousBookings > 0 ? 
      ((currentBookings - previousBookings) / previousBookings) * 100 : 0;
    
    // Occupancy calculations
    const totalRooms = rooms.length || 30;
    const occupiedRooms = this.calculateCurrentOccupancy(reservations, rooms);
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    
    // Average rate calculation
    const totalNights = this.calculateTotalNights(confirmedReservations);
    const averageRate = totalNights > 0 ? totalRevenue / totalNights : 0;
    
    // Guest calculations
    const totalGuests = reservations.reduce((sum, r) => 
      sum + (r.adults || 0) + (r.children || 0), 0);
    
    // Repeat customers
    const guestEmails = {};
    reservations.forEach(r => {
      const email = r.guestEmail || r.guestId?.email;
      if (email) {
        guestEmails[email] = (guestEmails[email] || 0) + 1;
      }
    });
    const repeatCustomers = Object.values(guestEmails).filter(count => count > 1).length;
    const totalUniqueGuests = Object.keys(guestEmails).length;
    const repeatCustomerRate = totalUniqueGuests > 0 ? 
      (repeatCustomers / totalUniqueGuests) * 100 : 0;

    return {
      totalRevenue,
      revenueGrowth,
      totalBookings: reservations.length,
      bookingsGrowth,
      occupancyRate,
      occupancyGrowth: 0, // Would need historical data
      averageRate,
      rateGrowth: 0, // Would need historical data
      totalGuests,
      guestsGrowth: 0, // Would need historical data
      repeatCustomerRate,
      repeatGrowth: 0, // Would need historical data
      confirmedBookings: confirmedReservations.length,
      cancelledBookings: cancelledReservations.length,
      cancellationRate: reservations.length > 0 ? 
        (cancelledReservations.length / reservations.length) * 100 : 0,
      averageStayDuration: this.calculateAverageStayDuration(confirmedReservations),
      dataSource: 'real',
      calculatedAt: new Date().toISOString()
    };
  }

  // Calculate real trends from historical data
  calculateRealTrends(data) {
    const { reservations } = data;
    const trends = [];
    
    // Group reservations by date
    const dailyData = {};
    reservations.forEach(r => {
      const date = new Date(r.createdAt || r.checkInDate).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          revenue: 0,
          bookings: 0,
          guests: 0,
          avgValue: 0
        };
      }
      dailyData[date].revenue += r.totalAmount || 0;
      dailyData[date].bookings += 1;
      dailyData[date].guests += (r.adults || 0) + (r.children || 0);
    });

    // Calculate average values and create trend data
    Object.keys(dailyData).forEach(date => {
      const data = dailyData[date];
      data.avgValue = data.bookings > 0 ? data.revenue / data.bookings : 0;
    });

    // Sort by date and return last 30 days
    const sortedDates = Object.keys(dailyData).sort();
    const last30Days = sortedDates.slice(-30);
    
    return last30Days.map(date => ({
      date,
      ...dailyData[date],
      dataSource: 'real'
    }));
  }

  // Calculate real performance metrics
  calculateRealPerformance(data) {
    const { reservations, rooms } = data;
    
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const totalRevenue = confirmedReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const totalRooms = rooms.length || 30;
    const totalNights = this.calculateTotalNights(confirmedReservations);
    
    // RevPAR (Revenue Per Available Room)
    const revPAR = totalRooms > 0 ? totalRevenue / (totalRooms * 30) : 0; // 30 days
    
    // ADR (Average Daily Rate)
    const adr = totalNights > 0 ? totalRevenue / totalNights : 0;
    
    // Booking lead time
    const leadTimes = confirmedReservations
      .filter(r => r.createdAt && r.checkInDate)
      .map(r => {
        const created = new Date(r.createdAt);
        const checkIn = new Date(r.checkInDate);
        return Math.max(0, (checkIn - created) / (1000 * 60 * 60 * 24));
      });
    
    const averageLeadTime = leadTimes.length > 0 ? 
      leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length : 0;

    return {
      revPAR,
      adr,
      averageStayDuration: this.calculateAverageStayDuration(confirmedReservations),
      averageLeadTime,
      conversionRate: this.calculateConversionRate(reservations),
      customerLifetimeValue: this.calculateCustomerLTV(reservations),
      seasonalityIndex: this.calculateSeasonalityIndex(reservations),
      dataSource: 'real',
      calculatedAt: new Date().toISOString()
    };
  }

  // Calculate real forecasts using AI predictions
  calculateRealForecasts(data, predictions) {
    const { reservations } = data;
    
    // Use AI predictions if available
    if (predictions && predictions.predictions) {
      return {
        nextMonth: {
          revenue: predictions.predictions[0]?.prediction * 5000 || 0, // Estimate
          bookings: predictions.predictions[0]?.prediction || 0,
          occupancy: Math.min(100, (predictions.predictions[0]?.prediction || 0) * 2),
          confidence: (predictions.accuracy || 0.8) * 100
        },
        nextQuarter: {
          revenue: predictions.predictions.slice(0, 3).reduce((sum, p) => sum + (p.prediction * 5000), 0),
          bookings: predictions.predictions.slice(0, 3).reduce((sum, p) => sum + p.prediction, 0),
          occupancy: Math.min(100, predictions.predictions.slice(0, 3).reduce((sum, p) => sum + (p.prediction * 2), 0) / 3),
          confidence: (predictions.accuracy || 0.8) * 100 * 0.9 // Lower confidence for longer term
        },
        dataSource: 'ai_predictions',
        generatedAt: new Date().toISOString()
      };
    }

    // Fallback to trend-based forecasts
    const recentRevenue = reservations
      .filter(r => {
        const date = new Date(r.createdAt || r.checkInDate);
        const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
        return date >= thirtyDaysAgo;
      })
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

    return {
      nextMonth: {
        revenue: recentRevenue * 1.1, // 10% growth assumption
        bookings: reservations.length * 1.05, // 5% growth assumption
        occupancy: 75, // Conservative estimate
        confidence: 70
      },
      nextQuarter: {
        revenue: recentRevenue * 3.2, // 3 months with growth
        bookings: reservations.length * 3.1,
        occupancy: 78,
        confidence: 65
      },
      dataSource: 'trend_based',
      generatedAt: new Date().toISOString()
    };
  }

  // Helper methods
  calculateCurrentOccupancy(reservations, rooms) {
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => {
      const checkIn = new Date(r.checkInDate).toISOString().split('T')[0];
      const checkOut = new Date(r.checkOutDate).toISOString().split('T')[0];
      return checkIn <= today && checkOut > today && r.status === 'confirmed';
    });
    return todayReservations.length;
  }

  calculateTotalNights(reservations) {
    return reservations.reduce((sum, r) => {
      if (!r.checkInDate || !r.checkOutDate) return sum;
      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      const nights = Math.max(1, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
  }

  calculateAverageStayDuration(reservations) {
    const validReservations = reservations.filter(r => r.checkInDate && r.checkOutDate);
    if (validReservations.length === 0) return 0;
    
    const totalNights = this.calculateTotalNights(validReservations);
    return totalNights / validReservations.length;
  }

  calculateConversionRate(reservations) {
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const total = reservations.length;
    return total > 0 ? (confirmed / total) * 100 : 0;
  }

  calculateCustomerLTV(reservations) {
    const guestData = {};
    reservations.forEach(r => {
      const email = r.guestEmail || r.guestId?.email || 'anonymous';
      if (!guestData[email]) {
        guestData[email] = { bookings: 0, revenue: 0 };
      }
      guestData[email].bookings += 1;
      guestData[email].revenue += r.totalAmount || 0;
    });

    const customers = Object.values(guestData);
    if (customers.length === 0) return 0;

    const avgRevenue = customers.reduce((sum, c) => sum + c.revenue, 0) / customers.length;
    const avgBookings = customers.reduce((sum, c) => sum + c.bookings, 0) / customers.length;
    
    return avgRevenue * avgBookings * 2; // Estimate lifetime multiplier
  }

  calculateSeasonalityIndex(reservations) {
    const monthlyBookings = {};
    reservations.forEach(r => {
      const month = new Date(r.checkInDate).getMonth();
      monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
    });

    const avgMonthlyBookings = Object.values(monthlyBookings).reduce((sum, count) => sum + count, 0) / 12;
    const currentMonth = new Date().getMonth();
    const currentMonthBookings = monthlyBookings[currentMonth] || 0;

    return avgMonthlyBookings > 0 ? (currentMonthBookings / avgMonthlyBookings) * 100 : 100;
  }

  assessDataQuality(data) {
    const { reservations, rooms, customers } = data;
    
    let score = 0;
    let maxScore = 0;

    // Reservations quality
    maxScore += 40;
    if (reservations.length > 0) {
      score += 10;
      const withDates = reservations.filter(r => r.checkInDate && r.checkOutDate).length;
      score += (withDates / reservations.length) * 15;
      const withAmounts = reservations.filter(r => r.totalAmount > 0).length;
      score += (withAmounts / reservations.length) * 15;
    }

    // Rooms quality
    maxScore += 30;
    if (rooms.length > 0) {
      score += 15;
      const withDetails = rooms.filter(r => r.type && r.price).length;
      score += (withDetails / rooms.length) * 15;
    }

    // Customers quality
    maxScore += 30;
    if (customers.length > 0) {
      score += 15;
      const withEmails = customers.filter(c => c.email).length;
      score += (withEmails / customers.length) * 15;
    }

    const qualityScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    return {
      score: qualityScore,
      level: qualityScore > 80 ? 'excellent' : 
             qualityScore > 60 ? 'good' : 
             qualityScore > 40 ? 'fair' : 'poor',
      recommendations: this.getDataQualityRecommendations(qualityScore, data)
    };
  }

  getDataQualityRecommendations(score, data) {
    const recommendations = [];
    
    if (data.reservations.length === 0) {
      recommendations.push('Add reservation data to enable analytics');
    }
    if (data.rooms.length === 0) {
      recommendations.push('Add room information for occupancy calculations');
    }
    if (score < 60) {
      recommendations.push('Improve data completeness for better analytics accuracy');
    }
    
    return recommendations;
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback analytics for error cases
  getFallbackAnalytics() {
    return {
      overview: {
        totalRevenue: 0,
        revenueGrowth: 0,
        totalBookings: 0,
        bookingsGrowth: 0,
        occupancyRate: 0,
        dataSource: 'fallback'
      },
      trends: [],
      performance: {
        revPAR: 0,
        adr: 0,
        dataSource: 'fallback'
      },
      forecasts: {
        nextMonth: { revenue: 0, bookings: 0, occupancy: 0, confidence: 0 },
        nextQuarter: { revenue: 0, bookings: 0, occupancy: 0, confidence: 0 },
        dataSource: 'fallback'
      },
      realData: false,
      confidence: 0,
      error: 'Unable to process real data'
    };
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      lastUpdate: this.lastUpdate,
      cacheSize: this.cache.size,
      enginesStatus: {
        advancedAnalytics: advancedAnalyticsEngine.getStatus(),
        ai: aiEngine.getModelStatus(),
        prediction: predictionEngine.getStatus()
      }
    };
  }
}

// Export singleton instance
const realDataAnalyticsService = new RealDataAnalyticsService();
export default realDataAnalyticsService;
