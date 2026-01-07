const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const {
  getAllIncomeExpense,
  getIncomeExpenseById,
  createIncomeExpense,
  updateIncomeExpense,
  deleteIncomeExpense,
  getIncomeExpenseSummary
} = require('../controllers/incomeExpenseController');

/**
 * @swagger
 * /api/income-expense/summary:
 *   get:
 *     summary: Get income/expense summary statistics
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for summary (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for summary (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by type
 *     responses:
 *       200:
 *         description: Income/expense summary statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                 totalExpense:
 *                   type: number
 *                 netAmount:
 *                   type: number
 *                 incomeCount:
 *                   type: number
 *                 expenseCount:
 *                   type: number
 */
router.get('/summary', auth, authorizeAccess, getIncomeExpenseSummary);

/**
 * @swagger
 * /api/income-expense:
 *   get:
 *     summary: Get all income/expense records
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of income/expense records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [income, expense]
 *                   amount:
 *                     type: number
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/', auth, authorizeAccess, getAllIncomeExpense);

/**
 * @swagger
 * /api/income-expense:
 *   post:
 *     summary: Create a new income/expense record
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *                 description: Type of transaction
 *               amount:
 *                 type: number
 *                 example: 5000
 *                 description: Transaction amount
 *               category:
 *                 type: string
 *                 example: Office Supplies
 *                 description: Category of the transaction
 *               description:
 *                 type: string
 *                 example: Purchased office supplies
 *                 description: Description of the transaction
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *                 description: Date of the transaction
 *               paymentMethod:
 *                 type: string
 *                 example: Cash
 *                 description: Payment method used
 *               reference:
 *                 type: string
 *                 example: INV-001
 *                 description: Reference number or invoice
 *     responses:
 *       201:
 *         description: Income/expense record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, authorizeAccess, (req, res, next) => {
  console.log('POST /api/income-expense route hit');
  next();
}, createIncomeExpense);

/**
 * @swagger
 * /api/income-expense/{id}:
 *   get:
 *     summary: Get single income/expense record by ID
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Income/expense record ID
 *     responses:
 *       200:
 *         description: Income/expense record details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [income, expense]
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 paymentMethod:
 *                   type: string
 *                 reference:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', auth, authorizeAccess, getIncomeExpenseById);

/**
 * @swagger
 * /api/income-expense/{id}:
 *   put:
 *     summary: Update an income/expense record
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Income/expense record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               paymentMethod:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Income/expense record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', auth, authorizeAccess, updateIncomeExpense);

/**
 * @swagger
 * /api/income-expense/{id}:
 *   delete:
 *     summary: Delete an income/expense record
 *     tags: [Income & Expense]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Income/expense record ID
 *     responses:
 *       200:
 *         description: Income/expense record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Record deleted successfully
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', auth, authorizeAccess, deleteIncomeExpense);

module.exports = router;

