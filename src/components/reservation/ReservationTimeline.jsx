import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Phone,
  Mail,
  Edit,
  Plus,
  MessageSquare
} from 'lucide-react';

const ReservationTimeline = ({ reservation, onUpdate, onClose }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (reservation) {
      fetchTimeline();
    }
  }, [reservation]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sysora_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/timeline`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTimeline(data.data?.timeline || generateDefaultTimeline());
      } else {
        // If API doesn't exist yet, generate default timeline
        setTimeline(generateDefaultTimeline());
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setTimeline(generateDefaultTimeline());
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultTimeline = () => {
    const events = [];
    const now = new Date();

    // Booking created
    events.push({
      id: 1,
      type: 'booking_created',
      title: 'Reservation Created',
      description: `Reservation ${reservation.reservationNumber} was created`,
      timestamp: reservation.createdAt || new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      icon: Calendar,
      color: 'bg-blue-500',
      user: 'System'
    });

    // Payment events
    if (reservation.paidAmount > 0) {
      events.push({
        id: 2,
        type: 'payment_received',
        title: 'Payment Received',
        description: `Payment of ${reservation.paidAmount} DZD received`,
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        icon: CreditCard,
        color: 'bg-green-500',
        user: 'System'
      });
    }

    // Status changes
    if (reservation.status === 'checked_in' || reservation.status === 'checked_out') {
      events.push({
        id: 3,
        type: 'checked_in',
        title: 'Guest Checked In',
        description: `${reservation.guestId?.firstName} ${reservation.guestId?.lastName} checked into Room ${reservation.roomId?.number}`,
        timestamp: new Date(reservation.checkInDate),
        icon: CheckCircle,
        color: 'bg-emerald-500',
        user: 'Front Desk'
      });
    }

    if (reservation.status === 'checked_out') {
      events.push({
        id: 4,
        type: 'checked_out',
        title: 'Guest Checked Out',
        description: `Guest checked out from Room ${reservation.roomId?.number}`,
        timestamp: new Date(reservation.checkOutDate),
        icon: XCircle,
        color: 'bg-gray-500',
        user: 'Front Desk'
      });
    }

    // Sort by timestamp
    return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const token = localStorage.getItem('sysora_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservation._id}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: newNote,
          type: 'manual'
        })
      });

      if (response.ok) {
        // Add note to timeline locally
        const newEvent = {
          id: Date.now(),
          type: 'note_added',
          title: 'Note Added',
          description: newNote,
          timestamp: new Date(),
          icon: MessageSquare,
          color: 'bg-purple-500',
          user: 'Current User'
        };
        
        setTimeline(prev => [...prev, newEvent].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        setNewNote('');
        window.showToast && window.showToast('Note added successfully', 'success');
      } else {
        window.showToast && window.showToast('Failed to add note', 'error');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      window.showToast && window.showToast('Error adding note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked_in': return 'bg-green-100 text-green-800 border-green-200';
      case 'checked_out': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reservation Timeline</h2>
              <p className="text-blue-100">#{reservation.reservationNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          {/* Guest Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{reservation.guestId?.firstName} {reservation.guestId?.lastName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>{reservation.guestId?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>{reservation.guestId?.phone}</span>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-200 text-sm">Room</p>
              <p className="font-semibold">Room {reservation.roomId?.number}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Check-in</p>
              <p className="font-semibold">{new Date(reservation.checkInDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Check-out</p>
              <p className="font-semibold">{new Date(reservation.checkOutDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                {reservation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading timeline...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {timeline.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <div key={event.id} className="flex items-start space-x-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`${event.color} p-2 rounded-full`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <p className="text-xs text-gray-500">by {event.user}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Note Section */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h4>
            <div className="space-y-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this reservation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim() || addingNote}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>{addingNote ? 'Adding...' : 'Add Note'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationTimeline;
