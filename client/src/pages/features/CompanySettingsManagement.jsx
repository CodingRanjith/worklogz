import React from 'react';
import { FiSettings } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const CompanySettingsManagement = () => {
  return (
    <FeatureDetailPage
      title="Company Settings Management"
      description="Configure company settings and preferences. Manage organizational settings, policies, configurations, and system preferences from one central location."
      icon={<FiSettings />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "General Settings", description: "Configure general company information and settings." },
        { title: "Policy Configuration", description: "Set up company policies, rules, and guidelines." },
        { title: "System Preferences", description: "Configure system preferences and default settings." },
        { title: "Notification Settings", description: "Manage notification preferences and communication settings." },
        { title: "Integration Settings", description: "Configure integrations with third-party services." },
        { title: "Security Settings", description: "Manage security settings, passwords, and access controls." },
        { title: "Customization", description: "Customize branding, themes, and company-specific configurations." },
        { title: "Backup & Recovery", description: "Configure backup and recovery settings for data protection." }
      ]}
      benefits={[
        { title: "Centralized Control", description: "Centralized control over all company settings." },
        { title: "Consistency", description: "Ensure consistency in settings across the organization." },
        { title: "Easy Configuration", description: "Easy configuration and management of settings." }
      ]}
      useCases={[
        { title: "Initial Setup", description: "Configure company settings during initial platform setup." },
        { title: "Policy Updates", description: "Update company policies and settings as needed." },
        { title: "System Customization", description: "Customize system settings to match company requirements." }
      ]}
    />
  );
};

export default CompanySettingsManagement;


