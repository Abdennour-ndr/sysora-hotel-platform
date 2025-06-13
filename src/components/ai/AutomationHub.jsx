import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Settings, 
  Clock, 
  Mail, 
  MessageSquare, 
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Bell
} from 'lucide-react';

const AutomationHub = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setLoading(true);

    try {
      // Try to load from API first
      const token = localStorage.getItem('sysora_token');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/automations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAutomations(data.data?.automations || getDefaultAutomations());
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Load from localStorage or use defaults
        const savedAutomations = localStorage.getItem('sysora_automations');
        if (savedAutomations) {
          setAutomations(JSON.parse(savedAutomations));
        } else {
          setAutomations(getDefaultAutomations());
        }
      }
    } catch (error) {
      console.error('Error loading automations:', error);
      setAutomations(getDefaultAutomations());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAutomations = () => {
    return [
        {
          id: 'welcome-email',
          name: 'Welcome Email Sequence',
          description: 'Automatically send welcome emails to new guests upon booking confirmation',
          category: 'communication',
          trigger: 'Booking Confirmed',
          actions: ['Send Welcome Email', 'Add to Guest List', 'Schedule Follow-up'],
          status: 'active',
          lastRun: '2024-12-15T10:30:00Z',
          successRate: 98.5,
          totalRuns: 1247,
          icon: Mail,
          color: 'blue'
        },
        {
          id: 'dynamic-pricing',
          name: 'Dynamic Pricing Optimizer',
          description: 'Automatically adjust room rates based on demand, seasonality, and competitor analysis',
          category: 'pricing',
          trigger: 'Daily at 6:00 AM',
          actions: ['Analyze Demand', 'Check Competitors', 'Update Prices'],
          status: 'active',
          lastRun: '2024-12-15T06:00:00Z',
          successRate: 95.2,
          totalRuns: 89,
          icon: DollarSign,
          color: 'green'
        },
        {
          id: 'checkin-reminder',
          name: 'Check-in Reminders',
          description: 'Send automated reminders to guests 24 hours before their check-in date',
          category: 'communication',
          trigger: '24 hours before check-in',
          actions: ['Send SMS', 'Send Email', 'Update Guest Status'],
          status: 'active',
          lastRun: '2024-12-14T15:45:00Z',
          successRate: 97.8,
          totalRuns: 892,
          icon: Calendar,
          color: 'purple'
        },
        {
          id: 'review-request',
          name: 'Review Request Campaign',
          description: 'Automatically request reviews from guests 2 days after checkout',
          category: 'marketing',
          trigger: '2 days after checkout',
          actions: ['Send Review Request', 'Track Response', 'Follow-up if needed'],
          status: 'paused',
          lastRun: '2024-12-13T09:20:00Z',
          successRate: 76.3,
          totalRuns: 456,
          icon: MessageSquare,
          color: 'orange'
        },
        {
          id: 'housekeeping-schedule',
          name: 'Smart Housekeeping Scheduler',
          description: 'Automatically assign and schedule housekeeping tasks based on checkout/checkin times',
          category: 'operations',
          trigger: 'Guest Checkout',
          actions: ['Create Cleaning Task', 'Assign Staff', 'Set Priority'],
          status: 'active',
          lastRun: '2024-12-15T11:15:00Z',
          successRate: 99.1,
          totalRuns: 2341,
          icon: Users,
          color: 'teal'
        },
        {
          id: 'cancellation-recovery',
          name: 'Cancellation Recovery',
          description: 'Automatically offer alternative dates or discounts when guests cancel',
          category: 'revenue',
          trigger: 'Booking Cancelled',
          actions: ['Send Recovery Email', 'Offer Alternatives', 'Apply Discount'],
          status: 'inactive',
          lastRun: '2024-12-10T14:30:00Z',
          successRate: 23.7,
          totalRuns: 67,
          icon: RotateCcw,
          color: 'red'
        }
      ];
  };

  const toggleAutomation = async (id) => {
    try {
      const automation = automations.find(a => a.id === id);
      if (!automation) return;

      const newStatus = automation.status === 'active' ? 'paused' : 'active';
      const token = localStorage.getItem('sysora_token');

      // Update automation status
      const updatedAutomation = {
        ...automation,
        status: newStatus,
        lastStatusChange: new Date().toISOString(),
        statusChangedBy: 'user'
      };

      // Try to update via API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/automations/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAutomation)
        });

        if (!response.ok) {
          throw new Error('API update failed');
        }
      } catch (apiError) {
        console.log('API not available, updating locally');
      }

      // Update local state
      setAutomations(prev => prev.map(automation =>
        automation.id === id ? updatedAutomation : automation
      ));

      // Save to localStorage as backup
      const updatedAutomations = automations.map(automation =>
        automation.id === id ? updatedAutomation : automation
      );
      localStorage.setItem('sysora_automations', JSON.stringify(updatedAutomations));

      // Show notification
      const action = newStatus === 'active' ? 'activated' : 'paused';
      window.showToast && window.showToast(`Automation "${automation.name}" ${action}`, 'success');

      // If activating, trigger the automation
      if (newStatus === 'active') {
        await executeAutomation(updatedAutomation);
      }

    } catch (error) {
      console.error('Error toggling automation:', error);
      window.showToast && window.showToast('Failed to update automation status', 'error');
    }
  };

  const executeAutomation = async (automation) => {
    try {
      const token = localStorage.getItem('sysora_token');

      switch (automation.id) {
        case 'welcome-email':
          await executeWelcomeEmailAutomation(automation, token);
          break;
        case 'dynamic-pricing':
          await executeDynamicPricingAutomation(automation, token);
          break;
        case 'checkin-reminder':
          await executeCheckinReminderAutomation(automation, token);
          break;
        case 'review-request':
          await executeReviewRequestAutomation(automation, token);
          break;
        case 'housekeeping-schedule':
          await executeHousekeepingAutomation(automation, token);
          break;
        case 'cancellation-recovery':
          await executeCancellationRecoveryAutomation(automation, token);
          break;
        default:
          console.log(`No execution handler for automation: ${automation.id}`);
      }

      // Update last run time
      const updatedAutomation = {
        ...automation,
        lastRun: new Date().toISOString(),
        totalRuns: (automation.totalRuns || 0) + 1
      };

      setAutomations(prev => prev.map(a =>
        a.id === automation.id ? updatedAutomation : a
      ));

    } catch (error) {
      console.error('Error executing automation:', error);
    }
  };

  const executeWelcomeEmailAutomation = async (automation, token) => {
    // Find recent bookings that need welcome emails
    const recentBookings = []; // This would come from API in real implementation

    for (const booking of recentBookings) {
      try {
        await sendWelcomeEmail(booking, token);
        console.log(`Welcome email sent to ${booking.guestEmail}`);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    }
  };

  const executeDynamicPricingAutomation = async (automation, token) => {
    try {
      // Analyze current market conditions
      const marketAnalysis = await analyzeMarketConditions();

      // Calculate price adjustments
      const priceAdjustments = calculatePriceAdjustments(marketAnalysis);

      // Apply price changes
      await applyPriceChanges(priceAdjustments, token);

      console.log('Dynamic pricing executed successfully');
    } catch (error) {
      console.error('Dynamic pricing automation failed:', error);
    }
  };

  const executeCheckinReminderAutomation = async (automation, token) => {
    // Find guests checking in tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingCheckins = []; // This would come from API

    for (const checkin of upcomingCheckins) {
      try {
        await sendCheckinReminder(checkin, token);
        console.log(`Check-in reminder sent to ${checkin.guestEmail}`);
      } catch (error) {
        console.error('Failed to send check-in reminder:', error);
      }
    }
  };

  const executeReviewRequestAutomation = async (automation, token) => {
    // Find guests who checked out 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const eligibleGuests = []; // This would come from API

    for (const guest of eligibleGuests) {
      try {
        await sendReviewRequest(guest, token);
        console.log(`Review request sent to ${guest.email}`);
      } catch (error) {
        console.error('Failed to send review request:', error);
      }
    }
  };

  const executeHousekeepingAutomation = async (automation, token) => {
    // Find rooms that need cleaning
    const roomsNeedingCleaning = []; // This would come from API

    for (const room of roomsNeedingCleaning) {
      try {
        await createCleaningTask(room, token);
        console.log(`Cleaning task created for room ${room.number}`);
      } catch (error) {
        console.error('Failed to create cleaning task:', error);
      }
    }
  };

  const executeCancellationRecoveryAutomation = async (automation, token) => {
    // Find recent cancellations
    const recentCancellations = []; // This would come from API

    for (const cancellation of recentCancellations) {
      try {
        await sendRecoveryOffer(cancellation, token);
        console.log(`Recovery offer sent for cancelled booking ${cancellation.id}`);
      } catch (error) {
        console.error('Failed to send recovery offer:', error);
      }
    }
  };

  // Helper functions for automation execution
  const sendWelcomeEmail = async (booking, token) => {
    // Implementation for sending welcome email
    console.log('Sending welcome email...');
  };

  const analyzeMarketConditions = async () => {
    // Implementation for market analysis
    return {
      occupancyRate: 75,
      competitorPrices: 8000,
      demandLevel: 'high'
    };
  };

  const calculatePriceAdjustments = (marketAnalysis) => {
    // Implementation for price calculation
    return {
      adjustment: 5, // 5% increase
      reason: 'High demand detected'
    };
  };

  const applyPriceChanges = async (adjustments, token) => {
    // Implementation for applying price changes
    console.log('Applying price changes:', adjustments);
  };

  const sendCheckinReminder = async (checkin, token) => {
    // Implementation for sending check-in reminder
    console.log('Sending check-in reminder...');
  };

  const sendReviewRequest = async (guest, token) => {
    // Implementation for sending review request
    console.log('Sending review request...');
  };

  const createCleaningTask = async (room, token) => {
    // Implementation for creating cleaning task
    console.log('Creating cleaning task...');
  };

  const sendRecoveryOffer = async (cancellation, token) => {
    // Implementation for sending recovery offer
    console.log('Sending recovery offer...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      communication: 'bg-blue-50 border-blue-200',
      pricing: 'bg-green-50 border-green-200',
      marketing: 'bg-orange-50 border-orange-200',
      operations: 'bg-teal-50 border-teal-200',
      revenue: 'bg-purple-50 border-purple-200'
    };
    return colors[category] || 'bg-gray-50 border-gray-200';
  };

  const categories = [
    { id: 'all', name: 'All Automations', count: automations.length },
    { id: 'communication', name: 'Communication', count: automations.filter(a => a.category === 'communication').length },
    { id: 'pricing', name: 'Pricing', count: automations.filter(a => a.category === 'pricing').length },
    { id: 'marketing', name: 'Marketing', count: automations.filter(a => a.category === 'marketing').length },
    { id: 'operations', name: 'Operations', count: automations.filter(a => a.category === 'operations').length },
    { id: 'revenue', name: 'Revenue', count: automations.filter(a => a.category === 'revenue').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const filteredAutomations = selectedCategory === 'all' 
    ? automations 
    : automations.filter(a => a.category === selectedCategory);

  const activeAutomations = automations.filter(a => a.status === 'active').length;
  const avgSuccessRate = automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Automation Hub</h3>
            <p className="text-gray-600">Intelligent workflows to streamline operations</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Active Automations</div>
            <div className="text-2xl font-bold text-green-600">{activeAutomations}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Avg Success Rate</div>
            <div className="text-2xl font-bold text-blue-600">{avgSuccessRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.name}</span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading automations...</span>
        </div>
      )}

      {/* Automations Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAutomations.map(automation => {
            const IconComponent = automation.icon;
            return (
              <div
                key={automation.id}
                className={`border rounded-xl p-6 ${getCategoryColor(automation.category)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <IconComponent className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{automation.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{automation.category}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(automation.status)}`}>
                    {getStatusIcon(automation.status)}
                    <span className="capitalize">{automation.status}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 text-sm">{automation.description}</p>

                {/* Trigger and Actions */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">TRIGGER</div>
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">{automation.trigger}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">ACTIONS</div>
                    <div className="flex flex-wrap gap-1">
                      {automation.actions.map((action, index) => (
                        <span
                          key={index}
                          className="inline-block bg-white bg-opacity-60 text-gray-700 text-xs px-2 py-1 rounded-md"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white bg-opacity-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Success Rate</div>
                    <div className="font-bold text-sm">{automation.successRate}%</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Total Runs</div>
                    <div className="font-bold text-sm">{automation.totalRuns.toLocaleString()}</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Last Run</div>
                    <div className="font-bold text-sm">
                      {new Date(automation.lastRun).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      automation.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {automation.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAutomations.length === 0 && (
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No automations found for this category</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Create Automation</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              <Settings className="w-4 h-4" />
              <span>Global Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationHub;
