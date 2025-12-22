const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const scheduleController = require('../controllers/scheduleController');

// ✅ GET all schedules
router.get('/', auth, scheduleController.getAllSchedules);

// ✅ CREATE schedule for a user
router.post('/', auth, scheduleController.createUserSchedule);

// ✅ UPDATE schedule
router.put('/:id', auth, scheduleController.updateUserSchedule);

module.exports = router;
