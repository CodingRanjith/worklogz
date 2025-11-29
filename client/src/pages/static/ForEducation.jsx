import React from 'react';
import { FiBook, FiUsers, FiAward, FiCalendar, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForEducation = () => {
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
            Worklogz for <span className="text-green-600">Education</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage faculty, track student attendance, and streamline administrative tasks for educational institutions of all sizes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiBook className="text-3xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Student Management</h3>
            <p className="text-gray-600">
              Track student attendance, manage schedules, and monitor academic progress all in one platform.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiUsers className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Faculty Management</h3>
            <p className="text-gray-600">
              Manage faculty schedules, track teaching hours, and handle leave requests efficiently.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiAward className="text-3xl text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Performance Tracking</h3>
            <p className="text-gray-600">
              Monitor student and faculty performance with comprehensive analytics and reporting tools.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiCalendar className="text-3xl text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Academic Calendar</h3>
            <p className="text-gray-600">
              Manage academic schedules, holidays, and important dates with our integrated calendar system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiBarChart2 className="text-3xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Reporting & Analytics</h3>
            <p className="text-gray-600">
              Generate detailed reports for attendance, performance, and administrative compliance.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-pink-500">
            <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <FiCheckCircle className="text-3xl text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Compliance</h3>
            <p className="text-gray-600">
              Stay compliant with educational regulations and maintain accurate records for audits.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perfect for Educational Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Schools & Colleges</h4>
                <p className="text-gray-600">Manage daily operations for K-12 and higher education institutions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Training Centers</h4>
                <p className="text-gray-600">Track attendance and progress for professional training programs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Online Learning</h4>
                <p className="text-gray-600">Support both in-person and remote learning environments.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiCheckCircle className="text-2xl text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Special Discounts</h4>
                <p className="text-gray-600">Educational pricing available for schools and universities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Education Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* School Plan */}
            <div className="border-2 border-green-200 rounded-xl p-8 hover:border-green-500 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹2,499</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Up to 100 students</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Student & faculty management</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Attendance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Academic calendar</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Basic reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* University Plan */}
            <div className="border-2 border-green-500 rounded-xl p-8 bg-gradient-to-br from-green-50 to-emerald-50 relative">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm font-bold">
                Best Value
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">University</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹4,999</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-gray-500 mt-1">Unlimited students</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Everything in School</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Multi-campus support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-gray-600">Dedicated training</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8">
            Special educational discounts available. Contact us for custom pricing for large institutions.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Empower Your Institution</h2>
          <p className="text-xl mb-8 opacity-90">
            Join educational institutions worldwide using Worklogz to streamline their operations.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started with Education Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForEducation;

