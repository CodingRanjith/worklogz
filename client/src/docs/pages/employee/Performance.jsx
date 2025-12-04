import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeePerformance = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Performance Dashboard</h1>
        <p className="intro-subtitle">
          Monitor your performance metrics, view achievements, and track your progress.
        </p>

        <h2 id="overview">Performance Overview</h2>
        <p>
          The Performance Dashboard provides insights into your work performance, achievements, 
          and areas for improvement.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📊"
            title="Performance Metrics"
            description="View your performance scores and metrics"
          />
          <FeatureCard
            icon="🎯"
            title="Goals Tracking"
            description="Track your performance goals"
          />
          <FeatureCard
            icon="🏆"
            title="Achievements"
            description="View your achievements and milestones"
          />
          <FeatureCard
            icon="📈"
            title="Progress Charts"
            description="Visual representation of your progress"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeePerformance;

