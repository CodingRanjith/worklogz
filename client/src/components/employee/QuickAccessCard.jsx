import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiCalendar, FiTrendingUp, FiFileText } from 'react-icons/fi';

const QuickAccessCard = () => {
  const quickLinks = [
    {
      title: 'Goals & Achievements',
      description: 'Track your goals and earn badges',
      icon: <FiTarget className="text-4xl" />,
      path: '/goals-achievements',
      color: 'from-purple-500 to-pink-500',
      emoji: '🏆'
    },
    {
      title: 'My Calendar',
      description: 'Manage events and schedule',
      icon: <FiCalendar className="text-4xl" />,
      path: '/calendar',
      color: 'from-blue-500 to-cyan-500',
      emoji: '📅'
    },
    {
      title: 'Performance',
      description: 'View your complete analytics',
      icon: <FiTrendingUp className="text-4xl" />,
      path: '/performance',
      color: 'from-green-500 to-emerald-500',
      emoji: '📊'
    },
    {
      title: 'Timesheet',
      description: 'Log your work hours',
      icon: <FiFileText className="text-4xl" />,
      path: '/timesheet',
      color: 'from-orange-500 to-red-500',
      emoji: '⏰'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-blue-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🚀 Quick Access</h2>
        <p className="text-gray-600">Navigate to your favorite features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`bg-gradient-to-br ${link.color} p-6 text-white h-full`}>
              <div className="absolute top-2 right-2 text-3xl opacity-50 group-hover:scale-125 transition-transform">
                {link.emoji}
              </div>
              <div className="mb-4 opacity-90 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{link.title}</h3>
              <p className="text-sm opacity-90">{link.description}</p>
              <div className="mt-4 inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">
                View →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature Highlight */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-gray-800 mb-1">New Features Available!</p>
            <p className="text-sm text-gray-600">
              Explore our new employee engagement features: set goals, track achievements, manage your calendar, and monitor your performance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessCard;

