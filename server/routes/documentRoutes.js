const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

// Get all documents (public documents for employees, all for admin)
router.get('/', auth, authorizeAccess, documentController.getAllDocuments);

// Get document statistics
router.get('/stats', auth, authorizeAccess, documentController.getDocumentStats);

// Get single document
router.get('/:id', auth, authorizeAccess, documentController.getDocumentById);

// Download document
router.get('/:id/download', auth, authorizeAccess, documentController.downloadDocument);

// Create document (admin only)
router.post('/', auth, authorizeAccess, documentController.upload, documentController.createDocument);

// Update document
router.put('/:id', auth, authorizeAccess, documentController.updateDocument);

// Delete document
router.delete('/:id', auth, authorizeAccess, documentController.deleteDocument);

module.exports = router;

