import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import RecentAttendanceTable from '../../components/admin-dashboard/dashboard/RecentAttendanceTable';
import DashboardCards from '../../components/admin-dashboard/dashboard/DashboardCards';
import Loader from '../../components/admin-dashboard/common/Loader';
import { 
  FiSearch, FiCalendar, FiUsers, FiClock, FiTrendingUp, 
  FiActivity, FiBarChart2, FiDownload, FiRefreshCw, FiFilter,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiArrowRight
} from 'react-icons/fi';
import AbsentUsersList from '../../components/admin-dashboard/dashboard/AbsentUsersList';
import ReportGenerator from '../../components/admin-dashboard/dashboard/ReportGenerator';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch summary and logs on load
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const headers = { Authorization: `Bearer ${token}` };

      // Use Promise.allSettled to handle partial failures
      const [summaryRes, logsRes, usersRes] = await Promise.allSettled([
        axios.get(API_ENDPOINTS.getAdminSummary, { headers }),
        axios.get(API_ENDPOINTS.getRecentAttendanceLogs, { headers }),
        axios.get(API_ENDPOINTS.getAllUsers, { headers }),
      ]);

      // Handle summary response
      if (summaryRes.status === 'fulfilled') {
        const summaryData = summaryRes.value.data || {};
        console.log('Summary data loaded:', summaryData);
        setSummary(summaryData);
      } else {
        const errorMsg = summaryRes.reason?.response?.data?.error || summaryRes.reason?.message || 'Unknown error';
        console.error('Error fetching summary:', errorMsg, summaryRes.reason);
        setSummary({ totalEmployees: 0, presentToday: 0, absentToday: 0 });
      }

      // Handle logs response
      if (logsRes.status === 'fulfilled') {
        const logsData = Array.isArray(logsRes.value.data) ? logsRes.value.data : [];
        console.log('Logs data loaded:', logsData.length, 'records');
        setLogs(logsData);
        setFilteredLogs(logsData);
      } else {
        const errorMsg = logsRes.reason?.response?.data?.error || logsRes.reason?.message || 'Unknown error';
        console.error('Error fetching logs:', errorMsg, logsRes.reason);
        setLogs([]);
        setFilteredLogs([]);
      }

      // Handle users response
      if (usersRes.status === 'fulfilled') {
        const usersData = Array.isArray(usersRes.value.data) ? usersRes.value.data : [];
        console.log('Users data loaded:', usersData.length, 'users');
        setAllUsers(usersData);
      } else {
        const errorMsg = usersRes.reason?.response?.data?.error || usersRes.reason?.message || 'Unknown error';
        console.error('Error fetching users:', errorMsg, usersRes.reason);
        setAllUsers([]);
      }

      // Set error if all requests failed
      if (summaryRes.status === 'rejected' && logsRes.status === 'rejected' && usersRes.status === 'rejected') {
        const errorMessages = [
          summaryRes.reason?.response?.data?.error || summaryRes.reason?.message,
          logsRes.reason?.response?.data?.error || logsRes.reason?.message,
          usersRes.reason?.response?.data?.error || usersRes.reason?.message
        ].filter(Boolean).join('; ');
        setError(`Failed to load dashboard data: ${errorMessages || 'Please check your connection and try again.'}`);
      } else if (summaryRes.status === 'rejected' || logsRes.status === 'rejected' || usersRes.status === 'rejected') {
        // Show warning if some requests failed but not all
        const failedEndpoints = [];
        if (summaryRes.status === 'rejected') failedEndpoints.push('Summary');
        if (logsRes.status === 'rejected') failedEndpoints.push('Attendance Logs');
        if (usersRes.status === 'rejected') failedEndpoints.push('Users');
        console.warn(`Some data failed to load: ${failedEndpoints.join(', ')}`);
      }
    } catch (err) {
      console.error('Dashboard loading error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let result = [...logs];

    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(log =>
        log.employeeName?.toLowerCase().includes(keyword)
      );
    }

    if (dateFilter) {
      const targetDate = new Date(dateFilter).toDateString();
      result = result.filter(log =>
        new Date(log.timestamp).toDateString() === targetDate
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(log => log.type === typeFilter);
    }

    if (locationFilter !== 'all') {
      const isInOffice = locationFilter === 'office';
      result = result.filter(log => log.isInOffice === isInOffice);
    }

    if (companyFilter !== 'all') {
      result = result.filter(log => log.company === companyFilter);
    }

    setFilteredLogs(result);
  }, [logs, search, dateFilter, typeFilter, locationFilter, companyFilter]);

  const logsForSelectedDate = logs.filter(log =>
    new Date(log.timestamp).toDateString() === new Date(dateFilter).toDateString()
  );

  // Calculate statistics
  const stats = {
    totalEmployees: allUsers.length || 0,
    presentToday: summary?.presentToday || 0,
    absentToday: summary?.absentToday || 0,
    onTime: filteredLogs.filter(log => {
      if (log.type === 'check-in') {
        const checkInTime = new Date(log.timestamp);
        const hours = checkInTime.getHours();
        return hours < 10; // Before 10 AM
      }
      return false;
    }).length,
    lateArrivals: filteredLogs.filter(log => {
      if (log.type === 'check-in') {
        const checkInTime = new Date(log.timestamp);
        const hours = checkInTime.getHours();
        return hours >= 10; // After 10 AM
      }
      return false;
    }).length,
    attendanceRate: allUsers.length > 0 
      ? ((summary?.presentToday || 0) / allUsers.length * 100).toFixed(1)
      : 0
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px',
          margin: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={() => {
              setError(null);
              fetchDashboardData();
            }}
            style={{
              marginLeft: '16px',
              padding: '4px 12px',
              backgroundColor: '#c33',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening with your team today.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="btn-refresh"
              title="Refresh Data"
            >
              <FiRefreshCw className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <ReportGenerator
              logs={filteredLogs}
              allUsers={allUsers}
              selectedDate={dateFilter}
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Employees</p>
            <h3 className="stat-value">{stats.totalEmployees}</h3>
            <p className="stat-change">
              <FiTrendingUp /> All active employees
            </p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Present Today</p>
            <h3 className="stat-value">{stats.presentToday}</h3>
            <p className="stat-change positive">
              <FiTrendingUp /> {stats.attendanceRate}% attendance rate
            </p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Absent Today</p>
            <h3 className="stat-value">{stats.absentToday}</h3>
            <p className="stat-change">
              {stats.totalEmployees > 0 
                ? `${((stats.absentToday / stats.totalEmployees) * 100).toFixed(1)}% of total`
                : 'No data'}
            </p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <p className="stat-label">On Time</p>
            <h3 className="stat-value">{stats.onTime}</h3>
            <p className="stat-change positive">
              Employees checked in before 10 AM
            </p>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Late Arrivals</p>
            <h3 className="stat-value">{stats.lateArrivals}</h3>
            <p className="stat-change negative">
              Employees checked in after 10 AM
            </p>
          </div>
        </div>

        <div className="stat-card stat-secondary">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Activity</p>
            <h3 className="stat-value">{filteredLogs.length}</h3>
            <p className="stat-change">
              Total check-ins/outs today
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/employees" className="quick-action-card">
            <FiUsers className="action-icon" />
            <span>Manage Employees</span>
            <FiArrowRight className="action-arrow" />
          </Link>
          <Link to="/attendances" className="quick-action-card">
            <FiClock className="action-icon" />
            <span>View All Attendance</span>
            <FiArrowRight className="action-arrow" />
          </Link>
          <Link to="/reports" className="quick-action-card">
            <FiBarChart2 className="action-icon" />
            <span>Generate Reports</span>
            <FiArrowRight className="action-arrow" />
          </Link>
          <Link to="/analytics" className="quick-action-card">
            <FiTrendingUp className="action-icon" />
            <span>View Analytics</span>
            <FiArrowRight className="action-arrow" />
          </Link>
          <Link to="/pending-users" className="quick-action-card">
            <FiUsers className="action-icon" />
            <span>Pending Approvals</span>
            <FiArrowRight className="action-arrow" />
          </Link>
          <Link to="/leave-requests" className="quick-action-card">
            <FiCalendar className="action-icon" />
            <span>Leave Requests</span>
            <FiArrowRight className="action-arrow" />
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h2 className="section-title">
            <FiFilter className="section-icon" />
            Attendance Filters
          </h2>
          <p className="section-subtitle">
            Filter and search attendance records
          </p>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <FiSearch className="filter-icon" />
              Search Employee
            </label>
            <input
              type="text"
              placeholder="Search by employee name..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiCalendar className="filter-icon" />
              Select Date
            </label>
            <input
              type="date"
              className="filter-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-input"
            >
              <option value="all">All Types</option>
              <option value="check-in">Check In</option>
              <option value="check-out">Check Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="attendance-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiActivity className="section-icon" />
            Recent Attendance Logs
          </h2>
          <span className="badge-count">{filteredLogs.length} records</span>
        </div>
        <div className="table-container">
          <RecentAttendanceTable logs={filteredLogs} />
        </div>
      </div>

      {/* Absent Users Section */}
      <div className="absent-section">
        <AbsentUsersList allUsers={allUsers} logs={logsForSelectedDate} />
      </div>
    </div>
  );
};

export default Dashboard;
