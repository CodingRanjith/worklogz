import React, { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiEye, FiCheckCircle } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const RelievingLetters = () => {
  const [users, setUsers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [letterData, setLetterData] = useState({
    employeeName: '',
    employeeId: '',
    position: '',
    department: '',
    dateOfJoining: '',
    lastWorkingDay: '',
    reason: 'resignation',
    noticePeriod: 'served',
    pendingDues: 'cleared',
    companyProperty: 'returned',
    performanceRemarks: 'good',
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
    const joiningDate = user.dateOfJoining ? new Date(user.dateOfJoining).toISOString().split('T')[0] : '';
    
    setLetterData({
      ...letterData,
      employeeName: user.name,
      employeeId: user._id.substring(0, 8).toUpperCase(),
      position: user.position,
      department: user.department || 'N/A',
      dateOfJoining: joiningDate,
      companyName: user.company || 'Techackode'
    });
  };

  const generatePDF = () => {
    const printContent = document.getElementById('relieving-letter-preview');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const RelievingLetterPreview = () => (
    <div id="relieving-letter-preview" className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{letterData.companyName}</h1>
        <p className="text-gray-600">Relieving Letter</p>
      </div>

      <div className="mb-6">
        <p className="text-right text-gray-700">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="mb-6">
        <p className="font-bold text-lg">TO WHOM IT MAY CONCERN</p>
      </div>

      <div className="space-y-4 text-justify leading-relaxed">
        <p>
          This is to certify that <strong>{letterData.employeeName}</strong>{' '}
          (Employee ID: <strong>{letterData.employeeId}</strong>) was employed with{' '}
          <strong>{letterData.companyName}</strong> as <strong>{letterData.position}</strong> in the{' '}
          <strong>{letterData.department}</strong> department.
        </p>

        <p>
          <strong>{letterData.employeeName}</strong> joined our organization on{' '}
          <strong>{letterData.dateOfJoining ? new Date(letterData.dateOfJoining).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</strong>{' '}
          and their last working day with us was{' '}
          <strong>{letterData.lastWorkingDay ? new Date(letterData.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</strong>.
        </p>

        <p>
          The employee has been relieved from their duties and responsibilities with effect from{' '}
          <strong>{letterData.lastWorkingDay ? new Date(new Date(letterData.lastWorkingDay).getTime() + 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</strong>.
        </p>

        <div className="my-6">
          <p className="font-semibold mb-2">Status Verification:</p>
          <div className="ml-6 space-y-2">
            <p>✓ Notice Period: {letterData.noticePeriod === 'served' ? 'Duly Served' : 'Waived'}</p>
            <p>✓ Pending Dues: {letterData.pendingDues === 'cleared' ? 'Fully Cleared' : 'Outstanding'}</p>
            <p>✓ Company Property: {letterData.companyProperty === 'returned' ? 'All Returned' : 'Pending'}</p>
          </div>
        </div>

        <p>
          During their tenure with us, {letterData.employeeName} has demonstrated{' '}
          {letterData.performanceRemarks === 'excellent' ? 'excellent' : letterData.performanceRemarks === 'good' ? 'good' : 'satisfactory'}{' '}
          performance and maintained professional conduct.
        </p>

        <p>
          We wish {letterData.employeeName} all the best for their future endeavors.
        </p>

        <p className="mt-6">
          This letter is being issued upon the request of the employee for official purposes.
        </p>
      </div>

      <div className="mt-12">
        <p className="font-semibold">For {letterData.companyName},</p>
        <div className="mt-8">
          <p className="font-semibold">{letterData.signerName}</p>
          <p className="text-gray-600">{letterData.signerDesignation}</p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-600">
        <p>Note: This is a computer-generated letter and does not require a physical signature.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Relieving Letters</h1>
        <p className="text-gray-600">Generate relieving letters for exiting employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Relieving Details
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
              <input
                type="text"
                required
                value={letterData.employeeName}
                onChange={(e) => setLetterData({ ...letterData, employeeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                value={letterData.employeeId}
                onChange={(e) => setLetterData({ ...letterData, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Auto-generated or manual entry"
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining *</label>
                <input
                  type="date"
                  required
                  value={letterData.dateOfJoining}
                  onChange={(e) => setLetterData({ ...letterData, dateOfJoining: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Working Day *</label>
                <input
                  type="date"
                  required
                  value={letterData.lastWorkingDay}
                  onChange={(e) => setLetterData({ ...letterData, lastWorkingDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period Status</label>
              <select
                value={letterData.noticePeriod}
                onChange={(e) => setLetterData({ ...letterData, noticePeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="served">Duly Served</option>
                <option value="waived">Waived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pending Dues Status</label>
              <select
                value={letterData.pendingDues}
                onChange={(e) => setLetterData({ ...letterData, pendingDues: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="cleared">Fully Cleared</option>
                <option value="outstanding">Outstanding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Property Status</label>
              <select
                value={letterData.companyProperty}
                onChange={(e) => setLetterData({ ...letterData, companyProperty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="returned">All Returned</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Remarks</label>
              <select
                value={letterData.performanceRemarks}
                onChange={(e) => setLetterData({ ...letterData, performanceRemarks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                disabled={!letterData.employeeName}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                <FiEye /> {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={generatePDF}
                disabled={!letterData.employeeName}
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
                <RelievingLetterPreview />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiFileText size={64} className="mb-4" />
              <p>Fill in the details to preview the relieving letter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelievingLetters;

