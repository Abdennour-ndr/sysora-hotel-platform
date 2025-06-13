import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Palette,
  Settings,
  BarChart3,
  Users,
  Globe,
  Layers,
  Edit3,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import ContentManager from './ContentManager';
import ContentEditor from './ContentEditor';
import MediaLibrary from './MediaLibrary';
import ThemeCustomizer from '../customization/ThemeCustomizer';

const CMSHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [cmsStats, setCmsStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCMSData();
  }, []);

  const loadCMSData = async () => {
    setLoading(true);
    try {
      // Load CMS statistics
      const stats = {
        totalContent: 47,
        publishedContent: 32,
        draftContent: 12,
        archivedContent: 3,
        totalMedia: 156,
        mediaStorage: 2.3, // GB
        pageViews: 15420,
        uniqueVisitors: 3240,
        avgSessionDuration: '3:42',
        bounceRate: 32.5,
        topPages: [
          { page: 'Home', views: 4520, change: 12.5 },
          { page: 'Rooms', views: 3210, change: 8.3 },
          { page: 'About', views: 2180, change: -2.1 },
          { page: 'Contact', views: 1890, change: 15.7 },
          { page: 'Services', views: 1650, change: 5.2 }
        ],
        contentPerformance: {
          mostViewed: 'Welcome to Sysora Hotel',
          mostShared: 'Hotel Room Gallery',
          mostEngaging: 'Hotel Promotional Video',
          recentlyUpdated: 'Hotel Policies and Terms'
        }
      };

      setCmsStats(stats);

      // Load recent activity
      const activity = [
        {
          id: 1,
          type: 'content_created',
          title: 'New blog post created',
          description: 'Hotel Summer Packages 2024',
          user: 'Marketing Team',
          timestamp: '2024-12-15T10:30:00Z',
          icon: FileText,
          color: 'blue'
        },
        {
          id: 2,
          type: 'media_uploaded',
          title: 'Images uploaded',
          description: '12 new room photos added to gallery',
          user: 'Content Manager',
          timestamp: '2024-12-15T09:15:00Z',
          icon: Image,
          color: 'green'
        },
        {
          id: 3,
          type: 'content_published',
          title: 'Content published',
          description: 'Restaurant Menu updated and published',
          user: 'Restaurant Manager',
          timestamp: '2024-12-14T16:45:00Z',
          icon: CheckCircle,
          color: 'purple'
        },
        {
          id: 4,
          type: 'theme_updated',
          title: 'Theme customized',
          description: 'Brand colors updated to match new guidelines',
          user: 'Design Team',
          timestamp: '2024-12-14T14:20:00Z',
          icon: Palette,
          color: 'pink'
        },
        {
          id: 5,
          type: 'content_edited',
          title: 'Content updated',
          description: 'About Us page content revised',
          user: 'Admin',
          timestamp: '2024-12-14T11:30:00Z',
          icon: Edit3,
          color: 'orange'
        }
      ];

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'content', name: 'Content Manager', icon: FileText },
    { id: 'media', name: 'Media Library', icon: Image },
    { id: 'themes', name: 'Theme Customizer', icon: Palette },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getActivityColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading CMS Hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Content Management Hub</h2>
              <p className="text-indigo-100">Manage your website content, media, and design</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowContentEditor(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Content</span>
            </button>
            <button 
              onClick={() => setShowMediaLibrary(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">CONTENT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-900">{cmsStats.totalContent}</div>
                    <div className="text-sm text-blue-700">
                      {cmsStats.publishedContent} published, {cmsStats.draftContent} drafts
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-600">+8 this month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">MEDIA</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-900">{cmsStats.totalMedia}</div>
                    <div className="text-sm text-green-700">
                      {cmsStats.mediaStorage} GB storage used
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">+23 files this week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">PAGE VIEWS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-900">{cmsStats.pageViews.toLocaleString()}</div>
                    <div className="text-sm text-purple-700">
                      {cmsStats.uniqueVisitors.toLocaleString()} unique visitors
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-purple-600">+12.5% vs last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-orange-600 font-medium">ENGAGEMENT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-900">{cmsStats.avgSessionDuration}</div>
                    <div className="text-sm text-orange-700">
                      {cmsStats.bounceRate}% bounce rate
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-600">Improving</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Pages and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
                  <div className="space-y-3">
                    {cmsStats.topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900">{page.page}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {page.views.toLocaleString()}
                          </div>
                          <div className={`text-xs ${page.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {page.change > 0 ? '+' : ''}{page.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.color)}`}>
                          {getActivityIcon(activity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <span>{activity.user}</span>
                            <span>•</span>
                            <span>{formatDate(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Performance */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Most Viewed</h4>
                    <p className="text-sm text-gray-600">{cmsStats.contentPerformance.mostViewed}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Most Shared</h4>
                    <p className="text-sm text-gray-600">{cmsStats.contentPerformance.mostShared}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Most Engaging</h4>
                    <p className="text-sm text-gray-600">{cmsStats.contentPerformance.mostEngaging}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Recently Updated</h4>
                    <p className="text-sm text-gray-600">{cmsStats.contentPerformance.recentlyUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'media' && (
            <div>
              <button
                onClick={() => setShowMediaLibrary(true)}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-gray-400 transition-colors"
              >
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Media Library</h3>
                <p className="text-gray-600">Manage your images, videos, and documents</p>
              </button>
            </div>
          )}
          {activeTab === 'themes' && <ThemeCustomizer />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-6">Detailed content performance analytics coming soon</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Analytics Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ContentEditor
        content={selectedContent}
        onSave={(content) => {
          console.log('Content saved:', content);
          setShowContentEditor(false);
          setSelectedContent(null);
        }}
        onClose={() => {
          setShowContentEditor(false);
          setSelectedContent(null);
        }}
        isOpen={showContentEditor}
      />

      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media) => {
          console.log('Media selected:', media);
        }}
      />
    </div>
  );
};

export default CMSHub;
