import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminDepartments = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Company Departments</h1>
        <p className="intro-subtitle">
          Manage departments, organize employees, and configure department-specific settings.
        </p>

        <h2 id="overview">Departments Overview</h2>
        <p>
          The Company Departments module allows administrators to create and manage departments, 
          assign employees to departments, and configure department-specific settings.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🏢"
            title="Department Management"
            description="Create and manage departments"
          />
          <FeatureCard
            icon="👥"
            title="Employee Assignment"
            description="Assign employees to departments"
          />
          <FeatureCard
            icon="⚙️"
            title="Department Settings"
            description="Configure department-specific settings"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default AdminDepartments;

