const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'Contributor', trim: true },
    allocation: { type: Number, min: 0, max: 100, default: 100 },
    responsibility: { type: String, trim: true },
    assignedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const MilestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const QuickLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, uppercase: true, unique: true, sparse: true },
    client: { type: String, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
      default: 'planning'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    health: {
      type: String,
      enum: ['on-track', 'at-risk', 'off-track'],
      default: 'on-track'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teamMembers: [TeamMemberSchema],
    milestones: [MilestoneSchema],
    workspace: {
      quickLinks: [QuickLinkSchema],
      notes: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

ProjectSchema.index({ name: 'text', code: 'text', client: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);

