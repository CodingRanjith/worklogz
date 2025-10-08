import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './UserTimesheet.css';
import { FiArrowLeft, FiUser, FiCalendar, FiClock, FiList, FiPlus, FiX, FiEdit2, FiTrash2, FiEye, FiMessageCircle } from 'react-icons/fi';
import { MdDone, MdPending, MdInsertChart } from 'react-icons/md';
import Swal from 'sweetalert2';
import { getAllTasksWithFilters, createTask, updateTask, deleteTask, addTaskComment } from '../../utils/api';

const UserTimesheet = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName || 'User';
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [editTaskLoading, setEditTaskLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    reporter: '',
    startTime: '',
    endTime: '',
    status: 'backlog'
  });

  // Format date for API calls and display
  const formattedDate = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  useEffect(() => {
    if (userId) {
      fetchUserTasks();
      fetchUserInfo();
    }
  }, [userId]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && !loading && userId) {
      const interval = setInterval(() => {
        fetchUserTasks(true); // Silent refresh
        setLastUpdated(Date.now());
      }, 15000); // Refresh every 15 seconds for more frequent updates

      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, loading, userId]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const fetchUserTasks = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      // Use the API function with user filter
      const response = await getAllTasksWithFilters({ userId: userId }, token);
      const tasksData = response.tasks || response;
      const newTasks = Array.isArray(tasksData) ? tasksData : [];
      
      // Only update if there are actual changes
      setTasks(prevTasks => {
        const hasChanges = JSON.stringify(prevTasks) !== JSON.stringify(newTasks);
        return hasChanges ? newTasks : prevTasks;
      });
    } catch (error) {
      if (!silent) {
        console.error('Error fetching user tasks:', error);
        setTasks([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData.user || userData);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter(task => {
    const taskStartDate = task.startTime;
    const taskEndDate = task.endTime;
    return taskStartDate === formattedDate || taskEndDate === formattedDate;
  });

  // Calculate statistics for selected date
  const doneCount = tasksForSelectedDate.filter(t => t.status === 'done').length;
  const todoCount = tasksForSelectedDate.filter(t => t.status === 'todo').length;
  const doingCount = tasksForSelectedDate.filter(t => t.status === 'doing').length;
  const totalCount = tasksForSelectedDate.length;

  // Calculate monthly statistics
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  const tasksForCurrentMonth = tasks.filter(task => {
    if (!task.startTime) return false;
    const taskDate = new Date(task.startTime);
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
  });

  const monthlyStats = {
    total: tasksForCurrentMonth.length,
    completed: tasksForCurrentMonth.filter(t => t.status === 'done').length,
    pending: tasksForCurrentMonth.filter(t => t.status !== 'done').length,
    inProgress: tasksForCurrentMonth.filter(t => t.status === 'doing').length,
    todo: tasksForCurrentMonth.filter(t => t.status === 'todo').length,
    backlog: tasksForCurrentMonth.filter(t => t.status === 'backlog').length
  };

  // Calculate completion percentage
  const completionPercentage = monthlyStats.total > 0 
    ? Math.round((monthlyStats.completed / monthlyStats.total) * 100)
    : 0;

  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[currentMonth];

  // Calendar tile styling
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasTasks = tasks.some(task => 
        task.startTime === dateStr || task.endTime === dateStr
      );
      if (hasTasks) {
        return 'has-tasks';
      }
    }
    return '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'doing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'todo': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done': return 'Done';
      case 'doing': return 'In Progress';
      case 'todo': return 'To Do';
      default: return 'Backlog';
    }
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      await fetchUserTasks();
      setLastUpdated(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  const handleCreateTask = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    setTaskForm({
      title: '',
      description: '',
      reporter: '',
      startTime: dateStr,
      endTime: dateStr,
      status: 'backlog'
    });
    setShowCreateModal(true);
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

    try {
      setCreateTaskLoading(true);
      const token = localStorage.getItem('token');
      
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        assignee: userName,
        reporter: taskForm.reporter || 'Admin',
        startTime: taskForm.startTime,
        endTime: taskForm.endTime,
        status: taskForm.status,
        userId: userId, // Associate task with this user
      };

      const createdTask = await createTask(taskData, token);
      
      // Immediate refresh for real-time update
      await fetchUserTasks();
      setLastUpdated(Date.now());
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Task created successfully for ${userName}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      setShowCreateModal(false);
      // Reset form
      setTaskForm({
        title: '',
        description: '',
        reporter: '',
        startTime: formattedDate,
        endTime: formattedDate,
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

  // Edit task functionality
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      reporter: task.reporter || '',
      startTime: task.startTime || '',
      endTime: task.endTime || '',
      status: task.status || 'backlog'
    });
    setShowEditModal(true);
  };

  const handleEditTaskSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskForm.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Task title is required',
      });
      return;
    }

    try {
      setEditTaskLoading(true);
      const token = localStorage.getItem('token');
      
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        reporter: taskForm.reporter,
        startTime: taskForm.startTime,
        endTime: taskForm.endTime,
        status: taskForm.status,
      };

      await updateTask(selectedTask._id, taskData, token);
      
      // Immediate refresh for real-time update
      await fetchUserTasks();
      setLastUpdated(Date.now());
      
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
      setSelectedTask(null);
      
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task. Please try again.',
      });
    } finally {
      setEditTaskLoading(false);
    }
  };

  // Delete task functionality
  const handleDeleteTask = async (taskId, taskTitle) => {
    const result = await Swal.fire({
      title: 'Delete Task',
      text: `Are you sure you want to delete "${taskTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await deleteTask(taskId, token);
        
        // Immediate refresh for real-time update
        await fetchUserTasks();
        setLastUpdated(Date.now());
        
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

  // View task details with comments
  const handleViewTaskDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
    setNewComment('');
  };

  // Add comment functionality
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Comment text is required',
      });
      return;
    }

    try {
      setCommentLoading(true);
      const token = localStorage.getItem('token');
      
      await addTaskComment(selectedTask._id, newComment.trim(), token);
      
      // Immediate refresh for real-time update
      await fetchUserTasks();
      setLastUpdated(Date.now());
      
      // Update selected task for modal
      const refreshedTasks = await getAllTasksWithFilters({ userId: userId }, token);
      const updatedTask = (refreshedTasks.tasks || refreshedTasks).find(t => t._id === selectedTask._id);
      if (updatedTask) setSelectedTask(updatedTask);
      
      setNewComment('');
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Comment added successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add comment. Please try again.',
      });
    } finally {
      setCommentLoading(false);
    }
  };

  // Quick status update
  const handleQuickStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await updateTask(taskId, { status: newStatus }, token);
      
      // Immediate refresh for real-time update
      await fetchUserTasks();
      setLastUpdated(Date.now());
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Task status changed to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      
    } catch (error) {
      console.error('Error updating task status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task status.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/task-manager')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <FiArrowLeft />
              Back to Task Manager
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userName}'s Timesheet
              </h1>
              <p className="text-gray-600">
                Tasks and activities for {formattedDate}
              </p>
            </div>
          </div>
          
          {/* Live Status & Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-600">
                {autoRefresh ? 'Live Updates' : 'Manual'}
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
              className="flex items-center gap-1 px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
              title="Manual Refresh"
            >
              <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>🔄</div>
              Refresh
            </button>
            
            <div className="text-xs text-gray-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        {userInfo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{userInfo.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    {userInfo.employeeId || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiList className="w-4 h-4" />
                    {userInfo.role || 'Employee'}
                  </div>
                  {userInfo.department && (
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {userInfo.department}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Summary Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdInsertChart className="text-indigo-600" />
              Monthly Summary - {currentMonthName} {currentYear}
            </h3>
            <div className="text-sm text-gray-600">
              {completionPercentage}% Complete
            </div>
          </div>

          {/* Monthly Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <MdInsertChart className="text-indigo-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-800">{monthlyStats.total}</div>
              <div className="text-sm text-indigo-700">Total Tasks</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <MdDone className="text-green-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{monthlyStats.completed}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <MdPending className="text-orange-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{monthlyStats.pending}</div>
              <div className="text-sm text-orange-700">Pending</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <FiClock className="text-yellow-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{monthlyStats.inProgress}</div>
              <div className="text-sm text-yellow-700">In Progress</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FiList className="text-blue-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{monthlyStats.todo}</div>
              <div className="text-sm text-blue-700">To Do</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <FiCalendar className="text-gray-600 text-2xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{monthlyStats.backlog}</div>
              <div className="text-sm text-gray-700">Backlog</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progress: {monthlyStats.completed} of {monthlyStats.total} tasks completed</span>
            <span>{completionPercentage}%</span>
          </div>
        </div>

        {/* Monthly Task Analysis */}
        {monthlyStats.total > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiList className="text-indigo-600" />
              Task Analysis for {currentMonthName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Task Status Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-green-700">Done</span>
                    <span className="font-semibold text-green-800">{monthlyStats.completed} ({monthlyStats.total > 0 ? Math.round((monthlyStats.completed / monthlyStats.total) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="text-yellow-700">In Progress</span>
                    <span className="font-semibold text-yellow-800">{monthlyStats.inProgress} ({monthlyStats.total > 0 ? Math.round((monthlyStats.inProgress / monthlyStats.total) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-blue-700">To Do</span>
                    <span className="font-semibold text-blue-800">{monthlyStats.todo} ({monthlyStats.total > 0 ? Math.round((monthlyStats.todo / monthlyStats.total) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">Backlog</span>
                    <span className="font-semibold text-gray-800">{monthlyStats.backlog} ({monthlyStats.total > 0 ? Math.round((monthlyStats.backlog / monthlyStats.total) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600">Completion Rate</div>
                    <div className="text-2xl font-bold text-green-800">{completionPercentage}%</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="text-sm text-orange-600">Work in Progress</div>
                    <div className="text-2xl font-bold text-orange-800">{monthlyStats.inProgress + monthlyStats.todo}</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600">Average Daily Tasks</div>
                    <div className="text-2xl font-bold text-blue-800">{Math.round(monthlyStats.total / new Date(currentYear, currentMonth + 1, 0).getDate())}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiCalendar />
                Calendar
              </h3>
              <div className="text-sm text-gray-600">
                Selected: <strong>{formattedDate}</strong>
              </div>
            </div>

            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={tileClassName}
              className="border-none rounded-lg shadow-sm w-full"
              showFixedNumberOfWeeks={true}
              showNeighboringMonth={true}
            />

            {/* Daily Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <MdDone className="text-green-600 text-xl mx-auto mb-1" />
                <div className="text-sm text-green-700">Done</div>
                <div className="font-bold text-green-800">{doneCount}</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <MdPending className="text-yellow-600 text-xl mx-auto mb-1" />
                <div className="text-sm text-yellow-700">In Progress</div>
                <div className="font-bold text-yellow-800">{doingCount}</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <FiClock className="text-blue-600 text-xl mx-auto mb-1" />
                <div className="text-sm text-blue-700">To Do</div>
                <div className="font-bold text-blue-800">{todoCount}</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <MdInsertChart className="text-indigo-600 text-xl mx-auto mb-1" />
                <div className="text-sm text-indigo-700">Total</div>
                <div className="font-bold text-indigo-800">{totalCount}</div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiList />
                Tasks for {formattedDate}
              </h3>
              <button
                onClick={handleCreateTask}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
              >
                <FiPlus />
                Add Task
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading tasks...</p>
                </div>
              ) : tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{task._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleViewTaskDetails(task)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details & Comments"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Task"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id, task.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Task"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                        {task.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Reporter:</span>
                        <div>{task.reporter || 'Unassigned'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assignee:</span>
                        <div>{task.assignee || 'Unassigned'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>
                        <div>{task.startTime || '—'}</div>
                      </div>
                      <div>
                        <span className="font-medium">End:</span>
                        <div>{task.endTime || '—'}</div>
                      </div>
                    </div>

                    {/* Status Quick Actions */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500">Quick Status:</span>
                      {task.status !== 'todo' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(task._id, 'todo')}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          To Do
                        </button>
                      )}
                      {task.status !== 'doing' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(task._id, 'doing')}
                          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'done' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(task._id, 'done')}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          Done
                        </button>
                      )}
                    </div>

                    {task.comments && task.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMessageCircle className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {task.comments.length} comment(s)
                          </span>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {task.comments.slice(-2).map((comment, idx) => (
                            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                              <div className="font-medium text-gray-700">{comment.by}</div>
                              <div className="text-gray-600">{comment.text}</div>
                            </div>
                          ))}
                          {task.comments.length > 2 && (
                            <button
                              onClick={() => handleViewTaskDetails(task)}
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              View all {task.comments.length} comments...
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    No tasks for this date
                  </h4>
                  <p className="text-gray-500">
                    Select a different date to view tasks
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Task for {userName}</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Creating task for: <span className="font-semibold text-indigo-600">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="p-6 space-y-6">
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

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Editing task for: <span className="font-semibold text-indigo-600">{userName}</span>
              </p>
            </div>

            <form onSubmit={handleEditTaskSubmit} className="p-6 space-y-6">
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
                  Status
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
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editTaskLoading}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {editTaskLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiEdit2 />
                      Update Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal with Comments */}
      {showTaskDetailModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTask.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTask.status)}`}>
                      {getStatusText(selectedTask.status)}
                    </span>
                    <span>ID: #{selectedTask._id.slice(-6)}</span>
                    <span>Reporter: {selectedTask.reporter || 'Unassigned'}</span>
                    <span>Assignee: {selectedTask.assignee || 'Unassigned'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTaskDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Task Description */}
              {selectedTask.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedTask.description}</p>
                </div>
              )}

              {/* Task Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Start Date:</span>
                    <div className="text-gray-900">{selectedTask.startTime || '—'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">End Date:</span>
                    <div className="text-gray-900">{selectedTask.endTime || '—'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Created:</span>
                    <div className="text-gray-900">{selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : '—'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Status:</span>
                    <div className="text-gray-900">{getStatusText(selectedTask.status)}</div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiMessageCircle />
                  Comments ({selectedTask.comments?.length || 0})
                </h3>
                
                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((comment, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{comment.by}</span>
                          <span className="text-xs text-gray-500">
                            {comment.at ? new Date(comment.at).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiMessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No comments yet. Be the first to add one!</p>
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={commentLoading || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {commentLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiMessageCircle />
                    )}
                    {commentLoading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTimesheet;