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
    <div id="letter-preview" className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{letterData.companyName}</h1>
        <p className="text-gray-600">Experience Certificate</p>
      </div>

      <div className="mb-6">
        <p className="text-right text-gray-700">Date: {new Date(letterData.dateOfLeaving).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="mb-6">
        <p className="font-bold text-lg">TO WHOM IT MAY CONCERN</p>
      </div>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>
          This is to certify that <strong>{letterData.employeeName}</strong> was employed with{' '}
          <strong>{letterData.companyName}</strong> as <strong>{letterData.position}</strong> in the{' '}
          <strong>{letterData.department}</strong> department from{' '}
          <strong>{new Date(letterData.dateOfJoining).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>{' '}
          to <strong>{new Date(letterData.dateOfLeaving).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
        </p>

        <p>
          During their tenure of <strong>{letterData.duration}</strong>, {letterData.employeeName} demonstrated{' '}
          {letterData.performance === 'excellent' ? 'excellent' : letterData.performance === 'good' ? 'good' : 'satisfactory'}{' '}
          performance and professionalism.
        </p>

        {letterData.responsibilities && (
          <p>
            <strong>Key Responsibilities:</strong>
            <br />
            {letterData.responsibilities}
          </p>
        )}

        <p>
          We wish {letterData.employeeName} all the best for their future endeavors.
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

