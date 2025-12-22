import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiHome,
  FiUser,
  FiClock,
  FiUsers,
  FiCheckSquare,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiBriefcase,
  FiGrid,
  FiFolder,
  FiHelpCircle,
  FiFileText,
  FiBell,
  FiMail,
  FiZap,
  FiBarChart2,
  FiFile,
  FiShield,
  FiSettings,
  FiCreditCard,
  FiLayers,
  FiUnlock,
  FiPackage,
  FiDollarSign as FiDollar,
  FiTarget,
  FiClipboard,
  FiSearch,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiMessageCircle,
  FiActivity,
  FiCode
} from 'react-icons/fi';
import './LandingHeader.css';
import worklogzLogo from '../../../assets/worklogz-logo.png';
import DemoRequestForm from '../../../components/DemoRequestForm';
import { API_ENDPOINTS } from '../../../utils/api';
import { normalizeMenuOrder } from '../../../utils/sidebarMenu';

// Icon map for resolving icon strings to components
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
  FiCheckSquare,
  FiBell,
  FiMail,
  FiHelpCircle,
  FiCreditCard,
  FiUnlock,
  FiPackage,
  FiClipboard,
  FiTrendingUp,
  FiGrid,
  FiFile,
};

// Helper to extract icon name from JSX element or string
const extractIconName = (icon) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    // Extract component name from JSX element
    const componentName = icon.type?.displayName || icon.type?.name || icon.type;
    if (typeof componentName === 'string') {
      return componentName;
    }
    return null;
  }
  if (typeof icon === 'string') {
    return icon;
  }
  return null;
};

// Helper to get icon component from string or JSX
const getIconComponent = (iconInput) => {
  if (!iconInput) return <FiGrid />;
  
  // If it's already a React element, return it
  if (React.isValidElement(iconInput)) {
    return iconInput;
  }
  
  // If it's a string, look it up in the icon map
  if (typeof iconInput === 'string') {
    const IconComp = ICON_MAP[iconInput];
    if (IconComp) {
      return <IconComp />;
    }
  }
  
  // Default fallback
  return <FiGrid />;
};

// Map sidebar paths to feature routes
const pathToFeatureRoute = (path) => {
  if (!path || path === '#' || path === '/') return null;
  
  // Remove leading slash and convert to feature route format
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Handle special cases
  const routeMap = {
    'home': '/features/user-profile-management',
    'attendance': '/features/attendance-management',
    'dashboard': '/features/user-profile-management',
    'employee/people': '/features/people-management',
    'team-management': '/features/team-management',
    'employee/applications': '/features/application-integration-management',
    'timesheet': '/features/task-manager',
    'task-manager': '/features/admin-task-management',
    'apply-leave': '/features/leave-management',
    'leave-requests': '/features/leave-management',
    'my-earnings': '/features/salary-management',
    'salaryhistory': '/features/salary-management',
    'employee/community': '/features/community-management',
    'employee/workspace': '/features/workspace-management',
    'employee/assessments': '/features/assessment-management',
    'documents': '/features/document-center-management',
    'analytics': '/features/analytics-management',
    'reports': '/features/monthly-reports-management',
    'all-users': '/features/user-management',
    'employees': '/features/employee-schedules',
    'pending-users': '/features/user-pending-approvals',
    'crm': '/features/customized-input-crm-management',
    'projects': '/features/project-workspace-management',
    'company-worklogz': '/features/company-overall-worklogz-management',
    'company-departments': '/features/company-department-management',
    'helpdesk': '/features/helpdesk',
    'settings': '/features/company-settings-management',
    'plans': '/features/plan-management',
    'fee-payments': '/features/expense-management',
    'performance': '/features/performance-management',
  };
  
  // Check exact match first
  if (routeMap[cleanPath]) return routeMap[cleanPath];
  
  // Check if path contains any key
  for (const [key, route] of Object.entries(routeMap)) {
    if (cleanPath.includes(key)) return route;
  }
  
  // Default: convert to feature route format
  return `/features/${cleanPath.replace(/\//g, '-').replace(/^employee-/, '')}`;
};

// Transform sidebar menu items to category structure
const transformSidebarToCategories = (menuItems) => {
  const categories = [];
  
  menuItems.forEach((item) => {
    // Extract icon name from JSX or string
    const itemIconName = extractIconName(item.icon);
    const itemIcon = getIconComponent(itemIconName || 'FiGrid');
    
    if (item.subItems && item.subItems.length > 0) {
      // This is a category with sub-items
      const modules = item.subItems
        .filter(sub => !sub.isSection && sub.path && sub.path !== '#')
        .map(sub => {
          const subIconName = extractIconName(sub.icon) || itemIconName;
          return {
            icon: getIconComponent(subIconName || 'FiGrid'),
            title: sub.label,
            description: `${sub.label} - Manage and access ${sub.label.toLowerCase()} features`,
            route: pathToFeatureRoute(sub.path) || `/features/${sub.label.toLowerCase().replace(/\s+/g, '-')}`,
          };
        });
      
      if (modules.length > 0) {
        categories.push({
          id: item.label.toLowerCase().replace(/\s+/g, '-'),
          name: item.label,
          icon: itemIcon,
          modules,
        });
      }
    } else if (item.path && item.path !== '#') {
      // This is a standalone module
      categories.push({
        id: item.label.toLowerCase().replace(/\s+/g, '-'),
        name: item.label,
        icon: itemIcon,
        modules: [{
          icon: itemIcon,
          title: item.label,
          description: `${item.label} - Manage and access ${item.label.toLowerCase()} features`,
          route: pathToFeatureRoute(item.path) || `/features/${item.label.toLowerCase().replace(/\s+/g, '-')}`,
        }],
      });
    }
  });
  
  return categories;
};

const LandingHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [demoFormOpen, setDemoFormOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  
  // Dynamic module categories - combined
  const [allModuleCategories, setAllModuleCategories] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Icon colors array for variety
  const iconColors = [
    { bg: '#E3F2FD', color: '#1976D2' }, // Light blue
    { bg: '#E8F5E9', color: '#388E3C' }, // Light green
    { bg: '#FCE4EC', color: '#C2185B' }, // Pink
    { bg: '#FFF3E0', color: '#F57C00' }, // Orange
    { bg: '#F3E5F5', color: '#7B1FA2' }, // Light purple
    { bg: '#EFEBE9', color: '#5D4037' }, // Brown/beige
    { bg: '#FFF9C4', color: '#F9A825' }, // Yellow
    { bg: '#E1F5FE', color: '#0277BD' }, // Light blue 2
  ];

  const getIconColor = (index) => {
    return iconColors[index % iconColors.length];
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMenuEnter = (menu) => {
    clearCloseTimeout();
    if (menu === 'features') setFeaturesOpen(true);
    if (menu === 'solutions') setSolutionsOpen(true);
    if (menu === 'resources') setResourcesOpen(true);
  };

  const handleMenuLeave = (menu) => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      if (menu === 'features') setFeaturesOpen(false);
      if (menu === 'solutions') setSolutionsOpen(false);
      if (menu === 'resources') setResourcesOpen(false);
    }, 150);
  };

  // Load sidebar modules dynamically - always use fallback for public landing page
  useEffect(() => {
    const loadSidebarModules = async () => {
      setIsLoadingModules(true);

      try {
        // Try to load employee sidebar from API (public access)
        let employeeItems = [];
        try {
          const employeeRes = await axios.get(API_ENDPOINTS.getSidebarMenu('employee'), {
            headers: {}, // No auth needed for public landing page
          });
          employeeItems = employeeRes.data?.items || [];
        } catch (apiErr) {
          console.log('Failed to load employee sidebar menu (public access)', apiErr);
        }
        
        const normalizedEmployee = normalizeMenuOrder(employeeItems);
        const userCategories = transformSidebarToCategories(normalizedEmployee);
        
        // Try to load admin sidebar from API (public access)
        let adminItems = [];
        try {
          const adminRes = await axios.get(API_ENDPOINTS.getSidebarMenu('admin'), {
            headers: {},
          });
          adminItems = adminRes.data?.items || [];
        } catch (apiErr) {
          console.log('Failed to load admin sidebar menu (public access)', apiErr);
        }
        
        // Transform admin categories
        let adminCategories = [];
        if (adminItems.length) {
          const normalizedAdmin = normalizeMenuOrder(adminItems);
          adminCategories = transformSidebarToCategories(normalizedAdmin);
        }
        
        // Combine all categories into one unified list
        const allCategories = [...userCategories, ...adminCategories];
        setAllModuleCategories(allCategories);
      } catch (err) {
        console.error('Failed to load sidebar modules', err);
        setAllModuleCategories([]);
      } finally {
        setIsLoadingModules(false);
      }
    };
    
    loadSidebarModules();
  }, []);
  
  // Initialize selected category when data loads
  useEffect(() => {
    if (allModuleCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(allModuleCategories[0].id);
    }
  }, [allModuleCategories, selectedCategory]);

  // Filter modules based on search query
  const filterModules = (modules, query) => {
    if (!query) return modules;
    const lowerQuery = query.toLowerCase();
    return modules.filter(module => 
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Get all modules from all categories
  const getAllModules = () => {
    return allModuleCategories.flatMap(cat => cat.modules || []);
  };

  // Close dropdowns when route changes
  useEffect(() => {
    setFeaturesOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!featuresOpen) {
      setSearchQuery('');
      setShowAllModules(false);
    }
  }, [featuresOpen]);

  return (
    <>
      {featuresOpen && (
        <div 
          className="dropdown-backdrop"
          onClick={() => setFeaturesOpen(false)}
          onMouseEnter={() => setFeaturesOpen(false)}
        />
      )}
      <header className="landing-header">
        <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={worklogzLogo} alt="Worklogz logo" className="logo-image" />
            <span className="logo-text">Worklogz</span>
          </Link>
        </div>

        <nav className="header-nav desktop-nav">
          <div 
            className="nav-item dropdown features-dropdown-wrapper"
            onMouseEnter={() => handleMenuEnter('features')}
            onMouseLeave={() => handleMenuLeave('features')}
          >
            <span className="nav-link">
              Features <FiChevronDown className="dropdown-icon" />
            </span>
            {featuresOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu features-dropdown zoho-style-dropdown" 
                  onMouseEnter={() => handleMenuEnter('features')} 
                  onMouseLeave={() => handleMenuLeave('features')}
                >
                  <div className="zoho-dropdown-container">
                    {isLoadingModules ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Loading modules...
                      </div>
                    ) : (
                      <>
                        {/* Search Bar */}
                        <div className="zoho-search-container">
                          <div className="zoho-search-wrapper">
                            <FiSearch className="zoho-search-icon" />
                            <input
                              type="text"
                              placeholder="I'm looking for..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="zoho-search-input"
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery('')}
                                className="zoho-search-clear"
                                aria-label="Clear search"
                              >
                                <FiX size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* All Modules Section - Unified */}
                        {allModuleCategories.length > 0 && (
                          <div className="zoho-module-section">
                            <div className="zoho-section-header">
                              <div className="zoho-section-header-left">
                                <FiGrid className="zoho-section-header-icon" />
                                <h3 className="zoho-section-title">All Modules</h3>
                              </div>
                              <button
                                onClick={() => setShowAllModules(!showAllModules)}
                                className="zoho-show-all-btn"
                              >
                                {showAllModules ? 'Show by Category' : 'Show All Modules'}
                              </button>
                            </div>
                            {showAllModules ? (
                              <div className="zoho-content-panel">
                                <div className="features-grid-container">
                                  {filterModules(getAllModules(), searchQuery).map((feature, index) => {
                                    const iconStyle = getIconColor(index);
                                    return (
                                      <Link 
                                        key={index}
                                        to={feature.route} 
                                        className={`feature-card ${location.pathname === feature.route ? 'active' : ''}`}
                                        onClick={() => setFeaturesOpen(false)}
                                      >
                                        <div className="feature-card-icon" style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}>
                                          {feature.icon}
                                        </div>
                                        <div className="feature-card-content">
                                          <h4 className="feature-card-title">{feature.title}</h4>
                                          <p className="feature-card-description">{feature.description}</p>
                                          <span className="feature-card-cta">View module →</span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                  {filterModules(getAllModules(), searchQuery).length === 0 && (
                                    <div style={{ padding: '20px', color: '#6b7280', gridColumn: '1 / -1' }}>
                                      {searchQuery ? `No modules found matching "${searchQuery}"` : 'No modules available'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="zoho-sidebar-layout">
                                <div className="zoho-sidebar">
                                  {allModuleCategories.map((category) => (
                                    <button
                                      key={category.id}
                                      className={`zoho-sidebar-item ${selectedCategory === category.id ? 'active' : ''}`}
                                      onClick={() => setSelectedCategory(category.id)}
                                    >
                                      <span className="zoho-sidebar-icon">{category.icon}</span>
                                      <span className="zoho-sidebar-label">{category.name}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="zoho-content-panel">
                                  <div className="features-grid-container">
                                    {filterModules(
                                      allModuleCategories.find(cat => cat.id === selectedCategory)?.modules || [],
                                      searchQuery
                                    ).map((feature, index) => {
                                      const iconStyle = getIconColor(index);
                                      return (
                                        <Link 
                                          key={index}
                                          to={feature.route} 
                                          className={`feature-card ${location.pathname === feature.route ? 'active' : ''}`}
                                          onClick={() => setFeaturesOpen(false)}
                                        >
                                          <div className="feature-card-icon" style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}>
                                            {feature.icon}
                                          </div>
                                          <div className="feature-card-content">
                                            <h4 className="feature-card-title">{feature.title}</h4>
                                            <p className="feature-card-description">{feature.description}</p>
                                            <span className="feature-card-cta">View module →</span>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                    {filterModules(
                                      allModuleCategories.find(cat => cat.id === selectedCategory)?.modules || [],
                                      searchQuery
                                    ).length === 0 && (
                                      <div style={{ padding: '20px', color: '#6b7280', gridColumn: '1 / -1' }}>
                                        {searchQuery ? `No modules found matching "${searchQuery}"` : 'No modules available'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMenuEnter('solutions')}
            onMouseLeave={() => handleMenuLeave('solutions')}
          >
            <span className="nav-link">
              Solutions <FiChevronDown className="dropdown-icon" />
            </span>
            {solutionsOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleMenuEnter('solutions')}
                  onMouseLeave={() => handleMenuLeave('solutions')}
                >
                  <Link to="/for-business">For Business</Link>
                  <Link to="/for-enterprise">For Enterprise</Link>
                  <Link to="/for-education">For Education</Link>
                  <Link to="/for-individuals">For Individuals</Link>
                </div>
              </>
            )}
          </div>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/docs" className="nav-link">Documentation</Link>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMenuEnter('resources')}
            onMouseLeave={() => handleMenuLeave('resources')}
          >
            <span className="nav-link">
              Resources <FiChevronDown className="dropdown-icon" />
            </span>
            {resourcesOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleMenuEnter('resources')}
                  onMouseLeave={() => handleMenuLeave('resources')}
                >
                  <Link to="/product-overview">Product Overview</Link>
                  <Link to="/product-configurator">Product PDF Configurator</Link>
    
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="header-right desktop-nav">
          <button onClick={() => setDemoFormOpen(true)} className="btn-secondary" style={{ marginRight: '12px', cursor: 'pointer' }}>Request Demo</button>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-features-section">
            <h3 className="mobile-section-title">
              <FiUser className="mobile-icon" />
              User Modules
            </h3>
            <Link to="/docs/detailed-features#user-profile" onClick={() => setMobileMenuOpen(false)}>User Profile Management</Link>
            <Link to="/docs/detailed-features#attendance" onClick={() => setMobileMenuOpen(false)}>Attendance Management</Link>
            <Link to="/docs/detailed-features#community" onClick={() => setMobileMenuOpen(false)}>Community Management</Link>
            <Link to="/docs/detailed-features#task-manager" onClick={() => setMobileMenuOpen(false)}>Task Manager</Link>
            <Link to="/docs/detailed-features#salary" onClick={() => setMobileMenuOpen(false)}>Salary Management</Link>
            <Link to="/docs/detailed-features#leave" onClick={() => setMobileMenuOpen(false)}>Leave Management</Link>
            <Link to="/docs/detailed-features#performance" onClick={() => setMobileMenuOpen(false)}>Performance Management</Link>
            <Link to="/docs/detailed-features#workspace" onClick={() => setMobileMenuOpen(false)}>Workspace Management</Link>
            <Link to="/docs/detailed-features#applications" onClick={() => setMobileMenuOpen(false)}>Application Integration</Link>
            <Link to="/docs/detailed-features#people" onClick={() => setMobileMenuOpen(false)}>People Management</Link>
            <Link to="/docs/detailed-features#team" onClick={() => setMobileMenuOpen(false)}>Team Management</Link>
            <Link to="/docs/detailed-features#documents" onClick={() => setMobileMenuOpen(false)}>Document Center Management</Link>
            <Link to="/docs/detailed-features#helpdesk" onClick={() => setMobileMenuOpen(false)}>Helpdesk</Link>
            <Link to="/docs/detailed-features#team-tasks" onClick={() => setMobileMenuOpen(false)}>Team Task Management</Link>
            <Link to="/docs/detailed-features#notifications" onClick={() => setMobileMenuOpen(false)}>Notification Management</Link>
            <Link to="/docs/detailed-features#mail" onClick={() => setMobileMenuOpen(false)}>Mail Integration</Link>
            <Link to="/docs/detailed-features#ai-copilot" onClick={() => setMobileMenuOpen(false)}>AI Copilot</Link>
          </div>
          
          <div className="mobile-features-section">
            <h3 className="mobile-section-title">
              <FiShield className="mobile-icon" />
              Admin Modules
            </h3>
            <Link to="/features/admin-dashboard" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
            <Link to="/features/analytics-management" onClick={() => setMobileMenuOpen(false)}>Analytics Management</Link>
            <Link to="/features/monthly-reports-management" onClick={() => setMobileMenuOpen(false)}>Monthly Reports Management</Link>
            <Link to="/features/user-management" onClick={() => setMobileMenuOpen(false)}>User Management</Link>
            <Link to="/features/user-cards" onClick={() => setMobileMenuOpen(false)}>User Cards</Link>
            <Link to="/features/employee-schedules" onClick={() => setMobileMenuOpen(false)}>Employee Schedules</Link>
            <Link to="/features/user-pending-approvals" onClick={() => setMobileMenuOpen(false)}>User Pending Approvals</Link>
            <Link to="/features/admin-team-management" onClick={() => setMobileMenuOpen(false)}>Team Management</Link>
            <Link to="/features/admin-task-management" onClick={() => setMobileMenuOpen(false)}>Admin Task Management</Link>
            <Link to="/features/helpdesk-solver" onClick={() => setMobileMenuOpen(false)}>Helpdesk Solver</Link>
            <Link to="/features/company-overall-worklogz-management" onClick={() => setMobileMenuOpen(false)}>Company Overall Worklogz Management</Link>
            <Link to="/features/company-department-management" onClick={() => setMobileMenuOpen(false)}>Company Department Management</Link>
            <Link to="/features/project-workspace-management" onClick={() => setMobileMenuOpen(false)}>Project Workspace Management</Link>
            <Link to="/features/customized-input-crm-management" onClick={() => setMobileMenuOpen(false)}>Customized Input / CRM Management</Link>
            <Link to="/features/hr-management" onClick={() => setMobileMenuOpen(false)}>HR Management</Link>
            <Link to="/features/admin-leave-management" onClick={() => setMobileMenuOpen(false)}>Leave Management</Link>
            <Link to="/features/payroll-management" onClick={() => setMobileMenuOpen(false)}>Payroll Management</Link>
            <Link to="/features/plan-management" onClick={() => setMobileMenuOpen(false)}>Plan Management</Link>
            <Link to="/features/admin-access-control-management" onClick={() => setMobileMenuOpen(false)}>Admin Access Control Management</Link>
            <Link to="/features/document-management" onClick={() => setMobileMenuOpen(false)}>Document Management</Link>
            <Link to="/features/company-settings-management" onClick={() => setMobileMenuOpen(false)}>Company Settings Management</Link>
            <Link to="/features/expense-management" onClick={() => setMobileMenuOpen(false)}>Expense Management</Link>
            <Link to="/features/admin-performance-management" onClick={() => setMobileMenuOpen(false)}>Performance Management</Link>
          </div>

          <Link to="/for-business" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
          <Link to="/docs/industries" onClick={() => setMobileMenuOpen(false)}>Industries</Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>Documentation</Link>
          <Link to="/product-overview" onClick={() => setMobileMenuOpen(false)}>Product Overview</Link>
          <Link to="/product-configurator" onClick={() => setMobileMenuOpen(false)}>Product PDF Configurator</Link>
          <Link to="/docs/faq" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          <button onClick={() => { setMobileMenuOpen(false); setDemoFormOpen(true); }} className="btn-secondary" style={{ width: '100%', marginBottom: '12px' }}>Request Demo</button>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary">Get Started</Link>
        </div>
      )}
      
      <DemoRequestForm isOpen={demoFormOpen} onClose={() => setDemoFormOpen(false)} />
      </header>
    </>
  );
};

export default LandingHeader;

