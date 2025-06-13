import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Car,
  Utensils,
  Wifi,
  Dumbbell,
  Plus,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const ServicesWidget = () => {
  const [services, setServices] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchServiceRequests();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/services?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setServices(data.data.services);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/service-requests?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setServiceRequests(data.data.requests);
      }
    } catch (error) {
      console.error('Fetch service requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (category) => {
    switch (category) {
      case 'room_service':
        return Coffee;
      case 'transportation':
        return Car;
      case 'restaurant':
        return Utensils;
      case 'fitness':
        return Dumbbell;
      default:
        return Wifi;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Services Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sysora-midnight">Available Services</h3>
          <button
            onClick={() => window.showToast && window.showToast('Add new service feature coming soon', 'info')}
            className="p-2 text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service) => {
              const Icon = getServiceIcon(service.category);
              return (
                <div key={service._id} className="flex items-center justify-between p-3 bg-sysora-light rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-sysora-mint" />
                    </div>
                    <div>
                      <p className="font-medium text-sysora-midnight">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sysora-midnight">${service.pricing.basePrice}</p>
                    <p className="text-xs text-gray-500">{service.pricing.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No services available</p>
            <button
              onClick={() => window.showToast && window.showToast('Add new service feature coming soon', 'info')}
              className="mt-2 text-sysora-mint hover:text-sysora-midnight transition-colors"
            >
              Add New Service
            </button>
          </div>
        )}
      </div>

      {/* Recent Service Requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sysora-midnight">Recent Service Requests</h3>
          <button
            onClick={() => window.showToast && window.showToast('View all service requests feature coming soon', 'info')}
            className="text-sm text-sysora-mint hover:text-sysora-midnight transition-colors"
          >
            View All
          </button>
        </div>

        {serviceRequests.length > 0 ? (
          <div className="space-y-3">
            {serviceRequests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-3 bg-sysora-light rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sysora-mint rounded-full"></div>
                  <div>
                    <p className="font-medium text-sysora-midnight">
                      {request.serviceId?.name || 'Service not specified'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.guestId?.firstName} {request.guestId?.lastName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(request.requestedDateTime).toLocaleDateString('en')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent service requests</p>
          </div>
        )}
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-sysora-midnight">{services.length}</p>
            </div>
            <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
              <Coffee className="w-6 h-6 text-sysora-mint" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Requests</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                {serviceRequests.filter(req => {
                  const today = new Date().toDateString();
                  const reqDate = new Date(req.requestedDateTime).toDateString();
                  return today === reqDate;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-sysora-mint" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Service Revenue</p>
              <p className="text-2xl font-bold text-sysora-midnight">
                ${serviceRequests.reduce((total, req) => total + (req.totalPrice || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-sysora-mint" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesWidget;
