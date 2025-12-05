import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlug, FiCode, FiWebhook, FiCheckCircle } from 'react-icons/fi';
import './IntegrationsSection.css';

const IntegrationsSection = () => {
  const integrations = [
    { name: 'Email', category: 'Communication' },
    { name: 'Slack', category: 'Communication' },
    { name: 'Microsoft Teams', category: 'Communication' },
    { name: 'Payroll Systems', category: 'Payroll' },
    { name: 'HRMS', category: 'HR' },
    { name: 'Jira', category: 'Project Management' },
    { name: 'Trello', category: 'Project Management' },
    { name: 'Google Drive', category: 'Storage' },
    { name: 'Cloudinary', category: 'Storage' }
  ];

  return (
    <section className="integrations-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Integrations & API</h2>
          <p className="section-subtitle">
            Connect Worklogz with your existing tools and workflows
          </p>
        </div>

        <div className="integrations-content">
          <div className="integrations-features">
            <div className="integration-feature-card">
              <FiPlug className="feature-icon" />
              <h3>RESTful API</h3>
              <p>Standard REST API for custom integrations and automation</p>
            </div>
            <div className="integration-feature-card">
              <FiWebhook className="feature-icon" />
              <h3>Webhooks</h3>
              <p>Real-time notifications and event triggers for your systems</p>
            </div>
            <div className="integration-feature-card">
              <FiCode className="feature-icon" />
              <h3>Custom Integrations</h3>
              <p>Build custom integrations with comprehensive API documentation</p>
            </div>
          </div>

          <div className="integrations-list">
            <h3 className="integrations-list-title">Popular Integrations</h3>
            <div className="integrations-grid">
              {integrations.map((integration, index) => (
                <div key={index} className="integration-item">
                  <FiCheckCircle className="integration-check" />
                  <span className="integration-name">{integration.name}</span>
                  <span className="integration-category">{integration.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-cta">
          <Link to="/docs/integrations" className="btn-link">
            View All Integrations <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;

