// Authentication utilities for handling API calls and token management

export const getAuthToken = () => {
  return localStorage.getItem('sysora_token');
};

export const getAuthHeaders = (token = null) => {
  const authToken = token || getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

export const isTokenValid = (token = null) => {
  const authToken = token || getAuthToken();
  
  if (!authToken) return false;
  
  try {
    // Basic token validation - check if it's not expired
    const payload = JSON.parse(atob(authToken.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

export const handleApiResponse = async (response) => {
  if (response.status === 401) {
    // Token expired or invalid
    console.log('Authentication failed - token may be expired');
    
    // Optionally redirect to login or refresh token
    // For now, we'll just return null to use mock data
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return null;
  }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  const requestOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, requestOptions);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};

// Mock data generators for fallback
export const generateMockRooms = () => [
  { 
    _id: '1', 
    number: '101', 
    type: 'standard', 
    status: 'available', 
    cleaningStatus: 'clean',
    floor: 1,
    rate: 120,
    capacity: 2,
    amenities: ['wifi', 'tv', 'coffee'],
    description: 'Comfortable standard room with city view',
    lastUpdated: new Date().toISOString()
  },
  { 
    _id: '2', 
    number: '102', 
    type: 'deluxe', 
    status: 'occupied', 
    cleaningStatus: 'dirty',
    floor: 1,
    rate: 180,
    capacity: 2,
    currentGuest: 'John Smith',
    amenities: ['wifi', 'tv', 'coffee', 'bath'],
    description: 'Spacious deluxe room with premium amenities',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  { 
    _id: '3', 
    number: '103', 
    type: 'suite', 
    status: 'cleaning', 
    cleaningStatus: 'in_progress',
    floor: 1,
    rate: 250,
    capacity: 4,
    amenities: ['wifi', 'tv', 'coffee', 'bath', 'safe'],
    description: 'Luxury suite with separate living area',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  { 
    _id: '4', 
    number: '104', 
    type: 'standard', 
    status: 'maintenance', 
    cleaningStatus: 'clean',
    floor: 1,
    rate: 120,
    capacity: 2,
    amenities: ['wifi', 'tv'],
    description: 'Standard room currently under maintenance',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  { 
    _id: '5', 
    number: '201', 
    type: 'deluxe', 
    status: 'available', 
    cleaningStatus: 'clean',
    floor: 2,
    rate: 180,
    capacity: 2,
    amenities: ['wifi', 'tv', 'coffee', 'bath'],
    description: 'Deluxe room on second floor with balcony',
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  { 
    _id: '6', 
    number: '202', 
    type: 'suite', 
    status: 'occupied', 
    cleaningStatus: 'clean',
    floor: 2,
    rate: 250,
    capacity: 4,
    currentGuest: 'Sarah Johnson',
    amenities: ['wifi', 'tv', 'coffee', 'bath', 'safe', 'parking'],
    description: 'Premium suite with panoramic view',
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  { 
    _id: '7', 
    number: '301', 
    type: 'presidential', 
    status: 'available', 
    cleaningStatus: 'clean',
    floor: 3,
    rate: 500,
    capacity: 6,
    amenities: ['wifi', 'tv', 'coffee', 'bath', 'safe', 'parking', 'phone'],
    description: 'Presidential suite with luxury amenities',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  { 
    _id: '8', 
    number: '302', 
    type: 'deluxe', 
    status: 'out_of_order', 
    cleaningStatus: 'dirty',
    floor: 3,
    rate: 180,
    capacity: 2,
    amenities: ['wifi', 'tv', 'coffee'],
    description: 'Deluxe room temporarily out of service',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const generateMockReservations = () => [
  {
    _id: '1',
    reservationNumber: 'RES001',
    guestId: { firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
    roomId: { number: '102', type: 'deluxe' },
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'checked_in',
    totalAmount: 360
  },
  {
    _id: '2',
    reservationNumber: 'RES002',
    guestId: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' },
    roomId: { number: '202', type: 'suite' },
    checkInDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'checked_in',
    totalAmount: 500
  },
  {
    _id: '3',
    reservationNumber: 'RES003',
    guestId: { firstName: 'Mike', lastName: 'Wilson', email: 'mike@example.com' },
    roomId: { number: '101', type: 'standard' },
    checkInDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    totalAmount: 240
  }
];

export const generateMockStats = (rooms, reservations) => {
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const availableRooms = rooms.filter(r => r.status === 'available');
  const totalRevenue = occupiedRooms.reduce((sum, room) => sum + (room.rate || 0), 0);
  
  return {
    occupancyRate: rooms.length > 0 ? Math.round((occupiedRooms.length / rooms.length) * 100) : 0,
    totalRevenue: totalRevenue,
    checkInsToday: reservations.filter(r => r.status === 'confirmed').length,
    checkOutsToday: reservations.filter(r => r.status === 'checked_in').length,
    availableRooms: availableRooms.length,
    totalRooms: rooms.length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    cleaningRooms: rooms.filter(r => r.status === 'cleaning').length
  };
};
