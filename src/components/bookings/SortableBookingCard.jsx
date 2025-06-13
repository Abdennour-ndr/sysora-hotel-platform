import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  Users,
  Edit3,
  MoreVertical,
  Move,
  Eye,
  Phone,
  Mail,
  Bed,
  CreditCard,
  FileText,
  User
} from 'lucide-react';
import InlineEditField from '../rooms/InlineEditField';

const SortableBookingCard = ({
  booking,
  isSelected,
  onSelect,
  onContextMenu,
  onInlineEdit,
  editingField,
  setEditingField,
  getStatusColor,
  getStatusIcon,
  viewMode = 'cards'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: booking.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSelect = (e) => {
    onSelect(booking.id, !isSelected);
  };

  const handleDoubleClick = (field) => {
    setEditingField(`${booking.id}-${field}`);
  };

  const handleInlineEditSave = (field, value) => {
    onInlineEdit(booking.id, field, value);
  };

  const StatusIcon = getStatusIcon(booking.status);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'DZD') => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRemainingBalance = () => {
    return booking.totalAmount - booking.paidAmount;
  };

  const getPaymentStatus = () => {
    const remaining = getRemainingBalance();
    if (remaining <= 0) return { status: 'paid', color: 'text-green-600', text: 'Fully Paid' };
    if (booking.paidAmount > 0) return { status: 'partial', color: 'text-yellow-600', text: 'Partially Paid' };
    return { status: 'unpaid', color: 'text-red-600', text: 'Unpaid' };
  };

  const quickActions = [
    { icon: Eye, label: 'View Details', action: () => console.log('View details') },
    { icon: Edit3, label: 'Edit Booking', action: () => console.log('Edit booking') },
    { icon: CreditCard, label: 'Process Payment', action: () => console.log('Process payment') },
    { icon: FileText, label: 'Generate Invoice', action: () => console.log('Generate invoice') },
  ];

  if (viewMode === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white rounded-xl lg:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl group ${
          isSelected
            ? 'border-sysora-mint shadow-lg ring-2 ring-sysora-mint/20'
            : 'border-gray-100 hover:border-sysora-mint/50'
        } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => onContextMenu(e, booking)}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0">
            {/* Mobile: Booking Header */}
            <div className="flex items-center space-x-3 sm:hidden">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                className="p-2 text-gray-400 hover:text-sysora-mint cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
              >
                <Move className="w-4 h-4" />
              </div>

              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelect}
                className="w-4 h-4 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
              />

              {/* Booking Number and Status */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-base font-bold text-sysora-midnight">
                    {booking.reservationNumber}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                  </span>
                </div>
                <div className="text-sm text-gray-600">{booking.guestName}</div>
              </div>
            </div>

            {/* Desktop: Booking Info */}
            <div className="hidden sm:flex items-center space-x-4 flex-1">
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

              {/* Booking Details */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sysora-mint/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-sysora-mint" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-base lg:text-lg font-bold text-sysora-midnight truncate">
                      {booking.reservationNumber}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span className="truncate">{booking.guestName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>Room {booking.roomNumber}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{booking.adults + booking.children} guests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Booking Details */}
            <div className="grid grid-cols-2 gap-4 sm:hidden">
              <div>
                <div className="text-xs text-gray-500 mb-1">Check-in</div>
                <div className="text-sm font-semibold">{formatDate(booking.checkInDate)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Check-out</div>
                <div className="text-sm font-semibold">{formatDate(booking.checkOutDate)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                {editingField === `${booking.id}-totalAmount` ? (
                  <InlineEditField
                    value={booking.totalAmount}
                    type="number"
                    onSave={(value) => handleInlineEditSave('totalAmount', parseFloat(value))}
                    onCancel={() => setEditingField(null)}
                    className="text-sm font-bold text-sysora-mint"
                  />
                ) : (
                  <div
                    className="text-sm font-bold text-sysora-mint cursor-pointer hover:bg-sysora-mint/10 px-1 py-0.5 rounded transition-colors"
                    onDoubleClick={() => handleDoubleClick('totalAmount')}
                    title="Double-click to edit"
                  >
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment</div>
                <div className={`text-sm font-semibold ${getPaymentStatus().color}`}>
                  {getPaymentStatus().text}
                </div>
              </div>
            </div>

            {/* Desktop: Dates and Details */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4 lg:space-x-6">
              {/* Dates */}
              <div className="text-center px-2 lg:px-4">
                <div className="text-xs lg:text-sm text-gray-500">Check-in</div>
                <div className="text-sm lg:text-base font-semibold">{formatDate(booking.checkInDate)}</div>
              </div>

              <div className="text-center px-2 lg:px-4">
                <div className="text-xs lg:text-sm text-gray-500">Check-out</div>
                <div className="text-sm lg:text-base font-semibold">{formatDate(booking.checkOutDate)}</div>
              </div>

              <div className="text-center px-2 lg:px-4">
                <div className="text-xs lg:text-sm text-gray-500">Nights</div>
                <div className="text-sm lg:text-base font-semibold">{booking.nights}</div>
              </div>

              {/* Amount */}
              <div className="text-center px-2 lg:px-4">
                <div className="text-xs lg:text-sm text-gray-500">Total Amount</div>
                {editingField === `${booking.id}-totalAmount` ? (
                  <InlineEditField
                    value={booking.totalAmount}
                    type="number"
                    onSave={(value) => handleInlineEditSave('totalAmount', parseFloat(value))}
                    onCancel={() => setEditingField(null)}
                    className="text-base lg:text-lg font-bold text-sysora-mint"
                  />
                ) : (
                  <div
                    className="text-base lg:text-lg font-bold text-sysora-mint cursor-pointer hover:bg-sysora-mint/10 px-2 py-1 rounded transition-colors"
                    onDoubleClick={() => handleDoubleClick('totalAmount')}
                    title="Double-click to edit"
                  >
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="text-center px-2 lg:px-4">
                <div className="text-xs lg:text-sm text-gray-500">Payment</div>
                <div className={`text-sm lg:text-base font-semibold ${getPaymentStatus().color}`}>
                  {getPaymentStatus().text}
                </div>
                {getRemainingBalance() > 0 && (
                  <div className="text-xs text-gray-500">
                    Remaining: {formatCurrency(getRemainingBalance(), booking.currency)}
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
                  onClick={(e) => onContextMenu(e, booking)}
                  className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile: Actions */}
            <div className="flex items-center justify-between sm:hidden">
              <div className="flex items-center space-x-2">
                {quickActions.slice(0, 2).map((action, index) => {
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

              <button
                onClick={(e) => onContextMenu(e, booking)}
                className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                title="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card View
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl lg:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl group overflow-hidden ${
        isSelected
          ? 'border-sysora-mint shadow-lg ring-2 ring-sysora-mint/20'
          : 'border-gray-100 hover:border-sysora-mint/50'
      } ${isDragging ? 'shadow-2xl scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu(e, booking)}
    >
      {/* Header */}
      <div className="relative p-4 sm:p-6 bg-gradient-to-r from-sysora-midnight/5 to-blue-50">
        {/* Selection Checkbox */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 sm:w-5 sm:h-5 text-sysora-mint border-gray-300 rounded focus:ring-sysora-mint"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize hidden sm:inline">{booking.status.replace('_', ' ')}</span>
          </span>
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/90 text-gray-600 hover:text-sysora-mint cursor-grab active:cursor-grabbing rounded-lg transition-colors"
          title="Drag to reorder"
        >
          <Move className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>

        {/* Reservation Number */}
        <div className="text-center pt-6 sm:pt-8">
          <h3 className="text-lg sm:text-xl font-bold text-sysora-midnight mb-2">
            {booking.reservationNumber}
          </h3>
          <div className="text-xs sm:text-sm text-gray-500 bg-white/60 px-2 sm:px-3 py-1 rounded-full inline-block">
            {booking.roomType}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Guest Information */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <div className="flex-1 min-w-0">
              {editingField === `${booking.id}-guestName` ? (
                <InlineEditField
                  value={booking.guestName}
                  onSave={(value) => handleInlineEditSave('guestName', value)}
                  onCancel={() => setEditingField(null)}
                  className="font-semibold text-gray-900"
                />
              ) : (
                <h4
                  className="font-semibold text-gray-900 cursor-pointer hover:text-sysora-mint transition-colors truncate"
                  onDoubleClick={() => handleDoubleClick('guestName')}
                  title="Double-click to edit"
                >
                  {booking.guestName}
                </h4>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1 min-w-0">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{booking.guestEmail}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg lg:rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="font-medium text-sm sm:text-base">Room {booking.roomNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-xs sm:text-sm">
                {booking.adults} adults
                {booking.children > 0 && `, ${booking.children} children`}
                {booking.infants > 0 && `, ${booking.infants} infants`}
              </span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-in</div>
              {editingField === `${booking.id}-checkInDate` ? (
                <InlineEditField
                  value={booking.checkInDate.toISOString().split('T')[0]}
                  type="date"
                  onSave={(value) => handleInlineEditSave('checkInDate', new Date(value))}
                  onCancel={() => setEditingField(null)}
                  className="font-semibold text-sm sm:text-base"
                />
              ) : (
                <div
                  className="font-semibold cursor-pointer hover:text-sysora-mint transition-colors text-sm sm:text-base"
                  onDoubleClick={() => handleDoubleClick('checkInDate')}
                  title="Double-click to edit"
                >
                  {formatDate(booking.checkInDate)}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Check-out</div>
              {editingField === `${booking.id}-checkOutDate` ? (
                <InlineEditField
                  value={booking.checkOutDate.toISOString().split('T')[0]}
                  type="date"
                  onSave={(value) => handleInlineEditSave('checkOutDate', new Date(value))}
                  onCancel={() => setEditingField(null)}
                  className="font-semibold text-sm sm:text-base"
                />
              ) : (
                <div
                  className="font-semibold cursor-pointer hover:text-sysora-mint transition-colors text-sm sm:text-base"
                  onDoubleClick={() => handleDoubleClick('checkOutDate')}
                  title="Double-click to edit"
                >
                  {formatDate(booking.checkOutDate)}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-2 text-xs sm:text-sm text-gray-500">
            {booking.nights} night{booking.nights > 1 ? 's' : ''}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-sysora-mint/5 rounded-lg lg:rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-600">Total Amount</span>
            {editingField === `${booking.id}-totalAmount` ? (
              <InlineEditField
                value={booking.totalAmount}
                type="number"
                onSave={(value) => handleInlineEditSave('totalAmount', parseFloat(value))}
                onCancel={() => setEditingField(null)}
                className="text-lg sm:text-xl font-bold text-sysora-mint"
              />
            ) : (
              <span
                className="text-lg sm:text-xl font-bold text-sysora-mint cursor-pointer hover:bg-sysora-mint/10 px-2 py-1 rounded transition-colors"
                onDoubleClick={() => handleDoubleClick('totalAmount')}
                title="Double-click to edit"
              >
                {formatCurrency(booking.totalAmount, booking.currency)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Paid Amount</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(booking.paidAmount, booking.currency)}
            </span>
          </div>

          {getRemainingBalance() > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(getRemainingBalance(), booking.currency)}
              </span>
            </div>
          )}
        </div>

        {/* Special Requests */}
        {booking.specialRequests && booking.specialRequests.length > 0 && (
          <div className="mb-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-2">Special Requests</div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {booking.specialRequests.map((request, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {request}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="mb-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Notes</div>
            {editingField === `${booking.id}-notes` ? (
              <InlineEditField
                value={booking.notes}
                multiline={true}
                onSave={(value) => handleInlineEditSave('notes', value)}
                onCancel={() => setEditingField(null)}
                className="text-xs sm:text-sm text-gray-700"
              />
            ) : (
              <p
                className="text-xs sm:text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors line-clamp-3"
                onDoubleClick={() => handleDoubleClick('notes')}
                title="Double-click to edit"
              >
                {booking.notes}
              </p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Always show first 2 actions on mobile, all on desktop */}
            {quickActions.slice(0, isHovered ? quickActions.length : 2).map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-1.5 sm:p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors ${
                    !isHovered && index >= 2 ? 'hidden sm:block opacity-0 group-hover:opacity-100' : ''
                  }`}
                  title={action.label}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              );
            })}
          </div>

          <button
            onClick={(e) => onContextMenu(e, booking)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
            title="More actions"
          >
            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableBookingCard;
