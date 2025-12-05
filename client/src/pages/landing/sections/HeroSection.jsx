import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <FiCheckCircle className="badge-icon" />
            <span>Trusted by 500+ Companies Worldwide</span>
          </div>
          
          <h1 className="hero-title">
            Transform Your Workforce Management
          </h1>
          
          <p className="hero-subtitle">
            All-in-one platform for attendance tracking, timesheets, payroll, 
            project management, and CRM. Streamline your operations and boost 
            productivity with Worklogz.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-primary-large">
              Start Free Trial
              <FiArrowRight className="btn-icon" />
            </Link>
            <button className="btn-secondary-large">
              <FiPlay className="btn-icon" />
              Watch Demo
            </button>
          </div>

          <div className="hero-trust-indicators">
            <div className="trust-item">
              <span className="trust-number">99.2%</span>
              <span className="trust-label">Accuracy Rate</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">Companies</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">50K+</span>
              <span className="trust-label">Active Users</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">24/7</span>
              <span className="trust-label">Support</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <div className="dashboard-mockup">
              <div className="mockup-header"></div>
              <div className="mockup-content">
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

