import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiDollarSign, FiCalendar, FiUsers, FiActivity } from 'react-icons/fi';

const DailySalaryCredit = () => {
  const [configs, setConfigs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
    appliesTo: 'all',
    departments: [],
    users: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    autoApply: true,
    isActive: true
  });

  useEffect(() => {
    fetchConfigs();
    fetchStats();
    fetchUsers();
  }, []);

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getDailySalaryConfigs, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      console.error('Error fetching configs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getDailySalaryStats, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingConfig 
        ? API_ENDPOINTS.updateDailySalaryConfig(editingConfig._id)
        : API_ENDPOINTS.createDailySalaryConfig;
      
      const method = editingConfig ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(editingConfig ? 'Configuration updated successfully!' : 'Configuration created successfully!');
        fetchConfigs();
        fetchStats();
        resetForm();
        setShowModal(false);
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      amount: config.amount.toString(),
      description: config.description || '',
      appliesTo: config.appliesTo,
      departments: config.departments || [],
      users: config.users?.map(u => u._id || u) || [],
      startDate: config.startDate ? new Date(config.startDate).toISOString().split('T')[0] : '',
      endDate: config.endDate ? new Date(config.endDate).toISOString().split('T')[0] : '',
      autoApply: config.autoApply !== undefined ? config.autoApply : true,
      isActive: config.isActive !== undefined ? config.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.deleteDailySalaryConfig(id), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('Configuration deleted successfully!');
        fetchConfigs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      alert('Failed to delete configuration');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.toggleDailySalaryStatus(id), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        fetchConfigs();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle status');
    }
  };

  const applyCreditsNow = async () => {
    if (!window.confirm('Are you sure you want to apply daily credits now?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.applyDailyCredits, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert(`Success! Updated ${data.data.totalUsersUpdated} users.`);
        fetchStats();
      }
    } catch (error) {
      console.error('Error applying credits:', error);
      alert('Failed to apply credits');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      description: '',
      appliesTo: 'all',
      departments: [],
      users: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      autoApply: true,
      isActive: true
    });
    setEditingConfig(null);
  };

  // Calculate dynamic budget projections
  const calculateBudgetProjections = () => {
    if (!stats) return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };

    const activeAmount = configs
      .filter(c => c.isActive)
      .reduce((sum, c) => {
        if (c.appliesTo === 'all') {
          return sum + (c.amount * users.length);
        } else if (c.appliesTo === 'specific_departments') {
          const deptUsers = users.filter(u => c.departments?.includes(u.department));
          return sum + (c.amount * deptUsers.length);
        } else if (c.appliesTo === 'specific_users') {
          return sum + (c.amount * (c.users?.length || 0));
        }
        return sum;
      }, 0);

    return {
      daily: activeAmount,
      weekly: activeAmount * 7,
      monthly: activeAmount * 30,
      yearly: activeAmount * 365
    };
  };

  const budgetProjections = calculateBudgetProjections();
  
  // Calculate affected users count
  const getAffectedUsersCount = () => {
    const affectedUsers = new Set();
    configs.filter(c => c.isActive).forEach(config => {
      if (config.appliesTo === 'all') {
        users.forEach(u => affectedUsers.add(u._id));
      } else if (config.appliesTo === 'specific_departments') {
        users.filter(u => config.departments?.includes(u.department))
          .forEach(u => affectedUsers.add(u._id));
      } else if (config.appliesTo === 'specific_users') {
        config.users?.forEach(userId => {
          if (typeof userId === 'object') affectedUsers.add(userId._id);
          else affectedUsers.add(userId);
        });
      }
    });
    return affectedUsers.size;
  };

  const affectedUsersCount = getAffectedUsersCount();

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Salary Credit Management</h1>
        <p className="text-gray-600">Configure automatic daily salary credits for employees</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Configs</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalConfigs}</p>
                  <p className="text-blue-200 text-xs mt-1">{stats.activeConfigs} active</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                  <FiActivity className="text-3xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Affected Users</p>
                  <p className="text-3xl font-bold mt-2">{affectedUsersCount}</p>
                  <p className="text-green-200 text-xs mt-1">of {users.length} total</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                  <FiUsers className="text-3xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Daily Budget</p>
                  <p className="text-3xl font-bold mt-2">₹{budgetProjections.daily.toLocaleString()}</p>
                  <p className="text-purple-200 text-xs mt-1">per day</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                  <FiDollarSign className="text-3xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Paid Out</p>
                  <p className="text-3xl font-bold mt-2">₹{stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-orange-200 text-xs mt-1">all time</p>
                </div>
                <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
                  <FiToggleRight className="text-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Projections Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiDollarSign className="text-blue-600" />
              Budget Projections (Based on Active Configs)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-600 text-xs font-semibold uppercase mb-1">Daily</p>
                <p className="text-2xl font-bold text-blue-900">₹{budgetProjections.daily.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-purple-600 text-xs font-semibold uppercase mb-1">Weekly</p>
                <p className="text-2xl font-bold text-purple-900">₹{budgetProjections.weekly.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-orange-600 text-xs font-semibold uppercase mb-1">Monthly</p>
                <p className="text-2xl font-bold text-orange-900">₹{budgetProjections.monthly.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600 text-xs font-semibold uppercase mb-1">Yearly</p>
                <p className="text-2xl font-bold text-green-900">₹{budgetProjections.yearly.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 These are projected costs based on current active configurations and user counts.
            </p>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Create New Config
        </button>
        <button
          onClick={applyCreditsNow}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          <FiDollarSign /> Apply Credits Now
        </button>
      </div>

      {/* Configs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applies To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users Affected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {configs.map((config) => {
                // Calculate affected users for this config
                let affectedCount = 0;
                let dailyCost = 0;
                
                if (config.appliesTo === 'all') {
                  affectedCount = users.length;
                  dailyCost = config.amount * users.length;
                } else if (config.appliesTo === 'specific_departments') {
                  affectedCount = users.filter(u => config.departments?.includes(u.department)).length;
                  dailyCost = config.amount * affectedCount;
                } else if (config.appliesTo === 'specific_users') {
                  affectedCount = config.users?.length || 0;
                  dailyCost = config.amount * affectedCount;
                }

                return (
                  <tr key={config._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <FiDollarSign className={config.isActive ? 'text-green-600' : 'text-gray-400'} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{config.name}</div>
                          <div className="text-xs text-gray-500">{config.description}</div>
                          {config.autoApply && (
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600">
                              <FiActivity size={12} /> Auto-apply enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">₹{config.amount}</div>
                      <div className="text-xs text-gray-500">per user/day</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        config.appliesTo === 'all' ? 'bg-blue-100 text-blue-800' :
                        config.appliesTo === 'specific_departments' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {config.appliesTo === 'all' ? '👥 All Employees' :
                         config.appliesTo === 'specific_departments' ? '🏢 Departments' :
                         '👤 Specific Users'}
                      </span>
                      {config.appliesTo === 'specific_departments' && config.departments && (
                        <div className="text-xs text-gray-600 mt-1">
                          {config.departments.slice(0, 2).join(', ')}
                          {config.departments.length > 2 && ` +${config.departments.length - 2}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-gray-400" size={16} />
                        <span className="text-sm font-semibold text-gray-900">{affectedCount}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {((affectedCount / users.length) * 100).toFixed(0)}% of users
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-indigo-600">₹{dailyCost.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">₹{(dailyCost * 30).toLocaleString()}/mo</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${
                        config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {config.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Since {new Date(config.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(config._id)}
                          className={`p-2 rounded-lg transition ${
                            config.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          title="Toggle Status"
                        >
                          {config.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(config._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {configs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No configurations found. Create your first one!
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingConfig ? 'Edit Configuration' : 'Create New Configuration'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Daily Attendance Bonus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applies To *</label>
                <select
                  value={formData.appliesTo}
                  onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Employees</option>
                  <option value="specific_departments">Specific Departments</option>
                  <option value="specific_users">Specific Users</option>
                </select>
              </div>

              {formData.appliesTo === 'specific_departments' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Departments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.map(dept => (
                      <label key={dept} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, departments: [...formData.departments, dept] });
                            } else {
                              setFormData({ ...formData, departments: formData.departments.filter(d => d !== dept) });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.appliesTo === 'specific_users' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
                  <select
                    multiple
                    value={formData.users}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({ ...formData, users: selected });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size="5"
                  >
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.autoApply}
                    onChange={(e) => setFormData({ ...formData, autoApply: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto Apply Daily</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : editingConfig ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySalaryCredit;

