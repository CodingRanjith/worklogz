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
            <h2 className="footer-cta-title">Transform Your HR Operations with Worklogz</h2>
            <p className="footer-cta-subtitle">Empower your organization with cutting-edge HRMS solutions - Streamline operations, enhance engagement, and achieve excellence through intelligent automation</p>
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
              Worklogz is a comprehensive HRMS platform that empowers organizations to transform their human resource management. We provide cutting-edge solutions for attendance tracking, payroll processing, leave management, performance evaluation, and more. With Worklogz, streamline your HR operations, enhance employee engagement, and achieve operational excellence through intelligent automation and data-driven insights.
            </p>
            <div className="footer-highlights">
              <div className="footer-highlight-item">
                <span className="highlight-icon">✓</span>
                <span className="highlight-text">Intelligent Automation</span>
              </div>
              <div className="footer-highlight-item">
                <span className="highlight-icon">✓</span>
                <span className="highlight-text">Data-Driven Insights</span>
              </div>
              <div className="footer-highlight-item">
                <span className="highlight-icon">✓</span>
                <span className="highlight-text">Operational Excellence</span>
              </div>
            </div>
            
            <div className="footer-connect">
              <p className="footer-connect-label">Connect with Us :</p>
              <div className="social-links">
                <a href="https://www.youtube.com/worklogz" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link social-youtube">
                  <FiYoutube />
                </a>
                <a href="https://www.linkedin.com/company/worklogz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link social-linkedin">
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
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/">Home</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/about">About Worklogz</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features">Features</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/pricing">Pricing</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/careers">Careers</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/contact">Contact Us</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/blog">Blog</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/support">Support</Link></li>
            </ul>
          </div>

          {/* HR Features Column */}
          <div className="footer-column">
            <h3 className="footer-title">Worklogz Features</h3>
            <ul className="footer-links">
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/attendance-management">Attendance Management</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/leave-management">Leave Management</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/payroll-management">Payroll Management</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/performance-management">Performance Management</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/task-manager">Task Manager</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/helpdesk">Helpdesk & Support</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/user-profile-management">Employee Profiles</Link></li>
              <li><span className="footer-link-arrow">{'>'}</span><Link to="/features/admin-dashboard">Analytics & Reports</Link></li>
            </ul>
          </div>

          {/* Newsletter & Sales Column */}
          <div className="footer-column">
            <h3 className="footer-title">Stay Updated with Worklogz</h3>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your work email address" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe to Newsletter</button>
            </form>
            <p className="newsletter-note">Get the latest HRMS insights, product updates, and industry trends delivered to your inbox.</p>

            <div className="footer-sales">
              <h3 className="footer-title">Get in Touch</h3>
              <div className="sales-contact">
                <div className="sales-contact-item">
                  <FiMail className="sales-icon" />
                  <div className="sales-contact-info">
                    <a href="mailto:sales@worklogz.com" className="sales-link">sales@worklogz.com</a>
                    <span className="sales-label">Sales & Business</span>
                  </div>
                </div>
                <div className="sales-contact-item">
                  <FiPhone className="sales-icon" />
                  <div className="sales-contact-info">
                    <a href="tel:6374129515" className="sales-link">+91 63741 29515</a>
                    <span className="sales-label">Call us anytime</span>
                  </div>
                </div>
                <div className="sales-contact-item">
                  <FiMapPin className="sales-icon" />
                  <div className="sales-contact-info">
                    <span className="sales-address">15/12, Gandhi Nagar, Moolakadai, Chennai - 600118, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} Worklogz ®. All rights reserved.</p>
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
            <Link to="/docs/legal">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="/docs/legal">Terms of Service</Link>
            <span className="divider">|</span>
            <Link to="/docs/legal">Disclaimer</Link>
            <span className="divider">|</span>
            <Link to="/docs/legal">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default LandingFooter;

