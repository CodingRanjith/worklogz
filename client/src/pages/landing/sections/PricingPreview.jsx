import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import './PricingPreview.css';

const PricingPreview = () => {
  const plans = [
    {
      name: 'Starter',
      price: '₹750',
      period: '/user/month',
      description: 'Perfect for small teams',
      features: [
        'Up to 25 users',
        'Core features included',
        'Email support',
        'Standard reports',
        'Mobile access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹1,599',
      period: '/user/month',
      description: 'Ideal for growing organizations',
      features: [
        'Up to 100 users',
        'All features included',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'White-labeling'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Everything in Professional',
        'Dedicated support',
        'Custom development',
        'SLA guarantees',
        'On-premise option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section className="pricing-preview-section" id="pricing">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that fits your organization. All plans include a free trial.
          </p>
        </div>

        <div className="pricing-cards">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="price-amount">{plan.price}</span>
                  {plan.period && <span className="price-period">{plan.period}</span>}
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <FiCheckCircle className="feature-check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to={plan.name === 'Enterprise' ? '/docs/contact' : '/register'} 
                className={`plan-cta ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {plan.cta}
                <FiArrowRight className="btn-icon" />
              </Link>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>
            <strong>All plans include:</strong> Free 14-day trial • No credit card required • 
            Cancel anytime • 99.9% uptime SLA
          </p>
        </div>

        <div className="section-cta">
          <Link to="/pricing" className="btn-link">
            View Full Pricing Details <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;

