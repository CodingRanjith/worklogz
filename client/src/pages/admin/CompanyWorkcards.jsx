import React, { useState, useEffect } from 'react';
import { FiCalendar, FiEye, FiX, FiRefreshCw, FiUser, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { getAllTasksWithFilters, getTaskById, updateTask, deleteTask, API_ENDPOINTS } from '../../utils/api';

const CompanyWorkcards = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalLoading, setTaskModalLoading] = useState(false);
  
  // Action modal state (for employee name click)
  const [actionTask, setActionTask] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  
  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'backlog',
    startTime: '',
    endTime: '',
    reporter: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('done'); // Default to showing done tasks

  useEffect(() => {
    // Fetch users first, then use them to fetch all tasks
    const initializeData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch users first
        const usersResponse = await fetch(API_ENDPOINTS.getUsers, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const allUsers = usersData.users || usersData || [];
          setUsers(allUsers);
          
          // Then fetch all tasks using the users
          await fetchAllTasksForUsers(allUsers, token);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedDate, selectedEmployee, statusFilter, tasks]);

  const fetchAllTasksForUsers = async (usersList, token) => {
    try {
      setLoading(true);
      
      // Fetch tasks for all employees
      const allTasksPromises = usersList.map(async (user) => {
        try {
          const response = await getAllTasksWithFilters({ userId: user._id }, token);
          const tasks = response.tasks || response || [];
          return tasks;
        } catch (error) {
          console.error(`Error fetching tasks for user ${user._id}:`, error);
          return [];
        }
      });
      
      // Wait for all promises and flatten the results
      const tasksArrays = await Promise.all(allTasksPromises);
      const allTasks = tasksArrays.flat();
      
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch tasks. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    const token = localStorage.getItem('token');
    // Re-fetch users if needed, then fetch tasks
    try {
      const usersResponse = await fetch(API_ENDPOINTS.getUsers, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const allUsers = usersData.users || usersData || [];
        setUsers(allUsers);
        await fetchAllTasksForUsers(allUsers, token);
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUsers, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const usersData = data.users || data || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        // Pending = all statuses except 'done'
        filtered = filtered.filter(task => task.status !== 'done');
      } else {
        filtered = filtered.filter(task => task.status === statusFilter);
      }
    }

    // Filter by employee
    if (selectedEmployee) {
      filtered = filtered.filter(task => {
        const userId = task.user?._id || task.user;
        return userId === selectedEmployee;
      });
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(task => {
        const taskStartDate = task.startTime ? new Date(task.startTime).toISOString().split('T')[0] : null;
        const taskEndDate = task.endTime ? new Date(task.endTime).toISOString().split('T')[0] : null;
        const selectedDateStr = selectedDate;

        // Check if selected date falls between start and end date, or matches either
        if (taskStartDate && taskEndDate) {
          return selectedDateStr >= taskStartDate && selectedDateStr <= taskEndDate;
        } else if (taskStartDate) {
          return selectedDateStr === taskStartDate;
        } else if (taskEndDate) {
          return selectedDateStr === taskEndDate;
        }
        return false;
      });
    }

    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleClearFilters = () => {
    setSelectedDate('');
    setSelectedEmployee('');
    setStatusFilter('done'); // Reset to default (show done tasks)
  };

  // Pagination calculations
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEmployeeNameClick = async (task) => {
    try {
      // Use the task data we already have, but try to fetch full details if needed
      // For now, use the existing task data directly
      setActionTask(task);
      setShowActionModal(true);
      
      // Optionally fetch full details in the background for comments, etc.
      const token = localStorage.getItem('token');
      try {
        const fullTask = await getTaskById(task._id, token);
        // Update with full details if fetch succeeds
        setActionTask(fullTask);
      } catch (fetchError) {
        // If fetch fails (e.g., permission issue), continue with existing task data
        console.log('Could not fetch full task details, using existing data:', fetchError);
        // The modal will still work with the task data we already have
      }
    } catch (error) {
      console.error('Error opening action modal:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to open task actions. Please try again.',
      });
    }
  };

  const handleViewTask = async (taskId) => {
    try {
      // First, try to find the task in our existing tasks array
      const existingTask = tasks.find(t => t._id === taskId);
      
      if (existingTask) {
        // Use existing task data immediately
        setSelectedTask(existingTask);
        setShowTaskModal(true);
        setShowActionModal(false); // Close action modal if open
        setTaskModalLoading(false);
        
        // Optionally try to fetch full details in the background (for comments, etc.)
        const token = localStorage.getItem('token');
        try {
          const fullTask = await getTaskById(taskId, token);
          // Update with full details if fetch succeeds
          setSelectedTask(fullTask);
        } catch (fetchError) {
          // If fetch fails, continue with existing task data
          console.log('Could not fetch full task details, using existing data:', fetchError);
        }
      } else {
        // If task not found in existing data, try API call
        setTaskModalLoading(true);
        const token = localStorage.getItem('token');
        const task = await getTaskById(taskId, token);
        setSelectedTask(task);
        setShowTaskModal(true);
        setShowActionModal(false);
        setTaskModalLoading(false);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch task details. Please try again.',
      });
      setTaskModalLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'backlog',
      startTime: task.startTime ? new Date(task.startTime).toISOString().split('T')[0] : '',
      endTime: task.endTime ? new Date(task.endTime).toISOString().split('T')[0] : '',
      reporter: task.reporter || ''
    });
    setShowEditModal(true);
    setShowActionModal(false); // Close action modal if open
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    if (!editForm.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Task title is required',
      });
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem('token');
      
      await updateTask(editingTask._id, editForm, token);
      
      // Refresh tasks
      const usersList = users.length > 0 ? users : await fetch(API_ENDPOINTS.getUsers, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json()).then(data => data.users || data || []);
      
      await fetchAllTasksForUsers(usersList, token);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Task updated successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      setShowEditModal(false);
      setEditingTask(null);
      setShowActionModal(false); // Close action modal after edit
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task. Please try again.',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${taskTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await deleteTask(taskId, token);
        
        // Refresh tasks
        const usersList = users.length > 0 ? users : await fetch(API_ENDPOINTS.getUsers, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => res.json()).then(data => data.users || data || []);
        
        await fetchAllTasksForUsers(usersList, token);
        
        setShowActionModal(false); // Close action modal after delete
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Task has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete task. Please try again.',
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      backlog: { color: 'bg-gray-100 text-gray-800', label: 'Backlog' },
      todo: { color: 'bg-blue-100 text-blue-800', label: 'To Do' },
      doing: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
      done: { color: 'bg-green-100 text-green-800', label: 'Done' },
    };
    const config = statusConfig[status] || statusConfig.backlog;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Workcards</h1>
              <p className="text-gray-600">View all employee completed tasks and workcards</p>
            </div>
            <button
              onClick={fetchAllTasks}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
              <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="text-sm text-gray-600 mb-1">Done Tasks</div>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'done').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <div className="text-sm text-gray-600 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'doing').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="text-sm text-gray-600 mb-1">Pending Tasks</div>
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status !== 'done' && t.status !== 'doing').length}
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              
              {/* Employee Filter */}
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="">All Employees</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} {user.employeeId ? `(${user.employeeId})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm flex items-center gap-2"
                >
                  {selectedDate ? formatDate(selectedDate).split(',')[0] : 'Pick Date'}
                </button>
                {showDatePicker && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateSelect(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="done">Done</option>
                  <option value="doing">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="todo">To Do</option>
                  <option value="backlog">Backlog</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedDate || selectedEmployee || (statusFilter && statusFilter !== 'done')) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Total Tasks Count */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? 's' : ''} shown
                {statusFilter && statusFilter !== 'all' && (
                  <span className="ml-1 text-indigo-600">({statusFilter})</span>
                )}
              </div>
              {tasks.length > 0 && (
                <div className="text-xs text-gray-500">
                  (Total: <span className="font-medium">{tasks.length}</span> | 
                  Done: <span className="font-medium text-green-600">
                    {tasks.filter(t => t.status === 'done').length}
                  </span>)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col gap-2">
                      <span>SNo</span>
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded transition-colors flex items-center gap-1"
                          title="Pick Date to Filter Tasks"
                        >
                          <FiCalendar className="w-3 h-3" />
                          {selectedDate ? formatDate(selectedDate).split(',')[0] : 'Date'}
                        </button>
                        {showDatePicker && (
                          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                            <input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => handleDateSelect(e.target.value)}
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-4xl mb-4">📋</div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
                      <p className="text-gray-500">
                        {selectedDate || selectedEmployee || (statusFilter && statusFilter !== 'all')
                          ? 'No tasks match the selected filters'
                          : 'No tasks available at the moment'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentTasks.map((task, index) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstTask + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEmployeeNameClick(task)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors cursor-pointer"
                          title="Click to view actions"
                        >
                          {task.user?.name || task.assignee || 'N/A'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(task.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(task.endTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={task.title || 'N/A'}>
                          {task.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewTask(task._id)}
                            className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs"
                            title="View Details"
                          >
                            <FiEye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-xs"
                            title="Edit Task"
                          >
                            <FiEdit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id, task.title)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs"
                            title="Delete Task"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTasks.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{indexOfFirstTask + 1}</span> to{' '}
                  <span className="font-medium text-gray-900">
                    {Math.min(indexOfLastTask, filteredTasks.length)}
                  </span>{' '}
                  of <span className="font-medium text-gray-900">{filteredTasks.length}</span> tasks
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current
                        if (page === 1 || page === totalPages) return true;
                        if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <button
                              onClick={() => paginate(page)}
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                currentPage === page
                                  ? 'bg-indigo-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Task Details Modal */}
        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
                  <button
                    onClick={() => {
                      setShowTaskModal(false);
                      setSelectedTask(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {taskModalLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Task Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{selectedTask.title || 'N/A'}</p>
                  </div>

                  {/* Employee Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                      </label>
                      <p className="text-gray-900">{selectedTask.user?.name || selectedTask.assignee || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Email
                      </label>
                      <p className="text-gray-900">{selectedTask.user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <p className="text-gray-900">{formatDate(selectedTask.startTime)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <p className="text-gray-900">{formatDate(selectedTask.endTime)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedTask.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Status and Reporter */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div>{getStatusBadge(selectedTask.status)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reporter
                      </label>
                      <p className="text-gray-900">{selectedTask.reporter || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <p className="text-gray-900">
                      {selectedTask.createdAt 
                        ? formatDate(selectedTask.createdAt) 
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Comments */}
                  {selectedTask.comments && selectedTask.comments.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments ({selectedTask.comments.length})
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedTask.comments.map((comment, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {comment.by || 'Anonymous'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment.at ? formatDate(comment.at) : 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.text || comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowTaskModal(false);
                        setSelectedTask(null);
                      }}
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Modal (Employee Name Click) */}
        {showActionModal && actionTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Task Actions</h2>
                  <button
                    onClick={() => {
                      setShowActionModal(false);
                      setActionTask(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                  {/* Task Info Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Employee</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {actionTask.user?.name || actionTask.assignee || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Task Title</label>
                      <p className="text-sm text-gray-900">{actionTask.title || 'N/A'}</p>
                    </div>
                    {actionTask.description && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <p className="text-sm text-gray-700 line-clamp-3">{actionTask.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                        <p className="text-sm text-gray-900">{formatDate(actionTask.startTime)}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                        <p className="text-sm text-gray-900">{formatDate(actionTask.endTime)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <div>{getStatusBadge(actionTask.status)}</div>
                    </div>
                    {actionTask.reporter && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Reporter</label>
                        <p className="text-sm text-gray-900">{actionTask.reporter}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleViewTask(actionTask._id)}
                      className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      title="View Full Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditTask(actionTask)}
                      className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      title="Edit Task"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(actionTask._id, actionTask.title)}
                      className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete Task"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowActionModal(false);
                        setActionTask(null);
                      }}
                      className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Cancel"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditModal && editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateTask} className="p-6 space-y-6">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
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
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
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
                    value={editForm.reporter}
                    onChange={(e) => handleEditFormChange('reporter', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Reporter name..."
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
                      value={editForm.startTime}
                      onChange={(e) => handleEditFormChange('startTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editForm.endTime}
                      onChange={(e) => handleEditFormChange('endTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => handleEditFormChange('status', e.target.value)}
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
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiEdit />
                        Update Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyWorkcards;

