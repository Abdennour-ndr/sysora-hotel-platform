import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is already authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      console.log('🔍 Checking authentication status...');

      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Check if token is still valid
        const isTokenValid = await authService.isTokenValid();
        
        if (isTokenValid) {
          // Load user and hotel data
          const [userData, hotelData] = await Promise.all([
            authService.getStoredUser(),
            authService.getStoredHotel(),
          ]);

          if (userData && hotelData) {
            setUser(userData);
            setHotel(hotelData);
            setIsAuthenticated(true);
            console.log('✅ User authenticated:', userData.fullName);
          } else {
            throw new Error('Missing user or hotel data');
          }
        } else {
          // Try to refresh token
          try {
            await authService.refreshToken();
            // Retry loading data after refresh
            await checkAuthStatus();
            return;
          } catch (refreshError) {
            console.log('❌ Token refresh failed, logging out');
            await authService.clearAuthData();
          }
        }
      } else {
        console.log('❌ User not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setAuthError(error.message);
      setIsAuthenticated(false);
      // Clear potentially corrupted data
      await authService.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (subdomain, email, password) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      console.log('🔐 Logging in user:', email);

      const response = await authService.login(subdomain, email, password);
      
      if (response.success) {
        setUser(response.user);
        setHotel(response.hotel);
        setIsAuthenticated(true);
        
        console.log('✅ Login successful:', response.user.fullName);
        return response;
      } else {
        throw new Error(response.message || 'فشل في تسجيل الدخول');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      console.log('🚪 Logging out user...');

      await authService.logout();
      
      setUser(null);
      setHotel(null);
      setIsAuthenticated(false);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setAuthError(error.message);
      
      // Force logout even if API call fails
      setUser(null);
      setHotel(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      await authService.updateUserData(userData);
      setUser(userData);
      console.log('✅ User data updated');
    } catch (error) {
      console.error('❌ Error updating user:', error);
      setAuthError(error.message);
    }
  }, []);

  // Update hotel data
  const updateHotel = useCallback(async (hotelData) => {
    try {
      await authService.updateHotelData(hotelData);
      setHotel(hotelData);
      console.log('✅ Hotel data updated');
    } catch (error) {
      console.error('❌ Error updating hotel:', error);
      setAuthError(error.message);
    }
  }, []);

  // Clear auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Demo login
  const demoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      console.log('🎭 Demo login...');

      const response = await authService.demoLogin();
      
      setUser(response.user);
      setHotel(response.hotel);
      setIsAuthenticated(true);
      
      console.log('✅ Demo login successful');
      return response;
    } catch (error) {
      console.error('❌ Demo login error:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user permissions
  const getUserPermissions = useCallback(() => {
    if (!user) return [];
    return user.permissions || [];
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    const permissions = getUserPermissions();
    return permissions.includes(permission) || permissions.includes('admin');
  }, [getUserPermissions]);

  // Get user role
  const getUserRole = useCallback(() => {
    if (!user) return null;
    return user.role || 'user';
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return getUserRole() === 'admin' || getUserRole() === 'owner';
  }, [getUserRole]);

  // Context value
  const value = {
    // State
    user,
    hotel,
    isLoading,
    isAuthenticated,
    authError,
    
    // Actions
    login,
    logout,
    updateUser,
    updateHotel,
    checkAuthStatus,
    clearAuthError,
    demoLogin,
    
    // Utilities
    getUserPermissions,
    hasPermission,
    getUserRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
