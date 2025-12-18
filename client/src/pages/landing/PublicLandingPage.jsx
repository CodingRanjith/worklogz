import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';
import './LandingPage.css';

const PublicLandingPage = () => {
  return (
    <>
      <MetaTags
        title="Worklogz – Public Launch | One Platform. Complete Control. Zero Hassle."
        description="Official public launch page for Worklogz – a complete business management and workforce platform. See what it does, who it’s for, and why it matters."
        image="https://worklogz.com/og-image.png"
        keywords="worklogz public launch, workforce management, timesheets, payroll, CRM, projects, documents, HR platform"
      />

      <div className="landing-page">
        <LandingHeader />

        <main className="landing-main public-landing">
          <section className="hero-section">
            <div className="hero-content">
              <h1>Worklogz – Complete Business Management Platform</h1>
              <p className="hero-subtitle">
                One platform to manage your employees, attendance, payroll, projects, CRM, documents,
                performance, and daily operations – from startup to enterprise.
              </p>
              <p className="hero-launch-date">
                <strong>Public Launch Date:</strong> December 9, 2025
              </p>
            </div>
          </section>

          <section className="section-card">
            <h2>Why Worklogz?</h2>
            <p>
              Modern businesses struggle with fragmented tools, manual processes, poor visibility, and
              compliance headaches. Worklogz solves this by bringing attendance, timesheets, payroll,
              projects, CRM, helpdesk, documents, analytics, and communication into a single, unified
              platform.
            </p>
          </section>

          <section className="section-grid">
            <div className="section-card">
              <h3>All-In-One Workforce Platform</h3>
              <ul>
                <li>Smart attendance with GPS & camera</li>
                <li>Timesheets & project-based worklogs</li>
                <li>Leave, holidays, and shift management</li>
                <li>Daily salary credit & payroll automation</li>
              </ul>
            </div>
            <div className="section-card">
              <h3>Business Operations in One Place</h3>
              <ul>
                <li>Task & project management workspaces</li>
                <li>Specialized CRMs (Course, Internship, IT Projects)</li>
                <li>Helpdesk, documents, and approvals</li>
                <li>Real-time analytics & reporting</li>
              </ul>
            </div>
            <div className="section-card">
              <h3>Built for Every Size & Industry</h3>
              <ul>
                <li>From 1–50 employees up to 500+ and enterprises</li>
                <li>Flexible for IT, education, services, manufacturing, and more</li>
                <li>Role-based access control and audit logs</li>
                <li>Secure, cloud-based, and mobile friendly</li>
              </ul>
            </div>
          </section>

          <section className="section-card">
            <h2>Who Is Worklogz For?</h2>
            <p>
              Worklogz is designed for founders, HR teams, operations leaders, and managers who want
              complete control over their workforce and operations without juggling 10+ different tools.
              Whether you&apos;re a small business, a fast-growing mid-size company, or a large enterprise,
              Worklogz scales with you.
            </p>
          </section>

          <section className="final-cta-section">
            <div className="final-cta-card">
              <h2>Ready to See Worklogz in Action?</h2>
              <p>
                Start with the public launch experience today and explore how Worklogz can simplify your
                entire business in one place.
              </p>
              <div className="cta-buttons">
                <a href="/login" className="primary-cta">
                  Sign In
                </a>
                <a href="/register" className="secondary-cta">
                  Create an Account
                </a>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
};

export default PublicLandingPage;


