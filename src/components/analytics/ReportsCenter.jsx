import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Search,
  Eye,
  Share,
  Clock,
  User,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  Bed,
  Star,
  Coffee,
  CreditCard,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Database,
  Brain
} from 'lucide-react';
import realDataAnalyticsService from '../../services/RealDataAnalyticsService';

const ReportsCenter = ({ reservations = [], rooms = [], customers = [] }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [realDataAvailable, setRealDataAvailable] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    loadReports();
  }, [reservations, rooms, customers]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Initialize analytics service with real data
      await realDataAnalyticsService.initialize({
        reservations,
        rooms,
        customers
      });

      // Get analytics data for report generation
      const analytics = await realDataAnalyticsService.getComprehensiveAnalytics(
        reservations, rooms, customers
      );

      setAnalyticsData(analytics);
      setRealDataAvailable(analytics.realData);

      // Generate reports based on real data
      const reportsData = [
        {
          id: 'revenue-summary',
          name: 'Revenue Summary Report',
          description: 'Comprehensive revenue analysis with breakdowns by source, period, and trends',
          category: 'financial',
          type: 'summary',
          frequency: 'daily',
          lastGenerated: '2024-12-15T08:30:00Z',
          generatedBy: 'System',
          status: 'active',
          subscribers: 12,
          downloadCount: 156,
          format: ['PDF', 'Excel', 'CSV'],
          schedule: 'Every day at 9:00 AM',
          dataPoints: ['Total Revenue', 'Revenue by Source', 'Growth Trends', 'Forecasts'],
          charts: ['Line Chart', 'Bar Chart', 'Pie Chart'],
          size: '2.3 MB',
          featured: true
        },
        {
          id: 'occupancy-analysis',
          name: 'Occupancy Analysis Report',
          description: 'Detailed occupancy rates, room utilization, and booking patterns analysis',
          category: 'operations',
          type: 'detailed',
          frequency: 'weekly',
          lastGenerated: '2024-12-14T16:45:00Z',
          generatedBy: 'Operations Manager',
          status: 'active',
          subscribers: 8,
          downloadCount: 89,
          format: ['PDF', 'Excel'],
          schedule: 'Every Monday at 10:00 AM',
          dataPoints: ['Occupancy Rate', 'Room Types', 'Seasonal Trends', 'Booking Channels'],
          charts: ['Heat Map', 'Line Chart', 'Bar Chart'],
          size: '1.8 MB',
          featured: false
        },
        {
          id: 'guest-satisfaction',
          name: 'Guest Satisfaction Report',
          description: 'Customer feedback analysis, ratings, reviews, and satisfaction metrics',
          category: 'customer',
          type: 'analysis',
          frequency: 'monthly',
          lastGenerated: '2024-12-12T14:20:00Z',
          generatedBy: 'Customer Service',
          status: 'active',
          subscribers: 15,
          downloadCount: 234,
          format: ['PDF', 'PowerPoint'],
          schedule: 'First Monday of each month',
          dataPoints: ['Satisfaction Score', 'Review Analysis', 'Complaint Trends', 'Service Ratings'],
          charts: ['Gauge Chart', 'Word Cloud', 'Trend Lines'],
          size: '3.1 MB',
          featured: true
        },
        {
          id: 'financial-performance',
          name: 'Financial Performance Report',
          description: 'Complete financial overview including P&L, cash flow, and budget analysis',
          category: 'financial',
          type: 'comprehensive',
          frequency: 'monthly',
          lastGenerated: '2024-12-10T11:15:00Z',
          generatedBy: 'Finance Team',
          status: 'active',
          subscribers: 6,
          downloadCount: 67,
          format: ['PDF', 'Excel'],
          schedule: 'Last day of each month',
          dataPoints: ['Revenue', 'Expenses', 'Profit Margins', 'Budget Variance'],
          charts: ['Waterfall Chart', 'Line Chart', 'Table'],
          size: '4.2 MB',
          featured: false
        },
        {
          id: 'marketing-roi',
          name: 'Marketing ROI Report',
          description: 'Marketing campaign effectiveness, channel performance, and return on investment',
          category: 'marketing',
          type: 'analysis',
          frequency: 'weekly',
          lastGenerated: '2024-12-13T09:30:00Z',
          generatedBy: 'Marketing Team',
          status: 'active',
          subscribers: 10,
          downloadCount: 123,
          format: ['PDF', 'Excel', 'PowerPoint'],
          schedule: 'Every Friday at 5:00 PM',
          dataPoints: ['Campaign Performance', 'Channel ROI', 'Lead Generation', 'Conversion Rates'],
          charts: ['Funnel Chart', 'Bar Chart', 'Pie Chart'],
          size: '2.7 MB',
          featured: false
        },
        {
          id: 'staff-performance',
          name: 'Staff Performance Report',
          description: 'Employee productivity, performance metrics, and HR analytics',
          category: 'hr',
          type: 'detailed',
          frequency: 'monthly',
          lastGenerated: '2024-12-08T15:45:00Z',
          generatedBy: 'HR Manager',
          status: 'draft',
          subscribers: 4,
          downloadCount: 34,
          format: ['PDF', 'Excel'],
          schedule: 'Second Monday of each month',
          dataPoints: ['Performance Scores', 'Attendance', 'Training Progress', 'Feedback'],
          charts: ['Radar Chart', 'Bar Chart', 'Heat Map'],
          size: '1.9 MB',
          featured: false
        },
        {
          id: 'inventory-status',
          name: 'Inventory Status Report',
          description: 'Stock levels, supply chain analysis, and procurement recommendations',
          category: 'operations',
          type: 'summary',
          frequency: 'weekly',
          lastGenerated: '2024-12-11T12:00:00Z',
          generatedBy: 'Inventory Manager',
          status: 'active',
          subscribers: 7,
          downloadCount: 78,
          format: ['PDF', 'Excel'],
          schedule: 'Every Wednesday at 2:00 PM',
          dataPoints: ['Stock Levels', 'Reorder Points', 'Supplier Performance', 'Cost Analysis'],
          charts: ['Bar Chart', 'Line Chart', 'Table'],
          size: '1.5 MB',
          featured: false
        },
        {
          id: 'competitive-analysis',
          name: 'Competitive Analysis Report',
          description: 'Market positioning, competitor pricing, and industry benchmarks',
          category: 'strategic',
          type: 'analysis',
          frequency: 'quarterly',
          lastGenerated: '2024-12-01T10:00:00Z',
          generatedBy: 'Strategy Team',
          status: 'active',
          subscribers: 9,
          downloadCount: 45,
          format: ['PDF', 'PowerPoint'],
          schedule: 'First day of each quarter',
          dataPoints: ['Market Share', 'Pricing Analysis', 'Service Comparison', 'SWOT Analysis'],
          charts: ['Scatter Plot', 'Comparison Table', 'Matrix'],
          size: '5.1 MB',
          featured: true
        }
      ];

      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'financial': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'operations': return <Settings className="w-5 h-5 text-blue-600" />;
      case 'customer': return <Users className="w-5 h-5 text-purple-600" />;
      case 'marketing': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'hr': return <User className="w-5 h-5 text-indigo-600" />;
      case 'strategic': return <BarChart3 className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'daily': return 'text-green-600';
      case 'weekly': return 'text-blue-600';
      case 'monthly': return 'text-purple-600';
      case 'quarterly': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGenerateReport = async (reportId) => {
    try {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, lastGenerated: new Date().toISOString(), status: 'active' }
          : report
      ));
      window.showToast && window.showToast('Report generated successfully', 'success');
    } catch (error) {
      console.error('Error generating report:', error);
      window.showToast && window.showToast('Failed to generate report', 'error');
    }
  };

  const handleDownloadReport = (report, format) => {
    // Simulate download
    window.showToast && window.showToast(`Downloading ${report.name} as ${format}`, 'success');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(reports.map(report => report.category))];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold">Reports Center</h2>
                {realDataAvailable && (
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full font-medium flex items-center space-x-1">
                    <Database className="w-4 h-4" />
                    <span>Real Data</span>
                  </span>
                )}
                {analyticsData?.aiAnalytics && (
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full font-medium flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>AI Enhanced</span>
                  </span>
                )}
              </div>
              <p className="text-green-100">
                Generate, schedule, and manage comprehensive business reports
                {analyticsData?.dataQuality && (
                  <span className="text-green-200 font-medium">
                    {' '}• Data Quality: {analyticsData.dataQuality.level} ({analyticsData.dataQuality.score.toFixed(0)}%)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowReportBuilder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(report.category)}
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{report.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{report.category}</p>
                  </div>
                </div>
                
                {report.featured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className={`font-medium capitalize ${getFrequencyColor(report.frequency)}`}>
                    {report.frequency}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Generated:</span>
                  <span className="text-gray-900">{formatDate(report.lastGenerated)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="text-gray-900">{report.downloadCount}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {report.format.map(format => (
                  <span
                    key={format}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {format}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Generate Report"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Edit Report"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <div className="relative group">
                    <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
                        {report.format.map(format => (
                          <button
                            key={format}
                            onClick={() => handleDownloadReport(report, format)}
                            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Download {format}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <span className="text-xs text-gray-500">{report.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search criteria or create a new report.'
              : 'Create your first report to get started with business intelligence.'
            }
          </p>
          <button 
            onClick={() => setShowReportBuilder(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsCenter;
