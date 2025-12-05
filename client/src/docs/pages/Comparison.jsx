import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Comparison = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Best Timesheet Software Comparison</h1>
        <p className="intro-subtitle">
          How Worklogz stands out against old-school Excel sheets or competitors.
        </p>

        <h2 id="vs-excel">Worklogz vs. Excel Spreadsheets</h2>
        
        <h3>Excel Limitations</h3>
        <ul>
          <li>Manual data entry errors</li>
          <li>No real-time tracking</li>
          <li>Difficult collaboration</li>
          <li>No automated calculations</li>
          <li>Limited reporting capabilities</li>
          <li>No mobile access</li>
          <li>Security concerns</li>
          <li>Version control issues</li>
        </ul>

        <h3>Worklogz Advantages</h3>
        <div className="features-grid">
          <FeatureCard
            icon="✅"
            title="Automated Tracking"
            description="Automatic time tracking eliminates manual errors"
          />
          <FeatureCard
            icon="📱"
            title="Mobile Access"
            description="Access from any device, anywhere"
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Centralized"
            description="Cloud-based security and centralized data"
          />
          <FeatureCard
            icon="📊"
            title="Advanced Analytics"
            description="Real-time analytics and insights"
          />
        </div>

        <h2 id="vs-competitors">Worklogz vs. Competitors</h2>
        
        <h3>Key Differentiators</h3>
        <ul>
          <li><strong>All-in-One Platform:</strong> Comprehensive solution vs. point solutions</li>
          <li><strong>CRM Integration:</strong> Built-in CRM pipelines for business growth</li>
          <li><strong>Affordable Pricing:</strong> Competitive pricing with flexible plans</li>
          <li><strong>White-Labeling:</strong> Rebrand as your own product</li>
          <li><strong>Self-Hosted Option:</strong> Complete control over your data</li>
          <li><strong>Customization:</strong> Highly customizable to fit your needs</li>
        </ul>

        <h2 id="unique-features">Unique Features</h2>
        <ul>
          <li>Camera verification for attendance</li>
          <li>Daily salary credit system</li>
          <li>Specialized CRM pipelines</li>
          <li>Document generation (letters)</li>
          <li>Comprehensive analytics</li>
          <li>Helpdesk system integration</li>
        </ul>

        <h2 id="value-proposition">Value Proposition</h2>
        <p>
          Worklogz combines the best features of modern workforce management with affordability 
          and flexibility, making it an ideal choice for organizations of all sizes.
        </p>
      </div>
    </DocsLayout>
  );
};

export default Comparison;

