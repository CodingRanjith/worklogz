import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const QuickStart = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Quick Start Guide</h1>
        <p className="intro-subtitle">
          Welcome to Worklogz! Get started quickly and learn how to use all the features available to you.
        </p>

        <h2 id="getting-started">Getting Started</h2>
        <p>
          Worklogz is a comprehensive workforce management platform designed to help you manage your 
          work, track attendance, manage leaves, and monitor your performance - all in one place.
        </p>

        <h2 id="first-steps">Your First Steps</h2>
        <ol>
          <li><strong>Login:</strong> Access your account using your email and password</li>
          <li><strong>Check-In:</strong> Start your day by checking in through the Attendance page</li>
          <li><strong>Explore Features:</strong> Navigate through different sections to discover all available features</li>
          <li><strong>Update Profile:</strong> Complete your profile information</li>
          <li><strong>Set Goals:</strong> Set your professional goals and track your progress</li>
        </ol>

        <h2 id="key-features">Key Features Available</h2>
        <div className="features-grid">
          <FeatureCard
            icon="✅"
            title="Attendance Tracking"
            description="Check in and out, track your work hours, and view attendance history"
          />
          <FeatureCard
            icon="📝"
            title="Timesheet Management"
            description="Log your daily work activities and track time spent on projects"
          />
          <FeatureCard
            icon="🏖️"
            title="Leave Management"
            description="Apply for leave, track your leave balance, and view approval status"
          />
          <FeatureCard
            icon="📊"
            title="Performance Dashboard"
            description="Monitor your performance metrics and achievements"
          />
          <FeatureCard
            icon="💰"
            title="My Earnings"
            description="View your salary, payslips, and payment history"
          />
          <FeatureCard
            icon="🎯"
            title="Goals & Achievements"
            description="Set goals, track progress, and celebrate your achievements"
          />
        </div>

        <h2 id="explore-features">Explore All Features</h2>
        <p>
          Worklogz offers a wide range of features to help you manage your work effectively. 
          Explore the documentation to learn more about:
        </p>
        <ul>
          <li>Attendance tracking and check-in/check-out</li>
          <li>Timesheet logging and project time tracking</li>
          <li>Leave application and management</li>
          <li>Performance monitoring and analytics</li>
          <li>Goals setting and achievement tracking</li>
          <li>Earnings and payslip access</li>
          <li>Calendar view for schedule management</li>
          <li>Skill development resources</li>
          <li>Community hub for team collaboration</li>
          <li>Personal workspace customization</li>
        </ul>

        <div className="cta-section">
          <h3>Ready to explore?</h3>
          <p>
            Check out the <a href="/docs/employee/attendance">Features</a> section to learn 
            more about each feature in detail.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
};

export default QuickStart;

