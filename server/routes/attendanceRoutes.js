const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const upload = require('../middleware/upload'); // ⬅️ We'll create this file next

/**
 * @swagger
 * /attendance/test:
 *   get:
 *     summary: Test attendance route (no authentication required)
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: Attendance routes are working
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Attendance routes are loaded', timestamp: new Date() });
});

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Mark attendance (check-in or check-out)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceCreate'
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Invalid request
 */
router.post('/', auth, authorizeAccess, upload.single('image'), attendanceController.markAttendance);

/**
 * @swagger
 * /attendance/all:
 *   get:
 *     summary: Get all attendance records (Admin only)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of all attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *       403:
 *         description: Admin access required
 */
router.get('/all', auth, authorizeAccess, attendanceController.getAllAttendance);

/**
 * @swagger
 * /attendance/last:
 *   get:
 *     summary: Get last attendance record for current user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: No attendance record found
 */
router.get('/last', auth, authorizeAccess, attendanceController.getLastAttendance);

/**
 * @swagger
 * /attendance/user/{userId}/summary/{year}/{month}:
 *   get:
 *     summary: Get attendance summary for a user by year and month
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *     responses:
 *       200:
 *         description: Attendance summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDays:
 *                   type: number
 *                 presentDays:
 *                   type: number
 *                 absentDays:
 *                   type: number
 */
router.get('/user/:userId/summary/:year/:month', auth, authorizeAccess, attendanceController.getUserSummary);

/**
 * @swagger
 * /attendance/user/{userId}/last:
 *   get:
 *     summary: Get last attendance record for a specific user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Last attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 */
router.get('/user/:userId/last', auth, authorizeAccess, attendanceController.getUserLastAttendance);

/**
 * @swagger
 * /attendance/user/{userId}:
 *   get:
 *     summary: Get all attendance records for a specific user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
router.get('/user/:userId', auth, authorizeAccess, attendanceController.getAttendanceByUser);

/**
 * @swagger
 * /attendance/me:
 *   get:
 *     summary: Get current user's attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
router.get('/me', auth, authorizeAccess, attendanceController.getMyAttendance);

/**
 * @swagger
 * /attendance/date/{date}:
 *   get:
 *     summary: Get attendance records for a specific date
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of attendance records for the date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
router.get('/date/:date', auth, authorizeAccess, attendanceController.getAttendanceByDate);
module.exports = router;
