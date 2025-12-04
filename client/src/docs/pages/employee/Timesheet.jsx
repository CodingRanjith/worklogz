import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeTimesheet = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Timesheet Management</h1>
        <p className="intro-subtitle">
          Log your daily work hours, track time spent on projects, and submit timesheets for approval.
        </p>

        <h2 id="overview">Timesheet Overview</h2>
        <p>
          The Timesheet module allows you to log your daily work activities, track time spent 
          on different projects, and submit timesheets for manager approval.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📝"
            title="Daily Logging"
            description="Log your daily work activities"
          />
          <FeatureCard
            icon="📁"
            title="Project Tracking"
            description="Track time spent on different projects"
          />
          <FeatureCard
            icon="✅"
            title="Submission"
            description="Submit timesheets for approval"
          />
          <FeatureCard
            icon="📊"
            title="History"
            description="View your timesheet history"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeTimesheet;

