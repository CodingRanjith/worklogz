import React from 'react';
import { FiPackage } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const PlanManagement = () => {
  return (
    <FeatureDetailPage
      title="Plan Management"
      description="Manage subscription plans and billing. Create plans, manage subscriptions, handle billing, and control access based on subscription tiers."
      icon={<FiPackage />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Plan Creation", description: "Create subscription plans with different features and pricing tiers." },
        { title: "Feature Configuration", description: "Configure features and limits for each subscription plan." },
        { title: "Subscription Management", description: "Manage user subscriptions and plan assignments." },
        { title: "Billing Management", description: "Handle billing, invoicing, and payment processing." },
        { title: "Usage Tracking", description: "Track feature usage and plan limits for each user." },
        { title: "Plan Upgrades/Downgrades", description: "Manage plan upgrades and downgrades seamlessly." },
        { title: "Billing Reports", description: "Generate billing reports and revenue analytics." },
        { title: "Automated Renewals", description: "Automate subscription renewals and billing cycles." }
      ]}
      benefits={[
        { title: "Flexible Pricing", description: "Offer flexible pricing plans to suit different needs." },
        { title: "Revenue Management", description: "Manage revenue and billing efficiently." },
        { title: "Access Control", description: "Control feature access based on subscription tiers." }
      ]}
      useCases={[
        { title: "Subscription Setup", description: "Set up different subscription plans for customers." },
        { title: "Billing Operations", description: "Handle billing and payment processing efficiently." },
        { title: "Revenue Analytics", description: "Analyze revenue and subscription trends." }
      ]}
    />
  );
};

export default PlanManagement;

