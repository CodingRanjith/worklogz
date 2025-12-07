import React from 'react';
import { FiCheckCircle, FiUsers, FiShield, FiZap, FiTrendingUp, FiTarget, FiClock, FiBarChart2, FiDollarSign, FiAward, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LandingHeader from '../landing/components/LandingHeader';
import LandingFooter from '../landing/components/LandingFooter';
import MetaTags from '../../components/SEO/MetaTags';

const Pricing = () => {
  return (
    <>
      <MetaTags
        title="Pricing Plans - Worklogz | Simple, Transparent Pricing for Your Team"
        description="Choose the perfect plan for your team. All plans include a 14-day free trial. No credit card required. Per user, per month pricing starting from ₹749."
        keywords="worklogz pricing, business management pricing, workforce management pricing, per user pricing, team plans, enterprise pricing"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        <LandingHeader />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent <span className="text-purple-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Choose the perfect plan for your team. All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
            <FiAward className="w-4 h-4" />
            All prices in Indian Rupees (₹)
          </div>
        </div>

        {/* Team Plans - Per User Pricing */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Plans</h2>
            <p className="text-lg text-gray-600">Per user, per month pricing. Scale as your team grows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pro Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 transition-colors bg-white shadow-lg hover:shadow-xl">
              <div className="mb-4">
                <FiUsers className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 text-sm">Perfect for small teams</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">₹749</span>
                  <span className="text-gray-600 ml-2">/user/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">or ₹8,988/year (save 20%)</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited time tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited projects & tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Team attendance management</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Advanced analytics & reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Leave management system</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Priority email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Mobile app access</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Basic integrations</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business Plan - Popular */}
            <div className="border-2 border-blue-500 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 relative shadow-xl scale-105">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-bold">
                Most Popular
              </div>
              <div className="mb-4">
                <FiTrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
                <p className="text-gray-600 text-sm">Ideal for growing organizations</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">₹1,124</span>
                  <span className="text-gray-600 ml-2">/user/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">or ₹13,488/year (save 20%)</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Payroll & salary management</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Advanced CRM features</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Custom reports & dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Document management system</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Helpdesk & ticket system</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">API access & webhooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Priority phone & chat support</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Advanced security features</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Multi-department management</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-500 transition-colors bg-white shadow-lg hover:shadow-xl">
              <div className="mb-4">
                <FiGlobe className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 text-sm">For large organizations</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Volume discounts available</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Everything in Business</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited users</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Custom integrations & SSO</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">White-labeling options</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">24/7 phone & priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">SLA guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">On-premise deployment option</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Custom training & onboarding</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-20 bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">All Plans Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiShield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security & Compliance</h3>
              <p className="text-gray-600">Enterprise-grade security, data encryption, GDPR compliant</p>
            </div>
            <div className="text-center">
              <FiZap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">99.9% uptime SLA, cloud-based infrastructure, regular backups</p>
            </div>
            <div className="text-center">
              <FiBarChart2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">Real-time dashboards, custom reports, data export</p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white text-center mb-20">
          <h2 className="text-3xl font-bold mb-4">Need Enterprise Solutions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Custom pricing and features tailored to your organization's needs. Contact our sales team for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@worklogz.com"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contact Sales
            </a>
            <Link
              to="/register"
              className="inline-block bg-indigo-700 text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-800 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">All paid plans include a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, net banking, and bank transfers for Indian customers.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Do you offer discounts?</h3>
              <p className="text-gray-600">Yes, we offer special pricing for annual subscriptions (save 20%), educational institutions, and NGOs.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">How does per-user pricing work?</h3>
              <p className="text-gray-600">You only pay for active users in your organization. You can add or remove users at any time, and billing adjusts automatically.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.</p>
            </div>
          </div>
        </div>
      </div>
      
      <LandingFooter />
    </div>
    </>
  );
};

export default Pricing;

