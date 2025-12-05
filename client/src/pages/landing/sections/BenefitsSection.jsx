import React from 'react';
import { FiTrendingUp, FiTarget, FiUsers, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';
import './BenefitsSection.css';

const BenefitsSection = () => {
  const benefits = {
    organizations: {
      title: 'For Organizations',
      icon: <FiTarget />,
      items: [
        'Reduced administrative overhead',
        'Improved accuracy in attendance and payroll',
        'Better employee engagement',
        'Data-driven decision making',
        'Scalable business operations',
        'Enhanced customer relationship management'
      ]
    },
    admins: {
      title: 'For Administrators',
      icon: <FiUsers />,
      items: [
        'Centralized employee management',
        'Automated attendance tracking',
        'Streamlined payroll processing',
        'Comprehensive analytics and insights',
        'Efficient task and project management',
        'CRM capabilities for business growth',
        'Document automation'
      ]
    },
    employees: {
      title: 'For Employees',
      icon: <FiClock />,
      items: [
        'Easy attendance tracking',
        'Transparent salary and earnings visibility',
        'Simple leave application process',
        'Performance tracking',
        'Access to company resources and community',
        'Mobile-friendly interface'
      ]
    }
  };

  return (
    <section className="benefits-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Benefits for Everyone</h2>
          <p className="section-subtitle">
            Worklogz delivers value to organizations, administrators, and employees
          </p>
        </div>

        <div className="benefits-grid">
          {Object.values(benefits).map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <ul className="benefit-list">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

