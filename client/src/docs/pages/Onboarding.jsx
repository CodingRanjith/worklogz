import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Onboarding = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>User Onboarding & Training Guide</h1>
        <p className="intro-subtitle">
          Tutorials, manuals, walkthrough videos, or step-by-step setup guides.
        </p>

        <h2 id="overview">Onboarding Overview</h2>
        <p>
          Get your team up and running quickly with comprehensive onboarding resources and 
          training materials designed for administrators and employees.
        </p>

        <h2 id="getting-started">Getting Started</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📖"
            title="Documentation"
            description="Comprehensive documentation for all features"
          />
          <FeatureCard
            icon="🎥"
            title="Video Tutorials"
            description="Step-by-step video guides for common tasks"
          />
          <FeatureCard
            icon="👨‍🏫"
            title="Training Sessions"
            description="Live training sessions for administrators"
          />
          <FeatureCard
            icon="💡"
            title="Best Practices"
            description="Guides on best practices and workflows"
          />
        </div>

        <h2 id="admin-onboarding">Administrator Onboarding</h2>
        <h3>Setup Guide</h3>
        <ol>
          <li>Initial system configuration</li>
          <li>Organization setup</li>
          <li>User management setup</li>
          <li>Department configuration</li>
          <li>Workflow configuration</li>
        </ol>

        <h3>Training Topics</h3>
        <ul>
          <li>Dashboard navigation</li>
          <li>User management</li>
          <li>Attendance monitoring</li>
          <li>Payroll processing</li>
          <li>Report generation</li>
          <li>System settings</li>
        </ul>

        <h2 id="employee-onboarding">Employee Onboarding</h2>
        <h3>Quick Start Guide</h3>
        <ol>
          <li>Account setup and login</li>
          <li>Profile completion</li>
          <li>First check-in</li>
          <li>Understanding timesheet</li>
          <li>Leave application process</li>
        </ol>

        <h3>Training Materials</h3>
        <ul>
          <li>Attendance tracking tutorial</li>
          <li>Timesheet logging guide</li>
          <li>Leave management walkthrough</li>
          <li>Earnings and payslip access</li>
          <li>Mobile app usage (if applicable)</li>
        </ul>

        <h2 id="resources">Available Resources</h2>
        <ul>
          <li>User manuals (PDF downloads)</li>
          <li>Interactive tutorials</li>
          <li>Video walkthroughs</li>
          <li>FAQ sections</li>
          <li>Knowledge base articles</li>
          <li>Community forums</li>
        </ul>

        <h2 id="support">Training Support</h2>
        <ul>
          <li>Email support for questions</li>
          <li>Live chat assistance</li>
          <li>Scheduled training sessions</li>
          <li>Custom training programs</li>
          <li>Trainer resources</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Onboarding;

