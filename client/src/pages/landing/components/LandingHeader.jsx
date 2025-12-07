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
  FiTarget
} from 'react-icons/fi';
import './LandingHeader.css';

const LandingHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

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
          <Link to="/home" className="logo">
            <div className="logo-icon">W</div>
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
                <div className="features-columns">
                  {/* User Modules */}
                  <div className="features-column">
                    <h3 className="features-column-title">
                      User Modules
                    </h3>
                    <div className="features-list">
                      <Link 
                        to="/features/user-profile-management" 
                        className={`feature-item ${location.pathname === '/features/user-profile-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUser className="feature-icon" />
                        <span>User Profile Management</span>
                      </Link>
                      <Link 
                        to="/features/attendance-management" 
                        className={`feature-item ${location.pathname === '/features/attendance-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiClock className="feature-icon" />
                        <span>Attendance Management</span>
                      </Link>
                      <Link 
                        to="/features/community-management" 
                        className={`feature-item ${location.pathname === '/features/community-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>Community Management</span>
                      </Link>
                      <Link 
                        to="/features/task-manager" 
                        className={`feature-item ${location.pathname === '/features/task-manager' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCheckSquare className="feature-icon" />
                        <span>Task Manager</span>
                      </Link>
                      <Link 
                        to="/features/salary-management" 
                        className={`feature-item ${location.pathname === '/features/salary-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiDollarSign className="feature-icon" />
                        <span>Salary Management</span>
                      </Link>
                      <Link 
                        to="/features/leave-management" 
                        className={`feature-item ${location.pathname === '/features/leave-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCalendar className="feature-icon" />
                        <span>Leave Management</span>
                      </Link>
                      <Link 
                        to="/features/performance-management" 
                        className={`feature-item ${location.pathname === '/features/performance-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiTrendingUp className="feature-icon" />
                        <span>Performance Management</span>
                      </Link>
                      <Link 
                        to="/features/workspace-management" 
                        className={`feature-item ${location.pathname === '/features/workspace-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiBriefcase className="feature-icon" />
                        <span>Workspace Management</span>
                      </Link>
                      <Link 
                        to="/features/application-integration-management" 
                        className={`feature-item ${location.pathname === '/features/application-integration-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiGrid className="feature-icon" />
                        <span>Application Integration</span>
                      </Link>
                      <Link 
                        to="/features/people-management" 
                        className={`feature-item ${location.pathname === '/features/people-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>People Management</span>
                      </Link>
                      <Link 
                        to="/features/team-management" 
                        className={`feature-item ${location.pathname === '/features/team-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>Team Management</span>
                      </Link>
                      <Link 
                        to="/features/document-center-management" 
                        className={`feature-item ${location.pathname === '/features/document-center-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFileText className="feature-icon" />
                        <span>Document Center Management</span>
                      </Link>
                      <Link 
                        to="/features/helpdesk" 
                        className={`feature-item ${location.pathname === '/features/helpdesk' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiHelpCircle className="feature-icon" />
                        <span>Helpdesk</span>
                      </Link>
                      <Link 
                        to="/features/team-task-management" 
                        className={`feature-item ${location.pathname === '/features/team-task-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFolder className="feature-icon" />
                        <span>Team Task Management</span>
                      </Link>
                      <Link 
                        to="/features/notification-management" 
                        className={`feature-item ${location.pathname === '/features/notification-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiBell className="feature-icon" />
                        <span>Notification Management</span>
                      </Link>
                      <Link 
                        to="/features/mail-integration" 
                        className={`feature-item ${location.pathname === '/features/mail-integration' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiMail className="feature-icon" />
                        <span>Mail Integration</span>
                      </Link>
                      <Link 
                        to="/features/ai-copilot" 
                        className={`feature-item ${location.pathname === '/features/ai-copilot' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiZap className="feature-icon" />
                        <span>AI Copilot</span>
                      </Link>
                    </div>
                  </div>

                  {/* Admin Modules */}
                  <div className="features-column">
                    <h3 className="features-column-title">
                      Admin Modules
                    </h3>
                    <div className="features-list">
                      <Link 
                        to="/features/admin-dashboard" 
                        className={`feature-item ${location.pathname === '/features/admin-dashboard' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiBarChart2 className="feature-icon" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link 
                        to="/features/analytics-management" 
                        className={`feature-item ${location.pathname === '/features/analytics-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiTrendingUp className="feature-icon" />
                        <span>Analytics Management</span>
                      </Link>
                      <Link 
                        to="/features/monthly-reports-management" 
                        className={`feature-item ${location.pathname === '/features/monthly-reports-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFile className="feature-icon" />
                        <span>Monthly Reports Management</span>
                      </Link>
                      <Link 
                        to="/features/user-management" 
                        className={`feature-item ${location.pathname === '/features/user-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>User Management</span>
                      </Link>
                      <Link 
                        to="/features/user-cards" 
                        className={`feature-item ${location.pathname === '/features/user-cards' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFileText className="feature-icon" />
                        <span>User Cards</span>
                      </Link>
                      <Link 
                        to="/features/employee-schedules" 
                        className={`feature-item ${location.pathname === '/features/employee-schedules' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCalendar className="feature-icon" />
                        <span>Employee Schedules</span>
                      </Link>
                      <Link 
                        to="/features/user-pending-approvals" 
                        className={`feature-item ${location.pathname === '/features/user-pending-approvals' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCheckSquare className="feature-icon" />
                        <span>User Pending Approvals</span>
                      </Link>
                      <Link 
                        to="/features/admin-team-management" 
                        className={`feature-item ${location.pathname === '/features/admin-team-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>Team Management</span>
                      </Link>
                      <Link 
                        to="/features/admin-task-management" 
                        className={`feature-item ${location.pathname === '/features/admin-task-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCheckSquare className="feature-icon" />
                        <span>Admin Task Management</span>
                      </Link>
                      <Link 
                        to="/features/helpdesk-solver" 
                        className={`feature-item ${location.pathname === '/features/helpdesk-solver' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiHelpCircle className="feature-icon" />
                        <span>Helpdesk Solver</span>
                      </Link>
                      <Link 
                        to="/features/company-overall-worklogz-management" 
                        className={`feature-item ${location.pathname === '/features/company-overall-worklogz-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiBriefcase className="feature-icon" />
                        <span>Company Overall Worklogz Management</span>
                      </Link>
                      <Link 
                        to="/features/company-department-management" 
                        className={`feature-item ${location.pathname === '/features/company-department-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFolder className="feature-icon" />
                        <span>Company Department Management</span>
                      </Link>
                      <Link 
                        to="/features/project-workspace-management" 
                        className={`feature-item ${location.pathname === '/features/project-workspace-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiGrid className="feature-icon" />
                        <span>Project Workspace Management</span>
                      </Link>
                      <Link 
                        to="/features/customized-input-crm-management" 
                        className={`feature-item ${location.pathname === '/features/customized-input-crm-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiTarget className="feature-icon" />
                        <span>Customized Input / CRM Management</span>
                      </Link>
                      <Link 
                        to="/features/hr-management" 
                        className={`feature-item ${location.pathname === '/features/hr-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUsers className="feature-icon" />
                        <span>HR Management</span>
                      </Link>
                      <Link 
                        to="/features/admin-leave-management" 
                        className={`feature-item ${location.pathname === '/features/admin-leave-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCalendar className="feature-icon" />
                        <span>Leave Management</span>
                      </Link>
                      <Link 
                        to="/features/payroll-management" 
                        className={`feature-item ${location.pathname === '/features/payroll-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiDollar className="feature-icon" />
                        <span>Payroll Management</span>
                      </Link>
                      <Link 
                        to="/features/plan-management" 
                        className={`feature-item ${location.pathname === '/features/plan-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiPackage className="feature-icon" />
                        <span>Plan Management</span>
                      </Link>
                      <Link 
                        to="/features/admin-access-control-management" 
                        className={`feature-item ${location.pathname === '/features/admin-access-control-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiUnlock className="feature-icon" />
                        <span>Admin Access Control Management</span>
                      </Link>
                      <Link 
                        to="/features/document-management" 
                        className={`feature-item ${location.pathname === '/features/document-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiFileText className="feature-icon" />
                        <span>Document Management</span>
                      </Link>
                      <Link 
                        to="/features/company-settings-management" 
                        className={`feature-item ${location.pathname === '/features/company-settings-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiSettings className="feature-icon" />
                        <span>Company Settings Management</span>
                      </Link>
                      <Link 
                        to="/features/expense-management" 
                        className={`feature-item ${location.pathname === '/features/expense-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiCreditCard className="feature-icon" />
                        <span>Expense Management</span>
                      </Link>
                      <Link 
                        to="/features/admin-performance-management" 
                        className={`feature-item ${location.pathname === '/features/admin-performance-management' ? 'active' : ''}`}
                        onClick={() => setFeaturesOpen(false)}
                      >
                        <FiTrendingUp className="feature-icon" />
                        <span>Performance Management</span>
                      </Link>
                    </div>
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

