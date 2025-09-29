import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../utils/api';
import './TimesheetModal.css';

function TimesheetModal({ isOpen, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskSummary, setTaskSummary] = useState({ total: 0, done: 0, pending: 0 });
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'

  // Fetch tasks for selected date
  const fetchTasks = useCallback(async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getTasksByDate(selectedDate), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire('Error', 'Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // Fetch task summary
  const fetchTaskSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_ENDPOINTS.getTaskSummary}?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskSummary(response.data);
    } catch (error) {
      console.error('Error fetching task summary:', error);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
      fetchTaskSummary();
    }
  }, [isOpen, fetchTasks, fetchTaskSummary]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.addTask, {
        task: newTask.trim(),
        date: selectedDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewTask('');
      await fetchTasks();
      await fetchTaskSummary();
      
      Swal.fire({
        icon: 'success',
        title: 'Task Added!',
        text: 'Your task has been successfully added.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire('Error', 'Failed to add task', 'error');
    }
  };

  // Update task status
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(API_ENDPOINTS.updateTaskStatus(taskId), {
        done: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchTasks();
      await fetchTaskSummary();
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire('Error', 'Failed to update task', 'error');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(API_ENDPOINTS.deleteTask(taskId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        await fetchTasks();
        await fetchTaskSummary();
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Task has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    }
  };

  // Edit task
  const handleEditTask = async (taskId, newTaskText) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.updateFullTask(taskId), {
        task: newTaskText,
        date: selectedDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingTask(null);
      await fetchTasks();
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Task has been updated.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire('Error', 'Failed to update task', 'error');
    }
  };

  // Generate week dates for weekly view
  const getWeekDates = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  if (!isOpen) return null;

  return (
    <div className="timesheet-modal fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add Timesheet</h2>
              <p className="text-emerald-100">Manage your daily tasks and projects</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Date Picker */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Main Content Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Left Side - Time Tracking & Summary */}
            <div className="space-y-6">
              {/* Task Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="summary-card bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">📋 Total Tasks</p>
                      <p className="text-4xl font-bold mt-1">{taskSummary.total}</p>
                    </div>
                    <div className="p-3 bg-blue-400/30 rounded-xl">
                      <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="summary-card bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-400/30 rounded-lg">
                        <svg className="w-6 h-6 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-green-100 text-xs font-medium uppercase">✅ Completed</p>
                        <p className="text-3xl font-bold">{taskSummary.done}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-card bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-400/30 rounded-lg">
                        <svg className="w-6 h-6 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-orange-100 text-xs font-medium uppercase">🕒 Pending</p>
                        <p className="text-3xl font-bold">{taskSummary.pending}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Tracker Section */}
              <div className="time-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Live Time Tracking ⏰
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-purple-200">
                    <span className="text-purple-700 font-semibold">Start Time:</span>
                    <span className="text-purple-900 font-bold">09:00 AM</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-purple-200">
                    <span className="text-purple-700 font-semibold">Current Time:</span>
                    <span className="text-purple-900 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl">
                    <span className="font-semibold">Total Hours:</span>
                    <span className="font-bold text-lg">
                      {Math.max(0, Math.floor((new Date().getTime() - new Date().setHours(9,0,0,0)) / (1000 * 60 * 60)))}h {Math.max(0, Math.floor(((new Date().getTime() - new Date().setHours(9,0,0,0)) % (1000 * 60 * 60)) / (1000 * 60)))}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Task Form */}
              <div className="add-task-form p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Task
                </h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter your task description..."
                    className="w-full p-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 font-medium placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.trim()}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ✨ Add Task
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Tasks List */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Tasks for {selectedDate}
                </h3>

                {/* Tasks List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      <span className="ml-3 text-gray-600 font-medium">Loading tasks...</span>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-lg font-bold text-gray-700">No tasks for this date</p>
                      <p className="text-sm text-gray-500">Add your first task to get started!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task._id}
                        className={`task-card p-6 rounded-2xl transition-all duration-300 ${
                          task.done ? 'completed' : 'pending'
                        }`}
                      >
                        {/* Task Header with Date */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="task-meta flex items-center gap-1">
                              📅 {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                            <div className="task-meta flex items-center gap-1">
                              🕒 {new Date(task.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingTask(editingTask === task._id ? null : task._id)}
                              className="action-button edit-button text-gray-600 hover:text-blue-700"
                              title="Edit task"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="action-button delete-button text-gray-600 hover:text-red-700"
                              title="Delete task"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Main Task Content */}
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleToggleTask(task._id, task.done)}
                            className={`task-checkbox w-8 h-8 rounded-full border-3 flex items-center justify-center flex-shrink-0 mt-1 ${
                              task.done ? 'checked' : 'border-gray-400 hover:border-emerald-500 bg-white'
                            }`}
                          >
                            {task.done && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>

                          {editingTask === task._id ? (
                            <div className="flex-1">
                              <input
                                type="text"
                                defaultValue={task.task}
                                className="w-full p-4 border-3 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold text-lg text-gray-900"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditTask(task._id, e.target.value);
                                  }
                                }}
                                onBlur={(e) => handleEditTask(task._id, e.target.value)}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex-1">
                              <p className={`task-text text-xl font-bold leading-relaxed ${
                                task.done ? 'completed' : ''
                              }`}>
                                {task.task}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimesheetModal;