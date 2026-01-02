const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const routePermissionController = require('../controllers/routePermissionController');

// Get all available routes
router.get('/available-routes', auth, authorizeAccess, routePermissionController.getAvailableRoutes);

// Get route permissions for a specific user
router.get('/user/:userId', auth, authorizeAccess, routePermissionController.getUserRoutePermissions);

// Set route permissions for a specific user
router.put('/user/:userId', auth, authorizeAccess, routePermissionController.setUserRoutePermissions);

// Get route permissions for multiple users (bulk)
router.get('/bulk', auth, authorizeAccess, routePermissionController.getBulkRoutePermissions);

// Set route permissions for multiple users (bulk)
router.put('/bulk', auth, authorizeAccess, routePermissionController.setBulkRoutePermissions);

// Delete route permissions for a user (reset to default)
router.delete('/user/:userId', auth, authorizeAccess, routePermissionController.deleteUserRoutePermissions);

module.exports = router;

