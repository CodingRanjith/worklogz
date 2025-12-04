import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeCommunity = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Community Hub</h1>
        <p className="intro-subtitle">
          Connect with colleagues, join groups, and participate in company community activities.
        </p>

        <h2 id="overview">Community Overview</h2>
        <p>
          The Community Hub allows you to connect with colleagues, join interest groups, 
          and participate in company-wide activities.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="👥"
            title="Employee Directory"
            description="Browse and connect with colleagues"
          />
          <FeatureCard
            icon="💬"
            title="Groups"
            description="Join interest-based groups"
          />
          <FeatureCard
            icon="📢"
            title="Announcements"
            description="View company announcements"
          />
          <FeatureCard
            icon="🎉"
            title="Events"
            description="Participate in company events"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeCommunity;

