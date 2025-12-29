import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiGlobe, FiUsers, FiCalendar, FiBriefcase } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../utils/api';
import { useTheme } from '../../../hooks/useTheme';

const EmployeeTopNavbar = ({ setSidebarOpen, sidebarCollapsed }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [companyDetails, setCompanyDetails] = useState({
    companyLogo: '',
    companyName: 'WORKLOGZ',
    companySize: '',
    companyWebsite: '',
    companyFoundedYear: '',
    companyIndustry: ''
  });

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUnreadCount, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCompanySettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setCompanyDetails({
          companyLogo: response.data.companyLogo || '',
          companyName: response.data.companyName || 'WORKLOGZ',
          companySize: response.data.companySize || '',
          companyWebsite: response.data.companyWebsite || '',
          companyFoundedYear: response.data.companyFoundedYear || '',
          companyIndustry: response.data.companyIndustry || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchCompanyDetails();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const formatCompanySize = (size) => {
    if (!size) return '';
    const sizeMap = {
      '1-10': '1-10 employees',
      '11-50': '11-50 employees',
      '51-200': '51-200 employees',
      '201-500': '201-500 employees',
      '501-1000': '501-1000 employees',
      '1000+': '1000+ employees'
    };
    return sizeMap[size] || size;
  };

  return (
    <header 
      className={`h-16 border-b flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-30 shadow-sm transition-all duration-300 ${
        sidebarCollapsed ? 'md:left-16' : 'md:left-64'
      } left-0`}
      style={{
        backgroundColor: theme.primary || '#ffffff',
        borderColor: theme.secondary || '#e5e7eb',
        color: '#ffffff'
      }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="md:hidden text-white hover:text-opacity-80 transition p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
        >
          <FiMenu size={20} />
        </button>
        
        {/* Company Logo and Name */}
        <div className="flex items-center gap-3 min-w-0">
          {companyDetails.companyLogo && (
            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-white bg-opacity-20 border border-white border-opacity-30 flex-shrink-0">
              <img 
                src={companyDetails.companyLogo} 
                alt={companyDetails.companyName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="hidden md:block min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">
              {companyDetails.companyName}
            </h1>
          </div>
        </div>

        {/* Company Details - Desktop */}
        <div className="hidden lg:flex items-center gap-4 ml-4 text-sm text-white text-opacity-90">
          {companyDetails.companySize && (
            <div className="flex items-center gap-1.5">
              <FiUsers className="text-white text-opacity-70" size={16} />
              <span className="whitespace-nowrap">{formatCompanySize(companyDetails.companySize)}</span>
            </div>
          )}
          {companyDetails.companyFoundedYear && (
            <div className="flex items-center gap-1.5">
              <FiCalendar className="text-white text-opacity-70" size={16} />
              <span className="whitespace-nowrap">Est. {companyDetails.companyFoundedYear}</span>
            </div>
          )}
          {companyDetails.companyIndustry && (
            <div className="flex items-center gap-1.5">
              <FiBriefcase className="text-white text-opacity-70" size={16} />
              <span className="whitespace-nowrap truncate max-w-[120px]">{companyDetails.companyIndustry}</span>
            </div>
          )}
          {companyDetails.companyWebsite && (
            <a 
              href={companyDetails.companyWebsite.startsWith('http') ? companyDetails.companyWebsite : `https://${companyDetails.companyWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-opacity-100 transition-colors"
            >
              <FiGlobe className="text-white text-opacity-70" size={16} />
              <span className="whitespace-nowrap truncate max-w-[150px]">{companyDetails.companyWebsite}</span>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <button 
          onClick={handleNotificationClick}
          className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 relative transition-colors"
          title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <FiBell className="text-white" size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default EmployeeTopNavbar;

