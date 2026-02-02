const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

const {
  getMyIncomeExpense,
  getMyIncomeExpenseSummary,
  createMyIncomeExpense,
  updateMyIncomeExpense,
  deleteMyIncomeExpense,
  getMyIncomeExpenseById,
} = require('../controllers/incomeExpenseController');

// Personal (scoped-to-current-user) Income & Expense APIs
router.get('/summary', auth, authorizeAccess, getMyIncomeExpenseSummary);
router.get('/', auth, authorizeAccess, getMyIncomeExpense);
router.post('/', auth, authorizeAccess, createMyIncomeExpense);
router.get('/:id', auth, authorizeAccess, getMyIncomeExpenseById);
router.put('/:id', auth, authorizeAccess, updateMyIncomeExpense);
router.delete('/:id', auth, authorizeAccess, deleteMyIncomeExpense);

module.exports = router;

