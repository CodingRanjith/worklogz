import React from 'react';
import { FiBriefcase } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const WorkspaceManagement = () => {
  return (
    <FeatureDetailPage
      title="Workspace Management"
      description="Manage your workspace, projects, and work assignments. Organize your work environment and collaborate effectively on projects."
      icon={<FiBriefcase />}
      image={null}
      moduleType="User"
      features={[
        { title: "Project Workspaces", description: "Access and manage multiple project workspaces with dedicated spaces." },
        { title: "Work Assignments", description: "View and track all assigned work items and responsibilities." },
        { title: "Workspace Collaboration", description: "Collaborate with team members within workspace environments." },
        { title: "Document Organization", description: "Organize workspace documents, files, and resources efficiently." },
        { title: "Activity Timeline", description: "Track workspace activities and updates in real-time." },
        { title: "Resource Access", description: "Access workspace-specific resources, tools, and information." },
        { title: "Workspace Settings", description: "Customize workspace settings and preferences for optimal productivity." },
        { title: "Multi-Workspace View", description: "Switch between different workspaces seamlessly." }
      ]}
      benefits={[
        { title: "Better Organization", description: "Keep projects and work organized in dedicated workspace environments." },
        { title: "Improved Collaboration", description: "Enhanced collaboration within focused workspace contexts." },
        { title: "Focused Work", description: "Stay focused on specific projects with dedicated workspace views." }
      ]}
      useCases={[
        { title: "Project Management", description: "Manage multiple projects with separate workspaces for each." },
        { title: "Team Collaboration", description: "Collaborate effectively within project workspaces with shared resources." },
        { title: "Resource Access", description: "Quickly access project-specific resources and documentation." }
      ]}
    />
  );
};

export default WorkspaceManagement;


