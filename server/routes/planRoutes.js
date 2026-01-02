const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

// Public routes - get active plans
router.get('/active', planController.getActivePlans);

// Public routes - get all plans (for employees)
router.get('/', auth, authorizeAccess, planController.getAllPlans);

// Get single plan
router.get('/:id', auth, authorizeAccess, planController.getPlanById);

// Admin only routes
router.post('/', auth, authorizeAccess, planController.createPlan);
router.put('/:id', auth, authorizeAccess, planController.updatePlan);
router.delete('/:id', auth, authorizeAccess, planController.deletePlan);
router.patch('/:id/toggle', auth, authorizeAccess, planController.togglePlanStatus);

module.exports = router;

