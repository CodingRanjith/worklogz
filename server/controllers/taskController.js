

const Task = require('../models/Task');

const taskController = {
  // Get all tasks for the authenticated user
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create a new task
  createTask: async (req, res) => {
    try {
      const {
        title,
        description,
        dueDate,
        status,
        reporter,
        assignee,
        startTime,
        endTime,
        comments,
        done,
        createdAt
      } = req.body;
      const task = new Task({
        title,
        description,
        dueDate,
        status,
        user: req.user.id,
        reporter,
        assignee,
        startTime,
        endTime,
        comments,
        done,
        createdAt
      });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: 'Invalid data' });
    }
  },

  // Update a task
  updateTask: async (req, res) => {
    try {
      const { title, description, dueDate, status } = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { title, description, dueDate, status },
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: 'Invalid data' });
    }
  },

  // Delete a task
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = taskController;
