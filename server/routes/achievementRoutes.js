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
const authorizeAccess = require('../middleware/authorizeAccess');

// ========== ACHIEVEMENTS ==========
router.get('/achievements/me', authenticate, authorizeAccess, getUserAchievements);
router.get('/achievements/:userId', authenticate, authorizeAccess, getUserAchievements);
router.post('/achievements/award', authenticate, authorizeAccess, awardAchievement);
router.get('/leaderboard', authenticate, authorizeAccess, getLeaderboard);

// ========== GOALS ==========
router.get('/goals/me', authenticate, authorizeAccess, getUserGoals);
router.get('/goals/:userId', authenticate, authorizeAccess, getUserGoals);
router.post('/goals', authenticate, authorizeAccess, createGoal);
router.put('/goals/:id/progress', authenticate, authorizeAccess, updateGoalProgress);
router.delete('/goals/:id', authenticate, authorizeAccess, deleteGoal);

// ========== EVENTS/CALENDAR ==========
router.get('/events', authenticate, authorizeAccess, getUserEvents);
router.post('/events', authenticate, authorizeAccess, createEvent);
router.put('/events/:id', authenticate, authorizeAccess, updateEvent);
router.delete('/events/:id', authenticate, authorizeAccess, deleteEvent);

// ========== DASHBOARD ==========
router.get('/dashboard/stats', authenticate, authorizeAccess, getDashboardStats);

module.exports = router;

