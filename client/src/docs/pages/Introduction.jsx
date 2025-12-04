import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';
import './Introduction.css';

const Introduction = () => {
  const features = [
    {
      icon: '☁️',
      title: 'Backend-agnostic',
      description: 'Connect to any backend service with flexible API integration.'
    },
    {
      icon: '🧬',
      title: 'Adaptable',
      description: 'Perfect for workforce management, attendance tracking, CRM, and business operations.'
    },
    {
      icon: '⚙️',
      title: 'Highly Customizable',
      description: 'Tailor the UI with extensive theme options and component customization.'
    },
    {
      icon: '✨',
      title: 'Modular',
      description: 'Pick and choose the features you want. Swap any part of the UI with your own implementation.'
    },
    {
      icon: '⚡',
      title: 'Performance Optimized',
      description: 'Built for speed and smooth animations with optimized rendering.'
    },
    {
      icon: '🌐',
      title: 'Cross-Platform',
      description: 'Supports web browsers with responsive design for all devices.'
    },
    {
      icon: '📖',
      title: 'Open Source',
      description: 'Free to use and customize for your organization.'
    }
  ];

  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Introduction</h1>
        <p className="intro-subtitle">
          Ship faster with a comprehensive workforce management platform for modern organizations.
        </p>
        
        <p>
          Worklogz is an open-source workforce management platform designed for performance, 
          customization, and ease of integration. Whether you're managing employee attendance, 
          tracking projects, handling CRM pipelines, or processing payroll, Worklogz provides 
          the tools you need to streamline your operations.
        </p>

        <h2 id="features">Features ✨</h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <h2 id="motivation">Motivation 🏗️</h2>
        
        <p>
          Worklogz was built to solve the common challenges faced by organizations in managing 
          their workforce and operations. Traditional solutions are often rigid, expensive, and 
          difficult to customize. We set out to create a platform that is:
        </p>

        <ul>
          <li><strong>Flexible:</strong> Adapt to your organization's unique needs</li>
          <li><strong>Affordable:</strong> Open-source solution without licensing fees</li>
          <li><strong>Modern:</strong> Built with the latest web technologies</li>
          <li><strong>Scalable:</strong> Grow with your organization</li>
          <li><strong>User-Friendly:</strong> Intuitive interface for both employees and administrators</li>
        </ul>

        <h2 id="getting-started">Quick Start</h2>
        
        <p>
          Get started with Worklogz in minutes. The platform is designed to be easy to set up 
          and configure for your organization's needs.
        </p>

        <CodeBlock language="bash">
{`# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build`}
        </CodeBlock>

        <div className="cta-section">
          <h3>Ready to get started?</h3>
          <p>
            Check out our <a href="/docs/getting-started/quick-start">Quick Start Guide</a> to 
            begin using Worklogz in your organization.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
};

export default Introduction;

