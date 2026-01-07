const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const holidayController = require('../controllers/holidayController');

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of holidays
 */
router.get('/', auth, authorizeAccess, holidayController.getAllHolidays);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: Create a new holiday (Admin only)
 *     tags: [Holidays]
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
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Holiday created successfully
 */
router.post('/', auth, authorizeAccess, holidayController.createHoliday);

/**
 * @swagger
 * /api/holidays/filter:
 *   get:
 *     summary: Get filtered holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtered holidays
 */
router.get('/filter', auth, authorizeAccess, holidayController.getHolidays);

/**
 * @swagger
 * /api/holidays/delete/{id}:
 *   delete:
 *     summary: Delete a holiday (Admin only)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *     responses:
 *       200:
 *         description: Holiday deleted successfully
 */
router.delete('/delete/:id', auth, authorizeAccess, holidayController.deleteHoliday);

/**
 * @swagger
 * /api/holidays/update/{id}:
 *   put:
 *     summary: Update a holiday (Admin only)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Holiday ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Holiday updated successfully
 */
router.put('/update/:id', auth, authorizeAccess, holidayController.updateHoliday);
module.exports = router;