const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllIncomeExpense,
  getIncomeExpenseById,
  createIncomeExpense,
  updateIncomeExpense,
  deleteIncomeExpense,
  getIncomeExpenseSummary
} = require('../controllers/incomeExpenseController');

// All routes require authentication
router.use(auth);

// Get summary statistics (must be before /:id route)
router.get('/summary', getIncomeExpenseSummary);

// Get all income/expense records
router.get('/', getAllIncomeExpense);

// Create income/expense record (must be before /:id route)
router.post('/', (req, res, next) => {
  console.log('POST /api/income-expense route hit');
  next();
}, createIncomeExpense);

// Get single income/expense record
router.get('/:id', getIncomeExpenseById);

// Update income/expense record
router.put('/:id', updateIncomeExpense);

// Delete income/expense record
router.delete('/:id', deleteIncomeExpense);

module.exports = router;

