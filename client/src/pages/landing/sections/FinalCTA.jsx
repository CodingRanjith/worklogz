import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './FinalCTA.css';

const FinalCTA = () => {
  return (
    <section className="final-cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Workforce Management?</h2>
          <p className="cta-subtitle">
            Join hundreds of companies already using Worklogz to streamline their operations, 
            improve productivity, and grow their business.
          </p>

          <div className="cta-benefits">
            <div className="cta-benefit">
              <FiCheckCircle className="benefit-icon" />
              <span>14-day free trial</span>
            </div>
            <div className="cta-benefit">
              <FiCheckCircle className="benefit-icon" />
              <span>No credit card required</span>
            </div>
            <div className="cta-benefit">
              <FiCheckCircle className="benefit-icon" />
              <span>Setup in minutes</span>
            </div>
            <div className="cta-benefit">
              <FiCheckCircle className="benefit-icon" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/register" className="btn-primary-large">
              Start Your Free Trial
              <FiArrowRight className="btn-icon" />
            </Link>
            <Link to="/docs/contact" className="btn-secondary-large">
              Contact Sales
            </Link>
          </div>

          <div className="cta-trust">
            <p className="trust-text">
              Trusted by 500+ companies • 50,000+ active users • 99.2% accuracy rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

