const mongoose = require('mongoose');

const dayTodayCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2100
  },
  employeeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
dayTodayCardSchema.index({ year: -1 });
dayTodayCardSchema.index({ createdBy: 1 });
dayTodayCardSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('DayTodayCard', dayTodayCardSchema);

