import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiClock, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/systemAppTheme.css';

const MyEarnings = ({ embedded = false, onBack }) => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEarnings();
    fetchCreditHistory();
  }, []);

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

  const lifetimeCredits = useMemo(
    () => creditHistory.reduce((sum, item) => sum + (item.amount || 0), 0),
    [creditHistory]
  );

  const lastCredit = creditHistory[0];

  const handleBack = () => {
    if (embedded && typeof onBack === 'function') {
      onBack();
    } else {
      navigate('/attendance');
    }
  };

  if (loading) {
    return (
      <div className={embedded ? 'bg-white rounded-2xl shadow-lg p-6' : 'page-shell'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card">
          <p>Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? 'bg-white rounded-[30px] shadow-2xl p-6 space-y-6' : 'page-shell'}>
      <div className="page-header">
        <div>
          <h1>My Earnings</h1>
          <p>Track salary credits and lifetime payouts</p>
        </div>
        <button className="link" onClick={handleBack}>
          <FiArrowLeft style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Back
        </button>
      </div>

      <div className="card earnings-summary">
        <div className="metric">
          <p className="label">Total earnings</p>
          <h2>₹{(earnings?.dailyEarnings || 0).toLocaleString()}</h2>
          <p className="hint">All-time credits</p>
        </div>
        <div className="metric">
          <p className="label">Recorded credits</p>
          <h2>{creditHistory.length}</h2>
          <p className="hint">Entries on record</p>
        </div>
        <div className="metric">
          <p className="label">Lifetime credited</p>
          <h2>₹{lifetimeCredits.toLocaleString()}</h2>
          <p className="hint">
            Last credit:{' '}
            {lastCredit
              ? new Date(lastCredit.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="earnings-header">
          <h2>Credit history</h2>
          <span className="text-light">
            {creditHistory.length ? `${creditHistory.length} records` : 'No records yet'}
          </span>
        </div>
        {creditHistory.length === 0 ? (
          <div className="alert-error">
            <p style={{ margin: 0 }}>No credit history available yet. Credits added by admin will appear here.</p>
          </div>
        ) : (
          <div className="credit-list">
            {creditHistory.map((credit) => (
              <div key={credit._id} className="credit-item">
                <div className="credit-item__details">
                  <h4>
                    +₹{credit.amount.toLocaleString()} •{' '}
                    {(credit.configsApplied && credit.configsApplied[0]?.configName) || 'Manual credit'}
                  </h4>
                  {credit.configsApplied && credit.configsApplied[0]?.description && (
                    <p>{credit.configsApplied[0].description}</p>
                  )}
                </div>
                <div className="credit-item__meta">
                  <strong>
                    {new Date(credit.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </strong>
                  <span>
                    <FiClock style={{ verticalAlign: 'middle', marginRight: 4 }} />
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
    </div>
  );
};

export default MyEarnings;

