import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Bed,
  Phone,
  Shield,
  Clock,
  Edit,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { Modal, Button, Input, Select, Textarea, StatusBadge, LoadingSpinner } from '../ui/DesignSystem';
import { cn } from '../../utils/cn';

// Room Details Modal
export const RoomDetailsModal = ({ room, isOpen, onClose, onStatusChange, statusConfig }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(room || {});

  if (!room) return null;

  const StatusIcon = statusConfig[room.status]?.icon || Bed;

  const tabs = [
    { id: 'details', label: 'Details', icon: Bed },
    { id: 'guest', label: 'Guest Info', icon: User },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle }
  ];

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
    tv: Tv,
    bath: Bath,
    phone: Phone,
    safe: Shield
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{room.number}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Room {room.number}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <StatusBadge status={statusConfig[room.status]?.color || 'neutral'}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1).replace('_', ' ')}
                </StatusBadge>
                <span className="text-sm text-gray-600 capitalize">{room.type}</span>
                <span className="text-sm text-gray-600">Floor {room.floor || 1}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
            >
              <Edit className="w-4 h-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    {isEditing ? (
                      <Input
                        value={editData.number || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, number: e.target.value }))}
                      />
                    ) : (
                      <p className="text-gray-900">{room.number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    {isEditing ? (
                      <Select
                        value={editData.type || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                        <option value="presidential">Presidential</option>
                      </Select>
                    ) : (
                      <p className="text-gray-900 capitalize">{room.type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.floor || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
                      />
                    ) : (
                      <p className="text-gray-900">{room.floor || 1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Night</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.rate || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                        placeholder="0.00"
                      />
                    ) : (
                      <p className="text-gray-900">${room.rate || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.capacity || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      />
                    ) : (
                      <p className="text-gray-900">{room.capacity || 'Not specified'} guests</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(amenityIcons).map(([amenity, Icon]) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      {isEditing ? (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.amenities?.includes(amenity) || false}
                            onChange={(e) => {
                              const amenities = editData.amenities || [];
                              if (e.target.checked) {
                                setEditData(prev => ({ 
                                  ...prev, 
                                  amenities: [...amenities, amenity] 
                                }));
                              } else {
                                setEditData(prev => ({ 
                                  ...prev, 
                                  amenities: amenities.filter(a => a !== amenity) 
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                        </label>
                      ) : (
                        <div className={cn(
                          "flex items-center space-x-2 p-2 rounded-lg",
                          room.amenities?.includes(amenity) 
                            ? "bg-green-50 text-green-700" 
                            : "bg-gray-50 text-gray-400"
                        )}>
                          <Icon className="w-4 h-4" />
                          <span className="text-sm capitalize">{amenity}</span>
                          {room.amenities?.includes(amenity) && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Room description..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'guest' && (
            <div className="space-y-6">
              {room.currentGuest ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{room.currentGuest}</h3>
                      <p className="text-sm text-gray-600">Current Guest</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Check-in:</span>
                      <p className="text-gray-900">{room.checkInDate || 'Not available'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Check-out:</span>
                      <p className="text-gray-900">{room.checkOutDate || 'Not available'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Guests:</span>
                      <p className="text-gray-900">{room.guestCount || 1}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Rate:</span>
                      <p className="text-gray-900">${room.rate || 0}/night</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onStatusChange(room._id, 'cleaning')}
                    >
                      Check Out Guest
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                    >
                      Extend Stay
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Guest</h3>
                  <p className="text-gray-600 mb-4">This room is currently unoccupied</p>
                  <Button
                    onClick={() => onStatusChange(room._id, 'occupied')}
                  >
                    Assign Guest
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Room History</h3>
              <div className="space-y-3">
                {/* Mock history data */}
                {[
                  { date: '2024-01-15 14:30', action: 'Status changed to Available', user: 'John Doe' },
                  { date: '2024-01-15 11:00', action: 'Cleaning completed', user: 'Maria Garcia' },
                  { date: '2024-01-15 10:30', action: 'Guest checked out', user: 'John Doe' },
                  { date: '2024-01-14 15:00', action: 'Guest checked in', user: 'Sarah Wilson' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                      <p className="text-xs text-gray-600">by {entry.user} • {entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Records</h3>
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
                <p className="text-gray-600 mb-4">No maintenance activities recorded for this room</p>
                <Button
                  onClick={() => onStatusChange(room._id, 'maintenance')}
                >
                  Schedule Maintenance
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setEditData(room);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Save changes logic here
                setIsEditing(false);
                console.log('Saving room data:', editData);
              }}
            >
              <Save className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Add Room Modal
export const AddRoomModal = ({ isOpen, onClose, onRoomAdded }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'standard',
    floor: 1,
    rate: '',
    capacity: 2,
    amenities: [],
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'coffee', label: 'Coffee Maker', icon: Coffee },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'bath', label: 'Private Bath', icon: Bath },
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'safe', label: 'Safe', icon: Shield }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!formData.rate || formData.rate <= 0) {
      newErrors.rate = 'Valid rate is required';
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            rate: parseFloat(formData.rate),
            capacity: parseInt(formData.capacity),
            floor: parseInt(formData.floor),
            status: 'available'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const newRoom = await response.json();
      onRoomAdded(newRoom.data);
      onClose();

      // Reset form
      setFormData({
        number: '',
        type: 'standard',
        floor: 1,
        rate: '',
        capacity: 2,
        amenities: [],
        description: ''
      });

    } catch (error) {
      console.error('Error creating room:', error);
      setErrors({ submit: 'Failed to create room. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <Input
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="e.g., 101"
                error={errors.number}
              />
              {errors.number && (
                <p className="text-red-600 text-sm mt-1">{errors.number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidential</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <Input
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate per Night *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                placeholder="0.00"
                error={errors.rate}
              />
              {errors.rate && (
                <p className="text-red-600 text-sm mt-1">{errors.rate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity *
              </label>
              <Input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                error={errors.capacity}
              />
              {errors.capacity && (
                <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional room description..."
              rows={3}
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Bulk Actions Modal
export const BulkActionsModal = ({
  isOpen,
  onClose,
  selectedRooms,
  rooms,
  onBulkAction,
  statusConfig
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedRoomData = rooms.filter(room => selectedRooms.includes(room._id));

  const bulkActions = [
    { id: 'available', label: 'Mark as Available', icon: CheckCircle, color: 'text-emerald-600' },
    { id: 'cleaning', label: 'Send for Cleaning', icon: Clock, color: 'text-amber-600' },
    { id: 'maintenance', label: 'Mark for Maintenance', icon: Wrench, color: 'text-red-600' },
    { id: 'out_of_order', label: 'Mark Out of Order', icon: AlertTriangle, color: 'text-gray-600' }
  ];

  const handleBulkAction = async () => {
    if (!selectedAction) return;

    setIsLoading(true);
    try {
      await onBulkAction(selectedAction);
      onClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Bulk Actions ({selectedRooms.length} rooms)
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Selected Rooms */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Rooms:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRoomData.map((room) => (
              <span
                key={room._id}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg"
              >
                {room.number}
              </span>
            ))}
          </div>
        </div>

        {/* Action Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Action:</h3>
          <div className="space-y-2">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(action.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all text-left",
                    selectedAction === action.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Icon className={cn("w-5 h-5", action.color)} />
                  <span className="font-medium">{action.label}</span>
                  {selectedAction === action.id && (
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkAction}
            disabled={!selectedAction || isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              'Apply Action'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
