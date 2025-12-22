import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import EditUser from '../../components/admin-dashboard/allusers/EditUser';
import CreateUser from '../../components/admin-dashboard/allusers/CreateUser';
import ViewUserDetails from '../../components/admin-dashboard/allusers/ViewUserDetails';
import { FiSearch, FiFilter, FiUsers, FiX, FiPlus, FiEdit2, FiHome, FiBriefcase, FiEye, FiDownload, FiArchive, FiRotateCw } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useCustomFields } from '../../hooks/useCustomFields';
import jsPDF from 'jspdf';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [restoringUserId, setRestoringUserId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
  
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

  const fetchArchivedUsers = async () => {
    try {
      setArchivedLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Fetching archived users from:', API_ENDPOINTS.getArchivedUsers);
      const res = await axios.get(API_ENDPOINTS.getArchivedUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Archived users response:', res.data);
      setArchivedUsers(res.data || []);
      
      if (!res.data || res.data.length === 0) {
        console.log('No archived users found');
      }
    } catch (error) {
      console.error('Failed to fetch archived users:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: API_ENDPOINTS.getArchivedUsers
      });
      
      // Don't show error if it's just an empty list
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || error.message || 'Failed to fetch archived users. Please try again.',
          footer: `Status: ${error.response?.status || 'Unknown'}`
        });
      } else {
        // 404 means no archived users, which is fine
        setArchivedUsers([]);
      }
    } finally {
      setArchivedLoading(false);
    }
  };

  const handleArchiveUser = async (userId, name) => {
    const result = await Swal.fire({
      title: 'Archive Employee?',
      text: `Do you want to archive ${name || 'this employee'}? They will be moved to the archived list and can be restored later.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingUserId(userId);
      const token = localStorage.getItem('token');
      const response = await axios.delete(API_ENDPOINTS.deleteUser(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Archive response:', response.data);
      
      // Refresh both lists
      await fetchUsers();
      await fetchArchivedUsers();
      
      Swal.fire('Archived!', 'Employee has been archived successfully.', 'success');
    } catch (error) {
      console.error('Failed to archive user:', error);
      Swal.fire('Error', 'Failed to archive employee. Please try again.', 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleRestoreUser = async (userId, name) => {
    const result = await Swal.fire({
      title: 'Restore Employee?',
      text: `Do you want to restore ${name || 'this employee'}? They will be moved back to the active employee list.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setRestoringUserId(userId);
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.restoreUser(userId), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchArchivedUsers();
      if (activeTab === 'active') {
        await fetchUsers();
      }
      Swal.fire('Restored!', 'Employee has been restored successfully.', 'success');
    } catch (error) {
      console.error('Failed to restore user:', error);
      Swal.fire('Error', 'Failed to restore employee. Please try again.', 'error');
    } finally {
      setRestoringUserId(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'active') {
      fetchUsers();
    } else if (activeTab === 'archived') {
      fetchArchivedUsers();
    }
  }, [activeTab]);

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
    const userList = activeTab === 'active' ? users : archivedUsers;
    return userList.filter(user => {
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
  }, [users, archivedUsers, activeTab, searchQuery, selectedRole, selectedDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const userList = activeTab === 'active' ? users : archivedUsers;
    const total = userList.length;
    const byRole = userList.reduce((acc, user) => {
      const role = user.role || 'employee';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    const byDepartment = userList.reduce((acc, user) => {
      const dept = user.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    const byCompany = userList.reduce((acc, user) => {
      const company = user.company || 'Unassigned';
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {});

    return { total, byRole, byDepartment, byCompany };
  }, [users, archivedUsers, activeTab]);

  // Get unique companies
  const companies = useMemo(() => {
    const userList = activeTab === 'active' ? users : archivedUsers;
    const comps = userList
      .map(user => user.company)
      .filter(Boolean)
      .filter((comp, index, self) => self.indexOf(comp) === index)
      .sort();
    return comps;
  }, [users, archivedUsers, activeTab]);

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
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 20;
      const lineHeight = 7;
      const sectionSpacing = 5;

      // Set font styles
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('EMPLOYEE DETAILS', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Draw a line
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += sectionSpacing + 5;

      // Personal Information Section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Personal Information', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Name: ${user.name || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Email: ${user.email || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Phone: ${user.phone || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Employee ID: ${user.employeeId || 'N/A'}`, margin, yPosition);
      yPosition += sectionSpacing + 5;

      // Work Information Section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Work Information', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Position: ${user.position || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Department: ${user.department || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Company: ${user.company || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Role: ${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Date of Joining: ${formatDate(user.dateOfJoining)}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Qualification: ${user.qualification || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Salary: ${user.salary ? `₹${user.salary.toLocaleString()}` : 'N/A'}`, margin, yPosition);
      yPosition += sectionSpacing + 5;

      // Skills Section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Skills', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      if (user.skills && user.skills.length > 0) {
        user.skills.forEach(skill => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${skill}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      } else {
        doc.text('N/A', margin + 5, yPosition);
        yPosition += lineHeight;
      }
      yPosition += sectionSpacing;

      // Roles & Responsibilities Section
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Roles & Responsibilities', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      if (user.rolesAndResponsibility && user.rolesAndResponsibility.length > 0) {
        user.rolesAndResponsibility.forEach(role => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${role}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      } else {
        doc.text('N/A', margin + 5, yPosition);
        yPosition += lineHeight;
      }
      yPosition += sectionSpacing + 5;

      // Banking Details Section
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Banking Details', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Bank Name: ${user.bankDetails?.bankingName || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Account Number: ${user.bankDetails?.bankAccountNumber || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`IFSC Code: ${user.bankDetails?.ifscCode || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`UPI ID: ${user.bankDetails?.upiId || 'N/A'}`, margin, yPosition);
      yPosition += sectionSpacing + 10;

      // Status and Footer
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`Status: ${user.isActive ? 'Active' : 'Inactive'}`, margin, yPosition);
      yPosition += lineHeight + 5;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);

      // Save the PDF
      const fileName = `${user.name || 'Employee'}_Details_${user.employeeId || Date.now()}.pdf`;
      doc.save(fileName);

      Swal.fire('Success', 'Employee details downloaded as PDF successfully', 'success');
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

  const isLoading = activeTab === 'active' ? loading : archivedLoading;

  if (isLoading && !deletingUserId && !restoringUserId) {
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
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Employees ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'archived'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiArchive className="inline mr-1" size={14} />
            Archived ({archivedUsers.length})
          </button>
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
          Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900">{activeTab === 'active' ? users.length : archivedUsers.length}</span> {activeTab === 'active' ? 'employees' : 'archived employees'}
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
            <FiArchive className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'archived' ? 'No archived employees found' : 'No employees found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'archived' 
                ? 'There are no archived employees. Employees will appear here after they are archived.'
                : hasActiveFilters 
                  ? 'Try adjusting your filters or search query.' 
                  : 'Get started by creating your first employee.'}
            </p>
            {!hasActiveFilters && activeTab === 'active' && (
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
                      {activeTab === 'archived' && user.deletedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Archived: {formatDate(user.deletedAt)}
                        </div>
                      )}
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
                        {activeTab === 'active' ? (
                          <button
                            onClick={() => handleArchiveUser(user._id, user.name)}
                            disabled={deletingUserId === user._id}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Archive Employee"
                          >
                            {deletingUserId === user._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                            ) : (
                              <FiArchive size={18} />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestoreUser(user._id, user.name)}
                            disabled={restoringUserId === user._id}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Restore Employee"
                          >
                            {restoringUserId === user._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
                            ) : (
                              <FiRotateCw size={18} />
                            )}
                          </button>
                        )}
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
