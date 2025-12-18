const express = require('express');
const router = express.Router();
const customFieldController = require('../controllers/customFieldController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get all custom fields
router.get('/', customFieldController.getAllCustomFields);

// Get field types summary (grouped by type)
router.get('/summary', customFieldController.getFieldTypesSummary);

// Get custom fields by type
router.get('/type/:fieldType', customFieldController.getCustomFieldsByType);

// Create a new custom field
router.post('/', customFieldController.createCustomField);

// Bulk create custom fields
router.post('/bulk', customFieldController.bulkCreateCustomFields);

// Update a custom field
router.put('/:id', customFieldController.updateCustomField);

// Toggle active status
router.patch('/:id/toggle', customFieldController.toggleActiveStatus);

// Delete a custom field
router.delete('/:id', customFieldController.deleteCustomField);

module.exports = router;

