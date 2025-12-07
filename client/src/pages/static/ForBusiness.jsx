import React from 'react';
import { FiUsers, FiBarChart2, FiShield, FiZap, FiTrendingUp, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LandingHeader from '../landing/components/LandingHeader';
import LandingFooter from '../landing/components/LandingFooter';
import './StaticPage.css';

const ForBusiness = () => {
  return (
    <div className="static-page">
      <LandingHeader />
      
      {/* Hero Section */}
      <div className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-hero-title">
            Worklogz for <span className="static-hero-title-highlight">Business</span>
          </h1>
          <p className="static-hero-description">
            Streamline your team's workflow, improve productivity, and make data-driven decisions with our comprehensive business management platform.
          </p>
        </div>
      </div>

      <div className="static-content">
        <div className="static-content-container">
          {/* Features Grid */}
          <section className="static-section">
            <div className="static-features-grid">
              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiUsers className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Team Management</h3>
                <p className="static-feature-description">
                  Manage your entire team, track attendance, and monitor performance from a single dashboard.
                </p>
              </div>

              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiBarChart2 className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Advanced Analytics</h3>
                <p className="static-feature-description">
                  Get comprehensive insights into your business operations with detailed reports and analytics.
                </p>
              </div>

              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiShield className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Enterprise Security</h3>
                <p className="static-feature-description">
                  Bank-level security with role-based access control to protect your sensitive business data.
                </p>
              </div>

              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiZap className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Automation</h3>
                <p className="static-feature-description">
                  Automate repetitive tasks, payroll processing, and attendance tracking to save time and reduce errors.
                </p>
              </div>

              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiTrendingUp className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Performance Tracking</h3>
                <p className="static-feature-description">
                  Monitor employee performance, set goals, and track achievements to drive business growth.
                </p>
              </div>

              <div className="static-feature-card">
                <div className="static-feature-icon-wrapper primary">
                  <FiCheckCircle className="static-feature-icon" />
                </div>
                <h3 className="static-feature-title">Compliance</h3>
                <p className="static-feature-description">
                  Stay compliant with labor laws, generate required reports, and maintain accurate records.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="static-section">
            <h2 className="static-section-title">Why Businesses Choose Worklogz</h2>
            <div className="static-benefits-list">
              <div className="static-benefit-item">
                <div className="static-benefit-icon">
                  <FiCheckCircle />
                </div>
                <div className="static-benefit-content">
                  <h4 className="static-benefit-title">Scalable Solution</h4>
                  <p className="static-benefit-description">Grows with your business from startup to enterprise level.</p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">
                  <FiCheckCircle />
                </div>
                <div className="static-benefit-content">
                  <h4 className="static-benefit-title">Cost Effective</h4>
                  <p className="static-benefit-description">Reduce operational costs with automated processes.</p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">
                  <FiCheckCircle />
                </div>
                <div className="static-benefit-content">
                  <h4 className="static-benefit-title">Easy Integration</h4>
                  <p className="static-benefit-description">Seamlessly integrates with your existing tools and systems.</p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">
                  <FiCheckCircle />
                </div>
                <div className="static-benefit-content">
                  <h4 className="static-benefit-title">24/7 Support</h4>
                  <p className="static-benefit-description">Get help whenever you need it with our dedicated support team.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="static-section">
            <h2 className="static-section-title">Business Pricing Plans</h2>
            <div className="static-features-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'}}>
              {/* Starter Plan */}
              <div className="static-feature-card">
                <h3 className="static-feature-title">Starter</h3>
                <div style={{marginBottom: '1.5rem'}}>
                  <span style={{fontSize: '2.5rem', fontWeight: '700', color: 'var(--neutral-900)'}}>₹1,999</span>
                  <span style={{color: 'var(--neutral-600)', marginLeft: '0.5rem'}}>/month</span>
                  <p style={{fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '0.5rem', margin: '0.5rem 0 0 0'}}>Up to 10 employees</p>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0'}}>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Team attendance tracking</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Basic analytics</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Leave management</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Email support</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-secondary" style={{width: '100%', justifyContent: 'center'}}>
                  Get Started
                </Link>
              </div>

              {/* Professional Plan */}
              <div className="static-feature-card" style={{borderColor: 'var(--primary-600)', borderWidth: '2px', position: 'relative'}}>
                <div style={{position: 'absolute', top: 0, right: 0, background: 'var(--primary-600)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '0 0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '700'}}>
                  Most Popular
                </div>
                <h3 className="static-feature-title">Professional</h3>
                <div style={{marginBottom: '1.5rem'}}>
                  <span style={{fontSize: '2.5rem', fontWeight: '700', color: 'var(--neutral-900)'}}>₹4,999</span>
                  <span style={{color: 'var(--neutral-600)', marginLeft: '0.5rem'}}>/month</span>
                  <p style={{fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '0.5rem', margin: '0.5rem 0 0 0'}}>Up to 50 employees</p>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0'}}>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Everything in Starter</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Advanced analytics</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Payroll integration</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Custom reports</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Priority support</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>API access</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                  Start Free Trial
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="static-feature-card">
                <h3 className="static-feature-title">Enterprise</h3>
                <div style={{marginBottom: '1.5rem'}}>
                  <span style={{fontSize: '2.5rem', fontWeight: '700', color: 'var(--neutral-900)'}}>₹9,999</span>
                  <span style={{color: 'var(--neutral-600)', marginLeft: '0.5rem'}}>/month</span>
                  <p style={{fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '0.5rem', margin: '0.5rem 0 0 0'}}>Unlimited employees</p>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0'}}>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Everything in Professional</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Custom integrations</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>Dedicated account manager</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>White-label options</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>24/7 phone support</span>
                  </li>
                  <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <FiCheckCircle style={{color: 'var(--accent-green)', flexShrink: 0}} />
                    <span style={{color: 'var(--neutral-600)'}}>SLA guarantee</span>
                  </li>
                </ul>
                <Link to="/register" className="btn btn-secondary" style={{width: '100%', justifyContent: 'center'}}>
                  Contact Sales
                </Link>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="static-cta-section">
            <h2 className="static-cta-title">Transform Your Business Operations</h2>
            <p className="static-cta-description">
              Join leading businesses that trust Worklogz for their workforce management needs.
            </p>
            <div className="static-cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Free Trial
              </Link>
              <Link to="/pricing" className="btn btn-secondary btn-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
};

export default ForBusiness;

