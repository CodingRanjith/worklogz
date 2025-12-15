import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiEye, FiCheckCircle, FiXCircle, FiClock, FiDownload, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import techLogo from '../../assets/tech.png';
import './FeePaymentsManagement.css';

const FeePaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, verified, rejected
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseName: '',
    feeAmount: '',
    screenshot: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllFeePayments, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPayments(response.data.payments || []);
      } else {
        setError(response.data.error || 'Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.response?.data?.error || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        API_ENDPOINTS.updateFeePaymentStatus(paymentId),
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setPayments(prev => prev.map(p => 
          p._id === paymentId ? { ...p, status: newStatus } : p
        ));
        if (selectedPayment && selectedPayment._id === paymentId) {
          setSelectedPayment({ ...selectedPayment, status: newStatus });
        }
        setShowModal(false);
      } else {
        alert(response.data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.createFeePayment,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          courseName: '',
          feeAmount: '',
          screenshot: '',
          status: 'pending'
        });
        fetchPayments();
        alert('Payment added successfully!');
      } else {
        alert(response.data.error || 'Failed to add payment');
      }
    } catch (err) {
      console.error('Error adding payment:', err);
      alert(err.response?.data?.error || 'Failed to add payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditPayment = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.updateFeePayment(selectedPayment._id),
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setSelectedPayment(null);
        fetchPayments();
        alert('Payment updated successfully!');
      } else {
        alert(response.data.error || 'Failed to update payment');
      }
    } catch (err) {
      console.error('Error updating payment:', err);
      alert(err.response?.data?.error || 'Failed to update payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        API_ENDPOINTS.deleteFeePayment(paymentId),
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        fetchPayments();
        alert('Payment deleted successfully!');
      } else {
        alert(response.data.error || 'Failed to delete payment');
      }
    } catch (err) {
      console.error('Error deleting payment:', err);
      alert(err.response?.data?.error || 'Failed to delete payment');
    }
  };

  const openEditModal = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      name: payment.name,
      email: payment.email,
      phone: payment.phone,
      courseName: payment.courseName,
      feeAmount: payment.feeAmount,
      screenshot: payment.screenshot,
      status: payment.status
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseName: '',
      feeAmount: '',
      screenshot: '',
      status: 'pending'
    });
    setShowAddModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', icon: <FiClock />, color: 'warning' },
      done: { label: 'Done', icon: <FiCheckCircle />, color: 'success' },
      rejected: { label: 'Rejected', icon: <FiXCircle />, color: 'danger' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge status-${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    done: payments.filter(p => p.status === 'done').length,
    rejected: payments.filter(p => p.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="fee-payments-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-payments-management">
      <div className="page-header">
        <div className="header-logo-container">
          <img src={techLogo} alt="Techackode Logo" className="header-tech-logo" />
        </div>
        <div className="header-content">
          <div>
            <h1>Fee Payments Management</h1>
            <p>View and manage all fee payment submissions</p>
          </div>
          <button className="btn-add" onClick={openAddModal}>
            <FiPlus /> Add Payment
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Payments</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{stats.done}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.courseName}</td>
                  <td className="amount-cell">
                    ₹{parseFloat(payment.feeAmount).toLocaleString('en-IN')}
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <div className="action-buttons-row">
                      <button
                        className="btn-view"
                        onClick={() => openPaymentDetails(payment)}
                      >
                        <FiEye /> View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(payment)}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePayment(payment._id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="payment-details-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{selectedPayment.name}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedPayment.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedPayment.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Course Name:</label>
                  <span>{selectedPayment.courseName}</span>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <span className="amount-highlight">
                    ₹{parseFloat(selectedPayment.feeAmount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedPayment.status)}</span>
                </div>
                <div className="detail-item">
                  <label>Submitted On:</label>
                  <span>
                    {new Date(selectedPayment.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {selectedPayment.screenshot && (
                <div className="screenshot-section">
                  <label>Payment Screenshot:</label>
                  <div className="screenshot-container">
                    <img
                      src={selectedPayment.screenshot}
                      alt="Payment screenshot"
                      onClick={() => window.open(selectedPayment.screenshot, '_blank')}
                    />
                    <a
                      href={selectedPayment.screenshot}
                      download
                      className="download-btn"
                    >
                      <FiDownload /> Download
                    </a>
                  </div>
                </div>
              )}

              {selectedPayment.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    className="btn-verify"
                    onClick={() => handleStatusUpdate(selectedPayment._id, 'done')}
                    disabled={updating}
                  >
                    <FiCheckCircle /> Mark as Done
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reject this payment?')) {
                        handleStatusUpdate(selectedPayment._id, 'rejected');
                      }
                    }}
                    disabled={updating}
                  >
                    <FiXCircle /> Reject Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Payment</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddPayment} className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength="10" required />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Fee Amount (₹) *</label>
                <input type="number" name="feeAmount" value={formData.feeAmount} onChange={handleInputChange} min="1" step="0.01" required />
              </div>
              <div className="form-group">
                <label>Screenshot URL</label>
                <input type="url" name="screenshot" value={formData.screenshot} onChange={handleInputChange} placeholder="Enter screenshot URL" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="action-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={updating}>
                  {updating ? 'Adding...' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {showEditModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Payment</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditPayment} className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength="10" required />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Fee Amount (₹) *</label>
                <input type="number" name="feeAmount" value={formData.feeAmount} onChange={handleInputChange} min="1" step="0.01" required />
              </div>
              <div className="form-group">
                <label>Screenshot URL</label>
                <input type="url" name="screenshot" value={formData.screenshot} onChange={handleInputChange} placeholder="Enter screenshot URL" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="action-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeePaymentsManagement;

