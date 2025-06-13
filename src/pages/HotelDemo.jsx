import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Bed,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Home,
  ArrowLeft,
  Settings,
  LogOut,
  Bell,
  Coffee,
  CreditCard
} from 'lucide-react';

const HotelDemo = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Demo data matching the real dashboard
  const stats = {
    totalRooms: 24,
    availableRooms: 18,
    todayBookings: 12,
    todayRevenue: 3450,
    occupancyRate: 75,
    avgRoomRate: 287
  };

  const recentBookings = [
    {
      id: 1,
      guestName: "أحمد محمد",
      roomNumber: "101",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      status: "confirmed",
      amount: 850
    },
    {
      id: 2,
      guestName: "فاطمة علي",
      roomNumber: "205",
      checkIn: "2024-01-16",
      checkOut: "2024-01-20",
      status: "checked-in",
      amount: 1200
    },
    {
      id: 3,
      guestName: "محمد حسن",
      roomNumber: "312",
      checkIn: "2024-01-17",
      checkOut: "2024-01-19",
      status: "pending",
      amount: 600
    }
  ];

  const rooms = [
    { id: 101, type: "Standard", status: "available", price: 200 },
    { id: 102, type: "Standard", status: "occupied", price: 200 },
    { id: 103, type: "Standard", status: "cleaning", price: 200 },
    { id: 201, type: "Deluxe", status: "available", price: 350 },
    { id: 202, type: "Deluxe", status: "occupied", price: 350 },
    { id: 301, type: "Suite", status: "available", price: 500 },
    { id: 302, type: "Suite", status: "maintenance", price: 500 },
    { id: 303, type: "Suite", status: "occupied", price: 500 }
  ];

  // Demo user and hotel data
  const user = { fullName: "أحمد محمد", role: "manager" };
  const hotel = { name: "فندق الأحلام", subdomain: "dreams-hotel" };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'متاح';
      case 'occupied': return 'مشغول';
      case 'cleaning': return 'تنظيف';
      case 'maintenance': return 'صيانة';
      case 'confirmed': return 'مؤكد';
      case 'checked-in': return 'وصل';
      case 'pending': return 'معلق';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-sysora-light">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-sysora-mint to-sysora-mint/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-medium">عرض توضيحي - لوحة تحكم الفندق</span>
              <span className="text-sm opacity-90">جميع البيانات وهمية لأغراض العرض</span>
            </div>
            <button
              onClick={() => window.close()}
              className="flex items-center space-x-2 space-x-reverse bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>إغلاق العرض</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header - Matching real dashboard */}
      <header className="bg-white shadow-subtle border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Hotel Name */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-sysora-midnight rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-sysora-midnight">{hotel?.name}</h1>
                <p className="text-sm text-gray-500">{hotel?.subdomain}.sysora.com</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-sysora-midnight transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-sysora-midnight transition-colors" title="تخصيص المظهر">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-sysora-midnight">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">تجربة مجانية -3  يوم متبقي</p>
                <p className="text-sm text-yellow-600">استمتع بجميع الميزات المتقدمة مجاناً</p>
              </div>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-yellow-600 transition-colors">
              ترقية الآن
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sysora-midnight mb-2">
            Welcome back, {user?.fullName}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening at {hotel?.name} today.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'نظرة عامة', icon: TrendingUp },
                { id: 'rooms', name: 'الغرف', icon: Bed },
                { id: 'reservations', name: 'الحجوزات', icon: Calendar },
                { id: 'services', name: 'الخدمات', icon: Coffee },
                { id: 'payments', name: 'الدفعات', icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-sysora-mint text-sysora-mint'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Rooms */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Rooms</p>
                    <p className="text-2xl font-bold text-sysora-midnight">{stats.totalRooms}</p>
                  </div>
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <Bed className="w-6 h-6 text-sysora-mint" />
                  </div>
                </div>
              </div>

              {/* Available Rooms */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Rooms</p>
                    <p className="text-2xl font-bold text-sysora-midnight">{stats.availableRooms}</p>
                  </div>
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-sysora-mint" />
                  </div>
                </div>
              </div>

              {/* Today's Bookings */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Bookings</p>
                    <p className="text-2xl font-bold text-sysora-midnight">{stats.todayBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-sysora-mint" />
                  </div>
                </div>
              </div>

              {/* Today's Revenue */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-sysora-midnight">{stats.todayRevenue.toLocaleString()} DZD</p>
                  </div>
                  <div className="w-12 h-12 bg-sysora-mint/10 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-sysora-mint" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Today's Activity */}
              <div className="card">
                <h3 className="text-lg font-semibold text-sysora-midnight mb-4">Today's Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-sysora-light rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-sysora-mint" />
                      <span className="text-sm text-sysora-midnight">Check-ins</span>
                    </div>
                    <span className="font-semibold text-sysora-midnight">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sysora-light rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-sysora-mint" />
                      <span className="text-sm text-sysora-midnight">Check-outs</span>
                    </div>
                    <span className="font-semibold text-sysora-midnight">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sysora-light rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-sysora-mint" />
                      <span className="text-sm text-sysora-midnight">New Guests</span>
                    </div>
                    <span className="font-semibold text-sysora-midnight">12</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-sysora-midnight mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="p-4 bg-sysora-mint/10 rounded-2xl text-center hover:bg-sysora-mint/20 transition-colors"
                  >
                    <Calendar className="w-6 h-6 text-sysora-mint mx-auto mb-2" />
                    <span className="text-sm font-medium text-sysora-midnight">New Reservation</span>
                  </button>
                  <button className="p-4 bg-sysora-mint/10 rounded-2xl text-center hover:bg-sysora-mint/20 transition-colors">
                    <Users className="w-6 h-6 text-sysora-mint mx-auto mb-2" />
                    <span className="text-sm font-medium text-sysora-midnight">Add Guest</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className="p-4 bg-sysora-mint/10 rounded-2xl text-center hover:bg-sysora-mint/20 transition-colors"
                  >
                    <Bed className="w-6 h-6 text-sysora-mint mx-auto mb-2" />
                    <span className="text-sm font-medium text-sysora-midnight">Manage Rooms</span>
                  </button>
                  <button className="p-4 bg-sysora-mint/10 rounded-2xl text-center hover:bg-sysora-mint/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-sysora-mint mx-auto mb-2" />
                    <span className="text-sm font-medium text-sysora-midnight">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other Tabs Content */}
        {activeTab === 'rooms' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-sysora-midnight mb-4">إدارة الغرف</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="p-4 bg-sysora-light rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sysora-midnight">غرفة {room.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {getStatusText(room.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{room.type}</p>
                  <p className="text-sm font-medium text-sysora-midnight">{room.price.toLocaleString()} DZD/ليلة</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-sysora-midnight mb-4">إدارة الحجوزات</h3>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-sysora-light rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-10 h-10 bg-sysora-mint/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-sysora-mint" />
                    </div>
                    <div>
                      <p className="font-medium text-sysora-midnight">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">غرفة {booking.roomNumber} • {booking.checkIn} - {booking.checkOut}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{booking.amount.toLocaleString()} DZD</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-sysora-midnight mb-4">إدارة الخدمات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-sysora-light rounded-2xl text-center">
                <Coffee className="w-8 h-8 text-sysora-mint mx-auto mb-2" />
                <h4 className="font-medium text-sysora-midnight">خدمة الغرف</h4>
                <p className="text-sm text-gray-600">متاح 24/7</p>
              </div>
              <div className="p-4 bg-sysora-light rounded-2xl text-center">
                <Users className="w-8 h-8 text-sysora-mint mx-auto mb-2" />
                <h4 className="font-medium text-sysora-midnight">خدمة التنظيف</h4>
                <p className="text-sm text-gray-600">يومياً</p>
              </div>
              <div className="p-4 bg-sysora-light rounded-2xl text-center">
                <Settings className="w-8 h-8 text-sysora-mint mx-auto mb-2" />
                <h4 className="font-medium text-sysora-midnight">الصيانة</h4>
                <p className="text-sm text-gray-600">عند الطلب</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-sysora-midnight mb-4">إدارة الدفعات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-sysora-light rounded-2xl">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-sysora-mint" />
                  <div>
                    <p className="font-medium text-sysora-midnight">دفعة نقدية</p>
                    <p className="text-sm text-gray-600">أحمد محمد - غرفة 101</p>
                  </div>
                </div>
                <span className="font-semibold text-sysora-midnight">850 DZD</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-sysora-light rounded-2xl">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-sysora-mint" />
                  <div>
                    <p className="font-medium text-sysora-midnight">بطاقة ائتمان</p>
                    <p className="text-sm text-gray-600">فاطمة علي - غرفة 205</p>
                  </div>
                </div>
                <span className="font-semibold text-sysora-midnight">1200 DZD</span>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-sysora-midnight to-sysora-midnight/90 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">أعجبك ما رأيت؟</h3>
          <p className="text-lg mb-6 opacity-90">ابدأ إدارة فندقك بكفاءة مع نظام سيسورا الشامل</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-sysora-mint text-sysora-midnight px-8 py-3 rounded-2xl font-semibold hover:bg-sysora-mint/90 transition-colors"
            >
              ابدأ تجربتك المجانية
            </button>
            <button
              onClick={() => window.open('/#pricing', '_blank')}
              className="bg-white/10 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              اطلع على الأسعار
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelDemo;
