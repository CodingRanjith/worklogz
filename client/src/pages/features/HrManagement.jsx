import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const HrManagement = () => {
  return (
    <FeatureDetailPage
      title="HR Management"
      description="Comprehensive HR management and administration. Manage recruitment, onboarding, employee lifecycle, and all HR processes in one integrated platform."
      icon={<FiUsers />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Recruitment Management", description: "Manage job postings, applications, and recruitment process." },
        { title: "Onboarding Workflows", description: "Streamline employee onboarding with automated workflows." },
        { title: "Employee Lifecycle", description: "Manage employee lifecycle from hire to exit." },
        { title: "Performance Reviews", description: "Conduct and manage performance review processes." },
        { title: "Compensation Management", description: "Manage salaries, bonuses, and compensation structures." },
        { title: "Training & Development", description: "Plan and track employee training and development programs." },
        { title: "HR Policies", description: "Manage and communicate HR policies and procedures." },
        { title: "HR Analytics", description: "Analyze HR metrics and workforce analytics." }
      ]}
      benefits={[
        { title: "Centralized HR", description: "Centralized management of all HR processes and data." },
        { title: "Efficiency", description: "Improve HR efficiency with automated workflows." },
        { title: "Better Insights", description: "Gain insights into workforce trends and patterns." }
      ]}
      useCases={[
        { title: "Employee Onboarding", description: "Streamline onboarding process for new employees." },
        { title: "HR Operations", description: "Manage day-to-day HR operations efficiently." },
        { title: "Strategic Planning", description: "Use HR analytics for strategic workforce planning." }
      ]}
    />
  );
};

export default HrManagement;

