const CRMStage = require('../models/CRMStage');
const CRMLead = require('../models/CRMLead');

const DEFAULT_STAGE_CONFIG = {
  course: [
    { name: 'Enquiry', color: '#6366f1' },
    { name: 'Prospect', color: '#0ea5e9' },
    { name: 'Training', color: '#22c55e' },
    { name: 'Closed / Won', color: '#16a34a' },
    { name: 'Closed / Lost', color: '#ef4444' },
    { name: 'Follow-up Pending', color: '#f97316' },
    { name: 'High Priority', color: '#f43f5e' },
    { name: 'Demo Scheduled', color: '#a855f7' },
    { name: 'Payment Pending', color: '#facc15' },
    { name: 'Admission Process', color: '#0ea5e9' },
    { name: 'Re-Engage', color: '#38bdf8' },
    { name: 'Completed Training', color: '#22c55e' },
  ],
  internship: [
    { name: 'Enquiry', color: '#6366f1' },
    { name: 'Prospect', color: '#0ea5e9' },
    { name: 'Onboard', color: '#22c55e' },
    { name: 'Training & Progress', color: '#16a34a' },
    { name: 'Hands-on Experience', color: '#14b8a6' },
    { name: 'Certifications', color: '#a855f7' },
    { name: 'CV Build', color: '#f97316' },
    { name: 'Job Placement', color: '#facc15' },
  ],
  'it-project': [
    { name: 'Enquiry', color: '#6366f1' },
    { name: 'Requirement Collected', color: '#0ea5e9' },
    { name: 'Proposal Sent', color: '#22c55e' },
    { name: 'Negotiation', color: '#f97316' },
    { name: 'Closed / Won', color: '#16a34a' },
    { name: 'Closed / Lost', color: '#ef4444' },
    { name: 'On Hold', color: '#facc15' },
  ],
};

const normalizeStagePositions = async (stageId) => {
  if (!stageId) return;

  const leads = await CRMLead.find({ stage: stageId }).sort({ stagePosition: 1, updatedAt: -1, createdAt: -1 });
  await Promise.all(leads.map((lead, index) => {
    if (lead.stagePosition !== index) {
      lead.stagePosition = index;
      return lead.save();
    }
    return null;
  }));
};

const reorderStageWithLead = async (stageId, leadId, desiredPosition = 0) => {
  if (!stageId || !leadId) return;

  const leads = await CRMLead.find({ stage: stageId }).sort({ stagePosition: 1, updatedAt: -1, createdAt: -1 });
  const leadIdStr = leadId.toString();
  const movingLead = leads.find(lead => lead._id.toString() === leadIdStr);

  if (!movingLead) {
    await normalizeStagePositions(stageId);
    return;
  }

  const remaining = leads.filter(lead => lead._id.toString() !== leadIdStr);
  const insertionIndex = typeof desiredPosition === 'number' && !Number.isNaN(desiredPosition)
    ? Math.max(0, Math.min(desiredPosition, remaining.length))
    : remaining.length;
  const ordered = [
    ...remaining.slice(0, insertionIndex),
    movingLead,
    ...remaining.slice(insertionIndex),
  ];

  await Promise.all(ordered.map((lead, index) => {
    if (lead.stagePosition !== index) {
      return CRMLead.findByIdAndUpdate(lead._id, { stagePosition: index });
    }
    return null;
  }));
};

const ensureDefaultStages = async (pipelineType = 'course', userId) => {
  const existingActive = await CRMStage.find({ pipelineType, isArchived: false }).sort({ order: 1 });
  if (existingActive.length) {
    return existingActive;
  }

  const defaultStages = DEFAULT_STAGE_CONFIG[pipelineType] || [];
  if (!defaultStages.length) {
    return [];
  }

  const createPayload = defaultStages.map((stage, index) => ({
    ...stage,
    pipelineType,
    order: index,
    isDefault: true,
    createdBy: userId,
    updatedBy: userId,
  }));

  try {
    await CRMStage.insertMany(createPayload, { ordered: false });
  } catch (error) {
    if (error?.code !== 11000) {
      throw error;
    }
    // Ignore duplicate stage insert errors from concurrent seeding
  }

  return CRMStage.find({ pipelineType, isArchived: false }).sort({ order: 1 });
};

const generateLeadCode = async (pipelineType = 'course') => {
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const count = await CRMLead.countDocuments({ pipelineType });
    const nextNumber = count + 1 + attempts;
    const code = `#${String(nextNumber).padStart(3, '0')}`;

    const exists = await CRMLead.exists({ leadCode: code });
    if (!exists) {
      return code;
    }
  }

  return `#${String(Date.now()).slice(-3)}`;
};

const assignLeadCodeIfMissing = async (lead) => {
  if (!lead?.leadCode) {
    const code = await generateLeadCode(lead.pipelineType || 'course');
    await CRMLead.findByIdAndUpdate(lead._id, { leadCode: code });
    lead.leadCode = code;
  }
  return lead;
};

// Stage Controllers
const getStages = async (req, res) => {
  try {
    const { pipelineType = 'course' } = req.query;
    const stages = await ensureDefaultStages(pipelineType, req.user?._id);
    res.json(stages);
  } catch (error) {
    console.error('Error fetching CRM stages:', error);
    res.status(500).json({ message: 'Failed to fetch stages' });
  }
};

const createStage = async (req, res) => {
  try {
    const { name, description, color, pipelineType = 'course' } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Stage name is required' });
    }

    const totalStages = await CRMStage.countDocuments({ pipelineType, isArchived: false });

    const stage = await CRMStage.create({
      name: name.trim(),
      description,
      color,
      pipelineType,
      order: totalStages,
      isDefault: false,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    res.status(201).json(stage);
  } catch (error) {
    console.error('Error creating CRM stage:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Stage name must be unique within the pipeline' });
    }
    res.status(500).json({ message: 'Failed to create stage' });
  }
};

const updateStage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const stage = await CRMStage.findById(id);
    if (!stage || stage.isArchived) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    if (typeof updates.name === 'string') {
      updates.name = updates.name.trim();
    }

    stage.set({ ...updates, updatedBy: req.user?._id });
    await stage.save();

    res.json(stage);
  } catch (error) {
    console.error('Error updating CRM stage:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Stage name must be unique within the pipeline' });
    }
    res.status(500).json({ message: 'Failed to update stage' });
  }
};

const deleteStage = async (req, res) => {
  try {
    const { id } = req.params;
    const stage = await CRMStage.findById(id);

    if (!stage || stage.isArchived) {
      return res.status(404).json({ message: 'Stage not found' });
    }

    const leadsCount = await CRMLead.countDocuments({ stage: id });
    if (leadsCount > 0) {
      return res.status(400).json({ message: 'Cannot delete stage while leads are assigned. Move or delete the leads first.' });
    }

    if (stage.isDefault) {
      stage.isArchived = true;
      stage.updatedBy = req.user?._id;
      await stage.save();
    } else {
      await CRMStage.deleteOne({ _id: id });
    }

    // Normalize order
    const remainingStages = await CRMStage.find({ pipelineType: stage.pipelineType, isArchived: false }).sort({ order: 1 });
    await Promise.all(remainingStages.map((stg, index) => {
      if (stg.order !== index) {
        stg.order = index;
        stg.updatedBy = req.user?._id;
        return stg.save();
      }
      return null;
    }));

    res.json({ message: 'Stage removed successfully' });
  } catch (error) {
    console.error('Error deleting CRM stage:', error);
    res.status(500).json({ message: 'Failed to delete stage' });
  }
};

const reorderStages = async (req, res) => {
  try {
    const { pipelineType = 'course', stageOrder = [] } = req.body;

    if (!Array.isArray(stageOrder) || !stageOrder.length) {
      return res.status(400).json({ message: 'stageOrder must be a non-empty array' });
    }

    const stages = await CRMStage.find({ pipelineType, isArchived: false });
    const stageIds = stages.map(stage => stage._id.toString());

    const missing = stageOrder.filter(id => !stageIds.includes(id));
    if (missing.length) {
      return res.status(400).json({ message: 'One or more stages do not belong to the pipeline' });
    }

    await Promise.all(stageOrder.map((stageId, index) => (
      CRMStage.findByIdAndUpdate(stageId, { order: index, updatedBy: req.user?._id })
    )));

    const updatedStages = await CRMStage.find({ pipelineType, isArchived: false }).sort({ order: 1 });
    res.json(updatedStages);
  } catch (error) {
    console.error('Error reordering CRM stages:', error);
    res.status(500).json({ message: 'Failed to reorder stages' });
  }
};

// Lead Controllers
const buildLeadFilter = ({ pipelineType = 'course', stage, course, source, status, search }) => {
  const filter = { pipelineType };

  if (stage) {
    filter.stage = stage;
  }

  if (course) {
    filter.course = new RegExp(course, 'i');
  }

  if (source) {
    filter.source = new RegExp(source, 'i');
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { fullName: regex },
      { phone: regex },
      { email: regex },
    ];
  }

  return filter;
};

const getLeads = async (req, res) => {
  try {
    const {
      pipelineType = 'course',
      stage,
      course,
      source,
      status,
      search,
    } = req.query;

    await ensureDefaultStages(pipelineType, req.user?._id);

    const filter = buildLeadFilter({ pipelineType, stage, course, source, status, search });

    const leads = await CRMLead.find(filter)
      .populate('stage')
      .populate('leadOwner', 'name email phone profilePic')
      .populate('assignedUsers', 'name email phone profilePic')
      .populate('createdBy', 'name email phone profilePic')
      .sort({ stage: 1, stagePosition: 1, createdAt: -1 });

    await Promise.all(leads.map(assignLeadCodeIfMissing));

    res.json(leads);
  } catch (error) {
    console.error('Error fetching CRM leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await CRMLead.findById(req.params.id)
      .populate('stage')
      .populate('leadOwner', 'name email phone profilePic')
      .populate('assignedUsers', 'name email phone profilePic')
      .populate('createdBy', 'name email phone profilePic')
      .populate('updatedBy', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await assignLeadCodeIfMissing(lead);

    res.json(lead);
  } catch (error) {
    console.error('Error fetching CRM lead:', error);
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
};

const createLead = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      course,
      source,
      status,
      followUpDate,
      leadOwner,
      assignedUsers,
      stage: providedStage,
      pipelineType = 'course',
      ...rest
    } = req.body;

    const resolvedLeadOwner = leadOwner || req.user?._id;
    const assignedUsersInput = Array.isArray(assignedUsers) ? assignedUsers.filter(Boolean) : [];
    const combinedAssigned = new Set(assignedUsersInput.map((id) => id.toString()));
    if (resolvedLeadOwner) {
      combinedAssigned.add(resolvedLeadOwner.toString());
    }
    const assignedUsersFinal = Array.from(combinedAssigned);

    const interestedPrograms = Array.isArray(rest.interestedProgramType)
      ? rest.interestedProgramType.filter(Boolean)
      : rest.interestedProgramType
        ? [rest.interestedProgramType].filter(Boolean)
        : [];
    delete rest.interestedProgramType;

    const domainInterests = Array.isArray(rest.domainInterests)
      ? rest.domainInterests.filter(Boolean)
      : rest.domainInterests
        ? [rest.domainInterests].filter(Boolean)
        : [];
    delete rest.domainInterests;

    const projectCategory = Array.isArray(rest.projectCategory)
      ? rest.projectCategory.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectCategory
        ? [rest.projectCategory].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectCategory;

    const projectKeyFeatures = Array.isArray(rest.projectKeyFeatures)
      ? rest.projectKeyFeatures.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectKeyFeatures
        ? [rest.projectKeyFeatures].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectKeyFeatures;

    const projectPreferredTechStack = Array.isArray(rest.projectPreferredTechStack)
      ? rest.projectPreferredTechStack.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectPreferredTechStack
        ? [rest.projectPreferredTechStack].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectPreferredTechStack;

    const projectSupportType = Array.isArray(rest.projectSupportType)
      ? rest.projectSupportType.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectSupportType
        ? [rest.projectSupportType].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectSupportType;

    const projectAssignedTeam = Array.isArray(rest.projectAssignedTeam)
      ? rest.projectAssignedTeam.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectAssignedTeam
        ? [rest.projectAssignedTeam].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectAssignedTeam;

    const projectAttachments = Array.isArray(rest.projectAttachments)
      ? rest.projectAttachments.filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
      : rest.projectAttachments
        ? [rest.projectAttachments].filter(Boolean).map((value) => (typeof value === 'string' ? value.trim() : value))
        : [];
    delete rest.projectAttachments;

    const documentsPayload = rest.documents && typeof rest.documents === 'object'
      ? {
          resumeUrl: rest.documents.resumeUrl || '',
          idProofUrl: rest.documents.idProofUrl || '',
          requirementDocUrl: rest.documents.requirementDocUrl || '',
          studentPhotoUrl: rest.documents.studentPhotoUrl || '',
          addressProofUrl: rest.documents.addressProofUrl || '',
          projectProposalUrl: rest.documents.projectProposalUrl || '',
          projectDocumentationUrl: rest.documents.projectDocumentationUrl || '',
        }
      : {
          resumeUrl: rest.resumeUrl || '',
          idProofUrl: rest.idProofUrl || '',
          requirementDocUrl: rest.requirementDocUrl || '',
          studentPhotoUrl: rest.studentPhotoUrl || '',
          addressProofUrl: rest.addressProofUrl || '',
          projectProposalUrl: rest.projectProposalUrl || '',
          projectDocumentationUrl: rest.projectDocumentationUrl || '',
        };
    delete rest.documents;
    delete rest.resumeUrl;
    delete rest.idProofUrl;
    delete rest.requirementDocUrl;
    delete rest.studentPhotoUrl;
    delete rest.addressProofUrl;
    delete rest.projectProposalUrl;
    delete rest.projectDocumentationUrl;

    rest.projectProposalDocumentUrl = documentsPayload.projectProposalUrl || '';
    rest.projectDocumentationUrl = documentsPayload.projectDocumentationUrl || '';
    rest.projectClientName = rest.projectClientName ? rest.projectClientName.trim() : fullName.trim();
    rest.projectCompanyName = rest.projectCompanyName ? rest.projectCompanyName.trim() : '';
    rest.projectWebsiteUrl = rest.projectWebsiteUrl ? rest.projectWebsiteUrl.trim() : '';
    rest.projectBudgetExpectation = rest.projectBudgetExpectation ? rest.projectBudgetExpectation.trim() : '';
    rest.projectDecisionMakerName = rest.projectDecisionMakerName ? rest.projectDecisionMakerName.trim() : '';
    rest.projectExistingSystemDetails = rest.projectExistingSystemDetails ? rest.projectExistingSystemDetails.trim() : '';
    rest.projectFilesUrl = rest.projectFilesUrl ? rest.projectFilesUrl.trim() : '';
    rest.projectVersionControlLink = rest.projectVersionControlLink ? rest.projectVersionControlLink.trim() : '';
    rest.projectMeetingNotes = rest.projectMeetingNotes ? rest.projectMeetingNotes.trim() : '';
    rest.projectClientFeedback = rest.projectClientFeedback ? rest.projectClientFeedback.trim() : '';
    rest.projectInternalNotes = rest.projectInternalNotes ? rest.projectInternalNotes.trim() : '';
    rest.projectClientNotes = rest.projectClientNotes ? rest.projectClientNotes.trim() : '';

    if (rest.age !== undefined && rest.age !== null && rest.age !== '') {
      rest.age = Number(rest.age);
    } else {
      delete rest.age;
    }

    if (rest.certificateNeeded !== undefined) {
      rest.certificateNeeded = Boolean(rest.certificateNeeded);
    }

    const booleanFields = ['courseDemoCompleted', 'courseInvoiceUploaded', 'courseFollowUpRequired', 'courseCertificateIssued', 'projectExistingSystem', 'projectAdvancePaid'];
    booleanFields.forEach((field) => {
      if (rest[field] !== undefined) {
        rest[field] = typeof rest[field] === 'string'
          ? ['true', '1', 'yes', 'on'].includes(rest[field].toLowerCase())
          : Boolean(rest[field]);
      }
    });

    const numberFields = ['courseFee', 'courseDiscountApplied', 'courseFinalFeePayable', 'projectStakeholdersCount', 'projectProposalAmount', 'projectMaintenanceFee'];
    numberFields.forEach((field) => {
      if (rest[field] !== undefined && rest[field] !== null && rest[field] !== '') {
        rest[field] = Number(rest[field]);
      }
    });

    const leadCode = await generateLeadCode(pipelineType);

    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'Lead name is required' });
    }

    if (!phone?.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const stages = await ensureDefaultStages(pipelineType, req.user?._id);
    let stageId = providedStage;

    if (!stageId) {
      stageId = stages?.[0]?._id;
    }

    if (!stageId) {
      return res.status(400).json({ message: 'No stage available for this pipeline' });
    }

    const stageLeadCount = await CRMLead.countDocuments({ stage: stageId });

    const lead = await CRMLead.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email,
      course,
      source,
      status,
      followUpDate,
      leadOwner: resolvedLeadOwner,
      assignedUsers: assignedUsersFinal,
      interestedProgramType: interestedPrograms,
      domainInterests,
      projectCategory,
      projectKeyFeatures,
      projectPreferredTechStack,
      projectSupportType,
      projectAssignedTeam,
      documents: documentsPayload,
      projectAttachments,
      pipelineType,
      leadCode,
      stage: stageId,
      stagePosition: stageLeadCount,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
      ...rest,
    });

    await CRMLead.findByIdAndUpdate(lead._id, {
      $push: {
        stageHistory: {
          stage: stageId,
          movedAt: new Date(),
          movedBy: req.user?._id,
          note: 'Lead created',
        },
      },
    });

    const populatedLead = await CRMLead.findById(lead._id)
      .populate('stage')
      .populate('leadOwner', 'name email phone profilePic')
      .populate('assignedUsers', 'name email phone profilePic')
      .populate('createdBy', 'name email phone profilePic');

    await assignLeadCodeIfMissing(populatedLead);

    res.status(201).json(populatedLead);
  } catch (error) {
    console.error('Error creating CRM lead:', error);
    res.status(500).json({ message: 'Failed to create lead' });
  }
};

const updateLead = async (req, res) => {
  try {
     const { id } = req.params;
    const updates = { ...req.body };

    const lead = await CRMLead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const previousStageId = lead.stage?.toString();
    let stageChanged = false;

    if (typeof updates.fullName === 'string') {
      lead.fullName = updates.fullName.trim();
    }

    if (typeof updates.phone === 'string') {
      lead.phone = updates.phone.trim();
    }

    if (typeof updates.email === 'string') {
      lead.email = updates.email.trim().toLowerCase();
    }

    const allowedFields = ['course', 'source', 'status', 'followUpDate', 'leadOwner', 'notes', 'tags', 'enrollmentValue', 'preferredBatch', 'experienceLevel', 'currentStatus', 'pipelineType', 'alternatePhone', 'specialization', 'assignedUsers', 'leadSource', 'enquiryDate', 'gender', 'age', 'city', 'address', 'profileType', 'educationQualification', 'currentStatusDetail', 'organizationName', 'interestedProgramType', 'domainInterests', 'trainingMode', 'durationRequired', 'preferredStartDate', 'urgencyLevel', 'interestLevel', 'budgetExpectation', 'decisionMaker', 'followUpNotes', 'lastContactedDate', 'communicationType', 'documents', 'paymentStatus', 'programBatch', 'certificateNeeded', 'finalRemarks', 'dateOfBirth', 'courseSelected', 'courseProgramType', 'courseMode', 'courseBatchType', 'courseBatchTimeSlot', 'courseDuration', 'courseStartDate', 'courseDemoCompleted', 'courseTrainerAssigned', 'courseFee', 'courseDiscountApplied', 'courseFinalFeePayable', 'coursePaymentMethod', 'coursePaymentStatus', 'courseTransactionId', 'courseInvoiceUploaded', 'courseEmiDetails', 'courseCounselorAssigned', 'courseEnrollmentNotes', 'courseFollowUpRequired', 'courseNextFollowUpDate', 'courseCompletionStatus', 'courseCertificateIssued', 'courseCertificateId', 'courseCertificateIssueDate', 'courseTrainerNotes', 'projectClientName', 'projectCompanyName', 'projectWebsiteUrl', 'projectClientType', 'projectIndustryType', 'projectAnnualBudgetRange', 'projectCategory', 'projectName', 'projectDescription', 'projectKeyFeatures', 'projectUrgency', 'projectTimelineExpectation', 'projectBudgetExpectation', 'projectPreferredTechStack', 'projectHostingPreference', 'projectExistingSystem', 'projectExistingSystemDetails', 'projectFilesUrl', 'projectLeadStage', 'projectInterestLevel', 'projectDecisionMakerName', 'projectStakeholdersCount', 'projectProposalAmount', 'projectProposalDocumentUrl', 'projectPaymentTerms', 'projectAdvancePaid', 'projectPaymentStatus', 'projectStatus', 'projectAssignedTeam', 'projectStartDate', 'projectDeadline', 'projectDeliveryDate', 'projectVersionControlLink', 'projectDocumentationUrl', 'projectCommunicationMode', 'projectMeetingNotes', 'projectClientFeedback', 'projectSupportType', 'projectSupportExpiryDate', 'projectMaintenanceFee', 'projectInternalNotes', 'projectClientNotes', 'projectAttachments'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        lead[field] = updates[field];
      }
    });

    if (updates.leadOwner !== undefined) {
      lead.leadOwner = updates.leadOwner || null;
    }

    if (Array.isArray(updates.interestedProgramType)) {
      lead.interestedProgramType = updates.interestedProgramType.filter(Boolean);
    }

    if (Array.isArray(updates.domainInterests)) {
      lead.domainInterests = updates.domainInterests.filter(Boolean);
    }

    if (Array.isArray(updates.projectCategory)) {
      lead.projectCategory = updates.projectCategory.filter(Boolean);
    }

    if (Array.isArray(updates.projectKeyFeatures)) {
      lead.projectKeyFeatures = updates.projectKeyFeatures.filter(Boolean);
    }

    if (Array.isArray(updates.projectPreferredTechStack)) {
      lead.projectPreferredTechStack = updates.projectPreferredTechStack.filter(Boolean);
    }

    if (Array.isArray(updates.projectSupportType)) {
      lead.projectSupportType = updates.projectSupportType.filter(Boolean);
    }

    if (Array.isArray(updates.projectAssignedTeam)) {
      lead.projectAssignedTeam = updates.projectAssignedTeam.filter(Boolean);
    }

    if (updates.projectAttachments !== undefined) {
      if (Array.isArray(updates.projectAttachments)) {
        lead.projectAttachments = updates.projectAttachments
          .filter(Boolean)
          .map((value) => (typeof value === 'string' ? value.trim() : value));
      } else if (updates.projectAttachments) {
        lead.projectAttachments = [
          typeof updates.projectAttachments === 'string'
            ? updates.projectAttachments.trim()
            : updates.projectAttachments,
        ];
      } else {
        lead.projectAttachments = [];
      }
    }

    if (updates.documents && typeof updates.documents === 'object') {
      lead.documents = {
        resumeUrl: updates.documents.resumeUrl || '',
        idProofUrl: updates.documents.idProofUrl || '',
        requirementDocUrl: updates.documents.requirementDocUrl || '',
        studentPhotoUrl: updates.documents.studentPhotoUrl || '',
        addressProofUrl: updates.documents.addressProofUrl || '',
        projectProposalUrl: updates.documents.projectProposalUrl || '',
        projectDocumentationUrl: updates.documents.projectDocumentationUrl || '',
      };
    }

    if (updates.age !== undefined && updates.age !== null && updates.age !== '') {
      lead.age = Number(updates.age);
    }

    if (updates.certificateNeeded !== undefined) {
      lead.certificateNeeded = Boolean(updates.certificateNeeded);
    }

    if (updates.courseFee !== undefined && updates.courseFee !== null && updates.courseFee !== '') {
      lead.courseFee = Number(updates.courseFee);
    }

    if (updates.courseDiscountApplied !== undefined && updates.courseDiscountApplied !== null && updates.courseDiscountApplied !== '') {
      lead.courseDiscountApplied = Number(updates.courseDiscountApplied);
    }

    if (updates.courseFinalFeePayable !== undefined && updates.courseFinalFeePayable !== null && updates.courseFinalFeePayable !== '') {
      lead.courseFinalFeePayable = Number(updates.courseFinalFeePayable);
    }

    if (updates.projectStakeholdersCount !== undefined && updates.projectStakeholdersCount !== null && updates.projectStakeholdersCount !== '') {
      lead.projectStakeholdersCount = Number(updates.projectStakeholdersCount);
    }

    if (updates.projectProposalAmount !== undefined && updates.projectProposalAmount !== null && updates.projectProposalAmount !== '') {
      lead.projectProposalAmount = Number(updates.projectProposalAmount);
    }

    if (updates.projectMaintenanceFee !== undefined && updates.projectMaintenanceFee !== null && updates.projectMaintenanceFee !== '') {
      lead.projectMaintenanceFee = Number(updates.projectMaintenanceFee);
    }

    let assignedSet = new Set((lead.assignedUsers || []).map((id) => id.toString()));
    if (updates.assignedUsers !== undefined) {
      const incoming = Array.isArray(updates.assignedUsers) ? updates.assignedUsers.filter(Boolean) : [];
      assignedSet = new Set(incoming.map((id) => id.toString()));
    }

    const ownerId = lead.leadOwner ? lead.leadOwner.toString() : null;
    if (ownerId) {
      assignedSet.add(ownerId);
    }

    lead.assignedUsers = Array.from(assignedSet);

    if (updates.stage && updates.stage !== previousStageId) {
      const targetStage = await CRMStage.findById(updates.stage);
      if (!targetStage || targetStage.isArchived) {
        return res.status(404).json({ message: 'Target stage not found' });
      }

      lead.stage = updates.stage;
      const stageLeadCount = await CRMLead.countDocuments({ stage: updates.stage, _id: { $ne: id } });
      lead.stagePosition = stageLeadCount;
      stageChanged = true;

      await CRMLead.findByIdAndUpdate(id, {
        $push: {
          stageHistory: {
            stage: updates.stage,
            movedAt: new Date(),
            movedBy: req.user?._id,
            note: updates.stageChangeNote || 'Stage updated',
          },
        },
      });
    }

    lead.updatedBy = req.user?._id;
    await lead.save();

    if (stageChanged) {
      if (previousStageId) {
        await normalizeStagePositions(previousStageId);
      }
      await normalizeStagePositions(lead.stage);
    }

    const populated = await CRMLead.findById(id)
      .populate('stage')
      .populate('leadOwner', 'name email phone profilePic')
      .populate('assignedUsers', 'name email phone profilePic')
      .populate('createdBy', 'name email phone profilePic');

    await assignLeadCodeIfMissing(populated);

    res.json(populated);
  } catch (error) {
    console.error('Error updating CRM lead:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
};

const moveLead = async (req, res) => {
  try {
     const { id } = req.params;
    const { stageId, note, position } = req.body;
 
     const lead = await CRMLead.findById(id);
     if (!lead) {
       return res.status(404).json({ message: 'Lead not found' });
     }
 
    const currentStageId = lead.stage?.toString();
    const targetStageId = stageId || currentStageId;

    const stage = await CRMStage.findById(targetStageId);
    if (!stage || stage.isArchived) {
      return res.status(404).json({ message: 'Target stage not found' });
    }

    lead.stage = targetStageId;
    lead.stagePosition = typeof position === 'number' ? position : Number.MAX_SAFE_INTEGER;
    lead.updatedBy = req.user?._id;
    await lead.save();

    await CRMLead.findByIdAndUpdate(id, {
      $push: {
        stageHistory: {
          stage: targetStageId,
          movedAt: new Date(),
          movedBy: req.user?._id,
          note,
        },
      },
    });

    if (currentStageId && currentStageId !== targetStageId.toString()) {
      await normalizeStagePositions(currentStageId);
    }

    await reorderStageWithLead(targetStageId, lead._id, typeof position === 'number' ? position : undefined);

    const populatedLead = await CRMLead.findById(id)
      .populate('stage')
      .populate('leadOwner', 'name email phone profilePic')
      .populate('assignedUsers', 'name email phone profilePic')
      .populate('createdBy', 'name email phone profilePic');

    await assignLeadCodeIfMissing(populatedLead);

    res.json(populatedLead);
  } catch (error) {
    console.error('Error moving CRM lead:', error);
    res.status(500).json({ message: 'Failed to move lead' });
  }
};

const deleteLead = async (req, res) => {
  try {
     const { id } = req.params;
     const lead = await CRMLead.findById(id);
     if (!lead) {
       return res.status(404).json({ message: 'Lead not found' });
     }
 
    const stageId = lead.stage?.toString();
    await CRMLead.deleteOne({ _id: id });

    if (stageId) {
      await normalizeStagePositions(stageId);
    }
 
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting CRM lead:', error);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
};

module.exports = {
  getStages,
  createStage,
  updateStage,
  deleteStage,
  reorderStages,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  moveLead,
  deleteLead,
};
