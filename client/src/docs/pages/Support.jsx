import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Support = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Support & Maintenance Terms</h1>
        <p className="intro-subtitle">
          Ticketing, SLAs, update cycles, patch releases, and support policies.
        </p>

        <h2 id="support-channels">Support Channels</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎫"
            title="Ticketing System"
            description="Submit support tickets for technical issues"
          />
          <FeatureCard
            icon="💬"
            title="Live Chat"
            description="Real-time chat support (Enterprise plans)"
          />
          <FeatureCard
            icon="📧"
            title="Email Support"
            description="Email support for all plans"
          />
          <FeatureCard
            icon="📞"
            title="Phone Support"
            description="Phone support for Enterprise plans"
          />
        </div>

        <h2 id="sla">Service Level Agreements (SLA)</h2>
        
        <h3>Response Times</h3>
        <ul>
          <li><strong>Critical Issues:</strong> 1-2 hours</li>
          <li><strong>High Priority:</strong> 4-8 hours</li>
          <li><strong>Medium Priority:</strong> 24 hours</li>
          <li><strong>Low Priority:</strong> 48 hours</li>
        </ul>

        <h3>Resolution Times</h3>
        <ul>
          <li><strong>Critical:</strong> 4-8 hours</li>
          <li><strong>High:</strong> 1-2 business days</li>
          <li><strong>Medium:</strong> 3-5 business days</li>
          <li><strong>Low:</strong> 1-2 weeks</li>
        </ul>

        <h2 id="update-cycles">Update Cycles</h2>
        <ul>
          <li><strong>Major Updates:</strong> Quarterly releases</li>
          <li><strong>Minor Updates:</strong> Monthly releases</li>
          <li><strong>Security Patches:</strong> As needed (immediate)</li>
          <li><strong>Bug Fixes:</strong> Regular patch releases</li>
        </ul>

        <h2 id="maintenance">Maintenance Windows</h2>
        <ul>
          <li>Scheduled maintenance notifications</li>
          <li>Minimal downtime windows</li>
          <li>Off-peak hours scheduling</li>
          <li>Emergency maintenance procedures</li>
        </ul>

        <h2 id="support-levels">Support Levels</h2>
        
        <h3>Standard Support</h3>
        <ul>
          <li>Email support</li>
          <li>Business hours support</li>
          <li>Documentation access</li>
          <li>Community forum access</li>
        </ul>

        <h3>Premium Support</h3>
        <ul>
          <li>All Standard features</li>
          <li>Priority ticket handling</li>
          <li>Extended support hours</li>
          <li>Live chat support</li>
        </ul>

        <h3>Enterprise Support</h3>
        <ul>
          <li>All Premium features</li>
          <li>Dedicated support manager</li>
          <li>24/7 support availability</li>
          <li>Phone support</li>
          <li>Custom SLA agreements</li>
          <li>On-site support (optional)</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Support;

