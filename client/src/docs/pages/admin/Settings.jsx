import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminSettings = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>System Settings</h1>
        <p className="intro-subtitle">
          Configure system settings, organization details, security options, and integration settings.
        </p>

        <h2 id="overview">Settings Overview</h2>
        <p>
          The Settings module allows administrators to configure system-wide settings, 
          organization information, and integration options.
        </p>

        <h2 id="settings-categories">Settings Categories</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🏢"
            title="Organization"
            description="Company details and branding"
          />
          <FeatureCard
            icon="🔐"
            title="Security"
            description="Security and authentication settings"
          />
          <FeatureCard
            icon="🔌"
            title="Integrations"
            description="Third-party service integrations"
          />
          <FeatureCard
            icon="⚙️"
            title="General"
            description="General system configuration"
          />
        </div>

        <h2 id="organization-settings">Organization Settings</h2>
        <ul>
          <li>Company name and details</li>
          <li>Logo and branding</li>
          <li>Contact information</li>
          <li>Timezone configuration</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminSettings;

