const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const teamController = require('../controllers/teamController');

// Get teams for current user (employee)
router.get('/me', auth, teamController.getMyTeams);

// Get all teams (admin only)
router.get('/', auth, role('admin'), teamController.getTeams);

// Create team (admin only)
router.post('/', auth, role('admin'), teamController.createTeam);

// Get team by ID
router.get('/:teamId', auth, teamController.getTeamById);

// Update team (admin only)
router.put('/:teamId', auth, role('admin'), teamController.updateTeam);

// Delete team (admin only)
router.delete('/:teamId', auth, role('admin'), teamController.deleteTeam);

// Add members to team (admin only)
router.post('/:teamId/members', auth, role('admin'), teamController.addTeamMembers);

// Remove member from team (admin only)
router.delete('/:teamId/members/:memberId', auth, role('admin'), teamController.removeTeamMember);

module.exports = router;

