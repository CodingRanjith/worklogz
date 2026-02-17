const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  payoutTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'cash', 'other'],
    default: 'bank_transfer'
  },
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String,
    trim: true
  },
  requestedByUser: {
    type: Boolean,
    default: false
  },
  requestedAmount: {
    type: Number,
    min: 0
  },
  requestNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
PayoutSchema.index({ userId: 1, createdAt: -1 });
PayoutSchema.index({ transactionId: 1 });
PayoutSchema.index({ status: 1 });
PayoutSchema.index({ payoutTime: -1 });

// Populate user details when querying
PayoutSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email employeeId position department'
  }).populate({
    path: 'processedBy',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Payout', PayoutSchema);
