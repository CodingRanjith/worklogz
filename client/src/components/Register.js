import React, { useState } from 'react';
import axios from 'axios';
import {
  FiUser, FiMail, FiLock, FiBriefcase, FiHome, /* FiCalendar, */ FiPhone, FiCamera
} from 'react-icons/fi';
import { API_ENDPOINTS } from '../utils/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
      
      await axios.post(API_ENDPOINTS.register, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'User Created!',
        text: 'Employee registered successfully! Account will be activated once approved by admin side...',
        confirmButtonColor: '#8b72cc'
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.response?.data?.message || '❌ Failed to create user',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background: 'linear-gradient(135deg, #d3c9ed 0%, #fff 100%)', fontFamily: 'Poppins, sans-serif', overflow: 'hidden'}}>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/80 border rounded-3xl shadow-xl px-0 py-0 relative" style={{borderColor: '#d3c9ed', fontFamily: 'Poppins, sans-serif', zIndex: 1}}>
        {/* Left: Registration Form */}
        <div className="col-span-1 px-8 py-10 flex flex-col justify-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <h1 className="text-4xl font-extrabold tracking-wide" style={{color: '#181818', fontFamily: 'Sora, sans-serif', fontWeight: 900, letterSpacing: '1px'}}>Worklogz</h1>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2" style={{color: '#8b72cc', fontFamily: 'Sora, sans-serif'}}>Employee Registration</h2>
            <p className="text-[#181818] text-sm" style={{fontFamily: 'Poppins, sans-serif'}}>Fill in the details to create a user with a weekly schedule</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#d3c9ed] flex items-center justify-center overflow-hidden bg-[#f3f0fa]">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <FiCamera className="text-[#8b72cc] text-2xl" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#8b72cc] text-white rounded-full p-2 cursor-pointer hover:bg-[#6a56b3] transition-colors">
                  <FiCamera className="text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-[#8b72cc] font-medium">Upload Profile Picture (Optional)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={<FiUser />} label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
              <InputField icon={<FiMail />} type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" />
              <div className="relative">
                <InputField
                  icon={<FiLock />}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <span
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{position: 'absolute', right: '18px', top: '44px', cursor: 'pointer', color: '#8b72cc', fontSize: '1.2rem'}}
                >
                  {showPassword ? <FiLock /> : <FiLock />}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#181818] mb-1 flex items-center">
                  <FiPhone className="mr-2 text-[#8b72cc]" /> Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#d3c9ed] bg-[#f3f0fa] text-[#8b72cc] text-sm">+91</span>
                  <input
                    type="tel"
                    inputMode='numeric'
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    placeholder="9876543210"
                    className="w-full rounded-r-md border border-[#d3c9ed] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b72cc] focus:border-[#8b72cc] bg-white text-[#181818]"
                  />
                </div>
              </div>
              <InputField icon={<FiBriefcase />} label="Position" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Developer" />
              <div>
                <label className="block text-sm font-semibold text-[#181818] mb-1 flex items-center">
                  <FiHome className="mr-2 text-[#8b72cc]" /> Company
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-[#d3c9ed] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b72cc] focus:border-[#8b72cc] bg-white text-[#181818]"
                >
                  <option value="">Select Company</option>
                  <option value="Techackode">Techackode</option>
                  <option value="Zenaxa">Zenaxa</option>
                  <option value="ecomate">ecomate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="text-right mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 text-white text-base font-semibold rounded-lg shadow-md transition bg-[#8b72cc] hover:bg-[#6a56b3] focus:ring-2 focus:ring-[#8b72cc] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Right: Decorative/Visual Side */}
        <div className="col-span-1 flex items-center justify-center relative" style={{background: 'linear-gradient(135deg, #d3c9ed 60%, #8b72cc 100%)', borderRadius: '2rem', minHeight: '100%', height: '100%'}}>
          <div style={{width: '80%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h2 className="text-3xl font-extrabold mb-6" style={{color: '#fff', fontFamily: 'Sora, sans-serif'}}>Welcome to Worklogz</h2>
            <p className="text-lg text-[#f3f0fa] mb-8 text-center" style={{fontFamily: 'Poppins, sans-serif'}}>Register your account and start managing attendance, payroll, and worklogs with ease.</p>
            <div style={{width: '180px', height: '180px', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 16px rgba(139,114,204,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="100" height="100" rx="20" fill="#d3c9ed" />
                <path d="M40 80V70C40 65.5817 43.5817 62 48 62H72C76.4183 62 80 65.5817 80 70V80" stroke="#8b72cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="60" cy="48" r="12" stroke="#8b72cc" strokeWidth="3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, icon, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2c2e3e] mb-1 flex items-center">
        {icon && <span className="mr-2 text-[#6ca8a4]">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6ca8a4] focus:border-[#6ca8a4]"
      />
    </div>
  );
}

export default Register;
