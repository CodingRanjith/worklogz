import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HelpdeskCenter from '../../components/helpdesk/HelpdeskCenter';

const HelpdeskPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin and redirect to admin helpdesk route
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin' || decoded.role === 'master-admin') {
          // Admin should use admin layout, so navigate to admin helpdesk
          // But since routes are nested, we'll just let it render here
          // The HelpdeskCenter component will handle role-based UI
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <HelpdeskCenter variant="full" />
    </div>
  );
};

export default HelpdeskPage;

