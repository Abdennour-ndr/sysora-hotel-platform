import React, { useState, useEffect } from 'react';

import SmartNavigation from '../components/navigation/SmartNavigation';
import ProfessionalHeader from '../components/header/ProfessionalHeader';
import Services from '../components/services/Services';



import AdvancedRoomManagement from '../components/rooms/AdvancedRoomManagement';
import ReservationManagement from '../components/ReservationManagement';
import GuestManagement from '../components/guests/GuestManagement';
import AdvancedPaymentSystem from '../components/payments/AdvancedPaymentSystem';
import AIInsights from '../components/AIInsights';
import CMSHub from '../components/cms/CMSHub';
import AnalyticsHub from '../components/analytics/AnalyticsHub';
import SecurityHub from '../components/security/SecurityHub';
import OptimizationHub from '../components/optimization/OptimizationHub';
import EnhancedOverview from '../components/overview/EnhancedOverview';
import AddGuestModal from '../components/AddGuestModal';


import { TrialBanner } from '../hooks/useFeatureAccess.jsx';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userLevel, setUserLevel] = useState('beginner'); // 'beginner' or 'professional'

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

    // Fetch and apply customization
    fetchCustomization(token);

    // Load dashboard data
    loadDashboardData(token);
  }, []);

  const fetchCustomization = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success && data.data.theme) {
        applyThemeToDocument(data.data.theme);
      }
    } catch (error) {
      console.error('Fetch customization error:', error);
    }
  };

  const applyThemeToDocument = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--sidebar-color', theme.sidebarColor);
    root.style.setProperty('--header-color', theme.headerColor);
  };

  const loadDashboardData = async (token) => {
    try {
      // Load reservations
      const reservationsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        if (reservationsData.success) {
          setReservations(reservationsData.data.reservations || []);
        }
      }

      // Load rooms
      const roomsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        if (roomsData.success) {
          setRooms(roomsData.data.rooms || []);
        }
      }

      // Load customers
      const customersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        if (customersData.success) {
          setCustomers(customersData.data.customers || []);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty arrays as fallback
      setReservations([]);
      setRooms([]);
      setCustomers([]);
    }
  };

  const handleSaveGuest = (newGuest) => {
    window.showToast && window.showToast(`Guest ${newGuest.firstName} ${newGuest.lastName} added successfully`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('sysora_token');
    localStorage.removeItem('sysora_user');
    localStorage.removeItem('sysora_hotel');
    localStorage.removeItem('sysora_temp_password');
    window.location.href = '/';
  };

  // Handle quick actions from header
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'new-booking':
        setActiveTab('reservations');
        // Trigger new booking modal
        break;
      case 'add-guest':
        setShowGuestModal(true);
        break;
      case 'add-room':
        setActiveTab('rooms');
        // Trigger add room modal
        break;
      default:
        console.log('Unknown quick action:', actionId);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle notification action
  };

  // Handle user menu click
  const handleUserMenuClick = (action) => {
    switch (action) {
      case 'profile':
        // Open profile settings
        break;
      case 'settings':
        // Open user settings
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        console.log('Unknown user action:', action);
    }
  };

  // Load mock notifications
  useEffect(() => {
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
      },
      {
        id: 3,
        type: 'guest',
        title: 'Guest Check-in',
        message: 'VIP guest arriving at 3 PM',
        time: '2 hours ago',
        read: true
      }
    ]);
  }, []);



  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Professional Header */}
      <ProfessionalHeader
        user={user}
        hotel={hotel}
        notifications={notifications}
        onQuickAction={handleQuickAction}
        onNotificationClick={handleNotificationClick}
        onUserMenuClick={handleUserMenuClick}
      />

      {/* Smart Navigation */}
      <SmartNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userLevel={userLevel}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />

        {/* Welcome Message - Only show for overview */}
        {activeTab === 'overview' && (
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-sysora-midnight to-sysora-midnight-light rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.fullName}! 👋
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Here's what's happening at {hotel?.name} today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                      <div className="text-sm text-blue-100">Today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <EnhancedOverview
            onTabChange={setActiveTab}
            onShowGuestModal={setShowGuestModal}
          />
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <AdvancedRoomManagement />
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <ReservationManagement />
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <GuestManagement />
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <AdvancedPaymentSystem />
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <AIInsights />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsHub />
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <SecurityHub />
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <OptimizationHub />
        )}

        {/* CMS Tab */}
        {activeTab === 'cms' && (
          <CMSHub />
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <Services
            reservations={reservations}
            rooms={rooms}
            customers={customers}
          />
        )}




      </main>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onSave={handleSaveGuest}
      />
    </div>
  );
};

export default Dashboard;
