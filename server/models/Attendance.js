//server/models/Attendance.js
const mongoose = require('mongoose');
const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['check-in', 'check-out'] },
  location: String,
  isInOffice: { type: Boolean, default: true },
  officeName: String,
  image: String,
  timestamp: Date,
  adminBreakTimeMinutes: { type: Number, default: 0 }, // Admin-added break time in minutes
});
module.exports = mongoose.model('Attendance', AttendanceSchema);