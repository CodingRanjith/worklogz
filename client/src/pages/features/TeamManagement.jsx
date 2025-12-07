import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const TeamManagement = () => {
  return (
    <FeatureDetailPage
      title="Team Management"
      description="Manage team members, assignments, and collaboration. View team structure, track team activities, and work together effectively."
      icon={<FiUsers />}
      image={null}
      moduleType="User"
      features={[
        { title: "Team View", description: "View all team members, roles, and responsibilities at a glance." },
        { title: "Team Activities", description: "Track team activities, updates, and progress in real-time." },
        { title: "Assignment Management", description: "View and manage team assignments and work distribution." },
        { title: "Team Communication", description: "Communicate with team members through integrated messaging." },
        { title: "Team Calendar", description: "Shared calendar for team events, meetings, and deadlines." },
        { title: "Performance Overview", description: "View team performance metrics and achievements." },
        { title: "Resource Sharing", description: "Share resources, documents, and knowledge within the team." },
        { title: "Team Goals", description: "Set and track team goals and objectives collectively." }
      ]}
      benefits={[
        { title: "Better Coordination", description: "Coordinate effectively with all team members." },
        { title: "Clear Visibility", description: "Clear visibility of team structure and activities." },
        { title: "Improved Collaboration", description: "Enhanced collaboration through better team management." }
      ]}
      useCases={[
        { title: "Team Coordination", description: "Coordinate work and track progress across team members." },
        { title: "Resource Sharing", description: "Share resources and knowledge within the team efficiently." },
        { title: "Goal Alignment", description: "Align team goals and track collective achievements." }
      ]}
    />
  );
};

export default TeamManagement;

