import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

const SidebarNotifications = ({ isCollapsed }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate('/notifications');
  };

  if (isCollapsed) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center justify-center px-2 py-2 rounded-md text-sm font-medium transition relative group text-gray-800 hover:bg-gray-100 w-full"
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
      >
        <span className="text-lg relative">
          <FiBell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center rounded-md text-sm font-medium transition relative group w-full text-gray-800 hover:bg-gray-100 px-4 py-2 gap-3"
    >
      <span className="text-lg relative">
        <FiBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </span>
      <span>Notifications</span>
      {unreadCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default SidebarNotifications;

