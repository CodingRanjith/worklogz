import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import { FiPlus, FiX, FiChevronDown, FiChevronUp, FiCheck, FiXCircle, FiEdit2, FiTrash2, FiSearch, FiUser, FiBriefcase, FiTag, FiDownload, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './DayToday.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DayToday = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonths, setExpandedMonths] = useState({}); // { userId_month: true/false }
  const [attendanceData, setAttendanceData] = useState({}); // { userId_date: 'worked'/'not_worked' }
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [expandedMonthIndex, setExpandedMonthIndex] = useState(null); // Track which month is expanded in table view
  
  // Card form state
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    employeeIds: []
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeSelector, setShowEmployeeSelector] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchCards();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      fetchAttendanceData();
    }
  }, [selectedCard]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getAllDayTodayCards, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCards(response.data.cards || []);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      Swal.fire('Error', 'Failed to fetch cards', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    if (!selectedCard) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getDayTodayAttendance(selectedCard._id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAttendanceData(response.data.attendance || {});
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      Swal.fire('Error', 'Failed to fetch attendance data', 'error');
    }
  };

  const handleCreateCard = () => {
    setEditingCard(null);
    setCardForm({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      employeeIds: []
    });
    setSelectedEmployees([]);
    clearEmployeeFilters();
    setShowCardForm(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardForm({
      title: card.title,
      description: card.description,
      year: card.year,
      employeeIds: card.employeeIds || []
    });
    
    // Set selected employees - handle both populated and non-populated cases
    if (card.employeeIds && card.employeeIds.length > 0) {
      if (typeof card.employeeIds[0] === 'object') {
        // Already populated
        setSelectedEmployees(card.employeeIds);
      } else {
        // Need to fetch employee details
        const cardEmployees = users.filter(user => card.employeeIds.includes(user._id));
        setSelectedEmployees(cardEmployees);
      }
    } else {
      setSelectedEmployees([]);
    }
    
    clearEmployeeFilters();
    setShowCardForm(true);
  };

  const handleSaveCard = async () => {
    if (!cardForm.title || !cardForm.description) {
      Swal.fire('Error', 'Please fill in title and description', 'error');
      return;
    }

    if (selectedEmployees.length === 0) {
      Swal.fire('Error', 'Please select at least one employee', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: cardForm.title,
        description: cardForm.description,
        year: cardForm.year,
        employeeIds: selectedEmployees.map(emp => emp._id)
      };

      let response;
      if (editingCard) {
        // Update existing card
        console.log('Updating card with payload:', payload);
        console.log('API endpoint:', API_ENDPOINTS.updateDayTodayCard(editingCard._id));
        
        response = await axios.put(
          API_ENDPOINTS.updateDayTodayCard(editingCard._id),
          payload,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new card
        console.log('Creating card with payload:', payload);
        console.log('API endpoint:', API_ENDPOINTS.createDayTodayCard);
        
        response = await axios.post(
          API_ENDPOINTS.createDayTodayCard,
          payload,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.success) {
        Swal.fire('Success', editingCard ? 'Card updated successfully' : 'Card created successfully', 'success');
        setShowCardForm(false);
        setEditingCard(null);
        setCardForm({ title: '', description: '', year: new Date().getFullYear(), employeeIds: [] });
        setSelectedEmployees([]);
        clearEmployeeFilters();
        fetchCards(); // Refresh cards list
        
        // If we were editing the currently selected card, update it
        if (editingCard && selectedCard && selectedCard._id === editingCard._id) {
          setSelectedCard(response.data.card);
        }
      }
    } catch (error) {
      console.error('Error saving card:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || (editingCard ? 'Failed to update card' : 'Failed to create card');
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleDeleteCard = async (cardId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(API_ENDPOINTS.deleteDayTodayCard(cardId), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          if (selectedCard?._id === cardId) {
            setSelectedCard(null);
          }
          fetchCards(); // Refresh cards list
          Swal.fire('Deleted!', 'Card has been deleted.', 'success');
        }
      } catch (error) {
        console.error('Error deleting card:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete card';
        Swal.fire('Error', errorMessage, 'error');
      }
    }
  };

  const toggleEmployeeSelection = (user) => {
    const isSelected = selectedEmployees.some(emp => emp._id === user._id);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(emp => emp._id !== user._id));
    } else {
      setSelectedEmployees([...selectedEmployees, user]);
    }
  };

  const handleSelectAll = () => {
    const filtered = getFilteredEmployees();
    const allSelected = filtered.every(emp => selectedEmployees.some(sel => sel._id === emp._id));
    
    if (allSelected) {
      // Deselect all filtered employees
      const filteredIds = filtered.map(emp => emp._id);
      setSelectedEmployees(selectedEmployees.filter(emp => !filteredIds.includes(emp._id)));
    } else {
      // Select all filtered employees
      const newSelections = filtered.filter(emp => !selectedEmployees.some(sel => sel._id === emp._id));
      setSelectedEmployees([...selectedEmployees, ...newSelections]);
    }
  };

  const getFilteredEmployees = () => {
    return users.filter(user => {
      const searchLower = employeeSearch.toLowerCase();
      const matchesSearch = 
        !employeeSearch ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.employeeId?.toLowerCase().includes(searchLower) ||
        user.position?.toLowerCase().includes(searchLower);

      const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesEmployeeId = !selectedEmployeeId || user.employeeId?.toLowerCase().includes(selectedEmployeeId.toLowerCase());

      return matchesSearch && matchesDepartment && matchesRole && matchesEmployeeId;
    });
  };

  const getUniqueDepartments = () => {
    const depts = [...new Set(users.map(u => u.department).filter(Boolean))].sort();
    return depts;
  };

  const getUniqueRoles = () => {
    const roles = [...new Set(users.map(u => u.role).filter(Boolean))].sort();
    return roles;
  };

  const clearEmployeeFilters = () => {
    setEmployeeSearch('');
    setSelectedDepartment('all');
    setSelectedRole('all');
    setSelectedEmployeeId('');
  };

  const toggleMonth = (userId, monthIndex) => {
    const key = `${userId}_${monthIndex}`;
    setExpandedMonths(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const toggleAttendance = async (userId, date) => {
    if (!selectedCard) return;

    const key = `${userId}_${date}`;
    const currentStatus = attendanceData[key];
    
    let newStatus;
    if (currentStatus === 'worked') {
      newStatus = 'not_worked';
    } else if (currentStatus === 'not_worked') {
      newStatus = null; // Reset to unset - delete the record
    } else {
      newStatus = 'worked';
    }

    try {
      const token = localStorage.getItem('token');
      
      if (newStatus === null) {
        // Delete attendance record
        const response = await axios.delete(
          API_ENDPOINTS.deleteDayTodayAttendanceByUserAndDate(selectedCard._id),
          {
            data: { userId, date },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          const updatedData = { ...attendanceData };
          delete updatedData[key];
          setAttendanceData(updatedData);
        }
      } else {
        // Update or create attendance record
        const response = await axios.post(
          API_ENDPOINTS.updateDayTodayAttendance(selectedCard._id),
          {
            userId,
            date,
            status: newStatus
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          const updatedData = {
            ...attendanceData,
            [key]: newStatus
          };
          setAttendanceData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update attendance';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const getAttendanceStatus = (userId, date) => {
    const key = `${userId}_${date}`;
    return attendanceData[key] || null;
  };

  const getMonthTotals = (userId, monthIndex) => {
    if (!selectedCard) return { present: 0, absent: 0 };
    
    const daysInMonth = getDaysInMonth(selectedCard.year, monthIndex);
    let present = 0;
    let absent = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(selectedCard.year, monthIndex, day);
      const status = getAttendanceStatus(userId, dateKey);
      if (status === 'worked') {
        present++;
      } else if (status === 'not_worked') {
        absent++;
      }
    }
    
    return { present, absent };
  };

  const downloadMonthPDF = (monthIndex) => {
    if (!selectedCard || monthIndex === null) {
      Swal.fire('Error', 'Please select a month first', 'error');
      return;
    }

    try {
      // Initialize PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Verify doc is properly initialized
      if (!doc || !doc.internal) {
        throw new Error('Failed to initialize PDF document');
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = 20;

      // Colors
      const primaryColor = [102, 126, 234]; // Indigo
      const secondaryColor = [60, 60, 60];

      // Set default font first - this must be done before any text operations
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(selectedCard.title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(selectedCard.description, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;

      doc.setFontSize(10);
      doc.text(`Month: ${MONTH_NAMES[monthIndex]} ${selectedCard.year}`, pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPosition, { align: 'right' });
      yPosition += 10;

      // Divider
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      // Get employees and their data
      const employees = getCardEmployees();
      if (employees.length === 0) {
        Swal.fire('Error', 'No employees found for this card', 'error');
        return;
      }

      const daysInMonth = getDaysInMonth(selectedCard.year, monthIndex);

      // Prepare table data
      const tableData = employees.map(user => {
        const totals = getMonthTotals(user._id, monthIndex);
        const attendanceDetails = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = getDateKey(selectedCard.year, monthIndex, day);
          const status = getAttendanceStatus(user._id, dateKey);
          if (status === 'worked') {
            attendanceDetails.push(day);
          }
        }

        return [
          user.name || 'N/A',
          user.email || 'N/A',
          user.employeeId || 'N/A',
          totals.present.toString(),
          totals.absent.toString(),
          (daysInMonth - totals.present - totals.absent).toString(),
          attendanceDetails.length > 0 ? attendanceDetails.join(', ') : 'None'
        ];
      });

      // Create table
      autoTable(doc, {
        startY: yPosition,
        head: [['Name', 'Email', 'Employee ID', 'Present', 'Absent', 'Not Set', 'Present Days']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: secondaryColor
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 20, halign: 'center' },
          6: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      // Summary - get final Y position from autoTable
      let finalY = yPosition + 50; // Default fallback
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY + 10;
      }

      // Check if we need a new page
      if (finalY > pageHeight - 40) {
        doc.addPage();
        finalY = 20;
      }

      const totalPresent = employees.reduce((sum, user) => sum + getMonthTotals(user._id, monthIndex).present, 0);
      const totalAbsent = employees.reduce((sum, user) => sum + getMonthTotals(user._id, monthIndex).absent, 0);
      const totalNotSet = employees.reduce((sum, user) => {
        const totals = getMonthTotals(user._id, monthIndex);
        return sum + (daysInMonth - totals.present - totals.absent);
      }, 0);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Summary', margin, finalY);
      finalY += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Total Employees: ${employees.length}`, margin, finalY);
      finalY += 6;
      doc.text(`Total Present Days: ${totalPresent}`, margin, finalY);
      finalY += 6;
      doc.text(`Total Absent Days: ${totalAbsent}`, margin, finalY);
      finalY += 6;
      doc.text(`Total Not Set: ${totalNotSet}`, margin, finalY);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Day Today Attendance Report - ${MONTH_NAMES[monthIndex]} ${selectedCard.year}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Save PDF
      const fileName = `${selectedCard.title.replace(/\s+/g, '_')}_${MONTH_NAMES[monthIndex]}_${selectedCard.year}.pdf`;
      doc.save(fileName);

      Swal.fire('Success', 'PDF report downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error.message, error.stack);
      Swal.fire('Error', `Failed to generate PDF report: ${error.message}`, 'error');
    }
  };

  const getDateKey = (year, monthIndex, day) => {
    const date = new Date(year, monthIndex, day);
    return date.toISOString().split('T')[0];
  };

  const getCardEmployees = () => {
    if (!selectedCard) return [];
    // If employeeIds are populated, use them directly, otherwise filter from users
    if (selectedCard.employeeIds && selectedCard.employeeIds.length > 0) {
      if (typeof selectedCard.employeeIds[0] === 'object') {
        // Already populated
        return selectedCard.employeeIds;
      } else {
        // Need to filter from users
        return users.filter(user => selectedCard.employeeIds.includes(user._id));
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="daytoday-container">
      <div className="daytoday-header">
        <div>
          <h1 className="daytoday-title">Day to Day Attendance</h1>
          <p className="daytoday-subtitle">Track daily attendance for employees</p>
        </div>
        <button
          onClick={handleCreateCard}
          className="btn-primary"
        >
          <FiPlus className="icon" />
          Create New Card
        </button>
      </div>

      {/* Cards List */}
      {cards.length > 0 && (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card._id} className="card-item">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  <span className="card-year">Year: {card.year}</span>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleEditCard(card)}
                    className="btn-edit"
                    title="Edit Card"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="btn-view"
                    title="Open Card"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card._id)}
                    className="btn-delete"
                    title="Delete Card"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="card-footer">
                <span className="card-employees-count">
                  {card.employeeIds?.length || 0} Employee(s)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Creation Modal */}
      {showCardForm && (
        <div className="modal-overlay" onClick={() => setShowCardForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCard ? 'Edit Card' : 'Create New Card'}</h2>
              <button onClick={() => {
                setShowCardForm(false);
                setEditingCard(null);
                setCardForm({ title: '', description: '', year: new Date().getFullYear(), employeeIds: [] });
                setSelectedEmployees([]);
                clearEmployeeFilters();
              }} className="btn-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  placeholder="Enter card title"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  placeholder="Enter card description"
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input
                  type="number"
                  value={cardForm.year}
                  onChange={(e) => setCardForm({ ...cardForm, year: parseInt(e.target.value) })}
                  className="form-input"
                  min="2020"
                  max="2100"
                />
              </div>
              <div className="form-group">
                <label>Select Employees *</label>
                <div className="employee-selector">
                  <button
                    type="button"
                    onClick={() => setShowEmployeeSelector(!showEmployeeSelector)}
                    className="btn-select-employees"
                  >
                    {selectedEmployees.length > 0
                      ? `${selectedEmployees.length} Employee(s) Selected`
                      : 'Select Employees'}
                    {showEmployeeSelector ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {/* Selected Employees Preview */}
                  {selectedEmployees.length > 0 && (
                    <div className="selected-employees-preview">
                      {selectedEmployees.slice(0, 3).map(emp => (
                        <span key={emp._id} className="selected-employee-tag">
                          {emp.name}
                        </span>
                      ))}
                      {selectedEmployees.length > 3 && (
                        <span className="selected-employee-tag more">
                          +{selectedEmployees.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCardForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveCard} className="btn-primary">
                {editingCard ? 'Update Card' : 'Create Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Employee Selector Modal */}
      {showEmployeeSelector && (
        <div className="employee-modal-overlay" onClick={() => setShowEmployeeSelector(false)}>
          <div className="employee-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="employee-modal-header">
              <div>
                <h2>Select Employees</h2>
                <p className="employee-modal-subtitle">
                  {selectedEmployees.length} of {users.length} selected
                </p>
              </div>
              <button onClick={() => setShowEmployeeSelector(false)} className="btn-close">
                <FiX />
              </button>
            </div>

            <div className="employee-modal-body">
              {/* Filters Section */}
              <div className="employee-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <FiSearch className="filter-icon" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or employee ID..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  
                  <div className="filter-group">
                    <FiBriefcase className="filter-icon" />
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Departments</option>
                      {getUniqueDepartments().map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <FiUser className="filter-icon" />
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Roles</option>
                      {getUniqueRoles().map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <FiTag className="filter-icon" />
                    <input
                      type="text"
                      placeholder="Employee ID..."
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  {(employeeSearch || selectedDepartment !== 'all' || selectedRole !== 'all' || selectedEmployeeId) && (
                    <button onClick={clearEmployeeFilters} className="btn-clear-filters">
                      <FiX /> Clear Filters
                    </button>
                  )}
                </div>

                <div className="select-all-section">
                  <button onClick={handleSelectAll} className="btn-select-all">
                    {getFilteredEmployees().every(emp => selectedEmployees.some(sel => sel._id === emp._id))
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Selected Employees Section */}
              {selectedEmployees.length > 0 && (
                <div className="selected-employees-section">
                  <h3>Selected Employees ({selectedEmployees.length})</h3>
                  <div className="selected-employees-list">
                    {selectedEmployees.map(emp => (
                      <div key={emp._id} className="selected-employee-item">
                        <div className="selected-employee-info">
                          <div className="selected-employee-avatar">
                            {emp.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="selected-employee-name">{emp.name}</div>
                            <div className="selected-employee-details">
                              {emp.email} {emp.employeeId && `• ${emp.employeeId}`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleEmployeeSelection(emp)}
                          className="btn-remove-employee"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employees List */}
              <div className="employees-list-section">
                <h3>Available Employees ({getFilteredEmployees().length})</h3>
                <div className="employees-list">
                  {getFilteredEmployees().length === 0 ? (
                    <div className="no-employees">No employees found matching your filters</div>
                  ) : (
                    getFilteredEmployees().map(user => {
                      const isSelected = selectedEmployees.some(emp => emp._id === user._id);
                      return (
                        <div
                          key={user._id}
                          className={`employee-list-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleEmployeeSelection(user)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEmployeeSelection(user)}
                            className="employee-checkbox"
                          />
                          <div className="employee-list-avatar">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="employee-list-info">
                            <div className="employee-list-name">{user.name}</div>
                            <div className="employee-list-details">
                              <span>{user.email}</span>
                              {user.employeeId && <span className="employee-id">ID: {user.employeeId}</span>}
                            </div>
                            <div className="employee-list-meta">
                              {user.department && <span className="employee-meta-tag">{user.department}</span>}
                              {user.role && <span className="employee-meta-tag">{user.role}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="employee-modal-footer">
              <div className="selected-count">
                {selectedEmployees.length} employee(s) selected
              </div>
              <div className="employee-modal-actions">
                <button onClick={() => setShowEmployeeSelector(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowEmployeeSelector(false);
                    clearEmployeeFilters();
                  }}
                  className="btn-primary"
                >
                  Done ({selectedEmployees.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View - Table View */}
      {selectedCard && (
        <div className="main-view">
          <div className="view-header">
            <div>
              <h2>{selectedCard.title}</h2>
              <p>{selectedCard.description} - Year {selectedCard.year}</p>
            </div>
            <div className="view-header-actions">
              <div className="month-selector-group">
                <label className="month-selector-label">Select Month:</label>
                <select
                  value={expandedMonthIndex !== null ? expandedMonthIndex : ''}
                  onChange={(e) => {
                    const monthIndex = e.target.value === '' ? null : parseInt(e.target.value);
                    setExpandedMonthIndex(monthIndex);
                  }}
                  className="month-selector"
                >
                  <option value="">All Months</option>
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {MONTH_NAMES[index]} {selectedCard.year}
                    </option>
                  ))}
                </select>
                {expandedMonthIndex !== null && (
                  <button
                    onClick={() => setExpandedMonthIndex(null)}
                    className="btn-close-month"
                    title="Close Month"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              {expandedMonthIndex !== null && (
                <button
                  onClick={() => downloadMonthPDF(expandedMonthIndex)}
                  className="btn-download-pdf"
                  title="Download PDF Report"
                >
                  <FiDownload /> Download PDF
                </button>
              )}
              <button onClick={() => setSelectedCard(null)} className="btn-secondary">
                <FiX /> Close
              </button>
            </div>
          </div>

          {/* Single Table View - Show only selected month */}
          {expandedMonthIndex !== null ? (
            <div className="table-view-container">
              <div className="table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th className="sticky-col user-col">Users</th>
                      <th 
                        colSpan={getDaysInMonth(selectedCard.year, expandedMonthIndex) + 2} 
                        className="month-header expanded"
                      >
                        <div className="month-header-content">
                          <span>{MONTH_NAMES[expandedMonthIndex]} {selectedCard.year}</span>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <th className="sticky-col user-col"></th>
                      {Array.from({ length: getDaysInMonth(selectedCard.year, expandedMonthIndex) }, (_, i) => {
                        const day = i + 1;
                        const date = new Date(selectedCard.year, expandedMonthIndex, day);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        return (
                          <th key={day} className="day-header">
                            <div className="day-header-content">
                              <span className="day-number">{day}</span>
                              <span className="day-name">{dayName}</span>
                            </div>
                          </th>
                        );
                      })}
                      {/* Total columns header */}
                      <th key="present-total" className="total-header present-total-header">
                        <div className="total-header-content">
                          <span>Present</span>
                        </div>
                      </th>
                      <th key="absent-total" className="total-header absent-total-header">
                        <div className="total-header-content">
                          <span>Absent</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCardEmployees().map(user => {
                      const daysInMonth = getDaysInMonth(selectedCard.year, expandedMonthIndex);
                      const totals = getMonthTotals(user._id, expandedMonthIndex);
                      
                      return (
                        <tr key={user._id}>
                          <td className="sticky-col user-col">
                            <div className="table-user-info">
                              <div className="table-user-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="table-user-details">
                                <div className="table-user-name">{user.name}</div>
                                <div className="table-user-email">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateKey = getDateKey(selectedCard.year, expandedMonthIndex, day);
                            const status = getAttendanceStatus(user._id, dateKey);
                            
                            return (
                              <td
                                key={day}
                                className={`table-date-cell ${status === 'worked' ? 'worked' : status === 'not_worked' ? 'not-worked' : ''}`}
                                onClick={() => toggleAttendance(user._id, dateKey)}
                                title={`${user.name} - ${MONTH_NAMES[expandedMonthIndex]} ${day}, ${selectedCard.year}`}
                              >
                                {status === 'worked' && <FiCheck className="table-status-icon worked-icon" />}
                                {status === 'not_worked' && <FiXCircle className="table-status-icon not-worked-icon" />}
                              </td>
                            );
                          })}
                          {/* Total cells */}
                          <td key="present-total" className="total-cell present-total-cell">
                            <span className="total-value present-value">{totals.present}</span>
                          </td>
                          <td key="absent-total" className="total-cell absent-total-cell">
                            <span className="total-value absent-value">{totals.absent}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-month-selected">
              <p>Please select a month from the dropdown above to view attendance data.</p>
            </div>
          )}
        </div>
      )}

      {!selectedCard && cards.length === 0 && (
        <div className="empty-state">
          <p>No cards created yet. Create your first card to start tracking attendance.</p>
        </div>
      )}
    </div>
  );
};

export default DayToday;

