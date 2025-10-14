const mongoose = require('mongoose');

const WorkCardSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: ['Marketing', 'Sales', 'IT', 'Development', 'Testing', 'Accounts', 'Designing', 'Resources', 'Learning']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  teamLead: {
    type: String,
    required: true
  },
  teamMembers: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String
    }
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Review', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
WorkCardSchema.index({ department: 1, status: 1, createdAt: -1 });
WorkCardSchema.index({ teamLead: 1 });
WorkCardSchema.index({ 'teamMembers.name': 1 });

module.exports = mongoose.model('WorkCard', WorkCardSchema);