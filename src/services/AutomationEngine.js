// Automation Engine - Intelligent automation for hotel operations
class AutomationEngine {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    this.automationRules = new Map();
    this.activeAutomations = new Set();
    this.scheduledTasks = new Map();
    this.eventListeners = new Map();
    this.isRunning = false;
  }

  // Initialize automation engine
  async initialize() {
    console.log('🤖 Initializing Automation Engine...');
    
    try {
      await this.loadAutomationRules();
      await this.setupEventListeners();
      await this.startScheduledTasks();
      
      this.isRunning = true;
      console.log('✅ Automation Engine initialized successfully');
      
      return { success: true, message: 'Automation engine started' };
    } catch (error) {
      console.error('❌ Failed to initialize automation engine:', error);
      return { success: false, message: error.message };
    }
  }

  // Load automation rules from server
  async loadAutomationRules() {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/automation/rules`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const rules = data.rules || this.getDefaultRules();
        
        rules.forEach(rule => {
          this.automationRules.set(rule.id, rule);
        });
        
        console.log(`📋 Loaded ${rules.length} automation rules`);
      } else {
        // Use default rules if server unavailable
        this.loadDefaultRules();
      }
    } catch (error) {
      console.error('Error loading automation rules:', error);
      this.loadDefaultRules();
    }
  }

  // Get default automation rules
  getDefaultRules() {
    return [
      {
        id: 'auto_checkin_reminder',
        name: 'Automatic Check-in Reminders',
        type: 'scheduled',
        trigger: { time: '08:00', frequency: 'daily' },
        condition: { status: 'confirmed', checkInDate: 'today' },
        action: { type: 'send_notification', template: 'checkin_reminder' },
        enabled: true,
        priority: 'high'
      },
      {
        id: 'auto_checkout_reminder',
        name: 'Automatic Check-out Reminders',
        type: 'scheduled',
        trigger: { time: '10:00', frequency: 'daily' },
        condition: { status: 'checked_in', checkOutDate: 'today' },
        action: { type: 'send_notification', template: 'checkout_reminder' },
        enabled: true,
        priority: 'medium'
      },
      {
        id: 'auto_payment_followup',
        name: 'Payment Follow-up',
        type: 'event',
        trigger: { event: 'reservation_created' },
        condition: { paymentStatus: 'pending', delay: '24h' },
        action: { type: 'send_payment_reminder' },
        enabled: true,
        priority: 'high'
      },
      {
        id: 'auto_room_status_update',
        name: 'Room Status Auto-Update',
        type: 'event',
        trigger: { event: 'checkout_completed' },
        condition: { immediate: true },
        action: { type: 'update_room_status', status: 'cleaning' },
        enabled: true,
        priority: 'urgent'
      },
      {
        id: 'auto_overbooking_alert',
        name: 'Overbooking Prevention',
        type: 'realtime',
        trigger: { event: 'reservation_attempt' },
        condition: { occupancyRate: '>95%' },
        action: { type: 'alert_management', level: 'urgent' },
        enabled: true,
        priority: 'urgent'
      },
      {
        id: 'auto_guest_feedback',
        name: 'Guest Feedback Collection',
        type: 'scheduled',
        trigger: { delay: '2h', after: 'checkout_completed' },
        condition: { status: 'checked_out', feedbackSent: false },
        action: { type: 'send_feedback_request' },
        enabled: true,
        priority: 'low'
      },
      {
        id: 'auto_pricing_optimization',
        name: 'Dynamic Pricing Updates',
        type: 'scheduled',
        trigger: { time: '06:00', frequency: 'daily' },
        condition: { always: true },
        action: { type: 'update_dynamic_pricing' },
        enabled: true,
        priority: 'medium'
      },
      {
        id: 'auto_maintenance_scheduling',
        name: 'Maintenance Scheduling',
        type: 'event',
        trigger: { event: 'room_vacant' },
        condition: { vacantDays: '>2', maintenanceNeeded: true },
        action: { type: 'schedule_maintenance' },
        enabled: true,
        priority: 'medium'
      }
    ];
  }

  // Load default rules
  loadDefaultRules() {
    const defaultRules = this.getDefaultRules();
    defaultRules.forEach(rule => {
      this.automationRules.set(rule.id, rule);
    });
    console.log('📋 Loaded default automation rules');
  }

  // Setup event listeners for real-time automation
  async setupEventListeners() {
    // Listen for reservation events
    this.addEventListener('reservation_created', this.handleReservationCreated.bind(this));
    this.addEventListener('reservation_updated', this.handleReservationUpdated.bind(this));
    this.addEventListener('checkin_completed', this.handleCheckinCompleted.bind(this));
    this.addEventListener('checkout_completed', this.handleCheckoutCompleted.bind(this));
    this.addEventListener('payment_received', this.handlePaymentReceived.bind(this));
    this.addEventListener('room_status_changed', this.handleRoomStatusChanged.bind(this));
    
    console.log('👂 Event listeners setup complete');
  }

  // Add event listener
  addEventListener(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
  }

  // Trigger event
  async triggerEvent(eventType, data) {
    console.log(`🔔 Event triggered: ${eventType}`, data);
    
    const listeners = this.eventListeners.get(eventType) || [];
    
    for (const listener of listeners) {
      try {
        await listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    }
    
    // Check for automation rules triggered by this event
    await this.processEventTriggers(eventType, data);
  }

  // Process event-triggered automation rules
  async processEventTriggers(eventType, data) {
    const eventRules = Array.from(this.automationRules.values())
      .filter(rule => rule.type === 'event' && rule.trigger.event === eventType && rule.enabled);
    
    for (const rule of eventRules) {
      if (await this.evaluateCondition(rule.condition, data)) {
        await this.executeAction(rule, data);
      }
    }
  }

  // Start scheduled tasks
  async startScheduledTasks() {
    // Daily tasks
    this.scheduleDaily('08:00', () => this.runDailyAutomations());
    this.scheduleDaily('10:00', () => this.runCheckoutReminders());
    this.scheduleDaily('18:00', () => this.runPaymentFollowups());
    this.scheduleDaily('06:00', () => this.runPricingOptimization());
    
    // Hourly tasks
    this.scheduleHourly(() => this.runRealtimeChecks());
    
    console.log('⏰ Scheduled tasks started');
  }

  // Schedule daily task
  scheduleDaily(time, task) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      task();
      // Schedule for next day
      setInterval(task, 24 * 60 * 60 * 1000);
    }, delay);
  }

  // Schedule hourly task
  scheduleHourly(task) {
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
    const delay = nextHour.getTime() - now.getTime();
    
    setTimeout(() => {
      task();
      setInterval(task, 60 * 60 * 1000);
    }, delay);
  }

  // Run daily automations
  async runDailyAutomations() {
    console.log('🌅 Running daily automations...');
    
    const dailyRules = Array.from(this.automationRules.values())
      .filter(rule => rule.type === 'scheduled' && rule.trigger.frequency === 'daily' && rule.enabled);
    
    for (const rule of dailyRules) {
      try {
        await this.executeScheduledRule(rule);
      } catch (error) {
        console.error(`Error executing daily rule ${rule.id}:`, error);
      }
    }
  }

  // Execute scheduled rule
  async executeScheduledRule(rule) {
    console.log(`⚡ Executing scheduled rule: ${rule.name}`);
    
    // Get relevant data based on rule conditions
    const data = await this.getRelevantData(rule.condition);
    
    if (await this.evaluateCondition(rule.condition, data)) {
      await this.executeAction(rule, data);
    }
  }

  // Get relevant data for rule evaluation
  async getRelevantData(condition) {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data?.reservations || [];
      }
    } catch (error) {
      console.error('Error fetching relevant data:', error);
    }
    return [];
  }

  // Evaluate automation condition
  async evaluateCondition(condition, data) {
    if (condition.always) return true;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Filter data based on condition
    let filteredData = Array.isArray(data) ? data : [data];
    
    if (condition.status) {
      filteredData = filteredData.filter(item => item.status === condition.status);
    }
    
    if (condition.checkInDate === 'today') {
      filteredData = filteredData.filter(item => 
        item.checkInDate?.split('T')[0] === today
      );
    }
    
    if (condition.checkOutDate === 'today') {
      filteredData = filteredData.filter(item => 
        item.checkOutDate?.split('T')[0] === today
      );
    }
    
    if (condition.paymentStatus) {
      filteredData = filteredData.filter(item => {
        const totalAmount = item.totalAmount || 0;
        const paidAmount = item.paidAmount || 0;
        return condition.paymentStatus === 'pending' ? totalAmount > paidAmount : false;
      });
    }
    
    return filteredData.length > 0;
  }

  // Execute automation action
  async executeAction(rule, data) {
    console.log(`🎯 Executing action for rule: ${rule.name}`, rule.action);
    
    try {
      switch (rule.action.type) {
        case 'send_notification':
          await this.sendNotification(rule.action, data);
          break;
        case 'send_payment_reminder':
          await this.sendPaymentReminder(data);
          break;
        case 'update_room_status':
          await this.updateRoomStatus(rule.action, data);
          break;
        case 'alert_management':
          await this.alertManagement(rule.action, data);
          break;
        case 'send_feedback_request':
          await this.sendFeedbackRequest(data);
          break;
        case 'update_dynamic_pricing':
          await this.updateDynamicPricing();
          break;
        case 'schedule_maintenance':
          await this.scheduleMaintenance(data);
          break;
        default:
          console.log(`Unknown action type: ${rule.action.type}`);
      }
      
      // Log automation execution
      await this.logAutomationExecution(rule, data);
      
    } catch (error) {
      console.error(`Error executing action for rule ${rule.id}:`, error);
    }
  }

  // Send notification
  async sendNotification(action, data) {
    const notifications = Array.isArray(data) ? data : [data];
    
    for (const item of notifications) {
      const message = this.generateNotificationMessage(action.template, item);
      
      // Trigger notification in the UI
      if (window.showToast) {
        window.showToast(message, 'info');
      }
      
      console.log(`📧 Notification sent: ${message}`);
    }
  }

  // Generate notification message
  generateNotificationMessage(template, data) {
    const templates = {
      checkin_reminder: `Reminder: ${data.guestId?.firstName} ${data.guestId?.lastName} is checking in today to Room ${data.roomId?.number}`,
      checkout_reminder: `Reminder: ${data.guestId?.firstName} ${data.guestId?.lastName} is checking out today from Room ${data.roomId?.number}`,
      payment_reminder: `Payment reminder: ${data.guestId?.firstName} ${data.guestId?.lastName} has pending payment of ${((data.totalAmount || 0) - (data.paidAmount || 0)).toLocaleString()} DZD`
    };
    
    return templates[template] || `Automated notification for ${data.guestId?.firstName} ${data.guestId?.lastName}`;
  }

  // Send payment reminder
  async sendPaymentReminder(data) {
    const reservations = Array.isArray(data) ? data : [data];
    
    for (const reservation of reservations) {
      const balance = (reservation.totalAmount || 0) - (reservation.paidAmount || 0);
      if (balance > 0) {
        const message = `Payment reminder: ${reservation.guestId?.firstName} ${reservation.guestId?.lastName} has pending balance of ${balance.toLocaleString()} DZD`;
        
        if (window.showToast) {
          window.showToast(message, 'warning');
        }
        
        console.log(`💰 Payment reminder sent: ${message}`);
      }
    }
  }

  // Update room status
  async updateRoomStatus(action, data) {
    try {
      const token = localStorage.getItem('sysora_token');
      const roomId = data.roomId?._id || data.roomId;
      
      if (roomId) {
        const response = await fetch(`${this.apiBase}/api/rooms/${roomId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: action.status })
        });
        
        if (response.ok) {
          console.log(`🏨 Room status updated to: ${action.status}`);
        }
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  }

  // Alert management
  async alertManagement(action, data) {
    const message = `${action.level.toUpperCase()} ALERT: ${JSON.stringify(data)}`;
    
    if (window.showToast) {
      window.showToast(message, action.level === 'urgent' ? 'error' : 'warning');
    }
    
    console.log(`🚨 Management alert: ${message}`);
  }

  // Send feedback request
  async sendFeedbackRequest(data) {
    const reservations = Array.isArray(data) ? data : [data];
    
    for (const reservation of reservations) {
      if (reservation.status === 'checked_out' && !reservation.guestRating) {
        const message = `Feedback request sent to ${reservation.guestId?.firstName} ${reservation.guestId?.lastName}`;
        
        if (window.showToast) {
          window.showToast(message, 'info');
        }
        
        console.log(`⭐ Feedback request: ${message}`);
      }
    }
  }

  // Update dynamic pricing
  async updateDynamicPricing() {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${this.apiBase}/api/pricing/update-dynamic`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('💰 Dynamic pricing updated successfully');
        
        if (window.showToast) {
          window.showToast('Dynamic pricing updated', 'success');
        }
      }
    } catch (error) {
      console.error('Error updating dynamic pricing:', error);
    }
  }

  // Schedule maintenance
  async scheduleMaintenance(data) {
    try {
      const token = localStorage.getItem('sysora_token');
      const roomId = data.roomId?._id || data.roomId;
      
      if (roomId) {
        const response = await fetch(`${this.apiBase}/api/maintenance/schedule`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            roomId,
            type: 'routine',
            priority: 'medium',
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          })
        });
        
        if (response.ok) {
          console.log(`🔧 Maintenance scheduled for room ${roomId}`);
        }
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
    }
  }

  // Log automation execution
  async logAutomationExecution(rule, data) {
    const logEntry = {
      ruleId: rule.id,
      ruleName: rule.name,
      executedAt: new Date().toISOString(),
      dataCount: Array.isArray(data) ? data.length : 1,
      success: true
    };
    
    console.log('📝 Automation executed:', logEntry);
  }

  // Run realtime checks
  async runRealtimeChecks() {
    console.log('🔄 Running realtime checks...');
    
    const realtimeRules = Array.from(this.automationRules.values())
      .filter(rule => rule.type === 'realtime' && rule.enabled);
    
    for (const rule of realtimeRules) {
      try {
        await this.executeScheduledRule(rule);
      } catch (error) {
        console.error(`Error in realtime check ${rule.id}:`, error);
      }
    }
  }

  // Stop automation engine
  stop() {
    this.isRunning = false;
    this.activeAutomations.clear();
    this.scheduledTasks.clear();
    console.log('🛑 Automation Engine stopped');
  }

  // Get automation status
  getStatus() {
    return {
      isRunning: this.isRunning,
      rulesCount: this.automationRules.size,
      activeAutomations: this.activeAutomations.size,
      scheduledTasks: this.scheduledTasks.size
    };
  }
}

// Create singleton instance
const automationEngine = new AutomationEngine();

export default automationEngine;
