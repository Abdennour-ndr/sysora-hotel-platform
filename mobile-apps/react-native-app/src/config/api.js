import { Platform } from 'react-native';

// API Configuration
const API_CONFIG = {
  // Base URLs for different environments
  BASE_URL: __DEV__ 
    ? Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000/api'  // Android emulator
      : 'http://localhost:3000/api'  // iOS simulator
    : 'https://api.sysora.com/api',   // Production
  
  // Request timeout
  TIMEOUT: 15000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': '1.0.0',
    'X-Platform': Platform.OS,
  },
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Cache configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    NOTIFICATIONS: '/dashboard/notifications',
  },
  
  // Rooms
  ROOMS: {
    LIST: '/rooms',
    DETAILS: (id) => `/rooms/${id}`,
    CREATE: '/rooms',
    UPDATE: (id) => `/rooms/${id}`,
    DELETE: (id) => `/rooms/${id}`,
    UPDATE_STATUS: (id) => `/rooms/${id}/status`,
    IMAGES: (id) => `/rooms/${id}/images`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: (id) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
    CHECKIN: (id) => `/bookings/${id}/checkin`,
    CHECKOUT: (id) => `/bookings/${id}/checkout`,
  },
  
  // Guests
  GUESTS: {
    LIST: '/guests',
    DETAILS: (id) => `/guests/${id}`,
    CREATE: '/guests',
    UPDATE: (id) => `/guests/${id}`,
    HISTORY: (id) => `/guests/${id}/history`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    DETAILS: (id) => `/payments/${id}`,
    INVOICE: (id) => `/payments/${id}/invoice`,
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    REQUEST: '/services/request',
    UPDATE_STATUS: (id) => `/services/${id}/status`,
  },
  
  // Reports
  REPORTS: {
    FINANCIAL: '/reports/financial',
    OCCUPANCY: '/reports/occupancy',
    REVENUE: '/reports/revenue',
    EXPORT: '/reports/export',
  },
  
  // Settings
  SETTINGS: {
    HOTEL: '/settings/hotel',
    USER: '/settings/user',
    NOTIFICATIONS: '/settings/notifications',
  },
  
  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
  },
};

export default API_CONFIG;
