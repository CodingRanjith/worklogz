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

// Public/User routes (requires authentication)
router.get('/earnings/me', authenticate, authorizeAccess, getUserDailyEarnings);
router.get('/earnings/:userId', authenticate, authorizeAccess, getUserDailyEarnings);
router.get('/salary-history/me', authenticate, authorizeAccess, getMySalaryHistory);
router.get('/credit-history/me', authenticate, authorizeAccess, getMyCreditHistory);

// Admin routes
router.post('/config', authenticate, authorizeAccess, createDailySalaryConfig);
router.get('/config', authenticate, authorizeAccess, getAllDailySalaryConfigs);
router.get('/config/:id', authenticate, authorizeAccess, getDailySalaryConfigById);
router.put('/config/:id', authenticate, authorizeAccess, updateDailySalaryConfig);
router.delete('/config/:id', authenticate, authorizeAccess, deleteDailySalaryConfig);
router.patch('/config/:id/toggle', authenticate, authorizeAccess, toggleConfigStatus);
router.post('/apply-credits', authenticate, authorizeAccess, applyDailyCreditsManually);
router.get('/stats', authenticate, authorizeAccess, getDailySalaryStats);
router.post('/reset-earnings/:userId', authenticate, authorizeAccess, resetUserDailyEarnings);
router.post('/manual-credit', authenticate, authorizeAccess, manualCredit);
router.post('/update-salary', authenticate, authorizeAccess, updateUserSalary);
router.get('/salary-history/:userId', authenticate, authorizeAccess, getUserSalaryHistory);
router.get('/credit-history/:userId', authenticate, authorizeAccess, getUserCreditHistory);
router.put('/credit-transaction/:transactionId', authenticate, authorizeAccess, editCreditTransaction);
router.delete('/credit-transaction/:transactionId', authenticate, authorizeAccess, deleteCreditTransaction);

module.exports = router;

