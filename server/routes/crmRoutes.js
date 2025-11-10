const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
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

router.use(authMiddleware);

// Stage routes
router.get('/stages', getStages);
router.post('/stages', createStage);
router.put('/stages/:id', updateStage);
router.delete('/stages/:id', deleteStage);
router.post('/stages/reorder', reorderStages);

// Lead routes
router.get('/leads', getLeads);
router.get('/leads/:id', getLeadById);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);
router.patch('/leads/:id/move', moveLead);
router.delete('/leads/:id', deleteLead);

module.exports = router;
