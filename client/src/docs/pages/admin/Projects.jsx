import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminProjects = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Projects Workspace</h1>
        <p className="intro-subtitle">
          Manage projects, assign team members, and track project progress across your organization.
        </p>

        <h2 id="overview">Project Management</h2>
        <p>
          The Projects Workspace allows administrators to create projects, assign team members, 
          track progress, and manage project resources.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📁"
            title="Create Projects"
            description="Create new projects with details and timelines"
          />
          <FeatureCard
            icon="👥"
            title="Team Assignment"
            description="Assign team members to projects"
          />
          <FeatureCard
            icon="📊"
            title="Progress Tracking"
            description="Monitor project status and completion"
          />
          <FeatureCard
            icon="🏢"
            title="Department Projects"
            description="Organize projects by department"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default AdminProjects;

