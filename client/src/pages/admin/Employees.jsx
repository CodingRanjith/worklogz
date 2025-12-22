import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import ViewUserDetails from '../../components/admin-dashboard/allusers/ViewUserDetails';
import { FiSearch, FiFilter, FiUsers, FiX, FiEdit2, FiEye, FiDownload, FiClock, FiSave, FiCalendar, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useCustomFields } from '../../hooks/useCustomFields';
import jsPDF from 'jspdf';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const weekends = ['Saturday', 'Sunday'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingEmployeeId, setViewingEmployeeId] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleChanges, setScheduleChanges] = useState({});
  const [savingSchedule, setSavingSchedule] = useState(false);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting states
  const [sortColumn, setSortColumn] = useState(null); // 'name', 'employeeId', 'email', 'position', 'department', 'company', 'role'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Fetch custom fields for filters
  const { fields: roleFields } = useCustomFields('role');
  const { fields: departmentFields } = useCustomFields('department');

  // Fetch employees and schedules
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch employees and schedules in parallel
      const [employeesRes, schedulesRes] = await Promise.all([
        axios.get(API_ENDPOINTS.getUsers, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(API_ENDPOINTS.getSchedules, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] })) // Handle case where schedules endpoint might not exist
      ]);

      const employeesData = employeesRes.data || [];
      
      // Check if any employees are missing employee IDs
      const employeesWithoutId = employeesData.filter(emp => !emp.employeeId || emp.employeeId === 'N/A');
      if (employeesWithoutId.length > 0) {
        try {
          await axios.post(`${API_ENDPOINTS.getUsers.replace('/users', '/users/assign-employee-ids')}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Refetch employees after assigning IDs
          const updatedRes = await axios.get(API_ENDPOINTS.getUsers, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEmployees(updatedRes.data || []);
        } catch (assignError) {
          console.error('Failed to assign employee IDs:', assignError);
          setEmployees(employeesData);
        }
      } else {
        setEmployees(employeesData);
      }

      setSchedules(schedulesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Swal.fire('Error', 'Failed to fetch employees. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique departments, roles, and companies
  const departments = useMemo(() => {
    if (departmentFields.length > 0) {
      return departmentFields.map(field => field.value).sort();
    }
    const depts = employees
      .map(emp => emp.department)
      .filter(Boolean)
      .filter((dept, index, self) => self.indexOf(dept) === index)
      .sort();
    return depts;
  }, [employees, departmentFields]);

  const roles = useMemo(() => {
    if (roleFields.length > 0) {
      return roleFields.map(field => {
        const roleValue = field.value.toLowerCase().replace(/\s+/g, '');
        const validRoles = ['employee', 'admin', 'manager', 'hr', 'supervisor', 'teamlead'];
        return validRoles.includes(roleValue) ? roleValue : roleValue;
      }).filter((role, index, self) => self.indexOf(role) === index).sort();
    }
    const roleList = employees
      .map(emp => emp.role)
      .filter(Boolean)
      .filter((role, index, self) => self.indexOf(role) === index)
      .sort();
    return roleList;
  }, [employees, roleFields]);

  const companies = useMemo(() => {
    const comps = employees
      .map(emp => emp.company)
      .filter(Boolean)
      .filter((comp, index, self) => self.indexOf(comp) === index)
      .sort();
    return comps;
  }, [employees]);

  // Handle column sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = 
        !searchQuery ||
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.company?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const matchesCompany = selectedCompany === 'all' || emp.company === selectedCompany;

      return matchesSearch && matchesRole && matchesDepartment && matchesCompany;
    });

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortColumn) {
          case 'name':
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
          case 'employeeId':
            aValue = (a.employeeId || '').toLowerCase();
            bValue = (b.employeeId || '').toLowerCase();
            break;
          case 'email':
            aValue = (a.email || '').toLowerCase();
            bValue = (b.email || '').toLowerCase();
            break;
          case 'position':
            aValue = (a.position || '').toLowerCase();
            bValue = (b.position || '').toLowerCase();
            break;
          case 'department':
            aValue = (a.department || '').toLowerCase();
            bValue = (b.department || '').toLowerCase();
            break;
          case 'company':
            aValue = (a.company || '').toLowerCase();
            bValue = (b.company || '').toLowerCase();
            break;
          case 'role':
            aValue = (a.role || '').toLowerCase();
            bValue = (b.role || '').toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchQuery, selectedRole, selectedDepartment, selectedCompany, sortColumn, sortDirection]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const byRole = employees.reduce((acc, emp) => {
      const role = emp.role || 'employee';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    const byDepartment = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    const byCompany = employees.reduce((acc, emp) => {
      const company = emp.company || 'Unassigned';
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {});

    return { total, byRole, byDepartment, byCompany };
  }, [employees]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownloadEmployee = async (employee) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 20;
      const lineHeight = 7;
      const sectionSpacing = 5;

      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('EMPLOYEE DETAILS', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += sectionSpacing + 5;

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Personal Information', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Name: ${employee.name || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Email: ${employee.email || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Phone: ${employee.phone || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Employee ID: ${employee.employeeId || 'N/A'}`, margin, yPosition);
      yPosition += sectionSpacing + 5;

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Work Information', margin, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Position: ${employee.position || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Department: ${employee.department || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Company: ${employee.company || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Role: ${employee.role ? employee.role.charAt(0).toUpperCase() + employee.role.slice(1) : 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Date of Joining: ${formatDate(employee.dateOfJoining)}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Qualification: ${employee.qualification || 'N/A'}`, margin, yPosition);
      yPosition += lineHeight;
      doc.text(`Salary: ${employee.salary ? `₹${employee.salary.toLocaleString()}` : 'N/A'}`, margin, yPosition);

      const fileName = `${employee.name || 'Employee'}_Details_${employee.employeeId || Date.now()}.pdf`;
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
    setSelectedCompany('all');
  };

  const hasActiveFilters = searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all' || selectedCompany !== 'all';

  // Get schedule for an employee
  const getEmployeeSchedule = (employeeId) => {
    return schedules.find(s => s.user?._id === employeeId || s.user === employeeId);
  };

  // Handle schedule change
  const handleScheduleChange = (employeeId, day, field, value) => {
    const schedule = getEmployeeSchedule(employeeId);
    const weeklySchedule = schedule?.weeklySchedule || {};
    const daySchedule = weeklySchedule[day] || {};
    
    setScheduleChanges(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        weeklySchedule: {
          ...weeklySchedule,
          [day]: {
            ...daySchedule,
            [field]: value
          }
        },
        salary: prev[employeeId]?.salary !== undefined ? prev[employeeId].salary : (schedule?.salary || 0)
      }
    }));
  };

  // Handle salary change
  const handleSalaryChange = (employeeId, value) => {
    setScheduleChanges(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        salary: parseFloat(value) || 0
      }
    }));
  };

  // Save schedule
  const saveSchedule = async (employeeId) => {
    try {
      setSavingSchedule(true);
      const token = localStorage.getItem('token');
      const schedule = getEmployeeSchedule(employeeId);
      const changes = scheduleChanges[employeeId] || {};
      
      const scheduleData = {
        userId: employeeId,
        weeklySchedule: changes.weeklySchedule || schedule?.weeklySchedule || {},
        salary: changes.salary !== undefined ? changes.salary : (schedule?.salary || 0)
      };

      let response;
      if (schedule?._id) {
        // Update existing schedule
        response = await axios.put(API_ENDPOINTS.putUserSchedule(schedule._id), scheduleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new schedule
        response = await axios.post(API_ENDPOINTS.createUserSchedule, scheduleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Clear changes for this employee
      setScheduleChanges(prev => {
        const updated = { ...prev };
        delete updated[employeeId];
        return updated;
      });

      setEditingScheduleId(null);
      
      // Refresh schedules
      const schedulesRes = await axios.get(API_ENDPOINTS.getSchedules, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedulesRes.data || []);

      Swal.fire('Success', 'Schedule saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save schedule:', error);
      Swal.fire('Error', 'Failed to save schedule. Please try again.', 'error');
    } finally {
      setSavingSchedule(false);
    }
  };

  // Get current schedule values (with pending changes)
  const getCurrentSchedule = (employeeId) => {
    const schedule = getEmployeeSchedule(employeeId);
    const changes = scheduleChanges[employeeId] || {};
    return {
      weeklySchedule: changes.weeklySchedule || schedule?.weeklySchedule || {},
      salary: changes.salary !== undefined ? changes.salary : (schedule?.salary || 0),
      hasSchedule: !!schedule
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees</h1>
              <p className="text-gray-600">View and manage employee details</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-3 mb-6">
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byRole).length}</p>
                </div>
                <div className="bg-purple-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiUsers className="text-purple-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byDepartment).length}</p>
                </div>
                <div className="bg-green-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiUsers className="text-green-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 mb-1 truncate">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byCompany).length}</p>
                </div>
                <div className="bg-orange-100 rounded-lg p-2 ml-2 flex-shrink-0">
                  <FiUsers className="text-orange-600" size={18} />
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
                  placeholder="Search by name, email, employee ID, position, department, or company..."
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
                    {[searchQuery && '1', selectedRole !== 'all' && '1', selectedDepartment !== 'all' && '1', selectedCompany !== 'all' && '1'].filter(Boolean).length}
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
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Company Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Companies</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> of <span className="font-semibold text-gray-900">{employees.length}</span> employees
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

        {/* Employees Table */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search query.' 
                  : 'No employees available.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Employee</span>
                        {sortColumn === 'name' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('employeeId')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Employee ID</span>
                        {sortColumn === 'employeeId' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Email</span>
                        {sortColumn === 'email' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('position')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Position</span>
                        {sortColumn === 'position' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('department')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Department</span>
                        {sortColumn === 'department' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Company</span>
                        {sortColumn === 'company' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Role</span>
                        {sortColumn === 'role' && (
                          sortDirection === 'asc' ? (
                            <FiArrowUp className="text-blue-600" size={14} />
                          ) : (
                            <FiArrowDown className="text-blue-600" size={14} />
                          )
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <React.Fragment key={employee._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={employee.profilePic || 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png'}
                                alt={employee.name}
                                onError={(e) => {
                                  e.target.src = 'https://www.pikpng.com/pngl/m/154-1540525_male-user-filled-icon-my-profile-icon-png.png';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.phone || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">{employee.employeeId || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.position || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.company || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            employee.role === 'employee' ? 'bg-green-100 text-green-800' :
                            employee.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            employee.role === 'hr' ? 'bg-pink-100 text-pink-800' :
                            employee.role === 'supervisor' ? 'bg-yellow-100 text-yellow-800' :
                            employee.role === 'teamlead' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.role ? (employee.role === 'teamlead' ? 'Team Lead' : employee.role.charAt(0).toUpperCase() + employee.role.slice(1)) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingEmployeeId(employee._id)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                              title="View Details"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingScheduleId(editingScheduleId === employee._id ? null : employee._id);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Manage Schedule"
                            >
                              <FiClock size={18} />
                            </button>
                            <button
                              onClick={() => handleDownloadEmployee(employee)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Download Details"
                            >
                              <FiDownload size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {editingScheduleId === employee._id && (
                        <tr>
                          <td colSpan="9" className="px-6 py-4 bg-gray-50">
                            <ScheduleEditor
                              employee={employee}
                              currentSchedule={getCurrentSchedule(employee._id)}
                              onScheduleChange={(day, field, value) => handleScheduleChange(employee._id, day, field, value)}
                              onSalaryChange={(value) => handleSalaryChange(employee._id, value)}
                              onSave={() => saveSchedule(employee._id)}
                              onCancel={() => {
                                setEditingScheduleId(null);
                                setScheduleChanges(prev => {
                                  const updated = { ...prev };
                                  delete updated[employee._id];
                                  return updated;
                                });
                              }}
                              saving={savingSchedule}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Employee Details Modal */}
        {viewingEmployeeId && (
          <ViewUserDetails
            userId={viewingEmployeeId}
            onClose={() => setViewingEmployeeId(null)}
          />
        )}
      </div>
    </div>
  );
};

// Schedule Editor Component
const ScheduleEditor = ({ employee, currentSchedule, onScheduleChange, onSalaryChange, onSave, onCancel, saving }) => {

  const [weekdayStart, setWeekdayStart] = useState('09:00');
  const [weekdayEnd, setWeekdayEnd] = useState('18:00');
  const [weekendStart, setWeekendStart] = useState('10:00');
  const [weekendEnd, setWeekendEnd] = useState('17:00');

  const applyBulkWeekdayTimings = () => {
    weekdays.forEach(day => {
      onScheduleChange(day, 'start', weekdayStart);
      onScheduleChange(day, 'end', weekdayEnd);
    });
  };

  const applyBulkWeekendTimings = () => {
    weekends.forEach(day => {
      onScheduleChange(day, 'start', weekendStart);
      onScheduleChange(day, 'end', weekendEnd);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <FiCalendar className="inline mr-2" />
          Schedule Management - {employee.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave size={16} />
                Save Schedule
              </>
            )}
          </button>
        </div>
      </div>

      {/* Salary Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            value={currentSchedule.salary || ''}
            onChange={(e) => onSalaryChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {/* Bulk Weekday/Weekend Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Quick Set Timings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekday Controls */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-900 mb-3">Weekdays (Mon-Fri)</h5>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Start</label>
                <input
                  type="time"
                  value={weekdayStart}
                  onChange={(e) => setWeekdayStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">End</label>
                <input
                  type="time"
                  value={weekdayEnd}
                  onChange={(e) => setWeekdayEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <button
              onClick={applyBulkWeekdayTimings}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply to Weekdays
            </button>
          </div>

          {/* Weekend Controls */}
          <div className="bg-red-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-red-900 mb-3">Weekends (Sat-Sun)</h5>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Start</label>
                <input
                  type="time"
                  value={weekendStart}
                  onChange={(e) => setWeekendStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">End</label>
                <input
                  type="time"
                  value={weekendEnd}
                  onChange={(e) => setWeekendEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <button
              onClick={applyBulkWeekendTimings}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Apply to Weekends
            </button>
          </div>
        </div>
      </div>

      {/* Individual Day Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {days.map((day) => {
          const daySchedule = currentSchedule.weeklySchedule?.[day] || {};
          const isWeekend = weekends.includes(day);
          return (
            <div
              key={day}
              className={`border-2 rounded-lg p-4 ${
                isWeekend
                  ? 'border-red-200 bg-red-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <h5 className={`text-sm font-semibold mb-3 text-center ${
                isWeekend ? 'text-red-900' : 'text-blue-900'
              }`}>
                {day}
              </h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={daySchedule.start || (isWeekend ? '10:00' : '09:00')}
                    onChange={(e) => onScheduleChange(day, 'start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={daySchedule.end || (isWeekend ? '17:00' : '18:00')}
                    onChange={(e) => onScheduleChange(day, 'end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={daySchedule.isLeave || false}
                    onChange={(e) => onScheduleChange(day, 'isLeave', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs text-gray-700">Leave Day</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Employees;
