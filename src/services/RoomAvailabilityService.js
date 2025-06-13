// Room Availability Service - Smart room availability management
class RoomAvailabilityService {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('sysora_token');
  }

  // Check room availability for specific dates
  async checkAvailability(roomId, checkIn, checkOut, excludeReservationId = null) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/rooms/${roomId}/availability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkInDate: checkIn,
          checkOutDate: checkOut,
          excludeReservationId
        })
      });

      const data = await response.json();
      return {
        success: response.ok,
        available: data.available || false,
        conflicts: data.conflicts || [],
        message: data.message
      };
    } catch (error) {
      console.error('Error checking room availability:', error);
      return {
        success: false,
        available: false,
        conflicts: [],
        message: 'Error checking availability'
      };
    }
  }

  // Get available rooms for date range
  async getAvailableRooms(checkIn, checkOut, roomType = null, capacity = null) {
    try {
      const cacheKey = `available_${checkIn}_${checkOut}_${roomType}_${capacity}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const token = this.getAuthToken();
      const params = new URLSearchParams({
        checkInDate: checkIn,
        checkOutDate: checkOut
      });

      if (roomType) params.append('roomType', roomType);
      if (capacity) params.append('capacity', capacity);

      const response = await fetch(`${this.apiBase}/api/rooms/available?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      const result = {
        success: response.ok,
        rooms: data.data?.rooms || [],
        total: data.data?.total || 0,
        message: data.message
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error getting available rooms:', error);
      return {
        success: false,
        rooms: [],
        total: 0,
        message: 'Error fetching available rooms'
      };
    }
  }

  // Get room occupancy calendar
  async getRoomOccupancyCalendar(startDate, endDate, roomIds = null) {
    try {
      const token = this.getAuthToken();
      const params = new URLSearchParams({
        startDate,
        endDate
      });

      if (roomIds && roomIds.length > 0) {
        params.append('roomIds', roomIds.join(','));
      }

      const response = await fetch(`${this.apiBase}/api/rooms/occupancy-calendar?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return {
        success: response.ok,
        calendar: data.data?.calendar || {},
        occupancyRate: data.data?.occupancyRate || 0,
        message: data.message
      };
    } catch (error) {
      console.error('Error getting occupancy calendar:', error);
      return {
        success: false,
        calendar: {},
        occupancyRate: 0,
        message: 'Error fetching occupancy calendar'
      };
    }
  }

  // Calculate optimal pricing based on availability
  async calculateOptimalPricing(roomId, checkIn, checkOut) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/rooms/${roomId}/optimal-pricing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkInDate: checkIn,
          checkOutDate: checkOut
        })
      });

      const data = await response.json();
      return {
        success: response.ok,
        basePrice: data.basePrice || 0,
        dynamicPrice: data.dynamicPrice || 0,
        discount: data.discount || 0,
        surge: data.surge || 0,
        factors: data.factors || {},
        message: data.message
      };
    } catch (error) {
      console.error('Error calculating optimal pricing:', error);
      return {
        success: false,
        basePrice: 0,
        dynamicPrice: 0,
        discount: 0,
        surge: 0,
        factors: {},
        message: 'Error calculating pricing'
      };
    }
  }

  // Check for overbooking opportunities
  async checkOverbookingOpportunity(checkIn, checkOut, roomType) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/reservations/overbooking-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkInDate: checkIn,
          checkOutDate: checkOut,
          roomType
        })
      });

      const data = await response.json();
      return {
        success: response.ok,
        canOverbook: data.canOverbook || false,
        riskLevel: data.riskLevel || 'high',
        maxOverbooking: data.maxOverbooking || 0,
        historicalData: data.historicalData || {},
        message: data.message
      };
    } catch (error) {
      console.error('Error checking overbooking opportunity:', error);
      return {
        success: false,
        canOverbook: false,
        riskLevel: 'high',
        maxOverbooking: 0,
        historicalData: {},
        message: 'Error analyzing overbooking'
      };
    }
  }

  // Get real-time availability updates
  async subscribeToAvailabilityUpdates(callback) {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll simulate with polling
    const pollInterval = 30000; // 30 seconds

    const poll = async () => {
      try {
        const token = this.getAuthToken();
        const response = await fetch(`${this.apiBase}/api/rooms/availability-updates`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          callback(data);
        }
      } catch (error) {
        console.error('Error polling availability updates:', error);
      }
    };

    // Initial poll
    poll();

    // Set up polling interval
    const intervalId = setInterval(poll, pollInterval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // Predict future availability
  async predictAvailability(startDate, endDate, roomType = null) {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/analytics/availability-prediction`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate,
          endDate,
          roomType
        })
      });

      const data = await response.json();
      return {
        success: response.ok,
        predictions: data.predictions || [],
        confidence: data.confidence || 0,
        factors: data.factors || {},
        message: data.message
      };
    } catch (error) {
      console.error('Error predicting availability:', error);
      return {
        success: false,
        predictions: [],
        confidence: 0,
        factors: {},
        message: 'Error predicting availability'
      };
    }
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Utility methods
  formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }

  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isDateRangeValid(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return start >= today && end > start;
  }

  // Get availability statistics
  async getAvailabilityStats(period = '30d') {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.apiBase}/api/analytics/availability-stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return {
        success: response.ok,
        stats: data.data || {},
        message: data.message
      };
    } catch (error) {
      console.error('Error getting availability stats:', error);
      return {
        success: false,
        stats: {},
        message: 'Error fetching availability statistics'
      };
    }
  }
}

// Create singleton instance
const roomAvailabilityService = new RoomAvailabilityService();

export default roomAvailabilityService;
