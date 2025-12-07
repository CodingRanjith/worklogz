import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const CommunityManagement = () => {
  return (
    <FeatureDetailPage
      title="Community Management"
      description="Build and manage internal communities for collaboration, engagement, and knowledge sharing. Connect with colleagues and participate in team discussions."
      icon={<FiUsers />}
      image={null}
      moduleType="User"
      features={[
        { title: "Community Groups", description: "Create and join community groups based on interests, projects, or departments." },
        { title: "Discussion Forums", description: "Participate in discussions, ask questions, and share knowledge with the team." },
        { title: "Activity Feed", description: "Stay updated with community activities, posts, and announcements." },
        { title: "Member Directory", description: "Browse and connect with community members and colleagues." },
        { title: "Event Organization", description: "Create and manage community events, meetings, and activities." },
        { title: "Knowledge Base", description: "Share and access knowledge articles, resources, and best practices." }
      ]}
      benefits={[
        { title: "Enhanced Collaboration", description: "Foster better collaboration through active community engagement." },
        { title: "Knowledge Sharing", description: "Share knowledge and learn from colleagues across the organization." },
        { title: "Team Building", description: "Build stronger relationships and team cohesion through community activities." }
      ]}
      useCases={[
        { title: "Project Discussions", description: "Teams can create project-specific communities for focused discussions." },
        { title: "Learning Groups", description: "Employees can form learning groups to share skills and knowledge." },
        { title: "Social Engagement", description: "Build a social network within the organization for better engagement." }
      ]}
    />
  );
};

export default CommunityManagement;

