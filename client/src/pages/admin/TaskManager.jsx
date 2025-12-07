import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEye, FiSearch, FiPlus, FiX, FiBriefcase } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS, createTask, getAllTasksWithFilters } from '../../utils/api';

// Company departments list (matching CompanyDepartments.jsx)
const COMPANY_DEPARTMENTS = [
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

const TaskManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userTaskCounts, setUserTaskCounts] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [teamMemberIds, setTeamMemberIds] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    assigneeName: '',
    selectedUserIds: [], // Array of selected user IDs for multi-user assignment
    department: '',
    reporter: '',
    startTime: new Date().toISOString().split('T')[0],
    endTime: new Date().toISOString().split('T')[0],
    status: 'backlog'
  });
  const [userSearchTerm, setUserSearchTerm] = useState(''); // For filtering users in multi-select
  const navigate = useNavigate();

  // Check user role and team lead status
  useEffect(() => {
    const checkUserRoleAndTeams = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Decode token to get user role and ID
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded.id || decoded._id;
        const userRole = decoded.role;
        setCurrentUserRole(userRole);

        // If user is admin, they can see all users
        if (userRole === 'admin') {
          setIsTeamLead(false);
          setTeamMemberIds([]);
          return;
        }

        // Check if user is a team lead
        const response = await axios.get(API_ENDPOINTS.getMyTeams, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const teams = response.data || [];
        
        // Check if user is a team lead in any team
        const userIsTeamLead = teams.some(team => {
          const teamLeadId = team.teamLead?._id || team.teamLead;
          return teamLeadId && (teamLeadId.toString() === userId.toString() || teamLeadId === userId);
        });

        if (userIsTeamLead) {
          setIsTeamLead(true);
          // Collect all team member IDs from teams where user is team lead
          const memberIds = new Set();
          teams.forEach(team => {
            const teamLeadId = team.teamLead?._id || team.teamLead;
            if (teamLeadId && (teamLeadId.toString() === userId.toString() || teamLeadId === userId)) {
              // Add all members of this team
              if (team.members && Array.isArray(team.members)) {
                team.members.forEach(member => {
                  const memberId = member._id || member;
                  if (memberId && memberId.toString() !== userId.toString()) {
                    memberIds.add(memberId.toString());
                  }
                });
              }
            }
          });
          setTeamMemberIds(Array.from(memberIds));
        } else {
          setIsTeamLead(false);
          setTeamMemberIds([]);
        }
      } catch (error) {
        console.error('Error checking user role and teams:', error);
        setIsTeamLead(false);
        setTeamMemberIds([]);
      }
    };

    checkUserRoleAndTeams();
  }, []);

  useEffect(() => {
    if (currentUserRole !== null) { // Only fetch after role is determined
      fetchUsers();
    }
  }, [teamMemberIds, isTeamLead, currentUserRole]);

  useEffect(() => {
    let filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedDepartment]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && !loading) {
      const interval = setInterval(() => {
        fetchUserTaskCounts(users, true); // Refresh task counts silently
        setLastUpdated(Date.now());
      }, 30000); // Refresh every 30 seconds

      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, loading, users]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getUsers, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      let usersData = data.users || data || [];
      
      // Only filter if user is a team lead AND not an admin
      // Admins should always see all users without any filtering
      if (currentUserRole === 'admin') {
        // Admin: show all users, no filtering
        setUsers(usersData);
      } else if (isTeamLead && teamMemberIds.length > 0) {
        // Team lead: filter to only show team members
        usersData = usersData.filter(user => {
          const userId = user._id || user.id;
          return teamMemberIds.includes(userId.toString());
        });
        setUsers(usersData);
      } else {
        // Regular employee or no team members: show empty list
        // Only admins and team leads should access this page
        setUsers([]);
      }
      
      // Fetch task counts for each user
      await fetchUserTaskCounts(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTaskCounts = async (usersData, silent = false) => {
    try {
      const token = localStorage.getItem('token');
      const taskCounts = {};
      
      // Fetch tasks for each user
      await Promise.all(
        usersData.map(async (user) => {
          try {
            const response = await getAllTasksWithFilters({ userId: user._id }, token);
            const tasks = response.tasks || response || [];
            
            taskCounts[user._id] = {
              total: tasks.length,
              done: tasks.filter(t => t.status === 'done').length,
              pending: tasks.filter(t => t.status !== 'done').length,
              todo: tasks.filter(t => t.status === 'todo').length,
              doing: tasks.filter(t => t.status === 'doing').length,
              backlog: tasks.filter(t => t.status === 'backlog').length,
            };
          } catch (error) {
            if (!silent) {
              console.error(`Error fetching tasks for user ${user._id}:`, error);
            }
            taskCounts[user._id] = {
              total: 0, done: 0, pending: 0, todo: 0, doing: 0, backlog: 0
            };
          }
        })
      );
      
      // Only update if there are actual changes
      setUserTaskCounts(prevCounts => {
        const hasChanges = Object.keys(taskCounts).some(userId => {
          const prev = prevCounts[userId] || {};
          const current = taskCounts[userId] || {};
          return JSON.stringify(prev) !== JSON.stringify(current);
        });
        
        return hasChanges ? taskCounts : prevCounts;
      });
    } catch (error) {
      if (!silent) {
        console.error('Error fetching user task counts:', error);
      }
    }
  };

  const handleViewTimesheet = (userId, userName) => {
    // Navigate to user's timesheet - we'll create this route later
    navigate(`/user-timesheet/${userId}`, { 
      state: { userName: userName } 
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      await fetchUsers();
      setLastUpdated(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
    setTaskForm({
      title: '',
      description: '',
      assigneeId: '',
      assigneeName: '',
      selectedUserIds: [],
      department: '',
      reporter: '',
      startTime: new Date().toISOString().split('T')[0],
      endTime: new Date().toISOString().split('T')[0],
      status: 'backlog'
    });
    setUserSearchTerm('');
  };

  const toggleUserSelection = (userId) => {
    setTaskForm(prev => {
      const isSelected = prev.selectedUserIds.includes(userId);
      return {
        ...prev,
        selectedUserIds: isSelected
          ? prev.selectedUserIds.filter(id => id !== userId)
          : [...prev.selectedUserIds, userId]
      };
    });
  };

  const selectAllUsers = () => {
    setTaskForm(prev => ({
      ...prev,
      selectedUserIds: filteredUsers.map(u => u._id)
    }));
  };

  const clearUserSelection = () => {
    setTaskForm(prev => ({
      ...prev,
      selectedUserIds: []
    }));
  };



  const handleFormChange = (field, value) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskForm.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Task title is required',
      });
      return;
    }

    // Check if at least one user is selected
    if (!taskForm.selectedUserIds || taskForm.selectedUserIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select at least one user to assign this task',
      });
      return;
    }

    try {
      setCreateTaskLoading(true);
      const token = localStorage.getItem('token');
      
      // Filter selected users - ensure team leads can only assign to their team members
      const selectedUsers = users.filter(u => taskForm.selectedUserIds.includes(u._id));
      
      // Additional validation for team leads: ensure all selected users are in their team
      if (currentUserRole !== 'admin' && isTeamLead && teamMemberIds.length > 0) {
        const invalidUsers = selectedUsers.filter(user => {
          const userId = user._id || user.id;
          return !teamMemberIds.includes(userId.toString());
        });
        
        if (invalidUsers.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'You can only assign tasks to your team members',
          });
          setCreateTaskLoading(false);
          return;
        }
      }
      const createdTasks = [];
      const errors = [];

      // Create task for each selected user
      for (const user of selectedUsers) {
        try {
          const taskData = {
            title: taskForm.title,
            description: taskForm.description,
            assignee: user.name,
            department: taskForm.department || '',
            reporter: taskForm.reporter || 'Admin',
            startTime: taskForm.startTime,
            endTime: taskForm.endTime,
            status: taskForm.status,
            userId: user._id, // Each task is assigned to a specific user
          };

          const createdTask = await createTask(taskData, token);
          createdTasks.push({ user: user.name, task: createdTask });
        } catch (error) {
          console.error(`Error creating task for ${user.name}:`, error);
          errors.push(user.name);
        }
      }
      
      // Immediate refresh of task counts for real-time update
      await fetchUserTaskCounts(users);
      setLastUpdated(Date.now());
      
      // Show success/error message
      if (createdTasks.length > 0 && errors.length === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Task created successfully for ${createdTasks.length} user(s)`,
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else if (createdTasks.length > 0 && errors.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Partial Success',
          text: `Task created for ${createdTasks.length} user(s), but failed for ${errors.length} user(s)`,
          timer: 4000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create tasks for all selected users',
        });
        return;
      }

      setShowCreateModal(false);
      // Reset form
      setTaskForm({
        title: '',
        description: '',
        assigneeId: '',
        assigneeName: '',
        selectedUserIds: [],
        department: '',
        reporter: '',
        startTime: new Date().toISOString().split('T')[0],
        endTime: new Date().toISOString().split('T')[0],
        status: 'backlog'
      });
      setUserSearchTerm('');
      
    } catch (error) {
      console.error('Error creating tasks:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create tasks. Please try again.',
      });
    } finally {
      setCreateTaskLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
                {isTeamLead && currentUserRole !== 'admin' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    Team Lead View
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {isTeamLead && currentUserRole !== 'admin' 
                  ? 'Manage and view tasks for your team members only'
                  : 'Manage and view employee timesheets and tasks'}
              </p>
            </div>
            <button
              onClick={handleCreateTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <FiPlus />
              Create Task
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <FiBriefcase className="text-gray-500" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm min-w-[180px]"
                >
                  <option value="">All Departments</option>
                  {COMPANY_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {selectedDepartment && (
                  <button
                    onClick={() => setSelectedDepartment('')}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-700 underline"
                    title="Clear Department Filter"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Live Status & Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-gray-600">
                  {autoRefresh ? 'Live' : 'Manual'}
                </span>
                <button
                  onClick={toggleAutoRefresh}
                  className={`px-2 py-1 text-xs rounded ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <button
                onClick={handleManualRefresh}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
                title="Manual Refresh"
              >
                <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>🔄</div>
                Refresh
              </button>
              
              <div className="text-xs text-gray-500">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Total Users: {users.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Filtered: {filteredUsers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{user.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-600">ID: {user.employeeId || 'N/A'}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      user.isActive !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="mr-3 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{user.email || 'No email'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="mr-3 text-indigo-500 flex-shrink-0" />
                    <span>{user.phone || 'No phone'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiUser className="mr-3 text-indigo-500 flex-shrink-0" />
                    <span className="capitalize">{user.role || 'Employee'}</span>
                  </div>

                  {user.department && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-3 text-indigo-500 flex-shrink-0" />
                      <span>{user.department}</span>
                    </div>
                  )}
                </div>

                {/* Task Statistics */}
                {userTaskCounts[user._id] && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Task Overview</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium text-gray-900">{userTaskCounts[user._id].total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Done:</span>
                        <span className="font-medium text-green-600">{userTaskCounts[user._id].done}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress:</span>
                        <span className="font-medium text-yellow-600">{userTaskCounts[user._id].doing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-medium text-red-600">{userTaskCounts[user._id].pending}</span>
                      </div>
                    </div>
                    {userTaskCounts[user._id].total > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Completion:</span>
                          <span className="font-medium text-indigo-600">
                            {Math.round((userTaskCounts[user._id].done / userTaskCounts[user._id].total) * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{
                              width: `${(userTaskCounts[user._id].done / userTaskCounts[user._id].total) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleViewTimesheet(user._id, user.name)}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <FiEye />
                  View Timesheet
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'No users available at the moment'}
            </p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="p-6 space-y-6">
              {/* Multi-User Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Users to Assign Task * ({taskForm.selectedUserIds.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllUsers}
                      className="text-xs px-2 py-1 text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearUserSelection}
                      className="text-xs px-2 py-1 text-gray-600 hover:text-gray-700 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                {/* User Search Filter */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                {/* User Selection List */}
                <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                  {users
                    .filter(user => 
                      !userSearchTerm || 
                      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      (user.employeeId && user.employeeId.toLowerCase().includes(userSearchTerm.toLowerCase()))
                    )
                    .map((user) => {
                      const isSelected = taskForm.selectedUserIds.includes(user._id);
                      // Debug: Log user data to check employeeId
                      if (!user.employeeId) {
                        console.log('User without employeeId:', user.name, user);
                      }
                      return (
                        <div
                          key={user._id}
                          onClick={() => toggleUserSelection(user._id)}
                          className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-indigo-50 border-indigo-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleUserSelection(user._id)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-gray-900">{user.name || 'Unknown'}</span>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded border-2 ${
                                  user.employeeId 
                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-400' 
                                    : 'bg-gray-100 text-gray-600 border-gray-400'
                                }`}>
                                  ID: {user.employeeId || 'N/A'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {user.email}
                                {user.department && ` • ${user.department}`}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="text-indigo-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  
                  {users.filter(user => 
                    !userSearchTerm || 
                    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                    user.employeeId?.toLowerCase().includes(userSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No users found matching "{userSearchTerm}"
                    </div>
                  )}
                </div>
                
                {taskForm.selectedUserIds.length > 0 && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="text-xs font-medium text-indigo-900 mb-2">
                      Selected Users ({taskForm.selectedUserIds.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {taskForm.selectedUserIds.map(id => {
                        const user = users.find(u => u._id === id);
                        if (!user) return null;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-indigo-300 rounded text-xs"
                          >
                            <span className="font-medium text-gray-900">{user.name}</span>
                            <span className={`font-semibold ${
                              user.employeeId ? 'text-indigo-600' : 'text-gray-500'
                            }`}>
                              ({user.employeeId || 'No ID'})
                            </span>
                          </div>
                        );
                      }).filter(Boolean)}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title..."
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task description..."
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={taskForm.department}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Department (Optional)</option>
                  {COMPANY_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reporter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter
                </label>
                <input
                  type="text"
                  value={taskForm.reporter}
                  onChange={(e) => handleFormChange('reporter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Reporter name (default: Admin)..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.startTime}
                    onChange={(e) => handleFormChange('startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.endTime}
                    onChange={(e) => handleFormChange('endTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status
                </label>
                <select
                  value={taskForm.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="doing">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTaskLoading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createTaskLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;