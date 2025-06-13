import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sysora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add hotel subdomain if available
    const hotelData = localStorage.getItem('sysora_hotel');
    if (hotelData) {
      try {
        const hotel = JSON.parse(hotelData);
        if (hotel.subdomain) {
          config.headers['X-Hotel-Subdomain'] = hotel.subdomain;
        }
      } catch (error) {
        console.error('Error parsing hotel data:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('sysora_token');
          localStorage.removeItem('sysora_user');
          localStorage.removeItem('sysora_hotel');
          window.location.href = '/';
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', data.errors || data.message);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error('API error:', data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
const apiService = {
  // Generic HTTP methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  
  // Authentication
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
    verify: () => api.get('/auth/verify')
  },
  
  // Hotels
  hotels: {
    get: () => api.get('/hotels'),
    getById: (id) => api.get(`/hotels/${id}`),
    create: (data) => api.post('/hotels', data),
    update: (id, data) => api.put(`/hotels/${id}`, data),
    delete: (id) => api.delete(`/hotels/${id}`),
    getSettings: () => api.get('/hotels/settings'),
    updateSettings: (data) => api.put('/hotels/settings', data),
    getProfile: () => api.get('/hotels/profile'),
    updateProfile: (data) => api.put('/hotels/profile', data)
  },
  
  // Rooms
  rooms: {
    getAll: (params = {}) => api.get('/rooms', { params }),
    getById: (id) => api.get(`/rooms/${id}`),
    create: (data) => api.post('/rooms', data),
    update: (id, data) => api.put(`/rooms/${id}`, data),
    delete: (id) => api.delete(`/rooms/${id}`),
    updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status })
  },
  
  // Guests
  guests: {
    getAll: (params = {}) => api.get('/guests', { params }),
    getById: (id) => api.get(`/guests/${id}`),
    create: (data) => api.post('/guests', data),
    update: (id, data) => api.put(`/guests/${id}`, data),
    delete: (id) => api.delete(`/guests/${id}`)
  },
  
  // Reservations
  reservations: {
    getAll: (params = {}) => api.get('/reservations', { params }),
    getById: (id) => api.get(`/reservations/${id}`),
    create: (data) => api.post('/reservations', data),
    update: (id, data) => api.put(`/reservations/${id}`, data),
    delete: (id) => api.delete(`/reservations/${id}`),
    checkIn: (id) => api.patch(`/reservations/${id}/check-in`),
    checkOut: (id) => api.patch(`/reservations/${id}/check-out`),
    cancel: (id) => api.patch(`/reservations/${id}/cancel`)
  },
  
  // Payments
  payments: {
    getAll: (params = {}) => api.get('/payments', { params }),
    getById: (id) => api.get(`/payments/${id}`),
    create: (data) => api.post('/payments', data),
    update: (id, data) => api.put(`/payments/${id}`, data),
    delete: (id) => api.delete(`/payments/${id}`)
  },
  
  // Services
  services: {
    getAll: (params = {}) => api.get('/services', { params }),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`)
  },
  
  // Service Requests
  serviceRequests: {
    getAll: (params = {}) => api.get('/service-requests', { params }),
    getById: (id) => api.get(`/service-requests/${id}`),
    create: (data) => api.post('/service-requests', data),
    update: (id, data) => api.put(`/service-requests/${id}`, data),
    updateStatus: (id, status) => api.patch(`/service-requests/${id}/status`, { status })
  },
  
  // Customization
  customization: {
    get: () => api.get('/customization'),
    update: (data) => api.put('/customization', data),
    reset: () => api.post('/customization/reset')
  },
  
  // Pricing
  pricing: {
    getPlans: () => api.get('/pricing/plans'),
    getFeatures: () => api.get('/pricing/features'),
    subscribe: (data) => api.post('/pricing/subscribe', data),
    updateSubscription: (data) => api.put('/pricing/subscription', data)
  },
  
  // Form Configuration
  formConfig: {
    getAll: () => api.get('/form-config'),
    getByType: (formType) => api.get(`/form-config/${formType}`),
    create: (data) => api.post('/form-config', data),
    update: (id, data) => api.put(`/form-config/${id}`, data),
    delete: (id) => api.delete(`/form-config/${id}`),
    reset: (formType) => api.post(`/form-config/${formType}/reset`),
    validate: (formType, formData) => api.post(`/form-config/${formType}/validate`, { formData }),
    getFieldOptions: (formType, fieldKey) => api.get(`/form-config/${formType}/field/${fieldKey}/options`)
  },


  
  // Admin
  admin: {
    getStats: () => api.get('/admin/stats'),
    getHotels: (params = {}) => api.get('/admin/hotels', { params }),
    getUsers: (params = {}) => api.get('/admin/users', { params }),
    getSubscriptions: (params = {}) => api.get('/admin/subscriptions', { params }),
    updateHotelStatus: (id, status) => api.patch(`/admin/hotels/${id}/status`, { status }),
    updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role })
  },
  
  // Upload
  upload: {
    image: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    document: (file) => {
      const formData = new FormData();
      formData.append('document', file);
      return api.post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  }
};

export default apiService;
