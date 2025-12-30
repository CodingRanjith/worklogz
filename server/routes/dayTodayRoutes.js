const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  deleteAttendanceByUserAndDate,
  bulkUpdateAttendance
} = require('../controllers/dayTodayController');

// All routes require authentication
router.use(auth);

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'DayToday routes are working' });
});

// Card routes
router.get('/cards', getAllCards);
router.get('/cards/:id', getCardById);
router.post('/cards', createCard);
router.put('/cards/:id', updateCard);
router.delete('/cards/:id', deleteCard);

// Attendance routes
// Note: More specific routes (with attendanceId) must come before less specific ones
router.get('/cards/:cardId/attendance', getAttendance);
router.post('/cards/:cardId/attendance', updateAttendance);
router.put('/cards/:cardId/attendance/bulk', bulkUpdateAttendance);
router.delete('/cards/:cardId/attendance/:attendanceId', deleteAttendance);
// This route must come after the one with attendanceId parameter
router.delete('/cards/:cardId/attendance', deleteAttendanceByUserAndDate);

module.exports = router;

