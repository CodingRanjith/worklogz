const Project = require('../models/Project');
const User = require('../models/User');

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value._id) return value._id.toString();
  if (value.toString) return value.toString();
  return null;
};

const generateProjectCode = (name = '') => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  const random = Math.floor(100 + Math.random() * 900);
  return `${initials || 'PRJ'}-${random}`;
};

const buildProjectQuery = (query) => {
  const { status, health, search } = query;
  const filters = {};

  if (status) filters.status = status;
  if (health) filters.health = health;
  if (search) {
    filters.$text = { $search: search };
  }

  return filters;
};

const populateProject = (query) =>
  query
    .populate('projectManager', 'name employeeId position email')
    .populate('createdBy', 'name employeeId position email')
    .populate('teamMembers.user', 'name employeeId position email');

exports.getProjects = async (req, res) => {
  try {
    const filters = buildProjectQuery(req.query);
    const projects = await populateProject(Project.find(filters).sort('-updatedAt'));
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('getProjects error', error);
    res.status(500).json({ success: false, message: 'Failed to load projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    if (payload.projectManager) {
      const managerExists = await User.exists({ _id: payload.projectManager });
      if (!managerExists) {
        return res.status(400).json({ success: false, message: 'Project manager not found' });
      }
    }

    payload.code = payload.code || generateProjectCode(payload.name);
    payload.createdBy = req.user._id;

    const codeExists = await Project.exists({ code: payload.code });
    if (codeExists) {
      payload.code = generateProjectCode(payload.name);
    }

    const project = await Project.create(payload);
    const hydrated = await populateProject(Project.findById(project._id));

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: hydrated
    });
  } catch (error) {
    console.error('createProject error', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = { ...req.body };

    if (updates.projectManager) {
      const managerExists = await User.exists({ _id: updates.projectManager });
      if (!managerExists) {
        return res.status(400).json({ success: false, message: 'Project manager not found' });
      }
    }

    const project = await Project.findByIdAndUpdate(projectId, updates, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const hydrated = await populateProject(Project.findById(project._id));

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: hydrated
    });
  } catch (error) {
    console.error('updateProject error', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const deleted = await Project.findByIdAndDelete(projectId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    console.error('deleteProject error', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

exports.assignUser = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role, allocation, responsibility } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const memberIndex = project.teamMembers.findIndex(
      (member) => member.user.toString() === userId
    );

    const normalizedAllocation =
      typeof allocation !== 'undefined' && !Number.isNaN(Number(allocation))
        ? Number(allocation)
        : 100;

    const memberPayload = {
      user: userId,
      role: role || 'Contributor',
      allocation: normalizedAllocation,
      responsibility
    };

    if (memberIndex >= 0) {
      project.teamMembers[memberIndex] = {
        ...project.teamMembers[memberIndex].toObject(),
        ...memberPayload
      };
    } else {
      project.teamMembers.push(memberPayload);
    }

    await project.save();
    const hydrated = await populateProject(Project.findById(project._id));

    res.json({
      success: true,
      message: 'Team member assigned',
      data: hydrated
    });
  } catch (error) {
    console.error('assignUser error', error);
    res.status(500).json({ success: false, message: 'Failed to assign user' });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.teamMembers = project.teamMembers.filter(
      (member) => member.user.toString() !== memberId
    );
    await project.save();

    const hydrated = await populateProject(Project.findById(project._id));

    res.json({
      success: true,
      message: 'Team member removed',
      data: hydrated
    });
  } catch (error) {
    console.error('removeUser error', error);
    res.status(500).json({ success: false, message: 'Failed to remove member' });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await populateProject(
      Project.find({ 'teamMembers.user': req.user._id }).sort({ updatedAt: -1 })
    );
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('getMyProjects error', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workspace projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await populateProject(Project.findById(projectId));

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isMember = project.teamMembers.some((member) => {
      const memberId = toIdString(member.user);
      return memberId === req.user._id.toString();
    });

    if (!isAdmin && !isMember) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('getProjectById error', error);
    res.status(500).json({ success: false, message: 'Failed to load project' });
  }
};

