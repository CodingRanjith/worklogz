import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiClock, FiSave, FiCheckCircle, FiAlertCircle, FiPlus, FiTrash2,
  FiCalendar, FiBriefcase, FiFileText, FiChevronLeft, FiChevronRight, FiX,
  FiRefreshCw
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import './MyTimesheet.css';

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

const MyTimesheet = () => {
  const token = localStorage.getItem('token');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projects, setProjects] = useState([]);
  const [timesheetEntries, setTimesheetEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedEntries, setSelectedEntries] = useState([]); // Array of entry IDs
  
  // Form state for new entry
  const [entryForm, setEntryForm] = useState({
    project: '',
    department: '',
    deliverable: '',
    fromTime: '',
    toTime: '',
    isLate: false
  });

  // Weekly summary state
  const [weeklySummary, setWeeklySummary] = useState({
    submitted: 0,
    pending: 0,
    actionRequired: 0,
    totalHours: 0,
    billableHours: 0,
    nonBillableHours: 0
  });

  // Modal: show entries for a specific date (weekly view row click)
  const [showDateEntriesModal, setShowDateEntriesModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);

  // Get start and end of week
  const getWeekRange = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = useMemo(() => getWeekRange(selectedDate), [selectedDate]);

  // Format date for display
  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch timesheet entries
  useEffect(() => {
    let isMounted = true;
    
    const loadEntries = async () => {
      try {
        if (viewMode === 'daily') {
          await fetchDailyEntries();
        } else {
          await fetchWeeklyEntries();
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading entries:', error);
        }
      }
    };
    
    loadEntries();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, viewMode]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getMyProjects, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // API returns { success: true, data: [...] }
      const projectsList = Array.isArray(res.data?.data) ? res.data.data : 
                           Array.isArray(res.data) ? res.data : [];
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Ensure projects is always an array
    }
  };

  const fetchDailyEntries = async () => {
    setLoading(true);
    try {
      const dateStr = formatDateForAPI(selectedDate);
      
      // Try both date-only format and ISO datetime format for API compatibility
      const res = await axios.get(`${API_ENDPOINTS.baseURL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: dateStr,
          endDate: dateStr,
          limit: 1000
        }
      });
      
      // API returns { tasks: [...], pagination: {...} }
      const tasksArray = Array.isArray(res.data?.tasks) ? res.data.tasks : 
                        Array.isArray(res.data) ? res.data : [];
      
      // Filter timesheet entries (tasks with startTime/endTime) and match exact date
      const entries = tasksArray.filter(task => {
        if (!task.startTime || !task.endTime) return false;
        
        // Extract date from startTime (handle ISO format)
        let entryDateStr = '';
        if (typeof task.startTime === 'string') {
          if (task.startTime.includes('T')) {
            entryDateStr = task.startTime.split('T')[0];
          } else if (task.startTime.match(/^\d{4}-\d{2}-\d{2}/)) {
            entryDateStr = task.startTime.substring(0, 10);
          } else {
            // Try to parse as date
            try {
              const entryDate = new Date(task.startTime);
              if (!isNaN(entryDate.getTime())) {
                entryDateStr = formatDateForAPI(entryDate);
              }
            } catch (e) {
              return false;
            }
          }
        } else if (task.startTime instanceof Date) {
          entryDateStr = formatDateForAPI(task.startTime);
        }
        
        // Match the exact date
        return entryDateStr === dateStr;
      });
      
      setTimesheetEntries(entries);
      calculateDailySummary(entries);
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status !== 401) {
        Swal.fire('Error', 'Failed to load timesheet entries', 'error');
      }
      setTimesheetEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyEntries = async () => {
    setLoading(true);
    try {
      const startStr = formatDateForAPI(weekStart);
      const endStr = formatDateForAPI(weekEnd);
      const res = await axios.get(`${API_ENDPOINTS.baseURL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: startStr,
          endDate: endStr
        }
      });
      
      // API returns { tasks: [...], pagination: {...} }
      const tasksArray = Array.isArray(res.data?.tasks) ? res.data.tasks : 
                        Array.isArray(res.data) ? res.data : [];
      
      const entries = tasksArray.filter(task => task.startTime && task.endTime);
      setTimesheetEntries(entries);
      calculateWeeklySummary(entries);
    } catch (error) {
      console.error('Error fetching weekly entries:', error);
      Swal.fire('Error', 'Failed to load weekly entries', 'error');
      setTimesheetEntries([]); // Ensure entries is always an array
    } finally {
      setLoading(false);
    }
  };

  const calculateDailySummary = (entries) => {
    let totalHours = 0;
    let billableHours = 0;
    let nonBillableHours = 0;

    entries.forEach(entry => {
      const hours = calculateHours(entry.startTime, entry.endTime);
      totalHours += hours;
      if (entry.billable !== false) {
        billableHours += hours;
      } else {
        nonBillableHours += hours;
      }
    });

    setWeeklySummary({
      submitted: entries.filter(e => e.timesheetStatus === 'submitted' || e.timesheetStatus === 'approved').length,
      pending: entries.filter(e => e.timesheetStatus === 'draft').length,
      actionRequired: entries.filter(e => e.timesheetStatus === 'rejected').length,
      totalHours,
      billableHours,
      nonBillableHours
    });
  };

  const calculateWeeklySummary = (entries) => {
    let totalHours = 0;
    let billableHours = 0;
    let nonBillableHours = 0;
    const statusCounts = { submitted: 0, pending: 0, actionRequired: 0 };

    entries.forEach(entry => {
      const hours = calculateHours(entry.startTime, entry.endTime);
      totalHours += hours;
      if (entry.billable !== false) {
        billableHours += hours;
      } else {
        nonBillableHours += hours;
      }
      
      if (entry.timesheetStatus === 'submitted' || entry.timesheetStatus === 'approved') {
        statusCounts.submitted++;
      } else if (entry.timesheetStatus === 'draft') {
        statusCounts.pending++;
      } else if (entry.timesheetStatus === 'rejected') {
        statusCounts.actionRequired++;
      }
    });

    setWeeklySummary({
      ...statusCounts,
      totalHours,
      billableHours,
      nonBillableHours
    });
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    // Handle ISO format e.g. "2026-02-09T14:25:00"
    const startStr = startTime.includes('T') ? startTime.split('T')[1]?.substring(0, 5) : startTime;
    const endStr = endTime.includes('T') ? endTime.split('T')[1]?.substring(0, 5) : endTime;
    if (!startStr || !endStr) return 0;
    
    const parts = startStr.split(':').map(Number);
    const startH = parts[0], startM = parts[1] || 0;
    const endParts = endStr.split(':').map(Number);
    const endH = endParts[0], endM = endParts[1] || 0;
    
    if (isNaN(startH) || isNaN(endH)) return 0;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return (endMinutes - startMinutes) / 60;
  };

  const formatHours = (hours) => {
    if (typeof hours !== 'number' || isNaN(hours)) return '00:00';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleDateRowClick = (date) => {
    setModalDate(date);
    setShowDateEntriesModal(true);
  };

  const getEntriesForDate = (date) => {
    if (!date || !Array.isArray(timesheetEntries)) return [];
    const dateStr = date.toDateString();
    return timesheetEntries.filter(e => {
      const entryDate = e.startTime ? new Date(e.startTime.split('T')[0]).toDateString() : '';
      return entryDate === dateStr;
    });
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleInputChange = (field, value) => {
    setEntryForm(prev => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    if (!entryForm.project || !entryForm.department || !entryForm.fromTime || !entryForm.toTime) {
      Swal.fire('Validation Error', 'Please fill in all required fields', 'warning');
      return;
    }

    if (entryForm.fromTime >= entryForm.toTime) {
      Swal.fire('Validation Error', 'End time must be after start time', 'warning');
      return;
    }

    const newEntry = {
      title: entryForm.deliverable || 'Timesheet Entry',
      description: entryForm.deliverable,
      notes: entryForm.deliverable,
      project: entryForm.project,
      department: entryForm.department,
      startTime: entryForm.fromTime,
      endTime: entryForm.toTime,
      billable: true,
      isLate: entryForm.isLate || false,
      timesheetStatus: 'draft',
      status: 'backlog'
    };

    saveEntry(newEntry);
  };

  const saveEntry = async (entryData) => {
    try {
      const dateStr = formatDateForAPI(selectedDate);
      const taskData = {
        ...entryData,
        startTime: `${dateStr}T${entryData.startTime}:00`,
        endTime: `${dateStr}T${entryData.endTime}:00`
      };

      console.log('Saving entry:', taskData);

      const res = await axios.post(`${API_ENDPOINTS.baseURL}/api/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Entry saved successfully:', res.data);

      Swal.fire('Success', 'Timesheet entry added successfully', 'success');
      setEntryForm({
        project: '',
        department: '',
        deliverable: '',
        fromTime: '',
        toTime: '',
        isLate: false
      });
      
      // Refresh entries immediately
      if (viewMode === 'daily') {
        await fetchDailyEntries();
      } else {
        await fetchWeeklyEntries();
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      console.error('Error response:', error.response?.data);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save entry', 'error');
    }
  };

  const saveDrafts = async () => {
    const drafts = timesheetEntries.filter(e => e.timesheetStatus === 'draft');
    if (drafts.length === 0) {
      Swal.fire('Info', 'No draft entries to save', 'info');
      return;
    }

    try {
      // Save all drafts (they're already saved, just update status if needed)
      Swal.fire('Success', 'Drafts saved successfully', 'success');
      if (viewMode === 'daily') {
        fetchDailyEntries();
      } else {
        fetchWeeklyEntries();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save drafts', 'error');
    }
  };

  const handleSelectEntry = (entryId) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAllDrafts = () => {
    const drafts = timesheetEntries.filter(e => e.timesheetStatus === 'draft');
    if (selectedEntries.length === drafts.length && drafts.length > 0) {
      // Deselect all
      setSelectedEntries([]);
    } else {
      // Select all drafts
      setSelectedEntries(drafts.map(e => e._id));
    }
  };

  const handleToggleLate = async (entryId, isLate) => {
    try {
      const entry = timesheetEntries.find(e => e._id === entryId);
      if (!entry) return;

      await axios.put(`${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`, {
        ...entry,
        isLate: isLate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh entries
      if (viewMode === 'daily') {
        await fetchDailyEntries();
      } else {
        await fetchWeeklyEntries();
      }
    } catch (error) {
      console.error('Error updating late status:', error);
      Swal.fire('Error', 'Failed to update late status', 'error');
    }
  };

  const submitSelected = async () => {
    if (selectedEntries.length === 0) {
      Swal.fire('Info', 'Please select entries to submit', 'info');
      return;
    }

    const selected = timesheetEntries.filter(e => selectedEntries.includes(e._id));
    const drafts = selected.filter(e => e.timesheetStatus === 'draft');
    
    if (drafts.length === 0) {
      Swal.fire('Info', 'Selected entries are already submitted or approved', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Submit Timesheet Entries?',
      text: `Are you sure you want to submit ${drafts.length} entry/entries?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, submit them!'
    });

    if (!result.isConfirmed) return;

    try {
      for (const entry of drafts) {
        await axios.put(`${API_ENDPOINTS.baseURL}/api/tasks/${entry._id}`, {
          ...entry,
          timesheetStatus: 'submitted'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      Swal.fire('Success', `${drafts.length} entry/entries submitted successfully`, 'success');
      setSelectedEntries([]); // Clear selection
      // Refresh entries
      if (viewMode === 'daily') {
        await fetchDailyEntries();
      } else {
        await fetchWeeklyEntries();
      }
    } catch (error) {
      console.error('Error submitting entries:', error);
      Swal.fire('Error', 'Failed to submit entries', 'error');
    }
  };

  const deleteEntry = async (entryId) => {
    const result = await Swal.fire({
      title: 'Delete Entry?',
      text: 'Are you sure you want to delete this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Entry has been deleted.', 'success');
        if (viewMode === 'daily') {
          fetchDailyEntries();
        } else {
          fetchWeeklyEntries();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete entry', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { label: 'Draft', class: 'badge-draft' },
      submitted: { label: 'Submitted', class: 'badge-submitted' },
      approved: { label: 'Approved', class: 'badge-approved' },
      rejected: { label: 'Action Required', class: 'badge-rejected' }
    };
    return badges[status] || badges.draft;
  };

  const getProjectName = (projectId) => {
    if (!Array.isArray(projects) || !projectId) return 'Non-Projects';
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'Non-Projects';
  };

  return (
    <div className="my-timesheet-page">
      <div className="timesheet-header">
        <div>
          <h1>My Timesheets</h1>
          <p>Log your daily work hours and track time spent on projects</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => {
              if (viewMode === 'daily') {
                fetchDailyEntries();
              } else {
                fetchWeeklyEntries();
              }
            }}
            className="btn-refresh"
            title="Refresh entries"
          >
            <FiRefreshCw /> Refresh
          </button>
          <button className="btn-add-timesheet">
            <FiPlus /> Add Timesheet
          </button>
          <div className="view-toggle">
            <button 
              className={viewMode === 'daily' ? 'active' : ''}
              onClick={() => setViewMode('daily')}
            >
              Daily
            </button>
            <button 
              className={viewMode === 'weekly' ? 'active' : ''}
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'daily' && (
        <>
          {/* Daily View Section */}
          <div className="daily-view-section">
            <div className="date-navigation">
              <button onClick={() => handleDateChange(-1)} className="nav-btn">
                <FiChevronLeft />
              </button>
              <div className="date-display">
                <FiCalendar />
                <span>{formatDate(selectedDate)}</span>
              </div>
              <button onClick={() => handleDateChange(1)} className="nav-btn">
                <FiChevronRight />
              </button>
            </div>

            {/* Daily Summary Cards */}
            <div className="daily-summary-cards">
              <div className="daily-summary-card">
                <span className="label">Total Hours</span>
                <span className="value">{formatHours(weeklySummary.totalHours)}</span>
              </div>
              <div className="daily-summary-card">
                <span className="label">Billable</span>
                <span className="value">{formatHours(weeklySummary.billableHours)}</span>
              </div>
              <div className="daily-summary-card">
                <span className="label">Non-Billable</span>
                <span className="value">{formatHours(weeklySummary.nonBillableHours)}</span>
              </div>
              <div className="daily-summary-card">
                <span className="label">Entries</span>
                <span className="value">{timesheetEntries.length}</span>
              </div>
            </div>

            {/* Entry Form */}
            <div className="entry-form-section">
              <div className="form-row">
                <select
                  value={entryForm.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Project</option>
                  {Array.isArray(projects) && projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                  <option value="non-project">Non-Projects</option>
                </select>

                <select
                  value={entryForm.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="form-select"
                >
                  <option value="">Department</option>
                  {COMPANY_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Deliverable / Notes"
                  value={entryForm.deliverable}
                  onChange={(e) => handleInputChange('deliverable', e.target.value)}
                  className="form-input"
                />

                <input
                  type="time"
                  value={entryForm.fromTime}
                  onChange={(e) => handleInputChange('fromTime', e.target.value)}
                  className="form-time"
                  placeholder="From"
                />

                <input
                  type="time"
                  value={entryForm.toTime}
                  onChange={(e) => handleInputChange('toTime', e.target.value)}
                  className="form-time"
                  placeholder="To"
                />

                <button onClick={addEntry} className="btn-add-entry">
                  <FiPlus /> Add Entry
                </button>
              </div>

              {/* Late Option */}
              <div className="form-late-option">
                <label className="checkbox-label-inline">
                  <input
                    type="checkbox"
                    checked={entryForm.isLate || false}
                    onChange={(e) => handleInputChange('isLate', e.target.checked)}
                  />
                  <span className="late-label">⚠ Mark this entry as Late</span>
                </label>
              </div>

              <div className="form-actions">
                <div className="select-all-section">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={
                        timesheetEntries.filter(e => e.timesheetStatus === 'draft').length > 0 &&
                        selectedEntries.length === timesheetEntries.filter(e => e.timesheetStatus === 'draft').length
                      }
                      onChange={handleSelectAllDrafts}
                    />
                    Select all drafts ({timesheetEntries.filter(e => e.timesheetStatus === 'draft').length})
                  </label>
                  {selectedEntries.length > 0 && (
                    <button 
                      onClick={() => setSelectedEntries([])}
                      className="btn-clear-selection"
                      title="Clear selection"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="action-buttons">
                  <button onClick={saveDrafts} className="btn-save-drafts">
                    <FiSave /> Save Drafts
                  </button>
                  <button 
                    onClick={submitSelected} 
                    className="btn-submit-selected"
                    disabled={selectedEntries.length === 0}
                  >
                    <FiCheckCircle /> Submit Selected ({selectedEntries.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Weekly Summary */}
      {viewMode === 'weekly' && (
        <div className="weekly-summary-section">
          <h2>Weekly Summary</h2>
          <p className="week-range">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </p>
          
          <div className="status-cards">
            <div className="status-card submitted">
              <span className="label">Submitted</span>
              <span className="count">{weeklySummary.submitted}</span>
            </div>
            <div className="status-card pending">
              <span className="label">Pending</span>
              <span className="count">{weeklySummary.pending}</span>
            </div>
            <div className="status-card action-required">
              <span className="label">Action Required</span>
              <span className="count">{weeklySummary.actionRequired}</span>
            </div>
          </div>

          <div className="weekly-table">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Bill</th>
                  <th>Non</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(weekStart);
                  date.setDate(weekStart.getDate() + i);
                  const dayEntries = timesheetEntries.filter(e => {
                    const entryDate = new Date(e.startTime);
                    return entryDate.toDateString() === date.toDateString();
                  });
                  
                  const dayTotal = dayEntries.reduce((sum, e) => 
                    sum + calculateHours(e.startTime?.split('T')[1]?.substring(0, 5), e.endTime?.split('T')[1]?.substring(0, 5)), 0
                  );
                  const dayBillable = dayEntries.filter(e => e.billable !== false).reduce((sum, e) => 
                    sum + calculateHours(e.startTime?.split('T')[1]?.substring(0, 5), e.endTime?.split('T')[1]?.substring(0, 5)), 0
                  );
                  const dayNonBillable = dayTotal - dayBillable;
                  
                  const status = dayEntries.length === 0 ? 'Upcoming' : 
                                dayEntries.some(e => e.timesheetStatus === 'rejected') ? 'Action Required' :
                                dayEntries.every(e => e.timesheetStatus === 'approved' || e.timesheetStatus === 'submitted') ? 'Submitted' :
                                'Pending';

                  return (
                    <tr
                      key={i}
                      className="weekly-date-row"
                      onClick={() => handleDateRowClick(date)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleDateRowClick(date)}
                    >
                      <td>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</td>
                      <td>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</td>
                      <td>
                        <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                          {status}
                        </span>
                      </td>
                      <td>{formatHours(dayTotal)}</td>
                      <td>{formatHours(dayBillable)}</td>
                      <td>{formatHours(dayNonBillable)}</td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td colSpan="3">Total</td>
                  <td>{formatHours(weeklySummary.totalHours)}</td>
                  <td>{formatHours(weeklySummary.billableHours)}</td>
                  <td>{formatHours(weeklySummary.nonBillableHours)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-hours">
            <div className="summary-item">
              <span className="label">Week Total:</span>
              <span className="value">{formatHours(weeklySummary.totalHours)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Billable:</span>
              <span className="value">{formatHours(weeklySummary.billableHours)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Non-Billable:</span>
              <span className="value">{formatHours(weeklySummary.nonBillableHours)}</span>
            </div>
          </div>

          <p className="instruction-text">
            Timesheets marked as 'Action Required' must be submitted before payroll processing.
          </p>
        </div>
      )}

      {/* Modal: Entries for selected date */}
      {showDateEntriesModal && modalDate && (
        <div className="date-entries-modal-overlay" onClick={() => setShowDateEntriesModal(false)}>
          <div className="date-entries-modal" onClick={(e) => e.stopPropagation()}>
            <div className="date-entries-modal-header">
              <h2>Entries for {formatDate(modalDate)}</h2>
              <button
                type="button"
                className="date-entries-modal-close"
                onClick={() => setShowDateEntriesModal(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <div className="date-entries-modal-body">
              {(() => {
                const entriesForDate = getEntriesForDate(modalDate);
                if (entriesForDate.length === 0) {
                  return (
                    <div className="date-entries-empty">
                      <FiFileText />
                      <p>No timesheet entries for this date.</p>
                    </div>
                  );
                }
                const totalH = entriesForDate.reduce((s, e) => s + calculateHours(e.startTime, e.endTime), 0);
                const billableH = entriesForDate.filter(e => e.billable !== false).reduce((s, e) => s + calculateHours(e.startTime, e.endTime), 0);
                return (
                  <>
                    <div className="date-entries-summary">
                      <span>Total: {formatHours(totalH)}</span>
                      <span>Billable: {formatHours(billableH)}</span>
                      <span>Non-billable: {formatHours(totalH - billableH)}</span>
                    </div>
                    <table className="date-entries-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Project</th>
                          <th>Deliverable</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Billable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entriesForDate.map((entry, idx) => {
                          const startT = entry.startTime?.includes('T') ? entry.startTime.split('T')[1]?.substring(0, 5) : entry.startTime;
                          const endT = entry.endTime?.includes('T') ? entry.endTime.split('T')[1]?.substring(0, 5) : entry.endTime;
                          const hrs = calculateHours(entry.startTime, entry.endTime);
                          const badge = getStatusBadge(entry.timesheetStatus || 'draft');
                          return (
                            <tr key={entry._id}>
                              <td>{idx + 1}</td>
                              <td>{getProjectName(entry.project)}</td>
                              <td>{entry.notes || entry.description || '-'}</td>
                              <td>{startT || '-'}</td>
                              <td>{endT || '-'}</td>
                              <td>{formatHours(hrs)}</td>
                              <td><span className={`badge ${badge.class}`}>{badge.label}</span></td>
                              <td>{entry.billable !== false ? 'Yes' : 'No'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Entries Detail Table */}
      <div className="entries-detail-section">
        <div className="entries-section-header">
          <h2>Entries Detail</h2>
          {viewMode === 'daily' && timesheetEntries.length > 0 && (
            <div className="entries-count">
              {timesheetEntries.length} {timesheetEntries.length === 1 ? 'entry' : 'entries'} for {formatDate(selectedDate)}
            </div>
          )}
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : timesheetEntries.length === 0 ? (
          <div className="empty-state">
            <FiFileText />
            <p>No timesheet entries found. Add your first entry using the form above.</p>
          </div>
        ) : (
          <div className="entries-table-wrapper">
            <table className="entries-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      checked={
                        timesheetEntries.filter(e => e.timesheetStatus === 'draft').length > 0 &&
                        selectedEntries.length === timesheetEntries.filter(e => e.timesheetStatus === 'draft').length
                      }
                      onChange={handleSelectAllDrafts}
                      title="Select all drafts"
                    />
                  </th>
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ minWidth: '100px' }}>Date</th>
                  <th style={{ minWidth: '120px' }}>Client</th>
                  <th style={{ minWidth: '150px' }}>Project</th>
                  <th style={{ minWidth: '200px' }}>Deliverable</th>
                  <th style={{ minWidth: '100px' }}>Department</th>
                  <th style={{ minWidth: '80px' }}>From</th>
                  <th style={{ minWidth: '80px' }}>To</th>
                  <th style={{ minWidth: '80px' }}>Total</th>
                  <th style={{ minWidth: '100px' }}>Status</th>
                  <th style={{ minWidth: '80px' }}>Billable</th>
                  <th style={{ minWidth: '100px' }}>Late</th>
                  <th style={{ minWidth: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheetEntries.map((entry, index) => {
                  const startTime = entry.startTime?.includes('T') 
                    ? entry.startTime.split('T')[1]?.substring(0, 5) 
                    : entry.startTime;
                  const endTime = entry.endTime?.includes('T') 
                    ? entry.endTime.split('T')[1]?.substring(0, 5) 
                    : entry.endTime;
                  const hours = calculateHours(startTime, endTime);
                  const badge = getStatusBadge(entry.timesheetStatus || 'draft');
                  const isDraft = entry.timesheetStatus === 'draft';
                  const isSelected = selectedEntries.includes(entry._id);
                  
                  return (
                    <tr key={entry._id} className={isSelected ? 'row-selected' : ''}>
                      <td>
                        {isDraft && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectEntry(entry._id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </td>
                      <td>{index + 1}</td>
                      <td>{entry.startTime?.split('T')[0] || formatDateForAPI(selectedDate)}</td>
                      <td>
                        {(() => {
                          const project = projects.find(p => p._id === entry.project);
                          return project?.client || '-';
                        })()}
                      </td>
                      <td>{getProjectName(entry.project)}</td>
                      <td className="deliverable-cell" title={entry.notes || entry.description || '-'}>
                        {entry.notes || entry.description || '-'}
                      </td>
                      <td>{entry.department || '-'}</td>
                      <td>{startTime || '-'}</td>
                      <td>{endTime || '-'}</td>
                      <td className="total-hours-cell">{formatHours(hours)}</td>
                      <td>
                        <span className={`badge ${badge.class}`}>{badge.label}</span>
                      </td>
                      <td>
                        <span className={`badge ${entry.billable !== false ? 'badge-billable' : 'badge-nonbillable'}`}>
                          {entry.billable !== false ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {entry.isLate ? (
                          <span className="badge badge-late">Late</span>
                        ) : (
                          <span className="badge badge-ontime">On Time</span>
                        )}
                      </td>
                      <td>
                        <div className="entry-actions">
                          {isDraft && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLate(entry._id, !entry.isLate);
                              }}
                              className="btn-late-toggle"
                              title={entry.isLate ? "Mark as on time" : "Mark as late"}
                            >
                              {entry.isLate ? '✓' : '⚠'}
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntry(entry._id);
                            }}
                            className="btn-delete"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTimesheet;
