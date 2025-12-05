import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBook, FiMonitor, FiBriefcase, FiFactory, 
  FiHeart, FiBuilding, FiGlobe, FiUser 
} from 'react-icons/fi';
import './SolutionsByIndustry.css';

const SolutionsByIndustry = () => {
  const industries = [
    {
      icon: <FiBook />,
      title: 'EdTech & Education',
      description: 'Manage courses, trainers, students, and educational programs',
      link: '/for-education'
    },
    {
      icon: <FiMonitor />,
      title: 'IT Services',
      description: 'Track project time, manage clients, and monitor development teams',
      link: '/for-business'
    },
    {
      icon: <FiBriefcase />,
      title: 'Agencies',
      description: 'Client management, project tracking, and team coordination',
      link: '/for-business'
    },
    {
      icon: <FiFactory />,
      title: 'Manufacturing',
      description: 'Shift management, production hours, and workforce scheduling',
      link: '/for-business'
    },
    {
      icon: <FiHeart />,
      title: 'Healthcare',
      description: 'Staff scheduling, shift management, and compliance tracking',
      link: '/for-enterprise'
    },
    {
      icon: <FiBuilding />,
      title: 'Construction',
      description: 'Site attendance, project tracking, and contractor management',
      link: '/for-business'
    },
    {
      icon: <FiGlobe />,
      title: 'Remote Teams',
      description: 'Virtual attendance tracking and distributed team management',
      link: '/for-business'
    },
    {
      icon: <FiUser />,
      title: 'Freelancers',
      description: 'Time tracking, project billing, and client management',
      link: '/for-individuals'
    }
  ];

  return (
    <section className="solutions-industry-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Solutions for Every Industry</h2>
          <p className="section-subtitle">
            Worklogz adapts to your industry-specific needs
          </p>
        </div>

        <div className="industries-grid">
          {industries.map((industry, index) => (
            <Link 
              key={index} 
              to={industry.link}
              className="industry-card"
            >
              <div className="industry-icon">{industry.icon}</div>
              <h3 className="industry-title">{industry.title}</h3>
              <p className="industry-description">{industry.description}</p>
              <span className="industry-link">Learn more →</span>
            </Link>
          ))}
        </div>

        <div className="section-cta">
          <Link to="/docs/industries" className="btn-link">
            View All Industries <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SolutionsByIndustry;

