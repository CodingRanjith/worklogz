import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../../utils/api';

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
    if (!form.password || form.password.length < 6) {
      Swal.fire('Validation', 'Password must be at least 6 characters.', 'info');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        employeeId: nextEmployeeId,
        salary: Number(form.salary) || 0
      };

      await axios.post(API_ENDPOINTS.createUser, payload, {
        headers: authHeaders
      });

      await Swal.fire('Success', 'User created successfully', 'success');
      onCreated?.();
      onClose?.();
      setForm(defaultForm);
      setSkillsInput('');
      setRolesInput('');
    } catch (error) {
      console.error('Failed to create user:', error);
      const message = error.response?.data?.error || 'Failed to create user. Please try again.';
      Swal.fire('Error', message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
            <p className="text-sm text-gray-500">Provide the user details to onboard them instantly.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleInputChange}
            placeholder="Position"
            className="border p-2 rounded"
            required
          />
          <select
            name="company"
            value={form.company}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Company</option>
            <option value="Techackode">Techackode</option>
            <option value="Zenaxa">Zenaxa</option>
            <option value="ecomate">ecomate</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleInputChange}
            placeholder="Salary"
            className="border p-2 rounded"
            min="0"
          />
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleInputChange}
            placeholder="Department"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleInputChange}
            placeholder="Qualification"
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="employeeId"
            value={fetchingId ? 'Generating…' : nextEmployeeId}
            readOnly
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />

          <textarea
            name="skills"
            value={skillsInput}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="Skills (comma separated)"
            className="border p-2 rounded col-span-1 md:col-span-2"
            rows={2}
          />

          <textarea
            name="rolesAndResponsibility"
            value={rolesInput}
            onChange={(e) => handleRolesChange(e.target.value)}
            placeholder="Roles & Responsibilities (comma separated)"
            className="border p-2 rounded col-span-1 md:col-span-2"
            rows={2}
          />

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="bankingName"
              value={form.bankDetails.bankingName}
              onChange={handleBankChange}
              placeholder="Bank Name"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="bankAccountNumber"
              value={form.bankDetails.bankAccountNumber}
              onChange={handleBankChange}
              placeholder="Account Number"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="ifscCode"
              value={form.bankDetails.ifscCode}
              onChange={handleBankChange}
              placeholder="IFSC Code"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="upiId"
              value={form.bankDetails.upiId}
              onChange={handleBankChange}
              placeholder="UPI ID"
              className="border p-2 rounded"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={submitting || fetchingId}
            >
              {submitting ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;

