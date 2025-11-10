const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  note: {
    type: String,
    trim: true,
  },
  scheduledFor: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false, timestamps: true });

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const CRMLeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  leadCode: {
    type: String,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  stage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CRMStage',
    required: true,
    index: true,
  },
  stageHistory: [{
    stage: { type: mongoose.Schema.Types.ObjectId, ref: 'CRMStage' },
    movedAt: { type: Date, default: Date.now },
    movedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, trim: true },
  }],
  stagePosition: {
    type: Number,
    default: 0,
  },
  pipelineType: {
    type: String,
    enum: ['course', 'internship'],
    default: 'course',
    index: true,
  },
  course: {
    type: String,
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  leadOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    trim: true,
    default: 'new',
  },
  followUpDate: {
    type: Date,
  },
  followUps: [followUpSchema],
  activities: [activitySchema],
  tags: [{ type: String, trim: true }],
  notes: {
    type: String,
    trim: true,
  },
  enrollmentValue: {
    type: Number,
    default: 0,
  },
  preferredBatch: {
    type: String,
    trim: true,
  },
  experienceLevel: {
    type: String,
    trim: true,
  },
  currentStatus: {
    type: String,
    trim: true,
  },
  attachments: [{
    url: String,
    label: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

CRMLeadSchema.index({ pipelineType: 1, stage: 1, createdAt: -1 });
CRMLeadSchema.index({ stage: 1, stagePosition: 1 });
CRMLeadSchema.index({ leadCode: 1 }, { unique: true, sparse: true });
CRMLeadSchema.index({ fullName: 'text', course: 'text', source: 'text', tags: 'text', notes: 'text' });
CRMLeadSchema.index({ phone: 1 });
CRMLeadSchema.index({ email: 1 });

module.exports = mongoose.model('CRMLead', CRMLeadSchema);
