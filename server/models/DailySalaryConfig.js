const mongoose = require('mongoose');

// Schema for managing daily salary credit configurations
const DailySalaryConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Default Daily Credit'
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  appliesTo: {
    type: String,
    enum: ['all', 'specific_departments', 'specific_users'],
    default: 'all'
  },
  departments: [{
    type: String
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null // null means no end date
  },
  autoApply: {
    type: Boolean,
    default: true
  },
  lastAppliedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
DailySalaryConfigSchema.index({ isActive: 1, appliesTo: 1 });

module.exports = mongoose.model('DailySalaryConfig', DailySalaryConfigSchema);

