import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, Clock, Zap } from 'lucide-react';

const MaintenanceRequestModal = ({ isOpen, onClose, onSubmit, room }) => {
  const [formData, setFormData] = useState({
    issue: '',
    priority: 'normal',
    category: 'general',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { value: 'low', label: 'Low', icon: Clock, color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'normal', label: 'Normal', icon: Wrench, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'high', label: 'High', icon: AlertTriangle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { value: 'urgent', label: 'Urgent', icon: Zap, color: 'text-red-600 bg-red-50 border-red-200' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' }
  ];

  const commonIssues = [
    'Bathroom leak',
    'Air conditioning issue',
    'TV malfunction',
    'Lighting problem',
    'Mini fridge not working',
    'Lock issue',
    'Furniture damage',
    'Curtain problem',
    'Phone not working',
    'Window issue'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuickIssue = (issue) => {
    setFormData(prev => ({
      ...prev,
      issue: issue
    }));
    setErrors(prev => ({
      ...prev,
      issue: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.issue.trim()) {
      newErrors.issue = 'Issue description is required';
    }

    if (formData.issue.trim().length < 5) {
      newErrors.issue = 'Issue description must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        roomId: room?._id,
        roomNumber: room?.number
      });
      handleClose();
    } catch (error) {
      console.error('Submit maintenance request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      issue: '',
      priority: 'normal',
      category: 'general',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Maintenance Request</h2>
              <p className="text-sm text-gray-600">Room {room?.number}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Request Priority
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {priorityOptions.map((priority) => {
                const Icon = priority.icon;
                const isSelected = formData.priority === priority.value;
                return (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? priority.color + ' ring-2 ring-offset-2 ring-current'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      isSelected ? 'text-current' : 'text-gray-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      isSelected ? 'text-current' : 'text-gray-600'
                    }`}>
                      {priority.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              {categoryOptions.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Issue Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Common Issues (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonIssues.map((issue, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickIssue(issue)}
                  className="p-2 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-right"
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description *
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
                errors.issue ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write a detailed description of the issue..."
            />
            {errors.issue && (
              <p className="text-red-500 text-xs mt-1">{errors.issue}</p>
            )}
          </div>

          {/* Additional Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Any additional details that may help the maintenance team..."
            />
          </div>

          {/* Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Request Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">Room {room?.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className={`font-medium ${selectedPriority?.color.split(' ')[0]}`}>
                  {selectedPriority?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">
                  {categoryOptions.find(c => c.value === formData.category)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors font-medium"
            >
              <Wrench className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Maintenance Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRequestModal;
