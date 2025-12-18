import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../utils/api';
import { FiX, FiMail, FiPhone, FiBriefcase, FiUsers, FiCalendar, FiDollarSign, FiCreditCard, FiDownload } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ViewUserDetails = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('token');
      axios.get(API_ENDPOINTS.getUserById(userId), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          Swal.fire('Error', 'Failed to fetch user details', 'error');
          onClose?.();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId, onClose]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = () => {
    if (!user) return;

    const content = `
EMPLOYEE DETAILS
================

Personal Information:
- Name: ${user.name || 'N/A'}
- Email: ${user.email || 'N/A'}
- Phone: ${user.phone || 'N/A'}
- Employee ID: ${user.employeeId || 'N/A'}

Work Information:
- Position: ${user.position || 'N/A'}
- Department: ${user.department || 'N/A'}
- Company: ${user.company || 'N/A'}
- Role: ${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
- Date of Joining: ${formatDate(user.dateOfJoining)}
- Qualification: ${user.qualification || 'N/A'}
- Salary: ${user.salary ? `₹${user.salary.toLocaleString()}` : 'N/A'}

Skills:
${user.skills && user.skills.length > 0 ? user.skills.map(skill => `- ${skill}`).join('\n') : 'N/A'}

Roles & Responsibilities:
${user.rolesAndResponsibility && user.rolesAndResponsibility.length > 0 ? user.rolesAndResponsibility.map(role => `- ${role}`).join('\n') : 'N/A'}

Banking Details:
- Bank Name: ${user.bankDetails?.bankingName || 'N/A'}
- Account Number: ${user.bankDetails?.bankAccountNumber || 'N/A'}
- IFSC Code: ${user.bankDetails?.ifscCode || 'N/A'}
- UPI ID: ${user.bankDetails?.upiId || 'N/A'}

Status: ${user.isActive ? 'Active' : 'Inactive'}
Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name || 'Employee'}_Details_${user.employeeId || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    Swal.fire('Success', 'Employee details downloaded successfully', 'success');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Employee Details</h2>
            <p className="text-sm text-green-100 mt-1">Complete information about {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              title="Download Details"
            >
              <FiDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
              <div className="flex-shrink-0">
                <img
                  src={user.profilePic || 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png'}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h3>
                <p className="text-lg text-gray-700 mb-4">{user.position} at {user.company}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMail size={16} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone size={16} />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-blue-600" size={20} />
                  Work Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">{user.employeeId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Department:</span>
                    <span className="ml-2 font-semibold text-gray-900">{user.department || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'employee' ? 'bg-green-100 text-green-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'hr' ? 'bg-pink-100 text-pink-800' :
                      user.role === 'supervisor' ? 'bg-yellow-100 text-yellow-800' :
                      user.role === 'teamlead' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role ? (user.role === 'teamlead' ? 'Team Lead' : user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Joining:</span>
                    <span className="ml-2 font-semibold text-gray-900">{formatDate(user.dateOfJoining)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Qualification:</span>
                    <span className="ml-2 font-semibold text-gray-900">{user.qualification || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Salary:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {user.salary ? `₹${user.salary.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Responsibilities */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="text-green-600" size={20} />
                  Skills & Responsibilities
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    {user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Roles & Responsibilities:</p>
                    {user.rolesAndResponsibility && user.rolesAndResponsibility.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {user.rolesAndResponsibility.map((role, index) => (
                          <li key={index}>{role}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No responsibilities listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            {user.bankDetails && (user.bankDetails.bankingName || user.bankDetails.bankAccountNumber || user.bankDetails.ifscCode || user.bankDetails.upiId) && (
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-orange-600" size={20} />
                  Banking Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="ml-2 font-semibold text-gray-900">{user.bankDetails.bankingName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Number:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">{user.bankDetails.bankAccountNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">IFSC Code:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">{user.bankDetails.ifscCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">UPI ID:</span>
                    <span className="ml-2 font-mono font-semibold text-gray-900">{user.bankDetails.upiId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;

