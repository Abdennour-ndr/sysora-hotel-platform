import React, { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bed,
  Wrench,
  User,
  Calendar,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';

const SimpleHousekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress, completed
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/tasks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setTasks(data.data.tasks || []);
        calculateStats(data.data.tasks || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Fallback demo data
      const demoTasks = [
        {
          _id: '1',
          roomNumber: '101',
          type: 'cleaning',
          description: 'Standard room cleaning',
          status: 'pending',
          priority: 'normal',
          assignedTo: null,
          estimatedDuration: 30,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          roomNumber: '102',
          type: 'cleaning',
          description: 'Deep cleaning required',
          status: 'in_progress',
          priority: 'high',
          assignedTo: 'Maria Garcia',
          estimatedDuration: 45,
          createdAt: new Date().toISOString(),
          startedAt: new Date().toISOString()
        },
        {
          _id: '3',
          roomNumber: '103',
          type: 'maintenance',
          description: 'Fix bathroom faucet',
          status: 'pending',
          priority: 'high',
          assignedTo: null,
          estimatedDuration: 60,
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(demoTasks);
      calculateStats(demoTasks);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const total = taskList.length;
    const pending = taskList.filter(t => t.status === 'pending').length;
    const inProgress = taskList.filter(t => t.status === 'in_progress').length;
    const completed = taskList.filter(t => t.status === 'completed').length;
    setStats({ total, pending, inProgress, completed });
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/housekeeping/tasks/${taskId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (response.ok) {
        const updatedTasks = tasks.map(task => {
          if (task._id === taskId) {
            const updatedTask = { ...task, status: newStatus };
            if (newStatus === 'in_progress') {
              updatedTask.startedAt = new Date().toISOString();
            } else if (newStatus === 'completed') {
              updatedTask.completedAt = new Date().toISOString();
            }
            return updatedTask;
          }
          return task;
        });
        setTasks(updatedTasks);
        calculateStats(updatedTasks);
        window.showToast && window.showToast(`Task ${newStatus.replace('_', ' ')}`, 'success');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      window.showToast && window.showToast('Failed to update task', 'error');
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'cleaning': return <Coffee className="w-5 h-5 text-blue-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-red-600" />;
      case 'inspection': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bed className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Coffee className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Housekeeping Tasks</h2>
              <p className="text-teal-100">Daily cleaning and maintenance assignments</p>
            </div>
          </div>
          
          <button
            onClick={loadTasks}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Coffee className="w-8 h-8 text-gray-600" />
            <div>
              <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status
                ? 'bg-sysora-mint text-sysora-midnight'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All Tasks' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sysora-mint mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTaskIcon(task.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">Room {task.roomNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>Est. {task.estimatedDuration}min</span>
                      {task.assignedTo && <span>Assigned to: {task.assignedTo}</span>}
                      {task.startedAt && <span>Started: {formatTime(task.startedAt)}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task._id, 'in_progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => updateTaskStatus(task._id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleHousekeeping;
