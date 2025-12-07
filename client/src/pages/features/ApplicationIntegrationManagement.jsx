import React from 'react';
import { FiGrid } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const ApplicationIntegrationManagement = () => {
  return (
    <FeatureDetailPage
      title="Application Integration / Management"
      description="Integrate and manage third-party applications and tools. Connect external services, manage integrations, and streamline workflows across platforms."
      icon={<FiGrid />}
      image={null}
      moduleType="User"
      features={[
        { title: "Third-Party Integrations", description: "Connect with popular tools like Slack, Google Workspace, Microsoft 365, and more." },
        { title: "Integration Management", description: "Manage all your connected applications from a central dashboard." },
        { title: "Single Sign-On (SSO)", description: "Access multiple applications with single sign-on convenience." },
        { title: "API Access", description: "Access and manage API connections for custom integrations." },
        { title: "Workflow Automation", description: "Automate workflows across integrated applications." },
        { title: "Data Synchronization", description: "Sync data across integrated platforms automatically." },
        { title: "Security Controls", description: "Manage permissions and security settings for all integrations." },
        { title: "Integration Analytics", description: "Track usage and performance of integrated applications." }
      ]}
      benefits={[
        { title: "Unified Experience", description: "Access all your tools from one platform seamlessly." },
        { title: "Improved Productivity", description: "Streamline workflows across different applications." },
        { title: "Better Data Flow", description: "Synchronize data across platforms for consistency." }
      ]}
      useCases={[
        { title: "Email Integration", description: "Integrate email services for unified communication." },
        { title: "Calendar Sync", description: "Sync calendars across different platforms for better scheduling." },
        { title: "File Storage", description: "Connect cloud storage services for easy file access." }
      ]}
    />
  );
};

export default ApplicationIntegrationManagement;


