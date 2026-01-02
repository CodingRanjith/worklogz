const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const adminController = require('../controllers/adminController');

/**
 * Admin Routes
 * These routes are accessible to both regular admin and master-admin
 * Master admin uses these routes for development purposes
 * Note: Master admin does NOT have access to user management routes (/users/*)
 */
router.get('/summary', auth, authorizeAccess, adminController.getAdminSummary);
router.get('/recent-attendance', auth, authorizeAccess, adminController.getRecentAttendance);
router.get('/pending-users', auth, authorizeAccess, adminController.getPendingUsers);
router.post('/approve/:id', auth, authorizeAccess, adminController.approveUser);
router.delete('/reject/:id', auth, authorizeAccess, adminController.rejectUser);

module.exports = router;