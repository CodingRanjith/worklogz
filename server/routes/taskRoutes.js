const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// Get all tasks for the authenticated user
router.get('/', auth, taskController.getAllTasks);

// Create a new task
router.post('/', auth, taskController.createTask);

// Update a task
router.put('/:id', auth, taskController.updateTask);

// Delete a task
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;

