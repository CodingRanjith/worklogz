const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const {
  createPayout,
  getAllPayouts,
  getPayoutById,
  getMyPayouts,
  updatePayoutStatus,
  updatePayout,
  deletePayout,
  getPayoutStats,
  requestPayout
} = require('../controllers/payoutController');

/**
 * @swagger
 * /api/payouts:
 *   post:
 *     summary: Create a new payout (Admin only)
 *     tags: [Payouts]
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
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               payoutTime:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: string
 *                 enum: [bank_transfer, upi, cash, other]
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payout created successfully
 */
router.post('/', auth, authorizeAccess, createPayout);

/**
 * @swagger
 * /api/payouts:
 *   get:
 *     summary: Get all payouts (Admin only)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, cancelled]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payouts
 */
router.get('/', auth, authorizeAccess, getAllPayouts);

/**
 * @swagger
 * /api/payouts/stats:
 *   get:
 *     summary: Get payout statistics (Admin only)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout statistics
 */
router.get('/stats', auth, authorizeAccess, getPayoutStats);

/**
 * @swagger
 * /api/payouts/request:
 *   post:
 *     summary: Request a payout (User)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               requestNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payout request submitted successfully
 */
router.post('/request', auth, requestPayout);

/**
 * @swagger
 * /api/payouts/me:
 *   get:
 *     summary: Get current user's payouts
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's payouts
 */
router.get('/me', auth, getMyPayouts);

/**
 * @swagger
 * /api/payouts/:id:
 *   get:
 *     summary: Get payout by ID
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout details
 */
router.get('/:id', auth, getPayoutById);

/**
 * @swagger
 * /api/payouts/:id/status:
 *   put:
 *     summary: Update payout status (Admin only)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, failed, cancelled]
 *               failureReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payout status updated
 */
router.put('/:id/status', auth, authorizeAccess, updatePayoutStatus);

/**
 * @swagger
 * /api/payouts/:id:
 *   put:
 *     summary: Update payout details (Admin only)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout updated
 */
router.put('/:id', auth, authorizeAccess, updatePayout);

/**
 * @swagger
 * /api/payouts/:id:
 *   delete:
 *     summary: Delete payout (Admin only)
 *     tags: [Payouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payout deleted
 */
router.delete('/:id', auth, authorizeAccess, deletePayout);

module.exports = router;
