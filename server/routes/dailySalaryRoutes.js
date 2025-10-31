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

const authenticate = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Public/User routes (requires authentication)
router.get('/earnings/me', authenticate, getUserDailyEarnings);
router.get('/earnings/:userId', authenticate, getUserDailyEarnings);

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

module.exports = router;

