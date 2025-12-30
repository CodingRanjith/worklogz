const mongoose = require('mongoose');

const dayTodayAttendanceSchema = new mongoose.Schema({
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DayTodayCard',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['worked', 'not_worked'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique attendance per user per date per card
dayTodayAttendanceSchema.index({ card: 1, user: 1, date: 1 }, { unique: true });

// Index for better query performance
dayTodayAttendanceSchema.index({ card: 1, user: 1 });
dayTodayAttendanceSchema.index({ date: 1 });
dayTodayAttendanceSchema.index({ status: 1 });

module.exports = mongoose.model('DayTodayAttendance', dayTodayAttendanceSchema);

