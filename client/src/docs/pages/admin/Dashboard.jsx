import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminDashboard = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Admin Dashboard</h1>
        <p className="intro-subtitle">
          The Admin Dashboard provides a comprehensive overview of your organization's workforce, 
          attendance, and business metrics at a glance.
        </p>

        <h2 id="overview">Dashboard Overview</h2>
        <p>
          The Admin Dashboard is the central hub for administrators, displaying key metrics, 
          recent activities, and quick access to all administrative functions.
        </p>

        <h2 id="key-metrics">Key Metrics</h2>
        <div className="features-grid">
          <FeatureCard
            icon="👥"
            title="Total Employees"
            description="View total number of active employees"
          />
          <FeatureCard
            icon="✅"
            title="Today's Attendance"
            description="See who checked in today"
          />
          <FeatureCard
            icon="📊"
            title="Department Analytics"
            description="Department-wise performance metrics"
          />
          <FeatureCard
            icon="💰"
            title="Payroll Summary"
            description="Monthly payroll overview"
          />
        </div>

        <h2 id="features">Dashboard Features</h2>
        <ul>
          <li><strong>Real-time Statistics:</strong> Live updates of attendance and activity</li>
          <li><strong>Quick Actions:</strong> Fast access to common tasks</li>
          <li><strong>Recent Activity:</strong> Latest employee activities and changes</li>
          <li><strong>Charts & Graphs:</strong> Visual representation of data</li>
          <li><strong>Notifications:</strong> Important alerts and reminders</li>
        </ul>

        <h2 id="navigation">Quick Navigation</h2>
        <p>Access key features directly from the dashboard:</p>
        <ul>
          <li>User Management</li>
          <li>Attendance Reports</li>
          <li>Payroll Management</li>
          <li>Task Manager</li>
          <li>CRM Pipelines</li>
          <li>Analytics</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminDashboard;

