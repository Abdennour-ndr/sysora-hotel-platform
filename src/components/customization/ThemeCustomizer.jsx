import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Save,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Brush,
  Image,
  Sliders,
  Grid,
  Square,
  Circle,
  Triangle,
  Sun,
  Moon,
  Contrast,
  Zap,
  Star,
  Heart,
  Check,
  X
} from 'lucide-react';

const ThemeCustomizer = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [theme, setTheme] = useState({
    colors: {
      primary: '#002D5B',
      secondary: '#2EC4B6',
      accent: '#F9FAFB',
      text: '#1F2937',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Poppins',
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    layout: {
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
    components: {
      buttons: {
        style: 'rounded',
        size: 'medium',
        variant: 'solid'
      },
      cards: {
        style: 'elevated',
        borderRadius: 'lg'
      },
      inputs: {
        style: 'outlined',
        borderRadius: 'md'
      }
    }
  });

  const [savedThemes, setSavedThemes] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSavedThemes();
    applyTheme(theme);
  }, []);

  const loadSavedThemes = () => {
    const themes = [
      {
        id: 'default',
        name: 'Sysora Default',
        description: 'The original Sysora brand theme',
        thumbnail: '/images/theme-default.jpg',
        colors: theme.colors
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        description: 'Professional dark theme',
        thumbnail: '/images/theme-dark.jpg',
        colors: {
          ...theme.colors,
          primary: '#3B82F6',
          background: '#1F2937',
          surface: '#374151',
          text: '#F9FAFB',
          border: '#4B5563'
        }
      },
      {
        id: 'luxury',
        name: 'Luxury Gold',
        description: 'Elegant gold and black theme',
        thumbnail: '/images/theme-luxury.jpg',
        colors: {
          ...theme.colors,
          primary: '#D97706',
          secondary: '#92400E',
          background: '#0F172A',
          surface: '#1E293B',
          text: '#F8FAFC'
        }
      },
      {
        id: 'nature',
        name: 'Nature Green',
        description: 'Fresh and natural theme',
        thumbnail: '/images/theme-nature.jpg',
        colors: {
          ...theme.colors,
          primary: '#059669',
          secondary: '#10B981',
          accent: '#ECFDF5'
        }
      }
    ];

    setSavedThemes(themes);
  };

  const applyTheme = (newTheme) => {
    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Colors
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Typography
    root.style.setProperty('--font-family', newTheme.typography.fontFamily);
    root.style.setProperty('--font-heading', newTheme.typography.headingFont);

    // Layout
    Object.entries(newTheme.layout.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(newTheme.layout.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
  };

  const updateTheme = (section, key, value) => {
    const newTheme = {
      ...theme,
      [section]: {
        ...theme[section],
        [key]: value
      }
    };

    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const updateNestedTheme = (section, subsection, key, value) => {
    const newTheme = {
      ...theme,
      [section]: {
        ...theme[section],
        [subsection]: {
          ...theme[section][subsection],
          [key]: value
        }
      }
    };

    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadTheme = (savedTheme) => {
    const newTheme = {
      ...theme,
      colors: savedTheme.colors
    };

    setTheme(newTheme);
    applyTheme(newTheme);
    window.showToast && window.showToast(`${savedTheme.name} theme applied`, 'success');
  };

  const saveTheme = () => {
    const themeName = prompt('Enter theme name:');
    if (themeName) {
      const newSavedTheme = {
        id: `custom-${Date.now()}`,
        name: themeName,
        description: 'Custom theme',
        thumbnail: '/images/theme-custom.jpg',
        colors: theme.colors
      };

      setSavedThemes(prev => [...prev, newSavedTheme]);
      window.showToast && window.showToast('Theme saved successfully', 'success');
    }
  };

  const resetTheme = () => {
    if (window.confirm('Reset to default theme?')) {
      const defaultTheme = savedThemes.find(t => t.id === 'default');
      if (defaultTheme) {
        loadTheme(defaultTheme);
      }
    }
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sysora-theme.json';
    link.click();
  };

  const importTheme = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target.result);
          setTheme(importedTheme);
          applyTheme(importedTheme);
          window.showToast && window.showToast('Theme imported successfully', 'success');
        } catch (error) {
          window.showToast && window.showToast('Invalid theme file', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'components', name: 'Components', icon: Grid },
    { id: 'themes', name: 'Saved Themes', icon: Star }
  ];

  const previewModes = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'mobile', name: 'Mobile', icon: Smartphone }
  ];

  const colorPalettes = [
    { name: 'Blue Ocean', colors: ['#002D5B', '#2EC4B6', '#F9FAFB'] },
    { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFE66D'] },
    { name: 'Forest', colors: ['#2D5016', '#61A5C2', '#A9D6E5'] },
    { name: 'Purple Dream', colors: ['#6A4C93', '#C06C84', '#F8B500'] },
    { name: 'Monochrome', colors: ['#2D3748', '#4A5568', '#E2E8F0'] }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Palette className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Theme Customizer</h2>
              <p className="text-purple-100">Customize your hotel's brand appearance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
            
            <button
              onClick={saveTheme}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={resetTheme}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customization Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                    
                    {Object.entries(theme.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-300"
                            style={{ backgroundColor: value }}
                          ></div>
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => updateTheme('colors', key, e.target.value)}
                            className="w-8 h-8 border-none rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Quick Palettes</h4>
                    <div className="space-y-2">
                      {colorPalettes.map(palette => (
                        <button
                          key={palette.name}
                          onClick={() => {
                            updateTheme('colors', 'primary', palette.colors[0]);
                            updateTheme('colors', 'secondary', palette.colors[1]);
                            updateTheme('colors', 'accent', palette.colors[2]);
                          }}
                          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-medium">{palette.name}</span>
                          <div className="flex space-x-1">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Body Font
                        </label>
                        <select
                          value={theme.typography.fontFamily}
                          onChange={(e) => updateNestedTheme('typography', 'fontFamily', '', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading Font
                        </label>
                        <select
                          value={theme.typography.headingFont}
                          onChange={(e) => updateNestedTheme('typography', 'headingFont', '', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Poppins">Poppins</option>
                          <option value="Playfair Display">Playfair Display</option>
                          <option value="Merriweather">Merriweather</option>
                          <option value="Source Serif Pro">Source Serif Pro</option>
                          <option value="Crimson Text">Crimson Text</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Font Preview</h4>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <h1 style={{ fontFamily: theme.typography.headingFont }} className="text-2xl font-bold">
                        Heading Example
                      </h1>
                      <p style={{ fontFamily: theme.typography.fontFamily }} className="text-base">
                        This is how your body text will look with the selected font family.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Border Radius</h3>
                    
                    {Object.entries(theme.layout.borderRadius).map(([key, value]) => (
                      <div key={key} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key} ({value})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={parseInt(value)}
                          onChange={(e) => updateNestedTheme('layout', 'borderRadius', key, `${e.target.value}px`)}
                          className="w-full"
                        />
                        <div className="mt-2">
                          <div
                            className="w-16 h-8 bg-blue-500"
                            style={{ borderRadius: value }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Styles</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Style
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['rounded', 'square', 'pill'].map(style => (
                            <button
                              key={style}
                              onClick={() => updateNestedTheme('components', 'buttons', 'style', style)}
                              className={`px-3 py-2 text-sm border rounded transition-colors capitalize ${
                                theme.components.buttons.style === style
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['flat', 'elevated'].map(style => (
                            <button
                              key={style}
                              onClick={() => updateNestedTheme('components', 'cards', 'style', style)}
                              className={`px-3 py-2 text-sm border rounded transition-colors capitalize ${
                                theme.components.cards.style === style
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'themes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Saved Themes</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={exportTheme}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Export Theme"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <label className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Import Theme">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept=".json"
                          onChange={importTheme}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {savedThemes.map(savedTheme => (
                      <div
                        key={savedTheme.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{savedTheme.name}</h4>
                          <button
                            onClick={() => loadTheme(savedTheme)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{savedTheme.description}</p>
                        <div className="flex space-x-2">
                          {Object.values(savedTheme.colors).slice(0, 5).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              
              <div className="flex items-center space-x-2">
                {previewModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      previewMode === mode.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={mode.name}
                  >
                    <mode.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              <div className={`mx-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-sm' :
                previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-full'
              }`}>
                {/* Sample UI Components */}
                <div className="space-y-6">
                  {/* Header */}
                  <div 
                    className="p-6 rounded-2xl text-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      borderRadius: theme.layout.borderRadius['2xl']
                    }}
                  >
                    <h1 
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: theme.typography.headingFont }}
                    >
                      Sysora Hotel Management
                    </h1>
                    <p style={{ fontFamily: theme.typography.fontFamily }}>
                      Experience the future of hotel management
                    </p>
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Bookings', 'Revenue', 'Occupancy'].map((title, index) => (
                      <div
                        key={title}
                        className={`p-4 border ${
                          theme.components.cards.style === 'elevated' ? 'shadow-lg' : 'shadow-sm'
                        }`}
                        style={{ 
                          borderRadius: theme.layout.borderRadius[theme.components.cards.borderRadius],
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface
                        }}
                      >
                        <h3 
                          className="font-semibold mb-2"
                          style={{ 
                            fontFamily: theme.typography.headingFont,
                            color: theme.colors.text
                          }}
                        >
                          {title}
                        </h3>
                        <p 
                          className="text-2xl font-bold"
                          style={{ color: theme.colors.primary }}
                        >
                          {index === 0 ? '156' : index === 1 ? '$12,450' : '87%'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="px-6 py-3 text-white font-medium transition-colors"
                      style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.components.buttons.style === 'pill' ? '9999px' : 
                                     theme.components.buttons.style === 'square' ? '4px' : 
                                     theme.layout.borderRadius.md
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-6 py-3 font-medium transition-colors border"
                      style={{
                        color: theme.colors.primary,
                        borderColor: theme.colors.primary,
                        backgroundColor: 'transparent',
                        borderRadius: theme.components.buttons.style === 'pill' ? '9999px' : 
                                     theme.components.buttons.style === 'square' ? '4px' : 
                                     theme.layout.borderRadius.md
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>

                  {/* Form Elements */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Sample input field"
                      className="w-full px-4 py-3 border focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border,
                        borderRadius: theme.layout.borderRadius[theme.components.inputs.borderRadius],
                        focusRingColor: theme.colors.primary
                      }}
                    />
                    <textarea
                      placeholder="Sample textarea"
                      rows={3}
                      className="w-full px-4 py-3 border focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border,
                        borderRadius: theme.layout.borderRadius[theme.components.inputs.borderRadius]
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
