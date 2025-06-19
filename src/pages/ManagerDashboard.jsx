import React, { useState, useEffect } from 'react';
import ManagerNavigation from '../components/navigation/ManagerNavigation';
import ManagerHeader from '../components/header/ManagerHeader';
import ManagerOverview from '../components/manager/ManagerOverview';
import AdvancedRoomManagement from '../components/rooms/AdvancedRoomManagement';
import ReservationManagement from '../components/ReservationManagement';
import GuestManagement from '../components/guests/GuestManagement';
import AdvancedPaymentSystem from '../components/payments/AdvancedPaymentSystem';
import AnalyticsHub from '../components/analytics/AnalyticsHub';
import AIInsights from '../components/AIInsights';
import SecurityHub from '../components/security/SecurityHub';
import UserManagement from '../components/security/UserManagement';
import HotelSettings from '../components/settings/HotelSettings';
import CheckInOutManager from '../components/frontline/CheckInOutManager';
import SimpleHousekeeping from '../components/frontline/SimpleHousekeeping';
import ShiftReport from '../components/frontline/ShiftReport';
import AddGuestModal from '../components/AddGuestModal';
import NotificationsPanel from '../components/notifications/NotificationsPanel';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import { TrialBanner } from '../hooks/useFeatureAccess.jsx';

const ManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    // Get user and hotel data from localStorage
    const userData = localStorage.getItem('sysora_user');
    const hotelData = localStorage.getItem('sysora_hotel');
    const token = localStorage.getItem('sysora_token');

    if (!userData || !hotelData || !token) {
      window.location.href = '/';
      return;
    }

    setUser(JSON.parse(userData));
    setHotel(JSON.parse(hotelData));

    // Load dashboard data
    loadDashboardData(token);
    loadNotifications(token);
  }, []);

  const loadDashboardData = async (token) => {
    try {
      // Load reservations
      const reservationsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        if (reservationsData.success) {
          setReservations(reservationsData.data.reservations || []);
        }
      }

      // Load rooms
      const roomsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        if (roomsData.success) {
          setRooms(roomsData.data.rooms || []);
        }
      }

      // Load guests
      const guestsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/guests`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (guestsResponse.ok) {
        const guestsData = await guestsResponse.json();
        if (guestsData.success) {
          setCustomers(guestsData.data.guests || []);
        }
      }

      // Load dashboard stats
      const statsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/dashboard/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setDashboardStats(statsData.data || {});
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set fallback data
      setReservations([]);
      setRooms([]);
      setCustomers([]);
      setDashboardStats({});
    }
  };

  const loadNotifications = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data.notifications || []);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Set mock notifications
      setNotifications([
        {
          id: 1,
          type: 'booking',
          title: 'New Booking',
          message: 'Room 101 booked for tonight',
          time: '5 minutes ago',
          read: false
        },
        {
          id: 2,
          type: 'maintenance',
          title: 'Maintenance Request',
          message: 'AC repair needed in Room 205',
          time: '1 hour ago',
          read: false
        }
      ]);
    }
  };

  const handleSaveGuest = (newGuest) => {
    window.showToast && window.showToast(`Guest ${newGuest.firstName} ${newGuest.lastName} added successfully`, 'success');
    // Refresh guests data
    const token = localStorage.getItem('sysora_token');
    if (token) loadDashboardData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('sysora_token');
    localStorage.removeItem('sysora_user');
    localStorage.removeItem('sysora_hotel');
    localStorage.removeItem('sysora_temp_password');
    window.location.href = '/';
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'new-booking':
        setActiveTab('reservations');
        break;
      case 'add-guest':
        setShowGuestModal(true);
        break;
      case 'add-room':
        setActiveTab('rooms');
        break;
      case 'view-analytics':
        setActiveTab('analytics');
        break;
      default:
        console.log('Unknown quick action:', actionId);
    }
  };

  const handleAccountAction = (action) => {
    switch (action) {
      case 'notifications':
        setShowNotifications(true);
        break;
      case 'profile':
        setShowProfileSettings(true);
        break;
      case 'security':
        setShowSecuritySettings(true);
        break;
      case 'preferences':
        setActiveTab('settings');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        console.log('Unknown account action:', action);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ManagerOverview
            stats={dashboardStats}
            reservations={reservations}
            rooms={rooms}
            customers={customers}
            onTabChange={setActiveTab}
            onShowGuestModal={setShowGuestModal}
          />
        );
      case 'rooms':
        return <AdvancedRoomManagement />;
      case 'checkin-checkout':
        return <CheckInOutManager />;
      case 'guests':
        return <GuestManagement />;
      case 'housekeeping':
        return <SimpleHousekeeping />;
      case 'reservations':
        return <ReservationManagement />;
      case 'shift-report':
        return <ShiftReport />;
      case 'payments':
        return <AdvancedPaymentSystem />;
      case 'analytics':
        return <AnalyticsHub />;
      case 'ai-insights':
        return <AIInsights />;
      case 'security':
        return <SecurityHub />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <HotelSettings />;
      default:
        return (
          <ManagerOverview
            stats={dashboardStats}
            reservations={reservations}
            rooms={rooms}
            customers={customers}
            onTabChange={setActiveTab}
            onShowGuestModal={setShowGuestModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Manager Header */}
      <ManagerHeader
        user={user}
        hotel={hotel}
        notifications={notifications}
        onQuickAction={handleQuickAction}
        onAccountAction={handleAccountAction}
      />

      {/* Manager Navigation */}
      <ManagerNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Modals */}
      <AddGuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onSave={handleSaveGuest}
      />

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />

      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
        user={user}
      />

      <SecuritySettings
        isOpen={showSecuritySettings}
        onClose={() => setShowSecuritySettings(false)}
        user={user}
      />
    </div>
  );
};

export default ManagerDashboard;
