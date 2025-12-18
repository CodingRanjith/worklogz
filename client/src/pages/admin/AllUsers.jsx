import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import EditUser from '../../components/admin-dashboard/allusers/EditUser';
import CreateUser from '../../components/admin-dashboard/allusers/CreateUser';
import ViewUserDetails from '../../components/admin-dashboard/allusers/ViewUserDetails';
import { FiSearch, FiFilter, FiUsers, FiX, FiPlus, FiEdit2, FiTrash2, FiHome, FiBriefcase, FiEye, FiDownload } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useCustomFields } from '../../hooks/useCustomFields';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch custom fields for filters
  const { fields: roleFields } = useCustomFields('role');
  const { fields: departmentFields } = useCustomFields('department');

  // ✅ Move fetchUsers outside useEffect so you can use it in onUpdated
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = res.data || [];
      
      // Check if any users are missing employee IDs
      const usersWithoutId = usersData.filter(user => !user.employeeId || user.employeeId === 'N/A');
      if (usersWithoutId.length > 0) {
        // Automatically assign employee IDs to users who don't have one
        try {
          await axios.post(`${API_ENDPOINTS.getUsers.replace('/users', '/users/assign-employee-ids')}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Refetch users after assigning IDs
          const updatedRes = await axios.get(API_ENDPOINTS.getUsers, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(updatedRes.data || []);
        } catch (assignError) {
          console.error('Failed to assign employee IDs:', assignError);
          setUsers(usersData);
        }
      } else {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Swal.fire('Error', 'Failed to fetch users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to permanently delete ${name || 'this user'}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingUserId(userId);
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.deleteUser(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
    } catch (error) {
      console.error('Failed to delete user:', error);
      Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get unique departments and roles - use custom fields if available, otherwise from users
  const departments = useMemo(() => {
    if (departmentFields.length > 0) {
      return departmentFields.map(field => field.value).sort();
    }
    const depts = users
      .map(user => user.department)
      .filter(Boolean)
      .filter((dept, index, self) => self.indexOf(dept) === index)
      .sort();
    return depts;
  }, [users, departmentFields]);

  const roles = useMemo(() => {
    if (roleFields.length > 0) {
      // Map role field values to database enum format
      return roleFields.map(field => {
        const roleValue = field.value.toLowerCase().replace(/\s+/g, '');
        const validRoles = ['employee', 'admin', 'manager', 'hr', 'supervisor', 'teamlead'];
        return validRoles.includes(roleValue) ? roleValue : roleValue;
      }).filter((role, index, self) => self.indexOf(role) === index).sort();
    }
    const roleList = users
      .map(user => user.role)
      .filter(Boolean)
      .filter((role, index, self) => self.indexOf(role) === index)
      .sort();
    return roleList;
  }, [users, roleFields]);

  // Filter users based on search, role, and department
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        !searchQuery ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, searchQuery, selectedRole, selectedDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const byRole = users.reduce((acc, user) => {
      const role = user.role || 'employee';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    const byDepartment = users.reduce((acc, user) => {
      const dept = user.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    const byCompany = users.reduce((acc, user) => {
      const company = user.company || 'Unassigned';
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {});

    return { total, byRole, byDepartment, byCompany };
  }, [users]);

  // Get unique companies
  const companies = useMemo(() => {
    const comps = users
      .map(user => user.company)
      .filter(Boolean)
      .filter((comp, index, self) => self.indexOf(comp) === index)
      .sort();
    return comps;
  }, [users]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewUser = (userId) => {
    setViewingUserId(userId);
  };

  const handleDownloadUser = async (user) => {
    try {
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
    } catch (error) {
      console.error('Failed to download employee details:', error);
      Swal.fire('Error', 'Failed to download employee details', 'error');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedDepartment('all');
  };

  const hasActiveFilters = searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all';

  if (loading && !deletingUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full py-6 px-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage employees, update profiles, or onboard new teammates</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl"
        >
              <FiPlus size={20} />
              Create Employee
        </button>
      </div>

          {/* Statistics Cards - 4 in a single row, smaller */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Total Employees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiUsers className="text-blue-600" size={18} />
                </div>
              </div>
            </div>

            {/* Total Roles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byRole).length}</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiBriefcase className="text-purple-600" size={18} />
                </div>
              </div>
            </div>

            {/* Total Departments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byDepartment).length}</p>
                </div>
                <div className="bg-green-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiBriefcase className="text-green-600" size={18} />
                </div>
              </div>
            </div>

            {/* Company Divisions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Company Divisions</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byCompany).length}</p>
                </div>
                <div className="bg-orange-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiHome className="text-orange-600" size={18} />
                </div>
              </div>
            </div>
          </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, position, employee ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {[searchQuery && '1', selectedRole !== 'all' && '1', selectedDepartment !== 'all' && '1'].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiX size={18} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => {
                    // Find the display name from custom fields
                    const roleField = roleFields.find(field => {
                      const fieldValue = field.value.toLowerCase().replace(/\s+/g, '');
                      return fieldValue === role;
                    });
                    const displayName = roleField ? roleField.value : (role === 'teamlead' ? 'Team Lead' : role.charAt(0).toUpperCase() + role.slice(1));
                    return (
                      <option key={role} value={role}>{displayName}</option>
                    );
                  })}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{users.length}</span> employees
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-2 text-blue-600 hover:text-blue-700 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search query.' 
                : 'Get started by creating your first employee.'}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus size={18} />
                Create Employee
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profilePic || 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png'}
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className={`text-xs ${user.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{user.employeeId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.position || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.company || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user._id)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="View Full Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Download Details"
                        >
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={() => setEditingUserId(user._id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Profile"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deletingUserId === user._id}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User"
                        >
                          {deletingUserId === user._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                          ) : (
                            <FiTrash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

        {/* Modals */}
      {viewingUserId && (
        <ViewUserDetails
          userId={viewingUserId}
          onClose={() => setViewingUserId(null)}
        />
      )}

      {editingUserId && (
        <EditUser
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onUpdated={fetchUsers}
        />
      )}

      {isCreateModalOpen && (
        <CreateUser
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={fetchUsers}
        />
      )}
      </div>
    </div>
  );
};

export default AllUsers;
