const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
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
router.post('/submit', auth, upload, submitFeePayment);

// Get my payments (Employee)
router.get('/my-payments', auth, getMyPayments);

// Get all payments (Admin only)
router.get('/', auth, role('admin'), getAllFeePayments);

// Create payment manually (Admin only)
router.post('/', auth, role('admin'), createPayment);

// Get single payment (Admin only)
router.get('/:id', auth, role('admin'), getFeePaymentById);

// Update payment (Admin only)
router.put('/:id', auth, role('admin'), updatePayment);

// Update payment status (Admin only)
router.patch('/:id/status', auth, role('admin'), updatePaymentStatus);

// Delete payment (Admin only)
router.delete('/:id', auth, role('admin'), deletePayment);

module.exports = router;

