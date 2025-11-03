import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiUsers, FiCalendar, FiPlus, FiEdit2, FiSave, FiClock, FiList } from 'react-icons/fi';
import Swal from 'sweetalert2';
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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserEarnings(selectedUser);
    }
  }, [selectedUser]);

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

  const fetchUserEarnings = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.getUserDailyEarnings}/${userId}`, {
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

    const salary = salaryMode === 'monthly' ? parseFloat(monthlySalary) : parseFloat(dailySalary) * 30;
    const daily = salaryMode === 'monthly' ? parseFloat(dailySalary) : parseFloat(dailySalary);

    if (isNaN(salary) || salary <= 0) {
      Swal.fire('Error', 'Please enter a valid salary amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.baseURL}/api/daily-salary/update-salary`, {
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
      if (data.success) {
        Swal.fire('Success', `Salary updated successfully!\nOld: ₹${data.data.oldSalary.toLocaleString()}\nNew: ₹${data.data.newSalary.toLocaleString()}\nType: ${data.data.changeType}`, 'success');
        fetchUserEarnings(selectedUser);
        fetchUsers();
      } else {
        Swal.fire('Error', data.message || 'Failed to update salary', 'error');
      }
    } catch (error) {
      console.error('Error updating salary:', error);
      Swal.fire('Error', 'Failed to update salary', 'error');
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
      const response = await fetch(`${API_ENDPOINTS.baseURL}/api/daily-salary/manual-credit`, {
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
      if (data.success) {
        Swal.fire('Success', `₹${amount.toLocaleString()} credited successfully!`, 'success');
        setManualAmount('');
        fetchUserEarnings(selectedUser);
      } else {
        Swal.fire('Error', data.message || 'Failed to credit amount', 'error');
      }
    } catch (error) {
      console.error('Error crediting amount:', error);
      Swal.fire('Error', 'Failed to credit amount', 'error');
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

        {/* Right Panel - Employee Earnings */}
        <div className="lg:col-span-1">
          {userEarnings && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">
                {userEarnings.name}'s Earnings
              </h2>

              <div className="space-y-4">
                {/* Total Earnings */}
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                  <p className="text-sm opacity-90">Total Earnings</p>
                  <p className="text-3xl font-bold mt-1">
                    ₹{(userEarnings.dailyEarnings || 0).toLocaleString()}
                  </p>
                </div>

                {/* Today */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{(userEarnings.todayEarnings || 0).toLocaleString()}
                  </p>
                </div>

                {/* This Week */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ₹{(userEarnings.weeklyEarnings || 0).toLocaleString()}
                  </p>
                </div>

                {/* This Month */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ₹{(userEarnings.monthlyEarnings || 0).toLocaleString()}
                  </p>
                </div>

                {/* Daily Rate */}
                {userEarnings.dailyRate > 0 && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm text-gray-600">Active Daily Rate</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      ₹{userEarnings.dailyRate.toLocaleString()}/day
                    </p>
                  </div>
                )}

                {/* Last Credit Date */}
                {userEarnings.lastDailyCreditDate && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Last Credit</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(userEarnings.lastDailyCreditDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedUser && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <FiUsers className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">Select an employee to view their earnings</p>
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
    </div>
  );
};

export default DailySalaryCredit;
