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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Configs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalConfigs}</p>
              </div>
              <FiActivity className="text-blue-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Configs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeConfigs}</p>
              </div>
              <FiToggleRight className="text-green-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Users with Earnings</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalUsersWithEarnings}</p>
              </div>
              <FiUsers className="text-purple-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toFixed(2)}</p>
              </div>
              <FiDollarSign className="text-green-500 text-3xl" />
            </div>
          </div>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Apply</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {configs.map((config) => (
                <tr key={config._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{config.name}</div>
                    <div className="text-sm text-gray-500">{config.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">₹{config.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{config.appliesTo.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(config.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {config.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      config.autoApply ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {config.autoApply ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(config._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Toggle Status"
                      >
                        {config.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(config)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(config._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

