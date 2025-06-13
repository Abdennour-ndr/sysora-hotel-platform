import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Play,
  AlertTriangle,
  Zap,
  Droplets,
  Thermometer,
  Wifi,
  Tv,
  Lock,
  Wind,
  Lightbulb,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';

const MaintenanceServices = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
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

  // Maintenance categories
  const maintenanceCategories = [
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-500' },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'bg-blue-500' },
    { id: 'hvac', name: 'HVAC', icon: Wind, color: 'bg-cyan-500' },
    { id: 'lighting', name: 'Lighting', icon: Lightbulb, color: 'bg-orange-500' },
    { id: 'electronics', name: 'Electronics', icon: Tv, color: 'bg-purple-500' },
    { id: 'security', name: 'Security', icon: Lock, color: 'bg-red-500' },
    { id: 'internet', name: 'Internet/WiFi', icon: Wifi, color: 'bg-green-500' },
    { id: 'general', name: 'General Repair', icon: Settings, color: 'bg-gray-500' }
  ];

  // Request statuses
  const requestStatuses = [
    { id: 'reported', name: 'Reported', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    { id: 'assigned', name: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: User },
    { id: 'in_progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Play },
    { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: XCircle }
  ];

  // Request priorities
  const requestPriorities = [
    { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' },
    { id: 'emergency', name: 'Emergency', color: 'bg-red-200 text-red-900' }
  ];

  useEffect(() => {
    loadMaintenanceRequests();
    loadStats();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [maintenanceRequests, searchTerm, selectedStatus, selectedPriority, selectedCategory]);

  const loadMaintenanceRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/maintenance/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMaintenanceRequests(data.data.requests || []);
      } else {
        // Fallback to demo data
        setMaintenanceRequests(generateDemoRequests());
      }
    } catch (error) {
      console.error('Error loading maintenance requests:', error);
      setMaintenanceRequests(generateDemoRequests());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/maintenance/stats`, {
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
        title: 'AC Not Working - Room 205',
        description: 'Air conditioning unit not cooling properly, making loud noises',
        category: 'hvac',
        location: 'Room 205',
        roomNumber: '205',
        status: 'reported',
        priority: 'high',
        reportedBy: { _id: 'g1', firstName: 'Ahmed', lastName: 'Hassan', type: 'guest' },
        assignedTo: null,
        createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
        estimatedDuration: 120,
        urgencyLevel: 8,
        floor: 2,
        building: 'Main Building'
      },
      {
        _id: '2',
        title: 'Electrical Outlet Not Working',
        description: 'Power outlet near the bed is not functioning',
        category: 'electrical',
        location: 'Room 312',
        roomNumber: '312',
        status: 'in_progress',
        priority: 'normal',
        reportedBy: { _id: 'st1', firstName: 'Fatima', lastName: 'Ali', type: 'staff' },
        assignedTo: { _id: 'mt1', firstName: 'Omar', lastName: 'Benali', specialization: 'Electrical' },
        createdAt: new Date(now.getTime() - 180 * 60000).toISOString(),
        startedAt: new Date(now.getTime() - 90 * 60000).toISOString(),
        estimatedDuration: 60,
        urgencyLevel: 5,
        floor: 3,
        building: 'Main Building'
      },
      {
        _id: '3',
        title: 'Bathroom Faucet Leaking',
        description: 'Hot water faucet in bathroom has continuous drip',
        category: 'plumbing',
        location: 'Room 408',
        roomNumber: '408',
        status: 'assigned',
        priority: 'normal',
        reportedBy: { _id: 'g2', firstName: 'Sarah', lastName: 'Mohamed', type: 'guest' },
        assignedTo: { _id: 'mt2', firstName: 'Karim', lastName: 'Mansouri', specialization: 'Plumbing' },
        createdAt: new Date(now.getTime() - 240 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() + 60 * 60000).toISOString(),
        estimatedDuration: 45,
        urgencyLevel: 4,
        floor: 4,
        building: 'Main Building'
      },
      {
        _id: '4',
        title: 'TV Remote Not Working',
        description: 'Television remote control not responding, batteries replaced',
        category: 'electronics',
        location: 'Room 501',
        roomNumber: '501',
        status: 'completed',
        priority: 'low',
        reportedBy: { _id: 'g3', firstName: 'Youssef', lastName: 'Tadlaoui', type: 'guest' },
        assignedTo: { _id: 'mt3', firstName: 'Nadia', lastName: 'Boumediene', specialization: 'Electronics' },
        createdAt: new Date(now.getTime() - 360 * 60000).toISOString(),
        startedAt: new Date(now.getTime() - 300 * 60000).toISOString(),
        completedAt: new Date(now.getTime() - 240 * 60000).toISOString(),
        estimatedDuration: 30,
        actualDuration: 25,
        urgencyLevel: 2,
        floor: 5,
        building: 'Main Building',
        resolution: 'Replaced faulty remote control unit',
        rating: 5,
        feedback: 'Quick and efficient service'
      },
      {
        _id: '5',
        title: 'WiFi Connection Issues',
        description: 'Internet connection very slow, frequent disconnections',
        category: 'internet',
        location: 'Room 101',
        roomNumber: '101',
        status: 'reported',
        priority: 'urgent',
        reportedBy: { _id: 'g4', firstName: 'Amina', lastName: 'Khelifi', type: 'guest' },
        assignedTo: null,
        createdAt: new Date(now.getTime() - 20 * 60000).toISOString(),
        estimatedDuration: 90,
        urgencyLevel: 7,
        floor: 1,
        building: 'Main Building'
      },
      {
        _id: '6',
        title: 'Broken Light Fixture',
        description: 'Ceiling light in bathroom flickering and making buzzing sound',
        category: 'lighting',
        location: 'Room 203',
        roomNumber: '203',
        status: 'assigned',
        priority: 'high',
        reportedBy: { _id: 'st2', firstName: 'Hassan', lastName: 'Zerrouki', type: 'staff' },
        assignedTo: { _id: 'mt1', firstName: 'Omar', lastName: 'Benali', specialization: 'Electrical' },
        createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() + 30 * 60000).toISOString(),
        estimatedDuration: 75,
        urgencyLevel: 6,
        floor: 2,
        building: 'Main Building'
      }
    ];
  };

  const calculateStats = () => {
    const total = maintenanceRequests.length;
    const pending = maintenanceRequests.filter(r => r.status === 'reported').length;
    const inProgress = maintenanceRequests.filter(r => r.status === 'in_progress').length;
    const completed = maintenanceRequests.filter(r => r.status === 'completed').length;
    
    // Calculate average response time (in minutes)
    const completedRequests = maintenanceRequests.filter(r => r.status === 'completed' && r.actualDuration);
    const avgResponseTime = completedRequests.length > 0 
      ? Math.round(completedRequests.reduce((sum, r) => sum + r.actualDuration, 0) / completedRequests.length)
      : 0;

    setStats({ total, pending, inProgress, completed, avgResponseTime });
  };

  const filterRequests = () => {
    let filtered = maintenanceRequests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.roomNumber.includes(searchTerm) ||
        request.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assignedTo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assignedTo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(request => request.priority === selectedPriority);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(request => request.category === selectedCategory);
    }

    setFilteredRequests(filtered);
  };

  const getCategoryInfo = (category) => {
    return maintenanceCategories.find(c => c.id === category) || maintenanceCategories[maintenanceCategories.length - 1];
  };

  const getStatusInfo = (status) => {
    return requestStatuses.find(s => s.id === status) || requestStatuses[0];
  };

  const getPriorityInfo = (priority) => {
    return requestPriorities.find(p => p.id === priority) || requestPriorities[1];
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

  const getUrgencyColor = (level) => {
    if (level >= 8) return 'text-red-600 bg-red-100';
    if (level >= 6) return 'text-orange-600 bg-orange-100';
    if (level >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/maintenance/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updateData = { status: newStatus };
        if (newStatus === 'in_progress') {
          updateData.startedAt = new Date().toISOString();
        } else if (newStatus === 'completed') {
          updateData.completedAt = new Date().toISOString();
        }

        setMaintenanceRequests(maintenanceRequests.map(r => 
          r._id === requestId ? { ...r, ...updateData } : r
        ));
        window.showToast && window.showToast(`Request ${newStatus.replace('_', ' ')} successfully`, 'success');
      } else {
        window.showToast && window.showToast('Failed to update request status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      window.showToast && window.showToast('Error updating request status', 'error');
    }
  };

  const handleAssignTechnician = async (requestId, technicianId) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/maintenance/requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ technicianId })
      });

      if (response.ok) {
        // Update request with assigned technician (demo implementation)
        setMaintenanceRequests(maintenanceRequests.map(r => 
          r._id === requestId 
            ? { ...r, assignedTo: { _id: technicianId, firstName: 'Technician', lastName: 'Name' }, status: 'assigned' }
            : r
        ));
        window.showToast && window.showToast('Technician assigned successfully', 'success');
      } else {
        window.showToast && window.showToast('Failed to assign technician', 'error');
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
      window.showToast && window.showToast('Error assigning technician', 'error');
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
            <p className="text-gray-600">Loading maintenance requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Maintenance Services</h2>
              <p className="text-orange-100">Manage facility maintenance and repairs</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Report Issue</span>
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
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
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
              <p className="text-sm text-gray-600">Avg Time</p>
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
              placeholder="Search maintenance requests..."
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
              {maintenanceCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => {
          const categoryInfo = getCategoryInfo(request.category);
          const statusInfo = getStatusInfo(request.status);
          const priorityInfo = getPriorityInfo(request.priority);
          const CategoryIcon = categoryInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <div key={request._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Request Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${categoryInfo.color} rounded-2xl flex items-center justify-center`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-500">{categoryInfo.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(request.urgencyLevel)}`}>
                      {request.urgencyLevel}/10
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{request.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{request.estimatedDuration}min</span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getTimeAgo(request.createdAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Reported by:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {request.reportedBy.firstName} {request.reportedBy.lastName}
                    <span className="text-xs text-gray-500 ml-2">({request.reportedBy.type})</span>
                  </p>
                </div>

                {request.assignedTo ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.assignedTo.firstName} {request.assignedTo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{request.assignedTo.specialization}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Unassigned</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  <p>Reported: {formatDateTime(request.createdAt)}</p>
                  {request.scheduledFor && (
                    <p>Scheduled: {formatDateTime(request.scheduledFor)}</p>
                  )}
                  {request.startedAt && (
                    <p>Started: {formatDateTime(request.startedAt)}</p>
                  )}
                  {request.completedAt && (
                    <p>Completed: {formatDateTime(request.completedAt)}</p>
                  )}
                </div>

                {request.rating && (
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{request.rating}/5</span>
                    {request.feedback && (
                      <span className="text-xs text-gray-500 ml-2">"{request.feedback}"</span>
                    )}
                  </div>
                )}

                {request.resolution && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium mb-1">Resolution:</p>
                    <p className="text-sm text-green-800">{request.resolution}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Details</span>
                  </button>

                  {request.status === 'reported' && (
                    <button
                      onClick={() => handleAssignTechnician(request._id, 'demo-tech-id')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Assign Technician"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  )}

                  {request.status === 'assigned' && (
                    <button
                      onClick={() => handleStatusChange(request._id, 'in_progress')}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Start Work"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}

                  {request.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(request._id, 'completed')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Complete"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Maintenance Requests Found</h3>
          <p className="text-gray-600 mb-6">No maintenance requests match your current filters.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Report First Issue
          </button>
        </div>
      )}

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Maintenance Issue</h3>
            <p className="text-gray-600 mb-4">Maintenance request form will be implemented here.</p>
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
                  window.showToast && window.showToast('Maintenance request feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Submit Request
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
              <h3 className="text-lg font-semibold">Maintenance Request Details</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                  <p className="text-gray-900">{selectedRequest.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{getCategoryInfo(selectedRequest.category).name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{selectedRequest.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityInfo(selectedRequest.priority).color}`}>
                    {getPriorityInfo(selectedRequest.priority).name}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequest.urgencyLevel)}`}>
                    {selectedRequest.urgencyLevel}/10
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedRequest.status).color}`}>
                    {getStatusInfo(selectedRequest.status).name}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                  <p className="text-gray-900">
                    {selectedRequest.reportedBy.firstName} {selectedRequest.reportedBy.lastName}
                    <span className="text-sm text-gray-500 ml-2">({selectedRequest.reportedBy.type})</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported At</label>
                  <p className="text-gray-900">{formatDateTime(selectedRequest.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <p className="text-gray-900">{selectedRequest.estimatedDuration} minutes</p>
                </div>

                {selectedRequest.assignedTo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                    <p className="text-gray-900">
                      {selectedRequest.assignedTo.firstName} {selectedRequest.assignedTo.lastName}
                      <span className="text-sm text-gray-500 ml-2">({selectedRequest.assignedTo.specialization})</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.description}</p>
            </div>

            {selectedRequest.resolution && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800">{selectedRequest.resolution}</p>
                </div>
              </div>
            )}

            {selectedRequest.feedback && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${i}`}
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

export default MaintenanceServices;
