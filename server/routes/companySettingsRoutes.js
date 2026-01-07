const express = require('express');
const router = express.Router();
const companySettingsController = require('../controllers/companySettingsController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

/**
 * @swagger
 * /api/company-settings:
 *   get:
 *     summary: Get company settings
 *     tags: [Company Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companyName:
 *                   type: string
 *                 logo:
 *                   type: string
 *                 address:
 *                   type: string
 *                 contact:
 *                   type: object
 */
router.get('/', auth, authorizeAccess, companySettingsController.getCompanySettings);

/**
 * @swagger
 * /api/company-settings:
 *   put:
 *     summary: Update company settings (Admin only)
 *     tags: [Company Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               logo:
 *                 type: string
 *               address:
 *                 type: string
 *               contact:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/', auth, authorizeAccess, companySettingsController.updateCompanySettings);

/**
 * @swagger
 * /api/company-settings/logo:
 *   delete:
 *     summary: Delete company logo (Admin only)
 *     tags: [Company Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logo deleted successfully
 *       403:
 *         description: Admin access required
 */
router.delete('/logo', auth, authorizeAccess, companySettingsController.deleteCompanyLogo);

module.exports = router;

