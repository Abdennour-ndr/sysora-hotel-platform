import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

class AuthService {
  // Storage keys
  static STORAGE_KEYS = {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData',
    HOTEL_DATA: 'hotelData',
    REFRESH_TOKEN: 'refreshToken',
    LAST_LOGIN: 'lastLogin',
  };

  // Login user
  async login(subdomain, email, password) {
    try {
      console.log('🔐 Attempting login for:', email, 'at', subdomain);
      
      const response = await apiService.login(subdomain, email, password);
      
      if (response.success && response.token) {
        // Store authentication data
        await this.storeAuthData(response);
        
        console.log('✅ Login successful for user:', response.user?.fullName);
        return response;
      } else {
        throw new Error(response.message || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw this.formatAuthError(error);
    }
  }

  // Store authentication data
  async storeAuthData(authData) {
    try {
      const promises = [
        AsyncStorage.setItem(AuthService.STORAGE_KEYS.USER_TOKEN, authData.token),
        AsyncStorage.setItem(AuthService.STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user)),
        AsyncStorage.setItem(AuthService.STORAGE_KEYS.HOTEL_DATA, JSON.stringify(authData.hotel)),
        AsyncStorage.setItem(AuthService.STORAGE_KEYS.LAST_LOGIN, new Date().toISOString()),
      ];

      if (authData.refreshToken) {
        promises.push(
          AsyncStorage.setItem(AuthService.STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken)
        );
      }

      await Promise.all(promises);
      console.log('💾 Auth data stored successfully');
    } catch (error) {
      console.error('❌ Error storing auth data:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      console.log('🚪 Logging out user...');
      
      // Call logout API
      await apiService.logout();
      
      // Clear all stored data
      await this.clearAuthData();
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Clear data anyway
      await this.clearAuthData();
      throw error;
    }
  }

  // Clear authentication data
  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        AuthService.STORAGE_KEYS.USER_TOKEN,
        AuthService.STORAGE_KEYS.USER_DATA,
        AuthService.STORAGE_KEYS.HOTEL_DATA,
        AuthService.STORAGE_KEYS.REFRESH_TOKEN,
        AuthService.STORAGE_KEYS.LAST_LOGIN,
      ]);
      console.log('🗑️ Auth data cleared');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  }

  // Get stored token
  async getStoredToken() {
    try {
      return await AsyncStorage.getItem(AuthService.STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('❌ Error getting stored token:', error);
      return null;
    }
  }

  // Get stored user data
  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem(AuthService.STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting stored user:', error);
      return null;
    }
  }

  // Get stored hotel data
  async getStoredHotel() {
    try {
      const hotelData = await AsyncStorage.getItem(AuthService.STORAGE_KEYS.HOTEL_DATA);
      return hotelData ? JSON.parse(hotelData) : null;
    } catch (error) {
      console.error('❌ Error getting stored hotel:', error);
      return null;
    }
  }

  // Get stored refresh token
  async getStoredRefreshToken() {
    try {
      return await AsyncStorage.getItem(AuthService.STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ Error getting stored refresh token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await this.getStoredToken();
      const user = await this.getStoredUser();
      const hotel = await this.getStoredHotel();
      
      return !!(token && user && hotel);
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  }

  // Refresh authentication token
  async refreshToken() {
    try {
      console.log('🔄 Refreshing token...');
      
      const refreshToken = await this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.refreshToken();
      
      if (response.success && response.token) {
        await AsyncStorage.setItem(AuthService.STORAGE_KEYS.USER_TOKEN, response.token);
        
        if (response.refreshToken) {
          await AsyncStorage.setItem(AuthService.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
        }
        
        console.log('✅ Token refreshed successfully');
        return response.token;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  // Update user data
  async updateUserData(userData) {
    try {
      await AsyncStorage.setItem(AuthService.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('✅ User data updated');
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw error;
    }
  }

  // Update hotel data
  async updateHotelData(hotelData) {
    try {
      await AsyncStorage.setItem(AuthService.STORAGE_KEYS.HOTEL_DATA, JSON.stringify(hotelData));
      console.log('✅ Hotel data updated');
    } catch (error) {
      console.error('❌ Error updating hotel data:', error);
      throw error;
    }
  }

  // Get last login time
  async getLastLogin() {
    try {
      const lastLogin = await AsyncStorage.getItem(AuthService.STORAGE_KEYS.LAST_LOGIN);
      return lastLogin ? new Date(lastLogin) : null;
    } catch (error) {
      console.error('❌ Error getting last login:', error);
      return null;
    }
  }

  // Validate token expiry
  async isTokenValid() {
    try {
      const token = await this.getStoredToken();
      if (!token) return false;

      // Decode JWT token to check expiry (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('❌ Error validating token:', error);
      return false;
    }
  }

  // Format authentication errors
  formatAuthError(error) {
    if (error.type === 'API_ERROR') {
      switch (error.status) {
        case 401:
          return new Error('بيانات تسجيل الدخول غير صحيحة');
        case 403:
          return new Error('ليس لديك صلاحية للوصول');
        case 404:
          return new Error('الفندق غير موجود');
        case 429:
          return new Error('تم تجاوز عدد المحاولات المسموحة');
        default:
          return new Error(error.message || 'حدث خطأ في تسجيل الدخول');
      }
    } else if (error.type === 'NETWORK_ERROR') {
      return new Error('فشل في الاتصال. تحقق من اتصال الإنترنت');
    } else {
      return new Error(error.message || 'حدث خطأ غير متوقع');
    }
  }

  // Demo login (for testing)
  async demoLogin() {
    return this.login('demo', 'admin@demo.com', 'demo123');
  }
}

export default new AuthService();
