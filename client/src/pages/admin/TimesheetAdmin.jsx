import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiRefreshCw, FiUsers, FiDownload, FiEye, FiCheckCircle,
  FiXCircle, FiClock, FiBriefcase, FiSearch, FiCalendar, FiPlus, FiX
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import './TimesheetAdmin.css';

const TimesheetAdmin = () => {
  const token = localStorage.getItem('token');
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'project'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeEntries, setShowEmployeeEntries] = useState(false);
  const [selectedEntryDetail, setSelectedEntryDetail] = useState(null);
  const [showEntryDetailModal, setShowEntryDetailModal] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted'); // Default to submitted entries only
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  // Set default dates to current date
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  
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
    fetchProjects();
    fetchTimesheets();
  }, [statusFilter, employeeFilter, startDate, endDate, searchQuery]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle different API response formats
      let employeesList = [];
      if (Array.isArray(res.data?.data)) {
        employeesList = res.data.data;
      } else if (Array.isArray(res.data?.users)) {
        employeesList = res.data.users;
      } else if (Array.isArray(res.data)) {
        employeesList = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        employeesList = res.data.data;
      }
      
      console.log('Fetched employees:', employeesList.length);
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
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
        limit: 1000
      };

      // Status filter - send to API when not 'all'
      if (statusFilter !== 'all') {
        params.timesheetStatus = statusFilter;
      }

      // Employee filter
      if (employeeFilter !== 'all') {
        params.userId = employeeFilter;
      }

      const res = await axios.get(`${API_ENDPOINTS.baseURL}/api/tasks`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle different API response formats
      let allTasks = [];
      if (Array.isArray(res.data?.tasks)) {
        allTasks = res.data.tasks;
      } else if (Array.isArray(res.data?.data)) {
        allTasks = res.data.data;
      } else if (Array.isArray(res.data)) {
        allTasks = res.data;
      }

      // Filter timesheet entries (tasks with startTime/endTime)
      let timesheetEntries = allTasks.filter(entry =>
        entry.startTime && entry.endTime
      );

      // Client-side date range filter (in case API returns broader range)
      const startDt = startDate ? new Date(startDate) : null;
      const endDt = endDate ? new Date(endDate) : null;
      if (startDt || endDt) {
        timesheetEntries = timesheetEntries.filter(entry => {
          const entryDate = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10);
          if (!entryDate) return false;
          const d = new Date(entryDate);
          if (startDt && d < new Date(startDt.toISOString().split('T')[0])) return false;
          if (endDt && d > new Date(endDt.toISOString().split('T')[0])) return false;
          return true;
        });
      }

      // Apply status filter (client-side when 'all' is selected, API already filters when status is set)
      let filtered = timesheetEntries;
      if (statusFilter !== 'all') {
        filtered = timesheetEntries.filter(entry => {
          const status = entry.timesheetStatus || 'draft';
          return status === statusFilter;
        });
      }

      // Apply search filter on top of status filter (by employee/user name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(entry => {
          const userName = entry.user?.name ||
            `${entry.user?.firstName || ''} ${entry.user?.lastName || ''}`.trim() ||
            '';
          const email = (entry.user?.email || '').toLowerCase();
          return userName.toLowerCase().includes(query) || email.includes(query);
        });
      }

      setTimesheets(filtered);

      // Calculate summary
      let totalMinutes = 0;
      let bookedMinutes = 0;
      let billableMinutes = 0;
      let nonBillableMinutes = 0;
      let pendingMinutes = 0;

      filtered.forEach(entry => {
        const hours = calculateHours(entry.startTime, entry.endTime);
        const minutes = hours;
        totalMinutes += minutes;

        if (entry.timesheetStatus === 'submitted' || entry.timesheetStatus === 'approved') {
          bookedMinutes += minutes;
        }

        if (entry.timesheetStatus === 'draft' || entry.timesheetStatus === 'submitted') {
          pendingMinutes += minutes;
        }

        if (entry.billable !== false) {
          billableMinutes += minutes;
        } else {
          nonBillableMinutes += minutes;
        }
      });

      setSummary({
        totalHours: formatHours(totalMinutes),
        bookedHours: formatHours(bookedMinutes),
        billableHours: formatHours(billableMinutes),
        nonBillable: formatHours(nonBillableMinutes),
        pendingApproval: formatHours(pendingMinutes)
      });
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      Swal.fire('Error', 'Failed to fetch timesheet data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    return diffMs / (1000 * 60); // Return minutes
  };

  const formatHours = (minutes) => {
    if (!minutes || minutes === 0) return '00:00';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // Group entries by employee
  const employeeGroups = useMemo(() => {
    const groups = {};
    
    timesheets.forEach(entry => {
      // Handle different user field formats
      let userId = null;
      if (entry.user) {
        if (typeof entry.user === 'string') {
          userId = entry.user;
        } else if (entry.user._id) {
          userId = entry.user._id;
        } else if (entry.user.id) {
          userId = entry.user.id;
        }
      }
      
      // If no userId found, try to use the entry's user field as-is
      if (!userId && entry.user) {
        userId = entry.user;
      }
      
      // If still no userId, skip this entry (it won't be grouped properly)
      if (!userId) {
        console.warn('Entry without user field:', entry);
        return;
      }

      // Try to find employee in employees list
      let employee = employees.find(emp => {
        const empId = emp._id?.toString();
        const userIdStr = userId?.toString();
        return empId === userIdStr || 
               emp._id === userId || 
               emp._id === entry.user?._id ||
               (entry.user && typeof entry.user === 'object' && emp._id?.toString() === entry.user._id?.toString());
      });

      // If not found, use entry.user data or create a placeholder
      if (!employee) {
        if (entry.user && typeof entry.user === 'object') {
          employee = entry.user;
        } else {
          // Try to find by matching the userId string
          employee = employees.find(emp => emp._id?.toString() === userId?.toString());
        }
      }

      const key = userId?.toString() || 'unknown';
      
      if (!groups[key]) {
        groups[key] = {
          employee: employee || { 
            name: 'Unknown Employee',
            firstName: entry.user?.firstName || '',
            lastName: entry.user?.lastName || ''
          },
          entries: [],
          dates: new Set(),
          totalEntries: 0,
          submitted: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          totalHours: 0
        };
      }

      const entryDate = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10);
      if (entryDate) {
        groups[key].dates.add(entryDate);
      }

      groups[key].entries.push(entry);
      groups[key].totalEntries++;
      groups[key].totalHours += calculateHours(entry.startTime, entry.endTime);

      if (entry.timesheetStatus === 'submitted' || entry.timesheetStatus === 'approved') {
        groups[key].submitted++;
      }

      if (entry.timesheetStatus === 'draft' || entry.timesheetStatus === 'submitted') {
        groups[key].pending++;
      }

      if (entry.timesheetStatus === 'approved') {
        groups[key].approved++;
      }

      if (entry.timesheetStatus === 'rejected') {
        groups[key].rejected++;
      }
    });

    return Object.values(groups).map(group => ({
      ...group,
      dates: Array.from(group.dates).sort()
    }));
  }, [timesheets, employees]);

  // Get all entries for modal (single view, no filtering)
  const filteredEntries = useMemo(() => {
    if (!selectedEmployee?.entries || !Array.isArray(selectedEmployee.entries) || selectedEmployee.entries.length === 0) {
      return [];
    }
    
    // Create a copy before sorting to avoid mutation
    const entriesCopy = [...selectedEmployee.entries];
    
    // Sort by date (newest first) then by start time
    return entriesCopy.sort((a, b) => {
      const dateA = a.startTime?.split?.('T')[0] || '';
      const dateB = b.startTime?.split?.('T')[0] || '';
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      const timeA = a.startTime?.split?.('T')[1] || '';
      const timeB = b.startTime?.split?.('T')[1] || '';
      return timeB.localeCompare(timeA);
    });
  }, [selectedEmployee?.entries]);

  const handleViewEmployee = (employeeData) => {
    setSelectedEmployee(employeeData);
    setShowEmployeeEntries(true);
  };

  const handleApprove = async (entryId) => {
    try {
      await axios.put(
        `${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`,
        {
          timesheetStatus: 'approved'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Timesheet entry approved', 'success');
      fetchTimesheets();

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
    const { value: reason } = await Swal.fire({
      title: 'Reject Timesheet Entry',
      html: `
        <label style="display: block; text-align: left; margin-bottom: 8px; font-weight: 600; color: #212529;">
          Rejection Reason <span style="color: #ef4444;">*</span>
        </label>
        <textarea 
          id="rejection-reason" 
          class="swal2-textarea" 
          placeholder="Please provide a reason for rejection (minimum 5 characters)..."
          style="width: 100%; min-height: 100px; padding: 12px; border: 1.5px solid #dee2e6; border-radius: 8px; font-size: 14px; resize: vertical;"
        ></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6c757d',
      preConfirm: () => {
        const reasonInput = document.getElementById('rejection-reason');
        const reasonValue = reasonInput?.value?.trim() || '';
        if (!reasonValue || reasonValue.length < 5) {
          Swal.showValidationMessage('Please provide a rejection reason (minimum 5 characters)');
          return false;
        }
        return reasonValue;
      }
    });

    if (!reason) return;

    try {
      await axios.put(
        `${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`,
        {
          timesheetStatus: 'rejected',
          rejectionReason: reason.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Timesheet entry rejected', 'success');
      fetchTimesheets();

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
      Swal.fire('Error', error.response?.data?.message || 'Failed to reject entry', 'error');
    }
  };

  const handleRevert = async (entryId) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Revoke Approval',
      text: 'Are you sure you want to revoke the approval for this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Revoke',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6c757d'
    });

    if (!isConfirmed) return;

    try {
      await axios.put(
        `${API_ENDPOINTS.baseURL}/api/tasks/${entryId}`,
        {
          timesheetStatus: 'submitted'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire('Success', 'Approval revoked', 'success');
      fetchTimesheets();

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

  const handleDownloadReport = () => {
    try {
      if (!timesheets || timesheets.length === 0) {
        Swal.fire('Info', 'No data available to export', 'info');
        return;
      }

      // Prepare data for export
      const exportData = [];
      
      // Add header row
      exportData.push([
        'S.No',
        'Date',
        'Employee Name',
        'Project',
        'Department',
        'Deliverable',
        'From Time',
        'To Time',
        'Total Hours',
        'Billable',
        'Status',
        'Rejection Reason'
      ]);

      // Add data rows from filtered timesheets
      let serialNo = 1;
      timesheets.forEach(entry => {
        const entryDate = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10) || '-';
        const startTime = entry.startTime?.includes('T') 
          ? entry.startTime.split('T')[1]?.substring(0, 5) 
          : entry.startTime || '-';
        const endTime = entry.endTime?.includes('T') 
          ? entry.endTime.split('T')[1]?.substring(0, 5) 
          : entry.endTime || '-';
        const hours = calculateHours(entry.startTime, entry.endTime);
        const employeeName = entry.user?.firstName && entry.user?.lastName
          ? `${entry.user.firstName} ${entry.user.lastName}`
          : entry.user?.name || 'Unknown';
        const status = entry.timesheetStatus || 'draft';
        const statusLabel = status === 'submitted' ? 'Submitted' : 
                           status === 'approved' ? 'Approved' : 
                           status === 'rejected' ? 'Rejected' : 'Draft';

        exportData.push([
          serialNo++,
          entryDate,
          employeeName,
          getProjectName(entry.project),
          entry.department || '-',
          entry.notes || entry.description || entry.title || '-',
          startTime,
          endTime,
          formatHours(hours),
          entry.billable !== false ? 'Yes' : 'No',
          statusLabel,
          entry.rejectionReason || '-'
        ]);
      });

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      
      // Set column widths
      const colWidths = [
        { wch: 6 },   // S.No
        { wch: 12 },  // Date
        { wch: 20 },  // Employee Name
        { wch: 25 },  // Project
        { wch: 18 },  // Department
        { wch: 30 },  // Deliverable
        { wch: 10 },  // From Time
        { wch: 10 },  // To Time
        { wch: 12 },  // Total Hours
        { wch: 10 },  // Billable
        { wch: 12 },  // Status
        { wch: 30 }   // Rejection Reason
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Timesheet Report');

      // Generate filename with date range
      const filename = `timesheet_report_${startDate}_to_${endDate}.xlsx`;
      
      // Download file
      XLSX.writeFile(wb, filename);
      
      Swal.fire('Success', 'Report downloaded successfully', 'success');
    } catch (error) {
      console.error('Error downloading report:', error);
      Swal.fire('Error', 'Failed to download report', 'error');
    }
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
          <button onClick={handleDownloadReport} className="btn-export">
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
                {employees && employees.length > 0 ? (
                  employees.map(emp => {
                    // Handle both name formats: name field or firstName/lastName
                    let displayName = '';
                    if (emp.firstName || emp.lastName) {
                      displayName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
                    } else if (emp.name) {
                      displayName = emp.name;
                    } else {
                      displayName = emp.email || 'Unknown Employee';
                    }
                    const employeeId = emp._id || emp.id;
                    return (
                      <option key={employeeId} value={employeeId} style={{ color: '#212529', backgroundColor: '#fff' }}>
                        {displayName}
                      </option>
                    );
                  })
                ) : (
                  <option value="" disabled style={{ color: '#212529' }}>No employees found</option>
                )}
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
            <div className="filter-group filter-group-button">
              <button 
                onClick={handleDownloadReport} 
                className="btn-download-report"
                title="Download Report"
              >
                <FiDownload /> Download Report
              </button>
            </div>
          </div>
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
                {employeeGroups.length > 0 ? (
                  employeeGroups.map((group, index) => {
                    const employeeId = group.employee?._id || group.employee?.id || `employee-${index}`;
                    return (
                      <tr key={employeeId}>
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
                    );
                  })
                ) : (
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
              </div>
              <button onClick={() => setShowEmployeeEntries(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {filteredEntries.length > 0 ? (
                <div className="entries-single-view">
                  <div className="entries-table-wrapper">
                    <table className="entries-table">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>Date</th>
                          <th>Project</th>
                          <th>Department</th>
                          <th>Deliverable</th>
                          <th>From Time</th>
                          <th>To Time</th>
                          <th>Total Hours</th>
                          <th>Billable</th>
                          <th>Status</th>
                          <th>Late</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((entry, index) => {
                          const entryDate = entry.startTime?.split?.('T')[0] || entry.startTime?.substring?.(0, 10) || '-';
                          const startTime = entry.startTime?.includes('T') 
                            ? entry.startTime.split('T')[1]?.substring(0, 5) 
                            : entry.startTime || '-';
                          const endTime = entry.endTime?.includes('T') 
                            ? entry.endTime.split('T')[1]?.substring(0, 5) 
                            : entry.endTime || '-';
                          const hours = calculateHours(entry.startTime, entry.endTime);
                          const status = entry.timesheetStatus || 'draft';
                          const statusLabel = status === 'submitted' ? 'Submitted' : status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Draft';
                          const deliverable = entry.notes || entry.description || entry.title || '-';
                          
                          return (
                            <tr key={entry._id || `entry-${index}-${entryDate}`} className={`row-status-${status}`}>
                              <td>{index + 1}</td>
                              <td>{entryDate}</td>
                              <td>{getProjectName(entry.project)}</td>
                              <td>{entry.department || '-'}</td>
                              <td className="deliverable-cell" title={deliverable}>
                                {deliverable.length > 50 ? `${deliverable.substring(0, 50)}...` : deliverable}
                              </td>
                              <td>{startTime}</td>
                              <td>{endTime}</td>
                              <td>{formatHours(hours)}</td>
                              <td>
                                <span className={`badge ${entry.billable !== false ? 'badge-billable' : 'badge-nonbillable'}`}>
                                  {entry.billable !== false ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge badge-${status}`}>
                                  {statusLabel}
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
                                <div className="action-buttons-icon-only">
                                  <button 
                                    onClick={() => {
                                      setSelectedEntryDetail(entry);
                                      setShowEntryDetailModal(true);
                                    }}
                                    className="btn-view-icon" 
                                    title="View Details"
                                  >
                                    <FiEye />
                                  </button>
                                  {(status === 'submitted' || status === 'draft') && (
                                    <>
                                      {status === 'submitted' && (
                                        <button 
                                          onClick={() => handleApprove(entry._id)} 
                                          className="btn-approve-icon" 
                                          title="Approve"
                                        >
                                          <FiCheckCircle />
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleReject(entry._id)} 
                                        className="btn-reject-icon" 
                                        title="Reject"
                                      >
                                        <FiXCircle />
                                      </button>
                                    </>
                                  )}
                                  {status === 'approved' && (
                                    <button 
                                      onClick={() => handleRevert(entry._id)} 
                                      className="btn-revert-icon" 
                                      title="Revoke Approval"
                                    >
                                      ↶
                                    </button>
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

      {/* Entry Detail View Modal */}
      {showEntryDetailModal && selectedEntryDetail && (
        <div className="modal-overlay" onClick={() => setShowEntryDetailModal(false)}>
          <div className="modal-content entry-detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Timesheet Entry Details</h2>
              <button onClick={() => setShowEntryDetailModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="entry-detail-form">
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">Employee Name</label>
                    <div className="detail-value">
                      {selectedEntryDetail.user?.firstName && selectedEntryDetail.user?.lastName
                        ? `${selectedEntryDetail.user.firstName} ${selectedEntryDetail.user.lastName}`
                        : selectedEntryDetail.user?.name || '-'}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">Date</label>
                    <div className="detail-value">
                      {selectedEntryDetail.startTime?.split?.('T')[0] || selectedEntryDetail.startTime?.substring?.(0, 10) || '-'}
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">Project</label>
                    <div className="detail-value">
                      {getProjectName(selectedEntryDetail.project)}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">Client</label>
                    <div className="detail-value">
                      {(() => {
                        const project = projects.find(p => p._id === selectedEntryDetail.project);
                        return project?.client || '-';
                      })()}
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">Department</label>
                    <div className="detail-value">
                      {selectedEntryDetail.department || '-'}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">Status</label>
                    <div className="detail-value">
                      <span className={`badge badge-${selectedEntryDetail.timesheetStatus || 'draft'}`}>
                        {(selectedEntryDetail.timesheetStatus || 'draft') === 'submitted' ? 'Submitted' : 
                         (selectedEntryDetail.timesheetStatus || 'draft') === 'approved' ? 'Approved' : 
                         (selectedEntryDetail.timesheetStatus || 'draft') === 'rejected' ? 'Rejected' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group full-width">
                    <label className="detail-label">Deliverable / Notes</label>
                    <div className="detail-value">
                      {selectedEntryDetail.notes || selectedEntryDetail.description || selectedEntryDetail.title || '-'}
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">From Time</label>
                    <div className="detail-value">
                      {selectedEntryDetail.startTime?.includes('T') 
                        ? selectedEntryDetail.startTime.split('T')[1]?.substring(0, 5) 
                        : selectedEntryDetail.startTime || '-'}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">To Time</label>
                    <div className="detail-value">
                      {selectedEntryDetail.endTime?.includes('T') 
                        ? selectedEntryDetail.endTime.split('T')[1]?.substring(0, 5) 
                        : selectedEntryDetail.endTime || '-'}
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">Total Hours</label>
                    <div className="detail-value">
                      {formatHours(calculateHours(selectedEntryDetail.startTime, selectedEntryDetail.endTime))}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">Billable</label>
                    <div className="detail-value">
                      <span className={`badge ${selectedEntryDetail.billable !== false ? 'badge-billable' : 'badge-nonbillable'}`}>
                        {selectedEntryDetail.billable !== false ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label className="detail-label">Late Entry</label>
                    <div className="detail-value">
                      {selectedEntryDetail.isLate ? (
                        <span className="badge badge-late">Late</span>
                      ) : (
                        <span className="badge badge-ontime">On Time</span>
                      )}
                    </div>
                  </div>
                  <div className="detail-group">
                    <label className="detail-label">Entry ID</label>
                    <div className="detail-value" style={{ fontSize: '12px', color: '#666' }}>
                      {selectedEntryDetail._id || '-'}
                    </div>
                  </div>
                </div>
                {selectedEntryDetail.timesheetStatus === 'rejected' && selectedEntryDetail.rejectionReason && (
                  <div className="detail-row">
                    <div className="detail-group full-width">
                      <label className="detail-label">Rejection Reason</label>
                      <div className="detail-value rejection-reason-detail">
                        {selectedEntryDetail.rejectionReason}
                      </div>
                    </div>
                  </div>
                )}
                <div className="detail-actions">
                  {selectedEntryDetail.timesheetStatus === 'submitted' && (
                    <button 
                      onClick={() => {
                        handleApprove(selectedEntryDetail._id);
                        setShowEntryDetailModal(false);
                      }}
                      className="btn-approve"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                  )}
                  {selectedEntryDetail.timesheetStatus === 'approved' && (
                    <button 
                      onClick={() => {
                        handleRevert(selectedEntryDetail._id);
                        setShowEntryDetailModal(false);
                      }}
                      className="btn-revert"
                    >
                      ↶ Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowEntryDetailModal(false)} className="btn-cancel">
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
              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Employee <span style={{color: '#ef4444'}}>*</span></label>
                    <select
                      value={timesheetForm.employee}
                      onChange={(e) => setTimesheetForm({...timesheetForm, employee: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => {
                        const displayName = emp.name || 
                          (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}`.trim() : '') ||
                          emp.email || 
                          'Unknown Employee';
                        return (
                          <option key={emp._id} value={emp._id} style={{ color: '#212529', backgroundColor: '#fff' }}>
                            {displayName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select
                      value={timesheetForm.project}
                      onChange={(e) => {
                        const selectedProjectId = e.target.value;
                        setTimesheetForm({...timesheetForm, project: selectedProjectId});
                        // Filter projects: only show projects where selected employee is a team member
                      }}
                      className="form-select"
                    >
                      <option value="">Select Project</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      value={timesheetForm.department}
                      onChange={(e) => setTimesheetForm({...timesheetForm, department: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Select Department</option>
                      {COMPANY_DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date <span style={{color: '#ef4444'}}>*</span></label>
                    <input
                      type="date"
                      value={timesheetForm.date}
                      onChange={(e) => setTimesheetForm({...timesheetForm, date: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">From Time <span style={{color: '#ef4444'}}>*</span></label>
                    <input
                      type="time"
                      value={timesheetForm.fromTime}
                      onChange={(e) => setTimesheetForm({...timesheetForm, fromTime: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Time <span style={{color: '#ef4444'}}>*</span></label>
                    <input
                      type="time"
                      value={timesheetForm.toTime}
                      onChange={(e) => setTimesheetForm({...timesheetForm, toTime: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Deliverable</label>
                    <input
                      type="text"
                      value={timesheetForm.deliverable}
                      onChange={(e) => setTimesheetForm({...timesheetForm, deliverable: e.target.value})}
                      placeholder="Enter deliverable description..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Billable</label>
                    <select
                      value={timesheetForm.billable ? 'yes' : 'no'}
                      onChange={(e) => setTimesheetForm({...timesheetForm, billable: e.target.value === 'yes'})}
                      className="form-select"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddTimesheetModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleAddTimesheet} className="btn-primary">
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetAdmin;
