import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeWorkspace = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>My Workspace</h1>
        <p className="intro-subtitle">
          Your personal workspace with quick access to tools, applications, and productivity features.
        </p>

        <h2 id="overview">Workspace Overview</h2>
        <p>
          My Workspace provides a personalized dashboard with quick access to your frequently 
          used tools, applications, and productivity features.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="⚡"
            title="Quick Access"
            description="Fast access to frequently used features"
          />
          <FeatureCard
            icon="📱"
            title="Applications Hub"
            description="Access to external applications and tools"
          />
          <FeatureCard
            icon="📋"
            title="Task Management"
            description="Manage your personal tasks"
          />
          <FeatureCard
            icon="📊"
            title="Widgets"
            description="Customizable dashboard widgets"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeWorkspace;

