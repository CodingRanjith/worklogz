import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../utils/api';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Company',
    logo: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_ENDPOINTS.getCompanySettings, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = res.data || {};
        const logoUrl = data.companyLogo || '';
        
        // Validate logo URL
        if (logoUrl) {
          console.log('Loading company logo from:', logoUrl);
          // Ensure URL is complete (starts with http/https)
          if (!logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
            console.warn('⚠️  Logo URL is not a complete HTTP URL:', logoUrl);
          }
        }
        
        setCompanyInfo({
          name: data.companyName || 'Company',
          logo: logoUrl,
          email: data.companyEmail || '',
          website: data.companyWebsite || ''
        });
      } catch (err) {
        console.warn('Failed to load company settings for layout', err);
      }
    };
    
    fetchCompanySettings();
    
    // Listen for company settings updates
    const handleCompanySettingsUpdate = (event) => {
      const updatedSettings = event.detail?.settings;
      if (updatedSettings) {
        setCompanyInfo({
          name: updatedSettings.companyName || 'Company',
          logo: updatedSettings.companyLogo || '',
          email: updatedSettings.companyEmail || '',
          website: updatedSettings.companyWebsite || ''
        });
      } else {
        // If no detail, refetch from server
        fetchCompanySettings();
      }
    };
    
    window.addEventListener('companySettingsUpdated', handleCompanySettingsUpdate);
    
    return () => {
      window.removeEventListener('companySettingsUpdated', handleCompanySettingsUpdate);
    };
  }, []);

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onCollapseChange={handleCollapseChange}
        companyInfo={companyInfo}
      />
      <TopNavbar 
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        companyInfo={companyInfo}
      />
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

