import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import DynamicForm from './forms/DynamicForm';

const AddGuestModal = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      // Create guest using API
      const response = await api.guests.create(formData);

      toast.success('Guest added successfully');
      onSave(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error creating guest:', error);
      toast.error(error.response?.data?.message || 'Failed to add guest');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add New Guest</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <DynamicForm
          formType="guest"
          onSubmit={handleFormSubmit}
          className="space-y-4"
        />

        <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            form="dynamic-form"
            className="flex items-center space-x-2 px-4 py-2 bg-sysora-primary text-white rounded-lg hover:bg-sysora-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Guest'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGuestModal;
