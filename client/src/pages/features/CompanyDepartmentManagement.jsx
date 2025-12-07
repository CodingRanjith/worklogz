import React from 'react';
import { FiFolder } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const CompanyDepartmentManagement = () => {
  return (
    <FeatureDetailPage
      title="Company Department Management"
      description="Manage departments, teams, and organizational hierarchy. Create departments, define structure, assign managers, and organize the workforce effectively."
      icon={<FiFolder />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Department Creation", description: "Create and configure departments with specific settings." },
        { title: "Organizational Structure", description: "Define and manage organizational structure and hierarchy." },
        { title: "Department Managers", description: "Assign department managers and define reporting lines." },
        { title: "Department Settings", description: "Configure department-specific settings and policies." },
        { title: "Department Analytics", description: "View analytics and metrics for each department." },
        { title: "Department Transfers", description: "Transfer employees between departments efficiently." },
        { title: "Budget Allocation", description: "Allocate budgets and resources to departments." },
        { title: "Department Reports", description: "Generate reports specific to departments and teams." }
      ]}
      benefits={[
        { title: "Organized Structure", description: "Maintain organized departmental structure." },
        { title: "Clear Hierarchy", description: "Define clear reporting hierarchies and relationships." },
        { title: "Efficient Management", description: "Manage departments and resources efficiently." }
      ]}
      useCases={[
        { title: "Organizational Setup", description: "Set up and organize departments and teams." },
        { title: "Restructuring", description: "Restructure departments as organizational needs change." },
        { title: "Resource Allocation", description: "Allocate resources and budgets across departments." }
      ]}
    />
  );
};

export default CompanyDepartmentManagement;

