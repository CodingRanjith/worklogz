const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const controller = require('../controllers/communityController');

router.get('/groups', auth, authorizeAccess, controller.getGroups);
router.post('/groups', auth, authorizeAccess, controller.createGroup);
router.delete('/groups/:id', auth, authorizeAccess, controller.deleteGroup);
router.post('/groups/:id/leave', auth, authorizeAccess, controller.leaveGroup);
router.get('/groups/:id/messages', auth, authorizeAccess, controller.getMessages);
router.post('/groups/:id/messages', auth, authorizeAccess, controller.createMessage);

module.exports = router;

