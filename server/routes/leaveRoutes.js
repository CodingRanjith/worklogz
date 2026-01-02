const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const leaveController = require('../controllers/leaveController');

router.post('/apply', auth, authorizeAccess, leaveController.applyLeave);
router.get('/all', auth, authorizeAccess, leaveController.getAllLeaveRequests);
router.get('/me', auth, authorizeAccess, leaveController.getMyLeaves);
router.patch('/:id', auth, authorizeAccess, leaveController.updateLeaveStatus);

module.exports = router;