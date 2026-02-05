import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiSmartphone, FiTablet, FiWatch, FiMonitor } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Top Decorative Stripe */}
      <div className="hero-top-stripe">
        <div className="stripe-yellow"></div>
        <div className="stripe-mint"></div>
        <div className="stripe-peach"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">✨ Trusted by 10,000+ Teams Worldwide</span>
          </div>

          <h1 className="hero-title">
            Complete Workforce Management{' '}
            <span className="hero-title-highlight-made">Made</span>{' '}
            <span className="hero-title-highlight-simple">Simple</span>
          </h1>
          
          <p className="hero-subtitle">
            One platform for attendance, payroll, projects, and CRM — built for growing companies. Book a 15–30 min demo. No commitment.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Hours Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>

          <div className="hero-cta-wrapper">
            <Link to="/register" className="btn-primary-hero">
              Start Free Trial →
            </Link>
            <Link to="/pricing" className="btn-secondary-hero">
              Request Demo
            </Link>
            <button className="btn-secondary-hero">
              Watch Demo
            </button>
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

        </div>

        <div className="hero-visual">
          {/* Connection Lines */}
          <svg className="device-connections" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <line className="connection-line" x1="50%" y1="50%" x2="85%" y2="20%" />
            <line className="connection-line" x1="50%" y1="50%" x2="15%" y2="80%" />
            <line className="connection-line" x1="15%" y1="15%" x2="50%" y2="50%" />
          </svg>

          {/* Laptop Mockup */}
          <div className="device-mockup laptop-mockup">
            <div className="device-frame">
              <div className="device-screen">
                <img 
                  src="/hero.png" 
                  alt="Worklogz Dashboard" 
                  className="laptop-screen-image"
                />
                {/* Floating card inside laptop */}
                <div className="screen-floating-card laptop-sync-card">
                  <FiCheckCircle className="screen-card-icon" />
                  <div className="screen-card-content">
                    <div className="screen-card-text">All synced</div>
                    <div className="screen-card-subtext">Across all devices</div>
                  </div>
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
                <div className="mobile-timer">
                  <span className="timer-main">00h 00m</span>
                  <span className="timer-secondary">00h 52m</span>
                </div>
                {/* Awards badges inside phone */}
                <div className="mobile-awards">
                  <div className="mobile-award-badge badge-capterra">
                    Capterra BEST VALUE 2025
                  </div>
                  <div className="mobile-award-badge badge-getapp">
                    GetApp BEST FUNCTIONALITY & FEATURES 2024
                  </div>
                  <div className="mobile-award-badge badge-software">
                    Software Advice MOST RECOMMENDED 2024
                  </div>
                </div>
                <div className="mobile-buttons">
                  <button className="mobile-btn pause">PAUSE</button>
                  <button className="mobile-btn stop">STOP</button>
                </div>
              </div>
            </div>
            {/* Trustpilot rating below phone */}
            <div className="trustpilot-rating phone-trustpilot">
              <div className="trustpilot-logo">Trustpilot</div>
              <div className="trustpilot-stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
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
                {/* Floating card inside tablet - bottom left */}
                <div className="screen-floating-card tablet-sync-card">
                  <FiCheckCircle className="screen-card-icon" />
                  <div className="screen-card-content">
                    <div className="screen-card-text">All synced</div>
                    <div className="screen-card-subtext">Across all devices</div>
                  </div>
                </div>
                {/* Small card in bottom right */}
                <div className="screen-floating-card tablet-small-card"></div>
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
                <div className="watch-timer-secondary">00:00</div>
                <button className="watch-button"></button>
              </div>
            </div>
          </div>

          {/* Floating Info Card above laptop */}
          <div className="floating-info-card">
            <FiClock className="floating-card-icon" />
            <div className="floating-card-content">
              <div className="floating-card-value">8h 24m</div>
              <div className="floating-card-label">Today's tracked time</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

