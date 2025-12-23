import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FiPhone, FiCalendar, FiBook } from 'react-icons/fi';
import { format } from 'date-fns';

const DEFAULT_AVATAR = 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png';

// Array of light, pastel colors for cards
const LIGHT_CARD_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200' },
  { bg: 'bg-purple-50', border: 'border-purple-200' },
  { bg: 'bg-pink-50', border: 'border-pink-200' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { bg: 'bg-teal-50', border: 'border-teal-200' },
  { bg: 'bg-green-50', border: 'border-green-200' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { bg: 'bg-amber-50', border: 'border-amber-200' },
  { bg: 'bg-orange-50', border: 'border-orange-200' },
  { bg: 'bg-rose-50', border: 'border-rose-200' },
  { bg: 'bg-violet-50', border: 'border-violet-200' },
  { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
  { bg: 'bg-sky-50', border: 'border-sky-200' },
  { bg: 'bg-lime-50', border: 'border-lime-200' },
];

const getCardColor = (leadId) => {
  // Hash the lead ID to get a consistent color for each card
  if (!leadId) return LIGHT_CARD_COLORS[0];
  let hash = 0;
  for (let i = 0; i < leadId.length; i++) {
    hash = leadId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % LIGHT_CARD_COLORS.length;
  return LIGHT_CARD_COLORS[colorIndex];
};

const LeadCard = ({ lead, index, onEdit }) => {
  const followUpLabel = lead.followUpDate ? format(new Date(lead.followUpDate), 'MMM dd, yyyy') : 'No follow-up';
  const cardColor = getCardColor(lead._id);
  const assignedUsersRaw = Array.isArray(lead.assignedUsers) ? lead.assignedUsers : [];
  const isCoursePipeline = lead.pipelineType === 'course';
  const isITProjectPipeline = lead.pipelineType === 'it-project';
  const isInternshipPipeline = lead.pipelineType === 'internship';

  const fallbackUsers = [];
  if (lead.leadOwner) fallbackUsers.push(lead.leadOwner);
  if (lead.createdBy) fallbackUsers.push(lead.createdBy);

  const uniqueMap = new Map();
  [...assignedUsersRaw, ...fallbackUsers].forEach((user) => {
    if (!user) return;
    const id = user._id || user;
    if (!id || uniqueMap.has(id)) return;
    uniqueMap.set(id, user);
  });

  const assignedUsers = Array.from(uniqueMap.values());
  const assignedUsersDisplay = assignedUsers.filter((user) => user && user.name !== 'Admin');

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const getRelativeTime = (dateValue) => {
     if (!dateValue) return null;
     const now = Date.now();
     const createdTime = new Date(dateValue).getTime();
     if (Number.isNaN(createdTime)) return null;
 
     const diffSeconds = Math.max(0, Math.floor((now - createdTime) / 1000));
    if (diffSeconds < 1) return '1s';

    const units = [
      { unit: 'y', value: 60 * 60 * 24 * 365 },
      { unit: 'mo', value: 60 * 60 * 24 * 30 },
      { unit: 'w', value: 60 * 60 * 24 * 7 },
      { unit: 'd', value: 60 * 60 * 24 },
      { unit: 'h', value: 60 * 60 },
      { unit: 'm', value: 60 },
      { unit: 's', value: 1 },
    ];

    for (const { unit, value } of units) {
      if (diffSeconds >= value) {
        const count = Math.floor(diffSeconds / value);
        return `${count}${unit}`;
      }
    }

    return '1s';
  };

  const createdRelative = getRelativeTime(lead.createdAt);

  return (
    <Draggable draggableId={lead._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(lead)}
          className={`group cursor-pointer rounded-xl border ${cardColor.border} ${cardColor.bg} shadow-sm hover:shadow-md transition transform ${snapshot.isDragging ? 'ring-2 ring-indigo-400 scale-[1.01]' : 'hover:-translate-y-0.5'}`}
        >
          <div className="max-h-80 overflow-y-auto px-3 py-2.5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                    {lead.fullName}
                  </h4>
                  {lead.leadCode && (
                    <span className="rounded-full bg-indigo-100/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {lead.leadCode}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-indigo-500 uppercase tracking-wide truncate">
                  {lead.status || 'Pending'}
                </p>
              </div>
              {createdRelative && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {createdRelative}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>{lead.phone}</span>
                </div>

                {lead.leadSource && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium text-gray-500">Source:</span>
                    <span>{lead.leadSource}</span>
                  </div>
                )}

                {isInternshipPipeline && lead.trainingMode && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Mode:</span>
                    <span>{lead.trainingMode}</span>
                  </div>
                )}

                {isInternshipPipeline && lead.durationRequired && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Duration:</span>
                    <span>{lead.durationRequired}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseProgramType && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Program:</span>
                    <span>{lead.courseProgramType}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectCompanyName && (
                   <div className="flex items-center gap-2">
                     <span className="font-medium text-gray-500">Company:</span>
                     <span className="truncate" title={lead.projectCompanyName}>{lead.projectCompanyName}</span>
                   </div>
                 )}

                {isITProjectPipeline && lead.projectName && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Project:</span>
                    <span className="truncate" title={lead.projectName}>{lead.projectName}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectCategory?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Category:</span>
                    <span>{lead.projectCategory.slice(0, 2).join(', ')}{lead.projectCategory.length > 2 ? '…' : ''}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseMode && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Mode:</span>
                    <span>{lead.courseMode}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectUrgency && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Urgency:</span>
                    <span>{lead.projectUrgency}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectTimelineExpectation && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Timeline:</span>
                    <span>{lead.projectTimelineExpectation}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseBatchType && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Batch:</span>
                    <span>{lead.courseBatchType}</span>
                  </div>
                )}

                {isITProjectPipeline && typeof lead.projectProposalAmount === 'number' && lead.projectProposalAmount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Proposal:</span>
                    <span>₹{lead.projectProposalAmount.toLocaleString()}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectBudgetExpectation && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Budget:</span>
                    <span>{lead.projectBudgetExpectation}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseStartDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Start:</span>
                    <span>{format(new Date(lead.courseStartDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectStatus && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Project Status:</span>
                    <span>{lead.projectStatus}</span>
                  </div>
                )}

                {lead.course && (
                  <div className="flex items-center gap-2">
                    <FiBook className="w-3.5 h-3.5" />
                    <span className="truncate" title={lead.course}>{lead.course}</span>
                  </div>
                )}

                {!isInternshipPipeline && (
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span>{followUpLabel}</span>
                  </div>
                )}

                {isCoursePipeline && lead.coursePaymentStatus && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Payment:</span>
                    <span>{lead.coursePaymentStatus}</span>
                  </div>
                )}

                {isInternshipPipeline && lead.paymentStatus && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Payment:</span>
                    <span>{lead.paymentStatus}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectPaymentStatus && (
                   <div className="flex items-center gap-2">
                     <span className="font-medium text-gray-500">Payment:</span>
                     <span>{lead.projectPaymentStatus}</span>
                   </div>
                 )}

                {isITProjectPipeline && lead.projectCommunicationMode && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Last Meet:</span>
                    <span>{lead.projectCommunicationMode}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseCounselorAssigned && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Counselor:</span>
                    <span>{lead.courseCounselorAssigned}</span>
                  </div>
                )}

                {isCoursePipeline && lead.courseCompletionStatus && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Completion:</span>
                    <span>{lead.courseCompletionStatus}</span>
                  </div>
                )}

                {isITProjectPipeline && lead.projectSupportType?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-500">Support:</span>
                    <span>{lead.projectSupportType.slice(0, 2).join(', ')}{lead.projectSupportType.length > 2 ? '…' : ''}</span>
                  </div>
                )}
              </div>

              {assignedUsersDisplay.length > 0 && (
                <div className="mt-1 flex flex-col items-end gap-1">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Assigned Team</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {assignedUsersDisplay.slice(0, 3).map((user) => {
                        const id = user?._id || user;
                        const name = typeof user === 'string' ? 'Team Member' : (user?.name || 'Team Member');
                        const phone = typeof user === 'string' ? '' : (user?.phone || '');
                        const email = typeof user === 'string' ? '' : (user?.email || '');
                        const avatar = typeof user === 'string' ? null : (user?.profilePic || user?.avatar || user?.photo || user?.profilePicture || null);
                        const avatarSrc = avatar || DEFAULT_AVATAR;

                        return (
                          <div key={id} className="relative">
                            <img
                              src={avatarSrc}
                              alt={name}
                              className="peer h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                            />

                            <div className="absolute left-1/2 top-full z-40 hidden -translate-x-1/2 pt-2 peer-hover:block hover:block">
                              <div className="w-56 rounded-xl border border-gray-200 bg-white p-3 text-xs shadow-lg">
                                <p className="text-sm font-semibold text-gray-900">{name}</p>
                                {email && <p className="mt-1 truncate text-gray-600">{email}</p>}
                                {phone && <p className="mt-1 text-gray-600">{phone}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {assignedUsersDisplay.length > 3 && (
                      <span className="text-[10px] font-medium text-gray-500">+{assignedUsersDisplay.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;
