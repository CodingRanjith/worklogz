import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const FeaturesOverview = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Important Features Overview</h1>
        <p className="intro-subtitle">
          High-level feature highlights that make Worklogz a comprehensive workforce management solution.
        </p>

        <h2 id="core-modules">Core Modules</h2>

        <div className="features-grid">
          <FeatureCard
            icon="👥"
            title="User Management"
            description="Secure login, role-based access control, user profiles, and pending approvals"
          />
          <FeatureCard
            icon="⏰"
            title="Attendance Management"
            description="Real-time check-in/out with camera, location tracking, work modes, and calendar view"
          />
          <FeatureCard
            icon="📝"
            title="Timesheet Management"
            description="Daily work logging, project-based tracking, submission and approval workflow"
          />
          <FeatureCard
            icon="📅"
            title="Leave Management"
            description="Leave applications, approval workflow, balance tracking, and calendar integration"
          />
          <FeatureCard
            icon="💰"
            title="Payroll & Salary"
            description="Daily salary credits, payslip generation, salary history, and payment records"
          />
          <FeatureCard
            icon="✅"
            title="Task Management"
            description="Task creation, assignment, status tracking, and department-based organization"
          />
          <FeatureCard
            icon="📁"
            title="Project Management"
            description="Project workspace, creation, tracking, and department-based organization"
          />
          <FeatureCard
            icon="🤝"
            title="CRM Pipelines"
            description="Course CRM, Internship CRM, and IT Projects CRM for lead management"
          />
          <FeatureCard
            icon="🏢"
            title="Company Worklogz"
            description="Company-wide work card management and department organization"
          />
          <FeatureCard
            icon="🎫"
            title="Helpdesk System"
            description="Ticket creation, category organization, priority levels, and assignment"
          />
          <FeatureCard
            icon="📄"
            title="Document Management"
            description="Experience letters, offer letters, relieving letters, and document storage"
          />
          <FeatureCard
            icon="📊"
            title="Analytics & Reporting"
            description="Dashboard analytics, department analytics, monthly reports, and performance metrics"
          />
          <FeatureCard
            icon="📝"
            title="Assessment System"
            description="Secure online assessments with timer, auto-save, security controls, and multiple question types"
          />
        </div>

        <h2 id="employee-features">Employee Features</h2>
        <ul>
          <li>Personal attendance tracking with camera verification</li>
          <li>Timesheet logging and submission</li>
          <li>Leave application and tracking</li>
          <li>Performance dashboard with metrics</li>
          <li>Goals and achievements tracking</li>
          <li>Calendar view for attendance and leaves</li>
          <li>Earnings tracking and payslip access</li>
          <li>Community hub and employee directory</li>
          <li>Personal workspace and task management</li>
          <li>Helpdesk ticket creation</li>
          <li>Assessment taking with security features</li>
          <li>Assessment progress tracking</li>
        </ul>

        <h2 id="admin-features">Administrative Features</h2>
        <ul>
          <li>Comprehensive dashboard with analytics</li>
          <li>User management and approvals</li>
          <li>Attendance monitoring across all employees</li>
          <li>Payroll management and processing</li>
          <li>Task assignment and tracking</li>
          <li>Project management and team assignment</li>
          <li>CRM pipeline management</li>
          <li>Document generation and management</li>
          <li>Report generation and analytics</li>
          <li>Assessment creation and management</li>
          <li>System settings and configuration</li>
        </ul>

        <h2 id="security-features">Security & Compliance</h2>
        <ul>
          <li>JWT-based authentication</li>
          <li>Role-based access control</li>
          <li>Secure file uploads</li>
          <li>Location verification for attendance</li>
          <li>Data encryption and privacy protection</li>
        </ul>

        <h2 id="integration-capabilities">Integration Capabilities</h2>
        <ul>
          <li>Email notifications</li>
          <li>Cloudinary for media storage</li>
          <li>Calendar integration</li>
          <li>PDF generation for documents</li>
          <li>Real-time updates via WebSocket</li>
          <li>API access for custom integrations</li>
        </ul>

        <h2 id="mobile-responsive">Mobile Responsiveness</h2>
        <p>
          Worklogz is designed to be fully responsive, supporting:
        </p>
        <ul>
          <li>Desktop computers</li>
          <li>Tablets</li>
          <li>Mobile devices</li>
        </ul>

        <p>
          All features are accessible from any device, ensuring your team can manage work 
          from anywhere, at any time.
        </p>
      </div>
    </DocsLayout>
  );
};

export default FeaturesOverview;

