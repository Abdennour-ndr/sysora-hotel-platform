import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  File,
  Folder,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Edit,
  Eye,
  Copy,
  Share,
  Star,
  Clock,
  User,
  Tag,
  X,
  Plus,
  FolderPlus,
  Move,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const MediaLibrary = ({ isOpen, onClose, onSelect, selectionMode = false }) => {
  const [media, setMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
      loadFolders();
    }
  }, [isOpen, currentFolder]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      // Simulate loading media from API
      const mediaData = [
        {
          id: 'media-1',
          name: 'hotel-lobby.jpg',
          type: 'image',
          size: 2456789,
          url: '/images/hotel-lobby.jpg',
          thumbnail: '/images/thumbnails/hotel-lobby-thumb.jpg',
          uploadedAt: '2024-12-15T10:30:00Z',
          uploadedBy: 'Admin',
          folder: null,
          alt: 'Hotel Lobby',
          tags: ['lobby', 'interior', 'hotel'],
          dimensions: { width: 1920, height: 1080 },
          featured: true
        },
        {
          id: 'media-2',
          name: 'room-deluxe.jpg',
          type: 'image',
          size: 1876543,
          url: '/images/room-deluxe.jpg',
          thumbnail: '/images/thumbnails/room-deluxe-thumb.jpg',
          uploadedAt: '2024-12-14T16:45:00Z',
          uploadedBy: 'Content Manager',
          folder: 'rooms',
          alt: 'Deluxe Room',
          tags: ['room', 'deluxe', 'accommodation'],
          dimensions: { width: 1600, height: 900 },
          featured: false
        },
        {
          id: 'media-3',
          name: 'hotel-promo.mp4',
          type: 'video',
          size: 15678901,
          url: '/videos/hotel-promo.mp4',
          thumbnail: '/images/thumbnails/hotel-promo-thumb.jpg',
          uploadedAt: '2024-12-12T09:20:00Z',
          uploadedBy: 'Marketing Team',
          folder: 'videos',
          duration: '2:34',
          tags: ['promo', 'marketing', 'video'],
          featured: true
        },
        {
          id: 'media-4',
          name: 'restaurant-menu.pdf',
          type: 'document',
          size: 567890,
          url: '/documents/restaurant-menu.pdf',
          thumbnail: '/images/thumbnails/pdf-thumb.png',
          uploadedAt: '2024-12-10T14:15:00Z',
          uploadedBy: 'Restaurant Manager',
          folder: 'documents',
          tags: ['menu', 'restaurant', 'dining'],
          featured: false
        },
        {
          id: 'media-5',
          name: 'spa-services.jpg',
          type: 'image',
          size: 2123456,
          url: '/images/spa-services.jpg',
          thumbnail: '/images/thumbnails/spa-services-thumb.jpg',
          uploadedAt: '2024-12-08T11:30:00Z',
          uploadedBy: 'Spa Manager',
          folder: 'spa',
          alt: 'Spa Services',
          tags: ['spa', 'wellness', 'services'],
          dimensions: { width: 1800, height: 1200 },
          featured: false
        },
        {
          id: 'media-6',
          name: 'conference-room.jpg',
          type: 'image',
          size: 1987654,
          url: '/images/conference-room.jpg',
          thumbnail: '/images/thumbnails/conference-room-thumb.jpg',
          uploadedAt: '2024-12-05T13:45:00Z',
          uploadedBy: 'Events Manager',
          folder: 'events',
          alt: 'Conference Room',
          tags: ['conference', 'events', 'business'],
          dimensions: { width: 1920, height: 1080 },
          featured: false
        }
      ];

      // Filter by current folder
      const filteredMedia = currentFolder 
        ? mediaData.filter(item => item.folder === currentFolder)
        : mediaData.filter(item => !item.folder);

      setMedia(filteredMedia);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const foldersData = [
        { id: 'rooms', name: 'Rooms', itemCount: 12, createdAt: '2024-12-01T10:00:00Z' },
        { id: 'videos', name: 'Videos', itemCount: 5, createdAt: '2024-12-02T11:00:00Z' },
        { id: 'documents', name: 'Documents', itemCount: 8, createdAt: '2024-12-03T12:00:00Z' },
        { id: 'spa', name: 'Spa & Wellness', itemCount: 6, createdAt: '2024-12-04T13:00:00Z' },
        { id: 'events', name: 'Events', itemCount: 4, createdAt: '2024-12-05T14:00:00Z' }
      ];

      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-green-600" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'document': return <File className="w-5 h-5 text-blue-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        // Simulate file upload
        const newMedia = {
          id: `media-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          url: URL.createObjectURL(file),
          thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : '/images/thumbnails/file-thumb.png',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current User',
          folder: currentFolder,
          tags: [],
          featured: false
        };

        setMedia(prev => [newMedia, ...prev]);
      }

      window.showToast && window.showToast(`${files.length} file(s) uploaded successfully`, 'success');
    } catch (error) {
      console.error('Error uploading files:', error);
      window.showToast && window.showToast('Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleSelection = (item) => {
    if (selectionMode) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else if (onSelect) {
      onSelect(item);
      onClose();
    }
  };

  const createFolder = async () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
        name: newFolderName,
        itemCount: 0,
        createdAt: new Date().toISOString()
      };

      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowCreateFolder(false);
      window.showToast && window.showToast('Folder created successfully', 'success');
    }
  };

  const deleteSelected = async () => {
    if (selectedItems.length > 0 && window.confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
      setMedia(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      window.showToast && window.showToast('Items deleted successfully', 'success');
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
            <p className="text-gray-600">
              {currentFolder ? `Folder: ${folders.find(f => f.id === currentFolder)?.name}` : 'All Media'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <button
                onClick={deleteSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedItems.length})</span>
              </button>
            )}
            
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {currentFolder && (
              <button
                onClick={() => setCurrentFolder(null)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to All Media
              </button>
            )}
            
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div 
            className="h-full overflow-auto p-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Folders */}
            {!currentFolder && folders.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folders.map(folder => (
                    <div
                      key={folder.id}
                      onClick={() => setCurrentFolder(folder.id)}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Folder className="w-12 h-12 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                        {folder.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {folder.itemCount} items
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading media...</p>
                </div>
              </div>
            ) : filteredMedia.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Media Files ({filteredMedia.length})
                </h3>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleSelection(item)}
                        className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedItems.includes(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          {item.type === 'image' ? (
                            <img
                              src={item.thumbnail}
                              alt={item.alt || item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              {getFileIcon(item.type)}
                              <span className="text-xs text-gray-600 mt-1 text-center px-2">
                                {item.name}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedItems.includes(item.id) && (
                          <div className="absolute top-2 left-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 fill-current bg-white rounded-full" />
                          </div>
                        )}
                        
                        {/* Info */}
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMedia.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleSelection(item)}
                        className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedItems.includes(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {item.type === 'image' ? (
                            <img
                              src={item.thumbnail}
                              alt={item.alt || item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              {getFileIcon(item.type)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            {item.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatFileSize(item.size)}</span>
                            <span>{formatDate(item.uploadedAt)}</span>
                            <span>{item.uploadedBy}</span>
                          </div>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{item.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {selectedItems.includes(item.id) && (
                          <CheckCircle className="w-5 h-5 text-blue-600 fill-current" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Image className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No media found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first media file to get started'
                  }
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Media
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Uploading files...</p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
