import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Check, Clock, AlertCircle } from 'lucide-react';

const PlanEditorModal = ({ isOpen, onClose, plan, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    tagline: '',
    pricing: {
      monthly: { amount: 0, currency: 'USD' },
      yearly: { amount: 0, currency: 'USD', discount: 0 }
    },
    trial: {
      enabled: true,
      duration: 3,
      requiresCreditCard: false
    },
    promo: {
      enabled: false,
      price: 1,
      duration: 90,
      description: '$1 for 3 months',
      eligibility: 'first_time_only'
    },
    features: [],
    limits: {
      users: -1,
      hotels: 1,
      rooms: -1,
      reservations: -1,
      storage: 5000,
      apiCalls: 10000
    },
    display: {
      isVisible: true,
      isPopular: false,
      isFeatured: false,
      order: 0,
      color: '#3B82F6',
      icon: ''
    }
  });

  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
    fetchFeatures();
  }, [plan]);

  const fetchFeatures = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/pricing/features`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setAvailableFeatures(data.data);
      }
    } catch (error) {
      console.error('Fetch features error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }
      }));
    } else if (keys.length === 3) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: {
            ...prev[keys[0]][keys[1]],
            [keys[2]]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
          }
        }
      }));
    }
  };

  const handleFeatureToggle = (featureKey) => {
    setFormData(prev => {
      const existingFeature = prev.features.find(f => f.featureKey === featureKey);
      
      if (existingFeature) {
        return {
          ...prev,
          features: prev.features.filter(f => f.featureKey !== featureKey)
        };
      } else {
        return {
          ...prev,
          features: [...prev.features, {
            featureKey,
            included: true,
            limit: -1,
            notes: ''
          }]
        };
      }
    });
  };

  const handleFeatureLimitChange = (featureKey, limit) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(f => 
        f.featureKey === featureKey 
          ? { ...f, limit: Number(limit) }
          : f
      )
    }));
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('sysora_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const url = plan 
        ? `${baseUrl}/api/pricing/admin/plans/${plan._id}`
        : `${baseUrl}/api/pricing/admin/plans`;
      
      const method = plan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        window.showToast && window.showToast(
          plan ? 'تم تحديث الخطة بنجاح' : 'تم إنشاء الخطة بنجاح', 
          'success'
        );
        onSave(data.data);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Save plan error:', error);
      window.showToast && window.showToast('فشل في حفظ الخطة', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const statusIcons = {
    available: Check,
    soon: Clock,
    planned: AlertCircle
  };

  const statusColors = {
    available: 'text-green-600',
    soon: 'text-yellow-600',
    planned: 'text-gray-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {plan ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price ($)</label>
                <input
                  type="number"
                  name="pricing.monthly.amount"
                  value={formData.pricing.monthly.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Price ($)</label>
                <input
                  type="number"
                  name="pricing.yearly.amount"
                  value={formData.pricing.yearly.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Trial Settings */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trial Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="trial.enabled"
                  checked={formData.trial.enabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enable free trial</label>
              </div>
              {formData.trial.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trial Duration (days)</label>
                    <input
                      type="number"
                      name="trial.duration"
                      value={formData.trial.duration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="trial.requiresCreditCard"
                      checked={formData.trial.requiresCreditCard}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Require credit card</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {availableFeatures.map((feature) => {
                const isIncluded = formData.features.some(f => f.featureKey === feature.key);
                const includedFeature = formData.features.find(f => f.featureKey === feature.key);
                const StatusIcon = statusIcons[feature.status];
                
                return (
                  <div key={feature.key} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isIncluded}
                        onChange={() => handleFeatureToggle(feature.key)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                          <StatusIcon className={`w-4 h-4 ${statusColors[feature.status]}`} />
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            feature.status === 'available' ? 'bg-green-100 text-green-800' :
                            feature.status === 'soon' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {feature.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                    {isIncluded && (
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-600">Limit:</label>
                        <input
                          type="number"
                          value={includedFeature?.limit || -1}
                          onChange={(e) => handleFeatureLimitChange(feature.key, e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="-1 = unlimited"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="display.isVisible"
                  checked={formData.display.isVisible}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Visible to public</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="display.isPopular"
                  checked={formData.display.isPopular}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Mark as popular</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="display.isFeatured"
                  checked={formData.display.isFeatured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Featured plan</label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{plan ? 'Update Plan' : 'Create Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEditorModal;
