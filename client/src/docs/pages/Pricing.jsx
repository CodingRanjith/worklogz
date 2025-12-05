import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Pricing = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Simple & Flexible Pricing Plans</h1>
        <p className="intro-subtitle">
          Per-user, per-month, lifetime license, or enterprise packages - choose the plan that fits your needs.
        </p>

        <h2 id="pricing-models">Pricing Models</h2>
        <div className="features-grid">
          <FeatureCard
            icon="👥"
            title="Per-User Pricing"
            description="Pay based on the number of active users in your organization"
          />
          <FeatureCard
            icon="📅"
            title="Per-Month Subscription"
            description="Flexible monthly billing with easy scaling"
          />
          <FeatureCard
            icon="🎁"
            title="Lifetime License"
            description="One-time payment for lifetime access and updates"
          />
          <FeatureCard
            icon="🏢"
            title="Enterprise Packages"
            description="Custom pricing for large organizations with special requirements"
          />
        </div>

        <h2 id="pricing-tiers">Pricing Tiers</h2>
        
        <h3>Starter Plan</h3>
        <ul>
          <li>Perfect for small teams (1-25 users)</li>
          <li>Essential features included</li>
          <li>Standard support</li>
          <li>Monthly or annual billing</li>
        </ul>

        <h3>Professional Plan</h3>
        <ul>
          <li>Ideal for growing organizations (26-100 users)</li>
          <li>All features included</li>
          <li>Priority support</li>
          <li>Advanced analytics</li>
          <li>Custom integrations</li>
        </ul>

        <h3>Enterprise Plan</h3>
        <ul>
          <li>For large organizations (100+ users)</li>
          <li>Everything in Professional</li>
          <li>Dedicated support</li>
          <li>Custom development</li>
          <li>White-labeling included</li>
          <li>SLA guarantees</li>
          <li>On-premise deployment option</li>
        </ul>

        <h2 id="lifetime-license">Lifetime License</h2>
        <p>
          One-time payment option for organizations that prefer upfront investment:
        </p>
        <ul>
          <li>Pay once, use forever</li>
          <li>All future updates included</li>
          <li>No recurring fees</li>
          <li>Full feature access</li>
          <li>Community support</li>
          <li>Optional premium support add-on</li>
        </ul>

        <h2 id="add-ons">Add-Ons & Extensions</h2>
        <ul>
          <li>Additional user licenses</li>
          <li>Premium support</li>
          <li>Custom development</li>
          <li>White-labeling</li>
          <li>Advanced integrations</li>
          <li>Training services</li>
        </ul>

        <h2 id="flexibility">Pricing Flexibility</h2>
        <ul>
          <li>Mix and match pricing models</li>
          <li>Scalable pricing as you grow</li>
          <li>Discounts for annual payments</li>
          <li>Volume discounts for large teams</li>
          <li>Non-profit and educational discounts</li>
        </ul>

        <h2 id="contact-pricing">Contact for Pricing</h2>
        <p>
          For custom enterprise pricing, white-labeling options, or special requirements, 
          please contact our sales team. We'll work with you to create a pricing plan 
          that fits your organization's needs and budget.
        </p>
      </div>
    </DocsLayout>
  );
};

export default Pricing;

