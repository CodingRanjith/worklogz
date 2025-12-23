const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload'); // ⬅️ We'll create this file next

// Test route (no auth) for debugging
router.get('/test', (req, res) => {
  res.json({ message: 'Attendance routes are loaded', timestamp: new Date() });
});

router.post('/', auth, upload.single('image'), attendanceController.markAttendance);
router.get('/all', auth, role(['admin', 'user']), attendanceController.getAllAttendance);
router.get('/last', auth, attendanceController.getLastAttendance);
router.get('/user/:userId/summary/:year/:month', auth, role(['admin', 'user']), attendanceController.getUserSummary);
router.get('/user/:userId/last', auth, role(['admin', 'user']), attendanceController.getUserLastAttendance);
router.get('/user/:userId', auth, role(['admin', 'user']), attendanceController.getAttendanceByUser);
router.get('/me', auth, attendanceController.getMyAttendance);
router.get('/date/:date', auth, role(['admin', 'user']), attendanceController.getAttendanceByDate);
module.exports = router;
