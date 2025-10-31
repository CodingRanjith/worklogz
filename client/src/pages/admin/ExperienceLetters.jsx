import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiEye, FiUser, FiCalendar, FiAward } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const ExperienceLetters = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [letterData, setLetterData] = useState({
    employeeName: '',
    position: '',
    department: '',
    dateOfJoining: '',
    dateOfLeaving: '',
    duration: '',
    responsibilities: '',
    performance: 'excellent',
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
    setSelectedUser(user);
    const joiningDate = user.dateOfJoining ? new Date(user.dateOfJoining) : null;
    const leavingDate = new Date();
    
    let duration = '';
    if (joiningDate) {
      const years = leavingDate.getFullYear() - joiningDate.getFullYear();
      const months = leavingDate.getMonth() - joiningDate.getMonth();
      const totalMonths = years * 12 + months;
      const calcYears = Math.floor(totalMonths / 12);
      const calcMonths = totalMonths % 12;
      duration = `${calcYears} year${calcYears !== 1 ? 's' : ''} ${calcMonths} month${calcMonths !== 1 ? 's' : ''}`;
    }

    setLetterData({
      ...letterData,
      employeeName: user.name,
      position: user.position,
      department: user.department || 'N/A',
      dateOfJoining: joiningDate ? joiningDate.toISOString().split('T')[0] : '',
      dateOfLeaving: leavingDate.toISOString().split('T')[0],
      duration: duration,
      companyName: user.company || 'Techackode'
    });
  };

  const generatePDF = () => {
    const printContent = document.getElementById('letter-preview');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const LetterPreview = () => (
    <div id="letter-preview" className="bg-white max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif', minHeight: '297mm', width: '210mm' }}>
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 relative overflow-hidden" style={{ display: 'none' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">{letterData.companyName}</h1>
            <div className="flex items-center gap-4 text-sm text-green-100">
              <span>📧 info@company.com</span>
              <span>|</span>
              <span>📞 +91 1234567890</span>
              <span>|</span>
              <span>🌐 www.company.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-12">
        <div className="text-center mb-8 border-b-2 border-green-600 pb-4">
          <h2 className="text-3xl font-bold text-green-800">EXPERIENCE CERTIFICATE</h2>
        </div>

        <div className="mb-6 text-right bg-green-50 p-3 rounded">
          <p className="text-gray-700 font-semibold">Date: {new Date(letterData.dateOfLeaving).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-gray-600 text-sm">Ref: {letterData.companyName.substring(0, 3).toUpperCase()}/EXP/{new Date().getFullYear()}/{Math.floor(Math.random() * 1000)}</p>
        </div>

        <div className="mb-8 bg-green-100 border-l-4 border-green-600 p-4">
          <p className="font-bold text-2xl text-green-800">TO WHOM IT MAY CONCERN</p>
        </div>

        <div className="space-y-6 text-justify leading-relaxed">
          <div className="bg-white border-2 border-green-600 rounded-lg p-6">
            <p className="leading-7 text-gray-800">
              This is to certify that <strong className="text-green-700 text-lg">{letterData.employeeName}</strong> was employed with{' '}
              <strong>{letterData.companyName}</strong> as <strong className="text-blue-700">{letterData.position}</strong> in the{' '}
              <strong>{letterData.department}</strong> department.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 bg-green-50 font-semibold w-1/3">📅 Date of Joining</td>
                  <td className="p-4">{new Date(letterData.dateOfJoining).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 bg-green-50 font-semibold">📅 Date of Leaving</td>
                  <td className="p-4">{new Date(letterData.dateOfLeaving).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 bg-green-50 font-semibold">⏱️ Total Duration</td>
                  <td className="p-4 font-bold text-green-700">{letterData.duration}</td>
                </tr>
                <tr>
                  <td className="p-4 bg-green-50 font-semibold">⭐ Performance</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      letterData.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                      letterData.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {letterData.performance.toUpperCase()}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <p className="font-semibold text-blue-800 text-lg mb-3">💼 Professional Conduct</p>
            <p className="leading-7 text-gray-800">
              During their tenure, <strong>{letterData.employeeName}</strong> demonstrated{' '}
              {letterData.performance === 'excellent' ? 'exceptional' : letterData.performance === 'good' ? 'commendable' : 'satisfactory'}{' '}
              performance and maintained high standards of professionalism throughout their employment.
            </p>
          </div>

          {letterData.responsibilities && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <p className="font-semibold text-purple-800 text-lg mb-3">🎯 Key Responsibilities</p>
              <p className="leading-7 text-gray-800 whitespace-pre-line">{letterData.responsibilities}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-gray-800">
              We wish <strong className="text-green-700">{letterData.employeeName}</strong> all the very best for their future endeavors and continued success! 🌟
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div>
            <p className="font-semibold text-gray-600">For {letterData.companyName},</p>
            <div className="mt-8 border-t-2 border-green-600 pt-2 inline-block">
              <p className="font-bold text-lg">{letterData.signerName}</p>
              <p className="text-green-700 font-semibold">{letterData.signerDesignation}</p>
              <p className="text-gray-600">{letterData.companyName}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
              Company<br/>Seal
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p className="text-center">✓ This is a computer-generated certificate and is valid without physical signature</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 mt-8 text-center text-sm">
        <p>{letterData.companyName} | Empowering Careers, Building Excellence</p>
        <p className="mt-1 text-green-200">Issued for official purposes only</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Experience Letters</h1>
        <p className="text-gray-600">Generate experience certificates for employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Letter Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
              <select
                onChange={(e) => {
                  const user = users.find(u => u._id === e.target.value);
                  if (user) handleUserSelect(user);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an employee...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name} - {user.position}</option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
                  <input
                    type="text"
                    value={letterData.employeeName}
                    onChange={(e) => setLetterData({ ...letterData, employeeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={letterData.position}
                    onChange={(e) => setLetterData({ ...letterData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={letterData.department}
                    onChange={(e) => setLetterData({ ...letterData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                    <input
                      type="date"
                      value={letterData.dateOfJoining}
                      onChange={(e) => setLetterData({ ...letterData, dateOfJoining: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Leaving</label>
                    <input
                      type="date"
                      value={letterData.dateOfLeaving}
                      onChange={(e) => setLetterData({ ...letterData, dateOfLeaving: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating</label>
                  <select
                    value={letterData.performance}
                    onChange={(e) => setLetterData({ ...letterData, performance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="satisfactory">Satisfactory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities (Optional)</label>
                  <textarea
                    value={letterData.responsibilities}
                    onChange={(e) => setLetterData({ ...letterData, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="List key responsibilities and achievements..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FiEye /> {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    onClick={generatePDF}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <FiDownload /> Download PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {showPreview && selectedUser ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                <LetterPreview />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiFileText size={64} className="mb-4" />
              <p>Select an employee to preview the letter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceLetters;

