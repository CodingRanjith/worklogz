import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceTable from '../../components/admin-dashboard/attendance/AttendanceTable';
import { API_ENDPOINTS } from '../../utils/api';
import Loader from '../../components/admin-dashboard/common/Loader';
import { 
  FiSearch, FiCalendar, FiUsers, FiClock, FiFilter, 
  FiDownload, FiRefreshCw, FiCheckCircle, FiXCircle,
  FiMapPin, FiActivity, FiTrendingUp, FiTrendingDown,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Attendance.css';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [officeFilter, setOfficeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);

  const token = localStorage.getItem('token');

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_ENDPOINTS.getAttendanceAll, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(res.data || []);
      setFilteredRecords(res.data || []);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch users for filter
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setAllUsers([]);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...records];

    // Search filter
    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(record =>
        record.user?.name?.toLowerCase().includes(keyword) ||
        record.user?.email?.toLowerCase().includes(keyword) ||
        record.employeeName?.toLowerCase().includes(keyword)
      );
    }

    // Employee filter
    if (employeeFilter !== 'all') {
      result = result.filter(record => 
        record.user?._id === employeeFilter || record.userId === employeeFilter
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(record => record.type === typeFilter);
    }

    // Location filter
    if (locationFilter !== 'all' && locationFilter.trim()) {
      result = result.filter(record => 
        record.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Office filter
    if (officeFilter !== 'all') {
      const isInOffice = officeFilter === 'yes';
      result = result.filter(record => record.isInOffice === isInOffice);
    }

    // Date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= startDate;
      });
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate <= endDate;
      });
    }

    // Sort by timestamp (newest first)
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredRecords(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [records, search, employeeFilter, typeFilter, locationFilter, officeFilter, dateRange]);

  // Calculate statistics
  const stats = {
    total: filteredRecords.length,
    checkIns: filteredRecords.filter(r => r.type === 'check-in').length,
    checkOuts: filteredRecords.filter(r => r.type === 'check-out').length,
    inOffice: filteredRecords.filter(r => r.isInOffice).length,
    remote: filteredRecords.filter(r => !r.isInOffice).length,
    uniqueEmployees: new Set(filteredRecords.map(r => r.user?._id || r.userId).filter(Boolean)).size
  };

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    if (!doc.autoTable) {
      doc.autoTable = autoTable;
    }

    doc.setFontSize(20);
    doc.text('ATTENDANCE RECORDS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${filteredRecords.length}`, 14, 37);
    
    if (dateRange.start || dateRange.end) {
      doc.text(
        `Date Range: ${dateRange.start || 'All'} to ${dateRange.end || 'All'}`,
        14,
        44
      );
    }

    const tableData = filteredRecords.map(record => [
      record.user?.name || record.employeeName || 'Unknown',
      record.user?.email || '—',
      record.type === 'check-in' ? 'Check In' : 'Check Out',
      record.location || '—',
      new Date(record.timestamp).toLocaleDateString(),
      new Date(record.timestamp).toLocaleTimeString(),
      record.isInOffice ? 'Yes' : 'No'
    ]);

    doc.autoTable({
      startY: 50,
      head: [['Employee', 'Email', 'Type', 'Location', 'Date', 'Time', 'In Office']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [99, 102, 241],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`attendance_records_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setEmployeeFilter('all');
    setTypeFilter('all');
    setLocationFilter('all');
    setOfficeFilter('all');
    setDateRange({ start: '', end: '' });
  };

  if (loading) return <Loader />;

  return (
    <div className="attendance-page">
      {/* Header Section */}
      <div className="attendance-header">
        <div className="header-content">
          <div>
            <h1 className="page-title">Attendance Management</h1>
            <p className="page-subtitle">
              View and manage all employee attendance records
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={fetchAttendance}
              disabled={refreshing}
              className="btn-refresh"
              title="Refresh Data"
            >
              <FiRefreshCw className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportToPDF}
              className="btn-export"
              title="Export to PDF"
            >
              <FiDownload />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Records</p>
            <h3 className="stat-value">{stats.total}</h3>
            <p className="stat-change">
              Filtered attendance records
            </p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Check Ins</p>
            <h3 className="stat-value">{stats.checkIns}</h3>
            <p className="stat-change positive">
              <FiTrendingUp /> {stats.total > 0 ? ((stats.checkIns / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-content">
            <p className="stat-label">Check Outs</p>
            <h3 className="stat-value">{stats.checkOuts}</h3>
            <p className="stat-change">
              {stats.total > 0 ? ((stats.checkOuts / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>

        <div className="stat-card stat-secondary">
          <div className="stat-icon">
            <FiMapPin />
          </div>
          <div className="stat-content">
            <p className="stat-label">In Office</p>
            <h3 className="stat-value">{stats.inOffice}</h3>
            <p className="stat-change positive">
              Office-based attendance
            </p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <p className="stat-label">Remote</p>
            <h3 className="stat-value">{stats.remote}</h3>
            <p className="stat-change">
              Remote attendance records
            </p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <p className="stat-label">Unique Employees</p>
            <h3 className="stat-value">{stats.uniqueEmployees}</h3>
            <p className="stat-change">
              Employees with records
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h2 className="section-title">
            <FiFilter className="section-icon" />
            Filters & Search
          </h2>
          <button onClick={clearFilters} className="btn-clear-filters">
            Clear All
          </button>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <FiSearch className="filter-icon" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="filter-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiUsers className="filter-icon" />
              Employee
            </label>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="filter-input"
            >
              <option value="all">All Employees</option>
              {allUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiActivity className="filter-icon" />
              Type
            </label>
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

          <div className="filter-group">
            <label className="filter-label">
              <FiMapPin className="filter-icon" />
              Location
            </label>
            <input
              type="text"
              placeholder="Filter by location..."
              className="filter-input"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiMapPin className="filter-icon" />
              Office Status
            </label>
            <select
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value)}
              className="filter-input"
            >
              <option value="all">All</option>
              <option value="yes">In Office</option>
              <option value="no">Remote</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiCalendar className="filter-icon" />
              Start Date
            </label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <FiCalendar className="filter-icon" />
              End Date
            </label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="table-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiClock className="section-icon" />
            Attendance Records
          </h2>
          <div className="table-info">
            <span className="badge-count">
              Showing {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length}
            </span>
          </div>
        </div>
        <div className="table-container">
          <AttendanceTable records={currentRecords} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <FiChevronLeft />
              Previous
            </button>
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
