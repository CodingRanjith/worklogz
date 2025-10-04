import React, { useEffect, useMemo, useState } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask as apiDeleteTask } from '../../utils/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  const [columns, setColumns] = useState({});        // columns for current selectedDate
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [query, setQuery] = useState('');

  // formatted YYYY-MM-DD for comparisons
  const formattedDate = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);

  // default column template (same ids used when building columns)
  const defaultColumns = useMemo(() => ({
    backlog: { id: 'backlog', title: 'Backlog', items: [] },
    todo: { id: 'todo', title: 'To Do', items: [] },
    doing: { id: 'doing', title: 'In Progress', items: [] },
    done: { id: 'done', title: 'Done', items: [] },
  }), []);

  // Fetch all tasks from backend on mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        if (!token) return;
        const data = await getAllTasks(token);
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    }
    fetchTasks();
  }, [token]);

  // Build columns for the CURRENT selected date.
  useEffect(() => {
    const tasksForDate = tasks.filter(t => {
      const start = t.startTime || t.createdAt?.split('T')?.[0];
      const end = t.endTime || t.startTime || t.createdAt?.split('T')?.[0];
      return start === formattedDate || end === formattedDate;
    });
    const col = JSON.parse(JSON.stringify(defaultColumns));
    tasksForDate.forEach(t => {
      if (!col[t.status]) col[t.status] = { id: t.status, title: t.status, items: [] };
      col[t.status].items.push(t);
    });
    setColumns(col);
  }, [tasks, defaultColumns, formattedDate]);

  const openTask = (task) => { setActiveTask(task); setModalOpen(true); };
  const closeModal = () => { setActiveTask(null); setModalOpen(false); };

  const saveComment = (taskId, text) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, comments: [...(t.comments || []), { by: 'You', at: new Date().toISOString(), text }] } : t));
  };

  // update task globally (so it appears correctly on other dates too)
  // Update task in DB and state
  const updateTaskHandler = async (payload) => {
    try {
      if (!token) return;
      const updated = await updateTask(payload._id, payload, token);
      setTasks(prev => prev.map(t => t._id === updated._id ? { ...t, ...updated } : t));
      setActiveTask(updated);
    } catch (err) {
      console.error('Failed to update task:', err);
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
    }).then(async res => {
      if (res.isConfirmed && token) {
        try {
          await apiDeleteTask(id, token);
          setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) {
          console.error('Failed to delete task:', err);
        }
      }
    });
  };

  // DnD: update global tasks' status when moved
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const movedItem = sourceCol.items[source.index];

    // Update local column visuals
    const newSourceItems = Array.from(sourceCol.items);
    newSourceItems.splice(source.index, 1);
    const newDestItems = Array.from(destCol.items);
    newDestItems.splice(destination.index, 0, movedItem);

    setColumns(prev => ({ ...prev, [sourceCol.id]: { ...sourceCol, items: newSourceItems }, [destCol.id]: { ...destCol, items: newDestItems } }));

    // Persist change globally (so other dates see updated status)
    setTasks(prev => prev.map(t => t._id === movedItem._id ? { ...t, status: destCol.id } : t));
  };

  // Create new task in DB and state
  const addNewTask = async () => {
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
        // Always set startTime and endTime to the selected date if missing
        const safeFormValues = {
          ...formValues,
          startTime: formValues.startTime || formattedDate,
          endTime: formValues.endTime || formattedDate,
        };
        let created = await createTask(safeFormValues, token);
        // Ensure all UI-required fields are present (fallback to formValues if missing)
        created = {
          ...safeFormValues,
          ...created,
          reporter: created.reporter || safeFormValues.reporter || 'Unknown',
          assignee: created.assignee || safeFormValues.assignee || 'Unassigned',
          description: created.description || safeFormValues.description || '',
          startTime: created.startTime || safeFormValues.startTime,
          endTime: created.endTime || safeFormValues.endTime,
          status: created.status || safeFormValues.status || 'backlog',
          createdAt: created.createdAt || new Date().toISOString(),
          comments: created.comments || safeFormValues.comments || [],
          done: created.done !== undefined ? created.done : (safeFormValues.done || false),
        };
        setTasks(prev => [...prev, created]);
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    }
  };

  // Counts are based on current columns (i.e. tasks for selected date)
  const doneCount = Object.values(columns).reduce((acc, col) => acc + col.items.filter(t => t.status === 'done').length, 0);
  const todoCount = Object.values(columns).reduce((acc, col) => acc + col.items.filter(t => t.status === 'todo').length, 0);
  const doingCount = Object.values(columns).reduce((acc, col) => acc + col.items.filter(t => t.status === 'doing').length, 0);
  const totalCount = Object.values(columns).reduce((acc, col) => acc + col.items.length, 0);

  // calendar tile styling (unchanged)
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.toDateString() === new Date().toDateString())
      return 'bg-green-100 text-green-800 rounded-full';
    if (view === 'month' && tasks.some(t => t.startTime === date.toISOString().split('T')[0]))
      return 'bg-indigo-100 text-indigo-800 rounded-full';
    return '';
  };

  // tasks specifically matching selected date (for the small list under calendar)
  const tasksForSelectedDate = tasks.filter(t => (t.startTime === formattedDate || t.endTime === formattedDate));

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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tasks for {formattedDate}</h3>
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

        {/* Task Board Column */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-col sm:flex-row">
              <h2 className="text-xl font-bold text-indigo-700">Worklogs</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
                />
                <button
                  onClick={addNewTask}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <AiOutlinePlus /> New Task
                </button>
              </div>
            </div>

            <div className="mt-2">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="sm:flex sm:gap-4 sm:overflow-x-auto sm:pb-2 md:grid md:grid-cols-2 gap-4">
                  {Object.values(columns).map(col => (
                    <Droppable droppableId={col.id} key={col.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="bg-gray-50 p-3 rounded-lg min-w-[260px] sm:min-w-[320px] md:min-w-0"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">{col.title}</h4>
                            <span className="text-xs text-gray-500">{col.items.length}</span>
                          </div>

                          <div className="space-y-3">
                            {col.items
                              .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
                              .map((task, index) => (
                                <Draggable draggableId={task._id} index={index} key={task._id}>
                                  {(dragProv) => (
                                    <div
                                      ref={dragProv.innerRef}
                                      {...dragProv.draggableProps}
                                      {...dragProv.dragHandleProps}
                                      onClick={() => openTask(task)}
                                      className={`p-3 rounded-lg border shadow-sm cursor-pointer transition ${task.done ? 'bg-green-50' : 'bg-white'} hover:bg-gray-100`}
                                    >
                                      <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <h5 className="font-medium text-sm truncate">{task.title}</h5>
                                            <span className="text-xs text-gray-400">#{task._id.split('-').pop()}</span>
                                          </div>
                                          <p className="text-xs text-gray-500 truncate">Reporter: {task.reporter} • Assignee: {task.assignee}</p>
                                          <p className="text-xs text-gray-500">Start: {task.startTime || '—'} • End: {task.endTime || '—'}</p>
                                          <p className="text-xs text-gray-400 mt-1 truncate">{task.description || 'No description provided'}</p>
                                          <p className="text-xs text-gray-400 mt-1">{task.createdAt ? new Date(task.createdAt).toLocaleString() : ''}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-3">
                                          <div className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{task.status}</div>
                                          <div className="flex gap-1">
                                            <IconButton title="Edit"><FiEdit className="text-indigo-600" /></IconButton>
                                            <IconButton title="Delete" onClick={(e) => { e.stopPropagation(); deleteTaskHandler(task._id); }}>
                                              <FiTrash2 className="text-red-600" />
                                            </IconButton>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
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
