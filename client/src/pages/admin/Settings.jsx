import React, { useState, useEffect } from 'react';
import { FiSettings, FiSave, FiRefreshCw, FiBell, FiLock, FiMail, FiClock, FiMapPin } from 'react-icons/fi';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: 'Techackode',
    companyEmail: 'info@techackode.com',
    companyPhone: '+91 1234567890',
    companyAddress: 'Chennai, Tamil Nadu, India',
    companyWebsite: 'www.techackode.com',

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
    currencySymbol: '₹',
    taxDeduction: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setLoading(false);
      alert('Settings saved successfully!');
    }, 1000);
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
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    value={settings.companyWebsite}
                    onChange={(e) => setSettings({ ...settings, companyWebsite: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
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
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? (
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

