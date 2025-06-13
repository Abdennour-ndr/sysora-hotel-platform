import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Video, 
  Globe,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Settings,
  Save,
  X,
  Calendar,
  User,
  Tag,
  Folder,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ContentManager = () => {
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Simulate loading content from API
      const contentData = [
        {
          id: 'content-1',
          title: 'Welcome to Sysora Hotel Management',
          type: 'page',
          category: 'landing',
          status: 'published',
          author: 'Admin',
          createdAt: '2024-12-10T10:30:00Z',
          updatedAt: '2024-12-15T14:20:00Z',
          views: 1247,
          content: '<h1>Welcome to Sysora</h1><p>The most advanced hotel management system...</p>',
          seo: {
            title: 'Sysora - Advanced Hotel Management System',
            description: 'Streamline your hotel operations with AI-powered insights',
            keywords: 'hotel management, AI, automation, booking system'
          },
          featured: true,
          language: 'en'
        },
        {
          id: 'content-2',
          title: 'Hotel Room Gallery',
          type: 'gallery',
          category: 'media',
          status: 'published',
          author: 'Content Manager',
          createdAt: '2024-12-08T16:45:00Z',
          updatedAt: '2024-12-12T09:15:00Z',
          views: 892,
          images: [
            { url: '/images/room1.jpg', alt: 'Deluxe Room', caption: 'Spacious deluxe room with city view' },
            { url: '/images/room2.jpg', alt: 'Suite', caption: 'Luxury suite with premium amenities' },
            { url: '/images/room3.jpg', alt: 'Standard Room', caption: 'Comfortable standard room' }
          ],
          featured: false,
          language: 'en'
        },
        {
          id: 'content-3',
          title: 'Hotel Policies and Terms',
          type: 'document',
          category: 'legal',
          status: 'draft',
          author: 'Legal Team',
          createdAt: '2024-12-05T11:20:00Z',
          updatedAt: '2024-12-14T13:30:00Z',
          views: 234,
          content: '<h2>Cancellation Policy</h2><p>Free cancellation up to 24 hours...</p>',
          featured: false,
          language: 'en'
        },
        {
          id: 'content-4',
          title: 'Hotel Promotional Video',
          type: 'video',
          category: 'marketing',
          status: 'published',
          author: 'Marketing Team',
          createdAt: '2024-12-01T08:00:00Z',
          updatedAt: '2024-12-10T16:45:00Z',
          views: 2156,
          videoUrl: '/videos/hotel-promo.mp4',
          thumbnail: '/images/video-thumb.jpg',
          duration: '2:34',
          featured: true,
          language: 'en'
        },
        {
          id: 'content-5',
          title: 'About Our Hotel',
          type: 'page',
          category: 'about',
          status: 'published',
          author: 'Admin',
          createdAt: '2024-11-28T14:15:00Z',
          updatedAt: '2024-12-08T10:20:00Z',
          views: 567,
          content: '<h1>About Us</h1><p>Established in 2020, our hotel offers...</p>',
          seo: {
            title: 'About Our Hotel - Luxury Accommodation',
            description: 'Learn about our hotel history, services, and commitment to excellence',
            keywords: 'hotel history, luxury accommodation, hospitality'
          },
          featured: false,
          language: 'en'
        },
        {
          id: 'content-6',
          title: 'Restaurant Menu',
          type: 'menu',
          category: 'dining',
          status: 'published',
          author: 'Restaurant Manager',
          createdAt: '2024-12-03T12:30:00Z',
          updatedAt: '2024-12-13T15:45:00Z',
          views: 1089,
          menuItems: [
            { category: 'Appetizers', items: ['Caesar Salad', 'Soup of the Day', 'Bruschetta'] },
            { category: 'Main Courses', items: ['Grilled Salmon', 'Beef Tenderloin', 'Vegetarian Pasta'] },
            { category: 'Desserts', items: ['Chocolate Cake', 'Tiramisu', 'Fresh Fruit'] }
          ],
          featured: true,
          language: 'en'
        }
      ];

      setContent(contentData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'page': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'gallery': return <Image className="w-5 h-5 text-green-600" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'document': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'menu': return <Folder className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'draft': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'archived': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(content.map(item => item.category))];
  const types = [...new Set(content.map(item => item.type))];

  const handleEdit = (item) => {
    setSelectedContent(item);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setContent(prev => prev.filter(item => item.id !== id));
      window.showToast && window.showToast('Content deleted successfully', 'success');
    }
  };

  const handleSave = async (updatedContent) => {
    try {
      setContent(prev => prev.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      ));
      setShowEditor(false);
      setSelectedContent(null);
      window.showToast && window.showToast('Content saved successfully', 'success');
    } catch (error) {
      console.error('Error saving content:', error);
      window.showToast && window.showToast('Failed to save content', 'error');
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Content Management System</h2>
              <p className="text-blue-100">Manage all your website content and media</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUpload(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button 
              onClick={() => setShowEditor(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Content</span>
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
                placeholder="Search content..."
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
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                  </div>
                </div>
                
                {item.featured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span>{item.status}</span>
                </span>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{item.views}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.updatedAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or create new content.</p>
          <button 
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Content
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
