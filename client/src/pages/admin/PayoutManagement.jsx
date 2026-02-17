import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import { 
  FiDollarSign, FiUsers, FiCalendar, FiPlus, FiEdit2, FiTrash2, 
  FiCheckCircle, FiXCircle, FiClock, FiSearch, FiFilter, FiDownload 
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';
import './PayoutManagement.css';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filters
  const [userIdFilter, setUserIdFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    payoutTime: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    description: '',
    notes: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchPayouts();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [userIdFilter, statusFilter, startDate, endDate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      
      if (userIdFilter !== 'all') params.userId = userIdFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axios.get(API_ENDPOINTS.getAllPayouts, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });
      
      if (response.data.success) {
        let filteredPayouts = response.data.data;
        
        // Apply search filter
        if (searchQuery) {
          filteredPayouts = filteredPayouts.filter(payout => 
            payout.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payout.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payout.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setPayouts(filteredPayouts);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      Swal.fire('Error', 'Failed to load payouts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axios.get(API_ENDPOINTS.getPayoutStats, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreatePayout = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.amount) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.createPayout, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        Swal.fire('Success', 'Payout created successfully', 'success');
        setShowCreateModal(false);
        setFormData({
          userId: '',
          amount: '',
          payoutTime: new Date().toISOString().split('T')[0],
          paymentMethod: 'bank_transfer',
          description: '',
          notes: ''
        });
        fetchPayouts();
        fetchStats();
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to create payout', 'error');
    }
  };

  const handleUpdateStatus = async (payoutId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.updatePayoutStatus(payoutId),
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Payout status updated', 'success');
        fetchPayouts();
        fetchStats();
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const handleDeletePayout = async (payoutId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(API_ENDPOINTS.deletePayout(payoutId), {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          Swal.fire('Deleted', 'Payout has been deleted', 'success');
          fetchPayouts();
          fetchStats();
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.error || 'Failed to delete payout', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', label: 'Pending' },
      processing: { class: 'status-processing', label: 'Processing' },
      completed: { class: 'status-completed', label: 'Completed' },
      failed: { class: 'status-failed', label: 'Failed' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled' }
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

  return (
    <div className="payout-management-page">
      <div className="payout-header">
        <div>
          <h1>Payout Management</h1>
          <p>Manage employee payouts and transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <FiPlus /> Create Payout
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Payouts</p>
              <h2>{stats.totalPayouts}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Amount</p>
              <h2>₹{stats.totalAmount?.toLocaleString('en-IN') || 0}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <p className="stat-label">Completed</p>
              <h2>{stats.statusBreakdown?.completed?.count || 0}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pending</p>
              <h2>{stats.statusBreakdown?.pending?.count || 0}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search</label>
          <div className="search-input">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by transaction ID, name, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchPayouts();
              }}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>Employee</label>
          <select value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)}>
            <option value="all">All Employees</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="payouts-table-container">
        {loading ? (
          <div className="loading">Loading payouts...</div>
        ) : payouts.length === 0 ? (
          <div className="empty-state">
            <FiDollarSign />
            <p>No payouts found</p>
          </div>
        ) : (
          <table className="payouts-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Employee</th>
                <th>Amount</th>
                <th>Payout Time</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(payout => {
                const statusBadge = getStatusBadge(payout.status);
                return (
                  <tr key={payout._id}>
                    <td className="transaction-id">{payout.transactionId}</td>
                    <td>
                      <div className="employee-info">
                        <strong>{payout.userId?.name || 'N/A'}</strong>
                        <span>{payout.userId?.email || ''}</span>
                      </div>
                    </td>
                    <td className="amount">₹{payout.amount?.toLocaleString('en-IN')}</td>
                    <td>{formatDateTime(payout.payoutTime)}</td>
                    <td>{payout.paymentMethod?.replace('_', ' ').toUpperCase()}</td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {payout.status === 'pending' && (
                          <>
                            <button
                              className="btn-success"
                              onClick={() => handleUpdateStatus(payout._id, 'processing')}
                              title="Mark as Processing"
                            >
                              <FiClock />
                            </button>
                            <button
                              className="btn-success"
                              onClick={() => handleUpdateStatus(payout._id, 'completed')}
                              title="Mark as Completed"
                            >
                              <FiCheckCircle />
                            </button>
                          </>
                        )}
                        {payout.status === 'processing' && (
                          <button
                            className="btn-success"
                            onClick={() => handleUpdateStatus(payout._id, 'completed')}
                            title="Mark as Completed"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        {payout.status !== 'completed' && (
                          <button
                            className="btn-danger"
                            onClick={() => handleDeletePayout(payout._id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Payout Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Payout</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePayout}>
              <div className="form-group">
                <label>Employee *</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Payout Time *</label>
                <input
                  type="datetime-local"
                  value={formData.payoutTime}
                  onChange={(e) => setFormData({ ...formData, payoutTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutManagement;
