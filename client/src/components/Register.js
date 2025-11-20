import React, { useState } from 'react';
import axios from 'axios';
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
  FiHome,
  FiPhone,
  FiCamera,
} from 'react-icons/fi';
import { API_ENDPOINTS } from '../utils/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/m365Theme.css';
import '../styles/auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    company: '',
    profilePic: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });
      
      const response = await axios.post(API_ENDPOINTS.register, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `
            <div class="text-center">
              <p class="mb-2">Employee registered successfully!</p>
              <p class="text-sm text-gray-600">Your account will be activated once approved by admin.</p>
              <p class="text-sm text-gray-600 mt-2">Redirecting to login page...</p>
            </div>
          `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          company: '',
          profilePic: null
        });
        setPreviewImage(null);
        
        // Navigate to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your internet connection.';
      }

      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        html: `
          <div class="text-center">
            <p class="text-red-600">${errorMessage}</p>
            <p class="text-sm text-gray-600 mt-2">Please try again or contact support if the problem persists.</p>
          </div>
        `,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-tabs">
        <button className="is-active" type="button">Getting started</button>
        <button type="button">Pricing</button>
        <button type="button">Docs</button>
      </div>
      <div className="auth-main">
        <section className="auth-hero">
          <div className="auth-eyebrow">Employee onboarding</div>
          <h1>Create an account, unlock your new HQ</h1>
          <p>
            One streamlined workspace for attendance, payroll, approvals, and project goals —
            crafted with a calm, premium aesthetic.
          </p>
          <div className="auth-highlight-grid">
            <div className="auth-highlight-card">
              <h4>Teams ready</h4>
              <strong>15 minutes</strong>
              <span>Average setup</span>
            </div>
            <div className="auth-highlight-card">
              <h4>Security</h4>
              <strong>ISO 27001</strong>
              <span>Enterprise grade</span>
            </div>
            <div className="auth-highlight-card">
              <h4>Productivity</h4>
              <strong>+37%</strong>
              <span>Employee engagement</span>
            </div>
          </div>
          <div className="auth-highlight-card" style={{ marginTop: '1rem' }}>
            <h4>Customer stories</h4>
            <p style={{ margin: 0, color: 'var(--auth-muted)' }}>
              “Worklogz helped us centralize time tracking for 600+ people across continents.”
            </p>
          </div>
        </section>

        <section className="auth-form-card">
          <div>
            <h2>Employee registration</h2>
            <p style={{ color: 'var(--auth-muted)' }}>Fill in details to request access</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-avatar-upload">
              <div className="auth-avatar">
                {previewImage ? (
                  <img src={previewImage} alt="Profile preview" />
                ) : (
                  <FiCamera size={28} color="#7c3aed" />
                )}
              </div>
              <label className="auth-submit" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}>
                Upload photo
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--auth-muted)', margin: 0 }}>
                Optional – PNG or JPG under 2MB
              </p>
            </div>

            <div className="auth-register-grid">
              <InputField icon={<FiUser />} label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
              <InputField icon={<FiMail />} label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@company.com" />
            </div>

            <div className="auth-register-grid">
              <div style={{ position: 'relative' }}>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2c2e3e] mb-1">
                  <FiLock />
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '2.35rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#7c3aed',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2c2e3e] mb-1">
                  <FiPhone className="text-[#7c3aed]" /> Phone number
                </label>
                <div className="auth-phone-group">
                  <span>+91</span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-register-grid">
              <InputField icon={<FiBriefcase />} label="Position" name="position" value={formData.position} onChange={handleChange} placeholder="Senior Developer" />
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#2c2e3e] mb-1">
                  <FiHome className="text-[#7c3aed]" /> Company
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="auth-input"
                  required
                >
                  <option value="">Select company</option>
                  <option value="Techackode">Techackode</option>
                  <option value="Zenaxa">Zenaxa</option>
                  <option value="ecomate">ecomate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            Already registered? <a href="/login">Sign in</a>
          </div>
        </section>
      </div>
    </div>
  );
}

function InputField({ label, icon, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-[#2c2e3e] mb-1">
        {icon}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="auth-input"
      />
    </div>
  );
}

export default Register;