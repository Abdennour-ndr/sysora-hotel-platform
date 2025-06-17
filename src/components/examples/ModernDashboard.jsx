import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Input, Navbar, Sidebar } from '../ui';

/**
 * Modern Dashboard Example using the new Sysora Design System
 * This demonstrates how to build a professional hotel management dashboard
 */
const ModernDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Sample data
  const user = {
    name: 'Ahmed Hassan',
    email: 'ahmed@hotel-sysora.com'
  };

  const stats = [
    {
      title: 'Total Rooms',
      value: '24',
      change: '+2 this month',
      changeType: 'positive',
      color: 'primary',
      icon: <RoomsIcon />
    },
    {
      title: 'Occupancy Rate',
      value: '87%',
      change: '+5% from last week',
      changeType: 'positive',
      color: 'success',
      icon: <OccupancyIcon />
    },
    {
      title: 'Revenue Today',
      value: '$2,450',
      change: '-3% from yesterday',
      changeType: 'negative',
      color: 'warning',
      icon: <RevenueIcon />
    },
    {
      title: 'Active Guests',
      value: '156',
      change: '+12 check-ins today',
      changeType: 'positive',
      color: 'info',
      icon: <GuestsIcon />
    }
  ];

  const sidebarNavigation = [
    {
      title: 'Main',
      items: [
        {
          label: 'Overview',
          icon: <DashboardIcon />,
          active: activeSection === 'overview',
          onClick: () => setActiveSection('overview')
        },
        {
          label: 'Rooms',
          icon: <RoomsIcon />,
          active: activeSection === 'rooms',
          badge: { text: '24', variant: 'info' },
          onClick: () => setActiveSection('rooms')
        },
        {
          label: 'Reservations',
          icon: <ReservationsIcon />,
          active: activeSection === 'reservations',
          badge: { text: 'New', variant: 'warning' },
          onClick: () => setActiveSection('reservations')
        },
        {
          label: 'Guests',
          icon: <GuestsIcon />,
          active: activeSection === 'guests',
          onClick: () => setActiveSection('guests')
        },
      ]
    },
    {
      title: 'Analytics',
      items: [
        {
          label: 'Reports',
          icon: <ReportsIcon />,
          active: activeSection === 'reports',
          onClick: () => setActiveSection('reports')
        },
        {
          label: 'Analytics',
          icon: <AnalyticsIcon />,
          active: activeSection === 'analytics',
          onClick: () => setActiveSection('analytics')
        },
      ]
    },
    {
      title: 'Management',
      items: [
        {
          label: 'Staff',
          icon: <StaffIcon />,
          active: activeSection === 'staff',
          onClick: () => setActiveSection('staff')
        },
        {
          label: 'Settings',
          icon: <SettingsIcon />,
          active: activeSection === 'settings',
          onClick: () => setActiveSection('settings')
        },
      ]
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'check-in',
      title: 'Guest Check-in',
      description: 'John Smith checked into Room 205',
      time: '5 minutes ago',
      icon: <CheckInIcon />
    },
    {
      id: 2,
      type: 'booking',
      title: 'New Reservation',
      description: 'Room 101 booked for next week',
      time: '15 minutes ago',
      icon: <BookingIcon />
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Request',
      description: 'AC repair needed in Room 305',
      time: '1 hour ago',
      icon: <MaintenanceIcon />
    },
  ];

  return (
    <div className="min-h-screen bg-sysora-light flex">
      {/* Sidebar */}
      <Sidebar
        logoText="Sysora"
        navigation={sidebarNavigation}
        user={user}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={(item) => item.onClick?.()}
        variant="gradient"
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sysora-midnight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-neutral-600 mt-1">
                Here's what's happening at your hotel today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" icon={<SearchIcon />}>
                Search
              </Button>
              <Button variant="primary" size="sm" icon={<PlusIcon />}>
                Quick Add
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card.Stats
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    changeType={stat.changeType}
                    color={stat.color}
                    icon={stat.icon}
                  />
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <Card.Header>
                    <Card.Title>Recent Activity</Card.Title>
                    <Card.Description>
                      Latest updates from your hotel operations
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-sysora-mint/10 rounded-xl flex items-center justify-center text-sysora-mint">
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-neutral-600">
                              {activity.description}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card.Content>
                  <Card.Footer>
                    <Button variant="ghost" size="sm" fullWidth>
                      View All Activities
                    </Button>
                  </Card.Footer>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Quick Actions</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <Button variant="primary" fullWidth icon={<PlusIcon />}>
                        New Reservation
                      </Button>
                      <Button variant="secondary" fullWidth icon={<UserPlusIcon />}>
                        Add Guest
                      </Button>
                      <Button variant="outline" fullWidth icon={<RoomIcon />}>
                        Add Room
                      </Button>
                      <Button variant="ghost" fullWidth icon={<ReportIcon />}>
                        Generate Report
                      </Button>
                    </div>
                  </Card.Content>
                </Card>

                <Card variant="gradient">
                  <Card.Header>
                    <Card.Title>Today's Summary</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Check-ins</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Check-outs</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Maintenance</span>
                        <span className="font-semibold text-warning-600">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Revenue</span>
                        <span className="font-semibold text-success-600">$2,450</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Icons (replace with your preferred icon library)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
);

const RoomsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ReservationsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const GuestsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ReportsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const StaffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const OccupancyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const RevenueIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CheckInIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

const BookingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const RoomIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default ModernDashboard;
