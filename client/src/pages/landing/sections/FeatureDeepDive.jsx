import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, FiCalendar, FiDollarSign, FiBarChart2,
  FiUsers, FiBriefcase, FiShield, FiZap
} from 'react-icons/fi';
import './FeatureDeepDive.css';

const FeatureDeepDive = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FiClock />,
      title: 'Smart Attendance Tracking',
      description: 'Advanced attendance management with camera verification, location tracking, and flexible work modes.',
      details: [
        'Real-time check-in/check-out with photo capture',
        'Location-based verification for accuracy',
        'Support for Office, Remote, and Hybrid work modes',
        'Weekly hours tracking and daily earnings calculation',
        'Complete attendance history and calendar view'
      ],
      image: 'attendance'
    },
    {
      icon: <FiCalendar />,
      title: 'Comprehensive Timesheet Management',
      description: 'Project-based time tracking with automated workflows and detailed reporting.',
      details: [
        'Daily time logging with project association',
        'Multiple entries per day support',
        'Automated submission and approval workflows',
        'Complete timesheet history and analytics',
        'Integration with payroll and billing'
      ],
      image: 'timesheet'
    },
    {
      icon: <FiDollarSign />,
      title: 'Automated Payroll Processing',
      description: 'Streamlined payroll with daily salary credits, automated payslip generation, and payment tracking.',
      details: [
        'Daily salary credit system',
        'Automated payslip generation (PDF)',
        'Complete salary history tracking',
        'Payment transaction records',
        'Tax and deduction management'
      ],
      image: 'payroll'
    },
    {
      icon: <FiBriefcase />,
      title: 'Specialized CRM Pipelines',
      description: 'Three dedicated CRM pipelines for Course, Internship, and IT Projects management.',
      details: [
        'Course CRM for educational programs',
        'Internship CRM for placement management',
        'IT Projects CRM for client projects',
        'Lead tracking and conversion analytics',
        'Payment and progress tracking'
      ],
      image: 'crm'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Advanced Analytics & Reporting',
      description: 'Comprehensive analytics dashboard with customizable reports and insights.',
      details: [
        'Real-time dashboard analytics',
        'Department and employee analytics',
        'Customizable report generation',
        'Export to PDF, Excel, CSV',
        'Trend analysis and forecasting'
      ],
      image: 'analytics'
    }
  ];

  return (
    <section className="feature-deep-dive-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Explore Key Features in Depth</h2>
          <p className="section-subtitle">
            Discover how Worklogz features can transform your operations
          </p>
        </div>

        <div className="feature-tabs">
          {features.map((feature, index) => (
            <button
              key={index}
              className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="tab-icon">{feature.icon}</div>
              <span className="tab-title">{feature.title}</span>
            </button>
          ))}
        </div>

        <div className="feature-detail">
          <div className="feature-detail-content">
            <div className="feature-icon-large">{features[activeFeature].icon}</div>
            <h3 className="feature-detail-title">{features[activeFeature].title}</h3>
            <p className="feature-detail-description">{features[activeFeature].description}</p>
            <ul className="feature-detail-list">
              {features[activeFeature].details.map((detail, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {detail}
                </li>
              ))}
            </ul>
            <Link to="/docs/detailed-features" className="btn-link">
              Learn More <span>→</span>
            </Link>
          </div>
          <div className="feature-detail-visual">
            <div className={`feature-image-placeholder ${features[activeFeature].image}`}>
              {/* Placeholder for feature screenshot */}
              <div className="mockup-screen">
                <div className="screen-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureDeepDive;

