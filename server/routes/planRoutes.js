const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

/**
 * @swagger
 * /api/plans/active:
 *   get:
 *     summary: Get active plans (Public route)
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of active plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/active', planController.getActivePlans);

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all plans (for employees)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', auth, authorizeAccess, planController.getAllPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Get single plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan details
 */
router.get('/:id', auth, authorizeAccess, planController.getPlanById);

/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Create a new plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/', auth, authorizeAccess, planController.createPlan);

/**
 * @swagger
 * /api/plans/{id}:
 *   put:
 *     summary: Update a plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/:id', auth, authorizeAccess, planController.updatePlan);

/**
 * @swagger
 * /api/plans/{id}:
 *   delete:
 *     summary: Delete a plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', auth, authorizeAccess, planController.deletePlan);

/**
 * @swagger
 * /api/plans/{id}/toggle:
 *   patch:
 *     summary: Toggle plan status (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan status toggled successfully
 *       403:
 *         description: Admin access required
 */
router.patch('/:id/toggle', auth, authorizeAccess, planController.togglePlanStatus);

module.exports = router;

