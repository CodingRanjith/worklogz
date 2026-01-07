const express = require('express');
const router = express.Router();
const {
  createDailySalaryConfig,
  getAllDailySalaryConfigs,
  getDailySalaryConfigById,
  updateDailySalaryConfig,
  deleteDailySalaryConfig,
  toggleConfigStatus,
  applyDailyCreditsManually,
  getUserDailyEarnings,
  getDailySalaryStats,
  resetUserDailyEarnings,
  manualCredit,
  updateUserSalary,
  getUserSalaryHistory,
  getMySalaryHistory,
  getUserCreditHistory,
  getMyCreditHistory,
  editCreditTransaction,
  deleteCreditTransaction
} = require('../controllers/dailySalaryController');

const authenticate = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

/**
 * @swagger
 * /api/daily-salary/earnings/me:
 *   get:
 *     summary: Get current user's daily earnings
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily earnings data
 */
router.get('/earnings/me', authenticate, authorizeAccess, getUserDailyEarnings);

/**
 * @swagger
 * /api/daily-salary/earnings/{userId}:
 *   get:
 *     summary: Get daily earnings for a specific user (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User daily earnings
 */
router.get('/earnings/:userId', authenticate, authorizeAccess, getUserDailyEarnings);

/**
 * @swagger
 * /api/daily-salary/salary-history/me:
 *   get:
 *     summary: Get current user's salary history
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salary history
 */
router.get('/salary-history/me', authenticate, authorizeAccess, getMySalaryHistory);

/**
 * @swagger
 * /api/daily-salary/credit-history/me:
 *   get:
 *     summary: Get current user's credit history
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credit history
 */
router.get('/credit-history/me', authenticate, authorizeAccess, getMyCreditHistory);

/**
 * @swagger
 * /api/daily-salary/config:
 *   post:
 *     summary: Create daily salary configuration (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Configuration created
 */
router.post('/config', authenticate, authorizeAccess, createDailySalaryConfig);

/**
 * @swagger
 * /api/daily-salary/config:
 *   get:
 *     summary: Get all daily salary configurations (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of configurations
 */
router.get('/config', authenticate, authorizeAccess, getAllDailySalaryConfigs);

/**
 * @swagger
 * /api/daily-salary/config/{id}:
 *   get:
 *     summary: Get daily salary configuration by ID (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration details
 */
router.get('/config/:id', authenticate, authorizeAccess, getDailySalaryConfigById);

/**
 * @swagger
 * /api/daily-salary/config/{id}:
 *   put:
 *     summary: Update daily salary configuration (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration updated
 */
router.put('/config/:id', authenticate, authorizeAccess, updateDailySalaryConfig);

/**
 * @swagger
 * /api/daily-salary/config/{id}:
 *   delete:
 *     summary: Delete daily salary configuration (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration deleted
 */
router.delete('/config/:id', authenticate, authorizeAccess, deleteDailySalaryConfig);

/**
 * @swagger
 * /api/daily-salary/config/{id}/toggle:
 *   patch:
 *     summary: Toggle daily salary configuration status (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch('/config/:id/toggle', authenticate, authorizeAccess, toggleConfigStatus);

/**
 * @swagger
 * /api/daily-salary/apply-credits:
 *   post:
 *     summary: Apply daily credits manually (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credits applied
 */
router.post('/apply-credits', authenticate, authorizeAccess, applyDailyCreditsManually);

/**
 * @swagger
 * /api/daily-salary/stats:
 *   get:
 *     summary: Get daily salary statistics (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get('/stats', authenticate, authorizeAccess, getDailySalaryStats);

/**
 * @swagger
 * /api/daily-salary/reset-earnings/{userId}:
 *   post:
 *     summary: Reset user daily earnings (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Earnings reset
 */
router.post('/reset-earnings/:userId', authenticate, authorizeAccess, resetUserDailyEarnings);

/**
 * @swagger
 * /api/daily-salary/manual-credit:
 *   post:
 *     summary: Manually credit user (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credit applied
 */
router.post('/manual-credit', authenticate, authorizeAccess, manualCredit);

/**
 * @swagger
 * /api/daily-salary/update-salary:
 *   post:
 *     summary: Update user salary (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - salary
 *             properties:
 *               userId:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Salary updated
 */
router.post('/update-salary', authenticate, authorizeAccess, updateUserSalary);

/**
 * @swagger
 * /api/daily-salary/salary-history/{userId}:
 *   get:
 *     summary: Get user salary history (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salary history
 */
router.get('/salary-history/:userId', authenticate, authorizeAccess, getUserSalaryHistory);

/**
 * @swagger
 * /api/daily-salary/credit-history/{userId}:
 *   get:
 *     summary: Get user credit history (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Credit history
 */
router.get('/credit-history/:userId', authenticate, authorizeAccess, getUserCreditHistory);

/**
 * @swagger
 * /api/daily-salary/credit-transaction/{transactionId}:
 *   put:
 *     summary: Edit credit transaction (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put('/credit-transaction/:transactionId', authenticate, authorizeAccess, editCreditTransaction);

/**
 * @swagger
 * /api/daily-salary/credit-transaction/{transactionId}:
 *   delete:
 *     summary: Delete credit transaction (Admin only)
 *     tags: [Daily Salary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
router.delete('/credit-transaction/:transactionId', authenticate, authorizeAccess, deleteCreditTransaction);

module.exports = router;

