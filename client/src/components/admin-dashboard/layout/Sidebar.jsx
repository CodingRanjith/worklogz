import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiCalendar, FiBarChart2, FiSettings, FiLogOut,
  FiFileText, FiDollarSign, FiCamera, FiChevronRight, FiClipboard, FiBriefcase,
  FiMenu, FiChevronLeft, FiLayers, FiHelpCircle, FiPackage, FiShield, FiEdit3, FiCreditCard,
  FiClock, FiTrendingUp, FiStar, FiPlay, FiTarget, FiBook, FiUser, FiFolder, FiGrid
} from 'react-icons/fi';

export const menuItems = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  {
    label: 'Employee Features',
    icon: <FiUser />,
    subItems: [
      { label: 'Attendance', path: '/attendance' },
      { label: 'Workspace & Collaboration', path: '#', isSection: true },
      { label: 'Community', path: '/employee/community' },
      { label: 'My Workspace', path: '/employee/workspace' },
      { label: 'Task Manager', path: '/timesheet' },
      { label: 'HR & Administration', path: '#', isSection: true },
      { label: 'Leave Management', path: '/apply-leave' },
      { label: 'People', path: '/employee/people' },
      { label: 'Team Management', path: '/team-management' },
      { label: 'Document Center', path: '/documents' },
      { label: 'Calendar View', path: '/calendar' },
      { label: 'Performance & Development', path: '#', isSection: true },
      { label: 'Skill Development', path: '/skill-development' },
      { label: 'Assessments', path: '/employee/assessments' },
      { label: 'Goals & Achievements', path: '/goals-achievements' },
      { label: 'Performance', path: '/performance' },
      { label: 'Applications', path: '/employee/applications' },
      { label: 'Expense Management', path: '#', isSection: true },
      { label: 'Salary', path: '/my-earnings' },
      { label: 'Fee Payment', path: '/employee/fee-payment' },
      { label: 'Learning & Support', path: '#', isSection: true },
      { label: 'AI Copilot', path: '/employee/ai' },
      { label: 'WorklogzTube', path: '/employee/worklogztube' },
      { label: 'Helpdesk', path: '/helpdesk' }
    ]
  },
  {
    label: 'Admin Features',
    icon: <FiShield />,
    subItems: [
      { label: 'Analytics & Reports', path: '#', isSection: true },
      { label: 'Analytics', path: '/analytics' },
      { label: 'Monthly Reports', path: '/reports' },
      { label: 'Workspace & Projects', path: '#', isSection: true },
      { label: 'Task Manager', path: '/task-manager' },
      { label: 'Company Worklogz', path: '/company-worklogz' },
      { label: 'Company Departments', path: '/company-departments' },
      { label: 'Projects Workspace', path: '/projects' },
      { label: 'HR & Administration', path: '#', isSection: true },
      { label: 'User Cards', path: '/all-users' },
      { label: 'Employees Schedules', path: '/employees' },
      { label: 'Pending Approvals', path: '/pending-users' },
      { label: 'Team Management', path: '/admin/team-management' },
      { label: 'Leave Records', path: '/leave-requests' },
      { label: 'Late Reports', path: '/late-reports' },
      { label: 'Holiday List', path: '/holidays' },
      { label: 'Experience Letters', path: '/experience-letters' },
      { label: 'Offer Letters', path: '/offer-letters' },
      { label: 'Relieving Letters', path: '/relieving-letters' },
      { label: 'Upload Documents', path: '/upload-documents' },
      { label: 'Administration', path: '/administration/access-control' },
      { label: 'Settings', path: '/settings' },
      { label: 'Sales & CRM', path: '#', isSection: true },
      { label: 'Course', path: '/crm/course' },
      { label: 'Internship', path: '/crm/internship' },
      { label: 'IT Projects', path: '/crm/it-projects' },
      { label: 'Plans', path: '/plans' },
      { label: 'Performance & Development', path: '#', isSection: true },
      { label: 'Assessments', path: '/assessments' },
      { label: 'Expense Management', path: '#', isSection: true },
      { label: 'Pay History', path: '/salaryhistory' },
      { label: 'Payslip Generator', path: '/payslip' },
      { label: 'Daily Salary Credit', path: '/daily-salary-credit' },
      { label: 'Fee Payments', path: '/fee-payments' }
    ]
  }
];

const Sidebar = ({ isOpen, setIsOpen, onCollapseChange }) => {
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