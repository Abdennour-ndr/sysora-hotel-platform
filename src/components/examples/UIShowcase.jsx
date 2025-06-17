import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Input, Navbar, Sidebar } from '../ui';

/**
 * UI Showcase Component - Demonstrates the new Sysora design system
 * This component shows how to use all the new UI components
 */
const UIShowcase = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');

  // Sample data for components
  const sampleUser = {
    name: 'Ahmed Hassan',
    email: 'ahmed@sysora.com'
  };

  const sampleNavigation = [
    { label: 'Dashboard', href: '#', active: true },
    { label: 'Rooms', href: '#' },
    { label: 'Reservations', href: '#' },
    { label: 'Guests', href: '#' },
    { label: 'Reports', href: '#' },
  ];

  const sampleActions = [
    { label: 'Login', variant: 'ghost', onClick: () => console.log('Login') },
    { label: 'Get Started', variant: 'primary', onClick: () => console.log('Get Started') },
  ];

  const sidebarNavigation = [
    {
      title: 'Main',
      items: [
        {
          label: 'Dashboard',
          icon: <DashboardIcon />,
          active: true,
          badge: { text: '5', variant: 'success' }
        },
        {
          label: 'Rooms',
          icon: <RoomsIcon />,
          badge: { text: '12', variant: 'info' }
        },
        {
          label: 'Reservations',
          icon: <ReservationsIcon />,
          badge: { text: 'New', variant: 'warning' }
        },
        {
          label: 'Guests',
          icon: <GuestsIcon />
        },
      ]
    },
    {
      title: 'Analytics',
      items: [
        {
          label: 'Reports',
          icon: <ReportsIcon />
        },
        {
          label: 'Analytics',
          icon: <AnalyticsIcon />
        },
      ]
    }
  ];

  const showcaseTabs = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'cards', label: 'Cards' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'navigation', label: 'Navigation' },
  ];

  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-sysora-midnight mb-2">
            Sysora Design System Showcase
          </h1>
          <p className="text-neutral-600">
            Professional UI components for modern hotel management
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {showcaseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-2 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-sysora-mint text-sysora-mint'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Buttons Showcase */}
          {activeTab === 'buttons' && (
            <div className="space-y-8">
              <Card>
                <Card.Header>
                  <Card.Title>Button Variants</Card.Title>
                  <Card.Description>
                    Different button styles for various use cases
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="success">Success Button</Button>
                    <Button variant="warning">Warning Button</Button>
                    <Button variant="error">Error Button</Button>
                    <Button variant="gradient">Gradient Button</Button>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Button Sizes</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="xs" variant="primary">Extra Small</Button>
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                    <Button size="xl" variant="primary">Extra Large</Button>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Button States</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" loading>Loading Button</Button>
                    <Button variant="primary" disabled>Disabled Button</Button>
                    <Button variant="primary" icon={<PlusIcon />}>With Icon</Button>
                    <Button variant="primary" icon={<ArrowIcon />} iconPosition="right">
                      Icon Right
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Cards Showcase */}
          {activeTab === 'cards' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="default" hover>
                  <Card.Header>
                    <Card.Title>Default Card</Card.Title>
                    <Card.Description>Basic card with hover effect</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-neutral-600">
                      This is a default card with hover animation and professional styling.
                    </p>
                  </Card.Content>
                </Card>

                <Card variant="elevated">
                  <Card.Header>
                    <Card.Title>Elevated Card</Card.Title>
                    <Card.Description>Card with enhanced shadow</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-neutral-600">
                      Elevated cards stand out with enhanced shadows and depth.
                    </p>
                  </Card.Content>
                </Card>

                <Card variant="gradient" interactive>
                  <Card.Header>
                    <Card.Title>Interactive Card</Card.Title>
                    <Card.Description>Clickable card with gradient</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-neutral-600">
                      Interactive cards respond to user interactions with smooth animations.
                    </p>
                  </Card.Content>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card.Stats
                  title="Total Rooms"
                  value="24"
                  change="+12%"
                  changeType="positive"
                  color="primary"
                  icon={<RoomsIcon />}
                />
                <Card.Stats
                  title="Occupancy Rate"
                  value="87%"
                  change="+5%"
                  changeType="positive"
                  color="success"
                  icon={<OccupancyIcon />}
                />
                <Card.Stats
                  title="Revenue"
                  value="$12,450"
                  change="-3%"
                  changeType="negative"
                  color="warning"
                  icon={<RevenueIcon />}
                />
                <Card.Stats
                  title="Guests"
                  value="156"
                  change="0%"
                  changeType="neutral"
                  color="info"
                  icon={<GuestsIcon />}
                />
              </div>
            </div>
          )}

          {/* Inputs Showcase */}
          {activeTab === 'inputs' && (
            <div className="space-y-8">
              <Card>
                <Card.Header>
                  <Card.Title>Input Variants</Card.Title>
                  <Card.Description>Different input styles and states</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Default Input"
                      placeholder="Enter your text"
                      helperText="This is a helper text"
                    />
                    <Input
                      label="Filled Input"
                      variant="filled"
                      placeholder="Enter your text"
                    />
                    <Input
                      label="Outlined Input"
                      variant="outlined"
                      placeholder="Enter your text"
                    />
                    <Input
                      label="Input with Icon"
                      placeholder="Search..."
                      icon={<SearchIcon />}
                    />
                    <Input
                      label="Success State"
                      placeholder="Valid input"
                      success="Input is valid!"
                      value="Valid input"
                    />
                    <Input
                      label="Error State"
                      placeholder="Invalid input"
                      error="This field is required"
                    />
                    <Input
                      label="Password Input"
                      type="password"
                      placeholder="Enter password"
                    />
                    <Input
                      label="Disabled Input"
                      placeholder="Disabled"
                      disabled
                      value="Disabled input"
                    />
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Navigation Showcase */}
          {activeTab === 'navigation' && (
            <div className="space-y-8">
              <Card>
                <Card.Header>
                  <Card.Title>Navigation Bar</Card.Title>
                  <Card.Description>Professional navigation with responsive design</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <Navbar
                      logoText="Sysora"
                      navigation={sampleNavigation}
                      actions={sampleActions}
                      user={sampleUser}
                      onUserMenuClick={(action) => console.log('User action:', action)}
                    />
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Sidebar Navigation</Card.Title>
                  <Card.Description>Collapsible sidebar with tooltips</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden h-96">
                    <Sidebar
                      logoText="Sysora"
                      navigation={sidebarNavigation}
                      user={sampleUser}
                      collapsed={sidebarCollapsed}
                      onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                      onNavigate={(item) => console.log('Navigate to:', item)}
                    />
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Sample Icons (you can replace with your preferred icon library)
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

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

export default UIShowcase;

// Export for easy access to showcase
export { UIShowcase };
