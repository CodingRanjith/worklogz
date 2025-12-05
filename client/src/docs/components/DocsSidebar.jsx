import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiChevronDown, FiChevronRight, FiHome, FiTarget, FiLayers,
  FiBarChart2, FiShield, FiSettings, FiCloud, FiUsers, FiCode,
  FiTrendingUp, FiZap, FiDollarSign, FiCheckCircle, FiGlobe,
  FiAward, FiHelpCircle, FiFileText, FiGift, FiMap, FiMessageCircle,
  FiMail, FiGitBranch
} from 'react-icons/fi';
import './DocsSidebar.css';

const menuItems = [
  {
    label: 'Introduction',
    path: '/docs',
    icon: <FiHome />
  },
  {
    label: 'Core Purpose',
    path: '/docs/core-purpose',
    icon: <FiTarget />
  },
  {
    label: 'Features Overview',
    path: '/docs/features-overview',
    icon: <FiLayers />
  },
  {
    label: 'Detailed Features',
    path: '/docs/detailed-features',
    icon: <FiBarChart2 />
  },
  {
    label: 'Challenges Solved',
    path: '/docs/challenges',
    icon: <FiCheckCircle />
  },
  {
    label: 'Industries',
    path: '/docs/industries',
    icon: <FiGlobe />
  },
  {
    label: 'Technology Stack',
    path: '/docs/technology-stack',
    icon: <FiCode />
  },
  {
    label: 'Deployment',
    icon: <FiCloud />,
    children: [
      { label: 'Deployment Options', path: '/docs/deployment-options' },
      { label: 'Self-Hosted Solution', path: '/docs/self-hosted' },
      { label: 'User Capacity & Scalability', path: '/docs/scalability' }
    ]
  },
  {
    label: 'Access & Customization',
    icon: <FiUsers />,
    children: [
      { label: 'Role-Based Access', path: '/docs/role-based-access' },
      { label: 'Customization Options', path: '/docs/customization' },
      { label: 'White-Labeling Process', path: '/docs/white-labeling' }
    ]
  },
  {
    label: 'Business',
    icon: <FiDollarSign />,
    children: [
      { label: 'Pricing Plans', path: '/docs/pricing' },
      { label: 'Data Security', path: '/docs/security' },
      { label: 'Integration Capabilities', path: '/docs/integrations' }
    ]
  },
  {
    label: 'Operations',
    icon: <FiZap />,
    children: [
      { label: 'Performance & Reliability', path: '/docs/performance' },
      { label: 'User Onboarding', path: '/docs/onboarding' },
      { label: 'Support & Maintenance', path: '/docs/support' }
    ]
  },
  {
    label: 'Resources',
    icon: <FiFileText />,
    children: [
      { label: 'Software Comparison', path: '/docs/comparison' },
      { label: 'Testimonials & Cases', path: '/docs/testimonials' },
      { label: 'Roadmap & Future', path: '/docs/roadmap' },
      { label: 'FAQ Section', path: '/docs/faq' }
    ]
  },
  {
    label: 'Legal & Contact',
    icon: <FiMail />,
    children: [
      { label: 'Legal & Licensing', path: '/docs/legal' },
      { label: 'Contact & Sales', path: '/docs/contact' }
    ]
  }
];

const DocsSidebar = ({ open, currentPath }) => {
  const [expandedItems, setExpandedItems] = useState(['Deployment', 'Access & Customization']);

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
