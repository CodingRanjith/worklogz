import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeTopNavbar from './EmployeeTopNavbar';
import WorklogzChatbot from '../WorklogzChatbot';
import { API_ENDPOINTS } from '../../../utils/api';
import { useTheme } from '../../../hooks/useTheme';

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();
  const { loadTheme } = useTheme();

  useEffect(() => {
    loadTheme();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getCurrentUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to load current user', err);
        navigate('/login');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [navigate, loadTheme]);

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onCollapseChange={handleCollapseChange}
        currentUser={currentUser}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <EmployeeTopNavbar
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 pt-16 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Worklogz AI Chatbot - Hidden per user request */}
      {/* <WorklogzChatbot
        currentUser={currentUser}
        sidebarCollapsed={sidebarCollapsed}
      /> */}
    </div>
  );
};

export default EmployeeLayout;

