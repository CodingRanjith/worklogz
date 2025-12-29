const mongoose = require('mongoose');

const CompanySettingsSchema = new mongoose.Schema({
  // Basic Company Information
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String, // URL or file path
    default: ''
  },
  companyDescription: {
    type: String,
    trim: true,
    default: ''
  },
  companyEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  companyPhone: {
    type: String,
    trim: true
  },
  companyAddress: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  
  // Additional Company Details
  companyRegistrationNumber: {
    type: String,
    trim: true
  },
  companyTaxId: {
    type: String,
    trim: true
  },
  companyFoundedYear: {
    type: Number
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  companyIndustry: {
    type: String,
    trim: true
  },
  
  // Contact Information
  contactPerson: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  
  // Social Media Links
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true }
  },
  
  // Company Branding
  primaryColor: {
    type: String,
    default: '#1c1f33'
  },
  secondaryColor: {
    type: String,
    default: '#94a3b8'
  },
  
  // System Settings
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  dateFormat: {
    type: String,
    default: 'DD/MM/YYYY'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  currencySymbol: {
    type: String,
    default: '₹'
  },
  
  // Employee ID Settings
  employeeIdPrefix: {
    type: String,
    default: 'THC',
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
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

// Ensure only one company settings document exists
CompanySettingsSchema.statics.getCompanySettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      companyName: 'Worklogz',
      companyDescription: 'Employee management and HR system',
      employeeIdPrefix: 'THC'
    });
  }
  return settings;
};

module.exports = mongoose.model('CompanySettings', CompanySettingsSchema);

