import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../../components/SEO/MetaTags';
import LandingHeader from '../landing/components/LandingHeader';
import LandingFooter from '../landing/components/LandingFooter';
import IntegrationSection from './components/IntegrationSection';
import './FeatureDetailPage.css';

const FeatureDetailPage = ({ 
  title, 
  description, 
  icon, 
  image, 
  features = [], 
  benefits = [],
  useCases = [],
  integrations = [],
  statistics = [],
  moduleType = 'User' // 'User' or 'Admin'
}) => {
  return (
    <>
      <MetaTags
        title={`${title} - Worklogz Feature | Complete Business Management Platform`}
        description={description}
        keywords={`${title}, worklogz, business management, ${moduleType.toLowerCase()} module, workforce management`}
      />
      <div className="feature-detail-page">
        <LandingHeader />
        
        <main className="feature-detail-main">
          <div className="feature-detail-hero">
            <div className="section-container">
              <div className="feature-hero-content">
                <div className="feature-hero-left">
                  <div className="feature-module-badge">
                    {moduleType} Module
                  </div>
                  <div className="feature-icon-large">{icon}</div>
                  <h1 className="feature-hero-title">{title}</h1>
                  <p className="feature-hero-description">{description}</p>
                  
                  {statistics && statistics.length > 0 && (
                    <div className="hero-statistics">
                      {statistics.map((stat, index) => (
                        <div key={index} className="hero-stat-item">
                          <div className="stat-number">{stat.number}</div>
                          <div className="stat-text">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="feature-hero-cta">
                    <Link to="/" className="btn-primary-large">
                      Get Started
                    </Link>
                    <Link to="/#features" className="btn-secondary-large">
                      View All Features
                    </Link>
                  </div>
                </div>
                <div className="feature-hero-right">
                  <div className="feature-image-container">
                    {image ? (
                      <img 
                        src={image} 
                        alt={title}
                        className="feature-hero-image"
                      />
                    ) : (
                      <div className="feature-image-placeholder">
                        <div className="mockup-screen">
                          <div className="screen-content">
                            <div className="placeholder-content">
                              <div className="placeholder-icon">{icon}</div>
                              <p>Feature Preview</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail-content">
            <div className="section-container">
              {/* Key Features */}
              {features.length > 0 && (
                <section className="feature-section">
                  <h2 className="feature-section-title">Key Features</h2>
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
                </section>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <section className="feature-section">
                  <h2 className="feature-section-title">Benefits</h2>
                  <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="benefit-card">
                        <div className="benefit-icon">🎯</div>
                        <h3 className="benefit-title">{benefit.title}</h3>
                        <p className="benefit-description">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Integrations */}
              {integrations && integrations.length > 0 && (
                <IntegrationSection integrations={integrations} />
              )}

              {/* Use Cases */}
              {useCases.length > 0 && (
                <section className="feature-section">
                  <h2 className="feature-section-title">Use Cases</h2>
                  <div className="use-cases-list">
                    {useCases.map((useCase, index) => (
                      <div key={index} className="use-case-item">
                        <div className="use-case-number">{index + 1}</div>
                        <div className="use-case-content">
                          <h3 className="use-case-title">{useCase.title}</h3>
                          <p className="use-case-description">{useCase.description}</p>
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

              {/* CTA Section */}
              <section className="feature-cta-section">
                <div className="feature-cta-content">
                  <h2 className="feature-cta-title">Ready to Get Started?</h2>
                  <p className="feature-cta-description">
                    Experience the power of {title} and transform your business operations.
                  </p>
                  <div className="feature-cta-buttons">
                    <Link to="/register" className="btn-primary-large">
                      Start Free Trial
                    </Link>
                    <Link to="/pricing" className="btn-secondary-large">
                      View Pricing
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

export default FeatureDetailPage;

