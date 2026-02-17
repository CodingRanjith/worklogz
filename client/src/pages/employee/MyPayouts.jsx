import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiClock, FiArrowLeft, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import './MyPayouts.css';

const MyPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayouts();
  }, [statusFilter]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await axios.get(API_ENDPOINTS.getMyPayouts, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });
      
      if (response.data.success) {
        setPayouts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      Swal.fire('Error', 'Failed to load payouts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', label: 'Pending', icon: <FiClock /> },
      processing: { class: 'status-processing', label: 'Processing', icon: <FiAlertCircle /> },
      completed: { class: 'status-completed', label: 'Completed', icon: <FiCheckCircle /> },
      failed: { class: 'status-failed', label: 'Failed', icon: <FiXCircle /> },
      cancelled: { class: 'status-cancelled', label: 'Cancelled', icon: <FiXCircle /> }
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

  const totalAmount = payouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
  const completedAmount = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, payout) => sum + (payout.amount || 0), 0);

  return (
    <div className="my-payouts-page">
      <div className="my-payouts-container">
        {/* Header */}
        <div className="payouts-page-header">
          <div>
            <h1>My Payouts</h1>
            <p>View your payout history and transaction details</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="payouts-summary-grid">
          <div className="summary-card primary">
            <div className="summary-card-icon">
              <FiDollarSign />
            </div>
            <p className="summary-label">Total Payouts</p>
            <h2 className="summary-value">₹{totalAmount.toLocaleString('en-IN')}</h2>
            <p className="summary-hint">All time payouts</p>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <FiCheckCircle />
            </div>
            <p className="summary-label">Completed</p>
            <h2 className="summary-value">₹{completedAmount.toLocaleString('en-IN')}</h2>
            <p className="summary-hint">Successfully processed</p>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <FiClock />
            </div>
            <p className="summary-label">Total Transactions</p>
            <h2 className="summary-value">{payouts.length}</h2>
            <p className="summary-hint">All payout records</p>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payouts List */}
        <div className="payouts-list-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading payouts...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiDollarSign />
              </div>
              <h3>No Payouts Found</h3>
              <p>You don't have any payouts yet. Payouts will appear here once they are created by admin.</p>
            </div>
          ) : (
            <div className="payouts-list">
              {payouts.map(payout => {
                const statusBadge = getStatusBadge(payout.status);
                return (
                  <div
                    key={payout._id}
                    className="payout-item"
                    onClick={() => setSelectedPayout(payout)}
                  >
                    <div className="payout-item-main">
                      <div className="payout-amount-section">
                        <h3 className="payout-amount">₹{payout.amount?.toLocaleString('en-IN')}</h3>
                        <p className="transaction-id">TXN: {payout.transactionId}</p>
                      </div>
                      <div className="payout-status-section">
                        <span className={`status-badge ${statusBadge.class}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                        <p className="payout-date">{formatDate(payout.payoutTime)}</p>
                      </div>
                    </div>
                    {payout.description && (
                      <p className="payout-description">{payout.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payout Detail Modal */}
      {selectedPayout && (
        <div className="modal-overlay" onClick={() => setSelectedPayout(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payout Details</h2>
              <button className="close-btn" onClick={() => setSelectedPayout(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Transaction ID:</span>
                <span className="detail-value transaction-id">{selectedPayout.transactionId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value amount">₹{selectedPayout.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusBadge(selectedPayout.status).class}`}>
                  {getStatusBadge(selectedPayout.status).icon}
                  {getStatusBadge(selectedPayout.status).label}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payout Time:</span>
                <span className="detail-value">{formatDateTime(selectedPayout.payoutTime)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">
                  {selectedPayout.paymentMethod?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              {selectedPayout.description && (
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedPayout.description}</span>
                </div>
              )}
              {selectedPayout.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">{selectedPayout.notes}</span>
                </div>
              )}
              {selectedPayout.processedAt && (
                <div className="detail-row">
                  <span className="detail-label">Processed At:</span>
                  <span className="detail-value">{formatDateTime(selectedPayout.processedAt)}</span>
                </div>
              )}
              {selectedPayout.failureReason && (
                <div className="detail-row">
                  <span className="detail-label">Failure Reason:</span>
                  <span className="detail-value error">{selectedPayout.failureReason}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setSelectedPayout(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPayouts;
