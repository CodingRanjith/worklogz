import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../utils/api';
import { jwtDecode } from 'jwt-decode';
import '../../styles/systemAppTheme.css';

function LeaveManagement({ embedded = false, onBack }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'history', 'balance' for employee; 'requests', 'assign', 'all' for admin
  const [loading, setLoading] = useState(true);

  // Employee states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);

  // Admin states
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [assignLeaveType, setAssignLeaveType] = useState('Casual Leave');
  const [assignDays, setAssignDays] = useState('');
  const [assignYear, setAssignYear] = useState(new Date().getFullYear());

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      
      if (decoded.role === 'admin' || decoded.role === 'master-admin') {
        setActiveTab('requests');
        fetchAllLeaveRequests();
        fetchEmployees();
      } else {
        setActiveTab('apply');
        fetchMyLeaves();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/login');
    }
  };

  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyLeaves, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyLeaves(response.data || []);
    } catch (error) {
      console.error('Error fetching my leaves:', error);
    }
  };

  const fetchAllLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllLeaves, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllLeaveRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching all leave requests:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data.filter(u => u.role === 'employee') || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (new Date(fromDate) > new Date(toDate)) {
      Swal.fire('Invalid Dates', 'From Date should not be after To Date.', 'warning');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(API_ENDPOINTS.applyLeave, {
        fromDate,
        toDate,
        reason,
        leaveType,
        isHalfDay,
        halfDayPeriod: isHalfDay ? halfDayPeriod : null
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: 'success',
        title: 'Leave Applied!',
        text: 'Your leave has been submitted successfully.',
        showConfirmButton: false,
        timer: 1500,
      });

      setFromDate('');
      setToDate('');
      setReason('');
      setLeaveType('Casual Leave');
      setIsHalfDay(false);
      setHalfDayPeriod('');
      fetchMyLeaves();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.error || 'Failed to apply for leave', 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const adminNotes = await Swal.fire({
      title: `Are you sure you want to ${status.toLowerCase()} this leave?`,
      input: 'textarea',
      inputLabel: 'Admin Notes (Optional)',
      inputPlaceholder: 'Enter any notes...',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    });

    if (adminNotes.isConfirmed) {
      try {
        await axios.patch(API_ENDPOINTS.updateLeaveStatus(id), {
          status,
          adminNotes: adminNotes.value || ''
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: 'success',
          title: `Leave ${status}!`,
          timer: 1500,
          showConfirmButton: false
        });

        fetchAllLeaveRequests();
      } catch (error) {
        console.error('Error updating leave status:', error);
        Swal.fire('Error', 'Failed to update leave status', 'error');
      }
    }
  };

  const calculateLeaveBalance = () => {
    const currentYear = new Date().getFullYear();
    const yearLeaves = myLeaves.filter(l => new Date(l.fromDate).getFullYear() === currentYear);
    
    const balances = {
      'Casual Leave': { total: 12, used: 0, pending: 0 },
      'Sick Leave': { total: 12, used: 0, pending: 0 },
      'Privileged Leave': { total: 15, used: 0, pending: 0 },
      'Compensation Off': { total: 0, used: 0, pending: 0 },
      'Emergency': { total: 5, used: 0, pending: 0 }
    };

    yearLeaves.forEach(leave => {
      if (leave.status === 'Approved') {
        balances[leave.leaveType].used += leave.numberOfDays || 0;
      } else if (leave.status === 'Pending') {
        balances[leave.leaveType].pending += leave.numberOfDays || 0;
      }
    });

    return balances;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Approved': 'bg-green-100 text-green-800 border-green-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className={`${embedded ? 'bg-white rounded-2xl shadow p-6' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (embedded && typeof onBack === 'function') {
      onBack();
    } else {
      navigate('/attendance');
    }
  };

  return (
    <div className={`${embedded ? 'bg-white rounded-2xl shadow-lg p-4 md:p-6' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6'}`}>
      <div className={`${embedded ? '' : 'max-w-7xl mx-auto'}`}>
        {/* Header */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">
                {(userRole === 'admin' || userRole === 'master-admin') ? 'Leave Management' : 'My Leaves'}
              </h1>
              <p className="text-gray-600">
                {(userRole === 'admin' || userRole === 'master-admin') 
                  ? 'Manage leave requests and assign leaves to employees' 
                  : 'Apply for leave and track your leave history'}
              </p>
            </div>
            <button
              onClick={handleBackNavigation}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 border border-blue-100">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
            {(userRole === 'admin' || userRole === 'master-admin') ? (
              <>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'requests'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Leave Requests
                </button>
                <button
                  onClick={() => setActiveTab('assign')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'assign'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Assign Leaves
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Leaves
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('apply')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'apply'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Apply Leave
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My History
                </button>
                <button
                  onClick={() => setActiveTab('balance')}
                  className={`px-6 py-3 rounded-xl font-medium transition ${
                    activeTab === 'balance'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Leave Balance
                </button>
              </>
            )}
          </div>

          {/* Employee: Apply Leave Tab */}
          {userRole === 'employee' && activeTab === 'apply' && (
            <form onSubmit={handleApplyLeave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-2">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                    className="w-full rounded-xl border px-4 py-3 outline-indigo-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-2">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                    disabled={isHalfDay}
                    className="w-full rounded-xl border px-4 py-3 outline-indigo-500 shadow-sm disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-2">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 outline-indigo-500 shadow-sm"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Privileged Leave">Privileged Leave</option>
                    <option value="Compensation Off">Compensation Off</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-2">Half Day?</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHalfDay}
                        onChange={(e) => setIsHalfDay(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>Yes</span>
                    </label>
                    {isHalfDay && (
                      <select
                        value={halfDayPeriod}
                        onChange={(e) => setHalfDayPeriod(e.target.value)}
                        required
                        className="rounded-xl border px-4 py-2 outline-indigo-500"
                      >
                        <option value="">Select Period</option>
                        <option value="First Half">First Half</option>
                        <option value="Second Half">Second Half</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 font-medium mb-2">Reason</label>
                <textarea
                  placeholder="Brief reason for leave..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 outline-indigo-500 shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFromDate('');
                    setToDate('');
                    setReason('');
                    setLeaveType('Casual Leave');
                    setIsHalfDay(false);
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md transition"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          )}

          {/* Employee: History Tab */}
          {userRole === 'employee' && activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">My Leave History</h3>
              {myLeaves.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No leave requests yet</p>
              ) : (
                <div className="space-y-4">
                  {myLeaves.map((leave) => (
                    <div key={leave._id} className="border rounded-xl p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{leave.leaveType} • {leave.numberOfDays} day(s)</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(leave.status)}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{leave.reason}</p>
                      {leave.adminNotes && (
                        <p className="text-sm text-gray-600 mt-2 italic">Admin Note: {leave.adminNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Employee: Leave Balance Tab */}
          {userRole === 'employee' && activeTab === 'balance' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">My Leave Balance ({new Date().getFullYear()})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(calculateLeaveBalance()).map(([type, balance]) => (
                  <div key={type} className="border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h4 className="font-semibold text-gray-800 mb-3">{type}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold">{balance.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Used:</span>
                        <span className="font-bold text-red-600">{balance.used}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-bold text-yellow-600">{balance.pending}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold text-gray-800">Available:</span>
                        <span className="font-bold text-green-600">
                          {balance.total - balance.used - balance.pending}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin: Leave Requests Tab */}
          {(userRole === 'admin' || userRole === 'master-admin') && activeTab === 'requests' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Leave Requests</h3>
              {allLeaveRequests.filter(r => r.status === 'Pending').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {allLeaveRequests.filter(r => r.status === 'Pending').map((request) => (
                    <div key={request._id} className="border rounded-xl p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{request.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{request.user?.email} • {request.user?.position}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-600">From</p>
                          <p className="font-semibold">{new Date(request.fromDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">To</p>
                          <p className="font-semibold">{new Date(request.toDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-semibold">{request.leaveType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Days</p>
                          <p className="font-semibold">{request.numberOfDays || 0}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{request.reason}</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin: Assign Leaves Tab */}
          {(userRole === 'admin' || userRole === 'master-admin') && activeTab === 'assign' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Assign Leaves to Employee</h3>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                <p className="text-gray-600 mb-4 text-center">
                  Leave assignment feature will be implemented with leave balance management system.
                </p>
                <p className="text-sm text-gray-500 text-center">
                  This will allow admins to credit leave balances to employees at the start of each year.
                </p>
              </div>
            </div>
          )}

          {/* Admin: All Leaves Tab */}
          {(userRole === 'admin' || userRole === 'master-admin') && activeTab === 'all' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Leave Requests</h3>
              {allLeaveRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No leave requests found</p>
              ) : (
                <div className="space-y-4">
                  {allLeaveRequests.map((request) => (
                    <div key={request._id} className="border rounded-xl p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{request.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{request.user?.email} • {request.user?.position}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-600">From</p>
                          <p className="font-semibold">{new Date(request.fromDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">To</p>
                          <p className="font-semibold">{new Date(request.toDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-semibold">{request.leaveType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Days</p>
                          <p className="font-semibold">{request.numberOfDays || 0}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{request.reason}</p>
                      {request.adminNotes && (
                        <p className="text-sm text-gray-600 italic mb-2">Admin Note: {request.adminNotes}</p>
                      )}
                      {request.status === 'Pending' && (
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => handleUpdateStatus(request._id, 'Approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;

