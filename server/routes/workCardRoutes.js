const express = require('express');
const router = express.Router();
const {
  getWorkCards,
  getWorkCardById,
  createWorkCard,
  updateWorkCard,
  deleteWorkCard,
  addComment,
  updateProgress,
  getDepartmentStats
} = require('../controllers/workCardController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

/**
 * @swagger
 * /api/work-cards:
 *   get:
 *     summary: Get all work cards with filtering (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of work cards
 */
router.get('/', auth, authorizeAccess, getWorkCards);

/**
 * @swagger
 * /api/work-cards/stats:
 *   get:
 *     summary: Get department statistics (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department statistics
 */
router.get('/stats', auth, authorizeAccess, getDepartmentStats);

/**
 * @swagger
 * /api/work-cards/{id}:
 *   get:
 *     summary: Get work card by ID (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work card details
 */
router.get('/:id', auth, authorizeAccess, getWorkCardById);

/**
 * @swagger
 * /api/work-cards:
 *   post:
 *     summary: Create new work card (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Work card created
 */
router.post('/', auth, authorizeAccess, createWorkCard);

/**
 * @swagger
 * /api/work-cards/{id}:
 *   put:
 *     summary: Update work card (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work card updated
 */
router.put('/:id', auth, authorizeAccess, updateWorkCard);

/**
 * @swagger
 * /api/work-cards/{id}:
 *   delete:
 *     summary: Delete work card (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work card deleted
 */
router.delete('/:id', auth, authorizeAccess, deleteWorkCard);

/**
 * @swagger
 * /api/work-cards/{id}/comments:
 *   post:
 *     summary: Add comment to work card (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment added
 */
router.post('/:id/comments', auth, authorizeAccess, addComment);

/**
 * @swagger
 * /api/work-cards/{id}/progress:
 *   patch:
 *     summary: Update work card progress (Admin only)
 *     tags: [Work Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.patch('/:id/progress', auth, authorizeAccess, updateProgress);

module.exports = router;