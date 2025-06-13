// Integration Hub - Centralized integration management for external systems
class IntegrationHub {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    this.integrations = new Map();
    this.webhooks = new Map();
    this.syncQueue = [];
    this.isInitialized = false;
  }

  // Initialize integration hub
  async initialize() {
    console.log('🔗 Initializing Integration Hub...');
    
    try {
      await this.loadIntegrations();
      await this.setupWebhooks();
      await this.startSyncProcesses();
      
      this.isInitialized = true;
      console.log('✅ Integration Hub initialized successfully');
      
      return { success: true, message: 'Integration hub started' };
    } catch (error) {
      console.error('❌ Failed to initialize integration hub:', error);
      return { success: false, message: error.message };
    }
  }

  // Load available integrations
  async loadIntegrations() {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/integrations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const integrations = data.integrations || this.getDefaultIntegrations();
        
        integrations.forEach(integration => {
          this.integrations.set(integration.id, integration);
        });
        
        console.log(`🔌 Loaded ${integrations.length} integrations`);
      } else {
        this.loadDefaultIntegrations();
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
      this.loadDefaultIntegrations();
    }
  }

  // Get default integrations
  getDefaultIntegrations() {
    return [
      {
        id: 'booking_com',
        name: 'Booking.com',
        type: 'channel_manager',
        status: 'connected',
        category: 'OTA',
        description: 'Online travel agency integration',
        features: ['reservations', 'rates', 'availability', 'reviews'],
        config: {
          apiKey: '***hidden***',
          propertyId: 'DEMO123',
          endpoint: 'https://distribution-xml.booking.com/2.0/',
          syncInterval: 300 // 5 minutes
        },
        lastSync: new Date(Date.now() - 10 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'expedia',
        name: 'Expedia',
        type: 'channel_manager',
        status: 'connected',
        category: 'OTA',
        description: 'Expedia Group integration',
        features: ['reservations', 'rates', 'availability'],
        config: {
          apiKey: '***hidden***',
          hotelId: 'DEMO456',
          endpoint: 'https://services.expediapartnercentral.com/eqc/',
          syncInterval: 600 // 10 minutes
        },
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'stripe',
        name: 'Stripe',
        type: 'payment_gateway',
        status: 'connected',
        category: 'Payment',
        description: 'Payment processing integration',
        features: ['payments', 'refunds', 'subscriptions', 'webhooks'],
        config: {
          publishableKey: 'pk_test_***',
          secretKey: '***hidden***',
          webhookSecret: '***hidden***',
          endpoint: 'https://api.stripe.com/v1/'
        },
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks',
        type: 'accounting',
        status: 'disconnected',
        category: 'Finance',
        description: 'Accounting and financial management',
        features: ['invoices', 'expenses', 'reports', 'taxes'],
        config: {
          clientId: '***hidden***',
          clientSecret: '***hidden***',
          sandbox: true,
          endpoint: 'https://sandbox-quickbooks.api.intuit.com/'
        },
        lastSync: null,
        syncStatus: 'pending',
        enabled: false
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        type: 'marketing',
        status: 'connected',
        category: 'Marketing',
        description: 'Email marketing and automation',
        features: ['campaigns', 'lists', 'automation', 'analytics'],
        config: {
          apiKey: '***hidden***',
          listId: 'abc123',
          endpoint: 'https://us1.api.mailchimp.com/3.0/'
        },
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'google_analytics',
        name: 'Google Analytics',
        type: 'analytics',
        status: 'connected',
        category: 'Analytics',
        description: 'Web analytics and insights',
        features: ['tracking', 'reports', 'goals', 'audiences'],
        config: {
          trackingId: 'GA-DEMO-123',
          propertyId: '123456789',
          endpoint: 'https://www.googleapis.com/analytics/v3/'
        },
        lastSync: new Date(Date.now() - 60 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'twilio',
        name: 'Twilio',
        type: 'communication',
        status: 'connected',
        category: 'Communication',
        description: 'SMS and voice communication',
        features: ['sms', 'voice', 'whatsapp', 'notifications'],
        config: {
          accountSid: 'AC***hidden***',
          authToken: '***hidden***',
          phoneNumber: '+1234567890',
          endpoint: 'https://api.twilio.com/2010-04-01/'
        },
        lastSync: new Date(Date.now() - 20 * 60 * 1000),
        syncStatus: 'success',
        enabled: true
      },
      {
        id: 'opera_pms',
        name: 'Opera PMS',
        type: 'pms',
        status: 'disconnected',
        category: 'PMS',
        description: 'Property Management System integration',
        features: ['reservations', 'guests', 'rooms', 'billing'],
        config: {
          serverUrl: 'https://demo.opera.com/',
          username: '***hidden***',
          password: '***hidden***',
          hotelCode: 'DEMO'
        },
        lastSync: null,
        syncStatus: 'pending',
        enabled: false
      }
    ];
  }

  // Load default integrations
  loadDefaultIntegrations() {
    const defaultIntegrations = this.getDefaultIntegrations();
    defaultIntegrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });
    console.log('🔌 Loaded default integrations');
  }

  // Setup webhooks for real-time data sync
  async setupWebhooks() {
    const webhookEndpoints = [
      {
        id: 'stripe_webhook',
        url: `${this.apiBase}/webhooks/stripe`,
        events: ['payment_intent.succeeded', 'payment_intent.payment_failed'],
        integration: 'stripe'
      },
      {
        id: 'booking_webhook',
        url: `${this.apiBase}/webhooks/booking`,
        events: ['reservation.created', 'reservation.modified', 'reservation.cancelled'],
        integration: 'booking_com'
      },
      {
        id: 'expedia_webhook',
        url: `${this.apiBase}/webhooks/expedia`,
        events: ['booking.created', 'booking.modified', 'booking.cancelled'],
        integration: 'expedia'
      }
    ];

    webhookEndpoints.forEach(webhook => {
      this.webhooks.set(webhook.id, webhook);
    });

    console.log('🪝 Webhooks setup complete');
  }

  // Start sync processes
  async startSyncProcesses() {
    // Start periodic sync for each enabled integration
    this.integrations.forEach(integration => {
      if (integration.enabled && integration.config.syncInterval) {
        this.scheduleSync(integration);
      }
    });

    console.log('🔄 Sync processes started');
  }

  // Schedule sync for an integration
  scheduleSync(integration) {
    const interval = integration.config.syncInterval * 1000; // Convert to milliseconds
    
    setInterval(async () => {
      await this.syncIntegration(integration.id);
    }, interval);

    console.log(`⏰ Scheduled sync for ${integration.name} every ${integration.config.syncInterval} seconds`);
  }

  // Sync specific integration
  async syncIntegration(integrationId) {
    const integration = this.integrations.get(integrationId);
    if (!integration || !integration.enabled) {
      return { success: false, message: 'Integration not found or disabled' };
    }

    console.log(`🔄 Syncing ${integration.name}...`);

    try {
      const result = await this.performSync(integration);
      
      // Update last sync time and status
      integration.lastSync = new Date();
      integration.syncStatus = result.success ? 'success' : 'error';
      
      console.log(`✅ Sync completed for ${integration.name}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Sync failed for ${integration.name}:`, error);
      integration.syncStatus = 'error';
      return { success: false, message: error.message };
    }
  }

  // Perform actual sync based on integration type
  async performSync(integration) {
    switch (integration.type) {
      case 'channel_manager':
        return await this.syncChannelManager(integration);
      case 'payment_gateway':
        return await this.syncPaymentGateway(integration);
      case 'accounting':
        return await this.syncAccounting(integration);
      case 'marketing':
        return await this.syncMarketing(integration);
      case 'analytics':
        return await this.syncAnalytics(integration);
      case 'communication':
        return await this.syncCommunication(integration);
      case 'pms':
        return await this.syncPMS(integration);
      default:
        return { success: false, message: 'Unknown integration type' };
    }
  }

  // Sync channel manager (OTA)
  async syncChannelManager(integration) {
    try {
      const token = localStorage.getItem('sysora_token');
      
      // Sync reservations
      const reservationsResponse = await fetch(`${this.apiBase}/api/integrations/${integration.id}/sync/reservations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lastSync: integration.lastSync,
          config: integration.config
        })
      });

      // Sync rates and availability
      const ratesResponse = await fetch(`${this.apiBase}/api/integrations/${integration.id}/sync/rates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: integration.config
        })
      });

      const reservationsData = reservationsResponse.ok ? await reservationsResponse.json() : null;
      const ratesData = ratesResponse.ok ? await ratesResponse.json() : null;

      return {
        success: true,
        message: 'Channel manager sync completed',
        data: {
          reservations: reservationsData?.count || 0,
          rates: ratesData?.count || 0
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync payment gateway
  async syncPaymentGateway(integration) {
    try {
      // Simulate payment sync
      const payments = await this.fetchRecentPayments(integration);
      
      return {
        success: true,
        message: 'Payment gateway sync completed',
        data: { payments: payments.length }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync accounting system
  async syncAccounting(integration) {
    try {
      // Simulate accounting sync
      return {
        success: true,
        message: 'Accounting sync completed',
        data: { invoices: 5, expenses: 3 }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync marketing platform
  async syncMarketing(integration) {
    try {
      // Simulate marketing sync
      return {
        success: true,
        message: 'Marketing sync completed',
        data: { contacts: 25, campaigns: 2 }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync analytics platform
  async syncAnalytics(integration) {
    try {
      // Simulate analytics sync
      return {
        success: true,
        message: 'Analytics sync completed',
        data: { sessions: 1250, pageviews: 3500 }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync communication platform
  async syncCommunication(integration) {
    try {
      // Simulate communication sync
      return {
        success: true,
        message: 'Communication sync completed',
        data: { messages: 15, calls: 3 }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Sync PMS
  async syncPMS(integration) {
    try {
      // Simulate PMS sync
      return {
        success: true,
        message: 'PMS sync completed',
        data: { reservations: 8, guests: 12 }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Fetch recent payments (simulated)
  async fetchRecentPayments(integration) {
    // Simulate API call to payment gateway
    return [
      { id: 'pay_1', amount: 15000, status: 'succeeded' },
      { id: 'pay_2', amount: 8500, status: 'succeeded' },
      { id: 'pay_3', amount: 12000, status: 'pending' }
    ];
  }

  // Connect new integration
  async connectIntegration(integrationId, config) {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/integrations/${integrationId}/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        const integration = this.integrations.get(integrationId);
        if (integration) {
          integration.status = 'connected';
          integration.enabled = true;
          integration.config = { ...integration.config, ...config };
          
          // Start sync for newly connected integration
          if (integration.config.syncInterval) {
            this.scheduleSync(integration);
          }
        }
        
        return { success: true, message: 'Integration connected successfully' };
      } else {
        return { success: false, message: 'Failed to connect integration' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Disconnect integration
  async disconnectIntegration(integrationId) {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/integrations/${integrationId}/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const integration = this.integrations.get(integrationId);
        if (integration) {
          integration.status = 'disconnected';
          integration.enabled = false;
        }
        
        return { success: true, message: 'Integration disconnected successfully' };
      } else {
        return { success: false, message: 'Failed to disconnect integration' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get all integrations
  getAllIntegrations() {
    return Array.from(this.integrations.values());
  }

  // Get integration by ID
  getIntegration(integrationId) {
    return this.integrations.get(integrationId);
  }

  // Get integrations by category
  getIntegrationsByCategory(category) {
    return Array.from(this.integrations.values()).filter(
      integration => integration.category === category
    );
  }

  // Get integration status
  getIntegrationStatus() {
    const integrations = Array.from(this.integrations.values());
    const connected = integrations.filter(i => i.status === 'connected').length;
    const total = integrations.length;
    
    return {
      total,
      connected,
      disconnected: total - connected,
      categories: this.getIntegrationCategories()
    };
  }

  // Get integration categories
  getIntegrationCategories() {
    const categories = {};
    this.integrations.forEach(integration => {
      if (!categories[integration.category]) {
        categories[integration.category] = 0;
      }
      categories[integration.category]++;
    });
    return categories;
  }

  // Process webhook
  async processWebhook(webhookId, payload) {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) {
      return { success: false, message: 'Webhook not found' };
    }

    console.log(`🪝 Processing webhook: ${webhookId}`, payload);

    try {
      // Process webhook based on integration type
      const integration = this.integrations.get(webhook.integration);
      if (integration) {
        await this.handleWebhookData(integration, payload);
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return { success: false, message: error.message };
    }
  }

  // Handle webhook data
  async handleWebhookData(integration, payload) {
    switch (integration.type) {
      case 'payment_gateway':
        await this.handlePaymentWebhook(payload);
        break;
      case 'channel_manager':
        await this.handleChannelManagerWebhook(payload);
        break;
      default:
        console.log('Unhandled webhook type:', integration.type);
    }
  }

  // Handle payment webhook
  async handlePaymentWebhook(payload) {
    console.log('💳 Processing payment webhook:', payload);
    // Update payment status in database
    // Trigger notifications if needed
  }

  // Handle channel manager webhook
  async handleChannelManagerWebhook(payload) {
    console.log('🏨 Processing channel manager webhook:', payload);
    // Update reservation data
    // Sync room availability
  }

  // Get sync queue status
  getSyncQueueStatus() {
    return {
      pending: this.syncQueue.length,
      processing: this.syncQueue.filter(item => item.status === 'processing').length,
      failed: this.syncQueue.filter(item => item.status === 'failed').length
    };
  }
}

// Create singleton instance
const integrationHub = new IntegrationHub();

export default integrationHub;
