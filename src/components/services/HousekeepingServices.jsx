import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Play,
  AlertTriangle,
  Bed,
  Trash2,
  Sparkles,
  Shirt,
  Coffee,
  Wrench,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

const HousekeepingServices = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    avgTime: 0
  });

  // Housekeeping task types
  const taskTypes = [
    { id: 'cleaning', name: 'Room Cleaning', icon: Sparkles, color: 'bg-blue-500' },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, color: 'bg-orange-500' },
    { id: 'laundry', name: 'Laundry', icon: Shirt, color: 'bg-purple-500' },
    { id: 'room_service', name: 'Room Service', icon: Coffee, color: 'bg-green-500' },
    { id: 'inspection', name: 'Room Inspection', icon: CheckCircle, color: 'bg-indigo-500' },
    { id: 'deep_clean', name: 'Deep Cleaning', icon: Home, color: 'bg-pink-500' }
  ];

  // Task statuses
  const taskStatuses = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { id: 'assigned', name: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: User },
    { id: 'in_progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Play },
    { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  // Task priorities
  const taskPriorities = [
    { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, selectedStatus, selectedType, selectedPriority]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTasks(data.data.tasks || []);
      } else {
        // Fallback to demo data
        setTasks(generateDemoTasks());
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks(generateDemoTasks());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/stats`, {
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

  const generateDemoTasks = () => {
    const now = new Date();
    return [
      {
        _id: '1',
        type: 'cleaning',
        title: 'Clean Room 101',
        description: 'Standard room cleaning after checkout',
        roomNumber: '101',
        status: 'pending',
        priority: 'normal',
        assignedTo: null,
        createdAt: new Date(now.getTime() - 30 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() + 60 * 60000).toISOString(),
        estimatedDuration: 45,
        floor: 1,
        building: 'Main Building'
      },
      {
        _id: '2',
        type: 'maintenance',
        title: 'Fix AC in Room 205',
        description: 'Air conditioning not working properly',
        roomNumber: '205',
        status: 'in_progress',
        priority: 'high',
        assignedTo: { _id: 'st1', firstName: 'Ahmed', lastName: 'Hassan' },
        createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() - 60 * 60000).toISOString(),
        startedAt: new Date(now.getTime() - 30 * 60000).toISOString(),
        estimatedDuration: 90,
        floor: 2,
        building: 'Main Building'
      },
      {
        _id: '3',
        type: 'laundry',
        title: 'Laundry Service - Room 312',
        description: 'Guest requested laundry pickup',
        roomNumber: '312',
        status: 'assigned',
        priority: 'normal',
        assignedTo: { _id: 'st2', firstName: 'Fatima', lastName: 'Ali' },
        createdAt: new Date(now.getTime() - 180 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() + 30 * 60000).toISOString(),
        estimatedDuration: 15,
        floor: 3,
        building: 'Main Building'
      },
      {
        _id: '4',
        type: 'deep_clean',
        title: 'Deep Clean Suite 501',
        description: 'Monthly deep cleaning for presidential suite',
        roomNumber: '501',
        status: 'completed',
        priority: 'normal',
        assignedTo: { _id: 'st3', firstName: 'Nadia', lastName: 'Boumediene' },
        createdAt: new Date(now.getTime() - 300 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() - 240 * 60000).toISOString(),
        startedAt: new Date(now.getTime() - 240 * 60000).toISOString(),
        completedAt: new Date(now.getTime() - 120 * 60000).toISOString(),
        estimatedDuration: 120,
        actualDuration: 120,
        floor: 5,
        building: 'Main Building',
        rating: 5,
        notes: 'Excellent work, suite is spotless'
      },
      {
        _id: '5',
        type: 'room_service',
        title: 'Room Service - Room 408',
        description: 'Breakfast delivery requested',
        roomNumber: '408',
        status: 'pending',
        priority: 'urgent',
        assignedTo: null,
        createdAt: new Date(now.getTime() - 15 * 60000).toISOString(),
        scheduledFor: new Date(now.getTime() + 15 * 60000).toISOString(),
        estimatedDuration: 20,
        floor: 4,
        building: 'Main Building'
      }
    ];
  };

  const calculateStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    
    // Calculate average completion time
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.actualDuration);
    const avgTime = completedTasks.length > 0 
      ? Math.round(completedTasks.reduce((sum, t) => sum + t.actualDuration, 0) / completedTasks.length)
      : 0;

    setStats({ total, pending, inProgress, completed, avgTime });
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.roomNumber.includes(searchTerm) ||
        task.assignedTo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(task => task.type === selectedType);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    setFilteredTasks(filtered);
  };

  const getTaskTypeInfo = (type) => {
    return taskTypes.find(t => t.id === type) || taskTypes[0];
  };

  const getStatusInfo = (status) => {
    return taskStatuses.find(s => s.id === status) || taskStatuses[0];
  };

  const getPriorityInfo = (priority) => {
    return taskPriorities.find(p => p.id === priority) || taskPriorities[1];
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/tasks/${taskId}/status`, {
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

        setTasks(tasks.map(t => 
          t._id === taskId ? { ...t, ...updateData } : t
        ));
        window.showToast && window.showToast(`Task ${newStatus.replace('_', ' ')} successfully`, 'success');
      } else {
        window.showToast && window.showToast('Failed to update task status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      window.showToast && window.showToast('Error updating task status', 'error');
    }
  };

  const handleAssignTask = async (taskId, staffId) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/tasks/${taskId}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ staffId })
      });

      if (response.ok) {
        // Update task with assigned staff (demo implementation)
        setTasks(tasks.map(t => 
          t._id === taskId 
            ? { ...t, assignedTo: { _id: staffId, firstName: 'Staff', lastName: 'Member' }, status: 'assigned' }
            : t
        ));
        window.showToast && window.showToast('Task assigned successfully', 'success');
      } else {
        window.showToast && window.showToast('Failed to assign task', 'error');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      window.showToast && window.showToast('Error assigning task', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading housekeeping tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Housekeeping Services</h2>
              <p className="text-blue-100">Manage cleaning, maintenance, and room services</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
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
              <p className="text-2xl font-bold text-indigo-600">{stats.avgTime}m</p>
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
              placeholder="Search tasks, rooms, or staff..."
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
              {taskStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              {taskPriorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const typeInfo = getTaskTypeInfo(task.type);
          const statusInfo = getStatusInfo(task.status);
          const priorityInfo = getPriorityInfo(task.priority);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <div key={task._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Task Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${typeInfo.color} rounded-2xl flex items-center justify-center`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">{typeInfo.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{task.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>Room {task.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedDuration}min</span>
                  </div>
                </div>
              </div>

              {/* Task Details */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getTimeAgo(task.createdAt)}
                  </div>
                </div>

                {task.assignedTo ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Assigned Staff</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Unassigned</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  <p>Scheduled: {formatDateTime(task.scheduledFor)}</p>
                  {task.startedAt && (
                    <p>Started: {formatDateTime(task.startedAt)}</p>
                  )}
                  {task.completedAt && (
                    <p>Completed: {formatDateTime(task.completedAt)}</p>
                  )}
                </div>

                {task.rating && (
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{task.rating}/5</span>
                    {task.notes && (
                      <span className="text-xs text-gray-500 ml-2">"{task.notes}"</span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {task.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAssignTask(task._id, 'demo-staff-id')}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span>Assign</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(task._id, 'cancelled')}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {task.status === 'assigned' && (
                    <button
                      onClick={() => handleStatusChange(task._id, 'in_progress')}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                  )}

                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(task._id, 'completed')}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                  )}

                  {task.status === 'completed' && (
                    <div className="flex-1 text-center py-2 text-green-600 font-medium text-sm">
                      ✓ Task Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-600 mb-6">No housekeeping tasks match your current filters.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Task
          </button>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Housekeeping Task</h3>
            <p className="text-gray-600 mb-4">Task creation form will be implemented here.</p>
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
                  window.showToast && window.showToast('Task creation feature coming soon', 'info');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HousekeepingServices;
