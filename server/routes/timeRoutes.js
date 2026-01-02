const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const taskController = require('../controllers/timeSheetController');

// ===== TASK CRUD OPERATIONS =====

// Get all tasks for the authenticated user (with filtering, pagination, sorting)
// Query params: startDate, endDate, status, assignee, page, limit, sortBy, sortOrder
router.get('/', auth, authorizeAccess, taskController.getAllTasks);

// Get single task by ID
router.get('/:id', auth, authorizeAccess, taskController.getTaskById);

// Create a new task
router.post('/', auth, authorizeAccess, taskController.createTask);

// Update a task (full update)
router.put('/:id', auth, authorizeAccess, taskController.updateTask);

// Delete a task (soft delete)
router.delete('/:id', auth, authorizeAccess, taskController.deleteTask);

// Restore a deleted task
router.post('/:id/restore', auth, authorizeAccess, taskController.restoreTask);

// Get archived/deleted tasks
router.get('/archived/list', auth, authorizeAccess, taskController.getArchivedTasks);

// ===== ADDITIONAL TASK OPERATIONS =====

// Add comment to a task
router.post('/:id/comments', auth, authorizeAccess, taskController.addComment);

// Get tasks by date range
router.get('/date-range/:startDate/:endDate', auth, authorizeAccess, taskController.getTasksByDateRange);

// Get task statistics (total, completed, pending, etc.)
router.get('/stats/summary', auth, authorizeAccess, taskController.getTaskStats);

// Bulk update multiple tasks
router.patch('/bulk-update', auth, authorizeAccess, taskController.bulkUpdateTasks);

module.exports = router;

