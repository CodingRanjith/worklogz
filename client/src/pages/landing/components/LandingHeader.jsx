import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown,
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
  FiClipboard
} from 'react-icons/fi';
import './LandingHeader.css';
import worklogzLogo from '../../../assets/worklogz-logo.png';

const LandingHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

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

  // User Modules
  const userModules = [
    { icon: <FiUser />, title: 'User Profile Management', description: 'Complete profile management with personal information, skills, and preferences', route: '/features/user-profile-management' },
    { icon: <FiClock />, title: 'Attendance Management', description: 'Real-time check-in/out with camera verification and location tracking', route: '/features/attendance-management' },
    { icon: <FiUsers />, title: 'Community Management', description: 'Build and manage internal communities for collaboration and engagement', route: '/features/community-management' },
    { icon: <FiCheckSquare />, title: 'Task Manager', description: 'Personal task management with priorities, deadlines, and progress tracking', route: '/features/task-manager' },
    { icon: <FiDollarSign />, title: 'Salary Management', description: 'View salary details, history, and daily earnings tracking', route: '/features/salary-management' },
    { icon: <FiCalendar />, title: 'Leave Management', description: 'Apply, track, and manage leave requests with approval workflows', route: '/features/leave-management' },
    { icon: <FiTrendingUp />, title: 'Performance Management', description: 'Track performance metrics, goals, and achievements', route: '/features/performance-management' },
    { icon: <FiBriefcase />, title: 'Workspace Management', description: 'Manage your workspace, projects, and work assignments', route: '/features/workspace-management' },
    { icon: <FiGrid />, title: 'Application Integration / Management', description: 'Integrate and manage third-party applications and tools', route: '/features/application-integration-management' },
    { icon: <FiUsers />, title: 'People Management', description: 'Connect and interact with colleagues and team members', route: '/features/people-management' },
    { icon: <FiUsers />, title: 'Team Management', description: 'Manage team members, assignments, and collaboration', route: '/features/team-management' },
    { icon: <FiFileText />, title: 'Document Center Management', description: 'Access and manage all your documents in one centralized location', route: '/features/document-center-management' },
    { icon: <FiHelpCircle />, title: 'Helpdesk', description: 'Submit tickets and get support for your queries and issues', route: '/features/helpdesk' },
    { icon: <FiFolder />, title: 'Team Task Management', description: 'Collaborate on team tasks with shared assignments and updates', route: '/features/team-task-management' },
    { icon: <FiBell />, title: 'Notification Management', description: 'Manage and customize all your notifications and alerts', route: '/features/notification-management' },
    { icon: <FiMail />, title: 'Mail Integration', description: 'Integrate email services for seamless communication', route: '/features/mail-integration' },
    { icon: <FiZap />, title: 'AI Copilot', description: 'Get AI-powered assistance for tasks, queries, and productivity', route: '/features/ai-copilot' },
    { icon: <FiClipboard />, title: 'Assessment Management', description: 'Take assessments, view results, and track your skill evaluations and progress', route: '/features/assessment-management' }
  ];

  // Admin Modules
  const adminModules = [
    { icon: <FiBarChart2 />, title: 'Admin Dashboard', description: 'Comprehensive dashboard with key metrics and insights', route: '/features/admin-dashboard' },
    { icon: <FiTrendingUp />, title: 'Analytics Management', description: 'Advanced analytics and data visualization tools', route: '/features/analytics-management' },
    { icon: <FiFile />, title: 'Monthly Reports Management', description: 'Generate and manage monthly reports and summaries', route: '/features/monthly-reports-management' },
    { icon: <FiUsers />, title: 'User Management', description: 'Complete user management with role-based access control', route: '/features/user-management' },
    { icon: <FiFileText />, title: 'User Cards', description: 'View and manage employee cards and profiles', route: '/features/user-cards' },
    { icon: <FiCalendar />, title: 'Employee Schedules', description: 'Manage and track employee schedules and shifts', route: '/features/employee-schedules' },
    { icon: <FiCheckSquare />, title: 'User Pending Approvals', description: 'Review and approve pending user requests and submissions', route: '/features/user-pending-approvals' },
    { icon: <FiUsers />, title: 'Team Management', description: 'Manage teams, departments, and organizational structure', route: '/features/admin-team-management' },
    { icon: <FiCheckSquare />, title: 'Admin Task Management', description: 'Manage and assign tasks across the organization', route: '/features/admin-task-management' },
    { icon: <FiHelpCircle />, title: 'Helpdesk Solver', description: 'Resolve helpdesk tickets and provide support solutions', route: '/features/helpdesk-solver' },
    { icon: <FiBriefcase />, title: 'Company Overall Worklogz Management', description: 'Manage company-wide worklogs and time tracking', route: '/features/company-overall-worklogz-management' },
    { icon: <FiFolder />, title: 'Company Department Management', description: 'Manage departments, teams, and organizational hierarchy', route: '/features/company-department-management' },
    { icon: <FiGrid />, title: 'Project Workspace Management', description: 'Manage project workspaces and assignments', route: '/features/project-workspace-management' },
    { icon: <FiTarget />, title: 'Customized Input / CRM Management', description: 'Manage CRM pipelines for courses, internships, and IT projects', route: '/features/customized-input-crm-management' },
    { icon: <FiUsers />, title: 'HR Management', description: 'Comprehensive HR management and administration', route: '/features/hr-management' },
    { icon: <FiCalendar />, title: 'Leave Management', description: 'Manage employee leave requests and approvals', route: '/features/admin-leave-management' },
    { icon: <FiDollarSign />, title: 'Payroll Management', description: 'Automated payroll processing and salary management', route: '/features/payroll-management' },
    { icon: <FiPackage />, title: 'Plan Management', description: 'Manage subscription plans and billing', route: '/features/plan-management' },
    { icon: <FiUnlock />, title: 'Admin Access Control Management', description: 'Manage access controls and permissions across the system', route: '/features/admin-access-control-management' },
    { icon: <FiFileText />, title: 'Document Management', description: 'Generate and manage offer letters, experience letters, and policy documents', route: '/features/document-management' },
    { icon: <FiSettings />, title: 'Company Settings Management', description: 'Configure company settings and preferences', route: '/features/company-settings-management' },
    { icon: <FiCreditCard />, title: 'Expense Management', description: 'Track and manage company expenses and reimbursements', route: '/features/expense-management' },
    { icon: <FiTrendingUp />, title: 'Performance Management', description: 'Track and manage employee performance metrics', route: '/features/admin-performance-management' },
    { icon: <FiClipboard />, title: 'Assessment Management', description: 'Create, manage, and evaluate assessments for employees with detailed analytics and reporting', route: '/features/admin-assessment-management' }
  ];

  // Close dropdowns when route changes
  useEffect(() => {
    setFeaturesOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <span className="nav-link">
              Features <FiChevronDown className="dropdown-icon" />
            </span>
            {featuresOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div className="dropdown-menu features-dropdown" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
                  {/* User Modules Section */}
                  <div className="dropdown-section">
                    <h3 className="dropdown-section-title">
                      <FiUser className="dropdown-section-icon" />
                      User Modules
                    </h3>
                    <div className="features-grid-container">
                      {userModules.map((feature, index) => {
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
                            <h4 className="feature-card-title">{feature.title}</h4>
                            <p className="feature-card-description">{feature.description}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin Modules Section */}
                  <div className="dropdown-section">
                    <h3 className="dropdown-section-title">
                      <FiShield className="dropdown-section-icon" />
                      Admin Modules
                    </h3>
                    <div className="features-grid-container">
                      {adminModules.map((feature, index) => {
                        const iconStyle = getIconColor((userModules.length + index) % iconColors.length);
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
                            <h4 className="feature-card-title">{feature.title}</h4>
                            <p className="feature-card-description">{feature.description}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <span className="nav-link">
              Solutions <FiChevronDown className="dropdown-icon" />
            </span>
            {solutionsOpen && (
              <div className="dropdown-menu">
                <Link to="/for-business">For Business</Link>
                <Link to="/for-enterprise">For Enterprise</Link>
                <Link to="/for-education">For Education</Link>
                <Link to="/for-individuals">For Individuals</Link>
              </div>
            )}
          </div>

          <Link to="/docs/industries" className="nav-link">Industries</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/docs" className="nav-link">Documentation</Link>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <span className="nav-link">
              Resources <FiChevronDown className="dropdown-icon" />
            </span>
            {resourcesOpen && (
              <div className="dropdown-menu">
                <Link to="/docs/faq">FAQ</Link>
                <Link to="/docs/support">Support</Link>
                <Link to="/docs/roadmap">Roadmap</Link>
              </div>
            )}
          </div>
        </nav>

        <div className="header-right desktop-nav">
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
          <Link to="/docs/faq" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary">Get Started</Link>
        </div>
      )}
      </header>
    </>
  );
};

export default LandingHeader;

