import React from 'react';
import { FiBriefcase } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const CompanyOverallWorklogzManagement = () => {
  return (
    <FeatureDetailPage
      title="Company Overall Worklogz Management"
      description="Manage company-wide worklogs and time tracking. Monitor organizational time tracking, worklogs, and ensure accurate recording of work hours across all departments."
      icon={<FiBriefcase />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Company-Wide View", description: "View all worklogs and time tracking data across the organization." },
        { title: "Department Analysis", description: "Analyze worklogs by department, team, and project." },
        { title: "Time Tracking Oversight", description: "Monitor time tracking compliance and accuracy." },
        { title: "Worklog Reports", description: "Generate comprehensive reports on company worklogs." },
        { title: "Compliance Monitoring", description: "Monitor compliance with time tracking policies." },
        { title: "Resource Utilization", description: "Analyze resource utilization based on worklog data." },
        { title: "Trend Analysis", description: "Analyze trends in worklogs and time tracking patterns." },
        { title: "Export & Integration", description: "Export worklog data and integrate with other systems." }
      ]}
      benefits={[
        { title: "Complete Visibility", description: "Complete visibility of organizational time tracking." },
        { title: "Better Planning", description: "Better resource planning based on worklog insights." },
        { title: "Compliance Assurance", description: "Ensure compliance with time tracking requirements." }
      ]}
      useCases={[
        { title: "Organizational Overview", description: "Get overview of organizational time tracking and worklogs." },
        { title: "Resource Planning", description: "Plan resources based on worklog analysis and trends." },
        { title: "Compliance Reporting", description: "Generate compliance reports for audit and review." }
      ]}
    />
  );
};

export default CompanyOverallWorklogzManagement;


