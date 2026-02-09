import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiRefreshCw, FiUsers, FiDownload, FiEye, FiCheckCircle,
  FiXCircle, FiClock, FiBriefcase, FiSearch, FiCalendar, FiPlus, FiX
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import './TimesheetAdmin.css';

const TimesheetAdmin = () => {
  const token = localStorage.getItem('token');
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'project'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeEntries, setShowEmployeeEntries] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all'); // 'all' or specific date
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  // Set default date range to last 30 days
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Summary stats
  const [summary, setSummary] = useState({
    totalHours: '00:00',
    bookedHours: '00:00',
    billableHours: '00:00',
    nonBillable: '00:00',
    pendingApproval: '00:00'
  });

  // Employees list
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Projects list
  const [projects, setProjects] = useState([]);
  const [showAddTimesheetModal, setShowAddTimesheetModal] = useState(false);
  const [timesheetForm, setTimesheetForm] = useState({
    employee: '',
    project: '',
    department: '',
    deliverable: '',
    date: new Date().toISOString().split('T')[0],
    fromTime: '',
    toTime: '',
    billable: true
  });

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
    fetchProjects();
    fetchTimesheets();
  }, [statusFilter, employeeFilter, userFilter, startDate, endDate, searchQuery]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getProjectsAdmin, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projectsList = Array.isArray(res.data?.data) ? res.data.data : 
                           Array.isArray(res.data) ? res.data : [];
      setProjects(projectsList);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const params = {
        startDate,
        endDate,
        limit: 1000, // Increase limit to get more entries
        page: 1
      };

      // Use timesheetStatus instead of status for timesheet entries
      if (statusFilter !== 'all') {
        params.timesheetStatus = statusFilter;
      }

      if (employeeFilter !== 'all') {
        params.userId = employeeFilter;
      }

      const res = await axios.get(`${API_ENDPOINTS.baseURL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      // API returns { tasks: [...], pagination: {...} }
      const tasksArray = Array.isArray(res.data?.tasks) ? res.data.tasks : 
                        Array.isArray(res.data) ? res.data : [];

      console.log('Fetched tasks:', tasksArray.length);
      
      // Filter timesheet entries (tasks with startTime/endTime)
      let entries = tasksArray.filter(task => task.startTime && task.endTime);
      
      console.log('Timesheet entries (with startTime/endTime):', entries.length);
      
      // Apply search filter
      if (searchQuery) {
        entries = entries.filter(entry => {
          const userId = entry.user?._id || entry.user;
          const employee = employees.find(e => e._id === userId || e._id?.toString() === userId?.toString());
          const employeeName = employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() : '';
          return employeeName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        console.log('After search filter:', entries.length);
      }

      console.log('Final entries to display:', entries.length);
      setTimesheets(entries);
      calculateSummary(entries);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      Swal.fire('Error', 'Failed to load timesheets', 'error');
      setTimesheets([]); // Ensure timesheets is always an array
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (entries) => {
    let totalMinutes = 0;
    let bookedMinutes = 0;
    let billableMinutes = 0;
    let nonBillableMinutes = 0;
    let pendingMinutes = 0;

    entries.forEach(entry => {
      const hours = calculateHours(entry.startTime, entry.endTime);
      const minutes = hours * 60;
      totalMinutes += minutes;
      
      if (entry.timesheetStatus === 'submitted' || entry.timesheetStatus === 'approved') {
        bookedMinutes += minutes;
      }
      
      if (entry.billable !== false) {
        billableMinutes += minutes;
      } else {
        nonBillableMinutes += minutes;
      }
      
      if (entry.timesheetStatus === 'draft' || entry.timesheetStatus === 'submitted') {
        pendingMinutes += minutes;
      }
    });

    setSummary({
      totalHours: formatMinutes(totalMinutes),
      bookedHours: formatMinutes(bookedMinutes),
      billableHours: formatMinutes(billableMinutes),
      nonBillable: formatMinutes(nonBillableMinutes),
      pendingApproval: formatMinutes(pendingMinutes)
    });
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = startTime.includes('T') ? startTime.split('T')[1]?.substring(0, 5) : startTime;
    const end = endTime.includes('T') ? endTime.split('T')[1]?.substring(0, 5) : endTime;
    
    if (!start || !end) return 0;
    
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return (endMinutes - startMinutes) / 60;
  };

  const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Group entries by employee and collect unique dates
  const employeeGroups = useMemo(() => {
    const groups = {};
    timesheets.forEach(entry => {
      const userId = entry.user?._id || entry.user;
      const userIdStr = userId?.toString();
      
      if (!groups[userIdStr]) {
        // Find employee by matching _id (handle both string and object IDs)
        let employee = employees.find(e => 
          e._id?.toString() === userIdStr || 
          e._id === userId ||
          (entry.user?.firstName && e.firstName === entry.user.firstName && e.lastName === entry.user.lastName)
        );
        
        // If employee not found, try to use entry.user if it has name properties
        if (!employee && entry.user) {
          if (entry.user.firstName || entry.user.lastName || entry.user.name) {
            employee = entry.user;
          }
        }
        
        groups[userIdStr] = {
          employee: employee || { name: 'Unknown Employee' },
          entries: [],
          dates: new Set(),
          totalEntries: 0,
          pending: 0,
          submitted: 0,
          approved: 0,
          rejected: 0,
          totalHours: 0
        };
      }
      groups[userIdStr].entries.push(entry);
      groups[userIdStr].totalEntries++;
      
      const entryDate = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10);
      if (entryDate) groups[userIdStr].dates.add(entryDate);
      
      if (entry.timesheetStatus === 'draft') {
        groups[userIdStr].pending++;
      } else if (entry.timesheetStatus === 'submitted') {
        groups[userIdStr].submitted = (groups[userIdStr].submitted || 0) + 1;
        groups[userIdStr].pending++;
      } else if (entry.timesheetStatus === 'approved') {
        groups[userIdStr].approved++;
      } else if (entry.timesheetStatus === 'rejected') {
        groups[userIdStr].rejected++;
      }
      
      const hours = calculateHours(entry.startTime, entry.endTime);
      groups[userIdStr].totalHours += hours;
    });
    return Object.values(groups).map(g => ({
      ...g,
      dates: Array.from(g.dates).sort()
    }));
  }, [timesheets, employees]);

  // Group selected employee entries by date for modal
  const entriesByDate = useMemo(() => {
    if (!selectedEmployee?.entries?.length) return [];
    const byDate = {};
    selectedEmployee.entries.forEach(entry => {
      const d = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10) || 'unknown';
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(entry);
    });
    
    let result = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, entries]) => ({ date, entries }));
    
    // Filter by selected date if not 'all'
    if (selectedDateFilter !== 'all') {
      result = result.filter(({ date }) => date === selectedDateFilter);
    }
    
    return result;
  }, [selectedEmployee?.entries, selectedDateFilter]);

  const handleViewEmployee = (employeeData) => {
    setSelectedEmployee(employeeData);
    setSelectedDateFilter('all'); // Reset date filter when opening modal
    setShowEmployeeEntries(true);
  };

  const handleApprove = async (entryId) => {
    const result = await Swal.fire({
      title: 'Approve Timesheet Entry?',
      text: 'Are you sure you want to approve this entry?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, approve it!'
    });

    if (!result.isConfirmed) return;

    try {
      const entry = timesheets.find(e => e._id === entryId);
      await axios.put(`${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`, {
        ...entry,
        timesheetStatus: 'approved'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire('Success', 'Timesheet entry approved successfully', 'success');
      
      // Refresh timesheets
      await fetchTimesheets();
      
      // Update modal if open
      if (showEmployeeEntries && selectedEmployee) {
        const updatedEmployee = {
          ...selectedEmployee,
          entries: selectedEmployee.entries.map(e => 
            e._id === entryId ? { ...e, timesheetStatus: 'approved' } : e
          )
        };
        setSelectedEmployee(updatedEmployee);
      }
    } catch (error) {
      console.error('Error approving entry:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to approve entry', 'error');
    }
  };

  const handleReject = async (entryId) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: 'Reject Timesheet Entry',
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #495057;">
            Reason for rejection <span style="color: #ef4444;">*</span>
          </label>
        </div>
      `,
      input: 'textarea',
      inputLabel: '',
      inputPlaceholder: 'Enter rejection reason...',
      inputAttributes: {
        rows: 4,
        style: 'width: 100%; padding: 10px; border: 1.5px solid #dee2e6; border-radius: 8px; font-size: 14px;'
      },
      showCancelButton: true,
      confirmButtonText: 'Reject Entry',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Please provide a rejection reason';
        }
        if (value.trim().length < 5) {
          return 'Rejection reason must be at least 5 characters';
        }
      }
    });

    if (reason && isConfirmed) {
      try {
        const entry = timesheets.find(e => e._id === entryId);
        await axios.put(`${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`, {
          ...entry,
          timesheetStatus: 'rejected',
          rejectionReason: reason.trim()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Entry Rejected',
          text: 'The timesheet entry has been rejected successfully.',
          confirmButtonColor: '#667eea'
        });
        
        // Refresh timesheets
        await fetchTimesheets();
        
        // Update modal if open
        if (showEmployeeEntries && selectedEmployee) {
          const updatedEmployee = {
            ...selectedEmployee,
            entries: selectedEmployee.entries.map(e => 
              e._id === entryId ? { ...e, timesheetStatus: 'rejected', rejectionReason: reason.trim() } : e
            )
          };
          setSelectedEmployee(updatedEmployee);
        }
      } catch (error) {
        console.error('Error rejecting entry:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to reject entry. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    }
  };

  const handleRevert = async (entryId) => {
    const result = await Swal.fire({
      title: 'Revoke Approval?',
      text: 'Are you sure you want to revoke the approval for this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, revoke it!'
    });

    if (!result.isConfirmed) return;

    try {
      const entry = timesheets.find(e => e._id === entryId);
      await axios.put(`${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`, {
        ...entry,
        timesheetStatus: 'submitted'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire('Success', 'Approval revoked successfully', 'success');
      
      // Refresh timesheets
      await fetchTimesheets();
      
      // Update modal if open
      if (showEmployeeEntries && selectedEmployee) {
        const updatedEmployee = {
          ...selectedEmployee,
          entries: selectedEmployee.entries.map(e => 
            e._id === entryId ? { ...e, timesheetStatus: 'submitted' } : e
          )
        };
        setSelectedEmployee(updatedEmployee);
      }
    } catch (error) {
      console.error('Error revoking approval:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to revoke approval', 'error');
    }
  };

  const exportToExcel = () => {
    Swal.fire('Info', 'Excel export feature coming soon', 'info');
  };

  const getProjectName = (projectId) => {
    if (!projectId) return 'Non-Projects';
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'Non-Projects';
  };

  const handleAddTimesheet = async () => {
    if (!timesheetForm.employee || !timesheetForm.fromTime || !timesheetForm.toTime) {
      Swal.fire('Validation Error', 'Please fill in all required fields', 'warning');
      return;
    }

    if (timesheetForm.fromTime >= timesheetForm.toTime) {
      Swal.fire('Validation Error', 'End time must be after start time', 'warning');
      return;
    }

    try {
      const taskData = {
        title: timesheetForm.deliverable || 'Timesheet Entry',
        description: timesheetForm.deliverable,
        notes: timesheetForm.deliverable,
        project: timesheetForm.project || null,
        department: timesheetForm.department,
        user: timesheetForm.employee,
        startTime: `${timesheetForm.date}T${timesheetForm.fromTime}:00`,
        endTime: `${timesheetForm.date}T${timesheetForm.toTime}:00`,
        billable: timesheetForm.billable,
        timesheetStatus: 'draft',
        status: 'backlog'
      };

      await axios.post(`${API_ENDPOINTS.baseURL}/api/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire('Success', 'Timesheet entry added successfully', 'success');
      setShowAddTimesheetModal(false);
      setTimesheetForm({
        employee: '',
        project: '',
        department: '',
        deliverable: '',
        date: new Date().toISOString().split('T')[0],
        fromTime: '',
        toTime: '',
        billable: true
      });
      fetchTimesheets();
    } catch (error) {
      console.error('Error adding timesheet:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to add timesheet entry', 'error');
    }
  };

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


  return (
    <div className="timesheet-admin-page">
      {/* Professional Header */}
      <div className="admin-header">
        <div>
          <h1>Timesheet Administration</h1>
          <p>Manage, review, and approve employee timesheet entries</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowAddTimesheetModal(true)} className="btn-add-timesheet">
            <FiPlus /> Add Entry
          </button>
          <button onClick={fetchTimesheets} className="btn-refresh">
            <FiRefreshCw /> Refresh
          </button>
          <button onClick={exportToExcel} className="btn-export">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      <div className="main-content-wrapper">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card total-hours">
            <div className="card-label">Total Hours</div>
            <div className="card-value">{summary.totalHours}</div>
          </div>
          <div className="summary-card booked-hours">
            <div className="card-label">Booked Hours</div>
            <div className="card-value">{summary.bookedHours}</div>
          </div>
          <div className="summary-card billable-hours">
            <div className="card-label">Billable Hours</div>
            <div className="card-value">{summary.billableHours}</div>
          </div>
          <div className="summary-card non-billable">
            <div className="card-label">Non-Billable</div>
            <div className="card-value">{summary.nonBillable}</div>
          </div>
          <div className="summary-card pending-approval">
            <div className="card-label">Pending Approval</div>
            <div className="card-value">{summary.pendingApproval}</div>
          </div>
        </div>

        {/* Professional Filters Section */}
        <div className="filters-section">
          <h3>Filter & Search</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Search Employee</label>
              <div className="filter-item">
                <FiSearch className="filter-icon" />
                <input
                  type="text"
                  placeholder="Enter employee name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Employee</label>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">User</label>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <div className="filter-item">
                <FiCalendar className="filter-icon" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="filter-date"
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <div className="filter-item">
                <FiCalendar className="filter-icon" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="filter-date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Manager View Notice */}
        <div className="manager-notice">
          <strong>Manager View:</strong> You can approve/reject timesheet entries for employees where you are set as their <strong>Reporting To</strong> in their basic details.
        </div>

        {/* Employee List Table */}
        {loading ? (
          <div className="loading">Loading timesheet data...</div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>EMPLOYEE NAME</th>
                  <th>TIMESHEET DATES</th>
                  <th>TOTAL ENTRIES</th>
                  <th>SUBMITTED</th>
                  <th>APPROVED</th>
                  <th>REJECTED</th>
                  <th>TOTAL HOURS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {employeeGroups.map((group, index) => (
                  <tr key={group.employee?._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <div 
                        className="employee-name clickable"
                        onClick={() => handleViewEmployee(group)}
                        title="Click to view date-wise entries"
                      >
                        <FiUsers className="employee-icon" />
                        {group.employee ? `${group.employee.firstName || ''} ${group.employee.lastName || ''}`.trim() || group.employee.name : 'Unknown'}
                      </div>
                    </td>
                    <td className="dates-cell">
                      {group.dates && group.dates.length > 0
                        ? group.dates.slice(0, 5).map(d => (
                            <span key={d} className="date-tag">{d}</span>
                          ))
                        : '-'}
                      {group.dates?.length > 5 && (
                        <span className="date-tag more">+{group.dates.length - 5} more</span>
                      )}
                    </td>
                    <td>{group.totalEntries}</td>
                    <td>{group.submitted ?? group.pending}</td>
                    <td>{group.approved}</td>
                    <td>{group.rejected}</td>
                    <td>{formatHours(group.totalHours)}</td>
                    <td>
                      <button 
                        onClick={() => handleViewEmployee(group)}
                        className="btn-view"
                        title="View date-wise entries"
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {employeeGroups.length === 0 && (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No timesheet entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Entries Modal */}
      {showEmployeeEntries && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowEmployeeEntries(false)}>
          <div className="modal-content employee-entries-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ flex: 1 }}>
                <h2>
                  {(() => {
                    const emp = selectedEmployee.employee;
                    if (!emp) return 'Employee - Timesheet Entries';
                    
                    const firstName = emp.firstName || '';
                    const lastName = emp.lastName || '';
                    const fullName = `${firstName} ${lastName}`.trim();
                    
                    if (fullName) return `${fullName} - Timesheet Entries`;
                    if (emp.name) return `${emp.name} - Timesheet Entries`;
                    return 'Employee - Timesheet Entries';
                  })()}
                </h2>
                <div className="date-filter-section">
                  <label>Filter by Date:</label>
                  <select
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    {selectedEmployee.entries && (() => {
                      const dates = new Set();
                      selectedEmployee.entries.forEach(entry => {
                        const d = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10);
                        if (d) dates.add(d);
                      });
                      return Array.from(dates).sort().map(date => (
                        <option key={date} value={date}>{date}</option>
                      ));
                    })()}
                  </select>
                  {selectedDateFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedDateFilter('all')}
                      className="clear-filter-btn"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => setShowEmployeeEntries(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {entriesByDate.length > 0 ? (
                <div className="entries-by-date">
                  {entriesByDate.map(({ date, entries }) => (
                    <div key={date} className="date-section">
                      <h3 className="date-section-title">
                        Entries for {date}
                        <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '500', color: '#6c757d' }}>
                          ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
                        </span>
                      </h3>
                      <div className="entries-table-wrapper">
                        <table className="entries-table">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Project</th>
                              <th>Department</th>
                              <th>Deliverable</th>
                              <th>From</th>
                              <th>To</th>
                              <th>Hours</th>
                              <th>Billable</th>
                              <th>Status</th>
                              <th>Rejection Reason</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((entry, index) => {
                              const startTime = entry.startTime?.includes('T') 
                                ? entry.startTime.split('T')[1]?.substring(0, 5) 
                                : entry.startTime;
                              const endTime = entry.endTime?.includes('T') 
                                ? entry.endTime.split('T')[1]?.substring(0, 5) 
                                : entry.endTime;
                              const hours = calculateHours(entry.startTime, entry.endTime);
                              const status = entry.timesheetStatus || 'draft';
                              const statusLabel = status === 'submitted' ? 'Submitted' : status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Draft';
                              
                              return (
                                <tr key={entry._id} className={`row-status-${status}`}>
                                  <td>{index + 1}</td>
                                  <td>{getProjectName(entry.project)}</td>
                                  <td>{entry.department || '-'}</td>
                                  <td>{entry.notes || entry.description || entry.title || '-'}</td>
                                  <td>{startTime || '-'}</td>
                                  <td>{endTime || '-'}</td>
                                  <td>{formatHours(hours)}</td>
                                  <td>{entry.billable !== false ? 'Yes' : 'No'}</td>
                                  <td>
                                    <span className={`badge badge-${status}`}>
                                      {statusLabel}
                                    </span>
                                  </td>
                                  <td className="rejection-reason-cell">
                                    {status === 'rejected' && (
                                      <span className="rejection-reason-full">
                                        {entry.rejectionReason || 'No reason provided'}
                                      </span>
                                    )}
                                    {status !== 'rejected' && '-'}
                                  </td>
                                  <td>
                                    <div className="action-buttons">
                                      {(status === 'submitted' || status === 'draft') && (
                                        <>
                                          {status === 'submitted' && (
                                            <button 
                                              onClick={() => handleApprove(entry._id)} 
                                              className="btn-approve" 
                                              title="Approve"
                                            >
                                              <FiCheckCircle /> Approve
                                            </button>
                                          )}
                                          <button 
                                            onClick={() => handleReject(entry._id)} 
                                            className="btn-reject" 
                                            title="Reject"
                                          >
                                            <FiXCircle /> Reject
                                          </button>
                                        </>
                                      )}
                                      {status === 'approved' && (
                                        <button 
                                          onClick={() => handleRevert(entry._id)} 
                                          className="btn-revert" 
                                          title="Revert to Submitted"
                                        >
                                          ↶ Revoke
                                        </button>
                                      )}
                                      {status === 'rejected' && (
                                        <span className="rejection-only-label">Rejected</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiClock />
                  <p>No timesheet entries found for this employee</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEmployeeEntries(false)} className="btn-cancel">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Timesheet Modal */}
      {showAddTimesheetModal && (
        <div className="modal-overlay" onClick={() => setShowAddTimesheetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Timesheet Entry</h2>
              <button onClick={() => setShowAddTimesheetModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Employee <span style={{color: '#ef4444'}}>*</span></label>
                <select
                  value={timesheetForm.employee}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, employee: e.target.value })}
                  className="form-select"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Project</label>
                <select
                  value={timesheetForm.project}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, project: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Project</option>
                  {(() => {
                    // Filter projects: only show projects where selected employee is a team member
                    const filteredProjects = timesheetForm.employee
                      ? projects.filter(project => {
                          const teamMembers = project.teamMembers || [];
                          return teamMembers.some(member => {
                            const memberId = member.user?._id || member.user;
                            return memberId === timesheetForm.employee;
                          });
                        })
                      : projects;
                    
                    return filteredProjects.map(project => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ));
                  })()}
                  <option value="non-project">Non-Projects</option>
                </select>
                {timesheetForm.employee && (
                  <small style={{display: 'block', marginTop: '6px', color: '#6c757d', fontSize: '12px'}}>
                    Only projects where this employee is a team member are shown
                  </small>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  value={timesheetForm.department}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, department: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Department</option>
                  {COMPANY_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deliverable / Notes</label>
                <input
                  type="text"
                  value={timesheetForm.deliverable}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, deliverable: e.target.value })}
                  className="form-input"
                  placeholder="Enter deliverable or notes"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date <span style={{color: '#ef4444'}}>*</span></label>
                  <input
                    type="date"
                    value={timesheetForm.date}
                    onChange={(e) => setTimesheetForm({ ...timesheetForm, date: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">From Time <span style={{color: '#ef4444'}}>*</span></label>
                  <input
                    type="time"
                    value={timesheetForm.fromTime}
                    onChange={(e) => setTimesheetForm({ ...timesheetForm, fromTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">To Time <span style={{color: '#ef4444'}}>*</span></label>
                  <input
                    type="time"
                    value={timesheetForm.toTime}
                    onChange={(e) => setTimesheetForm({ ...timesheetForm, toTime: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#495057'}}>
                  <input
                    type="checkbox"
                    checked={timesheetForm.billable}
                    onChange={(e) => setTimesheetForm({ ...timesheetForm, billable: e.target.checked })}
                    style={{width: '18px', height: '18px', cursor: 'pointer'}}
                  />
                  Billable Hours
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddTimesheetModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleAddTimesheet} style={{
                padding: '10px 24px',
                border: 'none',
                background: '#667eea',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }} onMouseOver={(e) => e.target.style.background = '#5568d3'} onMouseOut={(e) => e.target.style.background = '#667eea'}>
                Add Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetAdmin;
