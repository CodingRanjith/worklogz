import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminReports = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Reports & Analytics</h1>
        <p className="intro-subtitle">
          Generate comprehensive reports on attendance, payroll, performance, and business operations.
        </p>

        <h2 id="overview">Reports Overview</h2>
        <p>
          The Reports module allows administrators to generate various reports and export them 
          in multiple formats for analysis and record-keeping.
        </p>

        <h2 id="report-types">Report Types</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📅"
            title="Monthly Reports"
            description="Generate monthly summaries and reports"
          />
          <FeatureCard
            icon="⏰"
            title="Attendance Reports"
            description="Detailed attendance analysis reports"
          />
          <FeatureCard
            icon="💰"
            title="Payroll Reports"
            description="Financial and payroll summary reports"
          />
          <FeatureCard
            icon="📊"
            title="Performance Reports"
            description="Employee and department performance reports"
          />
        </div>

        <h2 id="export-formats">Export Formats</h2>
        <ul>
          <li>PDF</li>
          <li>Excel (XLSX)</li>
          <li>CSV</li>
          <li>JSON</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminReports;

