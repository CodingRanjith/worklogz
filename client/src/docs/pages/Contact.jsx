import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Contact = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Contact & Sales Information</h1>
        <p className="intro-subtitle">
          Get in touch with our sales team, request demos, or ask questions about Worklogz.
        </p>

        <h2 id="contact-options">Contact Options</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📧"
            title="Email"
            description="sales@worklogz.com for sales inquiries"
          />
          <FeatureCard
            icon="📞"
            title="Phone"
            description="Contact us by phone for immediate assistance"
          />
          <FeatureCard
            icon="💬"
            title="Live Chat"
            description="Chat with our team in real-time"
          />
          <FeatureCard
            icon="📝"
            title="Contact Form"
            description="Submit inquiry through our contact form"
          />
        </div>

        <h2 id="sales-inquiries">Sales Inquiries</h2>
        <p>
          For sales inquiries, pricing information, or to schedule a demo:
        </p>
        <ul>
          <li>Email: sales@worklogz.com</li>
          <li>Phone: [Your Phone Number]</li>
          <li>Business Hours: Monday-Friday, 9 AM - 6 PM</li>
        </ul>

        <h2 id="support-inquiries">Support Inquiries</h2>
        <p>
          For technical support or assistance:
        </p>
        <ul>
          <li>Email: support@worklogz.com</li>
          <li>Support Portal: Access through the application</li>
          <li>Documentation: Available 24/7</li>
        </ul>

        <h2 id="demo-request">Request a Demo</h2>
        <p>
          Interested in seeing Worklogz in action? Request a personalized demo:
        </p>
        <ul>
          <li>Live product demonstration</li>
          <li>Q&A session with our team</li>
          <li>Custom use case discussion</li>
          <li>Pricing consultation</li>
        </ul>

        <h2 id="partnership">Partnership Opportunities</h2>
        <p>
          Interested in becoming a partner or reseller? Contact us to discuss:
        </p>
        <ul>
          <li>Reseller programs</li>
          <li>Integration partnerships</li>
          <li>White-label opportunities</li>
          <li>Referral programs</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Contact;

