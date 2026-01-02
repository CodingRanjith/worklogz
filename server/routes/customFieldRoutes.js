const express = require('express');
const router = express.Router();
const customFieldController = require('../controllers/customFieldController');
const authMiddleware = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

// Get all custom fields
router.get('/', authMiddleware, authorizeAccess, customFieldController.getAllCustomFields);

// Get field types summary (grouped by type)
router.get('/summary', authMiddleware, authorizeAccess, customFieldController.getFieldTypesSummary);

// Get custom fields by type
router.get('/type/:fieldType', authMiddleware, authorizeAccess, customFieldController.getCustomFieldsByType);

// Create a new custom field
router.post('/', authMiddleware, authorizeAccess, customFieldController.createCustomField);

// Bulk create custom fields
router.post('/bulk', authMiddleware, authorizeAccess, customFieldController.bulkCreateCustomFields);

// Update a custom field
router.put('/:id', authMiddleware, authorizeAccess, customFieldController.updateCustomField);

// Toggle active status
router.patch('/:id/toggle', authMiddleware, authorizeAccess, customFieldController.toggleActiveStatus);

// Delete a custom field
router.delete('/:id', authMiddleware, authorizeAccess, customFieldController.deleteCustomField);

module.exports = router;

