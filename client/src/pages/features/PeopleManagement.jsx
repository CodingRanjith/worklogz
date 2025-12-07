import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const PeopleManagement = () => {
  return (
    <FeatureDetailPage
      title="People Management"
      description="Connect and interact with colleagues and team members. Build your professional network, view profiles, and collaborate effectively."
      icon={<FiUsers />}
      image={null}
      moduleType="User"
      features={[
        { title: "Employee Directory", description: "Browse complete employee directory with search and filter options." },
        { title: "Profile Viewing", description: "View detailed profiles of colleagues including skills and expertise." },
        { title: "Contact Information", description: "Access contact details and communication channels for team members." },
        { title: "Organization Chart", description: "View organizational hierarchy and reporting structure." },
        { title: "Team Discovery", description: "Discover teams and departments across the organization." },
        { title: "Skill Search", description: "Find colleagues with specific skills or expertise." },
        { title: "Connection Requests", description: "Send and manage connection requests with colleagues." },
        { title: "Activity Status", description: "See availability and activity status of team members." }
      ]}
      benefits={[
        { title: "Better Networking", description: "Build professional relationships within the organization." },
        { title: "Easy Collaboration", description: "Find the right people for collaboration and support." },
        { title: "Team Awareness", description: "Stay aware of team structure and key contacts." }
      ]}
      useCases={[
        { title: "Finding Experts", description: "Find colleagues with specific expertise for project help." },
        { title: "Team Building", description: "Connect with team members for better collaboration." },
        { title: "Organization Navigation", description: "Understand organizational structure and reporting lines." }
      ]}
    />
  );
};

export default PeopleManagement;


