import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Star,
  Zap,
  Crown,
  Settings,
  BarChart3
} from 'lucide-react';
import PlanEditorModal from './PlanEditorModal';

const PricingManagement = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      if (activeTab === 'plans') {
        const response = await fetch(`${baseUrl}/api/pricing/admin/plans`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setPlans(data.data);
      } else if (activeTab === 'features') {
        const response = await fetch(`${baseUrl}/api/pricing/features`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setFeatures(data.data);
      } else if (activeTab === 'discounts') {
        const response = await fetch(`${baseUrl}/api/pricing/admin/discounts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setDiscounts(data.data);
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      window.showToast && window.showToast('فشل في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'plans', name: 'Subscription Plans', icon: DollarSign },
    { id: 'features', name: 'Features', icon: Settings },
    { id: 'discounts', name: 'Discount Codes', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const planIcons = {
    'small-hotels': Star,
    'medium-hotels': Zap,
    'large-hotels': Crown,
    enterprise: Settings
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    soon: 'bg-yellow-100 text-yellow-800',
    planned: 'bg-gray-100 text-gray-800'
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'plans') setShowPlanModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    if (activeTab === 'plans') setShowPlanModal(true);
  };

  const toggleVisibility = async (planId, currentVisibility) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/pricing/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display: { isVisible: !currentVisibility }
        })
      });

      if (response.ok) {
        fetchData();
        window.showToast && window.showToast('تم تحديث حالة العرض بنجاح', 'success');
      }
    } catch (error) {
      console.error('Toggle visibility error:', error);
      window.showToast && window.showToast('فشل في تحديث حالة العرض', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Plans Management</h1>
          <p className="text-gray-600">Manage subscription plans, features, and discount codes</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = planIcons[plan.slug] || Star;
                return (
                  <div key={plan._id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-500">{plan.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleVisibility(plan._id, plan.display.isVisible)}
                          className={`p-1 rounded-lg transition-colors ${
                            plan.display.isVisible
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {plan.display.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly</span>
                        <span className="font-semibold">${plan.pricing.monthly.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Yearly</span>
                        <div className="text-right">
                          <span className="font-semibold">${plan.pricing.yearly.amount}</span>
                          {plan.yearlySavingsPercentage > 0 && (
                            <div className="text-xs text-green-600">Save {plan.yearlySavingsPercentage}%</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Features</span>
                        <span className="text-sm font-medium">{plan.features.length}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <div className="flex items-center space-x-2">
                          {plan.display.isPopular && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Popular</span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Features Management</h3>
                <p className="text-gray-600">Manage available features and their status</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {features.map((feature) => (
                      <tr key={feature._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                            <div className="text-sm text-gray-500">{feature.key}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">{feature.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">{feature.module}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[feature.status]}`}>
                            {feature.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(feature)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Discount Codes</h3>
                <p className="text-gray-600">Manage promotional and discount codes</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {discounts.map((discount) => (
                      <tr key={discount._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{discount.code}</div>
                            <div className="text-sm text-gray-500">{discount.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {discount.usageCount} / {discount.usageLimit.total === -1 ? '∞' : discount.usageLimit.total}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(discount.validUntil).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            discount.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {discount.isValid ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(discount)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Active Subscriptions</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold">$45,678</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trial Conversions</span>
                    <span className="font-semibold">23.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Usage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Codes</span>
                    <span className="font-semibold">{discounts.filter(d => d.isValid).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Redemptions</span>
                    <span className="font-semibold">{discounts.reduce((sum, d) => sum + d.usageCount, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Savings Provided</span>
                    <span className="font-semibold">$12,345</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showPlanModal && (
        <PlanEditorModal
          isOpen={showPlanModal}
          onClose={() => {
            setShowPlanModal(false);
            setEditingItem(null);
          }}
          plan={editingItem}
          onSave={() => {
            fetchData();
            setShowPlanModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default PricingManagement;
