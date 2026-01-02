const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const teamController = require('../controllers/teamController');

// Get teams for current user (employee)
router.get('/me', auth, authorizeAccess, teamController.getMyTeams);

// Get all teams (admin only)
router.get('/', auth, authorizeAccess, teamController.getTeams);

// Create team (admin only)
router.post('/', auth, authorizeAccess, teamController.createTeam);

// Get team by ID
router.get('/:teamId', auth, authorizeAccess, teamController.getTeamById);

// Update team (admin only)
router.put('/:teamId', auth, authorizeAccess, teamController.updateTeam);

// Delete team (admin only)
router.delete('/:teamId', auth, authorizeAccess, teamController.deleteTeam);

// Add members to team (admin only)
router.post('/:teamId/members', auth, authorizeAccess, teamController.addTeamMembers);

// Remove member from team (admin only)
router.delete('/:teamId/members/:memberId', auth, authorizeAccess, teamController.removeTeamMember);

module.exports = router;

