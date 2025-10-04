const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, default: 'backlog' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reporter: { type: String, default: 'Unknown' },
  assignee: { type: String, default: 'Unassigned' },
  startTime: { type: String },
  endTime: { type: String },
  comments: { type: Array, default: [] },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
