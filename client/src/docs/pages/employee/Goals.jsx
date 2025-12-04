import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeGoals = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Goals & Achievements</h1>
        <p className="intro-subtitle">
          Set goals, track progress, and celebrate achievements. Monitor your professional growth.
        </p>

        <h2 id="overview">Goals Overview</h2>
        <p>
          The Goals & Achievements module helps you set professional goals, track your progress, 
          and celebrate milestones and achievements.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎯"
            title="Set Goals"
            description="Create and manage your professional goals"
          />
          <FeatureCard
            icon="📊"
            title="Track Progress"
            description="Monitor progress towards your goals"
          />
          <FeatureCard
            icon="🏆"
            title="Achievements"
            description="View and celebrate your achievements"
          />
          <FeatureCard
            icon="📈"
            title="Analytics"
            description="Analyze your goal completion patterns"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeGoals;

