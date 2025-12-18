import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/api';

export const useTheme = () => {
  const [theme, setTheme] = useState({
    primary: '#1c1f33',
    secondary: '#94a3b8'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      // First check localStorage for quick load
      const storedPrimary = localStorage.getItem('theme-primary');
      const storedSecondary = localStorage.getItem('theme-secondary');
      
      if (storedPrimary && storedSecondary) {
        applyThemeToDocument(storedPrimary, storedSecondary);
        setTheme({ primary: storedPrimary, secondary: storedSecondary });
        setLoading(false);
      }

      // Then fetch from API
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(API_ENDPOINTS.getCompanySettings, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          const primary = response.data.primaryColor || '#1c1f33';
          const secondary = response.data.secondaryColor || '#94a3b8';
          
          applyThemeToDocument(primary, secondary);
          setTheme({ primary, secondary });
          
          // Update localStorage
          localStorage.setItem('theme-primary', primary);
          localStorage.setItem('theme-secondary', secondary);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Use default theme on error
      applyThemeToDocument('#1c1f33', '#94a3b8');
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToDocument = (primary, secondary) => {
    document.documentElement.style.setProperty('--theme-primary', primary);
    document.documentElement.style.setProperty('--theme-secondary', secondary);
  };

  return { theme, loading, loadTheme };
};

