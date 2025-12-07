import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiSmartphone, FiTablet, FiWatch, FiMonitor } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Complete Workforce Management{' '}
            <span className="hero-title-highlight">Made Simple</span>
          </h1>
          
          <p className="hero-subtitle">
            Streamline attendance, payroll, projects, and HR processes in one platform. Drive productivity and growth with Worklogz.
          </p>

          <div className="hero-input-wrapper">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="hero-email-input"
            />
            <Link to="/register" className="btn-primary-hero">
              Start Free Trial →
            </Link>
          </div>

          <div className="app-downloads">
            <button className="app-store-btn">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0L13.09 8.26L20 11.18L13.09 14.1L10 22.36L6.91 14.1L0 11.18L6.91 8.26L10 0Z" fill="currentColor"/>
              </svg>
              Download on the App Store
            </button>
            <button className="google-play-btn">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L16 12L4 20V4Z" fill="currentColor"/>
              </svg>
              GET IT ON Google Play
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-check">
              <FiCheckCircle className="check-icon" />
              <span>Free forever</span>
            </div>
            <div className="feature-check">
              <FiCheckCircle className="check-icon" />
              <span>No credit card required</span>
            </div>
            <div className="feature-check">
              <FiCheckCircle className="check-icon" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          {/* Laptop Mockup */}
          <div className="device-mockup laptop-mockup">
            <div className="device-frame">
              <div className="device-screen">
                <div className="screen-content">
                  <div className="screen-calendar"></div>
                  <div className="screen-projects"></div>
                  <div className="screen-time-entries"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="device-mockup phone-mockup">
            <div className="device-frame">
              <div className="device-screen">
                <div className="mobile-header">
                  <FiClock className="mobile-header-icon" />
                  <div className="mobile-header-text">
                    <div className="mobile-header-value">8h 24m</div>
                    <div className="mobile-header-label">Today's tracked time</div>
                  </div>
                </div>
                <div className="mobile-timer">00h 52m</div>
                <div className="mobile-buttons">
                  <button className="mobile-btn pause">PAUSE</button>
                  <button className="mobile-btn stop">STOP</button>
                </div>
                <div className="mobile-entries"></div>
              </div>
            </div>
          </div>

          {/* Tablet Mockup */}
          <div className="device-mockup tablet-mockup">
            <div className="device-frame">
              <div className="device-screen">
                <div className="tablet-header">
                  <FiCheckCircle className="tablet-header-icon" />
                  <div className="tablet-header-content">
                    <div className="tablet-header-text">All synced</div>
                    <div className="tablet-header-subtext">Across all devices</div>
                  </div>
                </div>
                <div className="tablet-charts">
                  <div className="chart-pie"></div>
                  <div className="chart-block"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Smartwatch Mockup */}
          <div className="device-mockup watch-mockup">
            <div className="device-frame">
              <div className="watch-face">
                <div className="watch-brand">Worklogz</div>
                <div className="watch-time">13:09</div>
                <div className="watch-timer">00:52</div>
                <button className="watch-button"></button>
              </div>
            </div>
          </div>

          {/* Floating Info Cards */}
          <div className="floating-card card-today">
            <FiClock className="card-icon" />
            <div className="card-content">
              <div className="card-value">8h 24m</div>
              <div className="card-label">Today's tracked time</div>
            </div>
          </div>

          <div className="floating-card card-synced">
            <FiCheckCircle className="card-icon" />
            <div className="card-content">
              <div className="card-label">All synced</div>
              <div className="card-sub-label">Across all devices</div>
            </div>
          </div>

          {/* Trustpilot Rating */}
          <div className="trustpilot-rating">
            <div className="trustpilot-logo">Trustpilot</div>
            <div className="trustpilot-stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
          </div>

          {/* Awards/Badges */}
          <div className="awards-badges">
            <div className="award-badge badge-capterra">
              BEST VALUE 2025
            </div>
            <div className="award-badge badge-getapp">
              BEST FUNCTIONALITY & FEATURES 2024
            </div>
            <div className="award-badge badge-software">
              RECOMMENDED 2024
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

