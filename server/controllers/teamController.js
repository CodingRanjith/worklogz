const Team = require('../models/Team');
const User = require('../models/User');

// Get all teams (admin only)
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json(teams);
  } catch (error) {
    console.error('getTeams error:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};

// Get teams for current user
exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const teams = await Team.find({
      $or: [
        { members: userId },
        { teamLead: userId }
      ]
    })
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json(teams);
  } catch (error) {
    console.error('getMyTeams error:', error);
    res.status(500).json({ message: 'Failed to fetch your teams' });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('getTeamById error:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, description, teamLead, members } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Team name is required' });
    }
    
    // Validate team lead if provided
    if (teamLead) {
      const leadUser = await User.findById(teamLead);
      if (!leadUser) {
        return res.status(400).json({ message: 'Team lead user not found' });
      }
    }
    
    // Validate members if provided
    if (members && members.length > 0) {
      const memberUsers = await User.find({ _id: { $in: members } });
      if (memberUsers.length !== members.length) {
        return res.status(400).json({ message: 'One or more member users not found' });
      }
    }
    
    const team = new Team({
      name: name.trim(),
      description: description?.trim() || '',
      teamLead: teamLead || null,
      members: members || [],
      createdBy: req.user._id,
      company: req.user.company
    });
    
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email');
    
    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error('createTeam error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists' });
    }
    res.status(500).json({ message: 'Failed to create team' });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { name, description, teamLead } = req.body;
    const team = await Team.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    if (name && name.trim()) {
      team.name = name.trim();
    }
    
    if (description !== undefined) {
      team.description = description?.trim() || '';
    }
    
    if (teamLead !== undefined) {
      if (teamLead) {
        const leadUser = await User.findById(teamLead);
        if (!leadUser) {
          return res.status(400).json({ message: 'Team lead user not found' });
        }
        team.teamLead = teamLead;
      } else {
        team.teamLead = null;
      }
    }
    
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error('updateTeam error:', error);
    res.status(500).json({ message: 'Failed to update team' });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    await Team.findByIdAndDelete(req.params.teamId);
    
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('deleteTeam error:', error);
    res.status(500).json({ message: 'Failed to delete team' });
  }
};

// Add members to team
exports.addTeamMembers = async (req, res) => {
  try {
    const { members } = req.body;
    const team = await Team.findById(req.params.teamId);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Members array is required' });
    }
    
    // Validate members
    const memberUsers = await User.find({ _id: { $in: members } });
    if (memberUsers.length !== members.length) {
      return res.status(400).json({ message: 'One or more member users not found' });
    }
    
    // Add members (avoid duplicates)
    const existingMemberIds = team.members.map(m => m.toString());
    const newMembers = members.filter(memberId => !existingMemberIds.includes(memberId.toString()));
    
    team.members = [...team.members, ...newMembers];
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error('addTeamMembers error:', error);
    res.status(500).json({ message: 'Failed to add team members' });
  }
};

// Remove member from team
exports.removeTeamMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = await Team.findById(teamId);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Remove member
    team.members = team.members.filter(
      member => member.toString() !== memberId
    );
    
    // If removed member was team lead, remove team lead
    if (team.teamLead && team.teamLead.toString() === memberId) {
      team.teamLead = null;
    }
    
    await team.save();
    
    const populatedTeam = await Team.findById(team._id)
      .populate('teamLead', 'name email employeeId position')
      .populate('members', 'name email employeeId position department phone')
      .populate('createdBy', 'name email');
    
    res.json(populatedTeam);
  } catch (error) {
    console.error('removeTeamMember error:', error);
    res.status(500).json({ message: 'Failed to remove team member' });
  }
};

