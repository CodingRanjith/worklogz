const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const projectController = require('../controllers/projectController');

/**
 * @swagger
 * /api/projects/user/me:
 *   get:
 *     summary: Get current user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/user/me', auth, authorizeAccess, projectController.getMyProjects);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planning, active, on-hold, completed, archived]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router
  .route('/')
  .get(auth, authorizeAccess, projectController.getProjects)
  /**
   * @swagger
   * /api/projects:
   *   post:
   *     summary: Create a new project
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectCreate'
   *     responses:
   *       201:
   *         description: Project created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Project'
   *       400:
   *         description: Validation error
   */
  .post(auth, authorizeAccess, projectController.createProject);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router
  .route('/:projectId')
  .get(auth, authorizeAccess, projectController.getProjectById)
  /**
   * @swagger
   * /api/projects/{projectId}:
   *   put:
   *     summary: Update project
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectCreate'
   *     responses:
   *       200:
   *         description: Project updated successfully
   *       404:
   *         description: Project not found
   */
  .put(auth, authorizeAccess, projectController.updateProject)
  /**
   * @swagger
   * /api/projects/{projectId}:
   *   delete:
   *     summary: Delete project
   *     tags: [Projects]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *         description: Project ID
   *     responses:
   *       200:
   *         description: Project deleted successfully
   *       404:
   *         description: Project not found
   */
  .delete(auth, authorizeAccess, projectController.deleteProject);

/**
 * @swagger
 * /api/projects/{projectId}/members:
 *   post:
 *     summary: Assign a user to a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectMemberAssign'
 *     responses:
 *       200:
 *         description: User assigned to project successfully
 *       404:
 *         description: Project not found
 */
router.post('/:projectId/members', auth, authorizeAccess, projectController.assignUser);

/**
 * @swagger
 * /api/projects/{projectId}/members/{memberId}:
 *   delete:
 *     summary: Remove a user from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID (User ID)
 *     responses:
 *       200:
 *         description: User removed from project successfully
 *       404:
 *         description: Project or member not found
 */
router.delete('/:projectId/members/:memberId', auth, authorizeAccess, projectController.removeUser);

module.exports = router;



