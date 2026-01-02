const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const notificationController = require('../controllers/notificationController');

// Get all notifications for current user
router.get('/', auth, authorizeAccess, notificationController.getNotifications);

// Get unread count
router.get('/unread-count', auth, authorizeAccess, notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', auth, authorizeAccess, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, authorizeAccess, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', auth, authorizeAccess, notificationController.deleteNotification);

module.exports = router;

