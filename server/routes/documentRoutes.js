const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get all documents (public documents for employees, all for admin)
router.get('/', auth, documentController.getAllDocuments);

// Get document statistics
router.get('/stats', auth, role('admin'), documentController.getDocumentStats);

// Get single document
router.get('/:id', auth, documentController.getDocumentById);

// Download document
router.get('/:id/download', auth, documentController.downloadDocument);

// Create document (admin only)
router.post('/', auth, role('admin'), documentController.upload, documentController.createDocument);

// Update document
router.put('/:id', auth, documentController.updateDocument);

// Delete document
router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;

