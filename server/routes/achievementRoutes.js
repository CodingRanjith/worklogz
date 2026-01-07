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

/**
 * @swagger
 * /api/engagement/achievements/me:
 *   get:
 *     summary: Get current user's achievements
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 */
router.get('/achievements/me', authenticate, authorizeAccess, getUserAchievements);

/**
 * @swagger
 * /api/engagement/achievements/{userId}:
 *   get:
 *     summary: Get achievements for a specific user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of achievements
 */
router.get('/achievements/:userId', authenticate, authorizeAccess, getUserAchievements);

/**
 * @swagger
 * /api/engagement/achievements/award:
 *   post:
 *     summary: Award an achievement to a user (Admin only)
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AchievementAward'
 *     responses:
 *       201:
 *         description: Achievement awarded successfully
 */
router.post('/achievements/award', authenticate, authorizeAccess, awardAchievement);

/**
 * @swagger
 * /api/engagement/leaderboard:
 *   get:
 *     summary: Get achievement leaderboard
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get('/leaderboard', authenticate, authorizeAccess, getLeaderboard);

// ========== GOALS ==========

/**
 * @swagger
 * /api/engagement/goals/me:
 *   get:
 *     summary: Get current user's goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get('/goals/me', authenticate, authorizeAccess, getUserGoals);

/**
 * @swagger
 * /api/engagement/goals/{userId}:
 *   get:
 *     summary: Get goals for a specific user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get('/goals/:userId', authenticate, authorizeAccess, getUserGoals);

/**
 * @swagger
 * /api/engagement/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post('/goals', authenticate, authorizeAccess, createGoal);

/**
 * @swagger
 * /api/engagement/goals/{id}/progress:
 *   put:
 *     summary: Update goal progress
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Goal progress updated
 */
router.put('/goals/:id/progress', authenticate, authorizeAccess, updateGoalProgress);

/**
 * @swagger
 * /api/engagement/goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 */
router.delete('/goals/:id', authenticate, authorizeAccess, deleteGoal);

// ========== EVENTS/CALENDAR ==========

/**
 * @swagger
 * /api/engagement/events:
 *   get:
 *     summary: Get user events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/events', authenticate, authorizeAccess, getUserEvents);

/**
 * @swagger
 * /api/engagement/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/events', authenticate, authorizeAccess, createEvent);

/**
 * @swagger
 * /api/engagement/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.put('/events/:id', authenticate, authorizeAccess, updateEvent);

/**
 * @swagger
 * /api/engagement/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
router.delete('/events/:id', authenticate, authorizeAccess, deleteEvent);

// ========== DASHBOARD ==========

/**
 * @swagger
 * /api/engagement/dashboard/stats:
 *   get:
 *     summary: Get engagement dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard/stats', authenticate, authorizeAccess, getDashboardStats);

module.exports = router;

