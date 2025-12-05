import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import './LandingHeader.css';

const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/home" className="logo">
            <div className="logo-icon">W</div>
            <span className="logo-text">Worklogz</span>
          </Link>
        </div>

        <nav className="header-nav desktop-nav">
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <span className="nav-link">
              Features <FiChevronDown className="dropdown-icon" />
            </span>
            {featuresOpen && (
              <div className="dropdown-menu">
                <Link to="/docs/features-overview">Overview</Link>
                <Link to="/docs/detailed-features">All Features</Link>
                <Link to="/docs#attendance">Attendance</Link>
                <Link to="/docs#timesheet">Timesheet</Link>
                <Link to="/docs#payroll">Payroll</Link>
                <Link to="/docs#crm">CRM</Link>
                <Link to="/docs#analytics">Analytics</Link>
              </div>
            )}
          </div>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <span className="nav-link">
              Solutions <FiChevronDown className="dropdown-icon" />
            </span>
            {solutionsOpen && (
              <div className="dropdown-menu">
                <Link to="/for-business">For Business</Link>
                <Link to="/for-enterprise">For Enterprise</Link>
                <Link to="/for-education">For Education</Link>
                <Link to="/for-individuals">For Individuals</Link>
              </div>
            )}
          </div>

          <Link to="/docs/industries" className="nav-link">Industries</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/docs" className="nav-link">Documentation</Link>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <span className="nav-link">
              Resources <FiChevronDown className="dropdown-icon" />
            </span>
            {resourcesOpen && (
              <div className="dropdown-menu">
                <Link to="/docs/faq">FAQ</Link>
                <Link to="/docs/support">Support</Link>
                <Link to="/docs/roadmap">Roadmap</Link>
              </div>
            )}
          </div>
        </nav>

        <div className="header-right desktop-nav">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link to="/docs/features-overview" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link to="/for-business" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
          <Link to="/docs/industries" onClick={() => setMobileMenuOpen(false)}>Industries</Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>Documentation</Link>
          <Link to="/docs/faq" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary">Get Started</Link>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;

