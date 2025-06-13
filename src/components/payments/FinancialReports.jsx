import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  FileText,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const FinancialReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [reportType, setReportType] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  // Mock financial data
  useEffect(() => {
    const mockData = {
      revenue: {
        current: 2450000,
        previous: 2180000,
        growth: 12.4,
        target: 2800000,
        achievement: 87.5,
        breakdown: {
          rooms: 1960000,
          services: 294000,
          extras: 196000
        },
        daily: [
          { date: '2024-01-01', amount: 85000 },
          { date: '2024-01-02', amount: 92000 },
          { date: '2024-01-03', amount: 78000 },
          { date: '2024-01-04', amount: 105000 },
          { date: '2024-01-05', amount: 88000 },
          { date: '2024-01-06', amount: 115000 },
          { date: '2024-01-07', amount: 98000 }
        ]
      },
      expenses: {
        current: 1470000,
        previous: 1380000,
        growth: 6.5,
        breakdown: {
          staff: 588000,
          utilities: 294000,
          maintenance: 147000,
          marketing: 147000,
          other: 294000
        }
      },
      profit: {
        current: 980000,
        previous: 800000,
        margin: 40.0,
        previousMargin: 36.7
      },
      payments: {
        total: 156,
        completed: 142,
        pending: 8,
        failed: 6,
        successRate: 91.0,
        averageAmount: 15705,
        methods: {
          credit_card: 45,
          bank_transfer: 30,
          cash: 20,
          mobile: 5
        }
      }
    };
    setReportData(mockData);
  }, [selectedPeriod, reportType]);

  // Generate report
  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.showToast && window.showToast('Report generated successfully', 'success');
    } catch (error) {
      window.showToast && window.showToast('Error generating report', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export report
  const exportReport = (format) => {
    window.showToast && window.showToast(`Exporting report as ${format.toUpperCase()}...`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sysora-midnight via-blue-800 to-sysora-midnight rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-sysora-mint/20 rounded-2xl">
                <BarChart3 className="w-8 h-8 text-sysora-mint" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Financial Reports & Analytics</h2>
                <p className="text-blue-100/80 text-lg">Comprehensive financial insights & performance tracking</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{reportData.revenue?.current?.toLocaleString()} DZD</p>
                    <p className="text-sm text-blue-100/70">Total Revenue</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold">{reportData.profit?.current?.toLocaleString()} DZD</p>
                    <p className="text-sm text-blue-100/70">Net Profit</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{reportData.profit?.margin}%</p>
                    <p className="text-sm text-blue-100/70">Profit Margin</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{reportData.payments?.successRate}%</p>
                    <p className="text-sm text-blue-100/70">Payment Success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setLoading(!loading)}
              className={`flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center space-x-2 p-4 bg-red-600/90 hover:bg-red-600 rounded-2xl transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="flex items-center space-x-2 p-4 bg-green-600/90 hover:bg-green-600 rounded-2xl transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Excel</span>
              </button>
            </div>
            
            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center space-x-3 bg-sysora-mint text-sysora-midnight px-8 py-4 rounded-2xl hover:bg-sysora-mint/90 transition-colors font-semibold disabled:opacity-50"
            >
              <FileText className="w-5 h-5" />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Configuration</h3>
            <p className="text-gray-500">Customize your financial analysis parameters</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[180px]"
            >
              <option value="today">📅 Today</option>
              <option value="this_week">📅 This Week</option>
              <option value="this_month">📅 This Month</option>
              <option value="last_month">📅 Last Month</option>
              <option value="this_quarter">📅 This Quarter</option>
              <option value="this_year">📅 This Year</option>
              <option value="custom">📅 Custom Range</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-6 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint bg-gray-50 focus:bg-white min-w-[180px]"
            >
              <option value="revenue">💰 Revenue Analysis</option>
              <option value="profit">📈 Profit & Loss</option>
              <option value="payments">💳 Payment Analysis</option>
              <option value="forecast">🔮 Financial Forecast</option>
              <option value="comparison">📊 Period Comparison</option>
            </select>
          </div>
        </div>
      </div>

      {/* Revenue Analysis */}
      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +{reportData.revenue?.growth}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Revenue Chart Placeholder */}
            <div className="h-64 bg-gradient-to-br from-sysora-mint/10 to-blue-50 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-sysora-mint mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Revenue Trend Chart</p>
                <p className="text-sm text-gray-500">Interactive chart will be displayed here</p>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {reportData.revenue?.breakdown?.rooms?.toLocaleString()} DZD
                </div>
                <div className="text-sm text-blue-600">Room Revenue</div>
                <div className="text-xs text-gray-500">80% of total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {reportData.revenue?.breakdown?.services?.toLocaleString()} DZD
                </div>
                <div className="text-sm text-green-600">Services</div>
                <div className="text-xs text-gray-500">12% of total</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {reportData.revenue?.breakdown?.extras?.toLocaleString()} DZD
                </div>
                <div className="text-sm text-purple-600">Extras</div>
                <div className="text-xs text-gray-500">8% of total</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6">
            {/* Target Achievement */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Target Achievement</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Target</span>
                    <span className="font-semibold">{reportData.revenue?.achievement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-sysora-mint to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${reportData.revenue?.achievement}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{reportData.revenue?.current?.toLocaleString()} DZD</span>
                    <span>{reportData.revenue?.target?.toLocaleString()} DZD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Comparison */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Growth Analysis</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Current Period</p>
                    <p className="text-sm text-gray-500">{reportData.revenue?.current?.toLocaleString()} DZD</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Previous Period</p>
                    <p className="text-sm text-gray-500">{reportData.revenue?.previous?.toLocaleString()} DZD</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    +{reportData.revenue?.growth}%
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span>View Detailed Report</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Analysis */}
      {reportType === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <PieChart className="w-6 h-6" />
              <span>Payment Methods Distribution</span>
            </h3>
            
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Payment Distribution Chart</p>
                <p className="text-sm text-gray-500">Interactive pie chart will be displayed here</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(reportData.payments?.methods || {}).map(([method, percentage]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-sysora-mint rounded-full"></div>
                    <span className="font-medium capitalize">{method.replace('_', ' ')}</span>
                  </div>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Payment Performance</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{reportData.payments?.completed}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{reportData.payments?.pending}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{reportData.payments?.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{reportData.payments?.successRate}%</div>
                <div className="text-sm text-blue-600">Success Rate</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium">Average Payment Amount</span>
                <span className="font-bold text-sysora-midnight">
                  {reportData.payments?.averageAmount?.toLocaleString()} DZD
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium">Total Transactions</span>
                <span className="font-bold text-sysora-midnight">{reportData.payments?.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
