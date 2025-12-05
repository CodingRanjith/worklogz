import React from 'react';
import { FiUserPlus, FiSettings, FiUsers, FiTrendingUp } from 'react-icons/fi';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <FiUserPlus />,
      title: 'Sign Up & Configure',
      description: 'Create your account and configure your organization settings, departments, and preferences.'
    },
    {
      number: '02',
      icon: <FiUsers />,
      title: 'Add Your Team',
      description: 'Invite employees or allow them to register. Set up roles, permissions, and schedules.'
    },
    {
      number: '03',
      icon: <FiSettings />,
      title: 'Customize Workflows',
      description: 'Set up attendance rules, payroll settings, leave policies, and approval workflows.'
    },
    {
      number: '04',
      icon: <FiTrendingUp />,
      title: 'Start Managing',
      description: 'Begin tracking attendance, processing timesheets, managing projects, and growing your business.'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started with Worklogz in four simple steps
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

