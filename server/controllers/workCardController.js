const WorkCard = require('../models/WorkCard');
const User = require('../models/User');

// Get all work cards with filtering
const getWorkCards = async (req, res) => {
  try {
    const { 
      department, 
      status, 
      teamLead, 
      startDate, 
      endDate, 
      priority,
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (department && department !== 'all') {
      filter.department = department;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (teamLead) {
      filter.teamLead = new RegExp(teamLead, 'i');
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { teamLead: new RegExp(search, 'i') },
        { 'teamMembers.name': new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;
    
    const workCards = await WorkCard.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WorkCard.countDocuments(filter);
    
    res.json({
      workCards,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching work cards:', error);
    res.status(500).json({ message: 'Server error while fetching work cards' });
  }
};

// Get single work card by ID
const getWorkCardById = async (req, res) => {
  try {
    const workCard = await WorkCard.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!workCard) {
      return res.status(404).json({ message: 'Work card not found' });
    }
    
    res.json(workCard);
  } catch (error) {
    console.error('Error fetching work card:', error);
    res.status(500).json({ message: 'Server error while fetching work card' });
  }
};

// Create new work card
const createWorkCard = async (req, res) => {
  try {
    const {
      department,
      title,
      description,
      teamLead,
      teamMembers,
      startDate,
      endDate,
      dueDate,
      priority,
      status,
      tags,
      company
    } = req.body;

    // Validate required fields
    if (!department || !title || !description || !teamLead || !startDate) {
      return res.status(400).json({ 
        message: 'Department, title, description, team lead, and start date are required' 
      });
    }

    // Get the company from request body, user object, or use a default
    const workCardCompany = company || req.user.company || 'Default Company';

    const workCard = new WorkCard({
      department,
      title,
      description,
      teamLead,
      teamMembers: teamMembers || [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'Medium',
      status: status || 'Not Started',
      tags: tags || [],
      createdBy: req.user._id,
      company: workCardCompany
    });

    await workCard.save();
    
    const populatedWorkCard = await WorkCard.findById(workCard._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      message: 'Work card created successfully',
      workCard: populatedWorkCard
    });
  } catch (error) {
    console.error('Error creating work card:', error);
    res.status(500).json({ message: 'Server error while creating work card' });
  }
};

// Update work card
const updateWorkCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Convert date strings to Date objects if present
    if (updateFields.startDate) updateFields.startDate = new Date(updateFields.startDate);
    if (updateFields.endDate) updateFields.endDate = new Date(updateFields.endDate);
    if (updateFields.dueDate) updateFields.dueDate = new Date(updateFields.dueDate);

    const workCard = await WorkCard.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!workCard) {
      return res.status(404).json({ message: 'Work card not found' });
    }

    res.json({
      message: 'Work card updated successfully',
      workCard
    });
  } catch (error) {
    console.error('Error updating work card:', error);
    res.status(500).json({ message: 'Server error while updating work card' });
  }
};

// Delete work card
const deleteWorkCard = async (req, res) => {
  try {
    const workCard = await WorkCard.findByIdAndDelete(req.params.id);
    
    if (!workCard) {
      return res.status(404).json({ message: 'Work card not found' });
    }
    
    res.json({ message: 'Work card deleted successfully' });
  } catch (error) {
    console.error('Error deleting work card:', error);
    res.status(500).json({ message: 'Server error while deleting work card' });
  }
};

// Add comment to work card
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Comment message is required' });
    }

    const workCard = await WorkCard.findById(id);
    
    if (!workCard) {
      return res.status(404).json({ message: 'Work card not found' });
    }

    workCard.comments.push({
      author: req.user.name,
      message,
      timestamp: new Date()
    });

    await workCard.save();
    
    res.json({
      message: 'Comment added successfully',
      comment: workCard.comments[workCard.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

// Update work card progress
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const workCard = await WorkCard.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!workCard) {
      return res.status(404).json({ message: 'Work card not found' });
    }

    res.json({
      message: 'Progress updated successfully',
      progress: workCard.progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error while updating progress' });
  }
};

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const stats = await WorkCard.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          notStarted: {
            $sum: { $cond: [{ $eq: ['$status', 'Not Started'] }, 1, 0] }
          },
          avgProgress: { $avg: '$progress' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
};

module.exports = {
  getWorkCards,
  getWorkCardById,
  createWorkCard,
  updateWorkCard,
  deleteWorkCard,
  addComment,
  updateProgress,
  getDepartmentStats
};