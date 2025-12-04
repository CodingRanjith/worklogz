import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeSkills = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Skill Development</h1>
        <p className="intro-subtitle">
          Enhance your skills, access learning resources, and track your professional development.
        </p>

        <h2 id="overview">Skill Development Overview</h2>
        <p>
          The Skill Development module provides tools and resources to help you enhance your 
          professional skills and track your learning progress.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📚"
            title="Learning Resources"
            description="Access courses and learning materials"
          />
          <FeatureCard
            icon="💬"
            title="AI Assistant"
            description="Get help from AI-powered learning assistant"
          />
          <FeatureCard
            icon="📊"
            title="Progress Tracking"
            description="Track your skill development progress"
          />
          <FeatureCard
            icon="🏆"
            title="Certifications"
            description="Earn and display certifications"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeSkills;

