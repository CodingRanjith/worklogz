import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiUser, FiAlertCircle, FiDownload, FiFilter } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const LateReports = () => {
  const [lateRecords, setLateRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    userId: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchLateRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, lateRecords]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUsers, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLateRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getAttendanceAll, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Filter for late check-ins (after 9:30 AM)
      const lateEntries = data.filter(record => {
        if (record.type !== 'check-in') return false;
        const checkInTime = new Date(record.timestamp);
        const hours = checkInTime.getHours();
        const minutes = checkInTime.getMinutes();
        // Consider late if after 9:30 AM
        return hours > 9 || (hours === 9 && minutes > 30);
      });

      setLateRecords(lateEntries);
    } catch (error) {
      console.error('Error fetching late records:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...lateRecords];

    // Filter by month and year
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.getMonth() + 1 === parseInt(filters.month) &&
             recordDate.getFullYear() === parseInt(filters.year);
    });

    // Filter by user
    if (filters.userId) {
      filtered = filtered.filter(record => record.userId?._id === filters.userId);
    }

    setFilteredRecords(filtered);
  };

  const calculateLateDuration = (timestamp) => {
    const checkInTime = new Date(timestamp);
    const expectedTime = new Date(checkInTime);
    expectedTime.setHours(9, 30, 0, 0); // Expected time: 9:30 AM

    const diffMs = checkInTime - expectedTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} mins`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getLateSeverity = (timestamp) => {
    const checkInTime = new Date(timestamp);
    const expectedTime = new Date(checkInTime);
    expectedTime.setHours(9, 30, 0, 0);
    const diffMins = Math.floor((checkInTime - expectedTime) / 60000);

    if (diffMins <= 15) return 'low'; // Yellow
    if (diffMins <= 30) return 'medium'; // Orange
    return 'high'; // Red
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Date', 'Check-In Time', 'Late By', 'Department'].join(','),
      ...filteredRecords.map(record => [
        record.userId?.name || 'N/A',
        new Date(record.timestamp).toLocaleDateString(),
        new Date(record.timestamp).toLocaleTimeString(),
        calculateLateDuration(record.timestamp),
        record.userId?.department || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `late-reports-${filters.month}-${filters.year}.csv`;
    a.click();
  };

  const stats = {
    total: filteredRecords.length,
    lowSeverity: filteredRecords.filter(r => getLateSeverity(r.timestamp) === 'low').length,
    mediumSeverity: filteredRecords.filter(r => getLateSeverity(r.timestamp) === 'medium').length,
    highSeverity: filteredRecords.filter(r => getLateSeverity(r.timestamp) === 'high').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Late Reports</h1>
        <p className="text-gray-600">Track and manage employee late arrivals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Late Arrivals</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FiClock className="text-gray-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">≤ 15 mins Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowSeverity}</p>
            </div>
            <FiAlertCircle className="text-yellow-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">16-30 mins Late</p>
              <p className="text-2xl font-bold text-orange-600">{stats.mediumSeverity}</p>
            </div>
            <FiAlertCircle className="text-orange-500 text-3xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">> 30 mins Late</p>
              <p className="text-2xl font-bold text-red-600">{stats.highSeverity}</p>
            </div>
            <FiAlertCircle className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employees</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>

          <button
            onClick={exportToCSV}
            className="ml-auto flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Late Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No late arrivals found for the selected period
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const severity = getLateSeverity(record.timestamp);
                  const severityColors = {
                    low: 'bg-yellow-100 text-yellow-800',
                    medium: 'bg-orange-100 text-orange-800',
                    high: 'bg-red-100 text-red-800'
                  };

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.userId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(record.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Date(record.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-red-600">
                          {calculateLateDuration(record.timestamp)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.userId?.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[severity]}`}>
                          {severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LateReports;

