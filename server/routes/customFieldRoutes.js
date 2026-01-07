const express = require('express');
const router = express.Router();
const customFieldController = require('../controllers/customFieldController');
const authMiddleware = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

/**
 * @swagger
 * /api/custom-fields:
 *   get:
 *     summary: Get all custom fields
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of custom fields
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', authMiddleware, authorizeAccess, customFieldController.getAllCustomFields);

/**
 * @swagger
 * /api/custom-fields/summary:
 *   get:
 *     summary: Get field types summary (grouped by type)
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Field types summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/summary', authMiddleware, authorizeAccess, customFieldController.getFieldTypesSummary);

/**
 * @swagger
 * /api/custom-fields/type/{fieldType}:
 *   get:
 *     summary: Get custom fields by type
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldType
 *         required: true
 *         schema:
 *           type: string
 *         description: Field type
 *     responses:
 *       200:
 *         description: List of custom fields by type
 */
router.get('/type/:fieldType', authMiddleware, authorizeAccess, customFieldController.getCustomFieldsByType);

/**
 * @swagger
 * /api/custom-fields:
 *   post:
 *     summary: Create a new custom field
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Custom field created successfully
 */
router.post('/', authMiddleware, authorizeAccess, customFieldController.createCustomField);

/**
 * @swagger
 * /api/custom-fields/bulk:
 *   post:
 *     summary: Bulk create custom fields
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fields
 *             properties:
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Custom fields created successfully
 */
router.post('/bulk', authMiddleware, authorizeAccess, customFieldController.bulkCreateCustomFields);

/**
 * @swagger
 * /api/custom-fields/{id}:
 *   put:
 *     summary: Update a custom field
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom field ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Custom field updated successfully
 */
router.put('/:id', authMiddleware, authorizeAccess, customFieldController.updateCustomField);

/**
 * @swagger
 * /api/custom-fields/{id}/toggle:
 *   patch:
 *     summary: Toggle custom field active status
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom field ID
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */
router.patch('/:id/toggle', authMiddleware, authorizeAccess, customFieldController.toggleActiveStatus);

/**
 * @swagger
 * /api/custom-fields/{id}:
 *   delete:
 *     summary: Delete a custom field
 *     tags: [Custom Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom field ID
 *     responses:
 *       200:
 *         description: Custom field deleted successfully
 */
router.delete('/:id', authMiddleware, authorizeAccess, customFieldController.deleteCustomField);

module.exports = router;

