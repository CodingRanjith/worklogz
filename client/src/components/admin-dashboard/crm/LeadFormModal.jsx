import React, { useEffect, useState } from 'react';
import { FiX, FiSave, FiUsers } from 'react-icons/fi';

const defaultForm = {
  fullName: '',
  phone: '',
  email: '',
  course: '',
  source: '',
  stage: '',
  status: 'new',
  followUpDate: '',
  notes: '',
  tags: '',
  enrollmentValue: '',
  preferredBatch: '',
  experienceLevel: '',
  currentStatus: '',
  specialization: '',
  alternatePhone: '',
  assignedUsers: [],
  leadSource: '',
  enquiryDate: '',
  gender: '',
  age: '',
  dateOfBirth: '',
  city: '',
  address: '',
  profileType: '',
  educationQualification: '',
  currentStatusDetail: '',
  organizationName: '',
  interestedProgramType: [],
  domainInterests: [],
  trainingMode: '',
  durationRequired: '',
  preferredStartDate: '',
  urgencyLevel: '',
  interestLevel: '',
  budgetExpectation: '',
  decisionMaker: '',
  followUpNotes: '',
  lastContactedDate: '',
  communicationType: '',
  resumeUrl: '',
  idProofUrl: '',
  requirementDocUrl: '',
  studentPhotoUrl: '',
  addressProofUrl: '',
  paymentStatus: '',
  programBatch: '',
  certificateNeeded: false,
  finalRemarks: '',
  projectClientName: '',
  projectCompanyName: '',
  projectWebsiteUrl: '',
  projectClientType: '',
  projectIndustryType: '',
  projectAnnualBudgetRange: '',
  projectCategory: [],
  projectName: '',
  projectDescription: '',
  projectKeyFeatures: [],
  projectUrgency: '',
  projectTimelineExpectation: '',
  projectBudgetExpectation: '',
  projectPreferredTechStack: [],
  projectHostingPreference: '',
  projectExistingSystem: false,
  projectExistingSystemDetails: '',
  projectFilesUrl: '',
  projectLeadStage: '',
  projectInterestLevel: '',
  projectDecisionMakerName: '',
  projectStakeholdersCount: '',
  projectProposalAmount: '',
  projectProposalDocumentUrl: '',
  projectPaymentTerms: '',
  projectAdvancePaid: false,
  projectPaymentStatus: '',
  projectStatus: '',
  projectAssignedTeam: [],
  projectStartDate: '',
  projectDeadline: '',
  projectDeliveryDate: '',
  projectVersionControlLink: '',
  projectDocumentationUrl: '',
  projectCommunicationMode: '',
  projectMeetingNotes: '',
  projectClientFeedback: '',
  projectSupportType: [],
  projectSupportExpiryDate: '',
  projectMaintenanceFee: '',
  projectInternalNotes: '',
  projectClientNotes: '',
  projectAttachments: [],
  courseSelected: '',
  courseProgramType: '',
  courseMode: '',
  courseBatchType: '',
  courseBatchTimeSlot: '',
  courseDuration: '',
  courseStartDate: '',
  courseDemoCompleted: false,
  courseTrainerAssigned: '',
  courseFee: '',
  courseDiscountApplied: '',
  courseFinalFeePayable: '',
  coursePaymentMethod: '',
  coursePaymentStatus: '',
  courseTransactionId: '',
  courseInvoiceUploaded: false,
  courseEmiDetails: '',
  courseCounselorAssigned: '',
  courseEnrollmentNotes: '',
  courseFollowUpRequired: false,
  courseNextFollowUpDate: '',
  courseCompletionStatus: '',
  courseCertificateIssued: false,
  courseCertificateId: '',
  courseCertificateIssueDate: '',
  courseTrainerNotes: '',
};

const LEAD_SOURCES = ['Instagram', 'WhatsApp', 'Website', 'Referral', 'Google Ads', 'Walk-in'];
const GENDERS = ['Male', 'Female', 'Other'];
const PROFILE_TYPES = ['Student', 'Working Professional', 'Job Seeker', 'Freelancer', 'Business Owner'];
const EDUCATION_LEVELS = ['HSC', 'Diploma', 'UG', 'PG', 'Certifications', 'Not Applicable'];
const CURRENT_STATUS_OPTIONS = ['Studying', 'Employed', 'Unemployed', 'Self-employed'];
const EXPERIENCE_LEVELS = ['Fresher', '0-1 year', '1-3 years', '3+ years'];
const PROGRAM_TYPES = ['Internship', 'Training', 'Workshop', 'Certification', 'Project Support', 'Placement Support', 'Other'];
const PROGRAM_TYPE_OPTIONS = PROGRAM_TYPES.filter((option) => option !== 'Other');
const DOMAIN_OPTIONS = ['Web Development', 'App Development', 'Full Stack', 'Data Science', 'Cybersecurity', 'AI-ML', 'UI-UX', 'Cloud', 'DevOps', 'IOT', 'Blockchain', 'Other'];
const DOMAIN_OPTION_LIST = DOMAIN_OPTIONS.filter((option) => option !== 'Other');
const TRAINING_MODES = ['Online', 'Offline', 'Hybrid'];
const DURATION_OPTIONS = ['15 Days', '1 Month', '3 Months', '6 Months', 'Flexible'];
const URGENCY_OPTIONS = ['High', 'Medium', 'Low'];
const INTEREST_LEVELS = ['Hot', 'Warm', 'Cold'];
const DECISION_MAKERS = ['Self', 'Parent', 'HR', 'Manager'];
const COMMUNICATION_TYPES = ['Call', 'WhatsApp', 'Email', 'In-person', 'Video Call'];
const PAYMENT_STATUS_OPTIONS = ['Paid', 'Partial', 'Pending', 'Not Paid'];

const COURSE_PROGRAM_TYPES = ['Training', 'Internship + Training', 'Certification', 'Workshop', 'Project Support', 'Placement Program'];
const COURSE_MODE_OPTIONS = ['Online', 'Offline', 'Hybrid'];
const COURSE_BATCH_TYPES = ['Weekday', 'Weekend', 'Fast-track'];
const COURSE_PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'EMI'];
const PROJECT_CLIENT_TYPES = ['Individual', 'Startup', 'Small Business', 'Enterprise', 'Internal Project'];
const PROJECT_INDUSTRY_TYPES = ['Education', 'Finance', 'Health', 'Ecommerce', 'SAAS', 'Real Estate', 'Logistics', 'Technology'];
const PROJECT_LEAD_STAGES = ['Enquiry', 'Requirement Collected', 'Proposal Sent', 'Negotiation', 'Closed / Won', 'Closed / Lost', 'On Hold'];
const PROJECT_STATUS_OPTIONS = ['Not Started', 'In Progress', 'Under Review', 'Testing', 'Completed', 'Delivered', 'Support'];
const PROJECT_PAYMENT_STATUS = ['Paid', 'Partial', 'Pending'];
const PROJECT_PAYMENT_TERMS = ['Advance', 'Milestone-based', 'One-time'];
const PROJECT_SUPPORT_TYPES = ['Bug Fixing', 'AMC', 'Feature Update', 'Hosting Support', 'Maintenance'];
const HOSTING_PREFERENCE_OPTIONS = ['AWS', 'Azure', 'GCP', 'Hostinger', 'Local Server', 'Not Decided'];
const PROJECT_TIMELINE_OPTIONS = ['1 Week', '1 Month', '2-3 Months', '6 Months', 'Flexible'];
const PROJECT_CATEGORY_OPTIONS = ['Website', 'Web Application', 'Mobile App', 'Ecommerce', 'CRM', 'ERP', 'AI / ML', 'Automation', 'API Integration', 'SaaS Product', 'Cloud Deployment'];
const PROJECT_TECH_STACK_OPTIONS = ['React', 'Node', 'Flutter', 'Python', 'PHP', 'Laravel', 'MERN', 'Next.js', 'Django'];
const PROJECT_COMMUNICATION_MODES = ['Call', 'WhatsApp', 'Email', 'Meeting', 'Zoom'];
const PROJECT_ASSIGNED_ROLES = ['Developer', 'Designer', 'QA', 'Project Manager'];

const SINGLE_SELECT_FIELDS = {
  leadSource: LEAD_SOURCES,
  profileType: PROFILE_TYPES,
  educationQualification: EDUCATION_LEVELS,
  currentStatusDetail: CURRENT_STATUS_OPTIONS,
  experienceLevel: EXPERIENCE_LEVELS,
  trainingMode: TRAINING_MODES,
  durationRequired: DURATION_OPTIONS,
  urgencyLevel: URGENCY_OPTIONS,
  interestLevel: INTEREST_LEVELS,
  decisionMaker: DECISION_MAKERS,
  communicationType: COMMUNICATION_TYPES,
  paymentStatus: PAYMENT_STATUS_OPTIONS,
  courseProgramType: COURSE_PROGRAM_TYPES,
  courseMode: COURSE_MODE_OPTIONS,
  courseBatchType: COURSE_BATCH_TYPES,
  coursePaymentMethod: COURSE_PAYMENT_METHODS,
  coursePaymentStatus: PAYMENT_STATUS_OPTIONS,
  projectClientType: PROJECT_CLIENT_TYPES,
  projectIndustryType: PROJECT_INDUSTRY_TYPES,
  projectUrgency: URGENCY_OPTIONS,
  projectTimelineExpectation: PROJECT_TIMELINE_OPTIONS,
  projectLeadStage: PROJECT_LEAD_STAGES,
  projectInterestLevel: INTEREST_LEVELS,
  projectPaymentTerms: PROJECT_PAYMENT_TERMS,
  projectPaymentStatus: PROJECT_PAYMENT_STATUS,
  projectStatus: PROJECT_STATUS_OPTIONS,
  projectHostingPreference: HOSTING_PREFERENCE_OPTIONS,
  projectCommunicationMode: PROJECT_COMMUNICATION_MODES,
};

const normalizeValue = (value = '') => value.trim();
const equalsIgnoreCase = (a = '', b = '') => normalizeValue(a).toLowerCase() === normalizeValue(b).toLowerCase();

const LeadFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  stages,
  pipelineType,
  initialData = null,
  loading = false,
  users = [],
  usersLoading = false,
}) => {
  const [formState, setFormState] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [customSelect, setCustomSelect] = useState({});
  const [customProgramInput, setCustomProgramInput] = useState('');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [customTechInput, setCustomTechInput] = useState('');
  const [customSupportInput, setCustomSupportInput] = useState('');
  const [customTeamInput, setCustomTeamInput] = useState('');
  const [customAttachmentInput, setCustomAttachmentInput] = useState('');

  const isCoursePipeline = pipelineType === 'course';
  const isInternshipPipeline = pipelineType === 'internship';
  const isITProjectPipeline = pipelineType === 'it-project';

  useEffect(() => {
    if (initialData) {
      const mergedFinalRemarks = initialData.finalRemarks || initialData.notes || '';
      setFormState({
        ...defaultForm,
        ...initialData,
        followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        stage: initialData.stage?._id || initialData.stage || '',
        assignedUsers: initialData.assignedUsers
          ? initialData.assignedUsers.map((user) => user._id || user).filter(Boolean)
          : [],
        interestedProgramType: Array.isArray(initialData.interestedProgramType)
          ? initialData.interestedProgramType
          : [],
        domainInterests: Array.isArray(initialData.domainInterests)
          ? initialData.domainInterests
          : [],
        enquiryDate: initialData.enquiryDate
          ? new Date(initialData.enquiryDate).toISOString().split('T')[0]
          : '',
        preferredStartDate: initialData.preferredStartDate
          ? new Date(initialData.preferredStartDate).toISOString().split('T')[0]
          : '',
        lastContactedDate: initialData.lastContactedDate
          ? new Date(initialData.lastContactedDate).toISOString().split('T')[0]
          : '',
        resumeUrl: initialData.documents?.resumeUrl || '',
        idProofUrl: initialData.documents?.idProofUrl || '',
        requirementDocUrl: initialData.documents?.requirementDocUrl || '',
        studentPhotoUrl: initialData.documents?.studentPhotoUrl || '',
        addressProofUrl: initialData.documents?.addressProofUrl || '',
        projectProposalDocumentUrl: initialData.projectProposalDocumentUrl || initialData.documents?.projectProposalUrl || '',
        projectDocumentationUrl: initialData.documents?.projectDocumentationUrl || initialData.projectDocumentationUrl || '',
        age: initialData.age ?? '',
        certificateNeeded: Boolean(initialData.certificateNeeded),
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
          : '',
        courseStartDate: initialData.courseStartDate
          ? new Date(initialData.courseStartDate).toISOString().split('T')[0]
          : '',
        courseDemoCompleted: Boolean(initialData.courseDemoCompleted),
        courseInvoiceUploaded: Boolean(initialData.courseInvoiceUploaded),
        courseFollowUpRequired: Boolean(initialData.courseFollowUpRequired),
        courseCertificateIssued: Boolean(initialData.courseCertificateIssued),
        courseNextFollowUpDate: initialData.courseNextFollowUpDate
          ? new Date(initialData.courseNextFollowUpDate).toISOString().split('T')[0]
          : '',
        courseCertificateIssueDate: initialData.courseCertificateIssueDate
          ? new Date(initialData.courseCertificateIssueDate).toISOString().split('T')[0]
          : '',
        courseFee: initialData.courseFee ?? '',
        courseDiscountApplied: initialData.courseDiscountApplied ?? '',
        courseFinalFeePayable: initialData.courseFinalFeePayable ?? '',
        projectCategory: Array.isArray(initialData.projectCategory)
          ? initialData.projectCategory
          : initialData.projectCategory
            ? [initialData.projectCategory]
            : [],
        projectKeyFeatures: Array.isArray(initialData.projectKeyFeatures)
          ? initialData.projectKeyFeatures
          : initialData.projectKeyFeatures
            ? [initialData.projectKeyFeatures]
            : [],
        projectPreferredTechStack: Array.isArray(initialData.projectPreferredTechStack)
          ? initialData.projectPreferredTechStack
          : initialData.projectPreferredTechStack
            ? [initialData.projectPreferredTechStack]
            : [],
        projectSupportType: Array.isArray(initialData.projectSupportType)
          ? initialData.projectSupportType
          : initialData.projectSupportType
            ? [initialData.projectSupportType]
            : [],
        projectAssignedTeam: Array.isArray(initialData.projectAssignedTeam)
          ? initialData.projectAssignedTeam
          : initialData.projectAssignedTeam
            ? [initialData.projectAssignedTeam]
            : [],
        projectExistingSystem: Boolean(initialData.projectExistingSystem),
        projectAdvancePaid: Boolean(initialData.projectAdvancePaid),
        projectStakeholdersCount: initialData.projectStakeholdersCount ?? '',
        projectProposalAmount: initialData.projectProposalAmount ?? '',
        projectMaintenanceFee: initialData.projectMaintenanceFee ?? '',
        projectStartDate: initialData.projectStartDate
          ? new Date(initialData.projectStartDate).toISOString().split('T')[0]
          : '',
        projectDeadline: initialData.projectDeadline
          ? new Date(initialData.projectDeadline).toISOString().split('T')[0]
          : '',
        projectDeliveryDate: initialData.projectDeliveryDate
          ? new Date(initialData.projectDeliveryDate).toISOString().split('T')[0]
          : '',
        projectSupportExpiryDate: initialData.projectSupportExpiryDate
          ? new Date(initialData.projectSupportExpiryDate).toISOString().split('T')[0]
          : '',
        projectAttachments: Array.isArray(initialData.projectAttachments)
          ? initialData.projectAttachments
          : initialData.projectAttachments
            ? [initialData.projectAttachments]
            : [],
      });

      const initialCustomSelect = {};
      Object.entries(SINGLE_SELECT_FIELDS).forEach(([field, options]) => {
        const value = initialData[field];
        if (value && !options.some((option) => equalsIgnoreCase(option, value))) {
          initialCustomSelect[field] = true;
        }
      });
      setCustomSelect(initialCustomSelect);
    } else {
      setFormState({
        ...defaultForm,
        stage: stages?.[0]?._id || '',
        assignedUsers: [],
      });
      setCustomSelect({});
    }
    setCustomProgramInput('');
    setCustomDomainInput('');
    setCustomCategoryInput('');
    setCustomFeatureInput('');
    setCustomTechInput('');
    setCustomSupportInput('');
    setCustomTeamInput('');
    setCustomAttachmentInput('');
  }, [initialData, stages]);

  const validate = () => {
    const newErrors = {};
    if (!formState.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formState.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formState.stage) {
      newErrors.stage = 'Stage is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'finalRemarks' ? { notes: value } : {}),
    }));
  };

  const handleAssignedToggle = (userId) => {
    setFormState((prev) => {
      const exists = prev.assignedUsers.includes(userId);
      const assignedUsers = exists
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId];
      return { ...prev, assignedUsers };
    });
  };

  const toggleMultiValue = (field, value) => {
    const normalized = normalizeValue(value);
    if (!normalized) return;
    setFormState((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.some((item) => equalsIgnoreCase(item, normalized));
      const next = exists
        ? current.filter((item) => !equalsIgnoreCase(item, normalized))
        : [...current, normalized];
      return { ...prev, [field]: next };
    });
  };

  const removeMultiValue = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: (Array.isArray(prev[field]) ? prev[field] : []).filter((item) => !equalsIgnoreCase(item, value)),
    }));
  };

  const addCustomMultiOption = (field, inputValue, presetOptions) => {
    const normalized = normalizeValue(inputValue);
    if (!normalized) return;
    const presetMatch = presetOptions.find((option) => equalsIgnoreCase(option, normalized));
    const valueToAdd = presetMatch || normalized;
    setFormState((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      if (current.some((item) => equalsIgnoreCase(item, valueToAdd))) {
        return prev;
      }
      return { ...prev, [field]: [...current, valueToAdd] };
    });
  };

  const handleBooleanChange = (field, checked) => {
    setFormState((prev) => ({ ...prev, [field]: checked }));
  };

  const renderSelectWithCustom = (field, label, options, placeholder = 'Select option') => {
    const value = formState[field] || '';
    const optionsMatch = options.some((option) => equalsIgnoreCase(option, value));
    const isCustom = customSelect[field] || (!!value && !optionsMatch);
    const selectValue = optionsMatch ? options.find((option) => equalsIgnoreCase(option, value)) : (isCustom ? 'Other' : '');

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          value={selectValue}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected === 'Other') {
              setCustomSelect((prev) => ({ ...prev, [field]: true }));
              handleChange(field, value && !optionsMatch ? value : '');
            } else if (selected === '') {
              setCustomSelect((prev) => ({ ...prev, [field]: false }));
              handleChange(field, '');
            } else {
              setCustomSelect((prev) => ({ ...prev, [field]: false }));
              handleChange(field, selected);
            }
          }}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
          <option value="Other">Other</option>
        </select>
        {isCustom && (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formState,
      pipelineType,
      tags: formState.tags
        ? formState.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
      enrollmentValue: formState.enrollmentValue ? Number(formState.enrollmentValue) : undefined,
      age: formState.age ? Number(formState.age) : undefined,
      assignedUsers: formState.assignedUsers,
      interestedProgramType: (formState.interestedProgramType || []).filter(Boolean),
      domainInterests: (formState.domainInterests || []).filter(Boolean),
      projectCategory: (formState.projectCategory || []).filter(Boolean),
      projectKeyFeatures: (formState.projectKeyFeatures || []).filter(Boolean),
      projectPreferredTechStack: (formState.projectPreferredTechStack || []).filter(Boolean),
      projectSupportType: (formState.projectSupportType || []).filter(Boolean),
      projectAssignedTeam: (formState.projectAssignedTeam || []).filter(Boolean),
      projectAttachments: (formState.projectAttachments || []).filter(Boolean),
      documents: {
        resumeUrl: formState.resumeUrl ? formState.resumeUrl.trim() : '',
        idProofUrl: formState.idProofUrl ? formState.idProofUrl.trim() : '',
        requirementDocUrl: formState.requirementDocUrl ? formState.requirementDocUrl.trim() : '',
        studentPhotoUrl: formState.studentPhotoUrl ? formState.studentPhotoUrl.trim() : '',
        addressProofUrl: formState.addressProofUrl ? formState.addressProofUrl.trim() : '',
        projectProposalUrl: formState.projectProposalDocumentUrl ? formState.projectProposalDocumentUrl.trim() : '',
        projectDocumentationUrl: formState.projectDocumentationUrl ? formState.projectDocumentationUrl.trim() : '',
      },
      certificateNeeded: Boolean(formState.certificateNeeded),
    };

    delete payload.resumeUrl;
    delete payload.idProofUrl;
    delete payload.requirementDocUrl;
    delete payload.studentPhotoUrl;
    delete payload.addressProofUrl;

    payload.projectClientName = formState.projectClientName || formState.projectCompanyName || formState.fullName;
    payload.projectCompanyName = formState.projectCompanyName;
    payload.projectWebsiteUrl = formState.projectWebsiteUrl ? formState.projectWebsiteUrl.trim() : '';
    payload.projectExistingSystem = Boolean(formState.projectExistingSystem);
    payload.projectAdvancePaid = Boolean(formState.projectAdvancePaid);
    payload.projectFilesUrl = formState.projectFilesUrl ? formState.projectFilesUrl.trim() : '';
    payload.projectProposalDocumentUrl = formState.projectProposalDocumentUrl ? formState.projectProposalDocumentUrl.trim() : '';
    payload.projectDocumentationUrl = formState.projectDocumentationUrl ? formState.projectDocumentationUrl.trim() : '';
    payload.projectMeetingNotes = formState.projectMeetingNotes;
    payload.projectClientFeedback = formState.projectClientFeedback;
    payload.projectInternalNotes = formState.projectInternalNotes;
    payload.projectClientNotes = formState.projectClientNotes;
    payload.projectCommunicationMode = formState.projectCommunicationMode;

    if (payload.projectStakeholdersCount !== undefined && payload.projectStakeholdersCount !== '') {
      payload.projectStakeholdersCount = Number(payload.projectStakeholdersCount);
    } else {
      delete payload.projectStakeholdersCount;
    }

    if (payload.projectProposalAmount !== undefined && payload.projectProposalAmount !== '') {
      payload.projectProposalAmount = Number(payload.projectProposalAmount);
    } else {
      delete payload.projectProposalAmount;
    }

    if (payload.projectMaintenanceFee !== undefined && payload.projectMaintenanceFee !== '') {
      payload.projectMaintenanceFee = Number(payload.projectMaintenanceFee);
    } else {
      delete payload.projectMaintenanceFee;
    }

    const stringFieldsToTrim = [
      'projectCompanyName',
      'projectClientName',
      'projectWebsiteUrl',
      'projectName',
      'projectDescription',
      'projectBudgetExpectation',
      'projectDecisionMakerName',
      'projectExistingSystemDetails',
      'projectFilesUrl',
      'projectProposalDocumentUrl',
      'projectDocumentationUrl',
      'projectVersionControlLink',
      'projectMeetingNotes',
      'projectClientFeedback',
      'projectInternalNotes',
      'projectClientNotes',
      'projectTimelineExpectation',
      'projectUrgency',
      'projectHostingPreference',
      'projectPaymentTerms',
      'projectPaymentStatus',
      'projectStatus',
      'projectLeadStage',
      'projectInterestLevel',
      'programBatch',
      'projectAnnualBudgetRange',
      'courseTrainerAssigned',
      'courseEmiDetails',
      'courseCounselorAssigned',
      'courseEnrollmentNotes',
    ];
    stringFieldsToTrim.forEach((field) => {
      if (typeof payload[field] === 'string') {
        payload[field] = payload[field].trim();
      }
    });

    onSubmit(payload);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p className="text-sm text-gray-500">Pipeline: {pipelineType === 'course' ? 'Course' : 'Internship'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Basic Lead Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Enquiry</label>
                <input
                  type="date"
                  value={formState.enquiryDate}
                  onChange={(e) => handleChange('enquiryDate', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {renderSelectWithCustom('leadSource', 'Lead Source', LEAD_SOURCES, 'Select source')}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isITProjectPipeline ? 'Contact Person *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={`mt-1 w-full rounded-lg border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder={isITProjectPipeline ? 'Contact person name' : 'Student name'}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              {isITProjectPipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client / Business Name</label>
                  <input
                    type="text"
                    value={formState.projectClientName}
                    onChange={(e) => handleChange('projectClientName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Client or business name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`mt-1 w-full rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Primary contact"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alternate Phone</label>
                <input
                  type="tel"
                  value={formState.alternatePhone}
                  onChange={(e) => handleChange('alternatePhone', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Secondary contact"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={formState.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((genderOption) => (
                    <option key={genderOption} value={genderOption}>{genderOption}</option>
                  ))}
                </select>
              </div>
              {isCoursePipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={formState.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  min="0"
                  value={formState.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{isITProjectPipeline ? 'City / Country' : 'City / Location'}</label>
                <input
                  type="text"
                  value={formState.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={isITProjectPipeline ? 'City or Country' : 'City'}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  rows={2}
                  value={formState.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Address (optional)"
                />
              </div>
              {isITProjectPipeline && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company / Business Name</label>
                    <input
                      type="text"
                      value={formState.projectCompanyName}
                      onChange={(e) => handleChange('projectCompanyName', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website / Social Link</label>
                    <input
                      type="url"
                      value={formState.projectWebsiteUrl}
                      onChange={(e) => handleChange('projectWebsiteUrl', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}
              {!isITProjectPipeline && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course</label>
                    <input
                      type="text"
                      value={formState.course}
                      onChange={(e) => handleChange('course', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Course or program"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input
                      type="text"
                      value={formState.specialization}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Domain focus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                    <input
                      type="text"
                      value={formState.currentStatus}
                      onChange={(e) => handleChange('currentStatus', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                      placeholder="E.g., Fresher, Working"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                    <input
                      type="date"
                      value={formState.followUpDate}
                      onChange={(e) => handleChange('followUpDate', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Batch</label>
                    <input
                      type="text"
                      value={formState.preferredBatch}
                      onChange={(e) => handleChange('preferredBatch', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Batch preference"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                    <input
                      type="text"
                      value={formState.experienceLevel}
                      onChange={(e) => handleChange('experienceLevel', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., Fresher, 2 years"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Professional & Education</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderSelectWithCustom('profileType', 'Profile Type', PROFILE_TYPES, 'Select profile')}
              {renderSelectWithCustom('educationQualification', 'Education / Qualification', EDUCATION_LEVELS, 'Select qualification')}
              {renderSelectWithCustom('currentStatusDetail', 'Current Status', CURRENT_STATUS_OPTIONS, 'Select status')}
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization / College Name</label>
                <input
                  type="text"
                  value={formState.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Organization or college"
                />
              </div>
              {renderSelectWithCustom('experienceLevel', 'Experience Level', EXPERIENCE_LEVELS, 'Select experience')}
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Status Notes</label>
                <input
                  type="text"
                  value={formState.currentStatus}
                  onChange={(e) => handleChange('currentStatus', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional status notes"
                />
              </div>
            </div>
          </section>

          {isCoursePipeline ? (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Enrollment Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderSelectWithCustom('courseSelected', 'Course Selected', DOMAIN_OPTIONS, 'Select course')}
                {renderSelectWithCustom('courseProgramType', 'Program Type', COURSE_PROGRAM_TYPES, 'Select program type')}
                {renderSelectWithCustom('courseMode', 'Course Mode', COURSE_MODE_OPTIONS, 'Select course mode')}
                {renderSelectWithCustom('courseBatchType', 'Batch Type', COURSE_BATCH_TYPES, 'Select batch type')}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch Time Slot</label>
                  <input
                    type="text"
                    value={formState.courseBatchTimeSlot}
                    onChange={(e) => handleChange('courseBatchTimeSlot', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                  />
                </div>
                {renderSelectWithCustom('courseDuration', 'Course Duration', DURATION_OPTIONS, 'Select duration')}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formState.courseStartDate}
                    onChange={(e) => handleChange('courseStartDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700" htmlFor="courseDemoCompleted">Demo Completed?</label>
                  <input
                    id="courseDemoCompleted"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={formState.courseDemoCompleted}
                    onChange={(e) => handleBooleanChange('courseDemoCompleted', e.target.checked)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trainer Assigned</label>
                  <input
                    type="text"
                    value={formState.courseTrainerAssigned}
                    onChange={(e) => handleChange('courseTrainerAssigned', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Trainer name"
                  />
                </div>
              </div>
            </section>
          ) : isInternshipPipeline ? (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Requirement & Interests</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Interested Program Type</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {PROGRAM_TYPE_OPTIONS.map((option) => {
                      const checked = formState.interestedProgramType.includes(option);
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                            checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={checked}
                            onChange={() => toggleMultiValue('interestedProgramType', option)}
                          />
                          <span className="truncate">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customProgramInput}
                      onChange={(e) => setCustomProgramInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add custom program"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('interestedProgramType', customProgramInput, PROGRAM_TYPES);
                        setCustomProgramInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.interestedProgramType.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.interestedProgramType.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('interestedProgramType', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Domain / Skill Interest</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {DOMAIN_OPTION_LIST.map((option) => {
                      const checked = formState.domainInterests.includes(option);
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                            checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={checked}
                            onChange={() => toggleMultiValue('domainInterests', option)}
                          />
                          <span className="truncate">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={(e) => setCustomDomainInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add custom domain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('domainInterests', customDomainInput, DOMAIN_OPTIONS);
                        setCustomDomainInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.domainInterests.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.domainInterests.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('domainInterests', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {renderSelectWithCustom('trainingMode', 'Mode of Training', TRAINING_MODES, 'Select mode')}
                {renderSelectWithCustom('durationRequired', 'Duration Required', DURATION_OPTIONS, 'Select duration')}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Start Date</label>
                  <input
                    type="date"
                    value={formState.preferredStartDate}
                    onChange={(e) => handleChange('preferredStartDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain Focus</label>
                  <input
                    type="text"
                    value={formState.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Domain focus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Batch</label>
                  <input
                    type="text"
                    value={formState.preferredBatch}
                    onChange={(e) => handleChange('preferredBatch', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Batch preference"
                  />
                </div>
              </div>
            </section>
          ) : null}

          {isITProjectPipeline && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Technical Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Preferred Tech Stack</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {PROJECT_TECH_STACK_OPTIONS.map((option) => {
                      const checked = formState.projectPreferredTechStack.some((item) => equalsIgnoreCase(item, option));
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                            checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={checked}
                            onChange={() => toggleMultiValue('projectPreferredTechStack', option)}
                          />
                          <span className="truncate">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add custom technology"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('projectPreferredTechStack', customTechInput, PROJECT_TECH_STACK_OPTIONS);
                        setCustomTechInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.projectPreferredTechStack.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.projectPreferredTechStack.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('projectPreferredTechStack', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {renderSelectWithCustom('projectHostingPreference', 'Hosting Preference', HOSTING_PREFERENCE_OPTIONS, 'Select hosting preference')}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700" htmlFor="projectExistingSystem">Existing System?</label>
                  <input
                    id="projectExistingSystem"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={formState.projectExistingSystem}
                    onChange={(e) => handleBooleanChange('projectExistingSystem', e.target.checked)}
                  />
                </div>
                {formState.projectExistingSystem && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Existing System Details</label>
                    <textarea
                      rows={3}
                      value={formState.projectExistingSystemDetails}
                      onChange={(e) => handleChange('projectExistingSystemDetails', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe current system"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Project Files URL</label>
                  <input
                    type="url"
                    value={formState.projectFilesUrl}
                    onChange={(e) => handleChange('projectFilesUrl', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Link to project files (PDF, Figma, etc.)"
                  />
                </div>
              </div>
            </section>
          )}

          {isITProjectPipeline && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Proposal & Payment</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proposal Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.projectProposalAmount}
                    onChange={(e) => handleChange('projectProposalAmount', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Proposed amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Proposal Document URL</label>
                  <input
                    type="url"
                    value={formState.projectProposalDocumentUrl}
                    onChange={(e) => handleChange('projectProposalDocumentUrl', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                    placeholder="https://..."
                  />
                </div>
                {renderSelectWithCustom('projectPaymentTerms', 'Payment Terms', PROJECT_PAYMENT_TERMS, 'Select payment terms')}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700" htmlFor="projectAdvancePaid">Advance Paid?</label>
                  <input
                    id="projectAdvancePaid"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={formState.projectAdvancePaid}
                    onChange={(e) => handleBooleanChange('projectAdvancePaid', e.target.checked)}
                  />
                </div>
                {renderSelectWithCustom('projectPaymentStatus', 'Payment Status', PROJECT_PAYMENT_STATUS, 'Select payment status')}
              </div>
            </section>
          )}

          {isITProjectPipeline && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Project Execution</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderSelectWithCustom('projectStatus', 'Project Status', PROJECT_STATUS_OPTIONS, 'Select status')}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Assigned Team</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {PROJECT_ASSIGNED_ROLES.map((role) => {
                      const checked = formState.projectAssignedTeam.some((item) => equalsIgnoreCase(item, role));
                      return (
                        <label
                          key={role}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                            checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={checked}
                            onChange={() => toggleMultiValue('projectAssignedTeam', role)}
                          />
                          <span className="truncate">{role}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customTeamInput}
                      onChange={(e) => setCustomTeamInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add team member/role"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('projectAssignedTeam', customTeamInput, PROJECT_ASSIGNED_ROLES);
                        setCustomTeamInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.projectAssignedTeam.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.projectAssignedTeam.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('projectAssignedTeam', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formState.projectStartDate}
                    onChange={(e) => handleChange('projectStartDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={formState.projectDeadline}
                    onChange={(e) => handleChange('projectDeadline', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                  <input
                    type="date"
                    value={formState.projectDeliveryDate}
                    onChange={(e) => handleChange('projectDeliveryDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Version Control Link</label>
                  <input
                    type="url"
                    value={formState.projectVersionControlLink}
                    onChange={(e) => handleChange('projectVersionControlLink', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="GitHub / GitLab / Bitbucket"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Documentation URL</label>
                  <input
                    type="url"
                    value={formState.projectDocumentationUrl}
                    onChange={(e) => handleChange('projectDocumentationUrl', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </section>
          )}

          {isITProjectPipeline && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Support & Maintenance</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Support Type</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {PROJECT_SUPPORT_TYPES.map((option) => {
                      const checked = formState.projectSupportType.some((item) => equalsIgnoreCase(item, option));
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                            checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            checked={checked}
                            onChange={() => toggleMultiValue('projectSupportType', option)}
                          />
                          <span className="truncate">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={customSupportInput}
                      onChange={(e) => setCustomSupportInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add custom support"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('projectSupportType', customSupportInput, PROJECT_SUPPORT_TYPES);
                        setCustomSupportInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.projectSupportType.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.projectSupportType.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('projectSupportType', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Support Expiry Date</label>
                  <input
                    type="date"
                    value={formState.projectSupportExpiryDate}
                    onChange={(e) => handleChange('projectSupportExpiryDate', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Maintenance Fee</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.projectMaintenanceFee}
                    onChange={(e) => handleChange('projectMaintenanceFee', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Maintenance fee"
                  />
                </div>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Lead Qualification & Status</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stage *</label>
                <select
                  value={formState.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className={`mt-1 w-full rounded-lg border ${errors.stage ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  {stages?.map(stage => (
                    <option key={stage._id} value={stage._id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
                {errors.stage && <p className="text-xs text-red-500 mt-1">{errors.stage}</p>}
              </div>
              {isITProjectPipeline && renderSelectWithCustom('projectLeadStage', 'Lead Stage (Detail)', PROJECT_LEAD_STAGES, 'Select stage detail')}
              {renderSelectWithCustom('interestLevel', 'Interest Level', INTEREST_LEVELS, 'Select level')}
              {isITProjectPipeline && renderSelectWithCustom('projectInterestLevel', 'Project Interest Level', INTEREST_LEVELS, 'Select interest level')}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input
                  type="text"
                  value={formState.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Lead status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Expectation</label>
                <input
                  type="text"
                  value={formState.budgetExpectation}
                  onChange={(e) => handleChange('budgetExpectation', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Budget or fees expectation"
                />
              </div>
              {isITProjectPipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Budget Expectation</label>
                  <input
                    type="text"
                    value={formState.projectBudgetExpectation}
                    onChange={(e) => handleChange('projectBudgetExpectation', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Budget range or amount"
                  />
                </div>
              )}
              {renderSelectWithCustom('decisionMaker', 'Decision Maker', DECISION_MAKERS, 'Select decision maker')}
              {isITProjectPipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Decision Maker Name</label>
                  <input
                    type="text"
                    value={formState.projectDecisionMakerName}
                    onChange={(e) => handleChange('projectDecisionMakerName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name of decision maker"
                  />
                </div>
              )}
              {isITProjectPipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Stakeholders</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.projectStakeholdersCount}
                    onChange={(e) => handleChange('projectStakeholdersCount', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Est. Enrollment Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formState.enrollmentValue}
                  onChange={(e) => handleChange('enrollmentValue', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Comma separated tags"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Communication & Follow-up</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                <input
                  type="date"
                  value={formState.followUpDate}
                  onChange={(e) => handleChange('followUpDate', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Contacted Date</label>
                <input
                  type="date"
                  value={formState.lastContactedDate}
                  onChange={(e) => handleChange('lastContactedDate', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {renderSelectWithCustom('communicationType', 'Communication Type', COMMUNICATION_TYPES, 'Select communication')}
              {isITProjectPipeline && renderSelectWithCustom('projectCommunicationMode', 'Meeting Mode', PROJECT_COMMUNICATION_MODES, 'Select meeting mode')}
              {isCoursePipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Counselor / Staff Assigned</label>
                  <input
                    type="text"
                    value={formState.courseCounselorAssigned}
                    onChange={(e) => handleChange('courseCounselorAssigned', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Counselor name"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={formState.followUpNotes}
                  onChange={(e) => handleChange('followUpNotes', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Notes from latest follow-up"
                />
              </div>
              {isITProjectPipeline && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Meeting Notes</label>
                    <textarea
                      rows={3}
                      value={formState.projectMeetingNotes}
                      onChange={(e) => handleChange('projectMeetingNotes', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Important meeting notes"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Client Feedback</label>
                    <textarea
                      rows={3}
                      value={formState.projectClientFeedback}
                      onChange={(e) => handleChange('projectClientFeedback', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Captured client feedback"
                    />
                  </div>
                </>
              )}
              {isCoursePipeline && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Enrollment Notes</label>
                    <textarea
                      rows={3}
                      value={formState.courseEnrollmentNotes}
                      onChange={(e) => handleChange('courseEnrollmentNotes', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Specific enrollment notes"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700" htmlFor="courseFollowUpRequired">Follow-up Required?</label>
                    <input
                      id="courseFollowUpRequired"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={formState.courseFollowUpRequired}
                      onChange={(e) => handleBooleanChange('courseFollowUpRequired', e.target.checked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={formState.courseNextFollowUpDate}
                      onChange={(e) => handleChange('courseNextFollowUpDate', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-indigo-500" /> Assign Users
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {usersLoading && (
                    <p className="text-xs text-gray-500">Loading team members...</p>
                  )}
                  {!usersLoading && users.length === 0 && (
                    <p className="text-xs text-gray-500">No team members found.</p>
                  )}
                  {users.map((user) => {
                    const userId = user._id;
                    const checked = formState.assignedUsers.includes(userId);
                    return (
                      <label
                        key={userId}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          checked ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={checked}
                          onChange={() => handleAssignedToggle(userId)}
                        />
                        <span className="truncate">{user.name}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-1 text-xs text-gray-500">Selected users will be notified and appear on the lead card. The creator is assigned automatically.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Documents</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isCoursePipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student Photo URL</label>
                  <input
                    type="url"
                    value={formState.studentPhotoUrl}
                    onChange={(e) => handleChange('studentPhotoUrl', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume URL</label>
                <input
                  type="url"
                  value={formState.resumeUrl}
                  onChange={(e) => handleChange('resumeUrl', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Proof URL</label>
                <input
                  type="url"
                  value={formState.idProofUrl}
                  onChange={(e) => handleChange('idProofUrl', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
              {isCoursePipeline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address Proof URL</label>
                  <input
                    type="url"
                    value={formState.addressProofUrl}
                    onChange={(e) => handleChange('addressProofUrl', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Requirement Document URL</label>
                <input
                  type="url"
                  value={formState.requirementDocUrl}
                  onChange={(e) => handleChange('requirementDocUrl', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {isCoursePipeline ? (
            <>
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Payment Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Fee</label>
                    <input
                      type="number"
                      min="0"
                      value={formState.courseFee}
                      onChange={(e) => handleChange('courseFee', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Total course fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Applied</label>
                    <input
                      type="number"
                      min="0"
                      value={formState.courseDiscountApplied}
                      onChange={(e) => handleChange('courseDiscountApplied', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Discount amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Final Fee Payable</label>
                    <input
                      type="number"
                      min="0"
                      value={formState.courseFinalFeePayable}
                      onChange={(e) => handleChange('courseFinalFeePayable', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Payable amount"
                    />
                  </div>
                  {renderSelectWithCustom('coursePaymentMethod', 'Payment Method', COURSE_PAYMENT_METHODS, 'Select payment method')}
                  {renderSelectWithCustom('coursePaymentStatus', 'Payment Status', PAYMENT_STATUS_OPTIONS, 'Select payment status')}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction / Reference ID</label>
                    <input
                      type="text"
                      value={formState.courseTransactionId}
                      onChange={(e) => handleChange('courseTransactionId', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Transaction reference"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700" htmlFor="courseInvoiceUploaded">Invoice Uploaded?</label>
                    <input
                      id="courseInvoiceUploaded"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={formState.courseInvoiceUploaded}
                      onChange={(e) => handleBooleanChange('courseInvoiceUploaded', e.target.checked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">EMI Details</label>
                    <input
                      type="text"
                      value={formState.courseEmiDetails}
                      onChange={(e) => handleChange('courseEmiDetails', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="EMI plan (optional)"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Completion & Certification</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {renderSelectWithCustom('courseCompletionStatus', 'Course Completion Status', ['Ongoing', 'Completed', 'Dropped'], 'Select status')}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700" htmlFor="courseCertificateIssued">Certificate Issued?</label>
                    <input
                      id="courseCertificateIssued"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={formState.courseCertificateIssued}
                      onChange={(e) => handleBooleanChange('courseCertificateIssued', e.target.checked)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Certificate ID</label>
                    <input
                      type="text"
                      value={formState.courseCertificateId}
                      onChange={(e) => handleChange('courseCertificateId', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Certificate ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Certificate Issued Date</label>
                    <input
                      type="date"
                      value={formState.courseCertificateIssueDate}
                      onChange={(e) => handleChange('courseCertificateIssueDate', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trainer Notes</label>
                    <textarea
                      rows={3}
                      value={formState.courseTrainerNotes}
                      onChange={(e) => handleChange('courseTrainerNotes', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Trainer feedback / notes"
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Final Conversion</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderSelectWithCustom('paymentStatus', 'Payment Status', PAYMENT_STATUS_OPTIONS, 'Select payment status')}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Program / Batch Assigned</label>
                  <input
                    type="text"
                    value={formState.programBatch}
                    onChange={(e) => handleChange('programBatch', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus;border-indigo-500"
                    placeholder="Batch name"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700" htmlFor="certificateNeeded">Certificate Needed</label>
                  <input
                    id="certificateNeeded"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    checked={formState.certificateNeeded}
                    onChange={(e) => handleBooleanChange('certificateNeeded', e.target.checked)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Remarks / Additional Notes</label>
                  <textarea
                    rows={3}
                    value={formState.finalRemarks}
                    onChange={(e) => handleChange('finalRemarks', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Additional remarks"
                  />
                </div>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Notes</h3>
            {isITProjectPipeline && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
                  <textarea
                    rows={3}
                    value={formState.projectInternalNotes}
                    onChange={(e) => handleChange('projectInternalNotes', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Internal remarks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Notes</label>
                  <textarea
                    rows={3}
                    value={formState.projectClientNotes}
                    onChange={(e) => handleChange('projectClientNotes', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Client notes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments (URLs)</label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="url"
                      value={customAttachmentInput}
                      onChange={(e) => setCustomAttachmentInput(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCustomMultiOption('projectAttachments', customAttachmentInput, []);
                        setCustomAttachmentInput('');
                      }}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  {formState.projectAttachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formState.projectAttachments.map((value) => (
                        <span
                          key={value}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                        >
                          {value}
                          <button
                            type="button"
                            onClick={() => removeMultiValue('projectAttachments', value)}
                            className="rounded-full px-1 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <textarea
              rows={4}
              value={formState.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Additional notes"
            />
          </section>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            {loading ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;
