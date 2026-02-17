import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiUsers, FiCalendar, FiPlus, FiEdit2, FiSave, FiClock, FiList, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import SalaryHistoryModal from '../../components/salary/SalaryHistoryModal';
import CreditHistoryModal from '../../components/salary/CreditHistoryModal';

const DailySalaryCredit = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [salaryMode, setSalaryMode] = useState('monthly'); // 'monthly' or 'daily'
  const [monthlySalary, setMonthlySalary] = useState('');
  const [dailySalary, setDailySalary] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [userEarnings, setUserEarnings] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCreditHistoryModal, setShowCreditHistoryModal] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [loadingPayoutRequests, setLoadingPayoutRequests] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [employeeEarnings, setEmployeeEarnings] = useState(null);
  const [employeeCredits, setEmployeeCredits] = useState([]);
  const [employeePayouts, setEmployeePayouts] = useState([]);
  const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
  const [userEarningsMap, setUserEarningsMap] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchPayoutRequests();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserEarnings(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Fetch earnings for all users to display in table
    if (users.length > 0) {
      fetchAllUsersEarnings();
    }
  }, [users]);

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

  const fetchAllUsersEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const earningsPromises = users.map(async (user) => {
        try {
          const response = await fetch(API_ENDPOINTS.getUserDailyEarningsById(user._id), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          return { userId: user._id, earnings: data.success ? data.data : null };
        } catch (error) {
          return { userId: user._id, earnings: null };
        }
      });
      
      const results = await Promise.all(earningsPromises);
      const earningsMap = {};
      results.forEach(({ userId, earnings }) => {
        earningsMap[userId] = earnings;
      });
      setUserEarningsMap(earningsMap);
    } catch (error) {
      console.error('Error fetching all users earnings:', error);
    }
  };

  const handleEmployeeClick = async (employee) => {
    setSelectedEmployeeData(employee);
    setShowEmployeeModal(true);
    setLoadingEmployeeData(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch earnings
      const earningsRes = await axios.get(API_ENDPOINTS.getUserDailyEarningsById(employee._id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (earningsRes.data.success) {
        setEmployeeEarnings(earningsRes.data.data);
      }
      
      // Fetch credit history
      const creditsRes = await axios.get(API_ENDPOINTS.getUserCreditHistory(employee._id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (creditsRes.data.success) {
        setEmployeeCredits(creditsRes.data.data || []);
      }
      
      // Fetch payouts
      const payoutsRes = await axios.get(API_ENDPOINTS.getAllPayouts, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { userId: employee._id }
      });
      if (payoutsRes.data.success) {
        setEmployeePayouts(payoutsRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      Swal.fire('Error', 'Failed to load employee details', 'error');
    } finally {
      setLoadingEmployeeData(false);
    }
  };

  const calculateTotalDebit = () => {
    return employeePayouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const calculateTotalPayout = () => {
    return employeePayouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const fetchUserEarnings = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUserDailyEarningsById(userId), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserEarnings(data.data);
        // Pre-fill salary fields if user has salary data
        const user = users.find(u => u._id === userId);
        if (user && user.salary) {
          setMonthlySalary(user.salary.toString());
          setDailySalary(Math.round(user.salary / 30).toString());
        }
      }
    } catch (error) {
      console.error('Error fetching user earnings:', error);
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      setLoadingPayoutRequests(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllPayouts, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { status: 'pending', requestedByUser: 'true' }
      });
      
      if (response.data.success) {
        // Filter only user-requested payouts (double check)
        const userRequests = response.data.data.filter(p => p.requestedByUser === true);
        setPayoutRequests(userRequests);
      }
    } catch (error) {
      console.error('Error fetching payout requests:', error);
    } finally {
      setLoadingPayoutRequests(false);
    }
  };

  const handleApprovePayoutRequest = async (payoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.updatePayoutStatus(payoutId),
        { status: 'processing' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Payout Approved!',
          text: 'Amount has been deducted from employee credit balance',
          showConfirmButton: true
        });
        fetchPayoutRequests();
        // Refresh users and earnings data
        fetchUsers();
        if (selectedEmployeeData) {
          // Refresh employee modal data if open
          handleEmployeeClick(selectedEmployeeData);
        }
        // Refresh all users earnings for table
        if (users.length > 0) {
          fetchAllUsersEarnings();
        }
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to approve payout request', 'error');
    }
  };

  const handleRejectPayoutRequest = async (payoutId) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Payout Request',
      input: 'text',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'Enter rejection reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#d33',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve();
        });
      }
    });

    if (reason !== undefined) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          API_ENDPOINTS.updatePayoutStatus(payoutId),
          { status: 'cancelled', failureReason: reason || 'Rejected by admin' },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.success) {
          Swal.fire('Success', 'Payout request rejected', 'success');
          fetchPayoutRequests();
          // Refresh users and earnings data
          fetchUsers();
          if (selectedEmployeeData) {
            // Refresh employee modal data if open
            handleEmployeeClick(selectedEmployeeData);
          }
          // Refresh all users earnings for table
          if (users.length > 0) {
            fetchAllUsersEarnings();
          }
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.error || 'Failed to reject payout request', 'error');
      }
    }
  };

  const handleProcessPayoutRequest = async (payoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.updatePayoutStatus(payoutId),
        { status: 'completed' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Payout marked as completed', 'success');
        fetchPayoutRequests();
        // Refresh users and earnings data
        fetchUsers();
        if (selectedEmployeeData) {
          // Refresh employee modal data if open
          handleEmployeeClick(selectedEmployeeData);
        }
        // Refresh all users earnings for table
        if (users.length > 0) {
          fetchAllUsersEarnings();
        }
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to complete payout', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: <FiClock /> },
      processing: { class: 'bg-blue-100 text-blue-800', label: 'Processing', icon: <FiAlertCircle /> },
      completed: { class: 'bg-green-100 text-green-800', label: 'Completed', icon: <FiCheckCircle /> },
      failed: { class: 'bg-red-100 text-red-800', label: 'Failed', icon: <FiXCircle /> },
      cancelled: { class: 'bg-gray-100 text-gray-800', label: 'Cancelled', icon: <FiXCircle /> }
    };
    return badges[status] || badges.pending;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDailyFromMonthly = (monthly) => {
    if (monthly && !isNaN(monthly)) {
      const daily = Math.round(parseFloat(monthly) / 30);
      setDailySalary(daily.toString());
    }
  };

  const calculateMonthlyFromDaily = (daily) => {
    if (daily && !isNaN(daily)) {
      const monthly = Math.round(parseFloat(daily) * 30);
      setMonthlySalary(monthly.toString());
    }
  };

  const handleSalaryUpdate = async () => {
    if (!selectedUser) {
      Swal.fire('Error', 'Please select an employee', 'error');
      return;
    }

    // Calculate monthly salary based on mode
    let salary = 0;
    if (salaryMode === 'monthly') {
      salary = parseFloat(monthlySalary);
      if (!monthlySalary || isNaN(salary) || salary <= 0) {
        Swal.fire('Error', 'Please enter a valid monthly salary amount', 'error');
        return;
      }
    } else {
      const daily = parseFloat(dailySalary);
      if (!dailySalary || isNaN(daily) || daily <= 0) {
        Swal.fire('Error', 'Please enter a valid daily rate', 'error');
        return;
      }
      salary = Math.round(daily * 30); // Convert daily to monthly
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.updateUserSalary, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId: selectedUser,
          salary: salary,
          notes: `Salary update via admin panel - ${salaryMode === 'monthly' ? 'Monthly' : 'Daily'} mode`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Salary Updated!',
          html: `
            <div style="text-align: left;">
              <p><strong>Old Salary:</strong> ₹${(data.data?.oldSalary || 0).toLocaleString('en-IN')}</p>
              <p><strong>New Salary:</strong> ₹${(data.data?.newSalary || salary).toLocaleString('en-IN')}</p>
              <p><strong>Type:</strong> ${data.data?.changeType || 'Manual Adjustment'}</p>
            </div>
          `,
          showConfirmButton: true
        });
        setMonthlySalary('');
        setDailySalary('');
        fetchUserEarnings(selectedUser);
        fetchUsers();
      } else {
        Swal.fire('Error', data.message || 'Failed to update salary', 'error');
      }
    } catch (error) {
      console.error('Error updating salary:', error);
      Swal.fire('Error', error.message || 'Failed to update salary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCredit = async () => {
    if (!selectedUser) {
      Swal.fire('Error', 'Please select an employee', 'error');
      return;
    }

    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      Swal.fire('Error', 'Please enter a valid amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Create a transaction for manual credit
      const response = await fetch(API_ENDPOINTS.manualCredit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser,
          amount: amount,
          date: manualDate,
          description: 'Manual credit by admin'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Credit Added!',
          text: `₹${amount.toLocaleString('en-IN')} credited successfully for ${new Date(manualDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
          showConfirmButton: true
        });
        setManualAmount('');
        setManualDate(new Date().toISOString().split('T')[0]);
        fetchUserEarnings(selectedUser);
      } else {
        Swal.fire('Error', data.message || 'Failed to credit amount', 'error');
      }
    } catch (error) {
      console.error('Error crediting amount:', error);
      Swal.fire('Error', error.message || 'Failed to credit amount', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedUserData = users.find(u => u._id === selectedUser);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Salary Credit Management</h1>
        <p className="text-gray-600">Set employee salaries and manage daily credits</p>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            All Employees ({users.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const earnings = userEarningsMap[user._id];
                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleEmployeeClick(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePic ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={user.profilePic} alt={user.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{user.position || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{(user.salary || 0).toLocaleString('en-IN')}/month
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{Math.round((user.salary || 0) / 30).toLocaleString('en-IN')}/day
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        ₹{(earnings?.dailyEarnings || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmployeeClick(user);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Requests Section */}
      {payoutRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiAlertCircle className="text-orange-600" />
              Pending Payout Requests ({payoutRequests.length})
            </h2>
            <button
              onClick={fetchPayoutRequests}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
          
          <div className="space-y-3">
            {payoutRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              return (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {request.userId?.name || 'Unknown User'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-bold text-green-600">
                            ₹{request.amount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="ml-2 font-mono text-xs text-gray-700">
                            {request.transactionId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Requested:</span>
                          <span className="ml-2 text-gray-800">
                            {formatDateTime(request.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 text-gray-800">{request.userId?.email || 'N/A'}</span>
                        </div>
                      </div>
                      {request.description && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Description:</strong> {request.description}
                        </div>
                      )}
                      {request.requestNotes && (
                        <div className="mt-1 text-sm text-gray-500 italic">
                          <strong>Notes:</strong> {request.requestNotes}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprovePayoutRequest(request._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-semibold"
                          >
                            <FiCheckCircle />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPayoutRequest(request._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm font-semibold"
                          >
                            <FiXCircle />
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'processing' && (
                        <button
                          onClick={() => handleProcessPayoutRequest(request._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold"
                        >
                          <FiCheckCircle />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Employee Selection & Salary Setup */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Select Employee
            </h2>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="">-- Choose Employee --</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.position} ({user.department || 'No Dept'})
                </option>
              ))}
            </select>

            {selectedUserData && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">Current Salary</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{(selectedUserData.salary || 0).toLocaleString()}/month
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Daily: ₹{Math.round((selectedUserData.salary || 0) / 30).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Salary Setup */}
          {selectedUser && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-green-600" />
                  Set Salary
                </h2>

                {/* Salary Mode Toggle */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setSalaryMode('monthly')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      salaryMode === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Monthly Salary
                  </button>
                  <button
                    onClick={() => setSalaryMode('daily')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      salaryMode === 'daily'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Daily Rate
                  </button>
                </div>

                {salaryMode === 'monthly' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Salary (₹)
                      </label>
                      <input
                        type="number"
                        value={monthlySalary}
                        onChange={(e) => {
                          setMonthlySalary(e.target.value);
                          calculateDailyFromMonthly(e.target.value);
                        }}
                        placeholder="Enter monthly salary"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600">Auto-calculated Daily Rate</p>
                      <p className="text-3xl font-bold text-green-900">
                        ₹{dailySalary || '0'}/day
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Monthly ÷ 30 days)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={dailySalary}
                        onChange={(e) => {
                          setDailySalary(e.target.value);
                          calculateMonthlyFromDaily(e.target.value);
                        }}
                        placeholder="Enter daily rate"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600">Calculated Monthly Salary</p>
                      <p className="text-3xl font-bold text-purple-900">
                        ₹{monthlySalary || '0'}/month
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Daily × 30 days)
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSalaryUpdate}
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-semibold text-lg"
                >
                  <FiSave />
                  {loading ? 'Updating...' : 'Update Salary'}
                </button>

                {/* History Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    <FiClock />
                    Salary History
                  </button>
                  <button
                    onClick={() => setShowCreditHistoryModal(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-semibold"
                  >
                    <FiList />
                    Credit History
                  </button>
                </div>
              </div>

              {/* Manual Credit */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiPlus className="text-orange-600" />
                  Add Manual Credit
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Add a one-time amount to employee's earnings for a specific date
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>

                  <button
                    onClick={handleManualCredit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 font-semibold"
                  >
                    <FiPlus />
                    {loading ? 'Processing...' : 'Add Credit'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Employee Current Earnings */}
        <div className="lg:col-span-1">
          {selectedUser && userEarnings ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Current Earnings
                </h2>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Employee</p>
                <p className="text-base font-semibold text-blue-900">{userEarnings.name || 'Unknown'}</p>
                {userEarnings.department && (
                  <p className="text-xs text-gray-500 mt-1">{userEarnings.department}</p>
                )}
              </div>

              <div className="space-y-3">
                {/* Total Current Earnings - Most Prominent */}
                <div className="p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium opacity-90">Total Current Earnings</p>
                    <FiDollarSign className="text-2xl opacity-80" />
                  </div>
                  <p className="text-4xl font-black mt-2">
                    ₹{(userEarnings.dailyEarnings || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs opacity-75 mt-2">All-time accumulated earnings</p>
                </div>

                {/* Today's Earnings */}
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">Today</p>
                      <p className="text-2xl font-bold text-green-900">
                        ₹{(userEarnings.todayEarnings || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCalendar className="text-white text-xl" />
                    </div>
                  </div>
                </div>

                {/* This Week */}
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-700 mb-1">This Week</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ₹{(userEarnings.weeklyEarnings || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FiCalendar className="text-white text-xl" />
                    </div>
                  </div>
                </div>

                {/* This Month */}
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-700 mb-1">This Month</p>
                      <p className="text-2xl font-bold text-orange-900">
                        ₹{(userEarnings.monthlyEarnings || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <FiCalendar className="text-white text-xl" />
                    </div>
                  </div>
                </div>

                {/* Daily Rate */}
                {userEarnings.dailyRate > 0 && (
                  <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-300">
                    <p className="text-xs font-medium text-indigo-700 mb-1">Active Daily Rate</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      ₹{userEarnings.dailyRate.toLocaleString('en-IN')}/day
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Auto-calculated monthly: ₹{(userEarnings.dailyRate * 30).toLocaleString('en-IN')}</p>
                  </div>
                )}

                {/* Last Credit Date */}
                {userEarnings.lastDailyCreditDate && (
                  <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-gray-500" />
                      <p className="text-xs font-semibold text-gray-700 uppercase">Last Credit Date</p>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(userEarnings.lastDailyCreditDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : selectedUser && !userEarnings ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading earnings data...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <FiUsers className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium mb-2">No Employee Selected</p>
              <p className="text-sm text-gray-400">Select an employee from the list to view their current earnings</p>
            </div>
          )}
        </div>
      </div>

      {/* Salary History Modal */}
      <SalaryHistoryModal
        userId={selectedUser}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        isAdmin={true}
      />

      {/* Credit History Modal */}
      <CreditHistoryModal
        userId={selectedUser}
        isOpen={showCreditHistoryModal}
        onClose={() => setShowCreditHistoryModal(false)}
        isAdmin={true}
      />

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployeeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowEmployeeModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedEmployeeData.name}</h2>
                <p className="text-sm text-gray-600">{selectedEmployeeData.email} • {selectedEmployeeData.department || 'N/A'}</p>
              </div>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingEmployeeData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* 4 Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Amount Card */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium opacity-90">Total Amount</p>
                        <FiDollarSign className="text-2xl opacity-80" />
                      </div>
                      <p className="text-3xl font-black">
                        ₹{(employeeEarnings?.dailyEarnings || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs opacity-75 mt-2">All-time earnings</p>
                    </div>

                    {/* Debit Card */}
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium opacity-90">Total Debit</p>
                        <FiDollarSign className="text-2xl opacity-80" />
                      </div>
                      <p className="text-3xl font-black">
                        ₹{calculateTotalDebit().toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs opacity-75 mt-2">Completed payouts</p>
                    </div>

                    {/* Payout Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium opacity-90">Total Payout</p>
                        <FiDollarSign className="text-2xl opacity-80" />
                      </div>
                      <p className="text-3xl font-black">
                        ₹{calculateTotalPayout().toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs opacity-75 mt-2">All payout requests</p>
                    </div>

                    {/* Payout Count Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium opacity-90">Payout Count</p>
                        <FiList className="text-2xl opacity-80" />
                      </div>
                      <p className="text-3xl font-black">
                        {employeePayouts.length}
                      </p>
                      <p className="text-xs opacity-75 mt-2">Total transactions</p>
                    </div>
                  </div>

                  {/* Credit History Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiDollarSign className="text-green-600" />
                        Credit History ({employeeCredits.length})
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedUser(selectedEmployeeData._id);
                          setShowCreditHistoryModal(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View All
                      </button>
                    </div>
                    {employeeCredits.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No credit history</p>
                    ) : (
                      <div className="space-y-2">
                        {employeeCredits.slice(0, 5).map((credit) => (
                          <div key={credit._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-green-600">+₹{credit.amount?.toLocaleString('en-IN')}</p>
                              <p className="text-sm text-gray-600">
                                {(credit.configsApplied && credit.configsApplied[0]?.configName) || 'Manual credit'}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(credit.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payout List Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiDollarSign className="text-blue-600" />
                        Payout List ({employeePayouts.length})
                      </h3>
                    </div>
                    {employeePayouts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No payouts found</p>
                    ) : (
                      <div className="space-y-3">
                        {employeePayouts.map((payout) => {
                          const statusBadge = getStatusBadge(payout.status);
                          return (
                            <div key={payout._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="font-bold text-lg text-gray-800">
                                    ₹{payout.amount?.toLocaleString('en-IN')}
                                  </p>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.class}`}>
                                    {statusBadge.icon}
                                    {statusBadge.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 font-mono">{payout.transactionId}</p>
                                {payout.description && (
                                  <p className="text-sm text-gray-500 mt-1">{payout.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-700">
                                  {formatDateTime(payout.payoutTime)}
                                </p>
                                {payout.requestedByUser && (
                                  <span className="text-xs text-blue-600 mt-1 block">User Requested</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySalaryCredit;
