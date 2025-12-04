import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const BestPractices = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Best Practices</h1>
        <p className="intro-subtitle">
          Follow these best practices to ensure optimal performance and maintainability.
        </p>

        <h2 id="overview">Best Practices Overview</h2>
        <p>
          Following best practices ensures your Worklogz implementation is performant, 
          maintainable, and secure.
        </p>

        <h2 id="practices">Key Practices</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🔒"
            title="Security"
            description="Always use HTTPS, validate inputs, and protect sensitive data"
          />
          <FeatureCard
            icon="⚡"
            title="Performance"
            description="Optimize API calls, use lazy loading, and cache data"
          />
          <FeatureCard
            icon="🧹"
            title="Code Quality"
            description="Follow coding standards, write clean code, and document"
          />
          <FeatureCard
            icon="🧪"
            title="Testing"
            description="Write tests, test edge cases, and maintain test coverage"
          />
        </div>

        <h2 id="security-practices">Security Practices</h2>
        <ul>
          <li>Never expose API keys in client code</li>
          <li>Validate all user inputs</li>
          <li>Use HTTPS in production</li>
          <li>Implement proper error handling</li>
          <li>Keep dependencies updated</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default BestPractices;

