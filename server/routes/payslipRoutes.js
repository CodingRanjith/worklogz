// routes/payslipRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const authorizeAccess = require("../middleware/authorizeAccess");
const { createPayslip, getPayslips } = require("../controllers/payslipController");

const router = express.Router();

/**
 * @swagger
 * /api/payslips:
 *   post:
 *     summary: Create a payslip (Admin only)
 *     tags: [Payslips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - month
 *               - year
 *             properties:
 *               userId:
 *                 type: string
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *               salary:
 *                 type: number
 *               deductions:
 *                 type: number
 *               netSalary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payslip created successfully
 */
router.post("/", auth, authorizeAccess, createPayslip);

/**
 * @swagger
 * /api/payslips:
 *   get:
 *     summary: Get all payslips
 *     tags: [Payslips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payslips
 */
router.get("/", auth, authorizeAccess, getPayslips);

module.exports = router;
