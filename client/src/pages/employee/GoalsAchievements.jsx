import React, { useState, useEffect } from 'react';
import { FiTrophy, FiTarget, FiAward, FiPlus, FiTrash2, FiEdit, FiCheck, FiStar } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const GoalsAchievements = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'attendance',
    targetValue: 0,
    unit: 'days',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      if (activeTab === 'goals') {
        const response = await fetch(API_ENDPOINTS.getUserGoals, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setGoals(data.data.goals);
          setStats(data.data.stats);
        }
      } else if (activeTab === 'achievements') {
        const response = await fetch(API_ENDPOINTS.getUserAchievements, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setAchievements(data.data.achievements);
          setStats({ totalPoints: data.data.totalPoints, count: data.data.count });
        }
      } else if (activeTab === 'leaderboard') {
        const response = await fetch(API_ENDPOINTS.getLeaderboard, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(API_ENDPOINTS.createGoal, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGoal)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowGoalForm(false);
        setNewGoal({
          title: '',
          description: '',
          category: 'attendance',
          targetValue: 0,
          unit: 'days',
          endDate: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateProgress = async (goalId, newValue) => {
    const token = localStorage.getItem('token');
    
    try {
      await fetch(API_ENDPOINTS.updateGoalProgress(goalId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentValue: newValue })
      });
      fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      await fetch(API_ENDPOINTS.deleteGoal(goalId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl text-white">
                <FiTrophy className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Goals & Achievements</h1>
                <p className="text-gray-600">Track your progress and celebrate your wins! 🎉</p>
              </div>
            </div>
            {activeTab === 'achievements' && stats.totalPoints && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-4xl font-bold text-purple-600">{stats.totalPoints}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'goals'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiTarget /> My Goals
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'achievements'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiAward /> Achievements
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiStar /> Leaderboard
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600">Active Goals</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.inProgress || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
                  >
                    <FiPlus /> New Goal
                  </button>
                </div>

                {/* Goal Form */}
                {showGoalForm && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-purple-300">
                    <h3 className="text-xl font-bold mb-4 text-purple-700">Create New Goal</h3>
                    <form onSubmit={handleCreateGoal} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Goal Title"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          className="border rounded-lg px-4 py-2"
                          required
                        />
                        <select
                          value={newGoal.category}
                          onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                          className="border rounded-lg px-4 py-2"
                        >
                          <option value="attendance">Attendance</option>
                          <option value="tasks">Tasks</option>
                          <option value="learning">Learning</option>
                          <option value="performance">Performance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        className="border rounded-lg px-4 py-2 w-full"
                        rows="2"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="number"
                          placeholder="Target Value"
                          value={newGoal.targetValue}
                          onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) })}
                          className="border rounded-lg px-4 py-2"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Unit (e.g., days, tasks)"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                          className="border rounded-lg px-4 py-2"
                        />
                        <input
                          type="date"
                          value={newGoal.endDate}
                          onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                          className="border rounded-lg px-4 py-2"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600"
                        >
                          Create Goal
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGoalForm(false)}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Goals List */}
                <div className="space-y-4">
                  {goals.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                      <FiTarget className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No goals yet. Create your first goal to get started!</p>
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal._id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(goal.status)}`}>
                                {goal.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>📁 {goal.category}</span>
                              <span>📅 Due: {new Date(goal.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-purple-600">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                            >
                              {getProgressPercentage(goal.currentValue, goal.targetValue) > 10 && (
                                <span className="text-white text-xs font-bold">
                                  {Math.round(getProgressPercentage(goal.currentValue, goal.targetValue))}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Update Progress */}
                        {goal.status === 'in_progress' && (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Update progress"
                              className="border rounded-lg px-4 py-2 flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateProgress(goal._id, parseInt(e.target.value));
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
                              <FiCheck /> Update
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 mb-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Your Achievement Collection</h2>
                      <p className="opacity-90">You've earned {stats.count || 0} badges with {stats.totalPoints || 0} total points!</p>
                    </div>
                    <FiAward className="text-6xl opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
                      <FiAward className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No achievements yet. Keep working hard!</p>
                    </div>
                  ) : (
                    achievements.map((achievement) => (
                      <div
                        key={achievement._id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-t-4 border-yellow-400"
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{achievement.icon}</div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                          <div className="flex justify-center items-center gap-4">
                            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                              +{achievement.points} pts
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(achievement.earnedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">🏆 Top Performers</h2>
                  <p className="opacity-90">See who's leading the pack!</p>
                </div>

                <div className="p-6">
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                      <FiStar className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No leaderboard data yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leaderboard.map((user, index) => (
                        <div
                          key={user.userId}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                            index === 0 ? 'bg-yellow-50 border-yellow-300' :
                            index === 1 ? 'bg-gray-50 border-gray-300' :
                            index === 2 ? 'bg-orange-50 border-orange-300' :
                            'bg-white border-gray-200'
                          }`}
                        >
                          <div className={`text-4xl font-bold ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-400' :
                            'text-gray-300'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{user.totalPoints}</p>
                            <p className="text-sm text-gray-600">{user.achievementCount} badges</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoalsAchievements;

