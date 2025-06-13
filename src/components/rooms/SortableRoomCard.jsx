import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bed,
  Users,
  DollarSign,
  Edit3,
  Save,
  X,
  Check,
  MoreVertical,
  Move,
  Eye,
  Settings,
  Wrench,
  Sparkles,
  Image,
  Star,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import InlineEditField from './InlineEditField';

const SortableRoomCard = ({
  room,
  isSelected,
  onSelect,
  onContextMenu,
  onInlineEdit,
  editingField,
  setEditingField,
  getStatusColor,
  getAmenityIcon,
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: room.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSelect = (e) => {
    if (e.ctrlKey || e.metaKey) {
      onSelect(room.id, !isSelected);
    } else if (e.shiftKey) {
      // Handle shift selection logic here
      onSelect(room.id, !isSelected);
    } else {
      onSelect(room.id, !isSelected);
    }
  };

  const handleDoubleClick = (field) => {
    setEditingField(`${room.id}-${field}`);
  };

  const handleInlineEditSave = (field, value) => {
    onInlineEdit(room.id, field, value);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4" />;
      case 'occupied':
        return <Users className="w-4 h-4" />;
      case 'cleaning':
        return <Sparkles className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  const quickActions = [
    { icon: Eye, label: 'View Details', action: () => console.log('View details') },
    { icon: Edit3, label: 'Edit Room', action: () => console.log('Edit room') },
    { icon: Sparkles, label: 'Request Cleaning', action: () => console.log('Request cleaning') },
    { icon: Wrench, label: 'Request Maintenance', action: () => console.log('Request maintenance') },
  ];

  if (viewMode === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl group ${
          isSelected 
            ? 'border-sysora-mint shadow-lg ring-2 ring-sysora-mint/20' 
            : 'border-gray-100 hover:border-sysora-mint/50'
        } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => onContextMenu(e, room)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            {/* Room Info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                className="p-2 text-gray-400 hover:text-sysora-mint cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
              >
                <Move className="w-5 h-5" />
              </div>

              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="w-5 h-5 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
              />

              {/* Room Number and Name */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-sysora-mint/10 rounded-xl flex items-center justify-center">
                  <Bed className="w-6 h-6 text-sysora-mint" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-sysora-midnight">
                      {room.number}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      <span className="capitalize">{room.status}</span>
                    </span>
                  </div>
                  {editingField === `${room.id}-name` ? (
                    <InlineEditField
                      value={room.name}
                      onSave={(value) => handleInlineEditSave('name', value)}
                      onCancel={() => setEditingField(null)}
                      className="text-lg font-medium"
                    />
                  ) : (
                    <h3
                      className="text-lg font-medium text-gray-900 cursor-pointer hover:text-sysora-mint transition-colors"
                      onDoubleClick={() => handleDoubleClick('name')}
                      title="Double-click to edit"
                    >
                      {room.name}
                    </h3>
                  )}
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="flex items-center space-x-6">
              {/* Type */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-semibold capitalize">{room.type}</div>
              </div>

              {/* Capacity */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Capacity</div>
                <div className="font-semibold flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{room.maxOccupancy}</span>
                </div>
              </div>

              {/* Floor */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Floor</div>
                <div className="font-semibold">{room.floor}</div>
              </div>

              {/* Price */}
              <div className="text-center">
                <div className="text-sm text-gray-500">Price</div>
                {editingField === `${room.id}-basePrice` ? (
                  <InlineEditField
                    value={room.basePrice}
                    type="number"
                    onSave={(value) => handleInlineEditSave('basePrice', parseFloat(value))}
                    onCancel={() => setEditingField(null)}
                    className="text-lg font-bold text-sysora-mint"
                  />
                ) : (
                  <div
                    className="text-lg font-bold text-sysora-mint cursor-pointer hover:bg-sysora-mint/10 px-2 py-1 rounded transition-colors"
                    onDoubleClick={() => handleDoubleClick('basePrice')}
                    title="Double-click to edit"
                  >
                    {room.basePrice.toLocaleString()} {room.currency}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {isHovered && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {quickActions.slice(0, 3).map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                          title={action.label}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                )}
                
                <button
                  onClick={(e) => onContextMenu(e, room)}
                  className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Amenities:</span>
                <div className="flex items-center space-x-2">
                  {room.amenities.slice(0, 6).map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={index}
                        className="p-1 bg-gray-100 rounded-lg"
                        title={amenity}
                      >
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                    );
                  })}
                  {room.amenities.length > 6 && (
                    <span className="text-sm text-gray-500">
                      +{room.amenities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl group overflow-hidden ${
        isSelected 
          ? 'border-sysora-mint shadow-lg ring-2 ring-sysora-mint/20' 
          : 'border-gray-100 hover:border-sysora-mint/50'
      } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu(e, room)}
    >
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(room.status)}`}>
            {getStatusIcon(room.status)}
            <span className="capitalize">{room.status}</span>
          </span>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-5 h-5 text-sysora-mint border-white rounded focus:ring-sysora-mint bg-white/90"
          />
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-4 right-4 p-2 bg-white/90 text-gray-600 hover:text-sysora-mint cursor-grab active:cursor-grabbing rounded-lg transition-colors"
          title="Drag to reorder"
        >
          <Move className="w-4 h-4" />
        </div>

        {/* Quick Actions Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-3 bg-white/90 text-gray-700 hover:text-sysora-mint hover:bg-white rounded-xl transition-colors shadow-lg"
                    title={action.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="p-6">
        {/* Room Number and Name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-sysora-midnight">
              {room.number}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
              {room.type}
            </span>
          </div>
          
          <button
            onClick={(e) => onContextMenu(e, room)}
            className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Room Name */}
        {editingField === `${room.id}-name` ? (
          <InlineEditField
            value={room.name}
            onSave={(value) => handleInlineEditSave('name', value)}
            onCancel={() => setEditingField(null)}
            className="text-lg font-medium mb-3"
          />
        ) : (
          <h3
            className="text-lg font-medium text-gray-900 mb-3 cursor-pointer hover:text-sysora-mint transition-colors"
            onDoubleClick={() => handleDoubleClick('name')}
            title="Double-click to edit"
          >
            {room.name}
          </h3>
        )}

        {/* Room Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {room.maxOccupancy} guests
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Floor {room.floor}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {editingField === `${room.id}-basePrice` ? (
            <InlineEditField
              value={room.basePrice}
              type="number"
              onSave={(value) => handleInlineEditSave('basePrice', parseFloat(value))}
              onCancel={() => setEditingField(null)}
              className="text-2xl font-bold text-sysora-mint"
            />
          ) : (
            <div
              className="text-2xl font-bold text-sysora-mint cursor-pointer hover:bg-sysora-mint/10 px-2 py-1 rounded transition-colors inline-block"
              onDoubleClick={() => handleDoubleClick('basePrice')}
              title="Double-click to edit"
            >
              {room.basePrice.toLocaleString()} {room.currency}
            </div>
          )}
          <div className="text-sm text-gray-500">per night</div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity, index) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg"
                  title={amenity}
                >
                  <Icon className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600 capitalize">{amenity}</span>
                </div>
              );
            })}
            {room.amenities.length > 4 && (
              <div className="bg-gray-100 px-2 py-1 rounded-lg">
                <span className="text-xs text-gray-600">
                  +{room.amenities.length - 4}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Last Cleaned */}
        {room.lastCleaned && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                Last cleaned: {new Date(room.lastCleaned).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableRoomCard;
