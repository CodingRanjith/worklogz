import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiActivity, FiTarget, FiCalendar, FiAward, FiDollarSign, FiClock } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const PerformanceDashboard = () => {
  const [stats, setStats] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [earningsData, setEarningsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch engagement stats
      const engagementRes = await fetch(API_ENDPOINTS.getEngagementDashboard, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const engagementData = await engagementRes.json();
      
      // Fetch earnings data
      const earningsRes = await fetch(API_ENDPOINTS.getUserDailyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const earningsResult = await earningsRes.json();
      
      if (engagementData.success) {
        setStats(engagementData.data);
      }
      
      if (earningsResult.success) {
        setEarningsData(earningsResult.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-500">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl text-white">
              <FiActivity className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Performance Dashboard</h1>
              <p className="text-gray-600">Your complete performance overview 📊</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Points */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiAward className="text-3xl" />
              <span className="text-4xl font-bold">{stats.totalPoints || 0}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Total Points</h3>
            <p className="text-sm opacity-75">{stats.achievementCount || 0} achievements earned</p>
          </div>

          {/* Active Goals */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiTarget className="text-3xl" />
              <span className="text-4xl font-bold">{stats.activeGoals || 0}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Active Goals</h3>
            <p className="text-sm opacity-75">{stats.completedGoals || 0} completed</p>
          </div>

          {/* Daily Earnings */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-3xl" />
              <span className="text-4xl font-bold">₹{earningsData.dailyRate || 0}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Daily Rate</h3>
            <p className="text-sm opacity-75">Per working day</p>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiCalendar className="text-3xl" />
              <span className="text-4xl font-bold">{stats.upcomingEvents || 0}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Upcoming Events</h3>
            <p className="text-sm opacity-75">Next 7 days</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiAward className="text-yellow-500" /> Recent Achievements
            </h2>
            {stats.recentAchievements && stats.recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400"
                  >
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-sm">
                      +{achievement.points}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiAward className="text-6xl mx-auto mb-4 opacity-20" />
                <p>No achievements yet. Keep working to earn badges!</p>
              </div>
            )}
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-green-500" /> Earnings Breakdown
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-3 rounded-full text-white">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-blue-600">₹{earningsData.dailyRate || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 p-3 rounded-full text-white">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-purple-600">₹{earningsData.weeklyEarnings || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 p-3 rounded-full text-white">
                    <FiTrendingUp />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-orange-600">₹{earningsData.monthlyEarnings || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-300">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-3 rounded-full text-white">
                    <FiDollarSign />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Accumulated</p>
                    <p className="text-3xl font-bold text-green-600">₹{earningsData.dailyEarnings || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Configurations */}
        {earningsData.applicableConfigs && earningsData.applicableConfigs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⚙️ Active Credit Configurations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {earningsData.applicableConfigs.map((config, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{config.name}</h3>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      +₹{config.amount}
                    </span>
                  </div>
                  {config.description && (
                    <p className="text-sm text-gray-600">{config.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            💡 Performance Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎯 Set Goals</h3>
              <p className="text-sm opacity-90">
                Create clear, achievable goals and track your progress regularly to stay motivated.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📅 Stay Organized</h3>
              <p className="text-sm opacity-90">
                Use the calendar to manage your events and deadlines effectively.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🏆 Earn Badges</h3>
              <p className="text-sm opacity-90">
                Complete tasks and maintain good attendance to earn achievement badges.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <a
            href="/goals-achievements"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-center border-t-4 border-purple-500"
          >
            <FiTarget className="text-5xl text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg mb-2">Manage Goals</h3>
            <p className="text-sm text-gray-600">Create and track your goals</p>
          </a>

          <a
            href="/calendar"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-center border-t-4 border-blue-500"
          >
            <FiCalendar className="text-5xl text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg mb-2">View Calendar</h3>
            <p className="text-sm text-gray-600">Check your schedule</p>
          </a>

          <a
            href="/attendance"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-center border-t-4 border-green-500"
          >
            <FiDollarSign className="text-5xl text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-lg mb-2">View Earnings</h3>
            <p className="text-sm text-gray-600">Track your daily credits</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;

