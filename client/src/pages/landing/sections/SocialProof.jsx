import React from 'react';
import { FiStar } from 'react-icons/fi';
import './SocialProof.css';

const SocialProof = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc',
      company: 'TechStart Inc',
      content: 'Worklogz transformed our workforce management. Attendance accuracy improved by 95% and payroll processing time reduced by 70%.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'HR Director, EduLearn',
      company: 'EduLearn',
      content: 'The best decision we made was implementing Worklogz. Our team loves the intuitive interface and comprehensive features.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Manager, BuildCorp',
      company: 'BuildCorp',
      content: 'Managing remote teams became so much easier with Worklogz. Real-time tracking and analytics help us stay on top of everything.',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Companies' },
    { number: '50K+', label: 'Active Users' },
    { number: '99.2%', label: 'Accuracy Rate' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  return (
    <section className="social-proof-section">
      <div className="section-container">
        <div className="proof-header">
          <h2 className="section-title">Trusted by Leading Organizations</h2>
          <p className="section-subtitle">
            See why companies choose Worklogz for their workforce management
          </p>
        </div>

        <div className="stats-row">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="star-icon filled" />
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="company-logos">
          <p className="logos-label">Used by companies worldwide</p>
          <div className="logos-grid">
            {/* Placeholder for company logos */}
            <div className="logo-placeholder">Company 1</div>
            <div className="logo-placeholder">Company 2</div>
            <div className="logo-placeholder">Company 3</div>
            <div className="logo-placeholder">Company 4</div>
            <div className="logo-placeholder">Company 5</div>
            <div className="logo-placeholder">Company 6</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

