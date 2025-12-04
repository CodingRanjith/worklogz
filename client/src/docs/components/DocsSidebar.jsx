import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiChevronDown, FiChevronRight, FiHome, FiLayers, FiUsers,
  FiCalendar, FiBarChart2, FiFileText, FiDollarSign, FiClipboard,
  FiBriefcase, FiHelpCircle, FiSettings, FiCamera, FiTrendingUp,
  FiClock, FiTarget, FiAward, FiMail, FiFolder, FiGrid, FiCode,
  FiZap, FiShield, FiGlobe, FiPackage, FiStar
} from 'react-icons/fi';
import './DocsSidebar.css';

const menuItems = [
  {
    label: 'Introduction',
    path: '/docs',
    icon: <FiHome />
  },
  {
    label: 'Getting Started',
    icon: <FiZap />,
    children: [
      { label: 'Quick Start', path: '/docs/getting-started/quick-start' },
      { label: 'Installation', path: '/docs/getting-started/installation' },
      { label: 'Architecture Overview', path: '/docs/getting-started/architecture' },
      { label: 'Configuration', path: '/docs/getting-started/configuration' },
      { label: 'Migration Guide', path: '/docs/getting-started/migration' }
    ]
  },
  {
    label: 'Components',
    icon: <FiLayers />,
    children: [
      { label: 'Overview', path: '/docs/components/overview' },
      { label: 'Component Showcase', path: '/docs/components/showcase' },
      { label: 'Layout Components', path: '/docs/components/layout' },
      { label: 'Form Components', path: '/docs/components/forms' },
      { label: 'Data Display', path: '/docs/components/data-display' },
      { label: 'Navigation', path: '/docs/components/navigation' },
      { label: 'Feedback', path: '/docs/components/feedback' },
      { label: 'Overlay', path: '/docs/components/overlay' }
    ]
  },
  {
    label: 'Admin Dashboard',
    icon: <FiBarChart2 />,
    children: [
      { label: 'Dashboard Overview', path: '/docs/admin/dashboard' },
      { label: 'Analytics', path: '/docs/admin/analytics' },
      { label: 'User Management', path: '/docs/admin/user-management' },
      { label: 'Attendance', path: '/docs/admin/attendance' },
      { label: 'Task Manager', path: '/docs/admin/task-manager' },
      { label: 'Projects', path: '/docs/admin/projects' },
      { label: 'Company Worklogz', path: '/docs/admin/worklogz' },
      { label: 'Company Departments', path: '/docs/admin/departments' },
      { label: 'CRM', path: '/docs/admin/crm' },
      { label: 'Helpdesk', path: '/docs/admin/helpdesk' },
      { label: 'Payroll', path: '/docs/admin/payroll' },
      { label: 'Documents', path: '/docs/admin/documents' },
      { label: 'Reports', path: '/docs/admin/reports' },
      { label: 'Settings', path: '/docs/admin/settings' }
    ]
  },
  {
    label: 'Employee Features',
    icon: <FiUsers />,
    children: [
      { label: 'Attendance', path: '/docs/employee/attendance' },
      { label: 'Timesheet', path: '/docs/employee/timesheet' },
      { label: 'Leave Management', path: '/docs/employee/leave' },
      { label: 'Performance', path: '/docs/employee/performance' },
      { label: 'Goals & Achievements', path: '/docs/employee/goals' },
      { label: 'My Earnings', path: '/docs/employee/earnings' },
      { label: 'Calendar View', path: '/docs/employee/calendar' },
      { label: 'Skill Development', path: '/docs/employee/skills' },
      { label: 'Community Hub', path: '/docs/employee/community' },
      { label: 'My Workspace', path: '/docs/employee/workspace' }
    ]
  },
  {
    label: 'Guides',
    icon: <FiFileText />,
    children: [
      { label: 'Authentication', path: '/docs/guides/authentication' },
      { label: 'API Integration', path: '/docs/guides/api' },
      { label: 'Theming', path: '/docs/guides/theming' },
      { label: 'State Management', path: '/docs/guides/state' },
      { label: 'Routing', path: '/docs/guides/routing' },
      { label: 'Best Practices', path: '/docs/guides/best-practices' },
      { label: 'Troubleshooting', path: '/docs/guides/troubleshooting' }
    ]
  },
  {
    label: 'API Reference',
    icon: <FiCode />,
    children: [
      { label: 'Endpoints', path: '/docs/api/endpoints' },
      { label: 'Authentication', path: '/docs/api/auth' },
      { label: 'Users', path: '/docs/api/users' },
      { label: 'Attendance', path: '/docs/api/attendance' },
      { label: 'Projects', path: '/docs/api/projects' },
      { label: 'CRM', path: '/docs/api/crm' }
    ]
  }
];

const DocsSidebar = ({ open, currentPath }) => {
  const [expandedItems, setExpandedItems] = useState(['Getting Started', 'Components']);

  const toggleItem = (label) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path) => {
    if (path === '/docs') {
      return currentPath === '/docs';
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className={`docs-sidebar ${open ? 'open' : 'closed'}`}>
      <nav className="docs-sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label} className="docs-sidebar-section">
            {item.path ? (
              <Link
                to={item.path}
                className={`docs-sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <>
                <button
                  className={`docs-sidebar-item docs-sidebar-toggle ${
                    expandedItems.includes(item.label) ? 'expanded' : ''
                  }`}
                  onClick={() => toggleItem(item.label)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {expandedItems.includes(item.label) ? (
                    <FiChevronDown className="docs-chevron" />
                  ) : (
                    <FiChevronRight className="docs-chevron" />
                  )}
                </button>
                {expandedItems.includes(item.label) && item.children && (
                  <div className="docs-sidebar-children">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`docs-sidebar-child ${isActive(child.path) ? 'active' : ''}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default DocsSidebar;

