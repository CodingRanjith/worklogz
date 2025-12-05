import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiGithub } from 'react-icons/fi';
import './LandingFooter.css';

const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">W</div>
              <span className="logo-text">Worklogz</span>
            </div>
            <p className="footer-tagline">
              Comprehensive workforce management platform for modern organizations.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="GitHub"><FiGithub /></a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Product</h3>
            <ul className="footer-links">
              <li><Link to="/docs/features-overview">Features</Link></li>
              <li><Link to="/for-business">Solutions</Link></li>
              <li><Link to="/docs/integrations">Integrations</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/docs/security">Security</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/docs/faq">FAQ</Link></li>
              <li><Link to="/docs/support">Support</Link></li>
              <li><Link to="/docs/roadmap">Roadmap</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><Link to="/docs">About</Link></li>
              <li><Link to="/docs/contact">Contact</Link></li>
              <li><Link to="/docs/legal">Legal</Link></li>
              <li><Link to="/docs/contact">Partners</Link></li>
              <li><Link to="/docs/contact">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Newsletter</h3>
            <p className="footer-newsletter-text">
              Stay updated with latest features and updates.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} Worklogz. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <Link to="/docs/legal">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="/docs/legal">Terms of Service</Link>
            <span className="divider">|</span>
            <Link to="/docs/legal">Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

