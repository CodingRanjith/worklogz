import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiPlus, FiEdit3, FiTrash2, FiEye, FiUsers, FiList,
  FiSave, FiX, FiCheckCircle, FiAlertCircle, FiSettings,
  FiFileText, FiLock, FiChevronRight, FiChevronLeft, FiClock,
  FiTarget, FiShield, FiSearch, FiFilter, FiDownload
} from 'react-icons/fi';
import SuccessNotification from '../../components/admin-dashboard/common/SuccessNotification';
import './Assessments.css';

const Assessments = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    duration: 60,
    passingScore: 60,
    questions: [],
    allowedUsers: [],
    allowedDepartments: [],
    startDate: '',
    endDate: '',
    security: {
      preventCopyPaste: true,
      preventSkip: true,
      preventTabSwitch: true,
      fullscreenMode: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: true,
      allowReview: false
    }
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.getAssessments, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessments(res.data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const handleCreateNew = () => {
    setEditingAssessment(null);
    setFormData({
      title: '',
      description: '',
      instructions: '',
      duration: 60,
      passingScore: 60,
      questions: [],
      allowedUsers: [],
      allowedDepartments: [],
      startDate: '',
      endDate: '',
      security: {
        preventCopyPaste: true,
        preventSkip: true,
        preventTabSwitch: true,
        fullscreenMode: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        showResults: true,
        allowReview: false
      }
    });
    setActiveTab('questions');
    setShowModal(true);
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || '',
      description: assessment.description || '',
      instructions: assessment.instructions || '',
      duration: assessment.duration || 60,
      passingScore: assessment.passingScore || 60,
      questions: assessment.questions || [],
      allowedUsers: assessment.allowedUsers?.map(u => u._id || u) || [],
      allowedDepartments: assessment.allowedDepartments || [],
      startDate: assessment.startDate ? new Date(assessment.startDate).toISOString().split('T')[0] : '',
      endDate: assessment.endDate ? new Date(assessment.endDate).toISOString().split('T')[0] : '',
      security: {
        preventCopyPaste: assessment.security?.preventCopyPaste !== false,
        preventSkip: assessment.security?.preventSkip !== false,
        preventTabSwitch: assessment.security?.preventTabSwitch !== false,
        fullscreenMode: assessment.security?.fullscreenMode !== false,
        shuffleQuestions: assessment.security?.shuffleQuestions || false,
        shuffleOptions: assessment.security?.shuffleOptions || false,
        showResults: assessment.security?.showResults !== false,
        allowReview: assessment.security?.allowReview || false
      }
    });
    setActiveTab('questions');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || null
      };

      if (editingAssessment) {
        await axios.put(API_ENDPOINTS.updateAssessment(editingAssessment._id), payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('Assessment updated successfully');
      } else {
        await axios.post(API_ENDPOINTS.createAssessment, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMessage('Assessment created successfully');
      }

      setShowSuccess(true);
      setShowModal(false);
      fetchAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      await axios.delete(API_ENDPOINTS.deleteAssessment(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Assessment deleted successfully');
      setShowSuccess(true);
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete assessment');
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
      (filterActive === 'active' && assessment.isActive) ||
      (filterActive === 'inactive' && !assessment.isActive);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: assessments.length,
    active: assessments.filter(a => a.isActive).length,
    totalQuestions: assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0)
  };

  return (
    <div className="assessments-page">
      <SuccessNotification
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />

      {/* Enhanced Header */}
      <div className="assessments-header">
        <div>
          <h1 className="assessments-title">Assessment Management</h1>
          <p className="assessments-subtitle">Create and manage assessments for your team</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary">
          <FiPlus /> Create New Assessment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiFileText />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Assessments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiList />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalQuestions}</div>
            <div className="stat-label">Total Questions</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            onClick={() => setFilterActive('all')}
            className={`filter-btn ${filterActive === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive('active')}
            className={`filter-btn ${filterActive === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive('inactive')}
            className={`filter-btn ${filterActive === 'inactive' ? 'active' : ''}`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Assessments List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading assessments...</p>
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="empty-state">
          <FiFileText className="empty-icon" />
          <h3>No Assessments Found</h3>
          <p>Create your first assessment to get started</p>
          <button onClick={handleCreateNew} className="btn-primary">
            <FiPlus /> Create Assessment
          </button>
        </div>
      ) : (
        <div className="assessments-grid">
          {filteredAssessments.map((assessment) => (
            <div key={assessment._id} className="assessment-card">
              <div className="assessment-card-header">
                <div className="assessment-card-title-section">
                  <h3 className="assessment-card-title">{assessment.title}</h3>
                  <span className={`status-badge ${assessment.isActive ? 'active' : 'inactive'}`}>
                    {assessment.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {assessment.security?.preventCopyPaste && (
                  <div className="security-badge">
                    <FiShield /> Secure
                  </div>
                )}
              </div>

              {assessment.description && (
                <p className="assessment-card-description">{assessment.description}</p>
              )}

              <div className="assessment-card-stats">
                <div className="card-stat">
                  <FiList className="stat-icon-small" />
                  <span>{assessment.questions?.length || 0} Questions</span>
                </div>
                <div className="card-stat">
                  <FiClock className="stat-icon-small" />
                  <span>{assessment.duration} min</span>
                </div>
                <div className="card-stat">
                  <FiUsers className="stat-icon-small" />
                  <span>{assessment.allowedUsers?.length || 0} Users</span>
                </div>
                <div className="card-stat">
                  <FiTarget className="stat-icon-small" />
                  <span>{assessment.passingScore}% Pass</span>
                </div>
              </div>

              <div className="assessment-card-actions">
                <button
                  onClick={() => handleEdit(assessment)}
                  className="btn-secondary"
                >
                  <FiEdit3 /> Edit
                </button>
                <button
                  onClick={() => handleDelete(assessment._id)}
                  className="btn-danger"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <AssessmentModal
          formData={formData}
          setFormData={setFormData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          fetchUsers={fetchUsers}
          editingAssessment={editingAssessment}
        />
      )}
    </div>
  );
};

// Modal Component
const AssessmentModal = ({
  formData,
  setFormData,
  activeTab,
  setActiveTab,
  onClose,
  onSave,
  fetchUsers,
  editingAssessment
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'access') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const users = await fetchUsers();
    setAllUsers(users);
    setLoadingUsers(false);
  };

  const DEPARTMENTS = [
    'Administration', 'Human Resources (HR)', 'Finance & Accounting', 'Sales',
    'Marketing', 'Customer Support / Service', 'Operations / Project Management',
    'Legal & Compliance', 'Procurement / Purchasing', 'Research & Development (R&D)',
    'Information Technology (IT)', 'Quality Assurance (QA)', 'Business Development',
    'Public Relations (PR)', 'Training & Development'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {editingAssessment ? `Edit: ${formData.title}` : 'Create New Assessment'}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <FiX />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            onClick={() => setActiveTab('questions')}
            className={`modal-tab ${activeTab === 'questions' ? 'active' : ''}`}
          >
            <FiList /> Questions & Answers
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`modal-tab ${activeTab === 'access' ? 'active' : ''}`}
          >
            <FiUsers /> User Access Control
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {activeTab === 'questions' ? (
            <QuestionsTab
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <AccessTab
              formData={formData}
              setFormData={setFormData}
              allUsers={allUsers}
              loadingUsers={loadingUsers}
              departments={DEPARTMENTS}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={onSave} className="btn-primary">
            <FiSave /> Save Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// Questions Tab Component
const QuestionsTab = ({ formData, setFormData }) => {
  const addQuestion = () => {
    const newQuestion = {
      question: '',
      questionType: 'multiple-choice',
      options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      correctAnswer: '',
      points: 1,
      order: formData.questions.length
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  return (
    <div className="questions-tab">
      {/* Basic Info */}
      <div className="form-section">
        <h3 className="section-title">Assessment Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Assessment Title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Passing Score (%)</label>
            <input
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 60 })}
              min="0"
              max="100"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Assessment Description"
            rows="2"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Instructions for the assessment"
            rows="3"
            className="form-textarea"
          />
        </div>
      </div>

      {/* Security Settings */}
      <div className="form-section">
        <h3 className="section-title">Security Settings</h3>
        <div className="security-settings-grid">
          {Object.keys(formData.security).map((key) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.security[key]}
                onChange={(e) => setFormData({
                  ...formData,
                  security: { ...formData.security, [key]: e.target.checked }
                })}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="form-section">
        <div className="section-header">
          <h3 className="section-title">Questions</h3>
          <button onClick={addQuestion} className="btn-small">
            <FiPlus /> Add Question
          </button>
        </div>

        <div className="questions-list">
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {qIndex + 1}</span>
                {formData.questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="btn-icon-danger"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>

              <div className="question-body">
                <div className="form-group">
                  <label>Question Text *</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter your question"
                    rows="2"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Question Type</label>
                  <select
                    value={question.questionType}
                    onChange={(e) => updateQuestion(qIndex, 'questionType', e.target.value)}
                    className="form-select"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="single-choice">Single Choice</option>
                    <option value="text">Short Answer</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>

                {(question.questionType === 'multiple-choice' || question.questionType === 'single-choice') && (
                  <div className="form-group">
                    <label>Options</label>
                    <div className="options-list">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-item">
                          <input
                            type={question.questionType === 'single-choice' ? 'radio' : 'checkbox'}
                            checked={option.isCorrect}
                            onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                            className="option-checkbox"
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="option-input"
                          />
                          {question.options.length > 2 && (
                            <button
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="btn-icon-small"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(qIndex)}
                        className="btn-link"
                      >
                        <FiPlus /> Add Option
                      </button>
                    </div>
                  </div>
                )}

                {(question.questionType === 'text' || question.questionType === 'essay') && (
                  <div className="form-group">
                    <label>Correct Answer</label>
                    <input
                      type="text"
                      value={question.correctAnswer || ''}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      placeholder="Enter correct answer (optional for essay)"
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    value={question.points || 1}
                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                    min="1"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.questions.length === 0 && (
            <div className="empty-questions">
              <FiFileText className="empty-icon" />
              <p>No questions added yet</p>
              <button onClick={addQuestion} className="btn-link">
                Add your first question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Access Tab Component
const AccessTab = ({ formData, setFormData, allUsers, loadingUsers, departments }) => {
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = allUsers.filter(user =>
    user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.employeeId?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const toggleUser = (userId) => {
    const currentUsers = formData.allowedUsers || [];
    if (currentUsers.includes(userId)) {
      setFormData({
        ...formData,
        allowedUsers: currentUsers.filter(id => id !== userId)
      });
    } else {
      setFormData({
        ...formData,
        allowedUsers: [...currentUsers, userId]
      });
    }
  };

  const toggleDepartment = (dept) => {
    const currentDepts = formData.allowedDepartments || [];
    if (currentDepts.includes(dept)) {
      setFormData({
        ...formData,
        allowedDepartments: currentDepts.filter(d => d !== dept)
      });
    } else {
      setFormData({
        ...formData,
        allowedDepartments: [...currentDepts, dept]
      });
    }
  };

  return (
    <div className="access-tab">
      <div className="form-section">
        <h3 className="section-title">Date Range</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Allowed Users</h3>
        <p className="section-description">
          Select specific users who can access this assessment. Leave empty to allow all users.
        </p>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="users-list">
          {loadingUsers ? (
            <div className="loading-text">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-text">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <label key={user._id} className="user-item">
                <input
                  type="checkbox"
                  checked={formData.allowedUsers?.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                  className="checkbox-input"
                />
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-details">{user.email} {user.employeeId && `• ${user.employeeId}`}</div>
                </div>
              </label>
            ))
          )}
        </div>
        {formData.allowedUsers?.length > 0 && (
          <div className="selection-count">
            {formData.allowedUsers.length} user(s) selected
          </div>
        )}
      </div>

      <div className="form-section">
        <h3 className="section-title">Allowed Departments</h3>
        <p className="section-description">
          Select departments that can access this assessment. Leave empty to allow all departments.
        </p>
        <div className="departments-list">
          {departments.map((dept) => (
            <label key={dept} className="department-item">
              <input
                type="checkbox"
                checked={formData.allowedDepartments?.includes(dept)}
                onChange={() => toggleDepartment(dept)}
                className="checkbox-input"
              />
              <span>{dept}</span>
            </label>
          ))}
        </div>
        {formData.allowedDepartments?.length > 0 && (
          <div className="selection-count">
            {formData.allowedDepartments.length} department(s) selected
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
