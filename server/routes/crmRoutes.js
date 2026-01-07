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

/**
 * @swagger
 * /api/crm/stages:
 *   get:
 *     summary: Get all CRM stages
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stages
 */
router.get('/stages', authMiddleware, authorizeAccess, getStages);

/**
 * @swagger
 * /api/crm/stages:
 *   post:
 *     summary: Create a new CRM stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Stage created
 */
router.post('/stages', authMiddleware, authorizeAccess, createStage);

/**
 * @swagger
 * /api/crm/stages/{id}:
 *   put:
 *     summary: Update CRM stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stage updated
 */
router.put('/stages/:id', authMiddleware, authorizeAccess, updateStage);

/**
 * @swagger
 * /api/crm/stages/{id}:
 *   delete:
 *     summary: Delete CRM stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stage deleted
 */
router.delete('/stages/:id', authMiddleware, authorizeAccess, deleteStage);

/**
 * @swagger
 * /api/crm/stages/reorder:
 *   post:
 *     summary: Reorder CRM stages
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stages reordered
 */
router.post('/stages/reorder', authMiddleware, authorizeAccess, reorderStages);

/**
 * @swagger
 * /api/crm/leads:
 *   get:
 *     summary: Get all CRM leads
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 */
router.get('/leads', authMiddleware, authorizeAccess, getLeads);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   get:
 *     summary: Get CRM lead by ID
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead details
 */
router.get('/leads/:id', authMiddleware, authorizeAccess, getLeadById);

/**
 * @swagger
 * /api/crm/leads:
 *   post:
 *     summary: Create a new CRM lead
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lead created
 */
router.post('/leads', authMiddleware, authorizeAccess, createLead);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   put:
 *     summary: Update CRM lead
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead updated
 */
router.put('/leads/:id', authMiddleware, authorizeAccess, updateLead);

/**
 * @swagger
 * /api/crm/leads/{id}/move:
 *   patch:
 *     summary: Move CRM lead to different stage
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead moved
 */
router.patch('/leads/:id/move', authMiddleware, authorizeAccess, moveLead);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   delete:
 *     summary: Delete CRM lead
 *     tags: [CRM]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted
 */
router.delete('/leads/:id', authMiddleware, authorizeAccess, deleteLead);

module.exports = router;
