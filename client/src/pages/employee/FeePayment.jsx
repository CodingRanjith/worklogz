import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiCheckCircle, FiX, FiCreditCard, FiClock, FiEye } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import techLogo from '../../assets/tech.png';
import './FeePayment.css';

const FeePayment = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Payment Details, 3: Upload Screenshot, 4: Success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseName: '',
    feeAmount: ''
  });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [myPayments, setMyPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // GPay UPI ID - This should be configurable from admin settings
  const GPayUPI = 'ranjith.c96me-3@okaxis';

  // Fetch my payments
  useEffect(() => {
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    try {
      setLoadingPayments(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyFeePayments, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMyPayments(response.data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.courseName || !formData.feeAmount) {
      setError('Please fill all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (isNaN(formData.feeAmount) || parseFloat(formData.feeAmount) <= 0) {
      setError('Please enter a valid fee amount');
      return;
    }
    
    setError('');
    setStep(2); // Move to payment details step
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('courseName', formData.courseName);
      formDataToSend.append('feeAmount', formData.feeAmount);
      formDataToSend.append('screenshot', screenshot);
      
      const response = await axios.post(
        API_ENDPOINTS.submitFeePayment,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setStep(4); // Show success message
        fetchMyPayments(); // Refresh payments list
      } else {
        setError(response.data.error || 'Failed to submit payment');
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit payment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseName: '',
      feeAmount: ''
    });
    setScreenshot(null);
    setScreenshotPreview(null);
    setError('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', icon: <FiClock />, color: 'warning' },
      done: { label: 'Done', icon: <FiCheckCircle />, color: 'success' },
      rejected: { label: 'Rejected', icon: <FiX />, color: 'danger' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge status-${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="fee-payment-container">
      <div className="fee-payment-wrapper">
        <div className="fee-payment-card">
        <div className="fee-payment-header">
          <div className="logo-container">
            <img src={techLogo} alt="Techackode Logo" className="tech-logo" />
          </div>
          <h1>Techackode Edutech Fee Payment</h1>
          <p>Complete your fee payment securely</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Details</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Upload</div>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Complete</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FiX /> {error}
          </div>
        )}

        {/* Step 1: Form */}
        {step === 1 && (
          <form onSubmit={handleFormSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseName">Course Name *</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="feeAmount">Fee Amount (₹) *</label>
              <input
                type="number"
                id="feeAmount"
                name="feeAmount"
                value={formData.feeAmount}
                onChange={handleInputChange}
                placeholder="Enter fee amount"
                min="1"
                step="0.01"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Continue to Payment
            </button>
          </form>
        )}

        {/* Step 2: Payment Details */}
        {step === 2 && (
          <div className="payment-details-step">
            <div className="gpay-section">
              <div className="gpay-logo">
                <FiCreditCard className="gpay-icon" />
                <h2>Google Pay</h2>
              </div>
              
              <div className="upi-details">
                <p className="upi-label">Send payment to UPI ID:</p>
                <div className="upi-id-box">
                  <span className="upi-id">{GPayUPI}</span>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(GPayUPI);
                      alert('UPI ID copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="amount-display">
                <p>Amount to Pay:</p>
                <h3>₹{parseFloat(formData.feeAmount).toLocaleString('en-IN')}</h3>
              </div>

              <div className="payment-instructions">
                <h4>Payment Instructions:</h4>
                <ol>
                  <li>Open Google Pay on your phone</li>
                  <li>Enter the UPI ID: <strong>{GPayUPI}</strong></li>
                  <li>Enter the amount: <strong>₹{formData.feeAmount}</strong></li>
                  <li>Complete the payment</li>
                  <li>Take a screenshot of the payment confirmation</li>
                </ol>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-secondary">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary">
                  I've Made the Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Upload Screenshot */}
        {step === 3 && (
          <form onSubmit={handlePaymentSubmit} className="upload-step">
            <div className="upload-section">
              <h3>Upload Payment Screenshot</h3>
              <p>Please upload a clear screenshot of your payment confirmation</p>
              
              <div className="upload-area">
                {screenshotPreview ? (
                  <div className="preview-container">
                    <img src={screenshotPreview} alt="Screenshot preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setScreenshot(null);
                        setScreenshotPreview(null);
                      }}
                    >
                      <FiX /> Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="screenshot-upload" className="upload-label">
                    <FiUpload className="upload-icon" />
                    <span>Click to upload or drag and drop</span>
                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      id="screenshot-upload"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-secondary">
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!screenshot || uploading}
                >
                  {uploading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="success-step">
            <div className="success-icon">
              <FiCheckCircle />
            </div>
            <h2>Payment Submitted Successfully!</h2>
            <p className="success-message">
              Your payment has been submitted. The Techackode Edutech team will verify your payment shortly.
            </p>
            {screenshotPreview && (
              <div className="submitted-screenshot">
                <p>Submitted Screenshot:</p>
                <img src={screenshotPreview} alt="Submitted screenshot" />
              </div>
            )}
            <div className="payment-summary">
              <h4>Payment Summary:</h4>
              <div className="summary-item">
                <span>Name:</span>
                <span>{formData.name}</span>
              </div>
              <div className="summary-item">
                <span>Email:</span>
                <span>{formData.email}</span>
              </div>
              <div className="summary-item">
                <span>Phone:</span>
                <span>{formData.phone}</span>
              </div>
              <div className="summary-item">
                <span>Course Name:</span>
                <span>{formData.courseName}</span>
              </div>
              <div className="summary-item">
                <span>Amount:</span>
                <span>₹{parseFloat(formData.feeAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={handleReset} className="btn-primary">
              Make Another Payment
            </button>
          </div>
        )}
        </div>

        {/* My Payments Table */}
        <div className="my-payments-section">
        <div className="payments-table-card">
          <h2>My Payment Submissions</h2>
          {loadingPayments ? (
            <div className="loading-payments">Loading payments...</div>
          ) : myPayments.length === 0 ? (
            <div className="no-payments">No payments submitted yet</div>
          ) : (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>{payment.courseName}</td>
                    <td className="amount-cell">
                      ₹{parseFloat(payment.feeAmount).toLocaleString('en-IN')}
                    </td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td>
                      <button
                        className="btn-view-small"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default FeePayment;

