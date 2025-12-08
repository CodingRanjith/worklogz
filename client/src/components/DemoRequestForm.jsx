import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../utils/api';
import { FiX, FiSend, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar, FiClock, FiMessageSquare, FiGrid, FiTag } from 'react-icons/fi';
import './DemoRequestForm.css';

const DemoRequestForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    whiteLabel: false,
    worklogzModules: [],
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModuleChange = (module) => {
    setFormData(prev => ({
      ...prev,
      worklogzModules: prev.worklogzModules.includes(module)
        ? prev.worklogzModules.filter(m => m !== module)
        : [...prev.worklogzModules, module]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter your name'
      });
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter your email'
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid email address'
      });
      return false;
    }
    if (!formData.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter your phone number'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(API_ENDPOINTS.requestDemo, formData);

      Swal.fire({
        icon: 'success',
        title: 'Demo Request Submitted!',
        html: `
          <p>Thank you for your interest in Worklogz!</p>
          <p>We've received your demo request and our team will contact you soon.</p>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            Check your email (${formData.email}) for confirmation.
          </p>
        `,
        confirmButtonText: 'Great!',
        confirmButtonColor: '#6366f1'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        whiteLabel: false,
        worklogzModules: [],
        message: '',
        preferredDate: '',
        preferredTime: ''
      });

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Demo request error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Failed to submit demo request. Please try again later.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="demo-form-overlay" onClick={onClose}>
      <div className="demo-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="demo-form-header">
          <div>
            <h2 className="demo-form-title">Request a Demo</h2>
            <p className="demo-form-subtitle">See Worklogz in action. Schedule your personalized demo today!</p>
          </div>
          <button className="demo-form-close" onClick={onClose} aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="demo-form">
          <div className="demo-form-group">
            <label htmlFor="name" className="demo-form-label">
              <FiUser className="demo-form-icon" />
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="demo-form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="demo-form-group">
            <label htmlFor="email" className="demo-form-label">
              <FiMail className="demo-form-icon" />
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="demo-form-input"
              placeholder="your.email@company.com"
              required
            />
          </div>

          <div className="demo-form-group">
            <label htmlFor="phone" className="demo-form-label">
              <FiPhone className="demo-form-icon" />
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="demo-form-input"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="demo-form-group">
            <label htmlFor="company" className="demo-form-label">
              <FiBriefcase className="demo-form-icon" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="demo-form-input"
              placeholder="Your company name (optional)"
            />
          </div>

          <div className="demo-form-group">
            <label htmlFor="category" className="demo-form-label">
              <FiTag className="demo-form-icon" />
              Category / Interest <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="demo-form-input"
              required
            >
              <option value="">Select a category</option>
              <option value="white-label">White Label Solution</option>
              <option value="full-suite">Full Worklogz Suite</option>
              <option value="custom-solution">Custom Solution</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="demo-form-group">
            <label className="demo-form-label">
              <FiGrid className="demo-form-icon" />
              Worklogz Modules of Interest
            </label>
            <div className="demo-form-checkboxes">
              {[
                'Attendance Tracking',
                'Payroll & Salary',
                'Leave Management',
                'Task Manager',
                'Performance Management',
                'Document Management',
                'Team Collaboration',
                'Analytics & Reports',
                'CRM Integration',
                'Helpdesk System'
              ].map((module) => (
                <label key={module} className="demo-form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.worklogzModules.includes(module)}
                    onChange={() => handleModuleChange(module)}
                    className="demo-form-checkbox"
                  />
                  <span>{module}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="demo-form-group">
            <label className="demo-form-label">
              <input
                type="checkbox"
                name="whiteLabel"
                checked={formData.whiteLabel}
                onChange={handleChange}
                className="demo-form-checkbox"
                style={{ marginRight: '8px' }}
              />
              <span>Interested in White Label Solution</span>
            </label>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              Get Worklogz branded with your company's logo and colors
            </p>
          </div>

          <div className="demo-form-row">
            <div className="demo-form-group">
              <label htmlFor="preferredDate" className="demo-form-label">
                <FiCalendar className="demo-form-icon" />
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="demo-form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="demo-form-group">
              <label htmlFor="preferredTime" className="demo-form-label">
                <FiClock className="demo-form-icon" />
                Preferred Time
              </label>
              <input
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="demo-form-input"
              />
            </div>
          </div>

          <div className="demo-form-group">
            <label htmlFor="message" className="demo-form-label">
              <FiMessageSquare className="demo-form-icon" />
              Additional Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="demo-form-textarea"
              placeholder="Tell us about your specific needs or questions..."
              rows="4"
            />
          </div>

          <div className="demo-form-footer">
            <button
              type="button"
              onClick={onClose}
              className="demo-form-button demo-form-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="demo-form-button demo-form-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="demo-form-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="demo-form-button-icon" />
                  Request Demo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoRequestForm;

