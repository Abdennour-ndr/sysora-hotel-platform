import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  Settings,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Video,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Palette,
  Globe,
  Tag,
  Calendar,
  User,
  Star,
  Upload,
  Download
} from 'lucide-react';

const ContentEditor = ({ content, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'page',
    category: '',
    status: 'draft',
    content: '',
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    featured: false,
    language: 'en',
    author: 'Admin',
    tags: []
  });

  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        ...content,
        seo: content.seo || { title: '', description: '', keywords: '' },
        tags: content.tags || []
      });
    } else {
      // Reset form for new content
      setFormData({
        title: '',
        type: 'page',
        category: '',
        status: 'draft',
        content: '',
        seo: {
          title: '',
          description: '',
          keywords: ''
        },
        featured: false,
        language: 'en',
        author: 'Admin',
        tags: []
      });
    }
  }, [content]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedContent = {
        ...formData,
        id: content?.id || `content-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        createdAt: content?.createdAt || new Date().toISOString(),
        views: content?.views || 0
      };

      await onSave(updatedContent);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const insertFormatting = (tag) => {
    const textarea = document.getElementById('content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let replacement = '';
    switch (tag) {
      case 'bold':
        replacement = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        replacement = `<u>${selectedText}</u>`;
        break;
      case 'h1':
        replacement = `<h1>${selectedText}</h1>`;
        break;
      case 'h2':
        replacement = `<h2>${selectedText}</h2>`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText}</h3>`;
        break;
      case 'link':
        replacement = `<a href="https://example.com">${selectedText}</a>`;
        break;
      case 'quote':
        replacement = `<blockquote>${selectedText}</blockquote>`;
        break;
      case 'code':
        replacement = `<code>${selectedText}</code>`;
        break;
      default:
        replacement = selectedText;
    }

    const newContent = formData.content.substring(0, start) + replacement + formData.content.substring(end);
    handleInputChange('content', newContent);
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      handleInputChange('tags', [...formData.tags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const contentTypes = [
    { value: 'page', label: 'Page' },
    { value: 'post', label: 'Blog Post' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'menu', label: 'Menu' }
  ];

  const categories = [
    { value: 'landing', label: 'Landing' },
    { value: 'about', label: 'About' },
    { value: 'services', label: 'Services' },
    { value: 'media', label: 'Media' },
    { value: 'legal', label: 'Legal' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'dining', label: 'Dining' },
    { value: 'news', label: 'News' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {content ? 'Edit Content' : 'Create New Content'}
            </h2>
            <p className="text-gray-600">
              {content ? 'Update your existing content' : 'Create engaging content for your website'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['content', 'settings', 'seo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'content' && (
            <div className="h-full flex">
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <button
                      onClick={() => insertFormatting('bold')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('italic')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('underline')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <button
                      onClick={() => insertFormatting('h1')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Heading 1"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('h2')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('h3')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <button
                      onClick={() => insertFormatting('link')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('quote')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('code')}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors" title="Insert Image">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors" title="Insert Video">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <div className="p-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Enter content title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full text-2xl font-bold border-none outline-none placeholder-gray-400"
                  />
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-4">
                  {showPreview ? (
                    <div 
                      className="prose max-w-none h-full overflow-auto"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  ) : (
                    <textarea
                      id="content-editor"
                      placeholder="Start writing your content..."
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="w-full h-full border-none outline-none resize-none text-gray-800 leading-relaxed"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 space-y-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Content</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="p-6 space-y-6 overflow-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  placeholder="Enter SEO title..."
                  value={formData.seo.title}
                  onChange={(e) => handleInputChange('seo.title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seo.title.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  placeholder="Enter meta description..."
                  value={formData.seo.description}
                  onChange={(e) => handleInputChange('seo.description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seo.description.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  placeholder="Enter keywords separated by commas..."
                  value={formData.seo.keywords}
                  onChange={(e) => handleInputChange('seo.keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">SEO Preview</h4>
                <div className="space-y-1">
                  <div className="text-blue-600 text-lg font-medium line-clamp-1">
                    {formData.seo.title || formData.title || 'Your page title'}
                  </div>
                  <div className="text-green-600 text-sm">
                    https://yoursite.com/{formData.title?.toLowerCase().replace(/\s+/g, '-') || 'page-url'}
                  </div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {formData.seo.description || 'Your meta description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
