const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const assessmentController = require('../controllers/assessmentController');

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     summary: Get all assessments (Admin only)
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assessments
 */
router.get('/', authenticate, authorizeAccess, assessmentController.getAllAssessments);

/**
 * @swagger
 * /api/assessments:
 *   post:
 *     summary: Create a new assessment (Admin only)
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Assessment created
 */
router.post('/', authenticate, authorizeAccess, assessmentController.createAssessment);

/**
 * @swagger
 * /api/assessments/{id}:
 *   get:
 *     summary: Get assessment by ID
 *     tags: [Assessments]
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
 *         description: Assessment details
 */
router.get('/:id', authenticate, authorizeAccess, assessmentController.getAssessmentById);

/**
 * @swagger
 * /api/assessments/{id}:
 *   put:
 *     summary: Update assessment (Admin only)
 *     tags: [Assessments]
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
 *         description: Assessment updated
 */
router.put('/:id', authenticate, authorizeAccess, assessmentController.updateAssessment);

/**
 * @swagger
 * /api/assessments/{id}:
 *   delete:
 *     summary: Delete assessment (Admin only)
 *     tags: [Assessments]
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
 *         description: Assessment deleted
 */
router.delete('/:id', authenticate, authorizeAccess, assessmentController.deleteAssessment);

/**
 * @swagger
 * /api/assessments/employee/my-assessments:
 *   get:
 *     summary: Get current user's assessments
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's assessments
 */
router.get('/employee/my-assessments', authenticate, authorizeAccess, assessmentController.getMyAssessments);

/**
 * @swagger
 * /api/assessments/{id}/start:
 *   post:
 *     summary: Start an assessment
 *     tags: [Assessments]
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
 *         description: Assessment started
 */
router.post('/:id/start', authenticate, authorizeAccess, assessmentController.startAssessment);

/**
 * @swagger
 * /api/assessments/{id}/answer:
 *   post:
 *     summary: Submit answer for an assessment question
 *     tags: [Assessments]
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
 *         description: Answer submitted
 */
router.post('/:id/answer', authenticate, authorizeAccess, assessmentController.submitAnswer);

/**
 * @swagger
 * /api/assessments/{id}/submit:
 *   post:
 *     summary: Submit completed assessment
 *     tags: [Assessments]
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
 *         description: Assessment submitted
 */
router.post('/:id/submit', authenticate, authorizeAccess, assessmentController.submitAssessment);

/**
 * @swagger
 * /api/assessments/{id}/submissions/{submissionId}:
 *   get:
 *     summary: Get assessment submission details
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission details
 */
router.get('/:id/submissions/:submissionId', authenticate, authorizeAccess, assessmentController.getSubmission);

module.exports = router;


