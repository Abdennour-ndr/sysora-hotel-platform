import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [ui, setUI] = useState(null);
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch theme settings from API
  const fetchThemeSettings = async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTheme(data.data.theme);
          setUI(data.data.ui);
          setLayout(data.data.dashboard);
          applyTheme(data.data.theme, data.data.ui);
        }
      }
    } catch (error) {
      console.error('Failed to fetch theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply theme to document
  const applyTheme = (themeData, uiData) => {
    if (!themeData && !uiData) return;

    const root = document.documentElement;
    
    // Apply theme colors
    if (themeData) {
      root.style.setProperty('--primary-color', themeData.primaryColor || '#002D5B');
      root.style.setProperty('--secondary-color', themeData.secondaryColor || '#2EC4B6');
      root.style.setProperty('--accent-color', themeData.accentColor || '#F9FAFB');
      root.style.setProperty('--background-color', themeData.backgroundColor || '#FFFFFF');
      root.style.setProperty('--text-color', themeData.textColor || '#1F2937');
      root.style.setProperty('--sidebar-color', themeData.sidebarColor || '#F8FAFC');
      root.style.setProperty('--header-color', themeData.headerColor || '#FFFFFF');
    }

    // Apply UI settings
    if (uiData) {
      // Font family
      if (uiData.fontFamily) {
        root.style.setProperty('--font-family', uiData.fontFamily);
        document.body.className = document.body.className.replace(/font-\w+/g, '');
        document.body.classList.add(`font-${uiData.fontFamily.toLowerCase()}`);
      }

      // Font size
      if (uiData.fontSize) {
        const fontSizes = {
          small: '14px',
          medium: '16px',
          large: '18px'
        };
        root.style.setProperty('--base-font-size', fontSizes[uiData.fontSize] || '16px');
      }

      // Border radius
      if (uiData.borderRadius) {
        const borderRadii = {
          none: '0px',
          small: '4px',
          medium: '8px',
          large: '16px'
        };
        root.style.setProperty('--border-radius', borderRadii[uiData.borderRadius] || '8px');
      }

      // Density
      if (uiData.density) {
        const densities = {
          compact: '0.8',
          comfortable: '1',
          spacious: '1.2'
        };
        root.style.setProperty('--density-scale', densities[uiData.density] || '1');
        
        // Apply density class to body
        document.body.className = document.body.className.replace(/density-\w+/g, '');
        document.body.classList.add(`density-${uiData.density}`);
      }

      // Animations
      if (uiData.animations) {
        const durations = {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        };
        
        if (uiData.animations.enabled === false) {
          root.style.setProperty('--animation-duration', '0ms');
          document.body.classList.add('no-animations');
        } else {
          const duration = durations[uiData.animations.duration] || '300ms';
          root.style.setProperty('--animation-duration', duration);
          document.body.classList.remove('no-animations');
          
          if (uiData.animations.duration === 'fast') {
            document.body.classList.add('fast-animations');
          } else if (uiData.animations.duration === 'slow') {
            document.body.classList.add('slow-animations');
          }
        }
      }

      // Dark mode
      if (uiData.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    // Apply sysora-theme class
    document.body.classList.add('sysora-theme');
  };

  // Update theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme, ui);
  };

  // Update UI settings
  const updateUI = (newUI) => {
    setUI(newUI);
    applyTheme(theme, newUI);
  };

  // Update layout settings
  const updateLayout = (newLayout) => {
    setLayout(newLayout);
    
    // Apply layout classes
    if (newLayout.sidebarPosition) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.className = sidebar.className.replace(/sidebar-(left|right)/g, '');
        sidebar.classList.add(`sidebar-${newLayout.sidebarPosition}`);
      }
    }

    if (newLayout.layout) {
      const dashboard = document.querySelector('.dashboard-content');
      if (dashboard) {
        dashboard.className = dashboard.className.replace(/dashboard-(grid|list|cards)/g, '');
        dashboard.classList.add(`dashboard-${newLayout.layout}`);
      }
    }

    // Apply widget visibility
    if (newLayout.widgets) {
      Object.entries(newLayout.widgets).forEach(([widgetName, isVisible]) => {
        const widget = document.querySelector(`[data-widget="${widgetName}"]`);
        if (widget) {
          widget.classList.toggle('widget-hidden', !isVisible);
          widget.classList.toggle('widget-visible', isVisible);
        }
      });
    }
  };

  // Get current theme values
  const getCurrentTheme = () => ({
    theme,
    ui,
    layout,
    loading
  });

  // Reset to default theme
  const resetTheme = () => {
    const defaultTheme = {
      primaryColor: '#002D5B',
      secondaryColor: '#2EC4B6',
      accentColor: '#F9FAFB',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      sidebarColor: '#F8FAFC',
      headerColor: '#FFFFFF'
    };

    const defaultUI = {
      fontFamily: 'Inter',
      fontSize: 'medium',
      borderRadius: 'medium',
      animations: {
        enabled: true,
        transitions: true,
        duration: 'normal'
      },
      density: 'comfortable',
      darkMode: false
    };

    const defaultLayout = {
      layout: 'grid',
      sidebarPosition: 'left',
      widgets: {
        showQuickStats: true,
        showRecentReservations: true,
        showQuickActions: true,
        showRevenueChart: true,
        showOccupancyChart: true
      }
    };

    setTheme(defaultTheme);
    setUI(defaultUI);
    setLayout(defaultLayout);
    applyTheme(defaultTheme, defaultUI);
    updateLayout(defaultLayout);
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const value = {
    theme,
    ui,
    layout,
    loading,
    updateTheme,
    updateUI,
    updateLayout,
    getCurrentTheme,
    resetTheme,
    applyTheme,
    refetch: fetchThemeSettings
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
