import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';
import './Introduction.css';

const Introduction = () => {
  const features = [
    {
      icon: '✅',
      title: 'Attendance Tracking',
      description: 'Easy check-in and check-out with location verification and work mode selection.'
    },
    {
      icon: '📝',
      title: 'Timesheet Management',
      description: 'Log your daily work activities and track time spent on different projects.'
    },
    {
      icon: '🏖️',
      title: 'Leave Management',
      description: 'Apply for leaves, track your leave balance, and monitor approval status.'
    },
    {
      icon: '📊',
      title: 'Performance Dashboard',
      description: 'Monitor your performance metrics, achievements, and progress.'
    },
    {
      icon: '💰',
      title: 'Earnings & Payslips',
      description: 'Access your salary information, payslips, and payment history.'
    },
    {
      icon: '🎯',
      title: 'Goals & Achievements',
      description: 'Set professional goals, track progress, and celebrate achievements.'
    },
    {
      icon: '📅',
      title: 'Calendar View',
      description: 'View your schedule, attendance, leaves, and important dates.'
    },
    {
      icon: '👥',
      title: 'Community Hub',
      description: 'Connect with colleagues, join groups, and participate in activities.'
    }
  ];

  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Welcome to Worklogz</h1>
        <p className="intro-subtitle">
          Your all-in-one platform for managing work, tracking attendance, and achieving your professional goals.
        </p>
        
        <p>
          Worklogz is a comprehensive workforce management platform designed to help you manage your work 
          efficiently. Whether you're tracking your attendance, logging timesheets, managing leaves, 
          monitoring your performance, or accessing your earnings, Worklogz provides all the tools you 
          need in one convenient place.
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

        <h2 id="why-worklogz">Why Worklogz? 🎯</h2>
        
        <p>
          Worklogz is designed to make your work life easier and more organized. Here's what makes 
          it special:
        </p>

        <ul>
          <li><strong>Easy to Use:</strong> Intuitive interface that anyone can navigate</li>
          <li><strong>All-in-One:</strong> Everything you need in one platform</li>
          <li><strong>Mobile-Friendly:</strong> Access from any device, anywhere</li>
          <li><strong>Real-Time Updates:</strong> Get instant updates on your work status</li>
          <li><strong>Secure:</strong> Your data is protected with enterprise-grade security</li>
        </ul>

        <h2 id="getting-started">Getting Started</h2>
        
        <p>
          Ready to start using Worklogz? It's simple and straightforward. Follow our 
          quick start guide to learn how to use all the features available to you.
        </p>

        <div className="cta-section">
          <h3>Ready to explore?</h3>
          <p>
            Check out our <a href="/docs/getting-started/quick-start">Quick Start Guide</a> to 
            learn how to use Worklogz and discover all available features.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
};

export default Introduction;

