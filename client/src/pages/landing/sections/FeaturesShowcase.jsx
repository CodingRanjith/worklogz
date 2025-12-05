import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, FiCalendar, FiDollarSign, FiBarChart2, 
  FiUsers, FiBriefcase, FiFileText, FiShield 
} from 'react-icons/fi';
import './FeaturesShowcase.css';

const FeaturesShowcase = () => {
  const features = [
    {
      icon: <FiClock />,
      title: 'Attendance Tracking',
      description: 'Real-time check-in/out with camera verification and location tracking'
    },
    {
      icon: <FiCalendar />,
      title: 'Timesheet Management',
      description: 'Project-based time tracking with automated submission and approval'
    },
    {
      icon: <FiDollarSign />,
      title: 'Payroll & Salary',
      description: 'Automated payroll processing with daily salary credits and payslip generation'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics, dashboards, and customizable reports'
    },
    {
      icon: <FiUsers />,
      title: 'User Management',
      description: 'Complete user management with role-based access control'
    },
    {
      icon: <FiBriefcase />,
      title: 'CRM Pipelines',
      description: 'Three specialized CRM pipelines for Course, Internship, and IT Projects'
    },
    {
      icon: <FiFileText />,
      title: 'Document Management',
      description: 'Generate experience letters, offer letters, and manage documents'
    },
    {
      icon: <FiShield />,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with encryption and compliance standards'
    }
  ];

  return (
    <section className="features-showcase-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Powerful Features for Modern Teams</h2>
          <p className="section-subtitle">
            Everything you need to manage your workforce, all in one platform
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <Link to="/docs/detailed-features" className="btn-link">
            Explore All Features <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;

