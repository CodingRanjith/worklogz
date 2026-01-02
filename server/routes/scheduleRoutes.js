const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const scheduleController = require('../controllers/scheduleController');

// ✅ GET all schedules
router.get('/', auth, authorizeAccess, scheduleController.getAllSchedules);

// ✅ CREATE schedule for a user
router.post('/', auth, authorizeAccess, scheduleController.createUserSchedule);

// ✅ UPDATE schedule
router.put('/:id', auth, authorizeAccess, scheduleController.updateUserSchedule);

module.exports = router;
