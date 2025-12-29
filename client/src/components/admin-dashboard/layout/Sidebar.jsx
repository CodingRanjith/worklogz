import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiSettings, FiLogOut, FiChevronRight, FiMenu, FiChevronLeft,
  FiShield, FiUsers
} from 'react-icons/fi';

export const menuItems = [
  { label: 'Dashboard', icon: <FiHome />, path: '/admin' },
  { label: 'Administration', icon: <FiShield />, path: '/administration/access-control' },
  { label: 'Master Control', icon: <FiSettings />, path: '/master-control' },
  {
    label: 'User Management',
    icon: <FiUsers />,
    subItems: [
      { label: 'User Profiles Creation', path: '/all-users' },
      { label: 'Employees Schedules', path: '/employees' },
      { label: 'Pending Approvals', path: '/pending-users' }
    ]
  },
  {
    label: 'Company Settings',
    icon: <FiSettings />,
    subItems: [
      { label: 'Theme & Branding', path: '/theme-branding' },
      { label: 'Custom Fields', path: '/custom-fields' },
      { label: 'Workflow Rules', path: '/workflow-rules' },
      { label: 'Platform Controls', path: '#', isSection: true },
      { label: 'Global Settings', path: '/settings' },
      { label: 'Feature Toggles', path: '/feature-flags' },
      { label: 'Data Import / Export', path: '/data-import-export' },
      { label: 'Localization & Timezone', path: '/localization' },
      { label: 'System Status', path: '/system-status' }
    ]
  },
  { label: 'Settings', icon: <FiSettings />, path: '/settings' }
];

const Sidebar = ({ isOpen, setIsOpen, onCollapseChange, companyInfo }) => {
  // Initialize all items with subItems as expanded by default
  const [expandedItems, setExpandedItems] = React.useState(() => {
    const initialExpanded = {};
    menuItems.forEach(item => {
      if (item.subItems) {
        initialExpanded[item.label] = true;
      }
    });
    return initialExpanded;
  });
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleItem = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    // Notify parent component about collapse state change
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
    // Close all expanded items when collapsing, restore when expanding
    if (newCollapsed) {
      setExpandedItems({});
    } else {
      // Restore all items to expanded state when sidebar is expanded
      const allExpanded = {};
      menuItems.forEach(item => {
        if (item.subItems) {
          allExpanded[item.label] = true;
        }
      });
      setExpandedItems(allExpanded);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-gray-800 border-r z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className={`py-4 border-b border-gray-200 ${
          isCollapsed ? 'px-2' : 'px-4'
        }`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                  {companyInfo?.logo ? (
                    <img
                      src={companyInfo.logo}
                      alt={companyInfo.name || 'Logo'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load company logo:', companyInfo.logo);
                        e.target.style.display = 'none';
                        // Show fallback initials if image fails
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('span')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'text-xs font-semibold text-gray-700';
                          fallback.textContent = (companyInfo?.name || 'C').slice(0, 2).toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                      onLoad={() => {
                        console.log('Company logo loaded successfully:', companyInfo.logo);
                      }}
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-700">
                      {(companyInfo?.name || 'C').slice(0, 2).toUpperCase()}
                    </span>
                  )}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Expand Sidebar"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                  {companyInfo?.logo ? (
                    <img
                      src={companyInfo.logo}
                      alt={companyInfo.name || 'Logo'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load company logo:', companyInfo.logo);
                        e.target.style.display = 'none';
                        // Show fallback initials if image fails
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('div')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700';
                          fallback.textContent = (companyInfo?.name || 'C').slice(0, 2).toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                      onLoad={() => {
                        console.log('Company logo loaded successfully:', companyInfo.logo);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      {(companyInfo?.name || 'C').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-gray-900 truncate">
                    {companyInfo?.name || 'Admin Portal'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {companyInfo?.email || companyInfo?.website || 'User Management System'}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                title="Collapse Sidebar"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="mt-4 px-2 flex flex-col gap-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item, index) => {
            if (item.subItems) {
              return (
                <div key={index} className="mb-1 relative group">
                  <button
                    onClick={() => !isCollapsed && toggleItem(item.label)}
                    className={`flex items-center justify-between w-full rounded-md hover:bg-gray-100 text-sm font-medium transition ${
                      isCollapsed ? 'px-2 py-2 justify-center' : 'px-4 py-2'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <span className="text-lg">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <FiChevronRight
                        className={`transition-transform duration-200 ${
                          expandedItems[item.label] ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </button>

                  {!isCollapsed && expandedItems[item.label] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => {
                        if (subItem.isSection) {
                          return (
                            <div
                              key={subIndex}
                              className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 first:mt-0"
                            >
                              {subItem.label}
                            </div>
                          );
                        }
                        return (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-md text-sm font-medium ${
                                isActive
                                  ? 'bg-gray-200 text-black'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`
                            }
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}

                  {/* Tooltip for collapsed submenu */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                        <div className="border-4 border-transparent border-r-gray-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-md text-sm font-medium transition relative group ${
                    isActive
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-800 hover:bg-gray-100'
                  } ${isCollapsed ? 'px-2 py-2 justify-center' : 'px-4 py-2 gap-3'}`
                }
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed menu items */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                      <div className="border-4 border-transparent border-r-gray-800"></div>
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}

          <div className={`${isCollapsed ? 'px-2' : 'px-4'} mt-auto pb-4`}>
            <button
              onClick={handleLogout}
              className={`flex items-center w-full py-2 rounded-md text-sm font-medium text-red-600 hover:bg-gray-100 relative group ${
                isCollapsed ? 'justify-center' : 'gap-3'
              }`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <FiLogOut className="text-lg" />
              {!isCollapsed && <span>Logout</span>}
              
              {/* Tooltip for collapsed logout */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                  Logout
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                    <div className="border-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;