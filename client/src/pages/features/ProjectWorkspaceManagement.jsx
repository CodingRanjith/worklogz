import React from 'react';
import { FiGrid } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const ProjectWorkspaceManagement = () => {
  return (
    <FeatureDetailPage
      title="Project Workspace Management"
      description="Manage project workspaces and assignments. Create project workspaces, assign team members, track progress, and manage project resources effectively."
      icon={<FiGrid />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Workspace Creation", description: "Create project workspaces with custom configurations." },
        { title: "Team Assignment", description: "Assign team members to project workspaces." },
        { title: "Resource Management", description: "Manage project resources, budgets, and timelines." },
        { title: "Progress Tracking", description: "Track project progress and milestone achievements." },
        { title: "Workspace Settings", description: "Configure workspace settings, permissions, and access." },
        { title: "Document Management", description: "Manage project documents and resources within workspaces." },
        { title: "Workspace Analytics", description: "View analytics and metrics for project workspaces." },
        { title: "Multi-Project View", description: "Manage multiple project workspaces from centralized dashboard." }
      ]}
      benefits={[
        { title: "Better Organization", description: "Organize projects efficiently in dedicated workspaces." },
        { title: "Clear Accountability", description: "Ensure clear accountability for project delivery." },
        { title: "Resource Optimization", description: "Optimize resource allocation across projects." }
      ]}
      useCases={[
        { title: "Project Setup", description: "Set up new projects with dedicated workspaces and teams." },
        { title: "Project Monitoring", description: "Monitor project progress and resource utilization." },
        { title: "Portfolio Management", description: "Manage multiple projects and portfolios effectively." }
      ]}
    />
  );
};

export default ProjectWorkspaceManagement;


