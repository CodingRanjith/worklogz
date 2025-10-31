const mongoose = require('mongoose');

// Track each day's earning transaction
const DailyEarningTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  configsApplied: [{
    configId: mongoose.Schema.Types.ObjectId,
    configName: String,
    amount: Number
  }],
  description: {
    type: String,
    default: 'Daily salary credit'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
DailyEarningTransactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('DailyEarningTransaction', DailyEarningTransactionSchema);

