const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const routePermissionController = require('../controllers/routePermissionController');

/**
 * @swagger
 * /api/route-permissions/available-routes:
 *   get:
 *     summary: Get all available routes
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/available-routes', auth, authorizeAccess, routePermissionController.getAvailableRoutes);

/**
 * @swagger
 * /api/route-permissions/user/{userId}:
 *   get:
 *     summary: Get route permissions for a specific user
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User route permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/user/:userId', auth, authorizeAccess, routePermissionController.getUserRoutePermissions);

/**
 * @swagger
 * /api/route-permissions/user/{userId}:
 *   put:
 *     summary: Set route permissions for a specific user
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Route permissions updated successfully
 */
router.put('/user/:userId', auth, authorizeAccess, routePermissionController.setUserRoutePermissions);

/**
 * @swagger
 * /api/route-permissions/bulk:
 *   get:
 *     summary: Get route permissions for multiple users (bulk)
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Comma-separated user IDs
 *     responses:
 *       200:
 *         description: Bulk route permissions
 */
router.get('/bulk', auth, authorizeAccess, routePermissionController.getBulkRoutePermissions);

/**
 * @swagger
 * /api/route-permissions/bulk:
 *   put:
 *     summary: Set route permissions for multiple users (bulk)
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *               - routes
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               routes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk route permissions updated successfully
 */
router.put('/bulk', auth, authorizeAccess, routePermissionController.setBulkRoutePermissions);

/**
 * @swagger
 * /api/route-permissions/user/{userId}:
 *   delete:
 *     summary: Delete route permissions for a user (reset to default)
 *     tags: [Route Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Route permissions reset to default
 */
router.delete('/user/:userId', auth, authorizeAccess, routePermissionController.deleteUserRoutePermissions);

module.exports = router;

