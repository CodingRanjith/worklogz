import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../../utils/api';
import { useCustomFields } from '../../../hooks/useCustomFields';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  position: '',
  company: '',
  role: 'employee',
  employeeId: '',
  salary: '',
  department: '',
  qualification: '',
  dateOfJoining: '',
  skills: [],
  rolesAndResponsibility: [],
  bankDetails: {
    bankingName: '',
    bankAccountNumber: '',
    ifscCode: '',
    upiId: ''
  }
};

const CreateUser = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(defaultForm);
  const [skillsInput, setSkillsInput] = useState('');
  const [rolesInput, setRolesInput] = useState('');
  const [nextEmployeeId, setNextEmployeeId] = useState('THC001');
  const [fetchingId, setFetchingId] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch custom fields for dropdowns
  const { fields: roleFields } = useCustomFields('role');
  const { fields: departmentFields } = useCustomFields('department');
  const { fields: companyFields } = useCustomFields('company');
  const { fields: positionFields } = useCustomFields('position');

  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchNextEmployeeId = async () => {
    try {
      setFetchingId(true);
      const { data } = await axios.get(API_ENDPOINTS.getNextEmployeeId, {
        headers: authHeaders
      });
      const generatedId = data?.employeeId || 'THC001';
      setNextEmployeeId(generatedId);
      setForm((prev) => ({ ...prev, employeeId: generatedId }));
    } catch (error) {
      console.error('Failed to fetch next employee ID:', error);
      Swal.fire('Warning', 'Unable to fetch next employee ID. Using fallback value.', 'warning');
      setNextEmployeeId('THC001');
      setForm((prev) => ({ ...prev, employeeId: 'THC001' }));
    } finally {
      setFetchingId(false);
    }
  };

  useEffect(() => {
    fetchNextEmployeeId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  const handleSkillsChange = (value) => {
    setSkillsInput(value);
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, skills: items }));
  };

  const handleRolesChange = (value) => {
    setRolesInput(value);
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, rolesAndResponsibility: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.name.trim()) {
      Swal.fire('Validation Error', 'Full Name is required.', 'warning');
      return;
    }
    
    if (!form.email || !form.email.trim()) {
      Swal.fire('Validation Error', 'Email is required.', 'warning');
      return;
    }
    
    if (!form.phone || !form.phone.trim()) {
      Swal.fire('Validation Error', 'Phone number is required.', 'warning');
      return;
    }
    
    if (!form.password || form.password.length < 6) {
      Swal.fire('Validation Error', 'Password must be at least 6 characters.', 'warning');
      return;
    }
    
    if (!form.position || !form.position.trim()) {
      Swal.fire('Validation Error', 'Position is required.', 'warning');
      return;
    }
    
    if (!form.company || !form.company.trim()) {
      Swal.fire('Validation Error', 'Company is required.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare payload with proper data types
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        position: form.position.trim(),
        company: form.company.trim(),
        role: form.role || 'employee',
        employeeId: nextEmployeeId,
        salary: form.salary ? Number(form.salary) : 0,
        department: form.department?.trim() || undefined,
        qualification: form.qualification?.trim() || undefined,
        dateOfJoining: form.dateOfJoining || undefined,
        skills: form.skills && form.skills.length > 0 ? form.skills : undefined,
        rolesAndResponsibility: form.rolesAndResponsibility && form.rolesAndResponsibility.length > 0 ? form.rolesAndResponsibility : undefined,
        bankDetails: form.bankDetails.bankingName || form.bankDetails.bankAccountNumber || form.bankDetails.ifscCode || form.bankDetails.upiId
          ? {
              bankingName: form.bankDetails.bankingName?.trim() || undefined,
              bankAccountNumber: form.bankDetails.bankAccountNumber?.trim() || undefined,
              ifscCode: form.bankDetails.ifscCode?.trim() || undefined,
              upiId: form.bankDetails.upiId?.trim() || undefined
            }
          : undefined
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });

      const response = await axios.post(API_ENDPOINTS.createUser, payload, {
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Employee created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Reset form
        setForm(defaultForm);
        setSkillsInput('');
        setRolesInput('');
        
        // Call callbacks
        if (onCreated) {
          onCreated();
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create employee. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-5xl w-full rounded-xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Employee</h2>
            <p className="text-sm text-blue-100 mt-1">Fill in the details to onboard a new team member</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            disabled={submitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Work Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  {positionFields.length > 0 ? (
                    <select
                      name="position"
                      value={form.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select Position</option>
                      {positionFields.map((field) => (
                        <option key={field._id || field.value} value={field.value}>
                          {field.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="position"
                      value={form.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <select
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select Company</option>
                    {companyFields.length > 0 ? (
                      companyFields.map((field) => (
                        <option key={field._id || field.value} value={field.value}>
                          {field.value}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Techackode">Techackode</option>
                        <option value="Zenaxa">Zenaxa</option>
                        <option value="ecomate">ecomate</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Department</option>
                    {departmentFields.map((field) => (
                      <option key={field._id || field.value} value={field.value}>
                        {field.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Role</option>
                    {roleFields.length > 0 ? (
                      roleFields.map((field) => {
                        // Map role values to database enum format
                        const roleValue = field.value.toLowerCase().replace(/\s+/g, '');
                        const validRoles = ['employee', 'admin', 'manager', 'hr', 'supervisor', 'teamlead'];
                        const mappedValue = validRoles.includes(roleValue) ? roleValue : 'employee';
                        return (
                          <option key={field._id || field.value} value={mappedValue}>
                            {field.value}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="teamlead">Team Lead</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={fetchingId ? 'Generating…' : nextEmployeeId}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={form.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary amount"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., B.Tech, MBA"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Responsibilities Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Responsibilities</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <textarea
                    name="skills"
                    value={skillsInput}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roles & Responsibilities</label>
                  <textarea
                    name="rolesAndResponsibility"
                    value={rolesInput}
                    onChange={(e) => handleRolesChange(e.target.value)}
                    placeholder="Enter roles and responsibilities separated by commas"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                </div>
              </div>
            </div>

            {/* Banking Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Details (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankingName"
                    value={form.bankDetails.bankingName}
                    onChange={handleBankChange}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={form.bankDetails.bankAccountNumber}
                    onChange={handleBankChange}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={form.bankDetails.ifscCode}
                    onChange={handleBankChange}
                    placeholder="Enter IFSC code"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={form.bankDetails.upiId}
                    onChange={handleBankChange}
                    placeholder="Enter UPI ID"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              disabled={submitting || fetchingId}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;

