import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminPayroll = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Payroll Management</h1>
        <p className="intro-subtitle">
          Manage employee payroll, generate payslips, track salary history, and process daily salary credits.
        </p>

        <h2 id="overview">Payroll Overview</h2>
        <p>
          The Payroll module provides comprehensive tools for managing employee compensation, 
          generating payslips, and tracking payment history.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="💰"
            title="Payslip Generation"
            description="Generate and download employee payslips"
          />
          <FeatureCard
            icon="📊"
            title="Salary History"
            description="Track employee salary history and changes"
          />
          <FeatureCard
            icon="💳"
            title="Daily Salary Credit"
            description="Process daily salary credits to employees"
          />
          <FeatureCard
            icon="📄"
            title="Payment Records"
            description="Maintain payment transaction records"
          />
        </div>

        <h2 id="payslip-features">Payslip Features</h2>
        <ul>
          <li>Generate PDF payslips</li>
          <li>Email payslips to employees</li>
          <li>Download payslip history</li>
          <li>Customize payslip templates</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminPayroll;

