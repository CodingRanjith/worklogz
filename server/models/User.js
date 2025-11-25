const mongoose = require('mongoose');

// Define BankDetails as a sub-schema
const BankDetailsSchema = new mongoose.Schema({
  bankingName: {
    type: String
  },
  bankAccountNumber: {
    type: String
  },
  ifscCode: {
    type: String
  },
  upiId: {
    type: String
  }
}, { _id: false }); // Prevents creation of an _id for this sub-doc

const formatEmployeeId = (value) => {
  if (!value) return value;
  const clean = value.toString().replace(/^thc\s*:\s*/i, '').trim();
  return clean ? `THC : ${clean}` : value;
};

// Main User schema
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
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
    required: true
  },
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    set: formatEmployeeId,
    get: formatEmployeeId
  },
  salary: {
    type: Number,
    default: 0
  },
  dailyEarnings: {
    type: Number,
    default: 0
  },
  lastDailyCreditDate: {
    type: Date
  },
  role: { 
    type: String, 
    enum: ['employee', 'admin', 'other'], 
    default: 'employee' 
  },

  // Additional fields
  profilePic: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  department: {
    type: String
  },
  qualification: {
    type: String
  },
  dateOfJoining: {
    type: Date
  },
  rolesAndResponsibility: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  bankDetails: BankDetailsSchema

}, {
  timestamps: true
});

UserSchema.set('toJSON', { virtuals: true, getters: true });
UserSchema.set('toObject', { virtuals: true, getters: true });

module.exports = mongoose.model('User', UserSchema);
