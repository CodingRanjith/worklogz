import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminDocuments = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Document Management</h1>
        <p className="intro-subtitle">
          Generate experience letters, offer letters, relieving letters, and manage document uploads.
        </p>

        <h2 id="overview">Documents Overview</h2>
        <p>
          The Document Management module allows administrators to generate official letters 
          and manage document uploads for employees.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📄"
            title="Experience Letters"
            description="Generate experience letters for employees"
          />
          <FeatureCard
            icon="📝"
            title="Offer Letters"
            description="Create and manage offer letters"
          />
          <FeatureCard
            icon="📋"
            title="Relieving Letters"
            description="Generate relieving letters"
          />
          <FeatureCard
            icon="📤"
            title="Document Upload"
            description="Upload and manage documents"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default AdminDocuments;

