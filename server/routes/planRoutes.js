const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public routes - get active plans
router.get('/active', planController.getActivePlans);

// Public routes - get all plans (for employees)
router.get('/', auth, planController.getAllPlans);

// Get single plan
router.get('/:id', auth, planController.getPlanById);

// Admin only routes
router.post('/', auth, role('admin'), planController.createPlan);
router.put('/:id', auth, role('admin'), planController.updatePlan);
router.delete('/:id', auth, role('admin'), planController.deletePlan);
router.patch('/:id/toggle', auth, role('admin'), planController.togglePlanStatus);

module.exports = router;

