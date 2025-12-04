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
      { label: 'Quick Start', path: '/docs/getting-started/quick-start' }
    ]
  },
  {
    label: 'Features',
    icon: <FiUsers />,
    children: [
      { label: 'Attendance', path: '/docs/employee/attendance' },
      { label: 'Timesheet', path: '/docs/employee/timesheet' },
      { label: 'Leave Management', path: '/docs/employee/leave' },
      { label: 'Performance Dashboard', path: '/docs/employee/performance' },
      { label: 'Goals & Achievements', path: '/docs/employee/goals' },
      { label: 'My Earnings', path: '/docs/employee/earnings' },
      { label: 'Calendar View', path: '/docs/employee/calendar' },
      { label: 'Skill Development', path: '/docs/employee/skills' },
      { label: 'Community Hub', path: '/docs/employee/community' },
      { label: 'My Workspace', path: '/docs/employee/workspace' }
    ]
  },
  {
    label: 'Component Showcase',
    icon: <FiLayers />,
    path: '/docs/components/showcase'
  }
];

const DocsSidebar = ({ open, currentPath }) => {
  const [expandedItems, setExpandedItems] = useState(['Getting Started', 'Features']);

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

