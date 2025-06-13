import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import settingsAPI from '../services/settingsAPI';

// Advanced Settings Hook with real-time updates and optimizations
export const useAdvancedSettings = (section = null) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [autoSave, setAutoSave] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const autoSaveTimeoutRef = useRef(null);
  const originalSettingsRef = useRef({});

  // Initialize settings
  useEffect(() => {
    loadSettings();
    
    // Subscribe to real-time updates
    const unsubscribe = settingsAPI.subscribe(handleAPIEvent);
    
    return () => {
      unsubscribe();
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [section]);

  // Handle API events
  const handleAPIEvent = useCallback((event, data) => {
    switch (event) {
      case 'settings:loaded':
      case 'settings:saved':
      case 'settings:changed':
        if (section) {
          setSettings(data[section] || {});
        } else {
          setSettings(data);
        }
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        break;
      
      case 'section:updated':
        if (!section || data.section === section) {
          setSettings(prev => section ? data.data : { ...prev, [data.section]: data.data });
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        }
        break;
      
      case 'settings:reset':
        setSettings({});
        setHasUnsavedChanges(false);
        setLastSaved(null);
        setHistory([]);
        setHistoryIndex(-1);
        break;
      
      case 'backup:created':
        toast.success('Backup created successfully');
        break;
      
      case 'backup:restored':
        toast.success('Backup restored successfully');
        break;
    }
  }, [section]);

  // Load settings
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const response = section 
        ? await settingsAPI.getSettingsSection(section)
        : await settingsAPI.getAllSettings();
      
      if (response.success) {
        setSettings(response.data);
        originalSettingsRef.current = JSON.parse(JSON.stringify(response.data));
        setLastSaved(new Date(response.timestamp));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setErrors({ general: error.message });
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [section]);

  // Update settings with history tracking
  const updateSettings = useCallback((newSettings, skipHistory = false) => {
    if (!skipHistory) {
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(settings)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistoryIndex(newHistory.length - 1);
      }
    }

    setSettings(newSettings);
    setHasUnsavedChanges(true);
    setErrors({});

    // Auto-save logic
    if (autoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveSettings(newSettings);
      }, 3000);
    }
  }, [settings, history, historyIndex, autoSave]);

  // Save settings
  const saveSettings = useCallback(async (settingsToSave = settings) => {
    try {
      setSaving(true);
      setErrors({});

      const response = section
        ? await settingsAPI.updateSettingsSection(section, settingsToSave)
        : await settingsAPI.saveAllSettings(settingsToSave);

      if (response.success) {
        originalSettingsRef.current = JSON.parse(JSON.stringify(settingsToSave));
        setHasUnsavedChanges(false);
        setLastSaved(new Date(response.timestamp));
        toast.success('Settings saved successfully', { icon: '✅' });
        return true;
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      
      // Parse validation errors
      try {
        const validationErrors = JSON.parse(error.message.replace('Validation failed: ', ''));
        setErrors(validationErrors);
        toast.error('Please fix validation errors before saving');
      } catch {
        setErrors({ general: error.message });
        toast.error('Failed to save settings');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings, section]);

  // Reset settings
  const resetSettings = useCallback(async () => {
    try {
      setLoading(true);
      await settingsAPI.resetSettings();
      setSettings({});
      setHasUnsavedChanges(false);
      setLastSaved(null);
      setHistory([]);
      setHistoryIndex(-1);
      originalSettingsRef.current = {};
      toast.success('Settings reset successfully');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousSettings = history[historyIndex - 1];
      setSettings(previousSettings);
      setHistoryIndex(historyIndex - 1);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextSettings = history[historyIndex + 1];
      setSettings(nextSettings);
      setHistoryIndex(historyIndex + 1);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Export settings
  const exportSettings = useCallback(async () => {
    try {
      const response = await settingsAPI.exportSettings();
      if (response.success) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', response.filename);
        linkElement.click();
        
        toast.success('Settings exported successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast.error('Failed to export settings');
      return false;
    }
  }, []);

  // Import settings
  const importSettings = useCallback(async (file) => {
    try {
      setLoading(true);
      
      const text = await file.text();
      const importData = JSON.parse(text);
      
      const response = await settingsAPI.importSettings(importData);
      if (response.success) {
        toast.success('Settings imported successfully');
        await loadSettings();
        return true;
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      toast.error('Failed to import settings: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadSettings]);

  // Backup functionality
  const createBackup = useCallback(async (name) => {
    try {
      const response = await settingsAPI.createBackup(name);
      if (response.success) {
        toast.success('Backup created successfully');
        return response.backup;
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      toast.error('Failed to create backup');
      return null;
    }
  }, []);

  const getBackups = useCallback(async () => {
    try {
      const response = await settingsAPI.getBackups();
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to get backups:', error);
      return [];
    }
  }, []);

  const restoreBackup = useCallback(async (backupName) => {
    try {
      setLoading(true);
      const response = await settingsAPI.restoreBackup(backupName);
      if (response.success) {
        await loadSettings();
        toast.success('Backup restored successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
      toast.error('Failed to restore backup');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadSettings]);

  // Validation helpers
  const validateField = useCallback((fieldPath, value) => {
    try {
      const sectionName = section || fieldPath.split('.')[0];
      const testData = { ...settings };
      
      // Set the field value in test data
      const pathParts = fieldPath.split('.');
      let current = testData;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = value;
      
      const validation = settingsAPI.validateSettingsData(sectionName, testData);
      return validation.errors[fieldPath] || null;
    } catch (error) {
      return null;
    }
  }, [settings, section]);

  // Check if settings have changed from original
  const hasChanges = useCallback(() => {
    return JSON.stringify(settings) !== JSON.stringify(originalSettingsRef.current);
  }, [settings]);

  // Get field error
  const getFieldError = useCallback((fieldPath) => {
    return errors[fieldPath] || null;
  }, [errors]);

  // Clear specific error
  const clearFieldError = useCallback((fieldPath) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldPath];
      return newErrors;
    });
  }, []);

  return {
    // State
    settings,
    loading,
    saving,
    hasUnsavedChanges: hasUnsavedChanges || hasChanges(),
    lastSaved,
    errors,
    autoSave,
    
    // History
    canUndo,
    canRedo,
    undo,
    redo,
    
    // Actions
    updateSettings,
    saveSettings,
    resetSettings,
    loadSettings,
    
    // Auto-save
    setAutoSave,
    
    // Import/Export
    exportSettings,
    importSettings,
    
    // Backup/Restore
    createBackup,
    getBackups,
    restoreBackup,
    
    // Validation
    validateField,
    getFieldError,
    clearFieldError,
    
    // Utilities
    hasChanges
  };
};
