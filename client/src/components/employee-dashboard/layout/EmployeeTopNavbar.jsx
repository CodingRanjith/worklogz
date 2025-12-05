import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../utils/api';

const EmployeeTopNavbar = ({ setSidebarOpen, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUnreadNotificationCount, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <header className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-30 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'md:left-16' : 'md:left-64'
    } left-0`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="md:hidden text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-100"
        >
          <FiMenu size={20} />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-800">WORKLOGZ</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleNotificationClick}
          className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
          title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <FiBell className="text-gray-600" size={20} />
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

