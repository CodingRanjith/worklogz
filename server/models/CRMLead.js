const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  note: {
    type: String,
    trim: true,
  },
  scheduledFor: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false, timestamps: true });

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const CRMLeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  leadCode: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  leadSource: {
    type: String,
    trim: true,
  },
  enquiryDate: {
    type: Date,
  },
  gender: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  dateOfBirth: {
    type: Date,
  },
  city: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  stage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CRMStage',
    required: true,
    index: true,
  },
  stageHistory: [{
    stage: { type: mongoose.Schema.Types.ObjectId, ref: 'CRMStage' },
    movedAt: { type: Date, default: Date.now },
    movedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, trim: true },
  }],
  stagePosition: {
    type: Number,
    default: 0,
  },
  pipelineType: {
    type: String,
    enum: ['course', 'internship', 'it-project'],
    default: 'course',
    index: true,
  },
  course: {
    type: String,
    trim: true,
  },
  profileType: {
    type: String,
    trim: true,
  },
  educationQualification: {
    type: String,
    trim: true,
  },
  currentStatusDetail: {
    type: String,
    trim: true,
  },
  organizationName: {
    type: String,
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    trim: true,
  },
  leadOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  interestedProgramType: [{
    type: String,
    trim: true,
  }],
  domainInterests: [{
    type: String,
    trim: true,
  }],
  trainingMode: {
    type: String,
    trim: true,
  },
  durationRequired: {
    type: String,
    trim: true,
  },
  preferredStartDate: {
    type: Date,
  },
  urgencyLevel: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
    default: 'new',
  },
  interestLevel: {
    type: String,
    trim: true,
  },
  budgetExpectation: {
    type: String,
    trim: true,
  },
  decisionMaker: {
    type: String,
    trim: true,
  },
  followUpDate: {
    type: Date,
  },
  followUpNotes: {
    type: String,
    trim: true,
  },
  lastContactedDate: {
    type: Date,
  },
  communicationType: {
    type: String,
    trim: true,
  },
  // Course CRM specific fields
  courseSelected: {
    type: String,
    trim: true,
  },
  courseProgramType: {
    type: String,
    trim: true,
  },
  courseMode: {
    type: String,
    trim: true,
  },
  courseBatchType: {
    type: String,
    trim: true,
  },
  courseBatchTimeSlot: {
    type: String,
    trim: true,
  },
  courseDuration: {
    type: String,
    trim: true,
  },
  courseStartDate: {
    type: Date,
  },
  courseDemoCompleted: {
    type: Boolean,
    default: false,
  },
  courseTrainerAssigned: {
    type: String,
    trim: true,
  },
  courseFee: {
    type: Number,
    default: 0,
  },
  courseDiscountApplied: {
    type: Number,
    default: 0,
  },
  courseFinalFeePayable: {
    type: Number,
    default: 0,
  },
  coursePaymentMethod: {
    type: String,
    trim: true,
  },
  coursePaymentStatus: {
    type: String,
    trim: true,
  },
  courseTransactionId: {
    type: String,
    trim: true,
  },
  courseInvoiceUploaded: {
    type: Boolean,
    default: false,
  },
  courseEmiDetails: {
    type: String,
    trim: true,
  },
  courseCounselorAssigned: {
    type: String,
    trim: true,
  },
  courseEnrollmentNotes: {
    type: String,
    trim: true,
  },
  courseFollowUpRequired: {
    type: Boolean,
    default: false,
  },
  courseNextFollowUpDate: {
    type: Date,
  },
  courseCompletionStatus: {
    type: String,
    trim: true,
  },
  courseCertificateIssued: {
    type: Boolean,
    default: false,
  },
  courseCertificateId: {
    type: String,
    trim: true,
  },
  courseCertificateIssueDate: {
    type: Date,
  },
  courseTrainerNotes: {
    type: String,
    trim: true,
  },
  // IT Projects CRM specific fields
  projectClientName: {
    type: String,
    trim: true,
  },
  projectCompanyName: {
    type: String,
    trim: true,
  },
  projectWebsiteUrl: {
    type: String,
    trim: true,
  },
  projectClientType: {
    type: String,
    trim: true,
  },
  projectIndustryType: {
    type: String,
    trim: true,
  },
  projectAnnualBudgetRange: {
    type: String,
    trim: true,
  },
  projectCategory: [{
    type: String,
    trim: true,
  }],
  projectName: {
    type: String,
    trim: true,
  },
  projectDescription: {
    type: String,
    trim: true,
  },
  projectKeyFeatures: [{
    type: String,
    trim: true,
  }],
  projectUrgency: {
    type: String,
    trim: true,
  },
  projectTimelineExpectation: {
    type: String,
    trim: true,
  },
  projectBudgetExpectation: {
    type: String,
    trim: true,
  },
  projectPreferredTechStack: [{
    type: String,
    trim: true,
  }],
  projectHostingPreference: {
    type: String,
    trim: true,
  },
  projectExistingSystem: {
    type: Boolean,
    default: false,
  },
  projectExistingSystemDetails: {
    type: String,
    trim: true,
  },
  projectFilesUrl: {
    type: String,
    trim: true,
  },
  projectLeadStage: {
    type: String,
    trim: true,
  },
  projectInterestLevel: {
    type: String,
    trim: true,
  },
  projectDecisionMakerName: {
    type: String,
    trim: true,
  },
  projectStakeholdersCount: {
    type: Number,
    default: 0,
  },
  projectProposalAmount: {
    type: Number,
    default: 0,
  },
  projectProposalDocumentUrl: {
    type: String,
    trim: true,
  },
  projectPaymentTerms: {
    type: String,
    trim: true,
  },
  projectAdvancePaid: {
    type: Boolean,
    default: false,
  },
  projectPaymentStatus: {
    type: String,
    trim: true,
  },
  projectStatus: {
    type: String,
    trim: true,
  },
  projectAssignedTeam: [{
    type: String,
    trim: true,
  }],
  projectStartDate: {
    type: Date,
  },
  projectDeadline: {
    type: Date,
  },
  projectDeliveryDate: {
    type: Date,
  },
  projectVersionControlLink: {
    type: String,
    trim: true,
  },
  projectDocumentationUrl: {
    type: String,
    trim: true,
  },
  projectCommunicationMode: {
    type: String,
    trim: true,
  },
  projectMeetingNotes: {
    type: String,
    trim: true,
  },
  projectClientFeedback: {
    type: String,
    trim: true,
  },
  projectSupportType: [{
    type: String,
    trim: true,
  }],
  projectSupportExpiryDate: {
    type: Date,
  },
  projectMaintenanceFee: {
    type: Number,
    default: 0,
  },
  projectInternalNotes: {
    type: String,
    trim: true,
  },
  projectClientNotes: {
    type: String,
    trim: true,
  },
  followUps: [followUpSchema],
  activities: [activitySchema],
  tags: [{ type: String, trim: true }],
  notes: {
    type: String,
    trim: true,
  },
  documents: {
    resumeUrl: { type: String, trim: true },
    idProofUrl: { type: String, trim: true },
    requirementDocUrl: { type: String, trim: true },
    studentPhotoUrl: { type: String, trim: true },
    addressProofUrl: { type: String, trim: true },
    projectProposalUrl: { type: String, trim: true },
    projectDocumentationUrl: { type: String, trim: true },
  },
  enrollmentValue: {
    type: Number,
    default: 0,
  },
  preferredBatch: {
    type: String,
    trim: true,
  },
  experienceLevel: {
    type: String,
    trim: true,
  },
  currentStatus: {
    type: String,
    trim: true,
  },
  paymentStatus: {
    type: String,
    trim: true,
  },
  programBatch: {
    type: String,
    trim: true,
  },
  certificateNeeded: {
    type: Boolean,
    default: false,
  },
  finalRemarks: {
    type: String,
    trim: true,
  },
  attachments: [{
    url: String,
    label: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  projectAttachments: [{
    type: String,
    trim: true,
  }],
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

CRMLeadSchema.index({ pipelineType: 1, stage: 1, createdAt: -1 });
CRMLeadSchema.index({ stage: 1, stagePosition: 1 });
CRMLeadSchema.index({ leadCode: 1 }, { unique: true, sparse: true });
CRMLeadSchema.index({ fullName: 'text', course: 'text', source: 'text', tags: 'text', notes: 'text' });
CRMLeadSchema.index({ phone: 1 });
CRMLeadSchema.index({ email: 1 });

module.exports = mongoose.model('CRMLead', CRMLeadSchema);
