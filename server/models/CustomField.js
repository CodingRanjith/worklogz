const mongoose = require('mongoose');

const CustomFieldSchema = new mongoose.Schema({
  fieldType: {
    type: String,
    required: true,
    enum: ['role', 'department', 'company', 'division', 'position', 'location', 'custom'],
    index: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for unique values per field type
CustomFieldSchema.index({ fieldType: 1, value: 1 }, { unique: true });

// Index for active fields
CustomFieldSchema.index({ fieldType: 1, isActive: 1, order: 1 });

module.exports = mongoose.model('CustomField', CustomFieldSchema);

