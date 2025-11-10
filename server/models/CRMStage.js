const mongoose = require('mongoose');

const CRMStageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
    default: '#6366f1',
  },
  order: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  pipelineType: {
    type: String,
    enum: ['course', 'internship'],
    default: 'course',
    index: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Map,
    of: String,
  },
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

CRMStageSchema.index({ pipelineType: 1, order: 1 });
CRMStageSchema.index({ pipelineType: 1, name: 1 }, { unique: true, partialFilterExpression: { isArchived: false } });

module.exports = mongoose.model('CRMStage', CRMStageSchema);
