import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiUsers, FiCalendar, FiBarChart2, FiSettings, FiLogOut,
  FiFileText, FiDollarSign, FiCamera, FiChevronRight, FiClipboard, FiBriefcase,
  FiMenu, FiChevronLeft, FiLayers, FiHelpCircle, FiPackage, FiShield, FiEdit3, FiCreditCard
} from 'react-icons/fi';

export const menuItems = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  { label: 'Analytics', icon: <FiBarChart2 />, path: '/analytics' },
  { label: 'Monthly Reports', icon: <FiCamera />, path: '/reports' },
  {
    label: 'User Management',
    icon: <FiUsers />,
    subItems: [
      { label: 'User Cards', path: '/all-users' },
      { label: 'Employees Schedules', path: '/employees' },
      { label: 'Pending Approvals', path: '/pending-users' },
      { label: 'Team Management', path: '/admin/team-management' }
    ]
  },
  { label: 'Task Manager', icon: <FiClipboard />, path: '/task-manager' },
  { label: 'Assessments', icon: <FiEdit3 />, path: '/assessments' },
  { label: 'Helpdesk', icon: <FiHelpCircle />, path: '/helpdesk' },
  { label: 'Company Worklogz', icon: <FiBriefcase />, path: '/company-worklogz' },
  { label: 'Company Departments', icon: <FiBriefcase />, path: '/company-departments' },
  { label: 'Projects Workspace', icon: <FiBriefcase />, path: '/projects' },
  {
    label: 'CRM',
    icon: <FiLayers />,
    subItems: [
      { label: 'Course', path: '/crm/course' },
      { label: 'Internship', path: '/crm/internship' },
      { label: 'IT Projects', path: '/crm/it-projects' }
    ]
  },
  {
    label: 'Leaves & Lates',
    icon: <FiCalendar />,
    subItems: [
      { label: 'Leave Management', path: '/apply-leave' },
      { label: 'Leave Records', path: '/leave-requests' },
      { label: 'Late Reports', path: '/late-reports' }
    ]
  },
  {
    label: 'Documents',
    icon: <FiFileText />,
    subItems: [
      { label: 'Experience Letters', path: '/experience-letters' },
      { label: 'Offer Letters', path: '/offer-letters' },
      { label: 'Relieving Letters', path: '/relieving-letters' },
      { label: 'Upload Documents', path: '/upload-documents' }
    ]
  },
  { label: 'Pay History', icon: <FiDollarSign />, path: '/salaryhistory' },
  { label: 'Payslip Generator', icon: <FiBarChart2 />, path: '/payslip' },
  { label: 'Daily Salary Credit', icon: <FiDollarSign />, path: '/daily-salary-credit' },
  { label: 'Holiday List', icon: <FiCalendar />, path: '/holidays' },
  { label: 'Administration', icon: <FiShield />, path: '/administration/access-control' },
  { label: 'Plans', icon: <FiPackage />, path: '/plans' },
  { label: 'Fee Payments', icon: <FiCreditCard />, path: '/fee-payments' },
  { label: 'Settings', icon: <FiSettings />, path: '/settings' }
];

const Sidebar = ({ isOpen, setIsOpen, onCollapseChange }) => {
  const [expandedItems, setExpandedItems] = React.useState({});
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
    // Close all expanded items when collapsing
    if (newCollapsed) {
      setExpandedItems({});
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
                      {item.subItems.map((subItem, subIndex) => (
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
                      ))}
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