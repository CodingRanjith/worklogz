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

// Submit fee payment (Employee)
router.post('/submit', auth, authorizeAccess, upload, submitFeePayment);

// Get my payments (Employee)
router.get('/my-payments', auth, authorizeAccess, getMyPayments);

// Get all payments (Admin only)
router.get('/', auth, authorizeAccess, getAllFeePayments);

// Create payment manually (Admin only)
router.post('/', auth, authorizeAccess, createPayment);

// Get single payment (Admin only)
router.get('/:id', auth, authorizeAccess, getFeePaymentById);

// Update payment (Admin only)
router.put('/:id', auth, authorizeAccess, updatePayment);

// Update payment status (Admin only)
router.patch('/:id/status', auth, authorizeAccess, updatePaymentStatus);

// Delete payment (Admin only)
router.delete('/:id', auth, authorizeAccess, deletePayment);

module.exports = router;

