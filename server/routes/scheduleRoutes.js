const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const scheduleController = require('../controllers/scheduleController');

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get('/', auth, authorizeAccess, scheduleController.getAllSchedules);

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a schedule for a user
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               schedule:
 *                 type: object
 *     responses:
 *       201:
 *         description: Schedule created successfully
 */
router.post('/', auth, authorizeAccess, scheduleController.createUserSchedule);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 */
router.put('/:id', auth, authorizeAccess, scheduleController.updateUserSchedule);

module.exports = router;
