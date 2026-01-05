const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format'
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time must be in HH:MM format'
    }
  }
}, { _id: false });

const DayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  timeSlots: {
    type: [TimeSlotSchema],
    default: []
  }
}, { _id: false });

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  alternativePhone: {
    type: String,
    trim: true
  },
  courses: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      leadSource: {
        type: String,
        enum: ['trainer', 'company'],
        default: 'company'
      }
    }],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.every(course => 
          course && typeof course.name === 'string' && course.name.trim().length > 0
        );
      },
      message: 'Courses must be an array of objects with name, amount, and leadSource'
    }
  },
  companyLeadSharePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Company lead share percentage must be between 0 and 100'
    }
  },
  trainerLeadSharePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Trainer lead share percentage must be between 0 and 100'
    }
  },
  availableTimings: {
    type: [DayScheduleSchema],
    default: [
      { day: 'Monday', isAvailable: false, timeSlots: [] },
      { day: 'Tuesday', isAvailable: false, timeSlots: [] },
      { day: 'Wednesday', isAvailable: false, timeSlots: [] },
      { day: 'Thursday', isAvailable: false, timeSlots: [] },
      { day: 'Friday', isAvailable: false, timeSlots: [] },
      { day: 'Saturday', isAvailable: false, timeSlots: [] },
      { day: 'Sunday', isAvailable: false, timeSlots: [] }
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for email search
TrainerSchema.index({ email: 1 });
TrainerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Trainer', TrainerSchema);

