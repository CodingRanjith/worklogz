import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiEye, FiMail, FiDollarSign } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const OfferLetters = () => {
  const [users, setUsers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [letterData, setLetterData] = useState({
    candidateName: '',
    position: '',
    department: '',
    salary: '',
    joiningDate: '',
    workLocation: '',
    reportingTo: '',
    workingHours: '9:00 AM - 6:00 PM',
    probationPeriod: '3 months',
    noticePeriod: '30 days',
    companyName: 'Techackode',
    signerName: 'HR Manager',
    signerDesignation: 'Human Resources'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUsers, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (user) => {
    setLetterData({
      ...letterData,
      candidateName: user.name,
      position: user.position,
      department: user.department || '',
      salary: user.salary || '',
      companyName: user.company || 'Techackode'
    });
  };

  const generatePDF = () => {
    const printContent = document.getElementById('offer-letter-preview');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const OfferLetterPreview = () => (
    <div id="offer-letter-preview" className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{letterData.companyName}</h1>
        <p className="text-gray-600">Offer Letter</p>
      </div>

      <div className="mb-6">
        <p className="text-right text-gray-700">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="mb-6">
        <p><strong>{letterData.candidateName}</strong></p>
        <p className="text-gray-700">Subject: Offer of Employment</p>
      </div>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>Dear {letterData.candidateName},</p>

        <p>
          We are pleased to offer you the position of <strong>{letterData.position}</strong> with{' '}
          <strong>{letterData.companyName}</strong> in the <strong>{letterData.department}</strong> department.
        </p>

        <p><strong>Terms and Conditions of Employment:</strong></p>

        <div className="ml-6 space-y-2">
          <p><strong>1. Position:</strong> {letterData.position}</p>
          <p><strong>2. Department:</strong> {letterData.department}</p>
          <p><strong>3. Date of Joining:</strong> {letterData.joiningDate ? new Date(letterData.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be decided'}</p>
          <p><strong>4. Work Location:</strong> {letterData.workLocation || 'Company Office'}</p>
          <p><strong>5. Reporting To:</strong> {letterData.reportingTo || 'Reporting Manager'}</p>
          <p><strong>6. Working Hours:</strong> {letterData.workingHours}</p>
          <p><strong>7. Compensation:</strong> ₹{letterData.salary ? parseFloat(letterData.salary).toLocaleString('en-IN') : '0'} per month (Gross)</p>
          <p><strong>8. Probation Period:</strong> {letterData.probationPeriod}</p>
          <p><strong>9. Notice Period:</strong> {letterData.noticePeriod}</p>
        </div>

        <p>
          <strong>Benefits:</strong> You will be eligible for benefits as per company policy, including paid leaves,
          medical insurance, and other statutory benefits.
        </p>

        <p>
          This offer is contingent upon successful completion of background verification and submission of all
          required documents.
        </p>

        <p>
          Please confirm your acceptance of this offer by signing and returning a copy of this letter by{' '}
          {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>

        <p>
          We look forward to welcoming you to our team!
        </p>
      </div>

      <div className="mt-12">
        <p className="font-semibold">Sincerely,</p>
        <div className="mt-8">
          <p className="font-semibold">{letterData.signerName}</p>
          <p className="text-gray-600">{letterData.signerDesignation}</p>
          <p className="text-gray-600">{letterData.companyName}</p>
        </div>
      </div>

      <div className="mt-16 border-t pt-8">
        <p className="font-semibold mb-4">Acceptance:</p>
        <p>I, {letterData.candidateName}, accept the above terms and conditions of employment.</p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="border-b border-gray-400 inline-block pb-1 min-w-[200px]"></p>
            <p className="text-sm text-gray-600 mt-1">Signature</p>
          </div>
          <div>
            <p className="border-b border-gray-400 inline-block pb-1 min-w-[200px]"></p>
            <p className="text-sm text-gray-600 mt-1">Date</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Offer Letters</h1>
        <p className="text-gray-600">Generate employment offer letters for candidates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Offer Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User (Optional)</label>
              <select
                onChange={(e) => {
                  const user = users.find(u => u._id === e.target.value);
                  if (user) handleUserSelect(user);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Manual entry or choose existing user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name} - {user.position}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name *</label>
              <input
                type="text"
                required
                value={letterData.candidateName}
                onChange={(e) => setLetterData({ ...letterData, candidateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
              <input
                type="text"
                required
                value={letterData.position}
                onChange={(e) => setLetterData({ ...letterData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                required
                value={letterData.department}
                onChange={(e) => setLetterData({ ...letterData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary (₹) *</label>
              <input
                type="number"
                required
                value={letterData.salary}
                onChange={(e) => setLetterData({ ...letterData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date *</label>
              <input
                type="date"
                required
                value={letterData.joiningDate}
                onChange={(e) => setLetterData({ ...letterData, joiningDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
              <input
                type="text"
                value={letterData.workLocation}
                onChange={(e) => setLetterData({ ...letterData, workLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Chennai Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reporting To</label>
              <input
                type="text"
                value={letterData.reportingTo}
                onChange={(e) => setLetterData({ ...letterData, reportingTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engineering Manager"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period</label>
                <select
                  value={letterData.probationPeriod}
                  onChange={(e) => setLetterData({ ...letterData, probationPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
                <select
                  value={letterData.noticePeriod}
                  onChange={(e) => setLetterData({ ...letterData, noticePeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                disabled={!letterData.candidateName || !letterData.position}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <FiEye /> {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={generatePDF}
                disabled={!letterData.candidateName || !letterData.position}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {showPreview ? (
            <div className="border border-gray-300 rounded-lg overflow-auto max-h-[800px]">
              <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                <OfferLetterPreview />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiFileText size={64} className="mb-4" />
              <p>Fill in the details to preview the offer letter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferLetters;

