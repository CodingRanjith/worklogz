const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const projectController = require('../controllers/projectController');

router.get('/user/me', auth, projectController.getMyProjects);

router
  .route('/')
  .get(auth, role('admin'), projectController.getProjects)
  .post(auth, role('admin'), projectController.createProject);

router
  .route('/:projectId')
  .get(auth, projectController.getProjectById)
  .put(auth, role('admin'), projectController.updateProject)
  .delete(auth, role('admin'), projectController.deleteProject);

router.post('/:projectId/members', auth, role('admin'), projectController.assignUser);
router.delete('/:projectId/members/:memberId', auth, role('admin'), projectController.removeUser);

module.exports = router;

