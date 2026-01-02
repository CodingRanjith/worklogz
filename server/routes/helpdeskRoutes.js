const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const HelpdeskTicket = require('../models/HelpdeskTicket');
const User = require('../models/User');

const populateTicket = async (ticket) => {
  if (!ticket) return ticket;
  await ticket.populate('createdBy', 'name email role position');
  await ticket.populate('assignedTo', 'name email role position');
  await ticket.populate('messages.sender', 'name email role position');
  return ticket;
};

const ensureAdmin = (req, res, next) => {
  const userRole = req.user?.role?.toLowerCase();
  const adminAccess = req.user?.adminAccess || false;
  const isAdmin = ['admin', 'master-admin', 'administrator'].includes(userRole) || adminAccess;
  
  if (!isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

router.get('/tickets', auth, authorizeAccess, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin' || req.user.role === 'master-admin'
        ? {}
        : {
            $or: [
              { createdBy: req.user._id },
              { assignedTo: req.user._id },
              { watchers: req.user._id },
            ],
          };

    const tickets = await HelpdeskTicket.find(filter)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email role position')
      .populate('assignedTo', 'name email role position');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to load tickets' });
  }
});

router.get('/tickets/:id', auth, authorizeAccess, async (req, res) => {
  try {
    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id;
    const isAssignee =
      ticket.assignedTo && ticket.assignedTo.toString() === req.user._id;
    const isWatcher = ticket.watchers?.some(
      (watcherId) => watcherId.toString() === req.user._id
    );

    if (req.user.role !== 'admin' && req.user.role !== 'master-admin' && !isOwner && !isAssignee && !isWatcher) {
      return res.status(403).json({ msg: 'You do not have access to this ticket' });
    }

    await populateTicket(ticket);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to load ticket' });
  }
});

router.post('/tickets', auth, authorizeAccess, async (req, res) => {
  try {
    const { subject, description, category, priority, message } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ msg: 'Subject and description are required' });
    }

    const ticket = await HelpdeskTicket.create({
      subject,
      description,
      category,
      priority,
      createdBy: req.user._id,
      watchers: [req.user._id],
      messages: message
        ? [
            {
              sender: req.user._id,
              message,
            },
          ]
        : [],
    });

    await populateTicket(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to create ticket' });
  }
});

router.patch('/tickets/:id/status', auth, authorizeAccess, ensureAdmin, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const update = {};

    if (status) {
      update.status = status;
    }

    if (assignedTo) {
      const assigneeExists = await User.exists({ _id: assignedTo });
      if (!assigneeExists) {
        return res.status(400).json({ msg: 'Assigned user not found' });
      }
      update.assignedTo = assignedTo;
    }

    update.updatedAt = new Date();

    const ticket = await HelpdeskTicket.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    await populateTicket(ticket);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to update ticket' });
  }
});

router.post('/tickets/:id/messages', auth, authorizeAccess, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ msg: 'Message text is required' });
    }

    const ticket = await HelpdeskTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id;
    const isAssignee =
      ticket.assignedTo && ticket.assignedTo.toString() === req.user._id;
    const isWatcher = ticket.watchers?.some(
      (watcherId) => watcherId.toString() === req.user._id
    );

    if (req.user.role !== 'admin' && req.user.role !== 'master-admin' && !isOwner && !isAssignee && !isWatcher) {
      return res.status(403).json({ msg: 'You do not have access to this ticket' });
    }

    ticket.messages.push({
      sender: req.user._id,
      message,
    });
    ticket.lastResponseAt = new Date();
    await ticket.save();

    await populateTicket(ticket);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to post message' });
  }
});

router.get('/summary', auth, authorizeAccess, async (req, res) => {
  try {
    const baseFilter =
      req.user.role === 'admin' || req.user.role === 'master-admin'
        ? {}
        : {
            createdBy: req.user._id,
          };

    const [open, inProgress, resolved, mine] = await Promise.all([
      HelpdeskTicket.countDocuments({ ...baseFilter, status: 'open' }),
      HelpdeskTicket.countDocuments({ ...baseFilter, status: 'in-progress' }),
      HelpdeskTicket.countDocuments({ ...baseFilter, status: 'resolved' }),
      HelpdeskTicket.countDocuments({ createdBy: req.user._id }),
    ]);

    res.json({
      open,
      inProgress,
      resolved,
      mine,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to load summary' });
  }
});

router.get('/contacts', auth, authorizeAccess, (_req, res) => {
  res.json([
    {
      label: 'HR Support',
      email: 'hr@worklogz.com',
      phone: '+91 98765 43210',
      hours: 'Mon - Fri, 9 AM - 6 PM IST',
    },
    {
      label: 'IT Support',
      email: 'itsupport@worklogz.com',
      phone: '+91 90210 11111',
      hours: '24/7',
    },
    {
      label: 'Emergency Hotline',
      phone: '+91 90000 10000',
      hours: 'Always on',
    },
  ]);
});

module.exports = router;

