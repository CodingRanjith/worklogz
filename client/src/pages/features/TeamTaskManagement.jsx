import React from 'react';
import { FiFolder } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const TeamTaskManagement = () => {
  return (
    <FeatureDetailPage
      title="Team Task Management"
      description="Collaborate on team tasks with shared assignments and updates. Manage team projects, track progress, and work together efficiently."
      icon={<FiFolder />}
      image={null}
      moduleType="User"
      features={[
        { title: "Shared Task Lists", description: "Create and manage shared task lists for team collaboration." },
        { title: "Task Assignment", description: "Assign tasks to team members with due dates and priorities." },
        { title: "Progress Tracking", description: "Track progress of team tasks in real-time." },
        { title: "Task Dependencies", description: "Define task dependencies and relationships." },
        { title: "Team Updates", description: "Receive updates on team task progress and completions." },
        { title: "Task Comments", description: "Add comments and discussions on tasks for collaboration." },
        { title: "File Attachments", description: "Attach files and resources to team tasks." },
        { title: "Task Analytics", description: "View analytics and reports on team task performance." }
      ]}
      benefits={[
        { title: "Better Coordination", description: "Coordinate team work effectively with shared task management." },
        { title: "Clear Accountability", description: "Clear task assignments ensure accountability." },
        { title: "Improved Visibility", description: "Visibility of team progress and workload distribution." }
      ]}
      useCases={[
        { title: "Project Management", description: "Manage project tasks and track team progress." },
        { title: "Team Collaboration", description: "Collaborate on shared tasks and assignments." },
        { title: "Workload Management", description: "Distribute work evenly across team members." }
      ]}
    />
  );
};

export default TeamTaskManagement;


