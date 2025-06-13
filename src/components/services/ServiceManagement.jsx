import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Settings,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Star,
  TrendingUp,
  Coffee,
  Car,
  Utensils,
  Wifi,
  Dumbbell,
  Wrench,
  Shirt,
  Bell,
  Home,
  Building
} from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    revenue: 0,
    requests: 0
  });

  // Service categories with icons
  const serviceCategories = [
    { id: 'room_service', name: 'Room Service', icon: Coffee, color: 'bg-orange-500' },
    { id: 'laundry', name: 'Laundry', icon: Shirt, color: 'bg-blue-500' },
    { id: 'spa', name: 'Spa & Wellness', icon: Star, color: 'bg-pink-500' },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils, color: 'bg-green-500' },
    { id: 'transportation', name: 'Transportation', icon: Car, color: 'bg-purple-500' },
    { id: 'entertainment', name: 'Entertainment', icon: Wifi, color: 'bg-indigo-500' },
    { id: 'business', name: 'Business', icon: Building, color: 'bg-gray-500' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'bg-red-500' },
    { id: 'concierge', name: 'Concierge', icon: Bell, color: 'bg-yellow-500' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'bg-teal-500' },
    { id: 'housekeeping', name: 'Housekeeping', icon: Home, color: 'bg-cyan-500' },
    { id: 'other', name: 'Other', icon: Settings, color: 'bg-slate-500' }
  ];

  useEffect(() => {
    loadServices();
    loadStats();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory, selectedStatus]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setServices(data.data.services || []);
      } else {
        // Fallback to demo data
        setServices(generateDemoServices());
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(generateDemoServices());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data.data);
      } else {
        // Fallback to calculated stats
        calculateStats();
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      calculateStats();
    }
  };

  const generateDemoServices = () => {
    return [
      {
        _id: '1',
        name: 'Room Service - Breakfast',
        nameAr: 'خدمة الغرف - الإفطار',
        description: 'Fresh breakfast delivered to your room',
        category: 'room_service',
        pricing: { basePrice: 2500, type: 'per_order' },
        availability: { isActive: true },
        stats: { totalBookings: 156, averageRating: 4.8 },
        estimatedDuration: 30,
        location: 'in_room',
        featured: true
      },
      {
        _id: '2',
        name: 'Laundry Service',
        nameAr: 'خدمة الغسيل',
        description: 'Professional laundry and dry cleaning',
        category: 'laundry',
        pricing: { basePrice: 1500, type: 'per_item' },
        availability: { isActive: true },
        stats: { totalBookings: 89, averageRating: 4.6 },
        estimatedDuration: 120,
        location: 'external',
        featured: false
      },
      {
        _id: '3',
        name: 'Airport Transfer',
        nameAr: 'نقل المطار',
        description: 'Comfortable transfer to/from airport',
        category: 'transportation',
        pricing: { basePrice: 5000, type: 'per_trip' },
        availability: { isActive: true },
        stats: { totalBookings: 234, averageRating: 4.9 },
        estimatedDuration: 60,
        location: 'external',
        featured: true
      },
      {
        _id: '4',
        name: 'Spa Massage',
        nameAr: 'تدليك السبا',
        description: 'Relaxing full body massage',
        category: 'spa',
        pricing: { basePrice: 8000, type: 'per_session' },
        availability: { isActive: true },
        stats: { totalBookings: 67, averageRating: 4.7 },
        estimatedDuration: 90,
        location: 'spa',
        featured: true
      },
      {
        _id: '5',
        name: 'Room Cleaning',
        nameAr: 'تنظيف الغرفة',
        description: 'Professional room cleaning service',
        category: 'housekeeping',
        pricing: { basePrice: 1000, type: 'per_room' },
        availability: { isActive: true },
        stats: { totalBookings: 445, averageRating: 4.5 },
        estimatedDuration: 45,
        location: 'in_room',
        featured: false
      }
    ];
  };

  const calculateStats = () => {
    const total = services.length;
    const active = services.filter(s => s.availability?.isActive).length;
    const revenue = services.reduce((sum, s) => sum + (s.stats?.totalRevenue || s.pricing?.basePrice * s.stats?.totalBookings || 0), 0);
    const requests = services.reduce((sum, s) => sum + (s.stats?.totalBookings || 0), 0);

    setStats({ total, active, revenue, requests });
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(service => service.availability?.isActive);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(service => !service.availability?.isActive);
      } else if (selectedStatus === 'featured') {
        filtered = filtered.filter(service => service.featured);
      }
    }

    setFilteredServices(filtered);
  };

  const getCategoryInfo = (categoryId) => {
    return serviceCategories.find(cat => cat.id === categoryId) || serviceCategories[serviceCategories.length - 1];
  };

  const getLocationIcon = (location) => {
    switch (location) {
      case 'in_room': return Home;
      case 'lobby': return Building;
      case 'restaurant': return Utensils;
      case 'spa': return Star;
      case 'gym': return Dumbbell;
      case 'external': return Car;
      default: return MapPin;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setShowAddModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const token = localStorage.getItem('sysora_token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setServices(services.filter(s => s._id !== serviceId));
          window.showToast && window.showToast('Service deleted successfully', 'success');
        } else {
          window.showToast && window.showToast('Failed to delete service', 'error');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        window.showToast && window.showToast('Error deleting service', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Service Management</h2>
              <p className="text-blue-100">Manage all hotel services and offerings</p>
            </div>
          </div>
          
          <button
            onClick={handleAddService}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-purple-600">{stats.requests}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Service Revenue</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {serviceCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const categoryInfo = getCategoryInfo(service.category);
          const CategoryIcon = categoryInfo.icon;
          const LocationIcon = getLocationIcon(service.location);
          
          return (
            <div key={service._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Service Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${categoryInfo.color} rounded-2xl flex items-center justify-center`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{categoryInfo.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {service.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      service.availability?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.availability?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <LocationIcon className="w-4 h-4" />
                    <span className="capitalize">{service.location?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.estimatedDuration} min</span>
                  </div>
                </div>
              </div>
              
              {/* Service Stats */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(service.pricing?.basePrice)}</p>
                    <p className="text-xs text-gray-500">{service.pricing?.type?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{service.stats?.totalBookings || 0}</p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <p className="text-lg font-bold text-gray-900">{service.stats?.averageRating || 0}</p>
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => window.showToast && window.showToast('View service details feature coming soon', 'info')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600 mb-6">No services match your current filters.</p>
          <button
            onClick={handleAddService}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Service
          </button>
        </div>
      )}

      {/* Add/Edit Service Modals would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
            <p className="text-gray-600 mb-4">Service creation form will be implemented here.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  window.showToast && window.showToast('Service creation feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Service: {selectedService.name}</h3>
            <p className="text-gray-600 mb-4">Service editing form will be implemented here.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  window.showToast && window.showToast('Service editing feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
