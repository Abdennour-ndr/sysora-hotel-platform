import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  DollarSign,
  Users,
  Bed,
  CreditCard,
  Activity,
  Clock,
  Settings,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Share,
  Archive
} from 'lucide-react';

const UnifiedReportsCenter = ({ 
  reservations = [], 
  rooms = [], 
  guests = [], 
  payments = [],
  operations = []
}) => {
  const [activeCategory, setActiveCategory] = useState('financial');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedReports, setGeneratedReports] = useState([]);

  // Report categories configuration
  const reportCategories = [
    {
      id: 'financial',
      title: 'Financial Reports',
      icon: DollarSign,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Revenue, payments, and financial analysis'
    },
    {
      id: 'operational',
      title: 'Operational Reports',
      icon: Activity,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Occupancy, bookings, and operations'
    },
    {
      id: 'guest',
      title: 'Guest Reports',
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Guest satisfaction and behavior analysis'
    },
    {
      id: 'performance',
      title: 'Performance Reports',
      icon: TrendingUp,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'KPIs, metrics, and performance analysis'
    },
    {
      id: 'custom',
      title: 'Custom Reports',
      icon: Settings,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Customizable and scheduled reports'
    }
  ];

  // Available reports for each category
  const availableReports = {
    financial: [
      { id: 'revenue-summary', name: 'Revenue Summary', description: 'Complete revenue breakdown and analysis' },
      { id: 'payment-methods', name: 'Payment Methods Analysis', description: 'Payment methods distribution and trends' },
      { id: 'profit-loss', name: 'Profit & Loss Statement', description: 'Detailed P&L with cost analysis' },
      { id: 'tax-report', name: 'Tax Report', description: 'Tax calculations and compliance report' },
      { id: 'cash-flow', name: 'Cash Flow Analysis', description: 'Cash flow patterns and projections' }
    ],
    operational: [
      { id: 'occupancy-analysis', name: 'Occupancy Analysis', description: 'Room occupancy rates and trends' },
      { id: 'booking-sources', name: 'Booking Sources Report', description: 'Analysis of booking channels and sources' },
      { id: 'room-performance', name: 'Room Performance', description: 'Individual room performance metrics' },
      { id: 'operational-efficiency', name: 'Operational Efficiency', description: 'Staff productivity and efficiency metrics' },
      { id: 'maintenance-report', name: 'Maintenance Report', description: 'Room maintenance and service records' }
    ],
    guest: [
      { id: 'guest-satisfaction', name: 'Guest Satisfaction', description: 'Guest feedback and satisfaction scores' },
      { id: 'guest-demographics', name: 'Guest Demographics', description: 'Guest profile and demographic analysis' },
      { id: 'loyalty-analysis', name: 'Loyalty Analysis', description: 'Guest retention and loyalty metrics' },
      { id: 'guest-behavior', name: 'Guest Behavior', description: 'Booking patterns and preferences' },
      { id: 'feedback-analysis', name: 'Feedback Analysis', description: 'Detailed feedback and review analysis' }
    ],
    performance: [
      { id: 'kpi-dashboard', name: 'KPI Dashboard', description: 'Key performance indicators overview' },
      { id: 'benchmark-analysis', name: 'Benchmark Analysis', description: 'Performance vs industry benchmarks' },
      { id: 'trend-analysis', name: 'Trend Analysis', description: 'Historical trends and projections' },
      { id: 'competitive-analysis', name: 'Competitive Analysis', description: 'Market position and competition' },
      { id: 'roi-analysis', name: 'ROI Analysis', description: 'Return on investment calculations' }
    ],
    custom: [
      { id: 'custom-builder', name: 'Report Builder', description: 'Create custom reports with drag-and-drop' },
      { id: 'scheduled-reports', name: 'Scheduled Reports', description: 'Automated report generation and delivery' },
      { id: 'template-library', name: 'Template Library', description: 'Pre-built report templates' },
      { id: 'data-export', name: 'Data Export', description: 'Export raw data in various formats' },
      { id: 'api-reports', name: 'API Reports', description: 'Generate reports via API integration' }
    ]
  };

  useEffect(() => {
    loadRecentReports();
  }, []);

  const loadRecentReports = () => {
    // Simulate loading recent reports
    const mockReports = [
      {
        id: 1,
        name: 'Monthly Revenue Report',
        category: 'financial',
        generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed',
        size: '2.4 MB',
        downloads: 15
      },
      {
        id: 2,
        name: 'Guest Satisfaction Analysis',
        category: 'guest',
        generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'completed',
        size: '1.8 MB',
        downloads: 8
      },
      {
        id: 3,
        name: 'Occupancy Trends',
        category: 'operational',
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'completed',
        size: '3.1 MB',
        downloads: 23
      }
    ];
    setGeneratedReports(mockReports);
  };

  const generateReport = async (reportId) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: Date.now(),
        name: availableReports[activeCategory].find(r => r.id === reportId)?.name || 'Generated Report',
        category: activeCategory,
        generatedAt: new Date(),
        status: 'completed',
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloads: 0
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      window.showToast && window.showToast('Report generated successfully', 'success');
    } catch (error) {
      window.showToast && window.showToast('Error generating report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportId) => {
    window.showToast && window.showToast('Downloading report...', 'info');
    // Simulate download
    setGeneratedReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, downloads: report.downloads + 1 }
          : report
      )
    );
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredReports = availableReports[activeCategory]?.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-sysora-midnight to-blue-800 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sysora-mint/20 rounded-xl">
                <FileText className="w-6 h-6 text-sysora-mint" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Reports Center</h1>
                <p className="text-blue-100/80 text-sm">Unified reporting and analytics hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sysora-mint"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="1year">Last year</option>
              </select>
              
              <button
                onClick={loadRecentReports}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <div
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isActive ? 'ring-2 ring-sysora-mint' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-xl ${category.lightColor}`}>
                  <Icon className={`w-6 h-6 ${category.textColor}`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                </div>
                
                <div className="text-xs text-gray-500">
                  {availableReports[category.id]?.length || 0} reports
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sysora-mint focus:border-sysora-mint"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-sysora-mint text-sysora-midnight hover:bg-sysora-mint/90 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available {reportCategories.find(c => c.id === activeCategory)?.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                
                <button
                  onClick={() => generateReport(report.id)}
                  disabled={loading}
                  className="ml-3 px-3 py-1.5 bg-sysora-mint text-sysora-midnight hover:bg-sysora-mint/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
        
        <div className="space-y-3">
          {generatedReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatTimeAgo(report.generatedAt)}</span>
                    <span>{report.size}</span>
                    <span>{report.downloads} downloads</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadReport(report.id)}
                  className="p-2 text-gray-400 hover:text-sysora-mint hover:bg-sysora-mint/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                <button
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedReportsCenter;
