const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const adminController = require('../controllers/adminController');

/**
 * Admin Routes
 * These routes are accessible to both regular admin and master-admin
 * Master admin uses these routes for development purposes
 * Note: Master admin does NOT have access to user management routes (/users/*)
 */

/**
 * @swagger
 * /api/admin/summary:
 *   get:
 *     summary: Get admin dashboard summary
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 activeUsers:
 *                   type: number
 *                 totalAttendance:
 *                   type: number
 */
router.get('/summary', auth, authorizeAccess, adminController.getAdminSummary);

/**
 * @swagger
 * /api/admin/recent-attendance:
 *   get:
 *     summary: Get recent attendance records
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
router.get('/recent-attendance', auth, authorizeAccess, adminController.getRecentAttendance);

/**
 * @swagger
 * /api/admin/pending-users:
 *   get:
 *     summary: Get pending user approvals
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/pending-users', auth, authorizeAccess, adminController.getPendingUsers);

/**
 * @swagger
 * /api/admin/approve/{id}:
 *   post:
 *     summary: Approve a pending user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User approved successfully
 *       404:
 *         description: User not found
 */
router.post('/approve/:id', auth, authorizeAccess, adminController.approveUser);

/**
 * @swagger
 * /api/admin/reject/{id}:
 *   delete:
 *     summary: Reject a pending user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User rejected successfully
 *       404:
 *         description: User not found
 */
router.delete('/reject/:id', auth, authorizeAccess, adminController.rejectUser);

module.exports = router;