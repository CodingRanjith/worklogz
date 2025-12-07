import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminTeamManagement = () => {
  return (
    <FeatureDetailPage
      title="Team Management"
      description="Manage teams, departments, and organizational structure. Create teams, assign members, define hierarchies, and organize the workforce effectively."
      icon={<FiUsers />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Team Creation", description: "Create teams and departments with custom configurations." },
        { title: "Member Assignment", description: "Assign team members and define roles within teams." },
        { title: "Hierarchy Management", description: "Define organizational hierarchy and reporting structure." },
        { title: "Team Structure", description: "Visual representation of team structure and relationships." },
        { title: "Team Settings", description: "Configure team settings, permissions, and access levels." },
        { title: "Team Analytics", description: "View analytics and metrics for teams and departments." },
        { title: "Team Transfers", description: "Transfer employees between teams and departments." },
        { title: "Bulk Operations", description: "Perform bulk operations on teams and members." }
      ]}
      benefits={[
        { title: "Organized Structure", description: "Maintain organized team and department structure." },
        { title: "Clear Hierarchy", description: "Define clear reporting hierarchies and relationships." },
        { title: "Efficient Management", description: "Manage teams and departments efficiently." }
      ]}
      useCases={[
        { title: "Organizational Setup", description: "Set up and organize teams and departments." },
        { title: "Team Restructuring", description: "Restructure teams and departments as needed." },
        { title: "Resource Allocation", description: "Allocate resources effectively across teams." }
      ]}
    />
  );
};

export default AdminTeamManagement;


