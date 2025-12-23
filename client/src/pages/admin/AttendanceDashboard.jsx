import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiUser,
  FiSearch,
  FiCalendar,
  FiImage as FiImageIcon,
  FiX,
  FiClock,
  FiMapPin,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiFilter
} from 'react-icons/fi';
import * as XLSX from 'xlsx';
import './AttendanceDashboard.css';

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError('No authentication token found. Please login again.');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (selectedDate && token) {
      fetchAttendanceData();
    }
  }, [selectedDate, token]);

  const fetchUsers = async () => {
    try {
      // Add timestamp to prevent caching
      const url = `${API_ENDPOINTS.getAllUsers}?_t=${Date.now()}`;
      
      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.data) {
        setAllUsers(Array.isArray(response.data) ? response.data : []);
      } else {
        setAllUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Handle different error statuses
      if (err.response?.status === 304) {
        console.log('304 Not Modified for users - retrying');
        try {
          const retryUrl = `${API_ENDPOINTS.getAllUsers}?_t=${Date.now()}&_nocache=1`;
          const retryResponse = await axios.get(retryUrl, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAllUsers(Array.isArray(retryResponse.data) ? retryResponse.data : []);
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
          const errorMsg = retryErr.response?.data?.error || retryErr.message || 'Failed to load users';
          setError(`Failed to load users: ${errorMsg}`);
        }
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view users.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.msg || err.message || 'Failed to load users';
        console.error('Failed to load users:', errorMsg);
        // Don't set error for users fetch failure, just log it
      }
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      setLoading(true);
      
      // Add timestamp to prevent caching
      const url = `${API_ENDPOINTS.getAttendanceByDate(selectedDate)}?_t=${Date.now()}`;
      
      const response = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Always set data if response is successful
      if (response.data) {
        setAttendanceData(Array.isArray(response.data) ? response.data : []);
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      // Handle different error statuses
      if (err.response?.status === 304) {
        console.log('304 Not Modified - fetching fresh data');
        try {
          const retryUrl = `${API_ENDPOINTS.getAttendanceByDate(selectedDate)}?_t=${Date.now()}&_nocache=1`;
          const retryResponse = await axios.get(retryUrl, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAttendanceData(Array.isArray(retryResponse.data) ? retryResponse.data : []);
          setError(null);
        } catch (retryErr) {
          const errorMsg = retryErr.response?.data?.error || retryErr.message || 'Failed to load attendance data';
          setError(`Error: ${errorMsg} (Status: ${retryErr.response?.status || 'Unknown'})`);
          setAttendanceData([]);
        }
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check if you have admin permissions.');
        setAttendanceData([]);
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        setAttendanceData([]);
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.msg || err.message || 'Failed to load attendance data';
        setError(`Error: ${errorMsg}${err.response?.status ? ` (Status: ${err.response.status})` : ''}`);
        setAttendanceData([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get unique departments, roles, and companies from users
  const departments = [...new Set(allUsers.map(u => u.department).filter(Boolean))].sort();
  const roles = [...new Set(allUsers.map(u => u.role).filter(Boolean))].sort();
  const companies = [...new Set(allUsers.map(u => u.company).filter(Boolean))].sort();

  // Group attendance by user for the selected date
  const getPresentUsers = () => {
    const presentUserIds = new Set();
    attendanceData.forEach(record => {
      if (record.type === 'check-in') {
        presentUserIds.add(record.user?._id);
      }
    });

    return allUsers
      .filter(user => presentUserIds.has(user._id))
      .map(user => {
        const checkIn = attendanceData.find(
          r => r.user?._id === user._id && r.type === 'check-in'
        );
        const checkOut = attendanceData.find(
          r => r.user?._id === user._id && r.type === 'check-out'
        );
        return {
          ...user,
          checkIn,
          checkOut,
          hours: checkIn && checkOut
            ? (new Date(checkOut.timestamp) - new Date(checkIn.timestamp)) / (1000 * 60 * 60)
            : null
        };
      });
  };

  const getAbsentUsers = () => {
    const presentUserIds = new Set();
    attendanceData.forEach(record => {
      if (record.type === 'check-in') {
        presentUserIds.add(record.user?._id);
      }
    });

    return allUsers.filter(user => !presentUserIds.has(user._id));
  };

  // Apply filters
  const applyFilters = (users) => {
    return users.filter(user => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.employeeId?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Department filter
      if (departmentFilter !== 'all' && user.department !== departmentFilter) {
        return false;
      }

      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) {
        return false;
      }

      // Company filter
      if (companyFilter !== 'all' && user.company !== companyFilter) {
        return false;
      }

      return true;
    });
  };

  const presentUsers = applyFilters(getPresentUsers());
  const absentUsers = applyFilters(getAbsentUsers());

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatHours = (hours) => {
    if (hours === null || hours === undefined) return '—';
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleDownloadExcel = () => {
    const excelData = [
      ...presentUsers.map(user => ({
        'Status': 'Present',
        'Employee': user.name || 'Unknown',
        'Email': user.email || 'N/A',
        'Employee ID': user.employeeId || 'N/A',
        'Department': user.department || 'N/A',
        'Role': user.role || 'N/A',
        'Company': user.company || 'N/A',
        'Check-In': formatTime(user.checkIn?.timestamp),
        'Check-Out': formatTime(user.checkOut?.timestamp),
        'Hours': formatHours(user.hours),
        'Office (In)': user.checkIn?.officeName || 'N/A',
        'Office (Out)': user.checkOut?.officeName || 'N/A',
      })),
      ...absentUsers.map(user => ({
        'Status': 'Absent',
        'Employee': user.name || 'Unknown',
        'Email': user.email || 'N/A',
        'Employee ID': user.employeeId || 'N/A',
        'Department': user.department || 'N/A',
        'Role': user.role || 'N/A',
        'Company': user.company || 'N/A',
        'Check-In': '—',
        'Check-Out': '—',
        'Hours': '—',
        'Office (In)': '—',
        'Office (Out)': '—',
      }))
    ];

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendance_report_${selectedDate}.xlsx`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setRoleFilter('all');
    setCompanyFilter('all');
  };

  const hasActiveFilters = searchQuery || departmentFilter !== 'all' || roleFilter !== 'all' || companyFilter !== 'all';

  if (loading) {
    return (
      <div className="attendance-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="attendance-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Attendance Dashboard</h1>
          <p className="dashboard-subtitle">
            View present and absent employees for selected date
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={fetchAttendanceData}
            disabled={refreshing}
            className="btn-refresh"
            title="Refresh Data"
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleDownloadExcel}
            className="btn-download"
            title="Download Excel"
          >
            <FiDownload />
            Export Excel
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <strong>Error:</strong> {error}
            <div className="error-help">
              {error.includes('403') || error.includes('Access denied') ? (
                <span>Please ensure you have admin permissions.</span>
              ) : error.includes('401') || error.includes('Authentication') ? (
                <span>Please try logging out and logging back in.</span>
              ) : (
                <span>Check browser console for more details.</span>
              )}
            </div>
          </div>
          <button onClick={() => setError(null)} className="error-close">
            <FiX />
          </button>
        </div>
      )}

      {/* Date Picker */}
      <div className="date-picker-section">
        <div className="date-picker-wrapper">
          <FiCalendar className="date-picker-icon" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker-input"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <div className="filter-input-wrapper">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-select-wrapper">
            <FiFilter className="filter-icon" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-select-wrapper">
            <FiFilter className="filter-icon" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-select-wrapper">
            <FiFilter className="filter-icon" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-icon stat-primary">
            <FiUser />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Employees</p>
            <h3 className="stat-value">{allUsers.length}</h3>
          </div>
        </div>
        <div className="stat-card stat-success-card">
          <div className="stat-icon stat-success">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Present</p>
            <h3 className="stat-value">{presentUsers.length}</h3>
          </div>
        </div>
        <div className="stat-card stat-danger-card">
          <div className="stat-icon stat-danger">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Absent</p>
            <h3 className="stat-value">{absentUsers.length}</h3>
          </div>
        </div>
      </div>

      {/* Present List */}
      <div className="attendance-section">
        <div className="section-header present-header">
          <div className="section-title">
            <FiCheckCircle className="section-icon present-icon" />
            <h2>Present Employees ({presentUsers.length})</h2>
          </div>
        </div>
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Company</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Hours</th>
                <th>Office</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {presentUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    <div className="no-data-content">
                      <FiCheckCircle size={48} />
                      <p>No present employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                presentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-avatar">
                          <FiUser />
                        </div>
                        <div>
                          <div className="employee-name">{user.name || 'Unknown'}</div>
                          <div className="employee-email">{user.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.employeeId || '—'}</td>
                    <td>{user.department || '—'}</td>
                    <td>{user.role || '—'}</td>
                    <td>{user.company || '—'}</td>
                    <td className="time-cell">
                      {user.checkIn ? (
                        <div className="time-info">
                          <span className="time-value">{formatTime(user.checkIn.timestamp)}</span>
                          {user.checkIn.isInOffice ? (
                            <span className="badge badge-success">In Office</span>
                          ) : (
                            <span className="badge badge-warning">Remote</span>
                          )}
                        </div>
                      ) : (
                        <span className="no-data-text">—</span>
                      )}
                    </td>
                    <td className="time-cell">
                      {user.checkOut ? (
                        <div className="time-info">
                          <span className="time-value">{formatTime(user.checkOut.timestamp)}</span>
                          {user.checkOut.isInOffice ? (
                            <span className="badge badge-success">In Office</span>
                          ) : (
                            <span className="badge badge-warning">Remote</span>
                          )}
                        </div>
                      ) : (
                        <span className="no-data-text">—</span>
                      )}
                    </td>
                    <td className="hours-cell">
                      {user.hours !== null ? (
                        <span className="hours-value">{formatHours(user.hours)}</span>
                      ) : (
                        <span className="no-data-text">—</span>
                      )}
                    </td>
                    <td className="office-cell">
                      {user.checkIn?.officeName ? (
                        <div className="office-info">
                          <FiMapPin className="office-icon" />
                          <span>{user.checkIn.officeName}</span>
                        </div>
                      ) : (
                        <span className="no-data-text">—</span>
                      )}
                    </td>
                    <td className="image-cell">
                      {user.checkIn?.image ? (
                        <div
                          className="image-thumbnail"
                          onClick={() => setSelectedImage({
                            src: `${API_ENDPOINTS.uploadPath}/${user.checkIn.image}`,
                            type: 'Check-In',
                            employee: user.name || 'Unknown',
                            time: formatTime(user.checkIn.timestamp)
                          })}
                        >
                          <img
                            src={`${API_ENDPOINTS.uploadPath}/${user.checkIn.image}`}
                            alt="Check-in"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (!e.target.nextElementSibling || !e.target.nextElementSibling.classList.contains('image-placeholder')) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'image-placeholder';
                                placeholder.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                                e.target.parentElement.appendChild(placeholder);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          <FiImageIcon />
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Absent List */}
      <div className="attendance-section">
        <div className="section-header absent-header">
          <div className="section-title">
            <FiXCircle className="section-icon absent-icon" />
            <h2>Absent Employees ({absentUsers.length})</h2>
          </div>
        </div>
        <div className="table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {absentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="no-data-content">
                      <FiXCircle size={48} />
                      <p>No absent employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                absentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-avatar">
                          <FiUser />
                        </div>
                        <div>
                          <div className="employee-name">{user.name || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.employeeId || '—'}</td>
                    <td>{user.department || '—'}</td>
                    <td>{user.role || '—'}</td>
                    <td>{user.company || '—'}</td>
                    <td>{user.email || '—'}</td>
                    <td>{user.phone || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <div>
                <h3>{selectedImage.type} Image</h3>
                <p>{selectedImage.employee} - {selectedImage.time}</p>
              </div>
              <button
                className="image-modal-close"
                onClick={() => setSelectedImage(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="image-modal-body">
              <img src={selectedImage.src} alt={selectedImage.type} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
