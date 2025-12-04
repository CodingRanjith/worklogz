import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeLeave = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Leave Management</h1>
        <p className="intro-subtitle">
          Apply for leave, track your leave balance, and view leave history and approvals.
        </p>

        <h2 id="overview">Leave Management Overview</h2>
        <p>
          The Leave Management module allows you to apply for leave, track your leave balance, 
          view leave history, and check approval status.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📝"
            title="Apply for Leave"
            description="Submit leave applications with details"
          />
          <FeatureCard
            icon="📊"
            title="Leave Balance"
            description="View your available leave balance"
          />
          <FeatureCard
            icon="📅"
            title="Leave History"
            description="View your complete leave history"
          />
          <FeatureCard
            icon="✅"
            title="Status Tracking"
            description="Track approval status of your requests"
          />
        </div>

        <h2 id="leave-types">Leave Types</h2>
        <ul>
          <li>Sick Leave</li>
          <li>Casual Leave</li>
          <li>Annual Leave</li>
          <li>Personal Leave</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default EmployeeLeave;

