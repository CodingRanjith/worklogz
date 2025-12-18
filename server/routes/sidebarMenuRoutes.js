const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const sidebarMenuController = require('../controllers/sidebarMenuController');

// Only admins should manage sidebar menu definitions
router.get('/:scope', auth, role('admin'), sidebarMenuController.getMenuByScope);
router.put('/:scope', auth, role('admin'), sidebarMenuController.upsertMenuByScope);

module.exports = router;


