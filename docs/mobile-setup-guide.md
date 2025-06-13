# Sysora Mobile App Setup Guide

## 🚀 Quick Setup

### 1. Create React Native Project
```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init SysoraHotelApp
cd SysoraHotelApp

# Install essential dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-vector-icons
npm install react-native-push-notification
npm install @react-native-community/netinfo
npm install react-native-image-picker
```

### 2. iOS Setup
```bash
cd ios && pod install && cd ..
```

### 3. Android Setup
```bash
# Add to android/app/build.gradle
apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle")
```

## 📱 Project Structure

```
SysoraHotelApp/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── contexts/
│   ├── utils/
│   └── navigation/
├── android/
├── ios/
└── assets/
```

## 🔧 Configuration Files

### API Configuration
```javascript
// src/config/api.js
const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000/api' 
    : 'https://api.sysora.com/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG;
```

### Theme Configuration
```javascript
// src/config/theme.js
export const theme = {
  colors: {
    primary: '#2EC4B6',      // sysora-mint
    secondary: '#002D5B',    // sysora-midnight
    background: '#F9FAFB',   // sysora-light
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E5E7EB'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
    small: { fontSize: 12, fontWeight: 'normal', lineHeight: 16 }
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }
};
```

## 🔐 Authentication Service

```javascript
// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

class AuthService {
  async login(subdomain, email, password) {
    try {
      const response = await apiService.post('/auth/login', {
        subdomain,
        email,
        password
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('hotelData', JSON.stringify(response.data.hotel));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await AsyncStorage.multiRemove(['userToken', 'userData', 'hotelData']);
  }

  async getStoredToken() {
    return await AsyncStorage.getItem('userToken');
  }

  async getStoredUser() {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  async getStoredHotel() {
    const hotelData = await AsyncStorage.getItem('hotelData');
    return hotelData ? JSON.parse(hotelData) : null;
  }
}

export default new AuthService();
```

## 🌐 API Service

```javascript
// src/services/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - logout user
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  async handleUnauthorized() {
    await AsyncStorage.multiRemove(['userToken', 'userData', 'hotelData']);
    // Navigate to login screen
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.api.get('/dashboard/stats');
  }

  // Room APIs
  async getRooms() {
    return this.api.get('/rooms');
  }

  async updateRoomStatus(roomId, status) {
    return this.api.put(`/rooms/${roomId}/status`, { status });
  }

  // Booking APIs
  async getBookings(filters = {}) {
    return this.api.get('/bookings', { params: filters });
  }

  async createBooking(bookingData) {
    return this.api.post('/bookings', bookingData);
  }

  async updateBooking(bookingId, data) {
    return this.api.put(`/bookings/${bookingId}`, data);
  }

  // Generic methods
  async get(url, config = {}) {
    return this.api.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.api.delete(url, config);
  }
}

export default new ApiService();
```

## 📱 Run Commands

```bash
# Development
npm run android    # Run on Android
npm run ios        # Run on iOS

# Build
npm run build:android    # Build Android APK
npm run build:ios        # Build iOS

# Clean
npm run clean
cd android && ./gradlew clean && cd ..
cd ios && xcodebuild clean && cd ..
```

## 🔧 Next Steps

1. **Setup Navigation**: Create navigation structure
2. **Create Screens**: Login, Dashboard, Rooms, Bookings
3. **Implement Components**: Reusable UI components
4. **Add State Management**: Context or Redux
5. **Test & Debug**: On real devices
6. **Build & Deploy**: To app stores
```
