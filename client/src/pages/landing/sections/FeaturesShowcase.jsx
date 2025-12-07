import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, FiCalendar, FiDollarSign, FiBarChart2, 
  FiUsers, FiBriefcase, FiFileText, FiShield, FiUser,
  FiCheckSquare, FiTrendingUp, FiGrid, FiFolder, FiHelpCircle,
  FiBell, FiMail, FiZap, FiSettings, FiCreditCard, FiUnlock,
  FiPackage, FiTarget, FiFile, FiClipboard
} from 'react-icons/fi';
import './FeaturesShowcase.css';

const FeaturesShowcase = () => {
  const userModules = [
    {
      icon: <FiUser />,
      title: 'User Profile Management',
      description: 'Complete profile management with personal information, skills, and preferences',
      route: '/features/user-profile-management'
    },
    {
      icon: <FiClock />,
      title: 'Attendance Management',
      description: 'Real-time check-in/out with camera verification and location tracking',
      route: '/features/attendance-management'
    },
    {
      icon: <FiUsers />,
      title: 'Community Management',
      description: 'Build and manage internal communities for collaboration and engagement',
      route: '/features/community-management'
    },
    {
      icon: <FiCheckSquare />,
      title: 'Task Manager',
      description: 'Personal task management with priorities, deadlines, and progress tracking',
      route: '/features/task-manager'
    },
    {
      icon: <FiDollarSign />,
      title: 'Salary Management',
      description: 'View salary details, history, and daily earnings tracking',
      route: '/features/salary-management'
    },
    {
      icon: <FiCalendar />,
      title: 'Leave Management',
      description: 'Apply, track, and manage leave requests with approval workflows',
      route: '/features/leave-management'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Performance Management',
      description: 'Track performance metrics, goals, and achievements',
      route: '/features/performance-management'
    },
    {
      icon: <FiBriefcase />,
      title: 'Workspace Management',
      description: 'Manage your workspace, projects, and work assignments',
      route: '/features/workspace-management'
    },
    {
      icon: <FiGrid />,
      title: 'Application Integration / Management',
      description: 'Integrate and manage third-party applications and tools',
      route: '/features/application-integration-management'
    },
    {
      icon: <FiUsers />,
      title: 'People Management',
      description: 'Connect and interact with colleagues and team members',
      route: '/features/people-management'
    },
    {
      icon: <FiUsers />,
      title: 'Team Management',
      description: 'Manage team members, assignments, and collaboration',
      route: '/features/team-management'
    },
    {
      icon: <FiFileText />,
      title: 'Document Center Management',
      description: 'Access and manage all your documents in one centralized location',
      route: '/features/document-center-management'
    },
    {
      icon: <FiHelpCircle />,
      title: 'Helpdesk',
      description: 'Submit tickets and get support for your queries and issues',
      route: '/features/helpdesk'
    },
    {
      icon: <FiFolder />,
      title: 'Team Task Management',
      description: 'Collaborate on team tasks with shared assignments and updates',
      route: '/features/team-task-management'
    },
    {
      icon: <FiBell />,
      title: 'Notification Management',
      description: 'Manage and customize all your notifications and alerts',
      route: '/features/notification-management'
    },
    {
      icon: <FiMail />,
      title: 'Mail Integration',
      description: 'Integrate email services for seamless communication',
      route: '/features/mail-integration'
    },
    {
      icon: <FiZap />,
      title: 'AI Copilot',
      description: 'Get AI-powered assistance for tasks, queries, and productivity',
      route: '/features/ai-copilot'
    },
    {
      icon: <FiClipboard />,
      title: 'Assessment Management',
      description: 'Take assessments, view results, and track your skill evaluations and progress',
      route: '/features/assessment-management'
    }
  ];

  const adminModules = [
    {
      icon: <FiBarChart2 />,
      title: 'Admin Dashboard',
      description: 'Comprehensive dashboard with key metrics and insights',
      route: '/features/admin-dashboard'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Analytics Management',
      description: 'Advanced analytics and data visualization tools',
      route: '/features/analytics-management'
    },
    {
      icon: <FiFile />,
      title: 'Monthly Reports Management',
      description: 'Generate and manage monthly reports and summaries',
      route: '/features/monthly-reports-management'
    },
    {
      icon: <FiUsers />,
      title: 'User Management',
      description: 'Complete user management with role-based access control',
      route: '/features/user-management'
    },
    {
      icon: <FiFileText />,
      title: 'User Cards',
      description: 'View and manage employee cards and profiles',
      route: '/features/user-cards'
    },
    {
      icon: <FiCalendar />,
      title: 'Employee Schedules',
      description: 'Manage and track employee schedules and shifts',
      route: '/features/employee-schedules'
    },
    {
      icon: <FiCheckSquare />,
      title: 'User Pending Approvals',
      description: 'Review and approve pending user requests and submissions',
      route: '/features/user-pending-approvals'
    },
    {
      icon: <FiUsers />,
      title: 'Team Management',
      description: 'Manage teams, departments, and organizational structure',
      route: '/features/admin-team-management'
    },
    {
      icon: <FiCheckSquare />,
      title: 'Admin Task Management',
      description: 'Manage and assign tasks across the organization',
      route: '/features/admin-task-management'
    },
    {
      icon: <FiHelpCircle />,
      title: 'Helpdesk Solver',
      description: 'Resolve helpdesk tickets and provide support solutions',
      route: '/features/helpdesk-solver'
    },
    {
      icon: <FiBriefcase />,
      title: 'Company Overall Worklogz Management',
      description: 'Manage company-wide worklogs and time tracking',
      route: '/features/company-overall-worklogz-management'
    },
    {
      icon: <FiFolder />,
      title: 'Company Department Management',
      description: 'Manage departments, teams, and organizational hierarchy',
      route: '/features/company-department-management'
    },
    {
      icon: <FiGrid />,
      title: 'Project Workspace Management',
      description: 'Manage project workspaces and assignments',
      route: '/features/project-workspace-management'
    },
    {
      icon: <FiTarget />,
      title: 'Customized Input / CRM Management',
      description: 'Manage CRM pipelines for courses, internships, and IT projects',
      route: '/features/customized-input-crm-management'
    },
    {
      icon: <FiUsers />,
      title: 'HR Management',
      description: 'Comprehensive HR management and administration',
      route: '/features/hr-management'
    },
    {
      icon: <FiCalendar />,
      title: 'Leave Management',
      description: 'Manage employee leave requests and approvals',
      route: '/features/admin-leave-management'
    },
    {
      icon: <FiDollarSign />,
      title: 'Payroll Management',
      description: 'Automated payroll processing and salary management',
      route: '/features/payroll-management'
    },
    {
      icon: <FiPackage />,
      title: 'Plan Management',
      description: 'Manage subscription plans and billing',
      route: '/features/plan-management'
    },
    {
      icon: <FiUnlock />,
      title: 'Admin Access Control Management',
      description: 'Manage access controls and permissions across the system',
      route: '/features/admin-access-control-management'
    },
    {
      icon: <FiFileText />,
      title: 'Document Management',
      description: 'Generate and manage offer letters, experience letters, and policy documents',
      route: '/features/document-management'
    },
    {
      icon: <FiSettings />,
      title: 'Company Settings Management',
      description: 'Configure company settings and preferences',
      route: '/features/company-settings-management'
    },
    {
      icon: <FiCreditCard />,
      title: 'Expense Management',
      description: 'Track and manage company expenses and reimbursements',
      route: '/features/expense-management'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Performance Management',
      description: 'Track and manage employee performance metrics',
      route: '/features/admin-performance-management'
    },
    {
      icon: <FiClipboard />,
      title: 'Assessment Management',
      description: 'Create, manage, and evaluate assessments for employees with detailed analytics and reporting',
      route: '/features/admin-assessment-management'
    }
  ];

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

  return (
    <section className="features-showcase-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">PLATFORM FEATURES</h2>
          <p className="section-subtitle">
            Everything you need to create a high-performance culture.
          </p>
        </div>

        {/* User Modules Section */}
        <div className="features-module-section">
          <h3 className="module-section-title">
            <FiUser className="module-icon" />
            User Modules
          </h3>
          <div className="features-grid">
            {userModules.map((feature, index) => {
              const iconStyle = getIconColor(index);
              return (
                <Link key={index} to={feature.route} className="feature-card-link">
                  <div className="feature-card">
                    <div 
                      className="feature-icon" 
                      style={{ 
                        backgroundColor: iconStyle.bg, 
                        color: iconStyle.color 
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <span className="feature-explore-link">Explore more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin Modules Section */}
        <div className="features-module-section">
          <h3 className="module-section-title">
            <FiShield className="module-icon" />
            Admin Modules
          </h3>
          <div className="features-grid">
            {adminModules.map((feature, index) => {
              const iconStyle = getIconColor((userModules.length + index) % iconColors.length);
              return (
                <Link key={index} to={feature.route} className="feature-card-link">
                  <div className="feature-card">
                    <div 
                      className="feature-icon" 
                      style={{ 
                        backgroundColor: iconStyle.bg, 
                        color: iconStyle.color 
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <span className="feature-explore-link">Explore more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;

