const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const trainerController = require('../controllers/trainerController');

/**
 * @swagger
 * /api/trainers:
 *   get:
 *     summary: Get all trainers
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of trainers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trainer'
 */
router.get('/', auth, authorizeAccess, trainerController.getAllTrainers);

/**
 * @swagger
 * /api/trainers/{id}:
 *   get:
 *     summary: Get trainer by ID
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trainer ID
 *     responses:
 *       200:
 *         description: Trainer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer not found
 */
router.get('/:id', auth, authorizeAccess, trainerController.getTrainerById);

/**
 * @swagger
 * /api/trainers:
 *   post:
 *     summary: Create a new trainer
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainerCreate'
 *     responses:
 *       201:
 *         description: Trainer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Validation error
 */
router.post('/', auth, authorizeAccess, trainerController.createTrainer);

/**
 * @swagger
 * /api/trainers/{id}:
 *   put:
 *     summary: Update trainer
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trainer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainerCreate'
 *     responses:
 *       200:
 *         description: Trainer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer not found
 */
router.put('/:id', auth, authorizeAccess, trainerController.updateTrainer);

/**
 * @swagger
 * /api/trainers/{id}:
 *   delete:
 *     summary: Delete trainer
 *     tags: [Trainers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trainer ID
 *     responses:
 *       200:
 *         description: Trainer deleted successfully
 *       404:
 *         description: Trainer not found
 */
router.delete('/:id', auth, authorizeAccess, trainerController.deleteTrainer);

module.exports = router;

