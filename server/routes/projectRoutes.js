const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const projectController = require('../controllers/projectController');

router.get('/user/me', auth, authorizeAccess, projectController.getMyProjects);

router
  .route('/')
  .get(auth, authorizeAccess, projectController.getProjects)
  .post(auth, authorizeAccess, projectController.createProject);

router
  .route('/:projectId')
  .get(auth, authorizeAccess, projectController.getProjectById)
  .put(auth, authorizeAccess, projectController.updateProject)
  .delete(auth, authorizeAccess, projectController.deleteProject);

router.post('/:projectId/members', auth, authorizeAccess, projectController.assignUser);
router.delete('/:projectId/members/:memberId', auth, authorizeAccess, projectController.removeUser);

module.exports = router;



