const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const {
  submitFeePayment,
  getAllFeePayments,
  getFeePaymentById,
  updatePaymentStatus,
  createPayment,
  updatePayment,
  deletePayment,
  getMyPayments,
  upload
} = require('../controllers/feePaymentController');

/**
 * @swagger
 * /api/fee-payments/submit:
 *   post:
 *     summary: Submit fee payment (Employee)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Payment submitted successfully
 */
router.post('/submit', auth, authorizeAccess, upload, submitFeePayment);

/**
 * @swagger
 * /api/fee-payments/my-payments:
 *   get:
 *     summary: Get current user's fee payments
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/my-payments', auth, authorizeAccess, getMyPayments);

/**
 * @swagger
 * /api/fee-payments:
 *   get:
 *     summary: Get all fee payments (Admin only)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all payments
 *       403:
 *         description: Admin access required
 */
router.get('/', auth, authorizeAccess, getAllFeePayments);

/**
 * @swagger
 * /api/fee-payments:
 *   post:
 *     summary: Create payment manually (Admin only)
 *     tags: [Fee Payments]
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
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/', auth, authorizeAccess, createPayment);

/**
 * @swagger
 * /api/fee-payments/{id}:
 *   get:
 *     summary: Get single payment by ID (Admin only)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *       403:
 *         description: Admin access required
 */
router.get('/:id', auth, authorizeAccess, getFeePaymentById);

/**
 * @swagger
 * /api/fee-payments/{id}:
 *   put:
 *     summary: Update payment (Admin only)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/:id', auth, authorizeAccess, updatePayment);

/**
 * @swagger
 * /api/fee-payments/{id}/status:
 *   patch:
 *     summary: Update payment status (Admin only)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
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
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Payment status updated
 *       403:
 *         description: Admin access required
 */
router.patch('/:id/status', auth, authorizeAccess, updatePaymentStatus);

/**
 * @swagger
 * /api/fee-payments/{id}:
 *   delete:
 *     summary: Delete payment (Admin only)
 *     tags: [Fee Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', auth, authorizeAccess, deletePayment);

module.exports = router;

