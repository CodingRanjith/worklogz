import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FiEdit2, FiPhone, FiTrash2, FiCalendar, FiBook, FiTag, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';

const DEFAULT_AVATAR = 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png';

const LeadCard = ({ lead, index, onEdit, onDelete }) => {
  const followUpLabel = lead.followUpDate ? format(new Date(lead.followUpDate), 'MMM dd, yyyy') : 'No follow-up';
  const tags = Array.isArray(lead.tags) ? lead.tags : [];
  const assignedUsersRaw = Array.isArray(lead.assignedUsers) ? lead.assignedUsers : [];

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

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <Draggable draggableId={lead._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition transform ${snapshot.isDragging ? 'ring-2 ring-indigo-400 scale-[1.01]' : ''}`}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                  {lead.fullName}
                </h4>
                <p className="text-xs text-gray-500">{lead.status || 'Pending'}</p>
              </div>
              <div className="flex items-center gap-2">
                {lead.leadCode && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {lead.leadCode}
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    title="Edit lead"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead)}
                    className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                    title="Delete lead"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FiPhone className="w-3.5 h-3.5" />
                  <span>{lead.phone}</span>
                </div>

                {lead.createdBy?.name && (
                  <div className="flex items-center gap-2">
                    <FiUser className="w-3.5 h-3.5" />
                    <span title={`Created by ${lead.createdBy.name}`}>Created by {lead.createdBy.name}</span>
                  </div>
                )}

                {lead.course && (
                  <div className="flex items-center gap-2">
                    <FiBook className="w-3.5 h-3.5" />
                    <span className="truncate" title={lead.course}>{lead.course}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span>{followUpLabel}</span>
                </div>
              </div>

              {assignedUsers.length > 0 && (
                <div className="mt-1 flex flex-col items-end gap-2">
                  <p className="text-xs font-medium text-gray-500">Assigned Team</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {assignedUsers.slice(0, 3).map((user) => {
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
                    {assignedUsers.length > 3 && (
                      <span className="text-[10px] font-medium text-gray-500">+{assignedUsers.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {tags.slice(0, 3).map(tag => (
                  <span
                    key={`${lead._id}-${tag}`}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium px-2 py-0.5"
                  >
                    <FiTag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[10px] text-gray-500 font-medium">+{tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;
