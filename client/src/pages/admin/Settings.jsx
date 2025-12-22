import React, { useState, useEffect } from 'react';
import { FiSettings, FiSave, FiRefreshCw, FiBell, FiLock, FiMail, FiClock, FiMapPin, FiUpload, FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isPrefixLocked, setIsPrefixLocked] = useState(false);
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: '',
    companyLogo: '',
    companyDescription: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyWebsite: '',
    companyRegistrationNumber: '',
    companyTaxId: '',
    companyFoundedYear: '',
    companySize: '1-10',
    companyIndustry: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    primaryColor: '#1c1f33',
    secondaryColor: '#94a3b8',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    currencySymbol: '₹',
    employeeIdPrefix: 'THC',

    // Attendance Settings
    checkInTime: '09:00',
    checkOutTime: '18:00',
    lateThreshold: '30', // minutes
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    
    // Office Location
    officeLatitude: '13.0827',
    officeLongitude: '80.2707',
    officeRadius: '100', // meters

    // Leave Settings
    annualLeaveQuota: '12',
    sickLeaveQuota: '12',
    casualLeaveQuota: '7',
    
    // Notification Settings
    emailNotifications: true,
    attendanceReminders: true,
    leaveApprovalNotifs: true,
    payslipNotifs: true,

    // Security Settings
    passwordMinLength: '8',
    sessionTimeout: '60', // minutes
    twoFactorAuth: false,
    
    // Payroll Settings
    salaryDay: '1', // day of month
    taxDeduction: true
  });

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCompanySettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        const data = response.data;
        setSettings({
          ...settings,
          companyName: data.companyName || '',
          companyLogo: data.companyLogo || '',
          companyDescription: data.companyDescription || '',
          companyEmail: data.companyEmail || '',
          companyPhone: data.companyPhone || '',
          companyAddress: data.companyAddress || '',
          companyWebsite: data.companyWebsite || '',
          companyRegistrationNumber: data.companyRegistrationNumber || '',
          companyTaxId: data.companyTaxId || '',
          companyFoundedYear: data.companyFoundedYear || '',
          companySize: data.companySize || '1-10',
          companyIndustry: data.companyIndustry || '',
          contactPerson: data.contactPerson || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          socialMedia: data.socialMedia || {
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: ''
          },
          primaryColor: data.primaryColor || '#1c1f33',
          secondaryColor: data.secondaryColor || '#94a3b8',
          timezone: data.timezone || 'Asia/Kolkata',
          dateFormat: data.dateFormat || 'DD/MM/YYYY',
          currency: data.currency || 'INR',
          currencySymbol: data.currencySymbol || '₹',
          employeeIdPrefix: data.employeeIdPrefix || 'THC',
          // Keep other settings
          checkInTime: settings.checkInTime,
          checkOutTime: settings.checkOutTime,
          lateThreshold: settings.lateThreshold,
          workingDays: settings.workingDays,
          officeLatitude: settings.officeLatitude,
          officeLongitude: settings.officeLongitude,
          officeRadius: settings.officeRadius,
          annualLeaveQuota: settings.annualLeaveQuota,
          sickLeaveQuota: settings.sickLeaveQuota,
          casualLeaveQuota: settings.casualLeaveQuota,
          emailNotifications: settings.emailNotifications,
          attendanceReminders: settings.attendanceReminders,
          leaveApprovalNotifs: settings.leaveApprovalNotifs,
          payslipNotifs: settings.payslipNotifs,
          passwordMinLength: settings.passwordMinLength,
          sessionTimeout: settings.sessionTimeout,
          twoFactorAuth: settings.twoFactorAuth,
          salaryDay: settings.salaryDay,
          taxDeduction: settings.taxDeduction
        });
        
        // Lock prefix if it has been saved before (check if company name exists or prefix is set)
        // This prevents changing prefix after employees have been created
        setIsPrefixLocked(!!data.companyName || !!data.employeeIdPrefix);
        
        if (data.companyLogo) {
          // Set logo preview - Cloudinary URL should be ready to use
          setLogoPreview(data.companyLogo);
          setSettings(prev => ({ ...prev, companyLogo: data.companyLogo }));
        } else {
          setLogoPreview('');
        }
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load company settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Logo must be less than 5MB'
      });
      return;
    }
    
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setSettings({ ...settings, companyLogo: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'company') {
      await saveCompanySettings();
    } else {
      // Save other settings to localStorage for now
      localStorage.setItem('appSettings', JSON.stringify(settings));
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Settings saved successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const saveCompanySettings = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add all company settings fields
      Object.keys(settings).forEach(key => {
        if (key !== 'companyLogo' && key !== 'socialMedia') {
          if (settings[key] !== undefined && settings[key] !== null) {
            formData.append(key, settings[key]);
          }
        }
      });
      
      // Add social media as JSON string
      if (settings.socialMedia) {
        formData.append('socialMedia', JSON.stringify(settings.socialMedia));
      }
      
      // Add logo file if selected
      if (logoFile) {
        formData.append('companyLogo', logoFile);
      }
      
      const response = await axios.put(API_ENDPOINTS.updateCompanySettings, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.settings) {
        const updatedSettings = response.data.settings;
        if (updatedSettings.companyLogo) {
          setLogoPreview(updatedSettings.companyLogo);
        }
        setSettings({ ...settings, companyLogo: updatedSettings.companyLogo || '' });
        
        // Lock prefix after first save to prevent changes
        setIsPrefixLocked(true);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Company settings updated successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving company settings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to save company settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('appSettings');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: <FiSettings /> },
    { id: 'attendance', label: 'Attendance', icon: <FiClock /> },
    { id: 'leave', label: 'Leave Policy', icon: <FiRefreshCw /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'payroll', label: 'Payroll', icon: <FiMail /> }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Company Settings */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                
                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="flex items-start gap-4">
                    {logoPreview && (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="Company Logo" 
                          className="w-32 h-32 object-contain border border-gray-300 rounded-lg p-2 bg-gray-50"
                          onError={(e) => {
                            console.error('Error loading logo:', logoPreview);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Logo loaded successfully:', logoPreview);
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                    <input
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.companyPhone}
                      onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="text"
                      value={settings.companyWebsite}
                      onChange={(e) => setSettings({ ...settings, companyWebsite: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea
                    value={settings.companyDescription}
                    onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Describe your company..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                    <input
                      type="text"
                      value={settings.companyRegistrationNumber}
                      onChange={(e) => setSettings({ ...settings, companyRegistrationNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={settings.companyTaxId}
                      onChange={(e) => setSettings({ ...settings, companyTaxId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                    <input
                      type="number"
                      value={settings.companyFoundedYear}
                      onChange={(e) => setSettings({ ...settings, companyFoundedYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      value={settings.companySize}
                      onChange={(e) => setSettings({ ...settings, companySize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={settings.companyIndustry}
                      onChange={(e) => setSettings({ ...settings, companyIndustry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID Prefix *
                      {isPrefixLocked && (
                        <span className="ml-2 text-xs text-orange-600 font-normal">(Locked - Cannot be changed)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={settings.employeeIdPrefix}
                      onChange={(e) => !isPrefixLocked && setSettings({ ...settings, employeeIdPrefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        isPrefixLocked ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''
                      }`}
                      placeholder="THC"
                      maxLength={10}
                      required
                      disabled={isPrefixLocked}
                      readOnly={isPrefixLocked}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {isPrefixLocked 
                        ? 'Prefix cannot be changed after initial setup to maintain consistency with existing employee IDs.'
                        : 'Prefix for employee IDs (e.g., THC001, THC002). This cannot be changed after saving.'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input
                        type="text"
                        value={settings.contactPerson}
                        onChange={(e) => setSettings({ ...settings, contactPerson: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={settings.socialMedia?.linkedin || ''}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          socialMedia: { ...settings.socialMedia, linkedin: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        value={settings.socialMedia?.twitter || ''}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                      <input
                        type="url"
                        value={settings.socialMedia?.facebook || ''}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <input
                        type="url"
                        value={settings.socialMedia?.instagram || ''}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Settings */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Attendance Configuration</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Time</label>
                    <input
                      type="time"
                      value={settings.checkInTime}
                      onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Time</label>
                    <input
                      type="time"
                      value={settings.checkOutTime}
                      onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Threshold (minutes)</label>
                  <input
                    type="number"
                    value={settings.lateThreshold}
                    onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Office Location</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={settings.officeLatitude}
                      onChange={(e) => setSettings({ ...settings, officeLatitude: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={settings.officeLongitude}
                      onChange={(e) => setSettings({ ...settings, officeLongitude: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Radius (m)"
                      value={settings.officeRadius}
                      onChange={(e) => setSettings({ ...settings, officeRadius: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set office location coordinates and check-in radius</p>
                </div>
              </div>
            )}

            {/* Leave Settings */}
            {activeTab === 'leave' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Leave Policy</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Leave</label>
                    <input
                      type="number"
                      value={settings.annualLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, annualLeaveQuota: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">days/year</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave</label>
                    <input
                      type="number"
                      value={settings.sickLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, sickLeaveQuota: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">days/year</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Casual Leave</label>
                    <input
                      type="number"
                      value={settings.casualLeaveQuota}
                      onChange={(e) => setSettings({ ...settings, casualLeaveQuota: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">days/year</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.attendanceReminders}
                    onChange={(e) => setSettings({ ...settings, attendanceReminders: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Attendance Reminders</p>
                    <p className="text-sm text-gray-600">Remind employees to mark attendance</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.leaveApprovalNotifs}
                    onChange={(e) => setSettings({ ...settings, leaveApprovalNotifs: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Leave Approval Notifications</p>
                    <p className="text-sm text-gray-600">Notify on leave status changes</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.payslipNotifs}
                    onChange={(e) => setSettings({ ...settings, payslipNotifs: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Payslip Notifications</p>
                    <p className="text-sm text-gray-600">Notify when payslip is generated</p>
                  </div>
                </label>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="6"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                </label>
              </div>
            )}

            {/* Payroll Settings */}
            {activeTab === 'payroll' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Payroll Configuration</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Payment Day</label>
                  <select
                    value={settings.salaryDay}
                    onChange={(e) => setSettings({ ...settings, salaryDay: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} of every month</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currencySymbol}
                    onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.taxDeduction}
                    onChange={(e) => setSettings({ ...settings, taxDeduction: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Tax Deduction</p>
                    <p className="text-sm text-gray-600">Enable automatic tax calculations</p>
                  </div>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t mt-8">
              <button
                type="submit"
                disabled={saving || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                <FiRefreshCw /> Reset to Default
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;

