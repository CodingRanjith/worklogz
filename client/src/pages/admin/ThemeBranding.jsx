import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDroplet, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

// Predefined themes with primary and secondary colors
const PREDEFINED_THEMES = [
  { id: 'default', name: 'Default', primary: '#1c1f33', secondary: '#94a3b8' },
  { id: 'blue', name: 'Ocean Blue', primary: '#2563eb', secondary: '#60a5fa' },
  { id: 'purple', name: 'Royal Purple', primary: '#7c3aed', secondary: '#a78bfa' },
  { id: 'green', name: 'Forest Green', primary: '#059669', secondary: '#34d399' },
  { id: 'red', name: 'Crimson Red', primary: '#dc2626', secondary: '#f87171' },
  { id: 'orange', name: 'Sunset Orange', primary: '#ea580c', secondary: '#fb923c' },
  { id: 'teal', name: 'Teal', primary: '#0d9488', secondary: '#5eead4' },
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5', secondary: '#818cf8' },
  { id: 'pink', name: 'Rose Pink', primary: '#db2777', secondary: '#f472b6' },
  { id: 'cyan', name: 'Cyan', primary: '#0891b2', secondary: '#67e8f9' },
  { id: 'amber', name: 'Amber', primary: '#d97706', secondary: '#fbbf24' },
  { id: 'emerald', name: 'Emerald', primary: '#047857', secondary: '#6ee7b7' },
  { id: 'violet', name: 'Violet', primary: '#6d28d9', secondary: '#a78bfa' },
  { id: 'fuchsia', name: 'Fuchsia', primary: '#a21caf', secondary: '#f0abfc' },
  { id: 'sky', name: 'Sky Blue', primary: '#0284c7', secondary: '#7dd3fc' },
  { id: 'lime', name: 'Lime', primary: '#65a30d', secondary: '#bef264' },
  { id: 'rose', name: 'Rose', primary: '#e11d48', secondary: '#fb7185' },
  { id: 'slate', name: 'Slate', primary: '#475569', secondary: '#94a3b8' },
  { id: 'zinc', name: 'Zinc', primary: '#52525b', secondary: '#a1a1aa' },
  { id: 'stone', name: 'Stone', primary: '#57534e', secondary: '#d6d3d1' },
  { id: 'neutral', name: 'Neutral', primary: '#404040', secondary: '#a3a3a3' },
  { id: 'dark', name: 'Dark', primary: '#1f2937', secondary: '#6b7280' },
  { id: 'navy', name: 'Navy', primary: '#1e3a8a', secondary: '#60a5fa' },
  { id: 'maroon', name: 'Maroon', primary: '#991b1b', secondary: '#f87171' },
  { id: 'olive', name: 'Olive', primary: '#365314', secondary: '#84cc16' }
];

const ThemeBranding = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customPrimary, setCustomPrimary] = useState('#1c1f33');
  const [customSecondary, setCustomSecondary] = useState('#94a3b8');
  const [useCustom, setUseCustom] = useState(false);
  const [currentTheme, setCurrentTheme] = useState({
    primary: '#1c1f33',
    secondary: '#94a3b8'
  });

  useEffect(() => {
    fetchCurrentTheme();
  }, []);

  const fetchCurrentTheme = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCompanySettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        const primary = response.data.primaryColor || '#1c1f33';
        const secondary = response.data.secondaryColor || '#94a3b8';
        setCurrentTheme({ primary, secondary });
        setCustomPrimary(primary);
        setCustomSecondary(secondary);
        
        // Check if current theme matches any predefined theme
        const matchingTheme = PREDEFINED_THEMES.find(
          theme => theme.primary === primary && theme.secondary === secondary
        );
        if (matchingTheme) {
          setSelectedTheme(matchingTheme.id);
          setUseCustom(false);
        } else {
          setUseCustom(true);
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme.id);
    setUseCustom(false);
    setCustomPrimary(theme.primary);
    setCustomSecondary(theme.secondary);
    applyTheme(theme.primary, theme.secondary);
  };

  const handleCustomColorChange = (type, color) => {
    if (type === 'primary') {
      setCustomPrimary(color);
    } else {
      setCustomSecondary(color);
    }
    setUseCustom(true);
    setSelectedTheme(null);
    applyTheme(type === 'primary' ? color : customPrimary, type === 'secondary' ? color : customSecondary);
  };

  const applyTheme = (primary, secondary) => {
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--theme-primary', primary);
    document.documentElement.style.setProperty('--theme-secondary', secondary);
    
    // Store in localStorage for immediate preview
    localStorage.setItem('theme-primary', primary);
    localStorage.setItem('theme-secondary', secondary);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const primaryColor = useCustom ? customPrimary : (PREDEFINED_THEMES.find(t => t.id === selectedTheme)?.primary || customPrimary);
      const secondaryColor = useCustom ? customSecondary : (PREDEFINED_THEMES.find(t => t.id === selectedTheme)?.secondary || customSecondary);

      const formData = new FormData();
      formData.append('primaryColor', primaryColor);
      formData.append('secondaryColor', secondaryColor);

      await axios.put(API_ENDPOINTS.updateCompanySettings, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setCurrentTheme({ primary: primaryColor, secondary: secondaryColor });
      
      // Update localStorage for immediate effect
      localStorage.setItem('theme-primary', primaryColor);
      localStorage.setItem('theme-secondary', secondaryColor);
      
      // Apply theme immediately
      applyTheme(primaryColor, secondaryColor);
      
      // Reload page to apply theme to all components
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Theme saved successfully! Refreshing page to apply changes...',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to save theme'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultTheme = PREDEFINED_THEMES[0];
    setSelectedTheme(defaultTheme.id);
    setUseCustom(false);
    setCustomPrimary(defaultTheme.primary);
    setCustomSecondary(defaultTheme.secondary);
    applyTheme(defaultTheme.primary, defaultTheme.secondary);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme & Branding</h1>
          <p className="text-gray-600">Customize the appearance of your dashboard with predefined themes or create your own color scheme</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Predefined Themes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Predefined Themes</h2>
                  <p className="text-sm text-gray-500">Choose from 25 professional color themes</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  <FiRefreshCw size={16} />
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {PREDEFINED_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedTheme === theme.id && !useCustom
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <div
                          className="flex-1 h-12 rounded"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="flex-1 h-12 rounded"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {theme.name}
                      </span>
                    </div>
                    {selectedTheme === theme.id && !useCustom && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                        <FiCheck size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <FiDroplet className="text-gray-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Custom Colors</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Create your own color scheme by selecting custom primary and secondary colors</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={customPrimary}
                        onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#1c1f33"
                      />
                    </div>
                  </div>
                  <div className="mt-2 h-16 rounded-lg" style={{ backgroundColor: customPrimary }} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={customSecondary}
                        onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        placeholder="#94a3b8"
                      />
                    </div>
                  </div>
                  <div className="mt-2 h-16 rounded-lg" style={{ backgroundColor: customSecondary }} />
                </div>
              </div>

              {useCustom && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Custom theme active:</strong> Your custom colors are being previewed. Click "Save Changes" to apply.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              
              {/* Preview Card */}
              <div className="mb-6">
                <div 
                  className="p-4 rounded-lg mb-3"
                  style={{ backgroundColor: useCustom ? customPrimary : (PREDEFINED_THEMES.find(t => t.id === selectedTheme)?.primary || customPrimary) }}
                >
                  <div className="text-white">
                    <div className="font-semibold mb-1">Sidebar Header</div>
                    <div className="text-sm opacity-90">Primary Color Preview</div>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: useCustom ? customSecondary : (PREDEFINED_THEMES.find(t => t.id === selectedTheme)?.secondary || customSecondary) }}
                >
                  <div className="text-white">
                    <div className="font-semibold mb-1">Secondary Elements</div>
                    <div className="text-sm opacity-90">Secondary Color Preview</div>
                  </div>
                </div>
              </div>

              {/* Current Theme Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Theme</p>
                <div className="flex gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: currentTheme.secondary }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Primary: {currentTheme.primary}
                </p>
                <p className="text-xs text-gray-500">
                  Secondary: {currentTheme.secondary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  <FiRefreshCw size={18} />
                  Reset to Default
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Theme changes will be applied to the employee dashboard only (sidebar, top navbar, and other employee dashboard elements). Admin dashboard will not be affected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeBranding;

