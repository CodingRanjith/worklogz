const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const sidebarMenuController = require('../controllers/sidebarMenuController');

/**
 * @swagger
 * /api/sidebar-menu/{scope}:
 *   get:
 *     summary: Get sidebar menu by scope (Admin only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, employee]
 *         description: Menu scope (admin or employee)
 *     responses:
 *       200:
 *         description: Sidebar menu configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scope:
 *                   type: string
 *                 menu:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/:scope', auth, authorizeAccess, sidebarMenuController.getMenuByScope);

/**
 * @swagger
 * /api/sidebar-menu/{scope}:
 *   put:
 *     summary: Update or create sidebar menu by scope (Admin only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scope
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, employee]
 *         description: Menu scope (admin or employee)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu
 *             properties:
 *               menu:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     path:
 *                       type: string
 *                     icon:
 *                       type: string
 *     responses:
 *       200:
 *         description: Sidebar menu updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/:scope', auth, authorizeAccess, sidebarMenuController.upsertMenuByScope);

module.exports = router;


