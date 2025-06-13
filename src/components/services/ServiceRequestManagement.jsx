import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Clock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Eye,
  Edit3,
  MessageSquare,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Coffee,
  Car,
  Utensils,
  Wifi,
  Dumbbell,
  Wrench,
  Shirt,
  Bell,
  Home,
  Building
} from 'lucide-react';

const ServiceRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    avgResponseTime: 0
  });

  // Request statuses
  const requestStatuses = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { id: 'confirmed', name: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { id: 'in_progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Play },
    { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  // Request priorities
  const requestPriorities = [
    { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Service categories
  const serviceCategories = [
    { id: 'room_service', name: 'Room Service', icon: Coffee },
    { id: 'laundry', name: 'Laundry', icon: Shirt },
    { id: 'spa', name: 'Spa & Wellness', icon: Star },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'transportation', name: 'Transportation', icon: Car },
    { id: 'entertainment', name: 'Entertainment', icon: Wifi },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'concierge', name: 'Concierge', icon: Bell },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
    { id: 'housekeeping', name: 'Housekeeping', icon: Home }
  ];

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, selectedStatus, selectedPriority, selectedCategory]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/service-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setRequests(data.data.requests || []);
      } else {
        // Fallback to demo data
        setRequests(generateDemoRequests());
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests(generateDemoRequests());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/service-requests/stats`, {
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

  const generateDemoRequests = () => {
    const now = new Date();
    return [
      {
        _id: '1',
        serviceId: {
          _id: 's1',
          name: 'Room Service - Breakfast',
          category: 'room_service',
          pricing: { basePrice: 2500 }
        },
        guestId: {
          _id: 'g1',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          room: { number: '101' }
        },
        status: 'pending',
        priority: 'normal',
        requestedDateTime: new Date(now.getTime() - 30 * 60000).toISOString(),
        scheduledDateTime: new Date(now.getTime() + 60 * 60000).toISOString(),
        totalPrice: 2500,
        specialRequests: 'No onions please',
        assignedStaff: null,
        estimatedDuration: 30,
        location: 'Room 101'
      },
      {
        _id: '2',
        serviceId: {
          _id: 's2',
          name: 'Laundry Service',
          category: 'laundry',
          pricing: { basePrice: 1500 }
        },
        guestId: {
          _id: 'g2',
          firstName: 'Sarah',
          lastName: 'Mohamed',
          room: { number: '205' }
        },
        status: 'in_progress',
        priority: 'normal',
        requestedDateTime: new Date(now.getTime() - 120 * 60000).toISOString(),
        scheduledDateTime: new Date(now.getTime() - 60 * 60000).toISOString(),
        totalPrice: 4500,
        specialRequests: '3 shirts, 2 pants',
        assignedStaff: { _id: 'st1', firstName: 'Fatima', lastName: 'Ali' },
        estimatedDuration: 120,
        location: 'Laundry Room'
      },
      {
        _id: '3',
        serviceId: {
          _id: 's3',
          name: 'Airport Transfer',
          category: 'transportation',
          pricing: { basePrice: 5000 }
        },
        guestId: {
          _id: 'g3',
          firstName: 'Omar',
          lastName: 'Benali',
          room: { number: '312' }
        },
        status: 'confirmed',
        priority: 'high',
        requestedDateTime: new Date(now.getTime() - 180 * 60000).toISOString(),
        scheduledDateTime: new Date(now.getTime() + 240 * 60000).toISOString(),
        totalPrice: 5000,
        specialRequests: 'Flight at 6 PM',
        assignedStaff: { _id: 'st2', firstName: 'Karim', lastName: 'Mansouri' },
        estimatedDuration: 60,
        location: 'Hotel Lobby'
      },
      {
        _id: '4',
        serviceId: {
          _id: 's4',
          name: 'Room Cleaning',
          category: 'housekeeping',
          pricing: { basePrice: 1000 }
        },
        guestId: {
          _id: 'g4',
          firstName: 'Amina',
          lastName: 'Khelifi',
          room: { number: '408' }
        },
        status: 'completed',
        priority: 'normal',
        requestedDateTime: new Date(now.getTime() - 300 * 60000).toISOString(),
        scheduledDateTime: new Date(now.getTime() - 240 * 60000).toISOString(),
        completedDateTime: new Date(now.getTime() - 195 * 60000).toISOString(),
        totalPrice: 1000,
        specialRequests: 'Extra towels needed',
        assignedStaff: { _id: 'st3', firstName: 'Nadia', lastName: 'Boumediene' },
        estimatedDuration: 45,
        actualDuration: 45,
        location: 'Room 408',
        rating: 5,
        feedback: 'Excellent service, very thorough cleaning'
      },
      {
        _id: '5',
        serviceId: {
          _id: 's5',
          name: 'Spa Massage',
          category: 'spa',
          pricing: { basePrice: 8000 }
        },
        guestId: {
          _id: 'g5',
          firstName: 'Youssef',
          lastName: 'Tadlaoui',
          room: { number: '501' }
        },
        status: 'cancelled',
        priority: 'low',
        requestedDateTime: new Date(now.getTime() - 360 * 60000).toISOString(),
        scheduledDateTime: new Date(now.getTime() + 120 * 60000).toISOString(),
        totalPrice: 8000,
        specialRequests: 'Prefer female therapist',
        assignedStaff: null,
        estimatedDuration: 90,
        location: 'Spa Room 1',
        cancellationReason: 'Guest had to leave early'
      }
    ];
  };

  const calculateStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => r.status === 'in_progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;

    // Calculate average response time (in minutes)
    const completedRequests = requests.filter(r => r.status === 'completed' && r.completedDateTime);
    const avgResponseTime = completedRequests.length > 0
      ? completedRequests.reduce((sum, r) => {
          const requested = new Date(r.requestedDateTime);
          const completed = new Date(r.completedDateTime);
          return sum + (completed - requested) / (1000 * 60); // Convert to minutes
        }, 0) / completedRequests.length
      : 0;

    setStats({ total, pending, inProgress, completed, avgResponseTime: Math.round(avgResponseTime) });
  };

  const filterRequests = () => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.serviceId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.guestId?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.guestId?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.guestId?.room?.number.includes(searchTerm) ||
        request.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(request => request.priority === selectedPriority);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(request => request.serviceId?.category === selectedCategory);
    }

    setFilteredRequests(filtered);
  };

  const getStatusInfo = (status) => {
    return requestStatuses.find(s => s.id === status) || requestStatuses[0];
  };

  const getPriorityInfo = (priority) => {
    return requestPriorities.find(p => p.id === priority) || requestPriorities[1];
  };

  const getCategoryInfo = (category) => {
    return serviceCategories.find(c => c.id === category) || serviceCategories[0];
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

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/service-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setRequests(requests.map(r =>
          r._id === requestId
            ? { ...r, status: newStatus, ...(newStatus === 'completed' ? { completedDateTime: new Date().toISOString() } : {}) }
            : r
        ));
        window.showToast && window.showToast(`Request ${newStatus} successfully`, 'success');
      } else {
        window.showToast && window.showToast('Failed to update request status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      window.showToast && window.showToast('Error updating request status', 'error');
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Service Request Management</h2>
              <p className="text-purple-100">Track and manage all service requests</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
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
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgResponseTime}m</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
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
              placeholder="Search requests..."
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
              {requestStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              {requestPriorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {serviceCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const statusInfo = getStatusInfo(request.status);
                const priorityInfo = getPriorityInfo(request.priority);
                const categoryInfo = getCategoryInfo(request.serviceId?.category);
                const StatusIcon = statusInfo.icon;
                const CategoryIcon = categoryInfo.icon;

                return (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.serviceId?.name}</p>
                          <p className="text-sm text-gray-500">{categoryInfo.name}</p>
                          <p className="text-xs text-gray-400">{getTimeAgo(request.requestedDateTime)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">
                          {request.guestId?.firstName} {request.guestId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">Room {request.guestId?.room?.number}</p>
                        <p className="text-xs text-gray-400">{request.location}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                        {priorityInfo.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(request.scheduledDateTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.estimatedDuration}min duration
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.assignedStaff ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {request.assignedStaff.firstName} {request.assignedStaff.lastName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(request.totalPrice)}
                      </div>
                      {request.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">{request.rating}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(request._id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Confirm Request"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {request.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(request._id, 'in_progress')}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Start Service"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        {request.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(request._id, 'completed')}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Complete Service"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {(request.status === 'pending' || request.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusChange(request._id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service Requests Found</h3>
            <p className="text-gray-600 mb-6">No requests match your current filters.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Request
            </button>
          </div>
        )}
      </div>

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Service Request</h3>
            <p className="text-gray-600 mb-4">Service request creation form will be implemented here.</p>
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
                  window.showToast && window.showToast('Request creation feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Request Details</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <p className="text-gray-900">{selectedRequest.serviceId?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                  <p className="text-gray-900">
                    {selectedRequest.guestId?.firstName} {selectedRequest.guestId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Room {selectedRequest.guestId?.room?.number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedRequest.status).color}`}>
                    {getStatusInfo(selectedRequest.status).name}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityInfo(selectedRequest.priority).color}`}>
                    {getPriorityInfo(selectedRequest.priority).name}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested</label>
                  <p className="text-gray-900">{formatDateTime(selectedRequest.requestedDateTime)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled</label>
                  <p className="text-gray-900">{formatDateTime(selectedRequest.scheduledDateTime)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{selectedRequest.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(selectedRequest.totalPrice)}</p>
                </div>
              </div>
            </div>

            {selectedRequest.specialRequests && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.specialRequests}</p>
              </div>
            )}

            {selectedRequest.assignedStaff && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Staff</label>
                <p className="text-gray-900">
                  {selectedRequest.assignedStaff.firstName} {selectedRequest.assignedStaff.lastName}
                </p>
              </div>
            )}

            {selectedRequest.feedback && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Feedback</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < selectedRequest.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{selectedRequest.rating}/5</span>
                    </div>
                  )}
                  <p className="text-gray-900">{selectedRequest.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestManagement;