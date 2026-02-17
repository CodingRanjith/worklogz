import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiClock, FiArrowLeft, FiTrendingUp, FiCreditCard, FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle, FiSend } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import './MyEarnings.css';

const MyEarnings = ({ embedded = false, onBack }) => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [creditHistory, setCreditHistory] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credits'); // 'credits' or 'payouts'
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchMyEarnings();
    fetchCreditHistory();
    fetchPayouts();
  }, []);

  useEffect(() => {
    if (activeTab === 'payouts') {
      fetchPayouts();
    }
  }, [payoutStatusFilter]);

  const fetchMyEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEarnings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      Swal.fire('Error', 'Failed to load earnings data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyCreditHistory, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCreditHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching credit history:', error);
    }
  };

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (payoutStatusFilter !== 'all') {
        params.status = payoutStatusFilter;
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
    }
  };

  const lifetimeCredits = useMemo(
    () => creditHistory.reduce((sum, item) => sum + (item.amount || 0), 0),
    [creditHistory]
  );

  const lastCredit = creditHistory[0];

  const payoutTotalAmount = useMemo(
    () => payouts.reduce((sum, payout) => sum + (payout.amount || 0), 0),
    [payouts]
  );

  const payoutCompletedAmount = useMemo(
    () => payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, payout) => sum + (payout.amount || 0), 0),
    [payouts]
  );

  const getPayoutStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', label: 'Pending', icon: <FiClock /> },
      processing: { class: 'status-processing', label: 'Processing', icon: <FiAlertCircle /> },
      completed: { class: 'status-completed', label: 'Completed', icon: <FiCheckCircle /> },
      failed: { class: 'status-failed', label: 'Failed', icon: <FiXCircle /> },
      cancelled: { class: 'status-cancelled', label: 'Cancelled', icon: <FiXCircle /> }
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

  const handleRequestPayout = async () => {
    if (!requestAmount || parseFloat(requestAmount) <= 0) {
      Swal.fire('Error', 'Please enter a valid amount', 'error');
      return;
    }

    const amount = parseFloat(requestAmount);
    const availableEarnings = earnings?.dailyEarnings || 0;

    if (amount > availableEarnings) {
      Swal.fire('Error', `Insufficient earnings. Available: ₹${availableEarnings.toLocaleString('en-IN')}`, 'error');
      return;
    }

    try {
      setRequesting(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.requestPayout,
        {
          amount,
          description: requestDescription || 'Payout request from user',
          requestNotes: requestDescription
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Swal.fire('Success', 'Payout request submitted successfully!', 'success');
        setShowRequestModal(false);
        setRequestAmount('');
        setRequestDescription('');
        fetchPayouts();
        fetchMyEarnings(); // Refresh earnings
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Failed to submit payout request', 'error');
    } finally {
      setRequesting(false);
    }
  };

  const handleBack = () => {
    if (embedded && typeof onBack === 'function') {
      onBack();
    } else {
      navigate('/attendance');
    }
  };

  if (loading) {
    return (
      <div className={embedded ? 'bg-white rounded-2xl shadow-lg p-6' : 'my-earnings-page'}>
        <div className={embedded ? '' : 'my-earnings-container'}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading earnings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? 'bg-white rounded-[30px] shadow-2xl p-6 space-y-6' : 'my-earnings-page'}>
      <div className={embedded ? '' : 'my-earnings-container'}>
        {/* Header */}
        <div className="earnings-page-header">
          <div>
            <h1>My Earnings</h1>
            <p>Track salary credits and lifetime payouts</p>
          </div>
          <div className="header-actions">
            {(earnings?.dailyEarnings || 0) > 0 && (
              <button
                className="request-payout-header-btn"
                onClick={() => {
                  setRequestAmount('');
                  setRequestDescription('');
                  setShowRequestModal(true);
                }}
              >
                <FiSend />
                Request Payout
              </button>
            )}
            <button className="back-button" onClick={handleBack}>
              <FiArrowLeft />
              Back
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="earnings-summary-grid">
          <div className="summary-card primary">
            <div className="summary-card-icon">
              <FiDollarSign />
            </div>
            <p className="summary-label">Total Earnings</p>
            <h2 className="summary-value">₹{(earnings?.dailyEarnings || 0).toLocaleString('en-IN')}</h2>
            <p className="summary-hint">All-time credits</p>
            {(earnings?.dailyEarnings || 0) > 0 && (
              <button
                className="request-payout-btn"
                onClick={() => {
                  setRequestAmount('');
                  setRequestDescription('');
                  setShowRequestModal(true);
                }}
              >
                <FiSend />
                Request Payout
              </button>
            )}
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <FiCreditCard />
            </div>
            <p className="summary-label">Recorded Credits</p>
            <h2 className="summary-value">{creditHistory.length}</h2>
            <p className="summary-hint">Entries on record</p>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon">
              <FiTrendingUp />
            </div>
            <p className="summary-label">Lifetime Credited</p>
            <h2 className="summary-value">₹{lifetimeCredits.toLocaleString('en-IN')}</h2>
            <p className="summary-hint">
              {lastCredit
                ? `Last credit: ${new Date(lastCredit.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`
                : 'No credits yet'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-section">
          <button
            className={`tab-button ${activeTab === 'credits' ? 'active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            <FiCreditCard />
            Credit History
          </button>
          <button
            className={`tab-button ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            <FiDollarSign />
            Payouts
          </button>
        </div>

        {/* Credit History Section */}
        {activeTab === 'credits' && (
          <div className="credit-history-section">
            <div className="section-header">
              <h2>
                <FiCalendar />
                Credit History
              </h2>
              <span className="record-count">
                {creditHistory.length ? `${creditHistory.length} records` : 'No records yet'}
              </span>
            </div>

            {creditHistory.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FiDollarSign />
                </div>
                <h3>No Credit History</h3>
                <p>No credit history available yet. Credits added by admin will appear here.</p>
              </div>
            ) : (
              <div className="credit-list">
                {creditHistory.map((credit) => (
                  <div key={credit._id} className="credit-item">
                    <div className="credit-item-details">
                      <h3 className="credit-amount">₹{credit.amount.toLocaleString('en-IN')}</h3>
                      <p className="credit-type">
                        {(credit.configsApplied && credit.configsApplied[0]?.configName) || 'Manual credit'}
                      </p>
                      {credit.configsApplied && credit.configsApplied[0]?.description && (
                        <p className="credit-description">{credit.configsApplied[0].description}</p>
                      )}
                    </div>
                    <div className="credit-meta">
                      <span className="credit-date">
                        {new Date(credit.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="credit-time">
                        <FiClock />
                        {new Date(credit.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payouts Section */}
        {activeTab === 'payouts' && (
          <div className="payouts-section">
            <div className="section-header">
              <h2>
                <FiDollarSign />
                My Payouts
              </h2>
              <div className="header-actions">
                <select
                  className="status-filter"
                  value={payoutStatusFilter}
                  onChange={(e) => setPayoutStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="record-count">
                  {payouts.length ? `${payouts.length} records` : 'No records yet'}
                </span>
              </div>
            </div>

            {/* Payout Summary Cards */}
            <div className="payout-summary-cards">
              <div className="payout-summary-card">
                <p className="summary-label">Total Payouts</p>
                <h3 className="summary-value">₹{payoutTotalAmount.toLocaleString('en-IN')}</h3>
              </div>
              <div className="payout-summary-card">
                <p className="summary-label">Completed</p>
                <h3 className="summary-value">₹{payoutCompletedAmount.toLocaleString('en-IN')}</h3>
              </div>
              <div className="payout-summary-card">
                <p className="summary-label">Total Transactions</p>
                <h3 className="summary-value">{payouts.length}</h3>
              </div>
            </div>

            {payouts.length === 0 ? (
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
                  const statusBadge = getPayoutStatusBadge(payout.status);
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
                          <p className="payout-date">{formatDateTime(payout.payoutTime)}</p>
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
        )}
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
                <span className={`status-badge ${getPayoutStatusBadge(selectedPayout.status).class}`}>
                  {getPayoutStatusBadge(selectedPayout.status).icon}
                  {getPayoutStatusBadge(selectedPayout.status).label}
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

      {/* Request Payout Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Payout</h2>
              <button className="close-btn" onClick={() => setShowRequestModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Available Earnings</label>
                <div className="available-earnings-display">
                  ₹{(earnings?.dailyEarnings || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="form-group">
                <label>Request Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={earnings?.dailyEarnings || 0}
                  min="0"
                />
                <small className="form-hint">
                  Maximum: ₹{(earnings?.dailyEarnings || 0).toLocaleString('en-IN')}
                </small>
              </div>
              <div className="form-group">
                <label>Description / Notes</label>
                <textarea
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Optional: Add any notes or description"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowRequestModal(false)}
                disabled={requesting}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleRequestPayout}
                disabled={requesting || !requestAmount || parseFloat(requestAmount) <= 0}
              >
                {requesting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEarnings;

