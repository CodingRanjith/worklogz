const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  deleteAttendanceByUserAndDate,
  bulkUpdateAttendance
} = require('../controllers/dayTodayController');

/**
 * @swagger
 * /api/daytoday/test:
 *   get:
 *     summary: Test DayToday routes (no authentication required)
 *     tags: [Day Today]
 *     responses:
 *       200:
 *         description: Routes are working
 */
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'DayToday routes are working' });
});

/**
 * @swagger
 * /api/daytoday/cards:
 *   get:
 *     summary: Get all day today cards
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get('/cards', auth, authorizeAccess, getAllCards);

/**
 * @swagger
 * /api/daytoday/cards/{id}:
 *   get:
 *     summary: Get day today card by ID
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card details
 */
router.get('/cards/:id', auth, authorizeAccess, getCardById);

/**
 * @swagger
 * /api/daytoday/cards:
 *   post:
 *     summary: Create a new day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Card created successfully
 */
router.post('/cards', auth, authorizeAccess, createCard);

/**
 * @swagger
 * /api/daytoday/cards/{id}:
 *   put:
 *     summary: Update a day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card updated successfully
 */
router.put('/cards/:id', auth, authorizeAccess, updateCard);

/**
 * @swagger
 * /api/daytoday/cards/{id}:
 *   delete:
 *     summary: Delete a day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted successfully
 */
router.delete('/cards/:id', auth, authorizeAccess, deleteCard);

/**
 * @swagger
 * /api/daytoday/cards/{cardId}/attendance:
 *   get:
 *     summary: Get attendance for a day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance data
 */
router.get('/cards/:cardId/attendance', auth, authorizeAccess, getAttendance);

/**
 * @swagger
 * /api/daytoday/cards/{cardId}/attendance:
 *   post:
 *     summary: Update attendance for a day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Attendance updated
 */
router.post('/cards/:cardId/attendance', auth, authorizeAccess, updateAttendance);

/**
 * @swagger
 * /api/daytoday/cards/{cardId}/attendance/bulk:
 *   put:
 *     summary: Bulk update attendance for a day today card
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Attendance bulk updated
 */
router.put('/cards/:cardId/attendance/bulk', auth, authorizeAccess, bulkUpdateAttendance);

/**
 * @swagger
 * /api/daytoday/cards/{cardId}/attendance/{attendanceId}:
 *   delete:
 *     summary: Delete attendance by ID
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance deleted
 */
router.delete('/cards/:cardId/attendance/:attendanceId', auth, authorizeAccess, deleteAttendance);

/**
 * @swagger
 * /api/daytoday/cards/{cardId}/attendance:
 *   delete:
 *     summary: Delete attendance by user and date
 *     tags: [Day Today]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Attendance deleted
 */
router.delete('/cards/:cardId/attendance', auth, authorizeAccess, deleteAttendanceByUserAndDate);

module.exports = router;

