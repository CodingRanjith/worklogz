import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminAnalytics = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Admin Analytics</h1>
        <p className="intro-subtitle">
          Comprehensive analytics and reporting tools to gain insights into your workforce 
          performance and business operations.
        </p>

        <h2 id="overview">Analytics Overview</h2>
        <p>
          The Analytics module provides detailed insights into employee performance, attendance 
          patterns, department metrics, and business KPIs.
        </p>

        <h2 id="features">Analytics Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📈"
            title="Department Analytics"
            description="Department-wise performance metrics and comparisons"
          />
          <FeatureCard
            icon="⏰"
            title="Attendance Analytics"
            description="Attendance patterns and trends analysis"
          />
          <FeatureCard
            icon="💼"
            title="Project Analytics"
            description="Project performance and completion metrics"
          />
          <FeatureCard
            icon="💰"
            title="Financial Analytics"
            description="Payroll and financial insights"
          />
        </div>

        <h2 id="reports">Available Reports</h2>
        <ul>
          <li>Employee Performance Reports</li>
          <li>Attendance Summary Reports</li>
          <li>Department Comparison Reports</li>
          <li>Project Status Reports</li>
          <li>Payroll Analysis Reports</li>
          <li>Custom Date Range Reports</li>
        </ul>

        <h2 id="visualizations">Data Visualizations</h2>
        <p>Analytics include various chart types:</p>
        <ul>
          <li>Line charts for trends</li>
          <li>Bar charts for comparisons</li>
          <li>Pie charts for distributions</li>
          <li>Heat maps for patterns</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminAnalytics;

