import React from 'react';
import { FiBell } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const NotificationManagement = () => {
  return (
    <FeatureDetailPage
      title="Notification Management"
      description="Manage and customize all your notifications and alerts. Stay informed with personalized notification settings and preferences."
      icon={<FiBell />}
      image={null}
      moduleType="User"
      features={[
        { title: "Notification Center", description: "Centralized notification center for all alerts and updates." },
        { title: "Customization", description: "Customize notification preferences for different types of alerts." },
        { title: "Notification Channels", description: "Receive notifications via email, SMS, and in-app alerts." },
        { title: "Priority Settings", description: "Set notification priorities for important alerts." },
        { title: "Quiet Hours", description: "Set quiet hours to avoid notifications during specific times." },
        { title: "Notification History", description: "View complete history of all notifications received." },
        { title: "Bulk Actions", description: "Mark multiple notifications as read or delete in bulk." },
        { title: "Smart Filtering", description: "Filter notifications by type, date, and priority." }
      ]}
      benefits={[
        { title: "Stay Informed", description: "Never miss important updates and announcements." },
        { title: "Reduced Noise", description: "Customize settings to reduce notification noise." },
        { title: "Better Control", description: "Full control over what notifications you receive." }
      ]}
      useCases={[
        { title: "Important Alerts", description: "Get instant notifications for critical updates and approvals." },
        { title: "Daily Updates", description: "Receive daily summaries and updates as per preference." },
        { title: "Focus Mode", description: "Use quiet hours to focus on work without interruptions." }
      ]}
    />
  );
};

export default NotificationManagement;

