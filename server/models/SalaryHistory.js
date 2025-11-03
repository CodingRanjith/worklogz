const mongoose = require('mongoose');

const SalaryHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  oldSalary: {
    type: Number,
    default: 0
  },
  newSalary: {
    type: Number,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changeType: {
    type: String,
    enum: ['Initial Setup', 'Salary Increase', 'Salary Decrease', 'Manual Adjustment'],
    default: 'Manual Adjustment'
  },
  notes: {
    type: String
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
SalaryHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SalaryHistory', SalaryHistorySchema);

