// AI Data Manager - Advanced data processing and analysis utilities

export class AIDataManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Data fetching with caching
  async fetchWithCache(key, fetchFunction, forceRefresh = false) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (!forceRefresh && cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: now
      });
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      // Return cached data if available, even if expired
      return cached ? cached.data : null;
    }
  }

  // Advanced reservation analysis
  analyzeReservations(reservations) {
    if (!reservations || reservations.length === 0) {
      return this.getEmptyAnalysis();
    }

    const analysis = {
      totalReservations: reservations.length,
      totalRevenue: this.calculateTotalRevenue(reservations),
      averageStayDuration: this.calculateAverageStayDuration(reservations),
      occupancyRate: this.calculateOccupancyRate(reservations),
      cancellationRate: this.calculateCancellationRate(reservations),
      repeatCustomerRate: this.calculateRepeatCustomerRate(reservations),
      seasonalTrends: this.analyzeSeasonalTrends(reservations),
      weeklyPatterns: this.analyzeWeeklyPatterns(reservations),
      revenueGrowth: this.calculateRevenueGrowth(reservations),
      averageReservationValue: this.calculateAverageReservationValue(reservations),
      bookingLeadTime: this.calculateBookingLeadTime(reservations),
      guestDemographics: this.analyzeGuestDemographics(reservations)
    };

    return analysis;
  }

  calculateTotalRevenue(reservations) {
    return reservations.reduce((total, reservation) => {
      return total + (reservation.totalAmount || 0);
    }, 0);
  }

  calculateAverageStayDuration(reservations) {
    const validReservations = reservations.filter(r => r.checkInDate && r.checkOutDate);
    if (validReservations.length === 0) return 0;

    const totalNights = validReservations.reduce((total, reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return total + Math.max(1, nights);
    }, 0);

    return totalNights / validReservations.length;
  }

  calculateOccupancyRate(reservations, totalRooms = 30) {
    const currentDate = new Date();
    const last30Days = reservations.filter(r => {
      const reservationDate = new Date(r.checkInDate);
      const daysDiff = (currentDate - reservationDate) / (1000 * 60 * 60 * 24);
      return daysDiff >= 0 && daysDiff <= 30;
    });

    const totalNights = last30Days.reduce((total, reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return total + Math.max(1, nights);
    }, 0);

    const totalAvailableNights = totalRooms * 30;
    return totalAvailableNights > 0 ? (totalNights / totalAvailableNights) * 100 : 0;
  }

  calculateCancellationRate(reservations) {
    const cancelledReservations = reservations.filter(r => r.status === 'cancelled');
    return reservations.length > 0 ? (cancelledReservations.length / reservations.length) * 100 : 0;
  }

  calculateRepeatCustomerRate(reservations) {
    const guestEmails = {};
    reservations.forEach(r => {
      const email = r.guestId?.email || r.guestEmail;
      if (email) {
        guestEmails[email] = (guestEmails[email] || 0) + 1;
      }
    });

    const repeatGuests = Object.values(guestEmails).filter(count => count > 1).length;
    const totalGuests = Object.keys(guestEmails).length;
    return totalGuests > 0 ? (repeatGuests / totalGuests) * 100 : 0;
  }

  analyzeSeasonalTrends(reservations) {
    const monthlyData = {};
    
    reservations.forEach(reservation => {
      const month = new Date(reservation.checkInDate).getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = {
          count: 0,
          revenue: 0,
          averageRate: 0
        };
      }
      monthlyData[month].count++;
      monthlyData[month].revenue += reservation.totalAmount || 0;
    });

    // Calculate average rates
    Object.keys(monthlyData).forEach(month => {
      const data = monthlyData[month];
      data.averageRate = data.count > 0 ? data.revenue / data.count : 0;
    });

    return monthlyData;
  }

  analyzeWeeklyPatterns(reservations) {
    const weeklyData = {};
    
    reservations.forEach(reservation => {
      const dayOfWeek = new Date(reservation.checkInDate).getDay();
      if (!weeklyData[dayOfWeek]) {
        weeklyData[dayOfWeek] = {
          count: 0,
          revenue: 0,
          averageRate: 0
        };
      }
      weeklyData[dayOfWeek].count++;
      weeklyData[dayOfWeek].revenue += reservation.totalAmount || 0;
    });

    // Calculate average rates
    Object.keys(weeklyData).forEach(day => {
      const data = weeklyData[day];
      data.averageRate = data.count > 0 ? data.revenue / data.count : 0;
    });

    return weeklyData;
  }

  calculateRevenueGrowth(reservations) {
    const currentDate = new Date();
    const last30Days = reservations.filter(r => {
      const reservationDate = new Date(r.createdAt || r.checkInDate);
      const daysDiff = (currentDate - reservationDate) / (1000 * 60 * 60 * 24);
      return daysDiff >= 0 && daysDiff <= 30;
    });

    const previous30Days = reservations.filter(r => {
      const reservationDate = new Date(r.createdAt || r.checkInDate);
      const daysDiff = (currentDate - reservationDate) / (1000 * 60 * 60 * 24);
      return daysDiff >= 30 && daysDiff <= 60;
    });

    const currentRevenue = this.calculateTotalRevenue(last30Days);
    const previousRevenue = this.calculateTotalRevenue(previous30Days);

    return previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  }

  calculateAverageReservationValue(reservations) {
    const totalRevenue = this.calculateTotalRevenue(reservations);
    return reservations.length > 0 ? totalRevenue / reservations.length : 0;
  }

  calculateBookingLeadTime(reservations) {
    const validReservations = reservations.filter(r => r.createdAt && r.checkInDate);
    if (validReservations.length === 0) return 0;

    const totalLeadTime = validReservations.reduce((total, reservation) => {
      const created = new Date(reservation.createdAt);
      const checkIn = new Date(reservation.checkInDate);
      const leadTime = Math.ceil((checkIn - created) / (1000 * 60 * 60 * 24));
      return total + Math.max(0, leadTime);
    }, 0);

    return totalLeadTime / validReservations.length;
  }

  analyzeGuestDemographics(reservations) {
    const demographics = {
      adultDistribution: {},
      childrenDistribution: {},
      stayDurationDistribution: {},
      totalGuests: 0,
      averagePartySize: 0
    };

    let totalPartySize = 0;

    reservations.forEach(reservation => {
      const adults = reservation.adults || 1;
      const children = reservation.children || 0;
      const partySize = adults + children;
      
      totalPartySize += partySize;
      demographics.totalGuests += partySize;

      // Adult distribution
      demographics.adultDistribution[adults] = (demographics.adultDistribution[adults] || 0) + 1;
      
      // Children distribution
      demographics.childrenDistribution[children] = (demographics.childrenDistribution[children] || 0) + 1;

      // Stay duration distribution
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const duration = Math.max(1, nights);
      
      demographics.stayDurationDistribution[duration] = (demographics.stayDurationDistribution[duration] || 0) + 1;
    });

    demographics.averagePartySize = reservations.length > 0 ? totalPartySize / reservations.length : 0;

    return demographics;
  }

  getEmptyAnalysis() {
    return {
      totalReservations: 0,
      totalRevenue: 0,
      averageStayDuration: 0,
      occupancyRate: 0,
      cancellationRate: 0,
      repeatCustomerRate: 0,
      seasonalTrends: {},
      weeklyPatterns: {},
      revenueGrowth: 0,
      averageReservationValue: 0,
      bookingLeadTime: 0,
      guestDemographics: {
        adultDistribution: {},
        childrenDistribution: {},
        stayDurationDistribution: {},
        totalGuests: 0,
        averagePartySize: 0
      }
    };
  }

  // Predictive analytics
  generatePredictions(historicalData, predictionDays = 30) {
    const predictions = [];
    const trends = this.calculateTrends(historicalData);
    
    for (let i = 1; i <= predictionDays; i++) {
      const prediction = this.predictSingleDay(historicalData, trends, i);
      predictions.push(prediction);
    }

    return predictions;
  }

  calculateTrends(data) {
    // Implement trend calculation logic
    return {
      occupancyTrend: 0,
      revenueTrend: 0,
      seasonalFactor: 1
    };
  }

  predictSingleDay(historicalData, trends, daysAhead) {
    // Implement single day prediction logic
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + daysAhead);

    return {
      date: baseDate.toISOString().split('T')[0],
      predictedOccupancy: 70,
      predictedRevenue: 15000,
      confidence: Math.max(60, 95 - daysAhead)
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const aiDataManager = new AIDataManager();
