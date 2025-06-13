import { useState, useEffect, useCallback } from 'react';

const useCustomization = () => {
  const [customization, setCustomization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all customization settings
  const fetchCustomization = useCallback(async () => {
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(data.data);
        applyThemeToDocument(data.data.theme);
        applyUISettings(data.data.ui);
      }
    } catch (error) {
      console.error('Fetch customization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply theme to document
  const applyThemeToDocument = useCallback((theme) => {
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--sidebar-color', theme.sidebarColor);
    root.style.setProperty('--header-color', theme.headerColor);
  }, []);

  // Apply UI settings to document
  const applyUISettings = useCallback((ui) => {
    if (!ui) return;

    const root = document.documentElement;

    // Font family
    root.style.setProperty('--font-family', ui.fontFamily || 'Inter');

    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizes[ui.fontSize] || '16px');

    // Border radius
    const borderRadii = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '16px'
    };
    root.style.setProperty('--border-radius', borderRadii[ui.borderRadius] || '8px');

    // Animation duration
    const durations = {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    };
    root.style.setProperty('--animation-duration', durations[ui.animations?.duration] || '300ms');

    // Density
    const densities = {
      compact: '0.8',
      comfortable: '1',
      spacious: '1.2'
    };
    root.style.setProperty('--density-scale', densities[ui.density] || '1');

    // Dark mode
    if (ui.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Animations
    if (!ui.animations?.enabled) {
      root.style.setProperty('--animation-duration', '0ms');
    }
  }, []);

  // Update theme
  const updateTheme = useCallback(async (themeData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/theme`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(themeData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(prev => ({
          ...prev,
          theme: data.data
        }));
        applyThemeToDocument(data.data);
        window.showToast?.('تم حفظ الثيم بنجاح', 'success');
        return { success: true, data: data.data };
      } else {
        window.showToast?.('فشل في حفظ الثيم', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update theme error:', error);
      window.showToast?.('حدث خطأ في حفظ الثيم', 'error');
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, [applyThemeToDocument]);

  // Update branding
  const updateBranding = useCallback(async (brandingData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/branding`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brandingData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(prev => ({
          ...prev,
          branding: data.data
        }));
        window.showToast?.('تم حفظ إعدادات العلامة التجارية بنجاح', 'success');
        return { success: true, data: data.data };
      } else {
        window.showToast?.('فشل في حفظ إعدادات العلامة التجارية', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update branding error:', error);
      window.showToast?.('حدث خطأ في حفظ إعدادات العلامة التجارية', 'error');
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, []);

  // Update layout
  const updateLayout = useCallback(async (layoutData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/layout`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(layoutData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(prev => ({
          ...prev,
          dashboard: data.data
        }));
        window.showToast?.('تم حفظ إعدادات التخطيط بنجاح', 'success');
        return { success: true, data: data.data };
      } else {
        window.showToast?.('فشل في حفظ إعدادات التخطيط', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update layout error:', error);
      window.showToast?.('حدث خطأ في حفظ إعدادات التخطيط', 'error');
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, []);

  // Update UI settings
  const updateUI = useCallback(async (uiData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/ui`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uiData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(prev => ({
          ...prev,
          ui: data.data
        }));
        applyUISettings(data.data);
        window.showToast?.('تم حفظ إعدادات الواجهة بنجاح', 'success');
        return { success: true, data: data.data };
      } else {
        window.showToast?.('فشل في حفظ إعدادات الواجهة', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update UI error:', error);
      window.showToast?.('حدث خطأ في حفظ إعدادات الواجهة', 'error');
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, [applyUISettings]);

  // Reset all settings
  const resetSettings = useCallback(async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customization/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCustomization(data.data);
        applyThemeToDocument(data.data.theme);
        applyUISettings(data.data.ui);
        window.showToast?.('تم إعادة تعيين جميع الإعدادات بنجاح', 'success');
        return { success: true, data: data.data };
      } else {
        window.showToast?.('فشل في إعادة تعيين الإعدادات', 'error');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Reset settings error:', error);
      window.showToast?.('حدث خطأ في إعادة تعيين الإعدادات', 'error');
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, [applyThemeToDocument, applyUISettings]);

  // Preview changes without saving
  const previewChanges = useCallback((type, data) => {
    if (type === 'theme') {
      applyThemeToDocument(data);
    } else if (type === 'ui') {
      applyUISettings(data);
    }
    // No toast for preview - only for actual saving
  }, [applyThemeToDocument, applyUISettings]);

  // Export settings
  const exportSettings = useCallback(() => {
    if (!customization) return;

    const settings = {
      ...customization,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `sysora-customization-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    window.showToast?.('تم تصدير الإعدادات بنجاح', 'success');
  }, [customization]);

  useEffect(() => {
    fetchCustomization();
  }, [fetchCustomization]);

  return {
    customization,
    loading,
    saving,
    updateTheme,
    updateBranding,
    updateLayout,
    updateUI,
    resetSettings,
    previewChanges,
    exportSettings,
    refetch: fetchCustomization
  };
};

export default useCustomization;
