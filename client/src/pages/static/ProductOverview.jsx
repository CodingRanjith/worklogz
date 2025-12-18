import React from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import './StaticPage.css';

const ProductOverview = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="static-page">
      <MetaTags
        title="Worklogz – Product Overview"
        description="Complete product overview of Worklogz – the all-in-one business and workforce management platform."
        keywords="Worklogz product overview, workforce management, business management platform"
      />

      <header className="static-header">
        <div className="static-header-content">
          <button className="static-header-link" onClick={handlePrint}>
            {/* Simple icon using text so we don't depend on extra assets */}
            <span>🖨️</span>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </header>

      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-hero-title">
            Worklogz – <span className="static-hero-title-highlight">Complete Business Management Platform</span>
          </h1>
          <p className="static-hero-description">
            Your all-in-one solution for modern workforce management – from attendance and timesheets to payroll,
            projects, CRM, documents, and analytics.
          </p>
          <p className="static-hero-description">
            <strong>Launch Date:</strong> Jan, 2026
          </p>
        </div>
      </section>

      <main className="static-content">
        <div className="static-content-container">
          <section className="static-section">
            <h2 className="static-section-title">Executive Summary</h2>
            <p>
              <strong>Worklogz</strong> is a comprehensive, enterprise-grade workforce management and business
              operations platform designed to revolutionize how companies manage their employees, projects, customers,
              and daily operations. Unlike traditional timesheet tools, Worklogz integrates attendance tracking,
              project management, CRM, payroll, document management, and team collaboration into one seamless platform
              that scales from startups to large enterprises.
            </p>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Why Worklogz?</h2>
            <div className="static-benefits-list">
              <div className="static-benefit-item">
                <div className="static-benefit-icon">🧩</div>
                <div className="static-benefit-content">
                  <h3 className="static-benefit-title">The Problem</h3>
                  <p className="static-benefit-description">
                    Modern businesses struggle with fragmented systems, manual processes, lack of visibility, compliance
                    risk, and poor employee experience across attendance, payroll, CRM, projects, and operations.
                  </p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">✅</div>
                <div className="static-benefit-content">
                  <h3 className="static-benefit-title">The Worklogz Solution</h3>
                  <p className="static-benefit-description">
                    Worklogz consolidates all core operations into one intuitive platform that automates attendance,
                    streamlines payroll, manages projects and tasks, tracks customers, generates documents, and provides
                    real-time analytics and collaboration tools.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Core Feature Areas</h2>
            <div className="static-features-grid">
              <div className="static-feature-card">
                <h3 className="static-feature-title">Attendance & Timesheets</h3>
                <p className="static-feature-description">
                  Real-time check-in/out with GPS and camera verification, flexible work modes, weekly hours tracking,
                  color-coded calendar views, activity logs, holiday integration, and project-based timesheet
                  management with approvals.
                </p>
              </div>
              <div className="static-feature-card">
                <h3 className="static-feature-title">Leave & Holiday Management</h3>
                <p className="static-feature-description">
                  Streamlined leave applications, multiple leave types, multi-level approvals, real-time leave
                  balances, late arrival reports, admin dashboards, and a unified company holiday calendar.
                </p>
              </div>
              <div className="static-feature-card">
                <h3 className="static-feature-title">Payroll & Daily Salary</h3>
                <p className="static-feature-description">
                  Automated daily salary credit, detailed payslips, full salary history, income and deduction
                  breakdowns, and complete payment records for transparent, error-free payroll.
                </p>
              </div>
              <div className="static-feature-card">
                <h3 className="static-feature-title">Task & Project Management</h3>
                <p className="static-feature-description">
                  Department-based task organization, Kanban-style tracking, project workspaces, department-wise
                  projects, team assignment, project analytics, and centralized company worklog tracking.
                </p>
              </div>
              <div className="static-feature-card">
                <h3 className="static-feature-title">CRM & Customer Operations</h3>
                <p className="static-feature-description">
                  Specialized CRM pipelines for Courses, Internships, and IT Projects, with lead tracking, stages,
                  payments, communication history, and performance analytics.
                </p>
              </div>
              <div className="static-feature-card">
                <h3 className="static-feature-title">Helpdesk & Documents</h3>
                <p className="static-feature-description">
                  Internal ticketing with priority and assignment plus automated experience, offer, and relieving
                  letters using templates, secure storage, and branded PDFs.
                </p>
              </div>
            </div>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Industries We Serve</h2>
            <p>
              Worklogz is built to adapt across industries including IT & Software, Education, Healthcare,
              Manufacturing, Retail, Consulting, Real Estate, Finance, Hospitality, and more – with configurable
              workflows, departments, and CRMs to match each domain.
            </p>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Technology & Platform</h2>
            <p>
              Worklogz uses a modern technology stack with a React.js frontend, Node.js and Express backend, MongoDB
              database, and Cloudinary for storage. It supports real-time updates, mobile-responsive design, cloud
              access from anywhere, and is built to be multi-language ready.
            </p>
            <p>
              Security is enforced with JWT-based authentication, role-based access control, data encryption, GPS-based
              verification, audit trails, secure file storage, and automated backups.
            </p>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Key Benefits</h2>
            <div className="static-benefits-list">
              <div className="static-benefit-item">
                <div className="static-benefit-icon">👤</div>
                <div className="static-benefit-content">
                  <h3 className="static-benefit-title">For Employees</h3>
                  <p className="static-benefit-description">
                    One-click attendance, transparent salary and earnings, simple leave flows, performance and goal
                    tracking, and easy access to company resources and community.
                  </p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">🧑‍💼</div>
                <div className="static-benefit-content">
                  <h3 className="static-benefit-title">For Managers & HR</h3>
                  <p className="static-benefit-description">
                    Automated attendance and payroll, real-time performance insights, streamlined leave and task
                    workflows, rich analytics, and powerful document automation.
                  </p>
                </div>
              </div>
              <div className="static-benefit-item">
                <div className="static-benefit-icon">🏢</div>
                <div className="static-benefit-content">
                  <h3 className="static-benefit-title">For Business Owners</h3>
                  <p className="static-benefit-description">
                    A single platform for operations, data-driven decision making, improved productivity, reduced
                    operational costs, stronger customer relationships, and a scalable foundation for growth.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="static-section">
            <h2 className="static-section-title">Launch & Vision</h2>
            <p>
              Worklogz is launching publicly in <strong>January 2026</strong> after months of intensive full-stack
              development, testing, and iteration. It is designed to become the global standard for workforce
              management and business operations, helping companies streamline operations, improve productivity, make
              better decisions, scale efficiently, and create a better employee experience.
            </p>
          </section>

          <section className="static-cta-section">
            <h2 className="static-cta-title">Save or Share This Product Overview</h2>
            <p className="static-cta-description">
              To generate a PDF, click the <strong>“Print / Save as PDF”</strong> button at the top of this page
              (or use your browser&apos;s print option) and choose <strong>Save as PDF</strong> as the destination.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductOverview;


