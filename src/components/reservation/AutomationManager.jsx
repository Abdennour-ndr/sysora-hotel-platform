import React, { useState, useEffect } from 'react';
import {
  Bot,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  AlertTriangle,
  Activity,
  BarChart3,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import automationEngine from '../../services/AutomationEngine';

const AutomationManager = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [automationStatus, setAutomationStatus] = useState({
    isRunning: false,
    rulesCount: 0,
    activeAutomations: 0,
    scheduledTasks: 0
  });
  const [automationRules, setAutomationRules] = useState([]);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchAutomationData();
      const interval = setInterval(fetchAutomationData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchAutomationData = async () => {
    setLoading(true);
    try {
      // Get automation status
      const status = automationEngine.getStatus();
      setAutomationStatus(status);

      // Get automation rules (simulated)
      const rules = getSimulatedRules();
      setAutomationRules(rules);

      // Get execution logs (simulated)
      const logs = getSimulatedLogs();
      setExecutionLogs(logs);

    } catch (error) {
      console.error('Error fetching automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSimulatedRules = () => {
    return [
      {
        id: 'auto_checkin_reminder',
        name: 'Check-in Reminders',
        type: 'scheduled',
        status: 'active',
        trigger: 'Daily at 8:00 AM',
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000),
        executionCount: 45,
        successRate: 98.5,
        enabled: true,
        priority: 'high'
      },
      {
        id: 'auto_checkout_reminder',
        name: 'Check-out Reminders',
        type: 'scheduled',
        status: 'active',
        trigger: 'Daily at 10:00 AM',
        lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000),
        executionCount: 38,
        successRate: 97.2,
        enabled: true,
        priority: 'medium'
      },
      {
        id: 'auto_payment_followup',
        name: 'Payment Follow-up',
        type: 'event',
        status: 'active',
        trigger: 'After reservation creation',
        lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000),
        executionCount: 156,
        successRate: 94.8,
        enabled: true,
        priority: 'high'
      },
      {
        id: 'auto_room_status_update',
        name: 'Room Status Updates',
        type: 'event',
        status: 'active',
        trigger: 'After checkout completion',
        lastExecuted: new Date(Date.now() - 30 * 60 * 1000),
        executionCount: 89,
        successRate: 99.1,
        enabled: true,
        priority: 'urgent'
      },
      {
        id: 'auto_pricing_optimization',
        name: 'Dynamic Pricing Updates',
        type: 'scheduled',
        status: 'active',
        trigger: 'Daily at 6:00 AM',
        lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000),
        executionCount: 30,
        successRate: 96.7,
        enabled: true,
        priority: 'medium'
      },
      {
        id: 'auto_guest_feedback',
        name: 'Guest Feedback Collection',
        type: 'delayed',
        status: 'paused',
        trigger: '2 hours after checkout',
        lastExecuted: new Date(Date.now() - 12 * 60 * 60 * 1000),
        executionCount: 67,
        successRate: 85.3,
        enabled: false,
        priority: 'low'
      }
    ];
  };

  const getSimulatedLogs = () => {
    return [
      {
        id: 1,
        ruleId: 'auto_checkin_reminder',
        ruleName: 'Check-in Reminders',
        executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'success',
        affectedItems: 3,
        duration: 1.2,
        details: 'Sent reminders to 3 guests checking in today'
      },
      {
        id: 2,
        ruleId: 'auto_room_status_update',
        ruleName: 'Room Status Updates',
        executedAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'success',
        affectedItems: 1,
        duration: 0.8,
        details: 'Updated Room 205 status to cleaning after checkout'
      },
      {
        id: 3,
        ruleId: 'auto_payment_followup',
        ruleName: 'Payment Follow-up',
        executedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'success',
        affectedItems: 2,
        duration: 2.1,
        details: 'Sent payment reminders to 2 guests with pending balances'
      },
      {
        id: 4,
        ruleId: 'auto_pricing_optimization',
        ruleName: 'Dynamic Pricing Updates',
        executedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'success',
        affectedItems: 15,
        duration: 5.3,
        details: 'Updated pricing for 15 room types based on demand analysis'
      },
      {
        id: 5,
        ruleId: 'auto_checkout_reminder',
        ruleName: 'Check-out Reminders',
        executedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'partial',
        affectedItems: 4,
        duration: 1.8,
        details: 'Sent reminders to 4 guests, 1 notification failed'
      }
    ];
  };

  const handleStartAutomation = async () => {
    setLoading(true);
    try {
      const result = await automationEngine.initialize();
      if (result.success) {
        window.showToast && window.showToast('Automation engine started successfully', 'success');
        fetchAutomationData();
      } else {
        window.showToast && window.showToast('Failed to start automation engine', 'error');
      }
    } catch (error) {
      console.error('Error starting automation:', error);
      window.showToast && window.showToast('Error starting automation engine', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStopAutomation = () => {
    automationEngine.stop();
    window.showToast && window.showToast('Automation engine stopped', 'info');
    fetchAutomationData();
  };

  const handleToggleRule = (ruleId, enabled) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !enabled } : rule
      )
    );
    
    const action = enabled ? 'disabled' : 'enabled';
    window.showToast && window.showToast(`Automation rule ${action}`, 'info');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getExecutionStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFilteredRules = () => {
    if (filter === 'all') return automationRules;
    return automationRules.filter(rule => rule.type === filter);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Bot className="w-6 h-6 mr-3" />
                Automation Manager
              </h2>
              <p className="text-purple-100">Intelligent automation for hotel operations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                automationStatus.isRunning ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  automationStatus.isRunning ? 'bg-white animate-pulse' : 'bg-white'
                }`}></div>
                <span className="text-sm font-medium">
                  {automationStatus.isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center space-x-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'rules', label: 'Automation Rules', icon: Settings },
              { id: 'logs', label: 'Execution Logs', icon: Activity }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading automation data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  {/* Control Panel */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Control</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleStartAutomation}
                          disabled={automationStatus.isRunning || loading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start Automation</span>
                        </button>
                        <button
                          onClick={handleStopAutomation}
                          disabled={!automationStatus.isRunning}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Stop Automation</span>
                        </button>
                        <button
                          onClick={fetchAutomationData}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{automationStatus.rulesCount}</div>
                          <div className="text-sm text-gray-600">Total Rules</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <Zap className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{automationStatus.activeAutomations}</div>
                          <div className="text-sm text-gray-600">Active Automations</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{automationStatus.scheduledTasks}</div>
                          <div className="text-sm text-gray-600">Scheduled Tasks</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                          <Activity className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">97.2%</div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {executionLogs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getExecutionStatusIcon(log.status)}
                            <div>
                              <div className="font-medium text-gray-900">{log.ruleName}</div>
                              <div className="text-sm text-gray-600">{log.details}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.executedAt.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rules Tab */}
              {selectedTab === 'rules' && (
                <div className="space-y-6">
                  {/* Filter and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Filter className="w-5 h-5 text-gray-400" />
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Rules</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="event">Event-based</option>
                        <option value="realtime">Real-time</option>
                      </select>
                    </div>
                    <button
                      onClick={() => window.showToast && window.showToast('Add new rule feature coming soon', 'info')}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Rule</span>
                    </button>
                  </div>

                  {/* Rules List */}
                  <div className="space-y-4">
                    {getFilteredRules().map(rule => (
                      <div key={rule.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                                {rule.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                                {rule.priority}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleRule(rule.id, rule.enabled)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                rule.enabled
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {rule.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Trigger:</span>
                            <div className="font-medium">{rule.trigger}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Executed:</span>
                            <div className="font-medium">{rule.lastExecuted.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Success Rate:</span>
                            <div className="font-medium">{rule.successRate}%</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Executed {rule.executionCount} times</span>
                            <span>Type: {rule.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logs Tab */}
              {selectedTab === 'logs' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Execution Logs</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rule
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Executed At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {executionLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {getExecutionStatusIcon(log.status)}
                                  <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                    {log.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{log.ruleName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{log.executedAt.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{log.affectedItems}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{log.duration}s</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{log.details}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            Automation Engine v2.0 • {automationStatus.isRunning ? 'Active' : 'Inactive'} • Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationManager;
