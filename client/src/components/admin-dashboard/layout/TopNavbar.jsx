import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';

const TopNavbar = ({ setSidebarOpen, sidebarCollapsed = false, companyInfo }) => {
  const initials = (companyInfo?.name || 'C').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <header className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 right-0 z-30 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'md:left-16' : 'md:left-64'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="md:hidden text-gray-600 hover:text-blue-600 transition"
        >
          <FiMenu size={20} />
        </button>
        
        <div className="relative hidden md:block">
          
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
            {companyInfo?.logo ? (
              <img
                src={companyInfo.logo}
                alt={companyInfo.name || 'Company Logo'}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <span className="text-sm font-semibold text-gray-700">{initials}</span>
            )}
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-800 truncate max-w-[200px]">
              {companyInfo?.name || 'Admin Dashboard'}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {companyInfo?.email || companyInfo?.website || 'User Management System'}
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <FiBell className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        
      </div>
    </header>
  );
};

export default TopNavbar;