const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const controller = require('../controllers/communityController');

/**
 * @swagger
 * /api/community/groups:
 *   get:
 *     summary: Get all community groups
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of community groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/groups', auth, authorizeAccess, controller.getGroups);

/**
 * @swagger
 * /api/community/groups:
 *   post:
 *     summary: Create a new community group
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post('/groups', auth, authorizeAccess, controller.createGroup);

/**
 * @swagger
 * /api/community/groups/{id}:
 *   delete:
 *     summary: Delete a community group
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group deleted successfully
 */
router.delete('/groups/:id', auth, authorizeAccess, controller.deleteGroup);

/**
 * @swagger
 * /api/community/groups/{id}/leave:
 *   post:
 *     summary: Leave a community group
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Successfully left the group
 */
router.post('/groups/:id/leave', auth, authorizeAccess, controller.leaveGroup);

/**
 * @swagger
 * /api/community/groups/{id}/messages:
 *   get:
 *     summary: Get messages from a community group
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/groups/:id/messages', auth, authorizeAccess, controller.getMessages);

/**
 * @swagger
 * /api/community/groups/{id}/messages:
 *   post:
 *     summary: Create a message in a community group
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 */
router.post('/groups/:id/messages', auth, authorizeAccess, controller.createMessage);

module.exports = router;

