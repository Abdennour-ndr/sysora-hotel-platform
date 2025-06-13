// Hotel subdomain utilities

// Extract hotel subdomain from URL
export const getHotelSubdomain = () => {
  const hostname = window.location.hostname;
  
  // For development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for hotel parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('hotel');
  }
  
  // For production (subdomain.sysora.com)
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[1] === 'sysora') {
    return parts[0];
  }
  
  return null;
};

// Generate hotel-specific URL
export const generateHotelUrl = (hotelSlug, path = '') => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:3000';
  
  if (baseUrl.includes('localhost')) {
    // For development
    return `${baseUrl}${path}?hotel=${hotelSlug}`;
  } else {
    // For production
    return `https://${hotelSlug}.sysora.com${path}`;
  }
};

// Check if current URL is hotel-specific
export const isHotelSpecificUrl = () => {
  return getHotelSubdomain() !== null;
};

// Get hotel info from subdomain/parameter
export const getHotelFromUrl = async () => {
  const hotelSlug = getHotelSubdomain();
  
  if (!hotelSlug) {
    return null;
  }
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/hotels/by-slug/${hotelSlug}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.hotel;
    }
  } catch (error) {
    console.error('Error fetching hotel by slug:', error);
  }
  
  return null;
};

// Redirect to hotel-specific login
export const redirectToHotelLogin = (hotelSlug) => {
  const loginUrl = generateHotelUrl(hotelSlug, '/login');
  window.location.href = loginUrl;
};

// Redirect to hotel dashboard
export const redirectToHotelDashboard = (hotelSlug) => {
  const dashboardUrl = generateHotelUrl(hotelSlug, '/dashboard');
  window.location.href = dashboardUrl;
};

// Get hotel-specific storage key
export const getHotelStorageKey = (key, hotelSlug) => {
  return hotelSlug ? `${hotelSlug}_${key}` : key;
};

// Hotel-specific token management
export const getHotelToken = (hotelSlug) => {
  const key = getHotelStorageKey('sysora_token', hotelSlug);
  return localStorage.getItem(key);
};

export const setHotelToken = (token, hotelSlug) => {
  const key = getHotelStorageKey('sysora_token', hotelSlug);
  localStorage.setItem(key, token);
};

export const removeHotelToken = (hotelSlug) => {
  const key = getHotelStorageKey('sysora_token', hotelSlug);
  localStorage.removeItem(key);
};

// Hotel-specific user data management
export const getHotelUserData = (hotelSlug) => {
  const key = getHotelStorageKey('sysora_user', hotelSlug);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setHotelUserData = (userData, hotelSlug) => {
  const key = getHotelStorageKey('sysora_user', hotelSlug);
  localStorage.setItem(key, JSON.stringify(userData));
};

export const removeHotelUserData = (hotelSlug) => {
  const key = getHotelStorageKey('sysora_user', hotelSlug);
  localStorage.removeItem(key);
};

// Check if user has access to specific hotel
export const checkHotelAccess = async (hotelSlug) => {
  const token = getHotelToken(hotelSlug);
  
  if (!token) {
    return false;
  }
  
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${baseUrl}/api/auth/verify-hotel-access`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hotelSlug })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking hotel access:', error);
    return false;
  }
};

// Hotel context for React components
export const createHotelContext = () => {
  const hotelSlug = getHotelSubdomain();
  
  return {
    hotelSlug,
    isHotelSpecific: !!hotelSlug,
    getToken: () => getHotelToken(hotelSlug),
    setToken: (token) => setHotelToken(token, hotelSlug),
    removeToken: () => removeHotelToken(hotelSlug),
    getUserData: () => getHotelUserData(hotelSlug),
    setUserData: (data) => setHotelUserData(data, hotelSlug),
    removeUserData: () => removeHotelUserData(hotelSlug),
    generateUrl: (path) => generateHotelUrl(hotelSlug, path),
    redirectToLogin: () => redirectToHotelLogin(hotelSlug),
    redirectToDashboard: () => redirectToHotelDashboard(hotelSlug)
  };
};

export default {
  getHotelSubdomain,
  generateHotelUrl,
  isHotelSpecificUrl,
  getHotelFromUrl,
  redirectToHotelLogin,
  redirectToHotelDashboard,
  getHotelToken,
  setHotelToken,
  removeHotelToken,
  checkHotelAccess,
  createHotelContext
};
