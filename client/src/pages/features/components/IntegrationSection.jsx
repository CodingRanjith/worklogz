import React from 'react';
import { 
  FiSlack, FiZap, FiMail, FiCalendar, FiFileText, FiUsers,
  FiBriefcase, FiDollarSign, FiBarChart2, FiShield, FiCloud,
  FiGitBranch, FiPackage, FiServer, FiDatabase, FiGlobe
} from 'react-icons/fi';
import './IntegrationSection.css';

const integrationIcons = {
  slack: <FiSlack />,
  zapier: <FiZap />,
  email: <FiMail />,
  calendar: <FiCalendar />,
  google: <FiGlobe />,
  microsoft: <FiBriefcase />,
  dropbox: <FiCloud />,
  github: <FiGitBranch />,
  salesforce: <FiUsers />,
  quickbooks: <FiDollarSign />,
  analytics: <FiBarChart2 />,
  security: <FiShield />,
  storage: <FiCloud />,
  api: <FiServer />,
  database: <FiDatabase />,
  documents: <FiFileText />,
  default: <FiPackage />
};

const IntegrationSection = ({ integrations = [] }) => {
  if (!integrations || integrations.length === 0) {
    return null;
  }

  return (
    <section className="integrations-section">
      <div className="integrations-container">
        <div className="integrations-header">
          <h2 className="integrations-title">Integrations</h2>
          <p className="integrations-subtitle">
            Seamlessly connect with your favorite tools and services
          </p>
        </div>

        <div className="integrations-grid">
          {integrations.map((integration, index) => {
            const iconKey = integration.icon || integration.name?.toLowerCase() || 'default';
            const IconComponent = integrationIcons[iconKey] || integrationIcons.default;
            
            return (
              <div key={index} className="integration-card">
                <div className="integration-icon-wrapper">
                  {integration.customIcon || IconComponent}
                </div>
                <h3 className="integration-name">{integration.name}</h3>
                <p className="integration-description">{integration.description}</p>
                {integration.status && (
                  <div className={`integration-status status-${integration.status}`}>
                    {integration.status === 'available' ? 'Available' : 
                     integration.status === 'coming-soon' ? 'Coming Soon' : 
                     integration.status === 'beta' ? 'Beta' : 'Available'}
                  </div>
                )}
                {integration.link && (
                  <a 
                    href={integration.link} 
                    className="integration-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="integrations-cta">
          <p className="integrations-cta-text">
            Need a specific integration? <a href="/docs/integrations">View all integrations</a> or 
            <a href="/docs/contact"> contact us</a> for custom integration support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;

