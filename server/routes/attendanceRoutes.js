const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const upload = require('../middleware/upload'); // ⬅️ We'll create this file next

// Test route (no auth) for debugging
router.get('/test', (req, res) => {
  res.json({ message: 'Attendance routes are loaded', timestamp: new Date() });
});

router.post('/', auth, authorizeAccess, upload.single('image'), attendanceController.markAttendance);
router.get('/all', auth, authorizeAccess, attendanceController.getAllAttendance);
router.get('/last', auth, authorizeAccess, attendanceController.getLastAttendance);
router.get('/user/:userId/summary/:year/:month', auth, authorizeAccess, attendanceController.getUserSummary);
router.get('/user/:userId/last', auth, authorizeAccess, attendanceController.getUserLastAttendance);
router.get('/user/:userId', auth, authorizeAccess, attendanceController.getAttendanceByUser);
router.get('/me', auth, authorizeAccess, attendanceController.getMyAttendance);
router.get('/date/:date', auth, authorizeAccess, attendanceController.getAttendanceByDate);
module.exports = router;
