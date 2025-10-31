const express = require('express');
const router = express.Router();
const {
  getUserAchievements,
  awardAchievement,
  getLeaderboard,
  getUserGoals,
  createGoal,
  updateGoalProgress,
  deleteGoal,
  getUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getDashboardStats
} = require('../controllers/achievementController');

const authenticate = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// ========== ACHIEVEMENTS ==========
router.get('/achievements/me', authenticate, getUserAchievements);
router.get('/achievements/:userId', authenticate, getUserAchievements);
router.post('/achievements/award', authenticate, roleMiddleware('admin'), awardAchievement);
router.get('/leaderboard', authenticate, getLeaderboard);

// ========== GOALS ==========
router.get('/goals/me', authenticate, getUserGoals);
router.get('/goals/:userId', authenticate, getUserGoals);
router.post('/goals', authenticate, createGoal);
router.put('/goals/:id/progress', authenticate, updateGoalProgress);
router.delete('/goals/:id', authenticate, deleteGoal);

// ========== EVENTS/CALENDAR ==========
router.get('/events', authenticate, getUserEvents);
router.post('/events', authenticate, createEvent);
router.put('/events/:id', authenticate, updateEvent);
router.delete('/events/:id', authenticate, deleteEvent);

// ========== DASHBOARD ==========
router.get('/dashboard/stats', authenticate, getDashboardStats);

module.exports = router;

