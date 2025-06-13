import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API_CONFIG, { API_ENDPOINTS } from '../config/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
    this.setupNetworkMonitoring();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // Add auth token
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add hotel subdomain
        const hotelData = await AsyncStorage.getItem('hotelData');
        if (hotelData) {
          const hotel = JSON.parse(hotelData);
          config.headers['X-Hotel-Subdomain'] = hotel.subdomain;
        }

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      async (error) => {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
        
        // Handle different error types
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        } else if (error.response?.status >= 500) {
          await this.handleServerError(error);
        } else if (!error.response) {
          await this.handleNetworkError(error);
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  setupNetworkMonitoring() {
    NetInfo.addEventListener(state => {
      console.log('📶 Network State:', state.isConnected ? 'Connected' : 'Disconnected');
      this.isOnline = state.isConnected;
    });
  }

  async handleUnauthorized() {
    console.log('🔐 Handling unauthorized access...');
    await AsyncStorage.multiRemove(['userToken', 'userData', 'hotelData']);
    // Navigation will be handled by AuthContext
  }

  async handleServerError(error) {
    console.log('🔧 Server error occurred:', error.response?.status);
    // Could implement retry logic here
  }

  async handleNetworkError(error) {
    console.log('📡 Network error occurred:', error.message);
    // Could implement offline queue here
  }

  formatError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        type: 'API_ERROR',
        status: error.response.status,
        message: error.response.data?.message || 'حدث خطأ في الخادم',
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        type: 'NETWORK_ERROR',
        message: 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.',
      };
    } else {
      // Other error
      return {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'حدث خطأ غير متوقع',
      };
    }
  }

  // Generic HTTP methods
  async get(url, config = {}) {
    return this.api.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  async patch(url, data, config = {}) {
    return this.api.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config);
  }

  // Authentication APIs
  async login(subdomain, email, password) {
    const response = await this.post(API_ENDPOINTS.AUTH.LOGIN, {
      subdomain,
      email,
      password,
    });
    return response.data;
  }

  async logout() {
    try {
      await this.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.log('Logout API error (continuing anyway):', error);
    }
    await AsyncStorage.multiRemove(['userToken', 'userData', 'hotelData']);
  }

  async refreshToken() {
    const response = await this.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  }

  // Dashboard APIs
  async getDashboardStats() {
    const response = await this.get(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  }

  async getTodayActivity() {
    const response = await this.get(API_ENDPOINTS.DASHBOARD.ACTIVITY);
    return response.data;
  }

  async getNotifications() {
    const response = await this.get(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS);
    return response.data;
  }

  // Room APIs
  async getRooms(filters = {}) {
    const response = await this.get(API_ENDPOINTS.ROOMS.LIST, { params: filters });
    return response.data;
  }

  async getRoomById(roomId) {
    const response = await this.get(API_ENDPOINTS.ROOMS.DETAILS(roomId));
    return response.data;
  }

  async createRoom(roomData) {
    const response = await this.post(API_ENDPOINTS.ROOMS.CREATE, roomData);
    return response.data;
  }

  async updateRoom(roomId, roomData) {
    const response = await this.put(API_ENDPOINTS.ROOMS.UPDATE(roomId), roomData);
    return response.data;
  }

  async updateRoomStatus(roomId, status) {
    const response = await this.patch(API_ENDPOINTS.ROOMS.UPDATE_STATUS(roomId), { status });
    return response.data;
  }

  async deleteRoom(roomId) {
    const response = await this.delete(API_ENDPOINTS.ROOMS.DELETE(roomId));
    return response.data;
  }

  // Booking APIs
  async getBookings(filters = {}) {
    const response = await this.get(API_ENDPOINTS.BOOKINGS.LIST, { params: filters });
    return response.data;
  }

  async getBookingById(bookingId) {
    const response = await this.get(API_ENDPOINTS.BOOKINGS.DETAILS(bookingId));
    return response.data;
  }

  async createBooking(bookingData) {
    const response = await this.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
    return response.data;
  }

  async updateBooking(bookingId, bookingData) {
    const response = await this.put(API_ENDPOINTS.BOOKINGS.UPDATE(bookingId), bookingData);
    return response.data;
  }

  async cancelBooking(bookingId, reason) {
    const response = await this.patch(API_ENDPOINTS.BOOKINGS.CANCEL(bookingId), { reason });
    return response.data;
  }

  async checkIn(bookingId) {
    const response = await this.patch(API_ENDPOINTS.BOOKINGS.CHECKIN(bookingId));
    return response.data;
  }

  async checkOut(bookingId) {
    const response = await this.patch(API_ENDPOINTS.BOOKINGS.CHECKOUT(bookingId));
    return response.data;
  }

  // Guest APIs
  async getGuests(filters = {}) {
    const response = await this.get(API_ENDPOINTS.GUESTS.LIST, { params: filters });
    return response.data;
  }

  async getGuestById(guestId) {
    const response = await this.get(API_ENDPOINTS.GUESTS.DETAILS(guestId));
    return response.data;
  }

  async createGuest(guestData) {
    const response = await this.post(API_ENDPOINTS.GUESTS.CREATE, guestData);
    return response.data;
  }

  async updateGuest(guestId, guestData) {
    const response = await this.put(API_ENDPOINTS.GUESTS.UPDATE(guestId), guestData);
    return response.data;
  }

  // Payment APIs
  async getPayments(filters = {}) {
    const response = await this.get(API_ENDPOINTS.PAYMENTS.LIST, { params: filters });
    return response.data;
  }

  async createPayment(paymentData) {
    const response = await this.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
    return response.data;
  }

  // Service APIs
  async getServices() {
    const response = await this.get(API_ENDPOINTS.SERVICES.LIST);
    return response.data;
  }

  async requestService(serviceData) {
    const response = await this.post(API_ENDPOINTS.SERVICES.REQUEST, serviceData);
    return response.data;
  }

  async updateServiceStatus(serviceId, status) {
    const response = await this.patch(API_ENDPOINTS.SERVICES.UPDATE_STATUS(serviceId), { status });
    return response.data;
  }

  // Report APIs
  async getFinancialReport(period) {
    const response = await this.get(API_ENDPOINTS.REPORTS.FINANCIAL, { params: { period } });
    return response.data;
  }

  async getOccupancyReport(period) {
    const response = await this.get(API_ENDPOINTS.REPORTS.OCCUPANCY, { params: { period } });
    return response.data;
  }

  // Upload APIs
  async uploadImage(imageData) {
    const formData = new FormData();
    formData.append('image', imageData);
    
    const response = await this.post(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ApiService();
