import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const HelpdeskSolver = () => {
  return (
    <FeatureDetailPage
      title="Helpdesk Solver"
      description="Resolve helpdesk tickets and provide support solutions. Manage support tickets, assign to team members, track resolution, and ensure customer satisfaction."
      icon={<FiHelpCircle />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Ticket Management", description: "View and manage all helpdesk tickets from centralized dashboard." },
        { title: "Ticket Assignment", description: "Assign tickets to support team members based on expertise." },
        { title: "Priority Management", description: "Set and manage ticket priorities for urgent issues." },
        { title: "Resolution Tracking", description: "Track ticket resolution progress and SLA compliance." },
        { title: "Knowledge Base Management", description: "Create and manage knowledge base articles for self-service." },
        { title: "Response Templates", description: "Use response templates for common issues and queries." },
        { title: "Ticket Analytics", description: "Analyze ticket trends, resolution times, and team performance." },
        { title: "Escalation Management", description: "Manage ticket escalations and complex issue handling." }
      ]}
      benefits={[
        { title: "Quick Resolution", description: "Resolve tickets quickly with efficient management tools." },
        { title: "Better Service", description: "Provide better support service with organized ticket management." },
        { title: "Performance Tracking", description: "Track support team performance and improvement areas." }
      ]}
      useCases={[
        { title: "Issue Resolution", description: "Resolve employee and customer issues efficiently." },
        { title: "Support Management", description: "Manage support operations and team workload." },
        { title: "Quality Improvement", description: "Improve support quality with analytics and insights." }
      ]}
    />
  );
};

export default HelpdeskSolver;

