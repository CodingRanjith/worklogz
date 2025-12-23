const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const adminController = require('../controllers/adminController');

router.get('/summary', auth, adminController.getAdminSummary);
router.get('/recent-attendance', auth, adminController.getRecentAttendance);
router.get('/pending-users', auth, adminController.getPendingUsers);
router.post('/approve/:id', auth, adminController.approveUser);
router.delete('/reject/:id', auth, adminController.rejectUser);

module.exports = router;