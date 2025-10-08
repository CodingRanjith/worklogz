const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/timeSheetController');

// ===== TASK CRUD OPERATIONS =====

// Get all tasks for the authenticated user (with filtering, pagination, sorting)
// Query params: startDate, endDate, status, assignee, page, limit, sortBy, sortOrder
router.get('/', auth, taskController.getAllTasks);

// Get single task by ID
router.get('/:id', auth, taskController.getTaskById);

// Create a new task
router.post('/', auth, taskController.createTask);

// Update a task (full update)
router.put('/:id', auth, taskController.updateTask);

// Delete a task
router.delete('/:id', auth, taskController.deleteTask);

// ===== ADDITIONAL TASK OPERATIONS =====

// Add comment to a task
router.post('/:id/comments', auth, taskController.addComment);

// Get tasks by date range
router.get('/date-range/:startDate/:endDate', auth, taskController.getTasksByDateRange);

// Get task statistics (total, completed, pending, etc.)
router.get('/stats/summary', auth, taskController.getTaskStats);

// Bulk update multiple tasks
router.patch('/bulk-update', auth, taskController.bulkUpdateTasks);

module.exports = router;

