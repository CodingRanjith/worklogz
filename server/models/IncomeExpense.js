const mongoose = require('mongoose');

const incomeExpenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  sourceType: {
    type: String,
    required: true,
    trim: true
  },
  givenBy: {
    type: String,
    required: true,
    trim: true
  },
  transactionType: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  debit: {
    type: Number,
    default: 0,
    min: 0
  },
  transactionMethod: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  goalType: {
    type: String,
    enum: ['Needs', 'Wants', 'Savings'],
    trim: true
  },
  comments: {
    type: String,
    trim: true,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
incomeExpenseSchema.index({ date: -1 });
incomeExpenseSchema.index({ user: 1 });
incomeExpenseSchema.index({ transactionType: 1 });

module.exports = mongoose.model('IncomeExpense', incomeExpenseSchema);

