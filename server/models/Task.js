const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: 'backlog' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporter: { type: String, default: 'Unknown' },
  assignee: { type: String, default: 'Unassigned' },
  department: { 
    type: String,
    enum: [
      'Administration',
      'Human Resources (HR)',
      'Finance & Accounting',
      'Sales',
      'Marketing',
      'Customer Support / Service',
      'Operations / Project Management',
      'Legal & Compliance',
      'Procurement / Purchasing',
      'Research & Development (R&D)',
      'Information Technology (IT)',
      'Quality Assurance (QA)',
      'Business Development',
      'Public Relations (PR)',
      'Training & Development',
      // Legacy departments for backward compatibility
      'Development', 'Testing', 'Accounts', 'Designing', 'Resources', 'Learning'
    ]
  },
  startTime: { type: String },
  endTime: { type: String },
  comments: { type: Array, default: [] },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Soft delete fields
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
