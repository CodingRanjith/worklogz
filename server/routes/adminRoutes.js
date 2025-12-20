const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const adminController = require('../controllers/adminController');

router.get('/summary', auth, role('hr'), adminController.getAdminSummary);
router.get('/recent-attendance', auth, role('hr'), adminController.getRecentAttendance);
router.get('/pending-users', auth, role('hr'), adminController.getPendingUsers);
router.post('/approve/:id', auth, role('hr'), adminController.approveUser);
router.delete('/reject/:id', auth, role('hr'), adminController.rejectUser);

module.exports = router;