import React from 'react';
import { FiShield, FiGlobe, FiDatabase, FiLock, FiSettings, FiHeadphones, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForEnterprise = () => {
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
            Worklogz for <span className="text-indigo-600">Enterprise</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade workforce management with advanced security, customization, and dedicated support for large organizations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiShield className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Advanced Security</h3>
            <p className="text-gray-600">
              Enterprise-grade security with SSO, MFA, encryption, and compliance with industry standards.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiGlobe className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Global Scale</h3>
            <p className="text-gray-600">
              Manage teams across multiple locations, time zones, and countries with ease.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiDatabase className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Data Management</h3>
            <p className="text-gray-600">
              Unlimited data storage, advanced reporting, and custom data analytics for your organization.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiLock className="text-3xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Custom Access Control</h3>
            <p className="text-gray-600">
              Granular permissions, role-based access, and custom security policies tailored to your needs.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiSettings className="text-3xl text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Custom Integration</h3>
            <p className="text-gray-600">
              API access, custom integrations, and white-label options to fit your existing infrastructure.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-pink-500">
            <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiHeadphones className="text-3xl text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Dedicated Support</h3>
            <p className="text-gray-600">
              Priority support with dedicated account manager and 24/7 technical assistance.
            </p>
          </div>
        </div>

        {/* Enterprise Features */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Enterprise Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-2">Unlimited Users</h4>
              <p className="text-sm opacity-90">Scale without limits</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-2">Custom SLA</h4>
              <p className="text-sm opacity-90">Service level agreements</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-2">On-Premise Option</h4>
              <p className="text-sm opacity-90">Deploy on your servers</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-2">Training & Onboarding</h4>
              <p className="text-sm opacity-90">Comprehensive team training</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Enterprise Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Enterprise */}
            <div className="border-2 border-indigo-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹19,999</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Up to 200 employees</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">All Professional features</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Advanced security (SSO, MFA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">99.9% uptime SLA</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Contact Sales
              </Link>
            </div>

            {/* Premium Enterprise */}
            <div className="border-2 border-indigo-500 rounded-xl p-8 bg-gradient-to-br from-indigo-50 to-purple-50 relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-bold">
                Recommended
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
                <span className="text-gray-600"> pricing</span>
                <p className="text-sm text-gray-500 mt-1">Unlimited employees</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Everything in Standard</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">On-premise deployment</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">White-label solution</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom SLA & training</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">24/7 priority support</span>
                </li>
              </ul>
              <a
                href="mailto:sales@worklogz.com"
                className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8">
            All enterprise plans include custom pricing based on your specific requirements. Contact us for a personalized quote.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-indigo-200">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready for Enterprise?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact our sales team to discuss custom enterprise solutions tailored to your organization.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors"
            >
              Schedule Demo
            </Link>
            <a
              href="mailto:sales@worklogz.com"
              className="inline-block bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForEnterprise;

