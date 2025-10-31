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
    <div id="offer-letter-preview" className="bg-white max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif', minHeight: '297mm', width: '210mm' }}>
      {/* Professional Letterhead - Using uploaded letterhead */}
      <div className="relative">
        {/* Letterhead Image Background */}
        <div className="w-full h-auto">
          <img 
            src="/letterhead/letterhead.jpg" 
            alt="Company Letterhead" 
            className="w-full h-auto"
            onError={(e) => {
              // Fallback to gradient if image not found
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        </div>
        {/* Fallback gradient letterhead if image is not available */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 relative overflow-hidden" style={{ display: 'none' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">{letterData.companyName}</h1>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span>📧 {letterData.companyEmail || 'info@company.com'}</span>
              <span>|</span>
              <span>📞 +91 1234567890</span>
              <span>|</span>
              <span>🌐 www.company.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-12">
        <div className="text-center mb-8 border-b-2 border-blue-600 pb-4">
          <h2 className="text-3xl font-bold text-blue-800">OFFER LETTER</h2>
        </div>

        <div className="mb-6 text-right bg-blue-50 p-3 rounded">
          <p className="text-gray-700 font-semibold">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-gray-600 text-sm">Ref: {letterData.companyName.substring(0, 3).toUpperCase()}/OFF/{new Date().getFullYear()}/{Math.floor(Math.random() * 1000)}</p>
        </div>

        <div className="mb-6 border-l-4 border-blue-600 pl-4">
          <p className="text-lg font-bold text-gray-800">{letterData.candidateName}</p>
          <p className="text-gray-600 font-semibold mt-2">Subject: <span className="text-blue-700">Offer of Employment</span></p>
        </div>

        <div className="space-y-4 text-justify leading-relaxed">
          <p className="font-semibold">Dear {letterData.candidateName},</p>

          <p className="leading-7">
            We are delighted to extend an offer of employment for the position of <strong className="text-blue-700">{letterData.position}</strong> with{' '}
            <strong>{letterData.companyName}</strong> in the <strong>{letterData.department}</strong> department.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600 my-6">
            <p className="font-bold text-lg mb-3 text-blue-800">📋 Terms and Conditions of Employment</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold w-1/3">Position</td>
                  <td className="p-3">{letterData.position}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Department</td>
                  <td className="p-3">{letterData.department}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Date of Joining</td>
                  <td className="p-3">{letterData.joiningDate ? new Date(letterData.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be decided'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Work Location</td>
                  <td className="p-3">{letterData.workLocation || 'Company Office'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Reporting To</td>
                  <td className="p-3">{letterData.reportingTo || 'Reporting Manager'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Working Hours</td>
                  <td className="p-3">{letterData.workingHours}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Compensation</td>
                  <td className="p-3 font-bold text-green-700">₹{letterData.salary ? parseFloat(letterData.salary).toLocaleString('en-IN') : '0'} per month (Gross)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 bg-blue-50 font-semibold">Probation Period</td>
                  <td className="p-3">{letterData.probationPeriod}</td>
                </tr>
                <tr>
                  <td className="p-3 bg-blue-50 font-semibold">Notice Period</td>
                  <td className="p-3">{letterData.noticePeriod}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <p className="font-semibold text-green-800 mb-2">✅ Benefits Package:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Paid leaves as per company policy</li>
              <li>Medical insurance coverage</li>
              <li>Statutory benefits (PF, ESI, etc.)</li>
              <li>Performance bonuses and incentives</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 my-6">
            <p className="font-semibold text-yellow-800">⚠️ Important Note:</p>
            <p className="text-gray-700 mt-2">
              This offer is contingent upon successful completion of background verification and submission of all
              required documents.
            </p>
          </div>

          <p className="font-semibold">
            Please confirm your acceptance of this offer by signing and returning a copy of this letter by{' '}
            <span className="text-blue-700">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
          </p>

          <p className="font-semibold text-lg text-blue-800 mt-6">
            We look forward to welcoming you to our team! 🎉
          </p>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div>
            <p className="font-semibold text-gray-600">Best Regards,</p>
            <div className="mt-8 border-t-2 border-blue-600 pt-2 inline-block">
              <p className="font-bold text-lg">{letterData.signerName}</p>
              <p className="text-blue-700 font-semibold">{letterData.signerDesignation}</p>
              <p className="text-gray-600">{letterData.companyName}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
              Company<br/>Seal
            </div>
          </div>
        </div>

        <div className="mt-16 border-2 border-blue-600 rounded-lg p-6 bg-blue-50">
          <p className="font-bold text-lg mb-4 text-blue-800">📝 Candidate Acceptance</p>
          <p className="mb-4">I, <strong>{letterData.candidateName}</strong>, accept the above terms and conditions of employment.</p>
          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
              <p className="text-sm text-gray-600 font-semibold">Candidate Signature</p>
            </div>
            <div>
              <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
              <p className="text-sm text-gray-600 font-semibold">Date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mt-8 text-center text-sm">
        <p>{letterData.companyName} | Building Great Teams, Creating Better Futures</p>
        <p className="mt-1 text-blue-200">This is a computer-generated document and is valid without signature</p>
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

