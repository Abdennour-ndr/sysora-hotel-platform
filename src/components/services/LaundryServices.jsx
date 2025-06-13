import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Plus,
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Play,
  Package,
  Truck,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  BarChart3,
  DollarSign,
  Droplets,
  Wind,
  Thermometer,
  Sparkles
} from 'lucide-react';

const LaundryServices = () => {
  const [laundryOrders, setLaundryOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    revenue: 0
  });

  // Laundry service types
  const laundryServices = [
    { id: 'wash_fold', name: 'Wash & Fold', icon: Shirt, color: 'bg-blue-500', basePrice: 800 },
    { id: 'dry_clean', name: 'Dry Cleaning', icon: Sparkles, color: 'bg-purple-500', basePrice: 1500 },
    { id: 'iron_press', name: 'Iron & Press', icon: Thermometer, color: 'bg-orange-500', basePrice: 500 },
    { id: 'express', name: 'Express Service', icon: Clock, color: 'bg-red-500', basePrice: 1200 },
    { id: 'delicate', name: 'Delicate Care', icon: Droplets, color: 'bg-cyan-500', basePrice: 2000 },
    { id: 'bulk', name: 'Bulk Laundry', icon: Package, color: 'bg-green-500', basePrice: 600 }
  ];

  // Order statuses
  const orderStatuses = [
    { id: 'pickup_scheduled', name: 'Pickup Scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
    { id: 'collected', name: 'Collected', color: 'bg-yellow-100 text-yellow-800', icon: Package },
    { id: 'processing', name: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Play },
    { id: 'ready', name: 'Ready for Delivery', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'delivered', name: 'Delivered', color: 'bg-green-200 text-green-900', icon: Truck },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  // Order priorities
  const orderPriorities = [
    { id: 'standard', name: 'Standard', color: 'bg-gray-100 text-gray-800', duration: '24-48h' },
    { id: 'express', name: 'Express', color: 'bg-orange-100 text-orange-800', duration: '12-24h' },
    { id: 'same_day', name: 'Same Day', color: 'bg-red-100 text-red-800', duration: '4-8h' }
  ];

  useEffect(() => {
    loadLaundryOrders();
    loadStats();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [laundryOrders, searchTerm, selectedStatus, selectedService, selectedPriority]);

  const loadLaundryOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/laundry/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setLaundryOrders(data.data.orders || []);
      } else {
        // Fallback to demo data
        setLaundryOrders(generateDemoOrders());
      }
    } catch (error) {
      console.error('Error loading laundry orders:', error);
      setLaundryOrders(generateDemoOrders());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/laundry/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data.data);
      } else {
        // Fallback to calculated stats
        calculateStats();
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      calculateStats();
    }
  };

  const generateDemoOrders = () => {
    const now = new Date();
    return [
      {
        _id: '1',
        orderNumber: 'LND-001',
        guestId: { _id: 'g1', firstName: 'Ahmed', lastName: 'Hassan', room: { number: '205' } },
        serviceType: 'wash_fold',
        items: [
          { type: 'Shirts', quantity: 3, price: 800 },
          { type: 'Pants', quantity: 2, price: 600 },
          { type: 'Underwear', quantity: 5, price: 300 }
        ],
        status: 'pickup_scheduled',
        priority: 'standard',
        totalAmount: 4200,
        specialInstructions: 'Use fabric softener, no starch',
        pickupTime: new Date(now.getTime() + 2 * 60 * 60000).toISOString(),
        deliveryTime: new Date(now.getTime() + 26 * 60 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 30 * 60000).toISOString(),
        assignedStaff: { _id: 'st1', firstName: 'Fatima', lastName: 'Ali' }
      },
      {
        _id: '2',
        orderNumber: 'LND-002',
        guestId: { _id: 'g2', firstName: 'Sarah', lastName: 'Mohamed', room: { number: '312' } },
        serviceType: 'dry_clean',
        items: [
          { type: 'Suit Jacket', quantity: 1, price: 2500 },
          { type: 'Dress Pants', quantity: 1, price: 1500 },
          { type: 'Silk Blouse', quantity: 2, price: 2000 }
        ],
        status: 'processing',
        priority: 'express',
        totalAmount: 6000,
        specialInstructions: 'Handle with care, silk items',
        pickupTime: new Date(now.getTime() - 4 * 60 * 60000).toISOString(),
        deliveryTime: new Date(now.getTime() + 8 * 60 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 5 * 60 * 60000).toISOString(),
        assignedStaff: { _id: 'st2', firstName: 'Omar', lastName: 'Benali' },
        collectedAt: new Date(now.getTime() - 4 * 60 * 60000).toISOString(),
        processingStarted: new Date(now.getTime() - 2 * 60 * 60000).toISOString()
      },
      {
        _id: '3',
        orderNumber: 'LND-003',
        guestId: { _id: 'g3', firstName: 'Youssef', lastName: 'Tadlaoui', room: { number: '408' } },
        serviceType: 'iron_press',
        items: [
          { type: 'Business Shirts', quantity: 5, price: 500 },
          { type: 'Dress Pants', quantity: 3, price: 500 }
        ],
        status: 'ready',
        priority: 'standard',
        totalAmount: 4000,
        specialInstructions: 'Light starch on shirts',
        pickupTime: new Date(now.getTime() - 20 * 60 * 60000).toISOString(),
        deliveryTime: new Date(now.getTime() + 2 * 60 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 22 * 60 * 60000).toISOString(),
        assignedStaff: { _id: 'st3', firstName: 'Nadia', lastName: 'Boumediene' },
        collectedAt: new Date(now.getTime() - 20 * 60 * 60000).toISOString(),
        processingStarted: new Date(now.getTime() - 18 * 60 * 60000).toISOString(),
        processingCompleted: new Date(now.getTime() - 1 * 60 * 60000).toISOString()
      },
      {
        _id: '4',
        orderNumber: 'LND-004',
        guestId: { _id: 'g4', firstName: 'Amina', lastName: 'Khelifi', room: { number: '501' } },
        serviceType: 'express',
        items: [
          { type: 'Evening Dress', quantity: 1, price: 3000 },
          { type: 'Accessories', quantity: 2, price: 800 }
        ],
        status: 'delivered',
        priority: 'same_day',
        totalAmount: 3800,
        specialInstructions: 'Needed for tonight event',
        pickupTime: new Date(now.getTime() - 6 * 60 * 60000).toISOString(),
        deliveryTime: new Date(now.getTime() - 1 * 60 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 7 * 60 * 60000).toISOString(),
        assignedStaff: { _id: 'st1', firstName: 'Fatima', lastName: 'Ali' },
        collectedAt: new Date(now.getTime() - 6 * 60 * 60000).toISOString(),
        processingStarted: new Date(now.getTime() - 5 * 60 * 60000).toISOString(),
        processingCompleted: new Date(now.getTime() - 2 * 60 * 60000).toISOString(),
        deliveredAt: new Date(now.getTime() - 1 * 60 * 60000).toISOString(),
        rating: 5,
        feedback: 'Perfect service, dress looked amazing!'
      },
      {
        _id: '5',
        orderNumber: 'LND-005',
        guestId: { _id: 'g5', firstName: 'Karim', lastName: 'Mansouri', room: { number: '101' } },
        serviceType: 'delicate',
        items: [
          { type: 'Cashmere Sweater', quantity: 2, price: 2500 },
          { type: 'Wool Coat', quantity: 1, price: 3500 }
        ],
        status: 'collected',
        priority: 'express',
        totalAmount: 8500,
        specialInstructions: 'Delicate fabrics, special care required',
        pickupTime: new Date(now.getTime() - 1 * 60 * 60000).toISOString(),
        deliveryTime: new Date(now.getTime() + 11 * 60 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 2 * 60 * 60000).toISOString(),
        assignedStaff: { _id: 'st2', firstName: 'Omar', lastName: 'Benali' },
        collectedAt: new Date(now.getTime() - 1 * 60 * 60000).toISOString()
      }
    ];
  };

  const calculateStats = () => {
    const total = laundryOrders.length;
    const pending = laundryOrders.filter(o => ['pickup_scheduled', 'collected'].includes(o.status)).length;
    const processing = laundryOrders.filter(o => o.status === 'processing').length;
    const completed = laundryOrders.filter(o => ['delivered'].includes(o.status)).length;
    const revenue = laundryOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({ total, pending, processing, completed, revenue });
  };

  const filterOrders = () => {
    let filtered = laundryOrders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guestId?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guestId?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guestId?.room?.number.includes(searchTerm) ||
        order.items.some(item => item.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(order => order.serviceType === selectedService);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(order => order.priority === selectedPriority);
    }

    setFilteredOrders(filtered);
  };

  const getServiceInfo = (serviceType) => {
    return laundryServices.find(s => s.id === serviceType) || laundryServices[0];
  };

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.id === status) || orderStatuses[0];
  };

  const getPriorityInfo = (priority) => {
    return orderPriorities.find(p => p.id === priority) || orderPriorities[0];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/laundry/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updateData = { status: newStatus };
        const now = new Date().toISOString();
        
        if (newStatus === 'collected') {
          updateData.collectedAt = now;
        } else if (newStatus === 'processing') {
          updateData.processingStarted = now;
        } else if (newStatus === 'ready') {
          updateData.processingCompleted = now;
        } else if (newStatus === 'delivered') {
          updateData.deliveredAt = now;
        }

        setLaundryOrders(laundryOrders.map(o => 
          o._id === orderId ? { ...o, ...updateData } : o
        ));
        window.showToast && window.showToast(`Order ${newStatus.replace('_', ' ')} successfully`, 'success');
      } else {
        window.showToast && window.showToast('Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      window.showToast && window.showToast('Error updating order status', 'error');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading laundry orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Shirt className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Laundry Services</h2>
              <p className="text-purple-100">Professional laundry and dry cleaning services</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, guests, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {orderStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Services</option>
              {laundryServices.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              {orderPriorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Laundry Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const serviceInfo = getServiceInfo(order.serviceType);
          const statusInfo = getStatusInfo(order.status);
          const priorityInfo = getPriorityInfo(order.priority);
          const ServiceIcon = serviceInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${serviceInfo.color} rounded-2xl flex items-center justify-center`}>
                      <ServiceIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{serviceInfo.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-900">
                    {order.guestId?.firstName} {order.guestId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Room {order.guestId?.room?.number}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>{order.items.length} items</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getTimeAgo(order.createdAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.type}</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  <p>Pickup: {formatDateTime(order.pickupTime)}</p>
                  <p>Delivery: {formatDateTime(order.deliveryTime)}</p>
                  {order.collectedAt && (
                    <p>Collected: {formatDateTime(order.collectedAt)}</p>
                  )}
                  {order.deliveredAt && (
                    <p>Delivered: {formatDateTime(order.deliveredAt)}</p>
                  )}
                </div>

                {order.assignedStaff && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.assignedStaff.firstName} {order.assignedStaff.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Assigned Staff</p>
                    </div>
                  </div>
                )}

                {order.rating && (
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{order.rating}/5</span>
                    {order.feedback && (
                      <span className="text-xs text-gray-500 ml-2">"{order.feedback}"</span>
                    )}
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-1">Special Instructions:</p>
                    <p className="text-sm text-blue-800">{order.specialInstructions}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Details</span>
                  </button>

                  {order.status === 'pickup_scheduled' && (
                    <button
                      onClick={() => handleStatusChange(order._id, 'collected')}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      title="Mark as Collected"
                    >
                      <Package className="w-4 h-4" />
                    </button>
                  )}

                  {order.status === 'collected' && (
                    <button
                      onClick={() => handleStatusChange(order._id, 'processing')}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Start Processing"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}

                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleStatusChange(order._id, 'ready')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Mark as Ready"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusChange(order._id, 'delivered')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Mark as Delivered"
                    >
                      <Truck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Laundry Orders Found</h3>
          <p className="text-gray-600 mb-6">No orders match your current filters.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create First Order
          </button>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Laundry Order</h3>
            <p className="text-gray-600 mb-4">Laundry order creation form will be implemented here.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  window.showToast && window.showToast('Order creation feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Laundry Order Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                  <p className="text-gray-900 font-semibold">{selectedOrder.orderNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <p className="text-gray-900">{getServiceInfo(selectedOrder.serviceType).name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                  <p className="text-gray-900">
                    {selectedOrder.guestId?.firstName} {selectedOrder.guestId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Room {selectedOrder.guestId?.room?.number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).name}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityInfo(selectedOrder.priority).color}`}>
                    {getPriorityInfo(selectedOrder.priority).name} ({getPriorityInfo(selectedOrder.priority).duration})
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <p className="text-gray-900 font-semibold text-lg">{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                  <p className="text-gray-900">{formatDateTime(selectedOrder.pickupTime)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <p className="text-gray-900">{formatDateTime(selectedOrder.deliveryTime)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Created</label>
                  <p className="text-gray-900">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>

                {selectedOrder.assignedStaff && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Staff</label>
                    <p className="text-gray-900">
                      {selectedOrder.assignedStaff.firstName} {selectedOrder.assignedStaff.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Items</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <span className="font-medium text-gray-900">{item.type}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-semibold text-gray-900 text-lg">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedOrder.specialInstructions}</p>
              </div>
            )}

            {selectedOrder.feedback && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Feedback</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`feedback-star-${i}`}
                          className={`w-4 h-4 ${i < selectedOrder.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{selectedOrder.rating}/5</span>
                    </div>
                  )}
                  <p className="text-gray-900">{selectedOrder.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryServices;
