

const Task = require('../models/Task');
const User = require('../models/User');

const taskController = {
  // Get all tasks for the authenticated user
  getAllTasks: async (req, res) => {
    try {
      const { 
        startDate, 
        endDate, 
        status, 
        assignee, 
        page = 1, 
        limit = 50,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        userId // Allow admin to get tasks for specific user
      } = req.query;

      // Build filter object
      let filter = {};
      
      // Exclude deleted tasks by default
      filter.isDeleted = { $ne: true };
      
      // If admin is requesting tasks for a specific user
      if (userId && req.user.role === 'admin') {
        filter.user = userId;
      } else {
        // Regular user can only see their own tasks
        filter.user = req.user._id;
      }

      // Date range filter
      if (startDate && endDate) {
        filter.$or = [
          {
            startTime: {
              $gte: startDate,
              $lte: endDate
            }
          },
          {
            endTime: {
              $gte: startDate,
              $lte: endDate
            }
          }
        ];
      } else if (startDate) {
        filter.$or = [
          { startTime: { $gte: startDate } },
          { endTime: { $gte: startDate } }
        ];
      } else if (endDate) {
        filter.$or = [
          { startTime: { $lte: endDate } },
          { endTime: { $lte: endDate } }
        ];
      }

      // Status filter
      if (status && status !== 'all') {
        filter.status = status;
      }

      // Assignee filter
      if (assignee && assignee !== 'all') {
        filter.assignee = new RegExp(assignee, 'i');
      }

      // Sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Pagination
      const skip = (page - 1) * limit;

      const tasks = await Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name email');

      const totalTasks = await Task.countDocuments(filter);
      const totalPages = Math.ceil(totalTasks / limit);

      res.json({
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTasks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (err) {
      console.error('Get tasks error:', err);
      res.status(500).json({ error: 'Server error while fetching tasks' });
    }
  },

  // Get single task by ID
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findOne({ 
        _id: req.params.id, 
        user: req.user._id 
      }).populate('user', 'name email');

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (err) {
      console.error('Get task by ID error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      res.status(500).json({ error: 'Server error while fetching task' });
    }
  },

  // Create a new task
  createTask: async (req, res) => {
    try {
      const {
        title,
        description,
        dueDate,
        status = 'backlog',
        reporter,
        assignee,
        department,
        startTime,
        endTime,
        comments = [],
        done = false,
        userId // Admin can specify which user this task belongs to
      } = req.body;

      // Validation
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ error: 'Task title is required' });
      }

      // Set default dates if not provided
      const currentDate = new Date().toISOString().split('T')[0];
      const taskStartTime = startTime || currentDate;
      const taskEndTime = endTime || taskStartTime;

      // Determine the task owner
      let taskUserId = req.user._id; // Default to current user
      
      // If admin is creating task for another user
      if (userId && req.user.role === 'admin') {
        // Verify the target user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
          return res.status(400).json({ error: 'Target user not found' });
        }
        taskUserId = userId;
      }

      const task = new Task({
        title: title.trim(),
        description: description ? description.trim() : '',
        dueDate: dueDate ? new Date(dueDate) : new Date(taskEndTime),
        status,
        user: taskUserId, // Use the determined user ID
        reporter: reporter || req.user.name || 'Unknown',
        assignee: assignee || 'Unassigned',
        department: department || undefined,
        startTime: taskStartTime,
        endTime: taskEndTime,
        comments,
        done
      });

      await task.save();
      
      // Populate user info before sending response
      await task.populate('user', 'name email');

      // Create notification if task is assigned to a different user
      if (taskUserId.toString() !== req.user._id.toString()) {
        try {
          const notificationController = require('./notificationController');
          await notificationController.createNotification(taskUserId, {
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned a new task: "${task.title}" by ${req.user.name || 'Admin'}`,
            link: `/timesheet`,
            metadata: {
              taskId: task._id.toString(),
              taskTitle: task.title,
              assignedBy: req.user.name || 'Admin'
            }
          });
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
          // Don't fail the task creation if notification fails
        }
      }

      res.status(201).json(task);
    } catch (err) {
      console.error('Create task error:', err);
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: 'Validation error', details: errors });
      }
      res.status(500).json({ error: 'Server error while creating task' });
    }
  },

  // Update a task
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Remove fields that shouldn't be updated directly
      delete updateData.user;
      delete updateData._id;
      delete updateData.createdAt;

      // Validate title if provided
      if (updateData.title !== undefined) {
        if (!updateData.title || updateData.title.trim().length === 0) {
          return res.status(400).json({ error: 'Task title cannot be empty' });
        }
        updateData.title = updateData.title.trim();
      }

      // Validate dates if provided
      if (updateData.startTime && updateData.endTime) {
        if (new Date(updateData.startTime) > new Date(updateData.endTime)) {
          return res.status(400).json({ error: 'Start date cannot be after end date' });
        }
      }

      // Update dueDate if endTime is changed
      if (updateData.endTime) {
        updateData.dueDate = new Date(updateData.endTime);
      }

      // Build filter - allow admin to update any task, users can only update their own
      const filter = { _id: id };
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      const task = await Task.findOneAndUpdate(
        filter,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('user', 'name email');

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (err) {
      console.error('Update task error:', err);
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: 'Validation error', details: errors });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      res.status(500).json({ error: 'Server error while updating task' });
    }
  },

  // Delete a task (soft delete - archived for 7 days)
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      // Build filter - allow admin to delete any task, users can only delete their own
      const filter = { _id: id, isDeleted: false };
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      const task = await Task.findOneAndUpdate(
        filter,
        { 
          $set: { 
            isDeleted: true, 
            deletedAt: new Date() 
          } 
        },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ error: 'Task not found or already deleted' });
      }

      res.json({ 
        message: 'Task deleted successfully. It will be permanently removed after 7 days.',
        deletedTask: {
          id: task._id,
          title: task.title,
          deletedAt: task.deletedAt
        }
      });
    } catch (err) {
      console.error('Delete task error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      res.status(500).json({ error: 'Server error while deleting task' });
    }
  },

  // Restore a deleted task
  restoreTask: async (req, res) => {
    try {
      const { id } = req.params;

      // Build filter - allow admin to restore any task, users can only restore their own
      const filter = { _id: id, isDeleted: true };
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      const task = await Task.findOneAndUpdate(
        filter,
        { 
          $set: { 
            isDeleted: false, 
            deletedAt: null 
          } 
        },
        { new: true }
      ).populate('user', 'name email');

      if (!task) {
        return res.status(404).json({ error: 'Task not found or not deleted' });
      }

      res.json({ 
        message: 'Task restored successfully',
        task
      });
    } catch (err) {
      console.error('Restore task error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      res.status(500).json({ error: 'Server error while restoring task' });
    }
  },

  // Get archived/deleted tasks
  getArchivedTasks: async (req, res) => {
    try {
      const filter = { isDeleted: true };
      
      // Users can only see their own archived tasks, admins can see all
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      // Only show tasks deleted within the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.deletedAt = { $gte: sevenDaysAgo };

      const tasks = await Task.find(filter)
        .populate('user', 'name email')
        .sort({ deletedAt: -1 });

      res.json({ tasks });
    } catch (err) {
      console.error('Get archived tasks error:', err);
      res.status(500).json({ error: 'Server error while fetching archived tasks' });
    }
  },

  // Add comment to task
  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Comment text is required' });
      }

      const comment = {
        by: req.user.name || 'Unknown User',
        at: new Date().toISOString(),
        text: text.trim()
      };

      // Build filter - allow admin to comment on any task, users can only comment on their own
      const filter = { _id: id };
      if (req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      const task = await Task.findOneAndUpdate(
        filter,
        { $push: { comments: comment } },
        { new: true }
      ).populate('user', 'name email');

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({
        message: 'Comment added successfully',
        task,
        newComment: comment
      });
    } catch (err) {
      console.error('Add comment error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid task ID format' });
      }
      res.status(500).json({ error: 'Server error while adding comment' });
    }
  },

  // Get tasks by date range
  getTasksByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.params;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const tasks = await Task.find({
        user: req.user._id,
        isDeleted: { $ne: true },
        $or: [
          {
            startTime: {
              $gte: startDate,
              $lte: endDate
            }
          },
          {
            endTime: {
              $gte: startDate,
              $lte: endDate
            }
          }
        ]
      }).sort({ startTime: 1 }).populate('user', 'name email');

      // Group tasks by date
      const tasksByDate = {};
      tasks.forEach(task => {
        const date = task.startTime || task.createdAt.toISOString().split('T')[0];
        if (!tasksByDate[date]) {
          tasksByDate[date] = [];
        }
        tasksByDate[date].push(task);
      });

      res.json({
        tasks,
        tasksByDate,
        dateRange: { startDate, endDate },
        totalTasks: tasks.length
      });
    } catch (err) {
      console.error('Get tasks by date range error:', err);
      res.status(500).json({ error: 'Server error while fetching tasks by date range' });
    }
  },

  // Get task statistics
  getTaskStats: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Build filter for user's tasks
      const filter = { user: req.user._id, isDeleted: { $ne: true } };
      
      // Add date filter if provided
      if (startDate && endDate) {
        filter.$or = [
          {
            startTime: {
              $gte: startDate,
              $lte: endDate
            }
          },
          {
            endTime: {
              $gte: startDate,
              $lte: endDate
            }
          }
        ];
      }

      // Get task statistics using aggregation
      const stats = await Task.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'done'] }, 1, 0]
              }
            },
            pendingTasks: {
              $sum: {
                $cond: [{ $ne: ['$status', 'done'] }, 1, 0]
              }
            },
            todoTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'todo'] }, 1, 0]
              }
            },
            doingTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'doing'] }, 1, 0]
              }
            },
            backlogTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'backlog'] }, 1, 0]
              }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        todoTasks: 0,
        doingTasks: 0,
        backlogTasks: 0
      };

      // Calculate completion percentage
      result.completionPercentage = result.totalTasks > 0 
        ? Math.round((result.completedTasks / result.totalTasks) * 100)
        : 0;

      res.json(result);
    } catch (err) {
      console.error('Get task stats error:', err);
      res.status(500).json({ error: 'Server error while fetching task statistics' });
    }
  },

  // Bulk update tasks
  bulkUpdateTasks: async (req, res) => {
    try {
      const { taskIds, updateData } = req.body;

      if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({ error: 'Task IDs array is required' });
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Update data is required' });
      }

      // Remove fields that shouldn't be updated
      delete updateData.user;
      delete updateData._id;
      delete updateData.createdAt;

      const result = await Task.updateMany(
        { 
          _id: { $in: taskIds }, 
          user: req.user._id,
          isDeleted: { $ne: true }
        },
        { $set: updateData }
      );

      res.json({
        message: 'Tasks updated successfully',
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      });
    } catch (err) {
      console.error('Bulk update tasks error:', err);
      res.status(500).json({ error: 'Server error while bulk updating tasks' });
    }
  },

  // Cleanup permanently delete tasks older than 7 days
  cleanupDeletedTasks: async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await Task.deleteMany({
        isDeleted: true,
        deletedAt: { $lt: sevenDaysAgo }
      });

      if (result.deletedCount > 0) {
        console.log(`Cleanup: Permanently deleted ${result.deletedCount} tasks older than 7 days`);
      }
      return result.deletedCount;
    } catch (err) {
      console.error('Cleanup deleted tasks error:', err);
      return 0;
    }
  }
};

module.exports = taskController;
