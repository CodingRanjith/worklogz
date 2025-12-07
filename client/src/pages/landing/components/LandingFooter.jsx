import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiGithub, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './LandingFooter.css';

const LandingFooter = () => {
  return (
    <>
      {/* CTA Section */}
      <div className="footer-cta-section">
        <div className="footer-cta-container">
          <div className="footer-cta-content">
            <h2 className="footer-cta-title">Get Ready To Dive In!</h2>
            <p className="footer-cta-subtitle">Get Early Access to Worklogz Software</p>
          </div>
          <button className="footer-cta-button">Request Demo</button>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Left Column - Branding */}
          <div className="footer-column footer-column-brand">
            <div className="footer-logo">
              <div className="logo-icon">W</div>
              <span className="logo-text">Worklogz</span>
            </div>
            <p className="footer-tagline">
              Worklogz is a product of Techackode IT Solutions Pvt Ltd, India and is a leading system Integrator with many years of expertise in implementing solutions to various corporations across the world. We help our clients to fully digitize their operations, improve their KPIs and massively optimize their operational cost. Our belief in the values of trust, transparency, flexibility and value-centricity ensures the continued pursuit of our customers best interests.
            </p>
            
            <div className="footer-connect">
              <p className="footer-connect-label">Connect with Us :</p>
              <div className="social-links">
                <a href="https://www.youtube.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link social-youtube">
                  <FiYoutube />
                </a>
                <a href="https://www.linkedin.com/company/techackode-" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link social-linkedin">
                  <FiLinkedin />
                </a>
                <a href="https://www.facebook.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link social-facebook">
                  <FiFacebook />
                </a>
                <a href="https://www.twitter.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link social-twitter">
                  <FiTwitter />
                </a>
              </div>
            </div>

            <div className="footer-download">
              <p className="footer-download-label">Download App</p>
              <div className="app-download-buttons">
                <a href="https://play.google.com/store/apps" className="app-download-btn google-play" target="_blank" rel="noopener noreferrer" aria-label="Download Worklogz on Google Play">
                  <span className="app-btn-text">GET IT ON</span>
                  <span className="app-btn-store">Google Play</span>
                </a>
                <a href="https://www.apple.com/app-store" className="app-download-btn app-store" target="_blank" rel="noopener noreferrer" aria-label="Download Worklogz on App Store">
                  <span className="app-btn-text">Download on the</span>
                  <span className="app-btn-store">App Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Home Column */}
          <div className="footer-column">
            <h3 className="footer-title">Home</h3>
            <ul className="footer-links">
              <li><span className="footer-link-arrow">></span><Link to="/">Overview</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/careers">Careers</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/about">About Us</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/contact">Contact Us</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/docs/legal">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* HR Features Column */}
          <div className="footer-column">
            <h3 className="footer-title">HR Features</h3>
            <ul className="footer-links">
              <li><span className="footer-link-arrow">></span><Link to="/features/core-hrms">Core HR</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/payroll-management">Payroll Software</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/leave-management">Leave Management</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/attendance-management">Attendance Management</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/performance-management">Performance Management</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/recruitment">Recruitment</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/travel-management">Travel Management</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/task-manager">Task Management</Link></li>
              <li><span className="footer-link-arrow">></span><Link to="/features/helpdesk">Help & Support</Link></li>
            </ul>
          </div>

          {/* Newsletter & Sales Column */}
          <div className="footer-column">
            <h3 className="footer-title">Subscribe to Newsletter</h3>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your organization email address" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>

            <div className="footer-sales">
              <h3 className="footer-title">Sales</h3>
              <div className="sales-contact">
                <div className="sales-contact-item">
                  <FiMail className="sales-icon" />
                  <a href="mailto:sales@worklogz.com" className="sales-link">sales@worklogz.com</a>
                </div>
                <div className="sales-contact-item">
                  <FiPhone className="sales-icon" />
                  <a href="tel:+919487263288" className="sales-link">+91-9487263288</a>
                </div>
                <div className="sales-contact-item">
                  <FiMapPin className="sales-icon" />
                  <span className="sales-address">A Block 1st Floor, Tecci Park, 285, Rajiv Gandhi Salai, Kumaran Nagar, Elcot Sez, Karapakkam, Chennai, Tamil Nadu 600119</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} Techackode IT Solutions Pvt Ltd ®. All rights reserved.</p>
          </div>
          <div className="footer-bottom-center">
            <div className="iso-certifications">
              <div className="iso-badge">
                <div className="iso-badge-inner">
                  <span className="iso-certified">CERTIFIED</span>
                  <span className="iso-standard">ISO 9001:2015</span>
                </div>
              </div>
              <div className="iso-badge">
                <div className="iso-badge-inner">
                  <span className="iso-certified">CERTIFIED</span>
                  <span className="iso-standard">ISO 20000</span>
                </div>
              </div>
              <div className="iso-badge">
                <div className="iso-badge-inner">
                  <span className="iso-certified">CERTIFIED</span>
                  <span className="iso-standard">ISO 27001</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom-right">
            <Link to="/docs/legal">Disclaimer</Link>
            <span className="divider"> </span>
            <Link to="/docs/legal">Privacy Policy</Link>
            <span className="divider"> </span>
            <Link to="/docs/legal">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default LandingFooter;

