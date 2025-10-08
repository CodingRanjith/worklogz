import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEye, FiSearch, FiPlus, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, createTask, getAllTasksWithFilters } from '../../utils/api';

const TaskManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userTaskCounts, setUserTaskCounts] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    assigneeName: '',
    reporter: '',
    startTime: new Date().toISOString().split('T')[0],
    endTime: new Date().toISOString().split('T')[0],
    status: 'backlog'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

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
      const usersData = data.users || data || [];
      setUsers(usersData);
      
      // Fetch task counts for each user
      await fetchUserTaskCounts(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTaskCounts = async (usersData) => {
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
            console.error(`Error fetching tasks for user ${user._id}:`, error);
            taskCounts[user._id] = {
              total: 0, done: 0, pending: 0, todo: 0, doing: 0, backlog: 0
            };
          }
        })
      );
      
      setUserTaskCounts(taskCounts);
    } catch (error) {
      console.error('Error fetching user task counts:', error);
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

  const getRandomGradient = (index) => {
    const gradients = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
    ];
    return gradients[index % gradients.length];
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
    setTaskForm({
      title: '',
      description: '',
      assigneeId: '',
      assigneeName: '',
      reporter: '',
      startTime: new Date().toISOString().split('T')[0],
      endTime: new Date().toISOString().split('T')[0],
      status: 'backlog'
    });
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

    if (!taskForm.assigneeId) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select an assignee',
      });
      return;
    }

    try {
      setCreateTaskLoading(true);
      const token = localStorage.getItem('token');
      
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        assignee: taskForm.assigneeName,
        reporter: taskForm.reporter || 'Admin',
        startTime: taskForm.startTime,
        endTime: taskForm.endTime,
        status: taskForm.status,
        userId: taskForm.assigneeId, // Add userId for backend filtering
      };

      await createTask(taskData, token);
      
      // Refresh task counts for the assigned user
      await fetchUserTaskCounts(users);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Task created successfully for ${taskForm.assigneeName}`,
        timer: 3000,
        showConfirmButton: false,
      });

      setShowCreateModal(false);
      // Reset form
      setTaskForm({
        title: '',
        description: '',
        assigneeId: '',
        assigneeName: '',
        reporter: '',
        startTime: new Date().toISOString().split('T')[0],
        endTime: new Date().toISOString().split('T')[0],
        status: 'backlog'
      });
      
    } catch (error) {
      console.error('Error creating task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create task. Please try again.',
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
              <p className="text-gray-600">Manage and view employee timesheets and tasks</p>
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
              <div className={`${getRandomGradient(index)} p-6 text-white relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name || 'Unknown'}</h3>
                      <p className="text-sm opacity-90">ID: {user.employeeId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="mr-3 text-gray-400" />
                    <span className="truncate">{user.email || 'No email'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="mr-3 text-gray-400" />
                    <span>{user.phone || 'No phone'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <FiUser className="mr-3 text-gray-400" />
                    <span className="capitalize">{user.role || 'Employee'}</span>
                  </div>

                  {user.department && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-3 text-gray-400" />
                      <span>{user.department}</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
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
              {/* Assignee Selection */}
              {!taskForm.assigneeId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Assignee *
                  </label>
                  <select
                    value={taskForm.assigneeId}
                    onChange={(e) => {
                      const selectedUser = users.find(u => u._id === e.target.value);
                      handleFormChange('assigneeId', e.target.value);
                      handleFormChange('assigneeName', selectedUser ? selectedUser.name : '');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose an employee...</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.employeeId || 'No ID'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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