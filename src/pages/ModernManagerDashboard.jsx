import React, { useState, useEffect } from 'react';
import ModernSidebar from '../components/layout/ModernSidebar';
import ModernTopbar from '../components/layout/ModernTopbar';
import ModernDashboardOverview from '../components/modern/ModernDashboardOverview';
import GridBasedRoomManagement from '../components/modern/GridBasedRoomManagement';
import ModernCheckInOut from '../components/modern/ModernCheckInOut';
import ModernGuestLookup from '../components/modern/ModernGuestLookup';
import ModernHousekeeping from '../components/modern/ModernHousekeeping';
import ModernReservations from '../components/modern/ModernReservations';
import ModernShiftReport from '../components/modern/ModernShiftReport';
import {
  makeAuthenticatedRequest,
  generateMockRooms,
  generateMockReservations,
  generateMockStats,
  getAuthToken,
  isTokenValid
} from '../utils/authUtils';
import { cn } from '../utils/cn';

const ModernManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    reservations: [],
    rooms: [],
    customers: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

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
    loadDashboardData(token || getAuthToken());
    loadNotifications();
  }, []);

  const loadDashboardData = async (token) => {
    setLoading(true);
    try {
      // Check if token exists and is valid
      if (!token || !isTokenValid(token)) {
        console.log('No valid token found, using mock data');
        const mockRooms = generateMockRooms();
        const mockReservations = generateMockReservations();
        setDashboardData({
          reservations: mockReservations,
          rooms: mockRooms,
          customers: [],
          stats: generateMockStats(mockRooms, mockReservations)
        });
        setLoading(false);
        return;
      }

      // Try API calls with the new utility functions
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const [reservationsData, roomsData, guestsData, statsData] = await Promise.all([
        makeAuthenticatedRequest(`${baseUrl}/api/reservations`),
        makeAuthenticatedRequest(`${baseUrl}/api/rooms`),
        makeAuthenticatedRequest(`${baseUrl}/api/guests`),
        makeAuthenticatedRequest(`${baseUrl}/api/dashboard/stats`)
      ]);

      // Process results with fallback to mock data
      const reservations = reservationsData?.data?.reservations || generateMockReservations();
      const rooms = roomsData?.data?.rooms || generateMockRooms();
      const customers = guestsData?.data?.guests || [];
      const stats = statsData?.data || generateMockStats(rooms, reservations);

      setDashboardData({ reservations, rooms, customers, stats });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set fallback data
      const mockRooms = generateMockRooms();
      const mockReservations = generateMockReservations();
      setDashboardData({
        reservations: mockReservations,
        rooms: mockRooms,
        customers: [],
        stats: generateMockStats(mockRooms, mockReservations)
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = () => {
    // Mock notifications for demo
    setNotifications([
      {
        id: 1,
        type: 'booking',
        title: 'New Reservation',
        message: 'Room 205 booked for tonight',
        time: '2 minutes ago',
        read: false
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Maintenance Request',
        message: 'AC repair needed in Room 301',
        time: '1 hour ago',
        read: false
      },
      {
        id: 3,
        type: 'guest',
        title: 'VIP Guest Arrival',
        message: 'John Smith checking in at 3 PM',
        time: '2 hours ago',
        read: true
      }
    ]);
  };



  const handleAccountAction = (action) => {
    switch (action) {
      case 'profile':
        console.log('Open profile settings');
        break;
      case 'preferences':
        console.log('Open preferences');
        break;
      case 'notifications':
        console.log('Open notifications panel');
        break;
      case 'logout':
        localStorage.removeItem('sysora_token');
        localStorage.removeItem('sysora_user');
        localStorage.removeItem('sysora_hotel');
        window.location.href = '/';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderTabContent = () => {
    const commonProps = {
      data: dashboardData,
      loading,
      onRefresh: () => loadDashboardData(getAuthToken())
    };

    switch (activeTab) {
      case 'overview':
        return <ModernDashboardOverview {...commonProps} onTabChange={setActiveTab} />;
      case 'rooms':
        return <GridBasedRoomManagement {...commonProps} />;
      case 'checkin-checkout':
        return <ModernCheckInOut {...commonProps} />;
      case 'guests':
        return <ModernGuestLookup {...commonProps} />;
      case 'housekeeping':
        return <ModernHousekeeping {...commonProps} />;
      case 'reservations':
        return <ModernReservations {...commonProps} />;
      case 'shift-report':
        return <ModernShiftReport {...commonProps} />;
      default:
        return <ModernDashboardOverview {...commonProps} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ModernSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
      )}>
        {/* Top navigation */}
        <ModernTopbar
          user={user}
          hotel={hotel}
          notifications={notifications}
          onAccountAction={handleAccountAction}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernManagerDashboard;
