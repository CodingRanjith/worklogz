import React from 'react';
import { FiUsers, FiBarChart2, FiShield, FiZap, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForBusiness = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Login
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Worklogz for <span className="text-blue-600">Business</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your team's workflow, improve productivity, and make data-driven decisions with our comprehensive business management platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Team Management</h3>
            <p className="text-gray-600">
              Manage your entire team, track attendance, and monitor performance from a single dashboard.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiBarChart2 className="text-3xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">
              Get comprehensive insights into your business operations with detailed reports and analytics.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiShield className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Enterprise Security</h3>
            <p className="text-gray-600">
              Bank-level security with role-based access control to protect your sensitive business data.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiZap className="text-3xl text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Automation</h3>
            <p className="text-gray-600">
              Automate repetitive tasks, payroll processing, and attendance tracking to save time and reduce errors.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiTrendingUp className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Performance Tracking</h3>
            <p className="text-gray-600">
              Monitor employee performance, set goals, and track achievements to drive business growth.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-pink-500">
            <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiCheckCircle className="text-3xl text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Compliance</h3>
            <p className="text-gray-600">
              Stay compliant with labor laws, generate required reports, and maintain accurate records.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Businesses Choose Worklogz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Scalable Solution</h4>
                <p className="text-gray-600">Grows with your business from startup to enterprise level.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Cost Effective</h4>
                <p className="text-gray-600">Reduce operational costs with automated processes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Easy Integration</h4>
                <p className="text-gray-600">Seamlessly integrates with your existing tools and systems.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
                <p className="text-gray-600">Get help whenever you need it with our dedicated support team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹1,999</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Up to 10 employees</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Team attendance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Basic analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Leave management</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="border-2 border-blue-500 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹4,999</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Up to 50 employees</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Everything in Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Payroll integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">API access</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹9,999</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Unlimited employees</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Everything in Professional</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">White-label options</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">24/7 phone support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">SLA guarantee</span>
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Transform Your Business Operations</h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading businesses that trust Worklogz for their workforce management needs.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForBusiness;

