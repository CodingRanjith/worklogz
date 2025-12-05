import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  FiHome,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiCheckSquare,
  FiDollarSign,
  FiCalendar,
  FiGrid,
  FiUser,
  FiFolder,
  FiCompass,
  FiHelpCircle,
  FiStar,
  FiLogOut,
  FiTrendingUp,
  FiTarget,
  FiBook,
  FiMenu,
  FiChevronLeft,
  FiClipboard,
} from 'react-icons/fi';
import { getAccessForUser } from '../../../utils/sidebarAccess';
import { API_ENDPOINTS } from '../../../utils/api';
import SidebarNotifications from '../SidebarNotifications';

const EmployeeSidebar = ({ isOpen, setIsOpen, onCollapseChange }) => {
  const navigate = useNavigate();
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
  
  const allowedPaths = useMemo(
    () => (currentUserId ? getAccessForUser(currentUserId, 'employee') : null),
    [currentUserId]
  );

  // Check if user is a team lead
  useEffect(() => {
    const checkIfTeamLead = async () => {
      if (!token || !currentUserId) return;
      try {
        const response = await axios.get(API_ENDPOINTS.getMyTeams, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const teams = response.data || [];
        // Check if user is a team lead in any team
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

  const menuItems = useMemo(() => {
    const items = [
      { label: 'Home', icon: <FiHome />, path: '/home' },
      { label: 'Attendance', icon: <FiClock />, path: '/attendance' },
      { label: 'Community', icon: <FiUsers />, path: '/employee/community' },
      { label: 'My Workspace', icon: <FiBriefcase />, path: '/employee/workspace' },
      { label: 'Task Manager', icon: <FiCheckSquare />, path: '/timesheet' },
    ];
    
    // Only add Admin Task Manager if user is a team lead
    if (isTeamLead) {
      items.push({ label: 'Admin Task Manager', icon: <FiClipboard />, path: '/task-manager' });
    }
    
    items.push(
      { label: 'Salary', icon: <FiDollarSign />, path: '/my-earnings' },
      { label: 'Leave Management', icon: <FiCalendar />, path: '/apply-leave' },
      { label: 'Skill Development', icon: <FiBook />, path: '/skill-development' },
      { label: 'Goals & Achievements', icon: <FiTarget />, path: '/goals-achievements' },
      { label: 'Calendar View', icon: <FiCalendar />, path: '/calendar' },
      { label: 'Performance', icon: <FiTrendingUp />, path: '/performance' },
      { label: 'Applications', icon: <FiGrid />, path: '/employee/applications' },
      { label: 'People', icon: <FiUser />, path: '/employee/people' },
      { label: 'Team Management', icon: <FiUsers />, path: '/team-management' },
      { label: 'Document Center', icon: <FiFolder />, path: '/documents' },
      { label: 'Helpdesk', icon: <FiHelpCircle />, path: '/helpdesk' },
      { label: 'AI Copilot', icon: <FiStar />, path: '/employee/ai' },
    );
    
    return items;
  }, [isTeamLead]);

  const visibleMenuItems = useMemo(() => {
    // For employees, if allowedPaths is null or undefined, show all items
    // If it's an empty array, also show all items (employee default behavior)
    if (!allowedPaths || !Array.isArray(allowedPaths) || allowedPaths.length === 0) {
      return menuItems;
    }
    const allowedSet = new Set(allowedPaths);
    // Always include Home and Admin Task Manager for employees
    const filtered = menuItems.filter((item) => !item.path || allowedSet.has(item.path) || item.path === '/home' || item.path === '/task-manager');
    // Ensure Home is at the top
    const homeItem = menuItems.find(item => item.path === '/home');
    const otherItems = filtered.filter(item => item.path !== '/home');
    return homeItem ? [homeItem, ...otherItems] : filtered;
  }, [menuItems, allowedPaths]);

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
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
                <div style={{
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  fontWeight: '700',
                  color: '#1c1f33',
                  lineHeight: '1.3',
                  minWidth: 0
                }}>
                  <div>WORKLOGZ</div>
                  <small style={{
                    display: 'block',
                    color: '#94a3b8',
                    marginTop: '6px',
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em'
                  }}>POWERED BY TECHACKODE</small>
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
          {visibleMenuItems.map((item, index) => (
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
          ))}

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

