const mongoose = require('mongoose');

/**
 * MasterAdmin Model
 * Separate collection for master admin (development use only)
 * Master admin is not part of the User collection
 */
const MasterAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Master Admin'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: '0000000000'
  },
  company: {
    type: String,
    default: 'Development'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster email lookups
MasterAdminSchema.index({ email: 1 });

module.exports = mongoose.model('MasterAdmin', MasterAdminSchema);

