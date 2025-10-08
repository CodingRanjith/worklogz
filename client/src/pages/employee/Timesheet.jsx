import React, { useEffect, useMemo, useState } from 'react';
import { 
  getAllTasks, 
  createTask, 
  updateTask, 
  deleteTask as apiDeleteTask, 
  addTaskComment, 
  getTaskStats, 
  getAllTasksWithFilters,
  bulkUpdateTasks 
} from '../../utils/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDone, MdPending, MdInsertChart } from 'react-icons/md';
import './TimeSheet.css'; // ensure this import comes AFTER react-calendar css

const IconButton = ({ children, onClick, title = '' }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2 rounded-md hover:bg-gray-200 transition-colors"
    aria-label={title}
  >
    {children}
  </button>
);

const TaskDetailModal = ({ task, open, onClose, onSaveComment, onUpdate, onDelete }) => {
  const [comment, setComment] = useState('');
  const [localTask, setLocalTask] = useState(task || {});

  useEffect(() => {
    setComment('');
    setLocalTask(task || {});
  }, [task, open]);

  if (!open || !localTask) return null;

  const handleUpdateField = (field, value) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    onUpdate(localTask);
    onClose();
  };

  // NEW: send comment - optimistic update so UI shows immediately
  const handleSend = () => {
    const text = (comment || '').trim();
    if (!text) return;

    const newComment = { by: 'You', at: new Date().toISOString(), text };

    // Optimistically update modal state so the comment shows right away
    setLocalTask(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));

    // Call parent to persist the comment globally
    onSaveComment(localTask._id, text);

    // Clear input
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="p-4 md:p-6 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-2 w-full">
            <input
              value={localTask.title || ''}
              onChange={e => handleUpdateField('title', e.target.value)}
              className="w-full text-lg md:text-2xl font-semibold border-b border-gray-300 pb-1 focus:outline-none focus:border-indigo-500"
              placeholder="Task Title"
            />
            <p className="text-sm text-gray-600">
              Reporter: <strong>{localTask.reporter || '—'}</strong> • Assignee: <strong>{localTask.assignee || '—'}</strong>
            </p>
            <p className="text-xs text-gray-500">Created: {localTask.createdAt ? new Date(localTask.createdAt).toLocaleString() : '—'}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto flex-wrap">
            <button
              onClick={() => onUpdate({ ...localTask, done: !localTask.done })}
              className="w-full md:w-auto px-4 py-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
            >
              {localTask.done ? 'Mark Open' : 'Mark Done'}
            </button>
            <button
              onClick={() => onDelete(localTask._id)}
              className="w-full md:w-auto px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="w-full md:w-auto px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <textarea
              value={localTask.description || ''}
              onChange={e => handleUpdateField('description', e.target.value)}
              className="w-full mt-2 border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a description..."
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm text-gray-600">Status</h4>
              <select
                value={localTask.status || 'backlog'}
                onChange={e => handleUpdateField('status', e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <h4 className="text-sm text-gray-600">Start Date</h4>
              <input
                type="date"
                value={localTask.startTime || ''}
                onChange={e => handleUpdateField('startTime', e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <h4 className="text-sm text-gray-600">End Date</h4>
              <input
                type="date"
                value={localTask.endTime || ''}
                onChange={e => handleUpdateField('endTime', e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-600">Reporter</h4>
              <input
                type="text"
                value={localTask.reporter || ''}
                onChange={e => handleUpdateField('reporter', e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Reporter name"
              />
            </div>
            <div>
              <h4 className="text-sm text-gray-600">Assignee</h4>
              <input
                type="text"
                value={localTask.assignee || ''}
                onChange={e => handleUpdateField('assignee', e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Assignee name"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Comments</h4>
            <div className="mt-3 space-y-3 max-h-48 overflow-auto p-3 border rounded-lg bg-gray-50">
              {localTask.comments?.length ? (
                localTask.comments.map((c, i) => (
                  <div key={i} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <strong className="text-indigo-600">{c.by}</strong>
                      <span className="text-xs text-gray-500">{new Date(c.at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No comments yet.</p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a comment..."
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                aria-disabled={!comment.trim()}
              >
                Send
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveChanges}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TimesheetFullPage() {
  // Get token from localStorage (adjust if you use context or other auth)
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);            // master list (all tasks)
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(new Date()); // For week navigation
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // formatted YYYY-MM-DD for comparisons (using local timezone to avoid date shift)
  const formattedDate = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + N = New Task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !modalOpen) {
        e.preventDefault();
        addNewTask();
      }
      // Escape = Close modal
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen]);

  // Fetch all tasks from backend on mount
  useEffect(() => {
    fetchAllTasks();
  }, [token]);

  const fetchAllTasks = async () => {
    try {
      if (!token) return;
      setTasksLoading(true);
      const response = await getAllTasks(token);
      // Handle both old format (array) and new format (object with tasks array)
      const tasksData = response.tasks || response;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      // Show user-friendly error message
      Swal.fire({
        title: 'Error',
        text: 'Failed to load tasks. Please try again.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setTasksLoading(false);
    }
  };

  // Enhanced fetch with filters using imported API function
  const fetchTasksWithFilters = async (filters = {}) => {
    try {
      if (!token) return;
      setTasksLoading(true);
      const response = await getAllTasksWithFilters(filters, token);
      const tasksData = response.tasks || response;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error('Failed to load filtered tasks:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load filtered tasks. Please try again.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setTasksLoading(false);
    }
  };

  // Fetch task statistics using imported API function
  const fetchTaskStatistics = async (startDate = null, endDate = null) => {
    try {
      if (!token) return null;
      const stats = await getTaskStats(startDate, endDate, token);
      return stats;
    } catch (err) {
      console.error('Failed to fetch task statistics:', err);
      return null;
    }
  };

  // Bulk update tasks using imported API function
  const bulkUpdateTasksHandler = async (taskIds, updateData) => {
    try {
      if (!token || !taskIds?.length) return;
      
      const result = await bulkUpdateTasks(taskIds, updateData, token);
      
      // Update local state
      setTasks(prev => prev.map(task => 
        taskIds.includes(task._id) 
          ? { ...task, ...updateData }
          : task
      ));

      Swal.fire({
        title: 'Success!',
        text: `Updated ${taskIds.length} task(s) successfully!`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      return result;
    } catch (err) {
      console.error('Failed to bulk update tasks:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update tasks. Please try again.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const openTask = (task) => { setActiveTask(task); setModalOpen(true); };
  const closeModal = () => { setActiveTask(null); setModalOpen(false); };

  // Quick status change function
  const quickStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t._id === taskId);
      if (!taskToUpdate) return;

      const updated = await updateTask(taskId, { ...taskToUpdate, status: newStatus }, token);
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updated } : t));
      
      Swal.fire({
        title: 'Updated!',
        text: `Task status changed to ${newStatus}`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update task status.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const saveComment = async (taskId, text) => {
    try {
      if (!token) return;
      
      // Optimistically update UI
      const newComment = { by: 'You', at: new Date().toISOString(), text };
      setTasks(prev => prev.map(t => 
        t._id === taskId 
          ? { ...t, comments: [...(t.comments || []), newComment] } 
          : t
      ));

      // Save to backend using the imported API function
      await addTaskComment(taskId, text, token);

    } catch (err) {
      console.error('Failed to save comment:', err);
      // Revert optimistic update on error
      setTasks(prev => prev.map(t => 
        t._id === taskId 
          ? { ...t, comments: (t.comments || []).filter(c => c.text !== text || c.by !== 'You') } 
          : t
      ));
      
      Swal.fire({
        title: 'Error',
        text: 'Failed to save comment. Please try again.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // update task globally (so it appears correctly on other dates too)
  // Update task in DB and state
  const updateTaskHandler = async (payload) => {
    try {
      if (!token) return;
      
      const updated = await updateTask(payload._id, payload, token);
      setTasks(prev => prev.map(t => t._id === updated._id ? { ...t, ...updated } : t));
      setActiveTask(updated);
      
      // Show success message
      Swal.fire({
        title: 'Success',
        text: 'Task updated successfully!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update task. Please try again.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  // Delete task in DB and state
  const deleteTaskHandler = (id) => {
    Swal.fire({
      title: 'Delete task?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
    }).then(async res => {
      if (res.isConfirmed && token) {
        try {
          await apiDeleteTask(id, token);
          setTasks(prev => prev.filter(t => t._id !== id));
          
          // Close modal if the deleted task was open
          if (activeTask && activeTask._id === id) {
            closeModal();
          }
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Task has been deleted successfully.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });
        } catch (err) {
          console.error('Failed to delete task:', err);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete task. Please try again.',
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }
    });
  };



  // Create new task in DB and state
  const addNewTask = async () => {
    if (loading) return;
    const { value: formValues } = await Swal.fire({
      title: 'Create New Task',
      html: `
        <div class="space-y-6">
          <input id="swal-title" class="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-4 py-3" placeholder="Task Title *" required>
          <input id="swal-reporter" class="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-4 py-3" placeholder="Reporter">
          <input id="swal-assignee" class="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-4 py-3" placeholder="Assignee">
          <textarea id="swal-description" class="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 h-28 resize-none" placeholder="Description"></textarea>
          <div class="grid grid-cols-2 gap-4">
            <input type="date" id="swal-start" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3">
            <input type="date" id="swal-end" class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create Task',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const title = document.getElementById('swal-title').value;
        if (!title.trim()) {
          Swal.showValidationMessage('Title is required');
          return false;
        }
        const start = document.getElementById('swal-start').value || formattedDate;
        const end = document.getElementById('swal-end').value || formattedDate;
        return {
          title,
          reporter: document.getElementById('swal-reporter').value,
          assignee: document.getElementById('swal-assignee').value,
          description: document.getElementById('swal-description').value,
          startTime: start,
          endTime: end,
          status: 'backlog',
          createdAt: new Date().toISOString(),
          comments: [],
          done: false,
        };
      }
    });

    if (formValues && formValues.title && token) {
      try {
        setLoading(true);
        // Always set startTime and endTime to the selected date if missing
        const safeFormValues = {
          ...formValues,
          startTime: formValues.startTime || formattedDate,
          endTime: formValues.endTime || formattedDate,
        };
        
        const created = await createTask(safeFormValues, token);
        
        // Add the new task to the list
        setTasks(prev => [...prev, created]);
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Task created successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        
      } catch (err) {
        console.error('Failed to create task:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to create task. Please try again.',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Counts are based on tasks for selected date
  const tasksForSelectedDate = tasks.filter(t => {
    const dateMatch = (t.startTime === formattedDate || t.endTime === formattedDate);
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    return dateMatch && statusMatch;
  });
  const doneCount = tasksForSelectedDate.filter(t => t.status === 'done').length;
  const todoCount = tasksForSelectedDate.filter(t => t.status === 'todo').length;
  const doingCount = tasksForSelectedDate.filter(t => t.status === 'doing').length;
  const totalCount = tasksForSelectedDate.length;

  // Weekly calculations
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date) => {
    const weekStart = getWeekStart(date);
    return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  };

  const weekStart = getWeekStart(selectedWeek);
  const weekEnd = getWeekEnd(selectedWeek);
  
  const tasksForWeek = tasks.filter(t => {
    const taskDate = new Date(t.startTime || t.createdAt);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  // Week navigation functions
  const goToPreviousWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setSelectedWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setSelectedWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

  const isCurrentWeek = () => {
    const currentWeekStart = getWeekStart(new Date());
    const selectedWeekStart = getWeekStart(selectedWeek);
    return currentWeekStart.getTime() === selectedWeekStart.getTime();
  };

  const weeklyTotalTasks = tasksForWeek.length;
  const weeklyPendingTasks = tasksForWeek.filter(t => t.status !== 'done').length;
  
  // Pending tasks - tasks that were assigned but not completed by their end date
  const currentDate = new Date();
  const pendingOverdueTasks = tasksForWeek.filter(t => {
    if (t.status === 'done') return false;
    const endDate = new Date(t.endTime || t.startTime);
    return endDate < currentDate;
  });

  // calendar tile styling (unchanged)
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.toDateString() === new Date().toDateString())
      return 'bg-green-100 text-green-800 rounded-full';
    if (view === 'month' && tasks.some(t => t.startTime === date.toISOString().split('T')[0]))
      return 'bg-indigo-100 text-indigo-800 rounded-full';
    return '';
  };



  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-yellow-50 to-sky-50 p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6 items-start">
        {/* Calendar Column */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 md:sticky md:top-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navigate('/attendance')} className="text-lg font-semibold text-indigo-600 hover:underline">
                Back
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
              <div className="text-sm text-gray-600">
                Selected: <strong>{formattedDate}</strong>
              </div>
            </div>

            <div className="mt-2">
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}                 // clicking a date updates selectedDate -> rebuilds board
                tileClassName={tileClassName}
                className="border-none rounded-lg shadow-sm w-full"
                showFixedNumberOfWeeks={true}
                showNeighboringMonth={true}
              />
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{formattedDate}</h3>
              {tasksForSelectedDate.length ? (
                <div className="space-y-3 max-h-48 overflow-auto">
                  {tasksForSelectedDate.map(task => (
                    <div
                      key={task._id}
                      onClick={() => openTask(task)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-sm">{task.title}</h5>
                          <p className="text-xs text-gray-500">Status: {task.status}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                          {task.done ? 'Done' : 'Open'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No tasks for this date.</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center text-gray-700">
              <div className="p-3 border rounded-lg flex flex-col items-center bg-green-50">
                <MdDone className="text-green-600 text-xl" />
                <span>Done</span>
                <strong>{doneCount}</strong>
              </div>
              <div className="p-3 border rounded-lg flex flex-col items-center bg-yellow-50">
                <MdPending className="text-yellow-600 text-xl" />
                <span>In Progress</span>
                <strong>{doingCount}</strong>
              </div>
              <div className="p-3 border rounded-lg flex flex-col items-center bg-orange-50">
                <MdPending className="text-orange-600 text-xl" />
                <span>To Do</span>
                <strong>{todoCount}</strong>
              </div>
              <div className="p-3 border rounded-lg flex flex-col items-center bg-blue-50">
                <MdInsertChart className="text-blue-600 text-xl" />
                <span>Total</span>
                <strong>{totalCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Task List Column */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-col sm:flex-row">
              <h2 className="text-md font-bold text-indigo-700">{formattedDate}</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:w-48"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Filter by Status"
                >
                  <option value="all">All Status</option>
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="doing">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={fetchAllTasks}
                  disabled={tasksLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                  title="Refresh Tasks"
                >
                  <span className={tasksLoading ? 'animate-spin' : ''}>🔄</span>
                </button>
                <button
                  onClick={addNewTask}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  title="Create New Task (Ctrl+N)"
                >
                  <AiOutlinePlus /> New Task
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {tasksLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">⚪</div>
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate
                  .filter(task => task.title.toLowerCase().includes(query.toLowerCase()))
                  .map((task) => (
                    <div
                      key={task._id}
                      onClick={() => openTask(task)}
                      className={`p-4 rounded-lg border shadow-sm cursor-pointer transition-all duration-200 ${
                        task.done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      } hover:shadow-md hover:border-indigo-300`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-semibold text-base text-gray-800">{task.title}</h5>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              #{task._id.slice(-6)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <p><span className="font-medium">Reporter:</span> {task.reporter || 'Unassigned'}</p>
                            <p><span className="font-medium">Assignee:</span> {task.assignee || 'Unassigned'}</p>
                            <p><span className="font-medium">Start:</span> {task.startTime || '—'}</p>
                            <p><span className="font-medium">End:</span> {task.endTime || '—'}</p>
                          </div>

                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}</span>
                            {task.comments && task.comments.length > 0 && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'doing' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status === 'done' ? 'Done' : 
                             task.status === 'doing' ? 'In Progress' :
                             task.status === 'todo' ? 'To Do' : 
                             'Backlog'}
                          </div>
                          
                          <div className="flex gap-1 flex-wrap">
                            {task.status !== 'done' && (
                              <IconButton 
                                title="Mark as Done" 
                                onClick={(e) => { e.stopPropagation(); quickStatusChange(task._id, 'done'); }}
                              >
                                <MdDone className="text-green-600" />
                              </IconButton>
                            )}
                            {task.status === 'backlog' && (
                              <IconButton 
                                title="Start Task" 
                                onClick={(e) => { e.stopPropagation(); quickStatusChange(task._id, 'todo'); }}
                              >
                                <span className="text-blue-600 text-sm">▶</span>
                              </IconButton>
                            )}
                            <IconButton title="Edit Task" onClick={(e) => { e.stopPropagation(); openTask(task); }}>
                              <FiEdit className="text-indigo-600" />
                            </IconButton>
                            <IconButton 
                              title="Delete Task" 
                              onClick={(e) => { e.stopPropagation(); deleteTaskHandler(task._id); }}
                            >
                              <FiTrash2 className="text-red-600" />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks for this date</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select a different date or create a new task for {formattedDate}
                  </p>
                  <button
                    onClick={addNewTask}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <AiOutlinePlus /> Create First Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary Section */}
      <div className="max-w-[1400px] mx-auto mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                Weekly Summary
                {!isCurrentWeek() && (
                  <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-normal">
                    Different Week
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {weekStart.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })} - {weekEnd.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
                {isCurrentWeek() && (
                  <span className="ml-2 text-green-600 font-medium">(Current Week)</span>
                )}
              </p>
            </div>
            
            {/* Week Navigation Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={goToPreviousWeek}
                className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors text-sm font-medium"
                title="Previous Week"
              >
                <span>←</span>
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              {!isCurrentWeek() && (
                <button
                  onClick={goToCurrentWeek}
                  className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors text-sm font-medium"
                  title="Go to Current Week"
                >
                  Current Week
                </button>
              )}
              
              <button
                onClick={goToNextWeek}
                className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                title="Next Week"
              >
                <span className="hidden sm:inline">Next</span>
                <span>→</span>
              </button>

              {/* Week Selector Dropdown */}
              <select
                value={selectedWeek.toISOString().split('T')[0]}
                onChange={(e) => setSelectedWeek(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Select Week"
              >
                {/* Generate options for past 4 weeks, current week, and next 4 weeks */}
                {Array.from({ length: 9 }, (_, i) => {
                  const weekDate = new Date();
                  weekDate.setDate(weekDate.getDate() - (4 - i) * 7);
                  const weekStartDate = getWeekStart(weekDate);
                  const weekEndDate = getWeekEnd(weekDate);
                  const isThisWeek = getWeekStart(new Date()).getTime() === weekStartDate.getTime();
                  
                  return (
                    <option key={i} value={weekDate.toISOString().split('T')[0]}>
                      {isThisWeek ? 'This Week: ' : ''}
                      {weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                      {weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Weekly Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-800">{weeklyTotalTasks}</p>
                </div>
                <MdInsertChart className="text-blue-600 text-3xl" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-yellow-800">{weeklyPendingTasks}</p>
                </div>
                <MdPending className="text-yellow-600 text-3xl" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Overdue Tasks</p>
                  <p className="text-2xl font-bold text-red-800">{pendingOverdueTasks.length}</p>
                </div>
                <FiTrash2 className="text-red-600 text-3xl" />
              </div>
            </div>
          </div>

          {/* Pending Tasks List */}
          {pendingOverdueTasks.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Overdue Tasks ({pendingOverdueTasks.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingOverdueTasks.map((task) => {
                  const daysPending = Math.floor(
                    (currentDate - new Date(task.endTime || task.startTime)) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div
                      key={task._id}
                      onClick={() => openTask(task)}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm text-gray-800">{task.title}</h5>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {daysPending} day{daysPending !== 1 ? 's' : ''} overdue
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <p><span className="font-medium">Assigned:</span> {task.startTime || '—'}</p>
                            <p><span className="font-medium">Due:</span> {task.endTime || task.startTime || '—'}</p>
                            <p><span className="font-medium">Assignee:</span> {task.assignee || 'Unassigned'}</p>
                            <p><span className="font-medium">Status:</span> {task.status}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-3">
                          <IconButton 
                            title="Edit Task" 
                            onClick={(e) => { e.stopPropagation(); openTask(task); }}
                          >
                            <FiEdit className="text-indigo-600" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Weekly Tasks */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              All Weekly Tasks ({weeklyTotalTasks})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {tasksForWeek.map((task) => (
                <div
                  key={task._id}
                  onClick={() => openTask(task)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    task.status === 'done' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm text-gray-800 truncate">{task.title}</h5>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.status === 'done' ? 'bg-green-100 text-green-800' :
                      task.status === 'doing' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'done' ? 'Done' : 
                       task.status === 'doing' ? 'Progress' :
                       task.status === 'todo' ? 'To Do' : 
                       'Backlog'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><span className="font-medium">Date:</span> {task.startTime || '—'}</p>
                    <p><span className="font-medium">Assignee:</span> {task.assignee || 'Unassigned'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TaskDetailModal
        task={activeTask}
        open={modalOpen}
        onClose={closeModal}
        onSaveComment={saveComment}
  onUpdate={updateTaskHandler}
  onDelete={deleteTaskHandler}
      />
    </div>
  );
}
