import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../../../components/SEO/MetaTags';
import LandingHeader from '../../landing/components/LandingHeader';
import LandingFooter from '../../landing/components/LandingFooter';
import IntegrationSection from './IntegrationSection';
import './FeatureDetailPageEnhanced.css';
import './IntegrationSection.css';

const FeatureDetailPageEnhanced = ({ 
  title, 
  description, 
  icon, 
  image, 
  features = [], 
  benefits = [],
  useCases = [],
  integrations = [],
  statistics = [],
  layoutType = 'default', // 'default', 'dashboard', 'card-grid', 'minimal', 'detailed'
  moduleType = 'User',
  additionalContent = null
}) => {
  const renderFeaturesByLayout = () => {
    switch(layoutType) {
      case 'dashboard':
        return renderDashboardLayout();
      case 'card-grid':
        return renderCardGridLayout();
      case 'minimal':
        return renderMinimalLayout();
      case 'detailed':
        return renderDetailedLayout();
      default:
        return renderDefaultLayout();
    }
  };

  const renderDefaultLayout = () => (
    <div className="feature-list-grid">
      {features.map((feature, index) => (
        <div key={index} className="feature-list-item">
          <div className="feature-list-icon">✓</div>
          <div className="feature-list-content">
            <h3 className="feature-list-title">{feature.title}</h3>
            <p className="feature-list-description">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboardLayout = () => (
    <div className="dashboard-layout-grid">
      {features.map((feature, index) => (
        <div key={index} className="dashboard-feature-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-icon">{feature.icon || '📊'}</div>
            <h3 className="dashboard-card-title">{feature.title}</h3>
          </div>
          <p className="dashboard-card-description">{feature.description}</p>
          {feature.stats && (
            <div className="dashboard-card-stats">
              {feature.stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCardGridLayout = () => (
    <div className="card-grid-layout">
      {features.map((feature, index) => (
        <div key={index} className="feature-card-enhanced">
          <div className="card-enhanced-header">
            <div className="card-enhanced-icon">{feature.icon || '✨'}</div>
            <div className="card-enhanced-badge">{feature.category || 'Feature'}</div>
          </div>
          <h3 className="card-enhanced-title">{feature.title}</h3>
          <p className="card-enhanced-description">{feature.description}</p>
          {feature.highlights && (
            <ul className="card-enhanced-highlights">
              {feature.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const renderMinimalLayout = () => (
    <div className="minimal-layout-list">
      {features.map((feature, index) => (
        <div key={index} className="minimal-feature-item">
          <span className="minimal-feature-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="minimal-feature-content">
            <h3 className="minimal-feature-title">{feature.title}</h3>
            <p className="minimal-feature-description">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailedLayout = () => (
    <div className="detailed-layout-container">
      {features.map((feature, index) => (
        <div key={index} className="detailed-feature-item">
          <div className="detailed-feature-left">
            <div className="detailed-feature-icon-wrapper">
              <div className="detailed-feature-icon">{feature.icon || '🎯'}</div>
            </div>
            <div className="detailed-feature-line"></div>
          </div>
          <div className="detailed-feature-right">
            <h3 className="detailed-feature-title">{feature.title}</h3>
            <p className="detailed-feature-description">{feature.description}</p>
            {feature.details && (
              <div className="detailed-feature-details">
                {feature.details.map((detail, idx) => (
                  <div key={idx} className="detail-point">
                    <span className="detail-point-icon">→</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <MetaTags
        title={`${title} - Worklogz Feature | Complete Business Management Platform`}
        description={description}
        keywords={`${title}, worklogz, business management, ${moduleType.toLowerCase()} module, workforce management`}
      />
      <div className={`feature-detail-page-enhanced layout-${layoutType}`}>
        <LandingHeader />
        
        <main className="feature-detail-main-enhanced">
          {/* Hero Section */}
          <div className={`feature-hero-enhanced hero-${layoutType}`}>
            <div className="section-container-enhanced">
              <div className={`hero-content-wrapper layout-${layoutType}`}>
                <div className="hero-content-left">
                  <div className="module-badge-enhanced">
                    <span className="badge-icon">{moduleType === 'User' ? '👤' : '🛡️'}</span>
                    <span>{moduleType} Module</span>
                  </div>
                  <div className="feature-icon-enhanced">{icon}</div>
                  <h1 className="hero-title-enhanced">{title}</h1>
                  <p className="hero-description-enhanced">{description}</p>
                  
                  {statistics.length > 0 && (
                    <div className="hero-statistics">
                      {statistics.map((stat, index) => (
                        <div key={index} className="hero-stat-item">
                          <div className="stat-number">{stat.number}</div>
                          <div className="stat-text">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="hero-cta-enhanced">
                    <Link to="/register" className="btn-primary-enhanced">
                      Get Started Free
                    </Link>
                    <Link to="/#features" className="btn-secondary-enhanced">
                      Explore Features
                    </Link>
                  </div>
                </div>
                
                <div className="hero-content-right">
                  <div className="hero-image-wrapper">
                    {image ? (
                      <img src={image} alt={title} className="hero-image-enhanced" />
                    ) : (
                      <div className="hero-image-placeholder-enhanced">
                        <div className="placeholder-animation">
                          <div className="placeholder-icon-large">{icon}</div>
                          <div className="placeholder-glow"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="feature-content-enhanced">
            <div className="section-container-enhanced">
              
              {/* Key Features Section */}
              {features.length > 0 && (
                <section className="features-section-enhanced">
                  <div className="section-header-enhanced">
                    <h2 className="section-title-enhanced">Key Features</h2>
                    <p className="section-subtitle-enhanced">
                      Discover the powerful capabilities that make {title} essential for your workflow
                    </p>
                  </div>
                  {renderFeaturesByLayout()}
                </section>
              )}

              {/* Benefits Section */}
              {benefits.length > 0 && (
                <section className="benefits-section-enhanced">
                  <div className="section-header-enhanced">
                    <h2 className="section-title-enhanced">Key Benefits</h2>
                    <p className="section-subtitle-enhanced">
                      See how {title} transforms your business operations
                    </p>
                  </div>
                  <div className="benefits-grid-enhanced">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="benefit-card-enhanced">
                        <div className="benefit-icon-enhanced">{benefit.icon || '🎯'}</div>
                        <h3 className="benefit-title-enhanced">{benefit.title}</h3>
                        <p className="benefit-description-enhanced">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Integrations Section */}
              {integrations.length > 0 && (
                <IntegrationSection integrations={integrations} />
              )}

              {/* Use Cases Section */}
              {useCases.length > 0 && (
                <section className="use-cases-section-enhanced">
                  <div className="section-header-enhanced">
                    <h2 className="section-title-enhanced">Use Cases</h2>
                    <p className="section-subtitle-enhanced">
                      Real-world scenarios where {title} makes a difference
                    </p>
                  </div>
                  <div className="use-cases-grid-enhanced">
                    {useCases.map((useCase, index) => (
                      <div key={index} className="use-case-card-enhanced">
                        <div className="use-case-number-enhanced">{index + 1}</div>
                        <div className="use-case-content-enhanced">
                          <h3 className="use-case-title-enhanced">{useCase.title}</h3>
                          <p className="use-case-description-enhanced">{useCase.description}</p>
                          {useCase.example && (
                            <div className="use-case-example">
                              <strong>Example:</strong> {useCase.example}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Additional Custom Content */}
              {additionalContent}

              {/* CTA Section */}
              <section className="cta-section-enhanced">
                <div className="cta-content-enhanced">
                  <h2 className="cta-title-enhanced">Ready to Transform Your Business?</h2>
                  <p className="cta-description-enhanced">
                    Start using {title} today and experience the difference it makes
                  </p>
                  <div className="cta-buttons-enhanced">
                    <Link to="/register" className="btn-primary-large-enhanced">
                      Start Free Trial
                    </Link>
                    <Link to="/pricing" className="btn-secondary-large-enhanced">
                      View Pricing Plans
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </>
  );
};

export default FeatureDetailPageEnhanced;

