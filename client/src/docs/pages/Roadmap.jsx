import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Roadmap = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Roadmap & Future Enhancements</h1>
        <p className="intro-subtitle">
          Upcoming features, long-term vision, and system improvements.
        </p>

        <h2 id="upcoming-features">Upcoming Features</h2>
        
        <h3>Q1 2024</h3>
        <ul>
          <li>Mobile application (iOS & Android)</li>
          <li>Advanced reporting dashboard</li>
          <li>Multi-language support expansion</li>
          <li>Enhanced API capabilities</li>
        </ul>

        <h3>Q2 2024</h3>
        <ul>
          <li>AI-powered analytics</li>
          <li>Advanced workflow automation</li>
          <li>Enhanced integration marketplace</li>
          <li>Improved mobile experience</li>
        </ul>

        <h3>Q3 2024</h3>
        <ul>
          <li>Multi-tenant architecture</li>
          <li>Advanced customization tools</li>
          <li>Enhanced security features</li>
          <li>Performance optimizations</li>
        </ul>

        <h2 id="long-term-vision">Long-Term Vision</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🤖"
            title="AI Integration"
            description="Intelligent automation and predictive analytics"
          />
          <FeatureCard
            icon="🌍"
            title="Global Expansion"
            description="Support for more regions and languages"
          />
          <FeatureCard
            icon="🔗"
            title="Ecosystem Growth"
            description="Expanded integration marketplace"
          />
          <FeatureCard
            icon="⚡"
            title="Performance Excellence"
            description="Continuous performance improvements"
          />
        </div>

        <h2 id="improvement-areas">Improvement Areas</h2>
        <ul>
          <li>User experience enhancements</li>
          <li>Performance optimization</li>
          <li>Security hardening</li>
          <li>Scalability improvements</li>
          <li>Feature enhancements</li>
        </ul>

        <h2 id="community-feedback">Community Feedback</h2>
        <p>
          We value user feedback and incorporate it into our roadmap. Share your ideas and 
          suggestions to help shape the future of Worklogz.
        </p>
      </div>
    </DocsLayout>
  );
};

export default Roadmap;

