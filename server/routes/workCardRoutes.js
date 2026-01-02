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

// Get all work cards with filtering (Admin only)
router.get('/', auth, authorizeAccess, getWorkCards);

// Get department statistics (Admin only)
router.get('/stats', auth, authorizeAccess, getDepartmentStats);

// Get single work card by ID (Admin only)
router.get('/:id', auth, authorizeAccess, getWorkCardById);

// Create new work card (Admin only)
router.post('/', auth, authorizeAccess, createWorkCard);

// Update work card (Admin only)
router.put('/:id', auth, authorizeAccess, updateWorkCard);

// Delete work card (Admin only)
router.delete('/:id', auth, authorizeAccess, deleteWorkCard);

// Add comment to work card (Admin only)
router.post('/:id/comments', auth, authorizeAccess, addComment);

// Update work card progress (Admin only)
router.patch('/:id/progress', auth, authorizeAccess, updateProgress);

module.exports = router;