const CommunityGroup = require('../models/CommunityGroup');
const CommunityMessage = require('../models/CommunityMessage');

const sanitize = (value = '') => value.toString().trim();

exports.getGroups = async (req, res) => {
  try {
    const groups = await CommunityGroup.find({
      members: req.user._id,
    })
      .populate('members', 'name profilePic position isActive')
      .populate('createdBy', 'name profilePic');
    res.json(groups);
  } catch (error) {
    console.error('Failed to fetch groups', error);
    res.status(500).json({ error: 'Failed to fetch community groups' });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    if (!name || memberIds.length === 0) {
      return res.status(400).json({ error: 'Name and members are required' });
    }

    const uniqueMembers = Array.from(
      new Set([...memberIds, req.user._id.toString()])
    );

    const group = await CommunityGroup.create({
      name: sanitize(name),
      description: sanitize(description),
      createdBy: req.user._id,
      members: uniqueMembers,
    });

    const populated = await CommunityGroup.findById(group._id)
      .populate('members', 'name profilePic position isActive isActive')
      .populate('createdBy', 'name profilePic');

    res.status(201).json({ message: 'Group created', group: populated });
  } catch (error) {
    console.error('Failed to create group', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await CommunityGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can delete this group' });
    }

    await CommunityMessage.deleteMany({ group: group._id });
    await group.deleteOne();

    res.json({ message: 'Group deleted' });
  } catch (error) {
    console.error('Failed to delete group', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const group = await CommunityGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isMember = group.members.some(
      (member) => member.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== req.user._id.toString()
    );

    if (group.members.length === 0) {
      await CommunityMessage.deleteMany({ group: group._id });
      await group.deleteOne();
      return res.json({ message: 'Group removed (no members left)' });
    }

    await group.save();
    res.json({ message: 'Left the group successfully', group });
  } catch (error) {
    console.error('Failed to leave group', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find({ group: req.params.id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profilePic');
    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const group = await CommunityGroup.findById(req.params.id);
    if (!group || !group.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized for this group' });
    }

    const message = await CommunityMessage.create({
      group: req.params.id,
      sender: req.user._id,
      text: sanitize(text),
    });

    const populated = await message.populate('sender', 'name profilePic');
    
    // Emit real-time message to all group members via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`group:${req.params.id}`).emit('new-message', {
        message: populated,
        groupId: req.params.id,
      });
    }
    
    res.status(201).json({ message: 'Message sent', record: populated });
  } catch (error) {
    console.error('Failed to send message', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

