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

// Get summary statistics (must be before /:id route)
router.get('/summary', auth, authorizeAccess, getIncomeExpenseSummary);

// Get all income/expense records
router.get('/', auth, authorizeAccess, getAllIncomeExpense);

// Create income/expense record (must be before /:id route)
router.post('/', auth, authorizeAccess, (req, res, next) => {
  console.log('POST /api/income-expense route hit');
  next();
}, createIncomeExpense);

// Get single income/expense record
router.get('/:id', auth, authorizeAccess, getIncomeExpenseById);

// Update income/expense record
router.put('/:id', auth, authorizeAccess, updateIncomeExpense);

// Delete income/expense record
router.delete('/:id', auth, authorizeAccess, deleteIncomeExpense);

module.exports = router;

