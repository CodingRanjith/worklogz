const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  feeAmount: {
    type: Number,
    required: true,
    min: 0
  },
  screenshot: {
    type: String, // Cloudinary URL
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'done', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);

