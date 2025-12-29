const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const adminController = require('../controllers/adminController');

/**
 * Admin Routes
 * These routes are accessible to both regular admin and master-admin
 * Master admin uses these routes for development purposes
 * Note: Master admin does NOT have access to user management routes (/users/*)
 */
router.get('/summary', auth, adminController.getAdminSummary);
router.get('/recent-attendance', auth, adminController.getRecentAttendance);
router.get('/pending-users', auth, adminController.getPendingUsers);
router.post('/approve/:id', auth, adminController.approveUser);
router.delete('/reject/:id', auth, adminController.rejectUser);

module.exports = router;