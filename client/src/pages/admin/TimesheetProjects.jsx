import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiX, FiCheckCircle, FiXCircle,
  FiBriefcase, FiCalendar, FiSearch, FiRefreshCw
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import './TimesheetProjects.css';

// Initial Team Members Form Component
const InitialTeamMembersForm = ({ employees, teamMembers, onAdd, onRemove }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [role, setRole] = useState('Contributor');
  const [allocation, setAllocation] = useState(100);

  const availableEmployees = employees.filter(emp => {
    return !teamMembers.some(member => member.userId === emp._id);
  });

  const handleAdd = () => {
    if (!selectedEmployee) {
      Swal.fire('Validation Error', 'Please select an employee', 'warning');
      return;
    }
    onAdd({
      userId: selectedEmployee,
      role: role,
      allocation: allocation
    });
    setSelectedEmployee('');
    setRole('Contributor');
    setAllocation(100);
  };

  return (
    <div className="initial-team-form">
      <div className="form-row">
        <div className="form-group">
          <label>Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="form-input"
          >
            <option value="">Select Employee</option>
            {availableEmployees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name || `${emp.firstName} ${emp.lastName}`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="Contributor">Contributor</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Tester">Tester</option>
            <option value="Manager">Manager</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
        <div className="form-group">
          <label>Allocation (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={allocation}
            onChange={(e) => setAllocation(Number(e.target.value))}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>&nbsp;</label>
          <button onClick={handleAdd} className="btn-add-member-small">
            <FiPlus /> Add
          </button>
        </div>
      </div>
      
      {teamMembers.length > 0 && (
        <div className="initial-team-list">
          <h4>Team Members to Add ({teamMembers.length})</h4>
          <div className="team-chips">
            {teamMembers.map((member, index) => {
              const emp = employees.find(e => e._id === member.userId);
              const empName = emp ? (emp.name || `${emp.firstName} ${emp.lastName}`) : 'Unknown';
              return (
                <div key={index} className="team-chip">
                  <span>{empName} ({member.role}, {member.allocation}%)</span>
                  <button onClick={() => onRemove(index)} className="chip-remove">
                    <FiX />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const TimesheetProjects = () => {
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [projectForm, setProjectForm] = useState({
    name: '',
    code: '',
    client: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    neverEnds: false,
    billable: true,
    projectManager: ''
  });
  
  const [initialTeamMembers, setInitialTeamMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.getProjectsAdmin, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projectsList = Array.isArray(res.data?.data) ? res.data.data : 
                           Array.isArray(res.data) ? res.data : [];
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Swal.fire('Error', 'Failed to load projects', 'error');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }

    try {
      const projectData = {
        ...projectForm,
        endDate: projectForm.neverEnds ? null : projectForm.endDate || null
      };
      
      const res = await axios.post(API_ENDPOINTS.createProject, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add initial team members if any
      if (initialTeamMembers.length > 0 && res.data?.data?._id) {
        for (const member of initialTeamMembers) {
          try {
            await axios.post(API_ENDPOINTS.assignProjectMember(res.data.data._id), {
              userId: member.userId,
              role: member.role || 'Contributor',
              allocation: member.allocation || 100
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            console.error('Error adding team member:', err);
          }
        }
      }
      
      Swal.fire('Success', 'Project created successfully', 'success');
      setShowCreateModal(false);
      setProjectForm({
        name: '',
        code: '',
        client: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: '',
        endDate: '',
        neverEnds: false,
        billable: true,
        projectManager: ''
      });
      setInitialTeamMembers([]);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to create project', 'error');
    }
  };

  const handleEditProject = async () => {
    if (!projectForm.name.trim()) {
      Swal.fire('Validation Error', 'Project name is required', 'warning');
      return;
    }

    try {
      const projectData = {
        ...projectForm,
        endDate: projectForm.neverEnds ? null : projectForm.endDate || null
      };
      
      await axios.put(API_ENDPOINTS.updateProject(selectedProject._id), projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire('Success', 'Project updated successfully', 'success');
      setShowEditModal(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to update project', 'error');
    }
  };

  const handleDeleteProject = async (projectId) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: 'Are you sure you want to delete this project? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(API_ENDPOINTS.deleteProject(projectId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire('Deleted!', 'Project has been deleted.', 'success');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        Swal.fire('Error', 'Failed to delete project', 'error');
      }
    }
  };

  const handleAddTeamMember = async (projectId, userId, role = 'Contributor', allocation = 100) => {
    try {
      await axios.post(API_ENDPOINTS.assignProjectMember(projectId), {
        userId: userId,
        role: role,
        allocation: allocation
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire('Success', 'Team member added successfully', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error adding team member:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to add team member', 'error');
    }
  };

  const handleRemoveTeamMember = async (projectId, userId) => {
    const result = await Swal.fire({
      title: 'Remove Team Member?',
      text: 'Are you sure you want to remove this team member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(API_ENDPOINTS.removeProjectMember(projectId, userId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire('Removed!', 'Team member has been removed.', 'success');
        fetchProjects();
      } catch (error) {
        console.error('Error removing team member:', error);
        Swal.fire('Error', 'Failed to remove team member', 'error');
      }
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    const hasEndDate = project.endDate && !project.neverEnds;
    setProjectForm({
      name: project.name || '',
      code: project.code || '',
      client: project.client || '',
      description: project.description || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: hasEndDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      neverEnds: project.neverEnds || (!project.endDate),
      billable: project.billable !== undefined ? project.billable : true,
      projectManager: project.projectManager?._id || project.projectManager || ''
    });
    setShowEditModal(true);
  };

  const openTeamModal = (project) => {
    setSelectedProject(project);
    setShowTeamModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      planning: { label: 'Planning', class: 'badge-planning' },
      active: { label: 'Active', class: 'badge-active' },
      'on-hold': { label: 'On Hold', class: 'badge-onhold' },
      completed: { label: 'Completed', class: 'badge-completed' },
      archived: { label: 'Archived', class: 'badge-archived' }
    };
    return badges[status] || badges.planning;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: { label: 'Low', class: 'badge-priority-low' },
      medium: { label: 'Medium', class: 'badge-priority-medium' },
      high: { label: 'High', class: 'badge-priority-high' },
      critical: { label: 'Critical', class: 'badge-priority-critical' }
    };
    return badges[priority] || badges.medium;
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.name?.toLowerCase().includes(query) ||
      project.code?.toLowerCase().includes(query) ||
      project.client?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="timesheet-projects-page">
      <div className="projects-header">
        <div>
          <h1>Timesheet Projects</h1>
          <p>Manage projects and assign team members for timesheet tracking</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchProjects} className="btn-refresh">
            <FiRefreshCw /> Refresh
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-create-project">
            <FiPlus /> Create Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects by name, code, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Project Name</th>
                <th>Code</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Billable</th>
                <th>Team Members</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    <FiBriefcase />
                    <p>No projects found. Create your first project to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => {
                  const statusBadge = getStatusBadge(project.status);
                  const priorityBadge = getPriorityBadge(project.priority);
                  const teamMembers = project.teamMembers || [];
                  
                  return (
                    <tr key={project._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="project-name-cell">
                          <FiBriefcase className="project-icon" />
                          <span className="project-name">{project.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="project-code">{project.code || '-'}</span>
                      </td>
                      <td>{project.client || '-'}</td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${priorityBadge.class}`}>
                          {priorityBadge.label}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${project.billable !== false ? 'badge-billable' : 'badge-nonbillable'}`}>
                          {project.billable !== false ? 'Billable' : 'Non-Billable'}
                        </span>
                      </td>
                      <td>
                        <div className="team-members-cell">
                          <button
                            onClick={() => openTeamModal(project)}
                            className="btn-team-members"
                            title={`${teamMembers.length} team member(s)`}
                          >
                            <FiUsers /> {teamMembers.length}
                          </button>
                        </div>
                      </td>
                      <td>
                        {project.startDate
                          ? new Date(project.startDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        {project.neverEnds
                          ? 'Never Ends'
                          : project.endDate
                          ? new Date(project.endDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => openTeamModal(project)}
                            className="btn-action btn-team"
                            title="Manage Team"
                          >
                            <FiUsers />
                          </button>
                          <button
                            onClick={() => openEditModal(project)}
                            className="btn-action btn-edit"
                            title="Edit Project"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="btn-action btn-delete"
                            title="Delete Project"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Project Code</label>
                <input
                  type="text"
                  value={projectForm.code}
                  onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value.toUpperCase() })}
                  className="form-input"
                  placeholder="Auto-generated if left empty"
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  value={projectForm.client}
                  onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                  className="form-input"
                  placeholder="Enter client name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Enter project description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Project Manager</label>
                <select
                  value={projectForm.projectManager}
                  onChange={(e) => setProjectForm({ ...projectForm, projectManager: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Project Manager</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name || `${emp.firstName} ${emp.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    className="form-input"
                    disabled={projectForm.neverEnds}
                  />
                  <label className="checkbox-label" style={{ marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={projectForm.neverEnds}
                      onChange={(e) => setProjectForm({ ...projectForm, neverEnds: e.target.checked, endDate: e.target.checked ? '' : projectForm.endDate })}
                    />
                    Project never ends
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={projectForm.billable}
                    onChange={(e) => setProjectForm({ ...projectForm, billable: e.target.checked })}
                  />
                  Billable Project
                </label>
                <small className="form-hint">If unchecked, this project will be marked as non-billable</small>
              </div>
              
              {/* Initial Team Members Section */}
              <div className="initial-team-section">
                <h3>Add Initial Team Members</h3>
                <InitialTeamMembersForm
                  employees={employees}
                  teamMembers={initialTeamMembers}
                  onAdd={(member) => setInitialTeamMembers([...initialTeamMembers, member])}
                  onRemove={(index) => setInitialTeamMembers(initialTeamMembers.filter((_, i) => i !== index))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                setShowCreateModal(false);
                setInitialTeamMembers([]);
              }} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleCreateProject} className="btn-submit">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Project</h2>
              <button onClick={() => setShowEditModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Project Code</label>
                <input
                  type="text"
                  value={projectForm.code}
                  onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value.toUpperCase() })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  value={projectForm.client}
                  onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Project Manager</label>
                <select
                  value={projectForm.projectManager}
                  onChange={(e) => setProjectForm({ ...projectForm, projectManager: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Project Manager</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name || `${emp.firstName} ${emp.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    className="form-input"
                    disabled={projectForm.neverEnds}
                  />
                  <label className="checkbox-label" style={{ marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={projectForm.neverEnds}
                      onChange={(e) => setProjectForm({ ...projectForm, neverEnds: e.target.checked, endDate: e.target.checked ? '' : projectForm.endDate })}
                    />
                    Project never ends
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={projectForm.billable}
                    onChange={(e) => setProjectForm({ ...projectForm, billable: e.target.checked })}
                  />
                  Billable Project
                </label>
                <small className="form-hint">If unchecked, this project will be marked as non-billable</small>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEditModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleEditProject} className="btn-submit">
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamModal && selectedProject && (
        <TeamMembersModal
          project={selectedProject}
          employees={employees}
          onAddMember={handleAddTeamMember}
          onRemoveMember={handleRemoveTeamMember}
          onClose={() => {
            setShowTeamModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

// Team Members Modal Component
const TeamMembersModal = ({ project, employees, onAddMember, onRemoveMember, onClose }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [role, setRole] = useState('Contributor');
  const [allocation, setAllocation] = useState(100);

  const teamMembers = project.teamMembers || [];
  const availableEmployees = employees.filter(emp => {
    return !teamMembers.some(member => 
      (member.user?._id || member.user) === emp._id
    );
  });

  const handleAdd = () => {
    if (!selectedEmployee) {
      Swal.fire('Validation Error', 'Please select an employee', 'warning');
      return;
    }
    onAddMember(project._id, selectedEmployee, role, allocation);
    setSelectedEmployee('');
    setRole('Contributor');
    setAllocation(100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Team Members - {project.name}</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {/* Add Team Member Form */}
          <div className="add-team-section">
            <h3>Add Team Member</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Employee</option>
                  {availableEmployees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name || `${emp.firstName} ${emp.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                >
                  <option value="Contributor">Contributor</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Tester">Tester</option>
                  <option value="Manager">Manager</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              <div className="form-group">
                <label>Allocation (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={allocation}
                  onChange={(e) => setAllocation(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>&nbsp;</label>
                <button onClick={handleAdd} className="btn-add-member">
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="team-members-list">
            <h3>Current Team Members ({teamMembers.length})</h3>
            {teamMembers.length === 0 ? (
              <div className="empty-team">
                <FiUsers />
                <p>No team members assigned yet</p>
              </div>
            ) : (
              <table className="team-members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Allocation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member, index) => {
                    const user = member.user;
                    const userName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown';
                    
                    return (
                      <tr key={index}>
                        <td>{userName}</td>
                        <td>
                          <span className="member-role">{member.role || 'Contributor'}</span>
                        </td>
                        <td>{member.allocation || 100}%</td>
                        <td>
                          <button
                            onClick={() => onRemoveMember(project._id, user?._id || member.user)}
                            className="btn-remove-member"
                            title="Remove from project"
                          >
                            <FiXCircle />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetProjects;
