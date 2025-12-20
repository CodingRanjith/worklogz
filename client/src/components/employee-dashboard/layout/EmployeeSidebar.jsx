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
    const IconComp = item.icon && ICON_MAP[item.icon] ? ICON_MAP[item.icon] : null;
    const mappedSubItems = Array.isArray(item.subItems)
      ? item.subItems.map((sub) => ({
          ...sub,
        }))
      : [];

    return {
      ...item,
      icon: IconComp ? <IconComp /> : item.icon, // keep existing if already JSX
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

  useEffect(() => {
    const loadAllowedPaths = async () => {
      if (!currentUserId) {
        setAllowedPaths(null);
        return;
      }
      try {
        const paths = await getAccessForUser(currentUserId, 'employee');
        setAllowedPaths(paths);
      } catch (err) {
        console.warn('Failed to load allowed paths', err);
        setAllowedPaths(null);
      }
    };
    loadAllowedPaths();
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

  // Load sidebar menu items dynamically from backend (with fallback)
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_ENDPOINTS.getSidebarMenu('employee'), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let items = res.data?.items || [];

        if (!items.length) {
          // Fallback to existing static definition if backend has no data yet
          items = getEmployeeMenuItems();
        } else {
          // Ensure core navigation items (Home, Attendance, Dashboard) are always present at the top
          const coreItems = [
            { label: 'Home', icon: 'FiHome', path: '/home' },
            { label: 'Attendance', icon: 'FiClock', path: '/attendance' },
            { label: 'Dashboard', icon: 'FiBarChart2', path: '/dashboard' },
          ];

          const existingPaths = new Set(items.map(item => item.path));
          const missingCoreItems = coreItems.filter(core => !existingPaths.has(core.path));

          if (missingCoreItems.length) {
            items = [...missingCoreItems, ...items];
          }

          // Normalize items: remove empty subItems arrays and ensure core items have no subItems
          items = items.map(item => {
            // Core navigation items should never have subItems
            if (item.path === '/home' || item.path === '/attendance' || item.path === '/dashboard') {
              const { subItems, ...rest } = item;
              return rest;
            }
            // Remove empty subItems arrays so they're treated as simple links
            if (item.subItems && (!Array.isArray(item.subItems) || item.subItems.length === 0)) {
              const { subItems, ...rest } = item;
              return rest;
            }
            return item;
          });
        }

        setMenuItems(withResolvedIcons(items));
      } catch (err) {
        console.error('Failed to load employee sidebar menu, using static fallback', err);
        setMenuItems(withResolvedIcons(getEmployeeMenuItems()));
      }
    };

    loadMenu();
  }, []);
  
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
    // For employees, if allowedPaths is null or undefined, show all items
    // If it's an empty array, also show all items (employee default behavior)
    if (!allowedPaths || !Array.isArray(allowedPaths) || allowedPaths.length === 0) {
      return menuItems;
    }
    const allowedSet = new Set(allowedPaths);
    
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
                  color: theme.primary || '#1c1f33',
                  lineHeight: '1.3',
                  minWidth: 0
                }}>
                  <div>WORKLOGZ</div>
                  <small style={{
                    display: 'block',
                    color: theme.secondary || '#94a3b8',
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
          {visibleMenuItems.map((item, index) => {
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
          })}

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

// Static export of menu items for access control (includes all items including Admin Task Manager)
export const getEmployeeMenuItems = () => {
  return [
    // 🏠 Main Pages
    { label: 'Home', icon: <FiHome />, path: '/home' },
    { label: 'Attendance', icon: <FiClock />, path: '/attendance' },
    { label: 'Dashboard', icon: <FiBarChart2 />, path: '/dashboard' },
    
    // 👥 HR & Administration
    {
      label: 'HR & Administration',
      icon: <FiUsers />,
      subItems: [
        { label: 'User & Employee Management', path: '#', isSection: true },
        { label: 'People', path: '/employee/people' },
        { label: 'Team Management', path: '/team-management' },
        { label: 'Applications', path: '/employee/applications' },
        { label: 'Roles & Permissions', path: '/administration/access-control' },
        { label: 'Onboarding & Offboarding', path: '/hr/onboarding' },
        { label: 'Employee Profiles', path: '/hr/employee-profiles' },
        { label: 'HR Requests & Approvals', path: '/hr/approvals' },
        { label: 'Org Chart', path: '/hr/org-chart' },
        { label: 'HR Analytics', path: '/hr/analytics' }
      ]
    },
    
    // ⏱️ Time & Task Tracking
    {
      label: 'Time & Task Tracking',
      icon: <FiClock />,
      subItems: [
        { label: 'Task Manager', path: '/timesheet' },
        { label: 'Admin Task Manager', path: '/task-manager' },
        { label: 'Worklog Tracking', path: '/worklog-tracking' },
        { label: 'Calendar View', path: '/calendar' },
        { label: 'Timesheets', path: '/timesheets' },
        { label: 'Productivity Reports', path: '/productivity-reports' },
        { label: 'Shift Management', path: '/shift-management' },
        { label: 'Overtime Tracking', path: '/overtime-tracking' },
        { label: 'AI Time Insights', path: '/ai-time-insights' }
      ]
    },
    
    // 🌴 Leave Management
    {
      label: 'Leave Management',
      icon: <FiCalendar />,
      subItems: [
        { label: 'Apply Leave', path: '/apply-leave' },
        { label: 'Leave Records', path: '/leave-requests' },
        { label: 'Late Reports', path: '/late-reports' },
        { label: 'Holiday List', path: '/holidays' },
        { label: 'Leave Policies', path: '/leave-policies' },
        { label: 'Leave Approvals', path: '/leave-approvals' },
        { label: 'Comp-Off Management', path: '/comp-off' },
        { label: 'Shift-Based Leaves', path: '/shift-leaves' },
        { label: 'Leave Analytics', path: '/leave-analytics' },
        { label: 'AI Leave Insights', path: '/ai-leave-insights' }
      ]
    },
    
    // 💰 Finance & Compensation
    {
      label: 'Finance & Compensation',
      icon: <FiDollarSign />,
      subItems: [
        { label: 'Salary', path: '/my-earnings' },
        { label: 'Pay History', path: '/salaryhistory' },
        { label: 'Payslip Generator', path: '/payslip' },
        { label: 'Daily Salary Credit', path: '/daily-salary-credit' },
        { label: 'Expense Claims', path: '/expense-claims' },
        { label: 'Payroll Processing', path: '/payroll-processing' },
        { label: 'Bonuses & Incentives', path: '/bonuses-incentives' },
        { label: 'Tax & Compliance', path: '/tax-compliance' },
        { label: 'Reimbursements', path: '/reimbursements' },
        { label: 'Finance Analytics', path: '/finance-analytics' }
      ]
    },
    
    // 📁 Documents & Administration
    {
      label: 'Documents & Administration',
      icon: <FiFolder />,
      subItems: [
        { label: 'Document Center', path: '/documents' },
        { label: 'Offer Letters', path: '/offer-letters' },
        { label: 'Experience Letters', path: '/experience-letters' },
        { label: 'Relieving Letters', path: '/relieving-letters' },
        { label: 'Upload Documents', path: '/upload-documents' },
        { label: 'Document Templates', path: '/document-templates' },
        { label: 'E-Sign & Approvals', path: '/document-approvals' },
        { label: 'Version Control', path: '/document-versions' },
        { label: 'Access & Permissions', path: '/document-access' },
        { label: 'Audit Logs', path: '/document-audit' }
      ]
    },
    
    // 📁 Project Management
    {
      label: 'Project Management',
      icon: <FiBriefcase />,
      subItems: [
        { label: 'Project Workspace', path: '#', isSection: true },
        { label: 'Projects Workspace', path: '/projects' },
        { label: 'My Workspace', path: '/employee/workspace' },
        { label: 'Company Worklogz', path: '/company-worklogz' },
        { label: 'Company Departments', path: '/company-departments' },
        { label: 'Project Reports', path: '/project-reports' },
        { label: 'Task Management', path: '#', isSection: true },
        { label: 'Task Manager', path: '/timesheet' },
        { label: 'Admin Task Manager', path: '/task-manager' },
        { label: 'Sub Tasks', path: '/sub-tasks' },
        { label: 'Milestones', path: '/milestones' },
        { label: 'Productivity Reports', path: '/productivity-reports' },
        { label: 'Sprint & Agile Board', path: '/agile-board' },
        { label: 'Resource Allocation', path: '/resource-allocation' },
        { label: 'Risk & Issue Tracking', path: '/risk-management' },
        { label: 'Project Timeline (Gantt)', path: '/gantt-view' },
        { label: 'Project Automation (AI)', path: '/project-ai' }
      ]
    },
    
    // 💼 Sales & CRM
    {
      label: 'Sales & CRM',
      icon: <FiShoppingCart />,
      subItems: [
        { label: 'Customer Relationship Management', path: '#', isSection: true },
        { label: 'CRM Dashboard', path: '/crm/dashboard' },
        { label: 'Course CRM', path: '/crm/course' },
        { label: 'Internship CRM', path: '/crm/internship' },
        { label: 'IT Projects CRM', path: '/crm/it-projects' },
        { label: 'Custom CRM', path: '/crm/custom' },
        { label: 'Leads Management', path: '/crm/leads' },
        { label: 'Deals & Pipeline', path: '/crm/deals' },
        { label: 'Contacts & Accounts', path: '/crm/contacts' },
        { label: 'Follow-ups & Activities', path: '/crm/activities' },
        { label: 'CRM Automation (n8n)', path: '/crm-automation' },
        { label: 'Payment & Billing', path: '#', isSection: true },
        { label: 'Fee Payments (Admin)', path: '/fee-payments' },
        { label: 'Fee Payment (Employee)', path: '/employee/fee-payment' },
        { label: 'Plans', path: '/plans' },
        { label: 'Invoices', path: '/invoices' },
        { label: 'Payment Reports', path: '/payment-reports' },
        { label: 'Revenue Analytics', path: '/revenue-analytics' },
        { label: 'Subscription Management', path: '/subscriptions' },
        { label: 'Tax & Compliance', path: '/sales-tax' },
        { label: 'Refunds & Adjustments', path: '/refunds' },
        { label: 'AI Sales Insights', path: '/ai-sales-insights' }
      ]
    },
    
    // 📊 Marketing & Analytics
    {
      label: 'Marketing & Analytics',
      icon: <FiPieChart />,
      subItems: [
        { label: 'Analytics & Reporting', path: '#', isSection: true },
        { label: 'Analytics Dashboard', path: '/analytics' },
        { label: 'Monthly Reports', path: '/reports' },
        { label: 'Performance Metrics', path: '/performance-metrics' },
        { label: 'Lead & Sales Analytics', path: '/lead-analytics' },
        { label: 'Custom Reports', path: '/custom-reports' },
        { label: 'Automation Workflows (n8n)', path: '/automation-workflows' },
        { label: 'Real-Time Event Tracking', path: '/event-tracking' },
        { label: 'Data Pipelines & ETL', path: '/data-pipelines' },
        { label: 'Predictive Analytics (AI)', path: '/predictive-analytics' },
        { label: 'Attribution & Funnel Analysis', path: '/funnel-analysis' },
        { label: 'Embedded BI Dashboards', path: '/bi-dashboards' }
      ]
    },
    
    // 🎓 Edutech & Learning
    {
      label: 'Edutech & Learning',
      icon: <FiBookOpen />,
      subItems: [
        { label: 'Learning & Development', path: '#', isSection: true },
        { label: 'Skill Development', path: '/skill-development' },
        { label: 'Assessments', path: '/employee/assessments' },
        { label: 'WorklogzTube', path: '/employee/worklogztube' },
        { label: 'Learning Paths', path: '/learning-paths' },
        { label: 'Certifications', path: '/certifications' },
        { label: 'AI Learning Copilot', path: '/ai-learning-copilot' },
        { label: 'Personalized Learning Engine', path: '/personalized-learning' },
        { label: 'Live Classes & Webinars', path: '/live-classes' },
        { label: 'Assignments & Projects', path: '/assignments-projects' },
        { label: 'Progress & Skill Analytics', path: '/learning-analytics' },
        { label: 'Content Authoring (No-Code)', path: '/content-authoring' }
      ]
    },
    
    // 🎯 Goals & Performance
    {
      label: 'Goals & Performance',
      icon: <FiTarget />,
      subItems: [
        { label: 'Goals & Achievements', path: '/goals-achievements' },
        { label: 'Performance Dashboard', path: '/performance' },
        { label: 'KPI Tracking', path: '/kpi-tracking' },
        { label: 'Feedback & Reviews', path: '/feedback-reviews' },
        { label: 'OKR Management', path: '/okr-management' },
        { label: '360° Feedback', path: '/360-feedback' },
        { label: 'Review Cycles', path: '/review-cycles' },
        { label: 'Skill Gap Analysis', path: '/skill-gap-analysis' },
        { label: 'AI Performance Insights', path: '/ai-performance-insights' }
      ]
    },

    
    // 🤝 Collaboration & Communication
    {
      label: 'Collaboration & Communication',
      icon: <FiMessageCircle />,
      subItems: [
        { label: 'Team Collaboration', path: '#', isSection: true },
        { label: 'Community', path: '/employee/community' },
        { label: 'People Directory', path: '/employee/people' },
        { label: 'Team Management', path: '/team-management' },
        { label: 'Announcements', path: '/announcements' },
        { label: 'Internal Chat', path: '/internal-chat' },
        { label: 'Channels & Groups', path: '/channels-groups' },
        { label: 'Company Polls & Surveys', path: '/polls-surveys' },
        { label: 'Knowledge Base / Wiki', path: '/knowledge-base' },
        { label: 'File Sharing', path: '/file-sharing' },
        { label: 'Mentions & Notifications', path: '/mentions' },
        { label: 'Support & Workspace', path: '#', isSection: true },
        { label: 'Helpdesk', path: '/helpdesk' },
        { label: 'My Workspace', path: '/employee/workspace' },
        { label: 'Document Center', path: '/documents' },
        { label: 'Meeting Scheduler', path: '/meeting-scheduler' },
        { label: 'Company Calendar', path: '/calendar' }
      ]
    },
    
    // 📈 Performance Management
    {
      label: 'Performance Management',
      icon: <FiActivity />,
      subItems: [
        { label: 'Performance Tracking', path: '#', isSection: true },
        { label: 'Performance Dashboard', path: '/performance' },
        { label: 'Goals & Achievements', path: '/goals-achievements' },
        { label: 'Calendar View', path: '/calendar' },
        { label: 'Review Cycles', path: '/review-cycles' },
        { label: 'Appraisal Reports', path: '/appraisal-reports' },
        { label: 'KPI & OKR Tracking', path: '/kpi-okr' },
        { label: '360° Feedback', path: '/360-feedback' },
        { label: 'Skill Gap Analysis', path: '/skill-gap-analysis' },
        { label: 'Promotion & Growth Plans', path: '/growth-plans' },
        { label: 'AI Performance Insights', path: '/ai-performance' }
      ]
    },
    
    // 🛡️ Security & IT Management
    {
      label: 'Security & IT Management',
      icon: <FiShield />,
      subItems: [
        { label: 'Role-Based Access Control', path: '/administration/access-control' },
        { label: 'Login Activity', path: '/login-activity' },
        { label: 'Device Management', path: '/device-management' },
        { label: 'Audit Logs', path: '/audit-logs' },
        { label: 'Data Backup', path: '/data-backup' },
        { label: 'Single Sign-On (SSO)', path: '/sso-settings' },
        { label: 'IP & Geo Restrictions', path: '/ip-restrictions' },
        { label: 'Security Policies', path: '/security-policies' },
        { label: 'Incident Management', path: '/incident-management' },
        { label: 'Compliance Reports', path: '/compliance-reports' }
      ]
    },
    
    // 🤖 AI & Automation
    {
      label: 'AI & Automation',
      icon: <FiZap />,
      subItems: [
        { label: 'AI Copilot', path: '/employee/ai' },
        { label: 'AI Task Suggestions', path: '/ai-task-suggestions' },
        { label: 'Smart Attendance', path: '/smart-attendance' },
        { label: 'Auto Worklogs', path: '/auto-worklogs' },
        { label: 'AI Reports', path: '/ai-reports' },
        { label: 'Chatbot Assistant', path: '/chatbot-assistant' },
        { label: 'Workflow Automation (n8n)', path: '/workflow-automation' },
        { label: 'Predictive Analytics (AI)', path: '/predictive-analytics' },
        { label: 'AI Performance Insights', path: '/ai-performance-insights' },
        { label: 'AI Hiring & Screening', path: '/ai-hiring' },
        { label: 'RPA Bots (No-Code)', path: '/rpa-bots' },
        { label: 'AI Alerts & Triggers', path: '/ai-alerts' }
      ]
    },
    
    // 🧩 Development Platform
    {
      label: 'Development Platform',
      icon: <FiCode />,
      subItems: [
        { label: 'API Management', path: '/api-management' },
        { label: 'Custom Modules', path: '/custom-modules' },
        { label: 'Integrations', path: '/integrations' },
        { label: 'Webhooks', path: '/webhooks' },
        { label: 'Developer Settings', path: '/developer-settings' },
        { label: 'Low-Code Builder', path: '/low-code-builder' },
        { label: 'Workflow Builder', path: '/workflow-builder' },
        { label: 'Custom Objects & Fields', path: '/custom-objects' },
        { label: 'Form Builder', path: '/form-builder' },
        { label: 'App Marketplace', path: '/app-marketplace' },
        { label: 'Environment Management', path: '/environments' }
      ]
    },
    
    // ⚙️ Core Navigation
    {
      label: 'Core Navigation',
      icon: <FiSettings />,
      subItems: [
        { label: 'Notifications', path: '/notifications' },
        { label: 'Profile Settings', path: '/profile-settings' },
        { label: 'System Settings', path: '#', isSection: true },
        { label: 'Company Settings', path: '/company-settings' },
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
    }
  ];
};

export default EmployeeSidebar;
