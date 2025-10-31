const mongoose = require('mongoose');

// Achievement/Badge System for Employee Motivation
const AchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['attendance', 'task', 'performance', 'punctuality', 'milestone', 'special'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  points: {
    type: Number,
    default: 0
  },
  earnedDate: {
    type: Date,
    default: Date.now
  },
  isSpecial: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Goal/Target System
const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['attendance', 'tasks', 'learning', 'performance', 'other'],
    default: 'other'
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'count'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed', 'cancelled'],
    default: 'in_progress'
  },
  reward: {
    type: String
  }
}, {
  timestamps: true
});

// Employee Events (Calendar)
const EmployeeEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  eventType: {
    type: String,
    enum: ['meeting', 'training', 'deadline', 'birthday', 'anniversary', 'holiday', 'other'],
    default: 'other'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  location: {
    type: String
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  isCompanyWide: {
    type: Boolean,
    default: false
  },
  reminder: {
    enabled: Boolean,
    minutesBefore: Number
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('Achievement', AchievementSchema);
const Goal = mongoose.model('Goal', GoalSchema);
const EmployeeEvent = mongoose.model('EmployeeEvent', EmployeeEventSchema);

module.exports = { Achievement, Goal, EmployeeEvent };

