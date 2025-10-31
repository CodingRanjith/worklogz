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
  resetUserDailyEarnings
} = require('../controllers/dailySalaryController');

const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// Public/User routes (requires authentication)
router.get('/earnings/me', authenticate, getUserDailyEarnings);
router.get('/earnings/:userId', authenticate, getUserDailyEarnings);

// Admin routes
router.post('/config', authenticate, isAdmin, createDailySalaryConfig);
router.get('/config', authenticate, isAdmin, getAllDailySalaryConfigs);
router.get('/config/:id', authenticate, isAdmin, getDailySalaryConfigById);
router.put('/config/:id', authenticate, isAdmin, updateDailySalaryConfig);
router.delete('/config/:id', authenticate, isAdmin, deleteDailySalaryConfig);
router.patch('/config/:id/toggle', authenticate, isAdmin, toggleConfigStatus);
router.post('/apply-credits', authenticate, isAdmin, applyDailyCreditsManually);
router.get('/stats', authenticate, isAdmin, getDailySalaryStats);
router.post('/reset-earnings/:userId', authenticate, isAdmin, resetUserDailyEarnings);

module.exports = router;

