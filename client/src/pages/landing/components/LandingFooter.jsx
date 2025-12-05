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
              Complete business management platform for companies of all sizes. From attendance to everything your company needs.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://www.twitter.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
              <a href="https://www.linkedin.com/company/techackode-" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="https://www.instagram.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://www.github.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
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
            <div className="team-info" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #2a2a2a' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', fontWeight: '500' }}>Developed by Techackode</p>
              <a 
                href="https://www.linkedin.com/company/techackode-" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#6366f1', textDecoration: 'none', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}
                onMouseEnter={(e) => e.target.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.target.style.color = '#6366f1'}
              >
                Techackode <FiLinkedin style={{ fontSize: '12px' }} />
              </a>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', marginBottom: '8px' }}>Team:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <a href="https://www.linkedin.com/in/coding-ranjith/" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  C. Ranjith Kumar <FiLinkedin style={{ fontSize: '11px' }} />
                </a>
                <a href="https://www.linkedin.com/in/gayathrib-dev/" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  Gayathri B <FiLinkedin style={{ fontSize: '11px' }} />
                </a>
                <a href="https://www.linkedin.com/in/pushparajraje/" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                >
                  Pushparaj Raje <FiLinkedin style={{ fontSize: '11px' }} />
                </a>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic', lineHeight: '1.4' }}>
                Worklogz is a product of <strong style={{ color: '#9ca3af' }}>Techackode</strong>
              </p>
            </div>
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

