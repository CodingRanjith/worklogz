import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiX, FiPlus, FiMinus, FiCheckCircle } from 'react-icons/fi';
import SuccessNotification from '../../components/admin-dashboard/common/SuccessNotification';

const DEPARTMENTS = [
  'Administration',
  'Human Resources (HR)',
  'Finance & Accounting',
  'Sales',
  'Marketing',
  'Customer Support / Service',
  'Operations / Project Management',
  'Legal & Compliance',
  'Procurement / Purchasing',
  'Research & Development (R&D)',
  'Information Technology (IT)',
  'Quality Assurance (QA)',
  'Business Development',
  'Public Relations (PR)',
  'Training & Development'
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Not Started', 'In Progress', 'Review', 'Completed', 'On Hold'];

const CreateWorkCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    department: location.state?.selectedDepartment || '',
    title: '',
    description: '',
    teamLead: '',
    teamMembers: [{ name: '', role: '' }],
    startDate: '',
    endDate: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started',
    progress: 0,
    tags: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedMembers
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', role: '' }]
    }));
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > 1) {
      const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        teamMembers: updatedMembers
      }));
    }
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: updatedTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index) => {
    if (formData.tags.length > 1) {
      const updatedTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tags: updatedTags
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.teamLead.trim()) newErrors.teamLead = 'Team lead is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';

    // Validate team members
    const validMembers = formData.teamMembers.filter(member => member.name.trim());
    if (validMembers.length === 0) {
      newErrors.teamMembers = 'At least one team member is required';
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.startDate) > new Date(formData.dueDate)) {
        newErrors.dueDate = 'Due date must be after start date';
      }
    }

      // Validate progress
      const progressValue = parseInt(formData.progress, 10);
      if (progressValue < 0 || progressValue > 100 || isNaN(progressValue)) {
        newErrors.progress = 'Progress must be a number between 0 and 100';
      }    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Filter out empty team members and tags, convert progress to number
      const cleanedData = {
        ...formData,
        teamMembers: formData.teamMembers.filter(member => member.name.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        progress: parseInt(formData.progress, 10) || 0
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://worklogz.onrender.com'}/api/work-cards`,
        cleanedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const serialNumber = response.data.workCard?.serialNumber || '#New';
      
      // Show success animation first
      setSuccessMessage(`Work card ${serialNumber} created successfully!`);
      setShowSuccess(true);
      
      // Navigate after a brief delay to show the animation
      setTimeout(() => {
        navigate('/company-departments', { 
          state: { message: `Work card ${serialNumber} created successfully!` } 
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating work card:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to create work card';
      
      if (error.response?.data) {
        const responseData = error.response.data;
        if (responseData.errors && Array.isArray(responseData.errors)) {
          errorMessage = `Validation errors: ${responseData.errors.join(', ')}`;
        } else if (responseData.details) {
          errorMessage = responseData.details;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company-departments');
  };

  return (
    <>
      <SuccessNotification
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={4000}
      />
      
      <style jsx>{`
        @keyframes shake {
          0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
          10% { transform: translateX(-5px); }
          30% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      
      <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <h1 className="text-2xl font-bold">Create New Work Card</h1>
          <p className="text-blue-100 mt-2">Add a new work item for your team</p>
        </div>

        {/* Form Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Progress</span>
            <span>{Math.round(((formData.department ? 1 : 0) + 
                               (formData.title ? 1 : 0) + 
                               (formData.description ? 1 : 0) + 
                               (formData.teamLead ? 1 : 0) + 
                               (formData.startDate ? 1 : 0)) / 5 * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((formData.department ? 1 : 0) + 
                          (formData.title ? 1 : 0) + 
                          (formData.description ? 1 : 0) + 
                          (formData.teamLead ? 1 : 0) + 
                          (formData.startDate ? 1 : 0)) / 5 * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Serial Number Preview */}
          {formData.department && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-mono font-semibold">
                  {(() => {
                    const prefixMap = {
                      'Administration': 'ADMIN',
                      'Human Resources (HR)': 'HR',
                      'Finance & Accounting': 'FINANCE',
                      'Sales': 'SALES',
                      'Marketing': 'MARKETING',
                      'Customer Support / Service': 'SUPPORT',
                      'Operations / Project Management': 'OPS',
                      'Legal & Compliance': 'LEGAL',
                      'Procurement / Purchasing': 'PROCUREMENT',
                      'Research & Development (R&D)': 'RND',
                      'Information Technology (IT)': 'IT',
                      'Quality Assurance (QA)': 'QA',
                      'Business Development': 'BIZDEV',
                      'Public Relations (PR)': 'PR',
                      'Training & Development': 'TRAINING'
                    };
                    const prefix = prefixMap[formData.department] || formData.department.replace(/[^a-zA-Z]/g, '').substring(0, 8).toUpperCase();
                    return `${prefix} #XX`;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Work Card ID Preview</p>
                  <p className="text-xs text-blue-600">The actual number will be assigned when created</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter work card title"
              className={`w-full border rounded-lg px-3 py-2 transition-all duration-300 ${
                errors.title 
                  ? 'border-red-500 bg-red-50 shake focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the work to be done..."
              className={`w-full border rounded-lg px-3 py-2 transition-all duration-300 ${
                errors.department 
                  ? 'border-red-500 bg-red-50 shake focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Team Lead */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Lead *
            </label>
            <input
              type="text"
              name="teamLead"
              value={formData.teamLead}
              onChange={handleChange}
              placeholder="Name of the team lead"
              className={`w-full border rounded-lg px-3 py-2 transition-all duration-300 resize-none ${
                errors.description 
                  ? 'border-red-500 bg-red-50 shake focus:ring-2 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50'
              }`}
            />
            {errors.teamLead && <p className="text-red-500 text-sm mt-1">{errors.teamLead}</p>}
          </div>

          {/* Team Members */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Team Members *
              </label>
              <button
                type="button"
                onClick={addTeamMember}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <FiPlus /> Add Member
              </button>
            </div>
            <div className="space-y-3">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Member name"
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (optional)"
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.teamMembers && <p className="text-red-500 text-sm mt-1">{errors.teamMembers}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Status and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0-100"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.progress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.progress && <p className="text-red-500 text-sm mt-1">{errors.progress}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <button
                type="button"
                onClick={addTag}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <FiPlus /> Add Tag
              </button>
            </div>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Enter tag"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <FiMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <FiX /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg'
              } text-white font-medium`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Work Card...
                </>
              ) : (
                <>
                  <FiSave />
                  Create Work Card
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateWorkCard;