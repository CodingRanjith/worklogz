const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const assessmentController = require('../controllers/assessmentController');

// Admin routes
router.get('/', authenticate, authorizeAccess, assessmentController.getAllAssessments);
router.post('/', authenticate, authorizeAccess, assessmentController.createAssessment);
router.get('/:id', authenticate, authorizeAccess, assessmentController.getAssessmentById);
router.put('/:id', authenticate, authorizeAccess, assessmentController.updateAssessment);
router.delete('/:id', authenticate, authorizeAccess, assessmentController.deleteAssessment);

// Employee routes
router.get('/employee/my-assessments', authenticate, authorizeAccess, assessmentController.getMyAssessments);
router.post('/:id/start', authenticate, authorizeAccess, assessmentController.startAssessment);
router.post('/:id/answer', authenticate, authorizeAccess, assessmentController.submitAnswer);
router.post('/:id/submit', authenticate, authorizeAccess, assessmentController.submitAssessment);
router.get('/:id/submissions/:submissionId', authenticate, authorizeAccess, assessmentController.getSubmission);

module.exports = router;


