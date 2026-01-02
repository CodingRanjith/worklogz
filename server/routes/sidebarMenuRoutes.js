const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const sidebarMenuController = require('../controllers/sidebarMenuController');

// Only admins should manage sidebar menu definitions
router.get('/:scope', auth, authorizeAccess, sidebarMenuController.getMenuByScope);
router.put('/:scope', auth, authorizeAccess, sidebarMenuController.upsertMenuByScope);

module.exports = router;


