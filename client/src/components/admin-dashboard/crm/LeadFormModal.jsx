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
};

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

  useEffect(() => {
    if (initialData) {
      setFormState({
        ...defaultForm,
        ...initialData,
        followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        stage: initialData.stage?._id || initialData.stage || '',
        assignedUsers: initialData.assignedUsers
          ? initialData.assignedUsers.map((user) => user._id || user).filter(Boolean)
          : [],
      });
    } else {
      setFormState({
        ...defaultForm,
        stage: stages?.[0]?._id || '',
        assignedUsers: [],
      });
    }
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
    setFormState(prev => ({ ...prev, [field]: value }));
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
      assignedUsers: formState.assignedUsers,
    };

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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`mt-1 w-full rounded-lg border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Student name"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
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
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <input
                type="text"
                value={formState.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Lead source"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Status</label>
              <input
                type="text"
                value={formState.currentStatus}
                onChange={(e) => handleChange('currentStatus', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                value={formState.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Comma separated tags"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Est. Enrollment Value (₹)</label>
              <input
                type="number"
                value={formState.enrollmentValue}
                onChange={(e) => handleChange('enrollmentValue', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={4}
              value={formState.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add remarks about this lead"
            />
          </div>
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
