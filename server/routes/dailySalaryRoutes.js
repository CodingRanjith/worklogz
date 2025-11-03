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
const roleMiddleware = require('../middleware/role');

// Public/User routes (requires authentication)
router.get('/earnings/me', authenticate, getUserDailyEarnings);
router.get('/earnings/:userId', authenticate, getUserDailyEarnings);
router.get('/salary-history/me', authenticate, getMySalaryHistory);
router.get('/credit-history/me', authenticate, getMyCreditHistory);

// Admin routes
router.post('/config', authenticate, roleMiddleware('admin'), createDailySalaryConfig);
router.get('/config', authenticate, roleMiddleware('admin'), getAllDailySalaryConfigs);
router.get('/config/:id', authenticate, roleMiddleware('admin'), getDailySalaryConfigById);
router.put('/config/:id', authenticate, roleMiddleware('admin'), updateDailySalaryConfig);
router.delete('/config/:id', authenticate, roleMiddleware('admin'), deleteDailySalaryConfig);
router.patch('/config/:id/toggle', authenticate, roleMiddleware('admin'), toggleConfigStatus);
router.post('/apply-credits', authenticate, roleMiddleware('admin'), applyDailyCreditsManually);
router.get('/stats', authenticate, roleMiddleware('admin'), getDailySalaryStats);
router.post('/reset-earnings/:userId', authenticate, roleMiddleware('admin'), resetUserDailyEarnings);
router.post('/manual-credit', authenticate, roleMiddleware('admin'), manualCredit);
router.post('/update-salary', authenticate, roleMiddleware('admin'), updateUserSalary);
router.get('/salary-history/:userId', authenticate, roleMiddleware('admin'), getUserSalaryHistory);
router.get('/credit-history/:userId', authenticate, roleMiddleware('admin'), getUserCreditHistory);
router.put('/credit-transaction/:transactionId', authenticate, roleMiddleware('admin'), editCreditTransaction);
router.delete('/credit-transaction/:transactionId', authenticate, roleMiddleware('admin'), deleteCreditTransaction);

module.exports = router;

