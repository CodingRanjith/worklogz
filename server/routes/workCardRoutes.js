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
const role = require('../middleware/role');

// Get all work cards with filtering (Admin only)
router.get('/', auth, role(['admin']), getWorkCards);

// Get department statistics (Admin only)
router.get('/stats', auth, role(['admin']), getDepartmentStats);

// Get single work card by ID (Admin only)
router.get('/:id', auth, role(['admin']), getWorkCardById);

// Create new work card (Admin only)
router.post('/', auth, role(['admin']), createWorkCard);

// Update work card (Admin only)
router.put('/:id', auth, role(['admin']), updateWorkCard);

// Delete work card (Admin only)
router.delete('/:id', auth, role(['admin']), deleteWorkCard);

// Add comment to work card (Admin only)
router.post('/:id/comments', auth, role(['admin']), addComment);

// Update work card progress (Admin only)
router.patch('/:id/progress', auth, role(['admin']), updateProgress);

module.exports = router;