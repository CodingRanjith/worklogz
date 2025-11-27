const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/communityController');

router.get('/groups', auth, controller.getGroups);
router.post('/groups', auth, controller.createGroup);
router.delete('/groups/:id', auth, controller.deleteGroup);
router.post('/groups/:id/leave', auth, controller.leaveGroup);
router.get('/groups/:id/messages', auth, controller.getMessages);
router.post('/groups/:id/messages', auth, controller.createMessage);

module.exports = router;

