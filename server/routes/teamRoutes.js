const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const teamController = require('../controllers/teamController');

/**
 * @swagger
 * /api/teams/me:
 *   get:
 *     summary: Get teams for current user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's teams
 */
router.get('/me', auth, authorizeAccess, teamController.getMyTeams);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teams
 */
router.get('/', auth, authorizeAccess, teamController.getTeams);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team (Admin only)
 *     tags: [Teams]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 */
router.post('/', auth, authorizeAccess, teamController.createTeam);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team details
 */
router.get('/:teamId', auth, authorizeAccess, teamController.getTeamById);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   put:
 *     summary: Update team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team updated
 */
router.put('/:teamId', auth, authorizeAccess, teamController.updateTeam);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   delete:
 *     summary: Delete team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted
 */
router.delete('/:teamId', auth, authorizeAccess, teamController.deleteTeam);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   post:
 *     summary: Add members to team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Members added
 */
router.post('/:teamId/members', auth, authorizeAccess, teamController.addTeamMembers);

/**
 * @swagger
 * /api/teams/{teamId}/members/{memberId}:
 *   delete:
 *     summary: Remove member from team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete('/:teamId/members/:memberId', auth, authorizeAccess, teamController.removeTeamMember);

module.exports = router;

