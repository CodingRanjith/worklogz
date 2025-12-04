import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminHelpdesk = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Helpdesk Management</h1>
        <p className="intro-subtitle">
          Manage support tickets, assign agents, and track ticket resolution across your organization.
        </p>

        <h2 id="overview">Helpdesk Overview</h2>
        <p>
          The Helpdesk module allows administrators to manage support tickets, assign them to agents, 
          track resolution times, and monitor support performance.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎫"
            title="Ticket Management"
            description="View and manage all support tickets"
          />
          <FeatureCard
            icon="👤"
            title="Agent Assignment"
            description="Assign tickets to support agents"
          />
          <FeatureCard
            icon="📊"
            title="Performance Tracking"
            description="Monitor support team performance"
          />
          <FeatureCard
            icon="🏷️"
            title="Category Management"
            description="Organize tickets by category and priority"
          />
        </div>

        <h2 id="ticket-categories">Ticket Categories</h2>
        <ul>
          <li>General</li>
          <li>Technical</li>
          <li>Payroll</li>
          <li>HR</li>
          <li>IT</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminHelpdesk;

