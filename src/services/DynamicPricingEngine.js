// Dynamic Pricing Engine - Smart pricing based on demand, seasonality, and market conditions
class DynamicPricingEngine {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    this.pricingRules = new Map();
    this.marketData = new Map();
    this.demandFactors = {
      occupancyRate: 0.3,
      seasonality: 0.25,
      dayOfWeek: 0.15,
      localEvents: 0.2,
      bookingWindow: 0.1
    };
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('sysora_token');
  }

  // Calculate dynamic price for a room
  async calculateDynamicPrice(roomId, checkIn, checkOut, basePrice) {
    try {
      console.log('🔄 Calculating dynamic price for room:', roomId);
      
      const factors = await this.analyzePricingFactors(roomId, checkIn, checkOut);
      const marketConditions = await this.getMarketConditions(checkIn, checkOut);
      const demandLevel = await this.calculateDemandLevel(checkIn, checkOut);
      
      const adjustmentMultiplier = this.calculateAdjustmentMultiplier(factors, marketConditions, demandLevel);
      const dynamicPrice = Math.round(basePrice * adjustmentMultiplier);
      
      const pricing = {
        basePrice,
        dynamicPrice,
        adjustmentMultiplier,
        factors,
        marketConditions,
        demandLevel,
        savings: basePrice - dynamicPrice,
        savingsPercentage: Math.round(((basePrice - dynamicPrice) / basePrice) * 100)
      };

      console.log('💰 Dynamic pricing calculated:', pricing);
      return pricing;
    } catch (error) {
      console.error('Error calculating dynamic price:', error);
      return {
        basePrice,
        dynamicPrice: basePrice,
        adjustmentMultiplier: 1,
        factors: {},
        marketConditions: {},
        demandLevel: 'medium',
        savings: 0,
        savingsPercentage: 0
      };
    }
  }

  // Analyze pricing factors
  async analyzePricingFactors(roomId, checkIn, checkOut) {
    const factors = {};

    // Occupancy rate factor
    factors.occupancyRate = await this.getOccupancyRate(checkIn, checkOut);
    
    // Seasonality factor
    factors.seasonality = this.getSeasonalityFactor(checkIn);
    
    // Day of week factor
    factors.dayOfWeek = this.getDayOfWeekFactor(checkIn, checkOut);
    
    // Booking window factor (how far in advance)
    factors.bookingWindow = this.getBookingWindowFactor(checkIn);
    
    // Local events factor
    factors.localEvents = await this.getLocalEventsFactor(checkIn, checkOut);
    
    // Room type demand
    factors.roomTypeDemand = await this.getRoomTypeDemand(roomId, checkIn, checkOut);

    return factors;
  }

  // Get current occupancy rate
  async getOccupancyRate(checkIn, checkOut) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/analytics/occupancy-rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ checkIn, checkOut })
      });

      if (response.ok) {
        const data = await response.json();
        return data.occupancyRate || 0.5; // Default 50%
      }
    } catch (error) {
      console.error('Error getting occupancy rate:', error);
    }
    return 0.5; // Default fallback
  }

  // Get seasonality factor
  getSeasonalityFactor(checkIn) {
    const date = new Date(checkIn);
    const month = date.getMonth() + 1;
    
    // Define seasonal multipliers (can be customized per hotel)
    const seasonalFactors = {
      1: 0.8,  // January - Low season
      2: 0.8,  // February - Low season
      3: 0.9,  // March - Shoulder season
      4: 1.0,  // April - Normal season
      5: 1.1,  // May - High season
      6: 1.3,  // June - Peak season
      7: 1.4,  // July - Peak season
      8: 1.4,  // August - Peak season
      9: 1.2,  // September - High season
      10: 1.0, // October - Normal season
      11: 0.9, // November - Shoulder season
      12: 1.1  // December - Holiday season
    };

    return seasonalFactors[month] || 1.0;
  }

  // Get day of week factor
  getDayOfWeekFactor(checkIn, checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    let totalFactor = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      
      // Weekend premium
      if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday, Saturday
        totalFactor += 1.2;
      } else if (dayOfWeek === 0) { // Sunday
        totalFactor += 1.1;
      } else { // Weekdays
        totalFactor += 0.9;
      }
    }
    
    return totalFactor / nights;
  }

  // Get booking window factor
  getBookingWindowFactor(checkIn) {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const daysInAdvance = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysInAdvance <= 1) return 1.3; // Last minute premium
    if (daysInAdvance <= 7) return 1.1; // Week advance
    if (daysInAdvance <= 30) return 1.0; // Month advance
    if (daysInAdvance <= 90) return 0.9; // Early bird discount
    return 0.8; // Very early booking discount
  }

  // Get local events factor
  async getLocalEventsFactor(checkIn, checkOut) {
    try {
      // This would typically integrate with local events APIs
      // For now, we'll simulate based on dates
      const startDate = new Date(checkIn);
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
      
      // Simulate major events/holidays
      const eventDates = [
        { month: 12, day: 31, factor: 1.5 }, // New Year's Eve
        { month: 7, day: 5, factor: 1.3 },   // Independence Day
        { month: 11, day: 1, factor: 1.2 },  // Revolution Day (Algeria)
        // Add more local events
      ];
      
      for (const event of eventDates) {
        if (month === event.month && Math.abs(day - event.day) <= 2) {
          return event.factor;
        }
      }
      
      return 1.0; // No special events
    } catch (error) {
      console.error('Error getting local events factor:', error);
      return 1.0;
    }
  }

  // Get room type demand
  async getRoomTypeDemand(roomId, checkIn, checkOut) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/analytics/room-demand`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, checkIn, checkOut })
      });

      if (response.ok) {
        const data = await response.json();
        return data.demandFactor || 1.0;
      }
    } catch (error) {
      console.error('Error getting room type demand:', error);
    }
    return 1.0;
  }

  // Get market conditions
  async getMarketConditions(checkIn, checkOut) {
    try {
      // This would integrate with competitor pricing APIs
      // For now, simulate market conditions
      return {
        competitorPricing: 'average',
        marketDemand: 'medium',
        economicFactors: 'stable',
        weatherForecast: 'favorable'
      };
    } catch (error) {
      console.error('Error getting market conditions:', error);
      return {};
    }
  }

  // Calculate demand level
  async calculateDemandLevel(checkIn, checkOut) {
    const occupancyRate = await this.getOccupancyRate(checkIn, checkOut);
    
    if (occupancyRate >= 0.9) return 'very_high';
    if (occupancyRate >= 0.8) return 'high';
    if (occupancyRate >= 0.6) return 'medium';
    if (occupancyRate >= 0.4) return 'low';
    return 'very_low';
  }

  // Calculate final adjustment multiplier
  calculateAdjustmentMultiplier(factors, marketConditions, demandLevel) {
    let multiplier = 1.0;
    
    // Apply occupancy rate factor
    if (factors.occupancyRate >= 0.9) multiplier *= 1.3;
    else if (factors.occupancyRate >= 0.8) multiplier *= 1.2;
    else if (factors.occupancyRate >= 0.6) multiplier *= 1.1;
    else if (factors.occupancyRate <= 0.3) multiplier *= 0.8;
    
    // Apply seasonality
    multiplier *= factors.seasonality || 1.0;
    
    // Apply day of week factor
    multiplier *= factors.dayOfWeek || 1.0;
    
    // Apply booking window factor
    multiplier *= factors.bookingWindow || 1.0;
    
    // Apply local events factor
    multiplier *= factors.localEvents || 1.0;
    
    // Apply room type demand
    multiplier *= factors.roomTypeDemand || 1.0;
    
    // Ensure reasonable bounds (50% to 200% of base price)
    multiplier = Math.max(0.5, Math.min(2.0, multiplier));
    
    return multiplier;
  }

  // Get pricing recommendations for multiple rooms
  async getPricingRecommendations(checkIn, checkOut, roomTypes = []) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/rooms/pricing-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ checkIn, checkOut, roomTypes })
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
    } catch (error) {
      console.error('Error getting pricing recommendations:', error);
    }
    return [];
  }

  // Update pricing rules
  updatePricingRules(rules) {
    this.pricingRules.clear();
    rules.forEach(rule => {
      this.pricingRules.set(rule.id, rule);
    });
  }

  // Get pricing history and trends
  async getPricingTrends(roomId, days = 30) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/analytics/pricing-trends`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId, days })
      });

      if (response.ok) {
        const data = await response.json();
        return data.trends || [];
      }
    } catch (error) {
      console.error('Error getting pricing trends:', error);
    }
    return [];
  }
}

// Create singleton instance
const dynamicPricingEngine = new DynamicPricingEngine();

export default dynamicPricingEngine;
