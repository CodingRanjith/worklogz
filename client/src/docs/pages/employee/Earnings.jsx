import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeEarnings = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>My Earnings</h1>
        <p className="intro-subtitle">
          View your earnings, salary history, payslips, and payment records.
        </p>

        <h2 id="overview">Earnings Overview</h2>
        <p>
          The My Earnings module provides a comprehensive view of your compensation, including 
          salary history, payslips, and payment records.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="💰"
            title="Salary Overview"
            description="View your current salary and compensation"
          />
          <FeatureCard
            icon="📄"
            title="Payslips"
            description="Access and download your payslips"
          />
          <FeatureCard
            icon="📊"
            title="Salary History"
            description="View your complete salary history"
          />
          <FeatureCard
            icon="💳"
            title="Payment Records"
            description="Track all payment transactions"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeEarnings;

