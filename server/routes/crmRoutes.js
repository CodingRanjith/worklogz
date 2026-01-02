const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const {
  getStages,
  createStage,
  updateStage,
  deleteStage,
  reorderStages,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  moveLead,
  deleteLead,
} = require('../controllers/crmController');

// Stage routes
router.get('/stages', authMiddleware, authorizeAccess, getStages);
router.post('/stages', authMiddleware, authorizeAccess, createStage);
router.put('/stages/:id', authMiddleware, authorizeAccess, updateStage);
router.delete('/stages/:id', authMiddleware, authorizeAccess, deleteStage);
router.post('/stages/reorder', authMiddleware, authorizeAccess, reorderStages);

// Lead routes
router.get('/leads', authMiddleware, authorizeAccess, getLeads);
router.get('/leads/:id', authMiddleware, authorizeAccess, getLeadById);
router.post('/leads', authMiddleware, authorizeAccess, createLead);
router.put('/leads/:id', authMiddleware, authorizeAccess, updateLead);
router.patch('/leads/:id/move', authMiddleware, authorizeAccess, moveLead);
router.delete('/leads/:id', authMiddleware, authorizeAccess, deleteLead);

module.exports = router;
