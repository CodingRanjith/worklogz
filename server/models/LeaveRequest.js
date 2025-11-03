// === models/LeaveRequest.js ===
const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  leaveType: { 
    type: String, 
    enum: ['Casual Leave', 'Sick Leave', 'Privileged Leave', 'Compensation Off', 'Emergency'], 
    default: 'Casual Leave' 
  },
  isHalfDay: { 
    type: Boolean, 
    default: false 
  },
  halfDayPeriod: { 
    type: String, 
    enum: ['First Half', 'Second Half', null], 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  numberOfDays: { 
    type: Number, 
    default: 0 
  },
  isLOP: { 
    type: Boolean, 
    default: false 
  },
  adminNotes: { 
    type: String 
  },
  year: { 
    type: Number, 
    default: new Date().getFullYear() 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Calculate number of days before saving
LeaveRequestSchema.pre('save', function(next) {
  if (this.isNew) {
    const start = new Date(this.fromDate);
    const end = new Date(this.toDate);
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (this.isHalfDay) {
      days = 0.5;
    }
    
    this.numberOfDays = days;
    this.year = new Date(this.fromDate).getFullYear();
  }
  next();
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);