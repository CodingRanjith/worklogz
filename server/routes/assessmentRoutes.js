const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const assessmentController = require('../controllers/assessmentController');

// Admin routes
router.get('/', authenticate, roleMiddleware('admin'), assessmentController.getAllAssessments);
router.post('/', authenticate, roleMiddleware('admin'), assessmentController.createAssessment);
router.get('/:id', authenticate, assessmentController.getAssessmentById);
router.put('/:id', authenticate, roleMiddleware('admin'), assessmentController.updateAssessment);
router.delete('/:id', authenticate, roleMiddleware('admin'), assessmentController.deleteAssessment);

// Employee routes
router.get('/employee/my-assessments', authenticate, assessmentController.getMyAssessments);
router.post('/:id/start', authenticate, assessmentController.startAssessment);
router.post('/:id/answer', authenticate, assessmentController.submitAnswer);
router.post('/:id/submit', authenticate, assessmentController.submitAssessment);
router.get('/:id/submissions/:submissionId', authenticate, assessmentController.getSubmission);

module.exports = router;

