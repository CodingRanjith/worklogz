import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  FiHome,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiFolder,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiTarget,
  FiMessageCircle,
  FiActivity,
  FiShield,
  FiZap,
  FiCode,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
} from 'react-icons/fi';
import { getAccessForUser } from '../../../utils/sidebarAccess';
import { API_ENDPOINTS } from '../../../utils/api';
import SidebarNotifications from '../SidebarNotifications';
import { useTheme } from '../../../hooks/useTheme';
import { normalizeMenuOrder } from '../../../utils/sidebarMenu';

// Map icon names from backend to actual React icon components
const ICON_MAP = {
  FiHome,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiFolder,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiTarget,
  FiMessageCircle,
  FiActivity,
  FiShield,
  FiZap,
  FiCode,
  FiSettings,
  FiBarChart2,
  FiFileText,
};

const withResolvedIcons = (items = []) => {
  return items.map((item) => {
    // Handle icon - only string from backend (e.g., "FiHome")
    let iconElement = null;
    if (typeof item.icon === 'string' && item.icon.trim()) {
      const IconComp = ICON_MAP[item.icon] || null;
      iconElement = IconComp ? <IconComp /> : null;
    }
    
    // Resolve subItems icons
    const mappedSubItems = Array.isArray(item.subItems)
      ? item.subItems.map((sub) => {
          let subIcon = null;
          if (typeof sub.icon === 'string' && sub.icon.trim()) {
            const SubIconComp = ICON_MAP[sub.icon] || null;
            subIcon = SubIconComp ? <SubIconComp /> : null;
          }
          return {
            ...sub,
            icon: subIcon,
          };
        })
      : [];

    return {
      ...item,
      icon: iconElement,
      subItems: mappedSubItems,
    };
  });
};

const EmployeeSidebar = ({ isOpen, setIsOpen, onCollapseChange }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isTeamLead, setIsTeamLead] = useState(false);

  const token = useMemo(() => localStorage.getItem('token'), []);
  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.id || decoded._id || null;
    } catch (err) {
      console.warn('Failed to decode token for sidebar filtering', err);
      return null;
    }
  }, [token]);
  
  const [allowedPaths, setAllowedPaths] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  useEffect(() => {
    const loadAllowedPaths = async () => {
      if (!currentUserId) {
        console.log('No currentUserId, setting allowedPaths to null');
        setAllowedPaths(null);
        return;
      }
      try {
        console.log('Loading allowed paths for user:', currentUserId, 'scope: employee');
        const paths = await getAccessForUser(currentUserId, 'employee');
        console.log('Loaded allowed paths:', paths, 'Type:', typeof paths, 'Is Array:', Array.isArray(paths), 'Length:', Array.isArray(paths) ? paths.length : 'N/A');
        
        // If paths is null or undefined, it means "show all" (default behavior)
        // If paths is an empty array [], also treat as "show all" for employees
        // Only filter if paths is a non-empty array
        setAllowedPaths(paths);
      } catch (err) {
        console.warn('Failed to load allowed paths', err);
        // On error, default to null (show all) for employees
        setAllowedPaths(null);
      }
    };
    loadAllowedPaths();

    // Listen for storage changes to refresh access when updated from another tab/window
    const handleStorageChange = (e) => {
      if (e.key === 'sidebarAccess' && currentUserId) {
        console.log('Sidebar access changed in storage, reloading...');
        loadAllowedPaths();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event (for same-tab updates)
    const handleAccessUpdate = (e) => {
      const updatedUserId = e.detail?.userId;
      // Reload if it's for the current user or if no specific user is specified
      if (currentUserId && (!updatedUserId || updatedUserId === currentUserId)) {
        console.log('Sidebar access updated for user:', updatedUserId || currentUserId, 'reloading...');
        // Small delay to ensure backend has updated
        setTimeout(() => {
          loadAllowedPaths();
        }, 500);
      }
    };
    window.addEventListener('sidebarAccessUpdated', handleAccessUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarAccessUpdated', handleAccessUpdate);
    };
  }, [currentUserId]);

  // Check if user is a team lead
  useEffect(() => {
    const checkIfTeamLead = async () => {
      if (!token || !currentUserId) return;
      try {
        const response = await axios.get(API_ENDPOINTS.getMyTeams, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const teams = response.data || [];
        const userIsTeamLead = teams.some(team => 
          team.teamLead && (team.teamLead._id === currentUserId || team.teamLead.toString() === currentUserId)
        );
        setIsTeamLead(userIsTeamLead);
      } catch (error) {
        console.error('Error checking team lead status:', error);
        setIsTeamLead(false);
      }
    };
    checkIfTeamLead();
  }, [token, currentUserId]);

  // Load sidebar menu items dynamically from backend - only use dynamic data
  useEffect(() => {
    const loadMenu = async () => {
      const token = localStorage.getItem('token');
      setIsLoadingMenu(true);
      
      try {
        console.log('Loading sidebar menu from:', API_ENDPOINTS.getSidebarMenu('employee'));
        const res = await axios.get(API_ENDPOINTS.getSidebarMenu('employee'), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        console.log('Sidebar menu API response:', res.data);
        
        // Handle different response structures
        let items = [];
        if (res.data) {
          // Response could be { items: [...] } or { scope: 'employee', items: [...] } or direct array
          if (Array.isArray(res.data)) {
            items = res.data;
          } else if (res.data.items && Array.isArray(res.data.items)) {
            items = res.data.items;
          } else if (res.data.menu && res.data.menu.items && Array.isArray(res.data.menu.items)) {
            items = res.data.menu.items;
          }
        }

        console.log('Extracted items:', items, 'Count:', items.length);

        // Process backend data: normalize structure and resolve icons
        if (items && items.length > 0) {
          items = items.map(item => {
            // Remove empty subItems arrays so they're treated as simple links
            if (item.subItems && (!Array.isArray(item.subItems) || item.subItems.length === 0)) {
              const { subItems, ...rest } = item;
              return rest;
            }
            return item;
          });

          // Normalize order and resolve icons from backend data
          const normalizedItems = normalizeMenuOrder(items);
          const resolvedItems = withResolvedIcons(normalizedItems);
          console.log('Processed menu items:', resolvedItems.length, 'items');
          setMenuItems(resolvedItems);
        } else {
          // Backend returned empty - no menu configured yet
          console.warn('Backend returned empty sidebar menu. Configure menu in Master Control.');
          console.warn('Full API response:', res.data);
          setMenuItems([]);
        }
      } catch (err) {
        // Network error or API unavailable - set empty menu
        console.error('Failed to load sidebar menu from backend:', err);
        console.error('Error details:', err.response?.data || err.message);
        console.error('Error status:', err.response?.status);
        setMenuItems([]);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    loadMenu();
  }, []); // Load once on mount
  
  // Initialize all items with subItems as collapsed by default
  const [expandedItems, setExpandedItems] = React.useState({});
  
  // Update expandedItems when menuItems or route changes
  useEffect(() => {
    const initialExpanded = {};
    menuItems.forEach(item => {
      // Only initialize expanded state for items with actual subItems
      if (item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0) {
        // Auto-expand the group if any of its subItems matches the current route
        const hasActiveSubItem = item.subItems.some(subItem =>
          !subItem.isSection &&
          subItem.path &&
          (location.pathname === subItem.path ||
            (subItem.path !== '#' && location.pathname.startsWith(subItem.path)))
        );
        initialExpanded[item.label] = hasActiveSubItem;
      }
    });
    setExpandedItems(initialExpanded);
  }, [menuItems, location.pathname]);

  const toggleItem = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const visibleMenuItems = useMemo(() => {
    console.log('Filtering menu items. allowedPaths:', allowedPaths, 'menuItems count:', menuItems.length);
    
    // For employees:
    // - If allowedPaths is null, undefined, or empty array [], show all items (default behavior - no restrictions)
    // - Empty array for employees means "not restricted" (show all), not "no access"
    // - If allowedPaths has items, filter based on those paths
    if (allowedPaths === null || allowedPaths === undefined) {
      console.log('allowedPaths is null/undefined - showing all items');
      return menuItems;
    }
    
    if (!Array.isArray(allowedPaths)) {
      console.warn('allowedPaths is not an array:', allowedPaths);
      return menuItems;
    }
    
    // For employees, empty array means "show all" (default behavior)
    // Only filter if there are actual paths specified
    if (allowedPaths.length === 0) {
      console.log('allowedPaths is empty array - for employees this means show all items (default behavior)');
      return menuItems;
    }
    
    console.log('Filtering with allowedPaths:', allowedPaths);
    
    // Debug: Show all paths in menu items
    const allMenuPaths = [];
    menuItems.forEach(item => {
      if (item.path) allMenuPaths.push(item.path);
      if (item.subItems) {
        item.subItems.forEach(sub => {
          if (sub.path && !sub.isSection) allMenuPaths.push(sub.path);
        });
      }
    });
    console.log('All paths in menu items:', allMenuPaths);
    console.log('Paths that match:', allowedPaths.filter(p => allMenuPaths.includes(p)));
    console.log('Paths in allowedPaths but NOT in menu:', allowedPaths.filter(p => !allMenuPaths.includes(p)));
    
    // Always filter based on allowedPaths - no "show all" shortcut
    // Admin must explicitly enable each path, even if all paths are enabled
    const allowedSet = new Set(allowedPaths);
    
    console.log('Filtering menu items based on allowed paths');
    
    // Filter menu items, handling both regular items and items with subItems
    const filtered = menuItems.map(item => {
      // Only treat as dropdown if item has subItems array with actual items
      if (item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0) {
        // For items with subItems, filter the subItems based on allowed paths
        const filteredSubItems = item.subItems.filter(subItem => 
          subItem.isSection || allowedSet.has(subItem.path) || subItem.path === '/task-manager'
        );
        // Only include the category if it has at least one allowed subItem (excluding sections)
        const hasAllowedItems = filteredSubItems.some(subItem => !subItem.isSection);
        if (hasAllowedItems) {
          return { ...item, subItems: filteredSubItems };
        }
        return null;
      } else {
        // For regular items, check if path is allowed
        // Always allow home, attendance, and dashboard for basic navigation
        if (
          !item.path ||
          allowedSet.has(item.path) ||
          item.path === '/home' ||
          item.path === '/attendance' ||
          item.path === '/dashboard'
        ) {
          return item;
        }
        return null;
      }
    }).filter(item => item !== null);
    
    console.log('Filtered menu items count:', filtered.length);
    
    // Ensure Home is at the top
    const homeItem = filtered.find(item => item.path === '/home');
    const otherItems = filtered.filter(item => item.path !== '/home');
    return homeItem ? [homeItem, ...otherItems] : filtered;
  }, [menuItems, allowedPaths]);

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
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
        // Only restore expanded state for items with actual subItems
        if (item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0) {
          allExpanded[item.label] = true;
        }
      });
      setExpandedItems(allExpanded);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
              <a
                href="https://www.worklogz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                title="Worklogz"
              >
                <img 
                  src="/worklogz-logo.png" 
                  alt="Worklogz" 
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    console.error('Failed to load Worklogz logo');
                    e.target.style.display = 'none';
                  }}
                />
              </a>
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
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <a
                  href="https://www.worklogz.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title="Worklogz"
                >
                  <img 
                    src="/worklogz-logo.png" 
                    alt="Worklogz Logo" 
                    className="h-8 w-auto object-contain flex-shrink-0"
                    onError={(e) => {
                      console.error('Failed to load Worklogz logo');
                      e.target.style.display = 'none';
                    }}
                  />
                </a>
                <div className="flex flex-col">
                  <a
                    href="https://www.worklogz.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    title="Worklogz"
                  >
                    <div style={{
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      fontWeight: '700',
                      color: theme.primary || '#1c1f33',
                      lineHeight: '1.2',
                      minWidth: 0
                    }}>
                      WORKLOGZ
                    </div>
                  </a>
                  <small style={{
                    display: 'block',
                    color: theme.secondary || '#94a3b8',
                    fontWeight: '400',
                    fontSize: '0.5rem',
                    letterSpacing: '0.03em',
                    lineHeight: '1.2',
                    marginTop: '2px'
                  }}>
                    POWERED BY TECHACKODE
                  </small>
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

        <nav className="mt-4 px-2 flex flex-col gap-1 overflow-y-auto overflow-x-visible h-[calc(100vh-80px)]">
          {isLoadingMenu ? (
            <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-8 text-center text-gray-500 text-sm`}>
              {!isCollapsed && 'Loading menu...'}
            </div>
          ) : visibleMenuItems.length === 0 ? (
            <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-8 text-center text-gray-500 text-xs`}>
              {!isCollapsed && (
                <>
                  {menuItems.length === 0 ? (
                    <>
                      <p className="mb-2">No menu items configured</p>
                      <p className="text-gray-400">Configure in Master Control</p>
                      <p className="text-gray-400 text-[10px] mt-2">Check console for API response</p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">No menu items visible</p>
                      <p className="text-gray-400">Check access permissions</p>
                      <p className="text-gray-400 text-[10px] mt-2">Menu items: {menuItems.length}, Allowed paths: {allowedPaths?.length || 0}</p>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            visibleMenuItems.map((item, index) => {
            // Only render as dropdown if item has subItems array with actual items
            if (item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0) {
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
                        const isActive = location.pathname === subItem.path || 
                          (subItem.path !== '#' && location.pathname.startsWith(subItem.path));
                        return (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            end={subItem.path === '/attendance'}
                            className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                              isActive
                                ? 'text-white'
                                : 'text-gray-700'
                            }`}
                            style={{
                              backgroundColor: isActive ? (theme.primary || '#1c1f33') : 'transparent',
                              color: isActive ? '#ffffff' : undefined
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = `${theme.primary || '#1c1f33'}20`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
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

            const isActive = location.pathname === item.path || 
              (item.path === '/home' && location.pathname === '/');
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === '/home' || item.path === '/attendance'}
                className={`flex items-center rounded-md text-sm font-medium transition relative group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-800'
                } ${isCollapsed ? 'px-2 py-2 justify-center' : 'px-4 py-2 gap-3'}`}
                style={{
                  backgroundColor: isActive ? (theme.primary || '#1c1f33') : 'transparent',
                  color: isActive ? '#ffffff' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = `${theme.primary || '#1c1f33'}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => {
                  setIsOpen(false);
                }}
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
            })
          )}

          {/* Notifications Component - Integrated in Sidebar */}
          <div className="mt-2">
            <SidebarNotifications isCollapsed={isCollapsed} />
          </div>

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

export default EmployeeSidebar;
