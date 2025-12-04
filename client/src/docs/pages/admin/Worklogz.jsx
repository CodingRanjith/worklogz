import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminWorklogz = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Company Worklogz</h1>
        <p className="intro-subtitle">
          Manage company-wide work cards, track work activities, and organize work by departments.
        </p>

        <h2 id="overview">Worklogz Overview</h2>
        <p>
          The Company Worklogz module allows administrators to create and manage work cards 
          across the organization, track work activities, and organize work by departments.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📋"
            title="Work Cards"
            description="Create and manage work cards"
          />
          <FeatureCard
            icon="🏢"
            title="Department Organization"
            description="Organize work by departments"
          />
          <FeatureCard
            icon="📊"
            title="Activity Tracking"
            description="Track work activities and progress"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default AdminWorklogz;

