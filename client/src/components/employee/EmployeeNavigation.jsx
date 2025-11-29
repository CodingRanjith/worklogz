import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiFileText, 
  FiTrendingUp, 
  FiTarget, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiUser,
  FiFolder
} from 'react-icons/fi';

const EmployeeNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { path: '/attendance', icon: <FiClock />, label: 'Attendance', color: 'blue' },
    { path: '/timesheet', icon: <FiFileText />, label: 'Timesheet', color: 'indigo' },
    { path: '/apply-leave', icon: <FiCalendar />, label: 'Apply Leave', color: 'purple' },
    { path: '/performance', icon: <FiTrendingUp />, label: 'Performance', color: 'green' },
    { path: '/goals-achievements', icon: <FiTarget />, label: 'Goals & Achievements', color: 'yellow' },
    { path: '/calendar', icon: <FiCalendar />, label: 'My Calendar', color: 'pink' },
    { path: '/documents', icon: <FiFolder />, label: 'Document Center', color: 'orange' },
  ];

  const isActive = (path) => location.pathname === path;

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-blue-50',
      indigo: active ? 'bg-indigo-100 text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-indigo-50',
      purple: active ? 'bg-purple-100 text-purple-600 border-l-4 border-purple-600' : 'text-gray-600 hover:bg-purple-50',
      green: active ? 'bg-green-100 text-green-600 border-l-4 border-green-600' : 'text-gray-600 hover:bg-green-50',
      yellow: active ? 'bg-yellow-100 text-yellow-600 border-l-4 border-yellow-600' : 'text-gray-600 hover:bg-yellow-50',
      pink: active ? 'bg-pink-100 text-pink-600 border-l-4 border-pink-600' : 'text-gray-600 hover:bg-pink-50',
      orange: active ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-600' : 'text-gray-600 hover:bg-orange-50',
    };
    return colors[color];
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white p-3 rounded-lg shadow-lg text-gray-700 hover:bg-gray-100"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-xl w-72`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <FiUser className="text-2xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Employee Portal</h2>
                <p className="text-sm opacity-90">Welcome back!</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${getColorClasses(
                  item.color,
                  isActive(item.path)
                )}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
            >
              <FiLogOut className="text-2xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default EmployeeNavigation;

