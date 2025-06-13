import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  X,
  Settings,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Star
} from 'lucide-react';

const SmartNotifications = ({ reservations = [], isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    checkInReminders: true,
    checkOutReminders: true,
    paymentAlerts: true,
    overbookingWarnings: true,
    maintenanceAlerts: true,
    guestFeedback: true
  });

  useEffect(() => {
    if (isOpen) {
      generateSmartNotifications();
    }
  }, [isOpen, reservations]);

  const generateSmartNotifications = () => {
    setLoading(true);
    const smartNotifications = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Check-in reminders
    if (settings.checkInReminders) {
      const todayCheckIns = reservations.filter(r => {
        const checkInDate = new Date(r.checkInDate);
        return checkInDate.toDateString() === today.toDateString() && r.status === 'confirmed';
      });

      todayCheckIns.forEach(reservation => {
        smartNotifications.push({
          id: `checkin-${reservation._id}`,
          type: 'check_in_reminder',
          priority: 'high',
          title: 'Check-in Today',
          message: `${reservation.guestId?.firstName} ${reservation.guestId?.lastName} is expected to check in today at Room ${reservation.roomId?.number}`,
          timestamp: now,
          data: reservation,
          actions: ['view', 'checkin', 'contact'],
          icon: Calendar,
          color: 'blue'
        });
      });
    }

    // Check-out reminders
    if (settings.checkOutReminders) {
      const todayCheckOuts = reservations.filter(r => {
        const checkOutDate = new Date(r.checkOutDate);
        return checkOutDate.toDateString() === today.toDateString() && r.status === 'checked_in';
      });

      todayCheckOuts.forEach(reservation => {
        smartNotifications.push({
          id: `checkout-${reservation._id}`,
          type: 'check_out_reminder',
          priority: 'medium',
          title: 'Check-out Today',
          message: `${reservation.guestId?.firstName} ${reservation.guestId?.lastName} is scheduled to check out today from Room ${reservation.roomId?.number}`,
          timestamp: now,
          data: reservation,
          actions: ['view', 'checkout', 'extend'],
          icon: Clock,
          color: 'orange'
        });
      });
    }

    // Late check-outs
    const lateCheckOuts = reservations.filter(r => {
      const checkOutDate = new Date(r.checkOutDate);
      return checkOutDate < today && r.status === 'checked_in';
    });

    lateCheckOuts.forEach(reservation => {
      const daysLate = Math.ceil((today - new Date(reservation.checkOutDate)) / (1000 * 60 * 60 * 24));
      smartNotifications.push({
        id: `late-checkout-${reservation._id}`,
        type: 'late_checkout',
        priority: 'urgent',
        title: 'Late Check-out',
        message: `${reservation.guestId?.firstName} ${reservation.guestId?.lastName} is ${daysLate} day(s) overdue for check-out from Room ${reservation.roomId?.number}`,
        timestamp: now,
        data: reservation,
        actions: ['view', 'contact', 'checkout'],
        icon: AlertTriangle,
        color: 'red'
      });
    });

    // Payment alerts
    if (settings.paymentAlerts) {
      const pendingPayments = reservations.filter(r => {
        const totalAmount = r.totalAmount || 0;
        const paidAmount = r.paidAmount || 0;
        return totalAmount > paidAmount && r.status !== 'cancelled';
      });

      pendingPayments.forEach(reservation => {
        const balance = (reservation.totalAmount || 0) - (reservation.paidAmount || 0);
        smartNotifications.push({
          id: `payment-${reservation._id}`,
          type: 'payment_reminder',
          priority: balance > 10000 ? 'high' : 'medium',
          title: 'Payment Pending',
          message: `${reservation.guestId?.firstName} ${reservation.guestId?.lastName} has a pending balance of ${balance.toLocaleString()} DZD`,
          timestamp: now,
          data: reservation,
          actions: ['view', 'payment', 'contact'],
          icon: DollarSign,
          color: 'green'
        });
      });
    }

    // Overbooking warnings
    if (settings.overbookingWarnings) {
      const roomOccupancy = {};
      reservations.forEach(r => {
        if (r.status === 'confirmed' || r.status === 'checked_in') {
          const checkIn = new Date(r.checkInDate);
          const checkOut = new Date(r.checkOutDate);
          
          for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toDateString();
            if (!roomOccupancy[dateKey]) roomOccupancy[dateKey] = new Set();
            roomOccupancy[dateKey].add(r.roomId?._id);
          }
        }
      });

      // Check for potential overbooking in next 7 days
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        const dateKey = checkDate.toDateString();
        const occupiedRooms = roomOccupancy[dateKey]?.size || 0;
        
        if (occupiedRooms > 25) { // Assuming 30 total rooms
          smartNotifications.push({
            id: `overbooking-${dateKey}`,
            type: 'overbooking_warning',
            priority: 'urgent',
            title: 'High Occupancy Alert',
            message: `${occupiedRooms} rooms occupied on ${checkDate.toLocaleDateString()}. Consider overbooking management.`,
            timestamp: now,
            data: { date: checkDate, occupancy: occupiedRooms },
            actions: ['view', 'manage'],
            icon: Users,
            color: 'purple'
          });
        }
      }
    }

    // Guest feedback reminders
    if (settings.guestFeedback) {
      const recentCheckOuts = reservations.filter(r => {
        const checkOutDate = new Date(r.actualCheckOutDate || r.checkOutDate);
        const daysSinceCheckOut = (now - checkOutDate) / (1000 * 60 * 60 * 24);
        return r.status === 'checked_out' && daysSinceCheckOut <= 3 && !r.guestRating;
      });

      recentCheckOuts.forEach(reservation => {
        smartNotifications.push({
          id: `feedback-${reservation._id}`,
          type: 'feedback_request',
          priority: 'low',
          title: 'Request Guest Feedback',
          message: `Follow up with ${reservation.guestId?.firstName} ${reservation.guestId?.lastName} for feedback on their recent stay`,
          timestamp: now,
          data: reservation,
          actions: ['view', 'contact', 'feedback'],
          icon: Star,
          color: 'yellow'
        });
      });
    }

    // Sort by priority and timestamp
    smartNotifications.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setNotifications(smartNotifications);
    setLoading(false);
  };

  const handleNotificationAction = (notification, action) => {
    console.log('Notification action:', action, notification);
    
    switch (action) {
      case 'view':
        window.showToast && window.showToast(`Viewing details for ${notification.title}`, 'info');
        break;
      case 'checkin':
        window.showToast && window.showToast('Opening check-in process...', 'info');
        break;
      case 'checkout':
        window.showToast && window.showToast('Opening check-out process...', 'info');
        break;
      case 'payment':
        window.showToast && window.showToast('Opening payment management...', 'info');
        break;
      case 'contact':
        window.showToast && window.showToast('Opening contact options...', 'info');
        break;
      case 'feedback':
        window.showToast && window.showToast('Opening feedback form...', 'info');
        break;
      default:
        window.showToast && window.showToast(`Action: ${action}`, 'info');
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      check_in_reminder: Calendar,
      check_out_reminder: Clock,
      late_checkout: AlertTriangle,
      payment_reminder: DollarSign,
      overbooking_warning: Users,
      feedback_request: Star
    };
    return icons[type] || Bell;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Bell className="w-6 h-6 mr-3" />
                Smart Notifications
              </h2>
              <p className="text-blue-100">Intelligent alerts and reminders for your hotel operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.showToast && window.showToast('Notification settings opened', 'info')}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Notifications</option>
                <option value="check_in_reminder">Check-in Reminders</option>
                <option value="check_out_reminder">Check-out Reminders</option>
                <option value="payment_reminder">Payment Alerts</option>
                <option value="overbooking_warning">Overbooking Warnings</option>
                <option value="feedback_request">Feedback Requests</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {getFilteredNotifications().length} notifications
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Generating smart notifications...</p>
              </div>
            </div>
          ) : getFilteredNotifications().length > 0 ? (
            <div className="space-y-4">
              {getFilteredNotifications().map((notification) => {
                const IconComponent = getTypeIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      notification.read ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-xl ${
                          notification.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          notification.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          notification.color === 'red' ? 'bg-red-100 text-red-600' :
                          notification.color === 'green' ? 'bg-green-100 text-green-600' :
                          notification.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          notification.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {notification.actions.map((action) => (
                                <button
                                  key={action}
                                  onClick={() => handleNotificationAction(notification, action)}
                                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors capitalize"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title={notification.read ? "Mark as unread" : "Mark as read"}
                        >
                          {notification.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">All caught up! No new notifications at this time.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Smart notifications powered by AI • Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateSmartNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications;
