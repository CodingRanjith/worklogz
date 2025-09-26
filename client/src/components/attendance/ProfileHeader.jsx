import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import urbancodeLogo from '../../assets/uclogo.png';
import jobzenterLogo from '../../assets/jzlogo.png';
import { FiBell, FiClock } from 'react-icons/fi';

function ProfileHeader() {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.getUsers, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const users = await res.json();
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded.userId;

        const currentUser = users.find(u => u._id === userId);
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err.message);
      }
    };

    if (token) fetchUser();
  }, [token]);

  // Live time update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const getCompanyLogo = (company) => {
    switch (company) {
      case 'Urbancode':
        return urbancodeLogo;
      case 'Jobzenter':
        return jobzenterLogo;
      default:
        return '/default-logo.png';
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format date
  const formatDate = (date) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-5 mb-6">
      {/* Main content row */}
      <div className="flex items-center justify-between gap-6">
        {/* Left side - User Profile */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-purple-200 shadow-sm bg-white p-1">
            <img
              src={getCompanyLogo(user.company)}
              alt={user.company}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-[#181818]" style={{ fontFamily: 'Sora, sans-serif' }}>
                {user.name}
              </h2>
              <span className="text-lg">👋</span>
            </div>
            <p className="text-sm font-medium text-[#8b72cc]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {getGreeting()}, {user.name.split(' ')[0]}!
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {user.position || 'Employee'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {user.company}
            </p>
          </div>
        </div>

        {/* Center - Live Date and Time */}
        <div className="flex-1 flex justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiClock className="text-[#8b72cc] text-lg" />
              <p className="text-lg font-bold text-[#181818]" style={{ fontFamily: 'Sora, sans-serif' }}>
                {formatDate(currentTime)}
              </p>
            </div>
            <p className="text-2xl font-bold text-[#8b72cc] tracking-wider" style={{ fontFamily: 'Sora, sans-serif' }}>
              {formatTime(currentTime)}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {currentTime.toLocaleString('default', { month: 'long' })} {currentTime.getFullYear()}
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Live Time
            </p>
          </div>
        </div>

        {/* Right side - Notification */}
        <div className="flex items-center">
          <div className="relative">
            <FiBell
              className="text-gray-400 hover:text-[#8b72cc] transition-colors duration-200 cursor-pointer text-xl"
              title="Notifications"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
