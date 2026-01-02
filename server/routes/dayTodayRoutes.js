const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
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

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'DayToday routes are working' });
});

// Card routes
router.get('/cards', auth, authorizeAccess, getAllCards);
router.get('/cards/:id', auth, authorizeAccess, getCardById);
router.post('/cards', auth, authorizeAccess, createCard);
router.put('/cards/:id', auth, authorizeAccess, updateCard);
router.delete('/cards/:id', auth, authorizeAccess, deleteCard);

// Attendance routes
// Note: More specific routes (with attendanceId) must come before less specific ones
router.get('/cards/:cardId/attendance', auth, authorizeAccess, getAttendance);
router.post('/cards/:cardId/attendance', auth, authorizeAccess, updateAttendance);
router.put('/cards/:cardId/attendance/bulk', auth, authorizeAccess, bulkUpdateAttendance);
router.delete('/cards/:cardId/attendance/:attendanceId', auth, authorizeAccess, deleteAttendance);
// This route must come after the one with attendanceId parameter
router.delete('/cards/:cardId/attendance', auth, authorizeAccess, deleteAttendanceByUserAndDate);

module.exports = router;

