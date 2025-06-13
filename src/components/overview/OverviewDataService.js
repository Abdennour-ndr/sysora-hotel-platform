// Overview Data Service - نظام بيانات محلي متقدم للوحة التحكم
class OverviewDataService {
  constructor() {
    this.data = null;
    this.lastUpdate = null;
    this.updateInterval = null;
    this.listeners = new Set();
  }

  // تهيئة البيانات التجريبية الواقعية
  initializeMockData() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      // إحصائيات عامة
      overview: {
        totalRooms: 45,
        occupiedRooms: 32,
        availableRooms: 13,
        occupancyRate: 71.1,
        averageRate: 12500, // DZD
        totalGuests: 58,
        checkInsToday: 8,
        checkOutsToday: 5,
        pendingReservations: 12,
        maintenanceRooms: 2
      },

      // إحصائيات اليوم
      today: {
        date: today.toISOString(),
        checkIns: 8,
        checkOuts: 5,
        newReservations: 6,
        cancelledReservations: 1,
        revenue: 156000, // DZD
        pendingReservations: 12,
        walkIns: 2,
        noShows: 1,
        earlyCheckouts: 0,
        lateCheckouts: 2,
        roomServiceOrders: 15,
        maintenanceRequests: 3,
        complaints: 1,
        compliments: 4
      },

      // إحصائيات الإيرادات
      revenue: {
        daily: 156000,
        weekly: 980000,
        monthly: 3850000,
        yearly: 45600000,
        lastMonth: 3650000,
        growth: 5.5, // نسبة النمو
        averageDailyRate: 11200,
        revenuePerAvailableRoom: 7950,
        breakdown: {
          rooms: 2890000, // 75%
          food: 578000,   // 15%
          services: 231200, // 6%
          other: 150800   // 4%
        }
      },

      // حالة الغرف
      roomStatus: {
        occupied: 32,
        available: 13,
        maintenance: 2,
        cleaning: 3,
        outOfOrder: 1,
        reserved: 8,
        details: {
          single: { total: 15, occupied: 12, available: 3 },
          double: { total: 20, occupied: 15, available: 5 },
          suite: { total: 8, occupied: 4, available: 4 },
          deluxe: { total: 2, occupied: 1, available: 1 }
        }
      },

      // الحجوزات الحديثة
      recentReservations: [
        {
          id: 'RES-2024-001',
          guest: { name: 'Ahmed Benali', email: 'ahmed.benali@email.com', phone: '+213 555 123 456' },
          room: { number: '205', type: 'Double Room' },
          checkInDate: new Date(now.getTime() + 86400000).toISOString(), // غداً
          checkOutDate: new Date(now.getTime() + 259200000).toISOString(), // بعد 3 أيام
          status: 'confirmed',
          totalAmount: 25000,
          nights: 2,
          guests: 2,
          createdAt: new Date(now.getTime() - 3600000).toISOString() // منذ ساعة
        },
        {
          id: 'RES-2024-002',
          guest: { name: 'Fatima Zahra', email: 'fatima.zahra@email.com', phone: '+213 555 234 567' },
          room: { number: '301', type: 'Suite' },
          checkInDate: today.toISOString(),
          checkOutDate: new Date(now.getTime() + 172800000).toISOString(), // بعد يومين
          status: 'checked_in',
          totalAmount: 45000,
          nights: 2,
          guests: 2,
          createdAt: new Date(now.getTime() - 7200000).toISOString() // منذ ساعتين
        },
        {
          id: 'RES-2024-003',
          guest: { name: 'Mohamed Salim', email: 'mohamed.salim@email.com', phone: '+213 555 345 678' },
          room: { number: '102', type: 'Single Room' },
          checkInDate: new Date(now.getTime() + 172800000).toISOString(), // بعد يومين
          checkOutDate: new Date(now.getTime() + 345600000).toISOString(), // بعد 4 أيام
          status: 'pending',
          totalAmount: 18000,
          nights: 2,
          guests: 1,
          createdAt: new Date(now.getTime() - 1800000).toISOString() // منذ 30 دقيقة
        },
        {
          id: 'RES-2024-004',
          guest: { name: 'Amina Khelifi', email: 'amina.khelifi@email.com', phone: '+213 555 456 789' },
          room: { number: '401', type: 'Deluxe Suite' },
          checkInDate: today.toISOString(),
          checkOutDate: new Date(now.getTime() + 259200000).toISOString(), // بعد 3 أيام
          status: 'checked_in',
          totalAmount: 75000,
          nights: 3,
          guests: 2,
          createdAt: new Date(now.getTime() - 10800000).toISOString() // منذ 3 ساعات
        },
        {
          id: 'RES-2024-005',
          guest: { name: 'Youssef Brahimi', email: 'youssef.brahimi@email.com', phone: '+213 555 567 890' },
          room: { number: '203', type: 'Double Room' },
          checkInDate: new Date(now.getTime() + 86400000).toISOString(), // غداً
          checkOutDate: new Date(now.getTime() + 432000000).toISOString(), // بعد 5 أيام
          status: 'confirmed',
          totalAmount: 50000,
          nights: 4,
          guests: 3,
          createdAt: new Date(now.getTime() - 5400000).toISOString() // منذ 1.5 ساعة
        }
      ],

      // الأنشطة الحديثة
      recentActivities: [
        {
          id: 'ACT-001',
          type: 'checkin',
          title: 'Guest Check-in',
          description: 'Fatima Zahra checked into Room 301',
          timestamp: new Date(now.getTime() - 1800000).toISOString(), // منذ 30 دقيقة
          user: 'Front Desk',
          priority: 'normal'
        },
        {
          id: 'ACT-002',
          type: 'reservation',
          title: 'New Reservation',
          description: 'Mohamed Salim made a reservation for Room 102',
          timestamp: new Date(now.getTime() - 1800000).toISOString(),
          user: 'Online Booking',
          priority: 'normal'
        },
        {
          id: 'ACT-003',
          type: 'maintenance',
          title: 'Maintenance Request',
          description: 'Room 105 - Air conditioning repair needed',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // منذ ساعة
          user: 'Housekeeping',
          priority: 'high'
        },
        {
          id: 'ACT-004',
          type: 'payment',
          title: 'Payment Received',
          description: 'Payment of 45,000 DZD received for RES-2024-002',
          timestamp: new Date(now.getTime() - 5400000).toISOString(),
          user: 'Front Desk',
          priority: 'normal'
        },
        {
          id: 'ACT-005',
          type: 'checkout',
          title: 'Guest Check-out',
          description: 'Ahmed Mansouri checked out from Room 208',
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // منذ ساعتين
          user: 'Front Desk',
          priority: 'normal'
        }
      ],

      // التنبيهات والإشعارات
      alerts: [
        {
          id: 'ALERT-001',
          type: 'warning',
          title: 'Room Maintenance Required',
          message: 'Room 105 air conditioning needs immediate attention',
          timestamp: new Date(now.getTime() - 3600000).toISOString(),
          priority: 'high',
          read: false
        },
        {
          id: 'ALERT-002',
          type: 'info',
          title: 'High Occupancy Alert',
          message: 'Hotel occupancy is at 71% - consider dynamic pricing',
          timestamp: new Date(now.getTime() - 7200000).toISOString(),
          priority: 'medium',
          read: false
        },
        {
          id: 'ALERT-003',
          type: 'success',
          title: 'Revenue Target Achieved',
          message: 'Monthly revenue target exceeded by 5.5%',
          timestamp: new Date(now.getTime() - 10800000).toISOString(),
          priority: 'low',
          read: true
        }
      ],

      // إحصائيات الأداء
      performance: {
        averageStayDuration: 2.3, // أيام
        repeatGuestRate: 35.2, // %
        customerSatisfaction: 4.6, // من 5
        averageResponseTime: 12, // دقائق
        staffEfficiency: 87.5, // %
        energyEfficiency: 92.1, // %
        wasteReduction: 15.3, // %
        waterConservation: 8.7 // %
      },

      // معلومات الطقس (للمدينة)
      weather: {
        city: 'Algiers',
        temperature: 22,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy' },
          { day: 'Tomorrow', high: 26, low: 19, condition: 'Sunny' },
          { day: 'Wednesday', high: 23, low: 17, condition: 'Cloudy' }
        ]
      },

      // آخر تحديث
      lastUpdated: now.toISOString()
    };
  }

  // الحصول على البيانات
  async getData() {
    if (!this.data || this.isDataStale()) {
      await this.refreshData();
    }
    return this.data;
  }

  // تحديث البيانات
  async refreshData() {
    try {
      // محاولة الحصول على البيانات من API
      const apiData = await this.fetchFromAPI();
      this.data = apiData;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      // استخدام البيانات التجريبية في حالة عدم توفر API
      this.data = this.initializeMockData();
    }
    
    this.lastUpdate = new Date();
    this.notifyListeners();
  }

  // محاولة الحصول على البيانات من API
  async fetchFromAPI() {
    const token = localStorage.getItem('sysora_token');
    if (!token) throw new Error('No auth token');

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/hotels/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 ثوانٍ timeout
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'API returned error');
    }

    return result.data;
  }

  // فحص ما إذا كانت البيانات قديمة
  isDataStale() {
    if (!this.lastUpdate) return true;
    const staleTime = 5 * 60 * 1000; // 5 دقائق
    return (new Date() - this.lastUpdate) > staleTime;
  }

  // بدء التحديث التلقائي
  startAutoRefresh(interval = 60000) { // كل دقيقة
    this.stopAutoRefresh();
    this.updateInterval = setInterval(() => {
      this.refreshData();
    }, interval);
  }

  // إيقاف التحديث التلقائي
  stopAutoRefresh() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // إضافة مستمع للتحديثات
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // إشعار المستمعين بالتحديثات
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.data);
      } catch (error) {
        console.error('Error in data listener:', error);
      }
    });
  }

  // تحديث بيانات محددة
  updateSpecificData(path, value) {
    if (!this.data) return;
    
    const keys = path.split('.');
    let current = this.data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    this.notifyListeners();
  }

  // محاكاة تحديثات البيانات الحية
  simulateLiveUpdates() {
    setInterval(() => {
      if (!this.data) return;

      // تحديث عشوائي للإحصائيات
      const updates = [
        () => {
          this.data.today.checkIns += Math.random() > 0.8 ? 1 : 0;
          this.data.overview.checkInsToday = this.data.today.checkIns;
        },
        () => {
          this.data.today.checkOuts += Math.random() > 0.9 ? 1 : 0;
          this.data.overview.checkOutsToday = this.data.today.checkOuts;
        },
        () => {
          this.data.today.revenue += Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : 0;
        },
        () => {
          this.data.overview.occupancyRate = Math.max(0, Math.min(100, 
            this.data.overview.occupancyRate + (Math.random() - 0.5) * 2
          ));
        }
      ];

      // تطبيق تحديث عشوائي
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      randomUpdate();
      
      this.notifyListeners();
    }, 30000); // كل 30 ثانية
  }
}

// إنشاء instance واحد للاستخدام العام
export const overviewDataService = new OverviewDataService();

// تصدير الكلاس للاستخدام المتقدم
export default OverviewDataService;
