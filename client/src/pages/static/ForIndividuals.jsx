import React from 'react';
import { FiClock, FiTrendingUp, FiTarget, FiUsers, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForIndividuals = () => {
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
            Worklogz for <span className="text-purple-600">Individuals</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take control of your time, track your productivity, and achieve your personal goals with our intuitive platform designed for freelancers and independent professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiClock className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Time Tracking</h3>
            <p className="text-gray-600">
              Effortlessly track your work hours, breaks, and project time with our smart time tracking system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiTarget className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Goal Setting</h3>
            <p className="text-gray-600">
              Set personal goals, track your progress, and celebrate achievements with our goal management system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiTrendingUp className="text-3xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Productivity Insights</h3>
            <p className="text-gray-600">
              Get detailed analytics on your work patterns and productivity to optimize your workflow.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiCalendar className="text-3xl text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Calendar Management</h3>
            <p className="text-gray-600">
              Organize your schedule, set reminders, and never miss an important deadline.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiDollarSign className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Earnings Tracking</h3>
            <p className="text-gray-600">
              Monitor your daily earnings, track payments, and manage your financial goals.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-pink-500">
            <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="text-3xl text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Client Management</h3>
            <p className="text-gray-600">
              Keep track of your clients, projects, and communication all in one place.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Basic time tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Up to 3 projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Basic reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Mobile app access</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-purple-500 rounded-xl p-8 bg-gradient-to-br from-purple-50 to-indigo-50 relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-bold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹499</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Unlimited time tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Goal tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Export reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Priority support</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Client management</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Invoice generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">24/7 support</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of individuals who are already using Worklogz to boost their productivity.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForIndividuals;

