import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiClock, FiMail, FiPhone, FiBookOpen, FiUser, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [viewingTrainer, setViewingTrainer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternativePhone: '',
    courses: [],
    companyLeadSharePercentage: 0,
    trainerLeadSharePercentage: 0,
    availableTimings: DAYS_OF_WEEK.map(day => ({
      day,
      isAvailable: false,
      timeSlots: []
    }))
  });
  const [courseInput, setCourseInput] = useState('');
  const [courseAmount, setCourseAmount] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_ENDPOINTS.getTrainers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      Swal.fire('Error', 'Failed to fetch trainers. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (trainer = null) => {
    if (trainer) {
      setEditingTrainer(trainer._id);
      setFormData({
        name: trainer.name || '',
        email: trainer.email || '',
        phone: trainer.phone || '',
        alternativePhone: trainer.alternativePhone || '',
        courses: trainer.courses ? trainer.courses.map(c => typeof c === 'string' ? { name: c, amount: 0, leadSource: 'company' } : c) : [],
        companyLeadSharePercentage: trainer.companyLeadSharePercentage !== undefined ? trainer.companyLeadSharePercentage : (trainer.trainerSharePercentage !== undefined ? trainer.trainerSharePercentage : 0),
        trainerLeadSharePercentage: trainer.trainerLeadSharePercentage !== undefined ? trainer.trainerLeadSharePercentage : (trainer.trainerSharePercentage !== undefined ? trainer.trainerSharePercentage : 0),
        availableTimings: trainer.availableTimings && trainer.availableTimings.length > 0
          ? trainer.availableTimings
          : DAYS_OF_WEEK.map(day => ({
              day,
              isAvailable: false,
              timeSlots: []
            }))
      });
    } else {
      setEditingTrainer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        alternativePhone: '',
        courses: [],
        companyLeadSharePercentage: 0,
        trainerLeadSharePercentage: 0,
        availableTimings: DAYS_OF_WEEK.map(day => ({
          day,
          isAvailable: false,
          timeSlots: []
        }))
      });
    }
    setCourseInput('');
    setCourseAmount('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrainer(null);
    setCourseInput('');
    setCourseAmount('');
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value;
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleAddCourse = () => {
    if (courseInput.trim()) {
      const amount = parseFloat(courseAmount) || 0;
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, { name: courseInput.trim(), amount: amount, leadSource: 'company' }]
      }));
      setCourseInput('');
      setCourseAmount('');
    }
  };

  const handleRemoveCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleCourseAmountChange = (index, amount) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) => 
        i === index ? { ...course, amount: parseFloat(amount) || 0 } : course
      )
    }));
  };


  const handleDayToggle = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      availableTimings: prev.availableTimings.map((timing, idx) =>
        idx === dayIndex
          ? { ...timing, isAvailable: !timing.isAvailable }
          : timing
      )
    }));
  };

  const handleAddTimeSlot = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      availableTimings: prev.availableTimings.map((timing, idx) =>
        idx === dayIndex
          ? {
              ...timing,
              timeSlots: [...timing.timeSlots, { startTime: '09:00', endTime: '17:00' }]
            }
          : timing
      )
    }));
  };

  const handleRemoveTimeSlot = (dayIndex, slotIndex) => {
    setFormData(prev => ({
      ...prev,
      availableTimings: prev.availableTimings.map((timing, idx) =>
        idx === dayIndex
          ? {
              ...timing,
              timeSlots: timing.timeSlots.filter((_, i) => i !== slotIndex)
            }
          : timing
      )
    }));
  };

  const handleTimeSlotChange = (dayIndex, slotIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      availableTimings: prev.availableTimings.map((timing, idx) =>
        idx === dayIndex
          ? {
              ...timing,
              timeSlots: timing.timeSlots.map((slot, sIdx) =>
                sIdx === slotIndex
                  ? { ...slot, [field]: value }
                  : slot
              )
            }
          : timing
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire('Error', 'Please fill in all required fields (Name, Email, Phone).', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingTrainer) {
        await axios.put(API_ENDPOINTS.updateTrainer(editingTrainer), formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Trainer updated successfully!', 'success');
      } else {
        await axios.post(API_ENDPOINTS.createTrainer, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Trainer created successfully!', 'success');
      }
      handleCloseModal();
      fetchTrainers();
    } catch (error) {
      console.error('Failed to save trainer:', error);
      Swal.fire(
        'Error',
        error.response?.data?.error || 'Failed to save trainer. Please try again.',
        'error'
      );
    }
  };

  const handleDelete = async (trainerId, trainerName) => {
    const result = await Swal.fire({
      title: 'Delete Trainer?',
      text: `Are you sure you want to delete ${trainerName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.deleteTrainer(trainerId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Deleted!', 'Trainer has been deleted successfully.', 'success');
      fetchTrainers();
    } catch (error) {
      console.error('Failed to delete trainer:', error);
      Swal.fire('Error', 'Failed to delete trainer. Please try again.', 'error');
    }
  };

  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer =>
      trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.courses?.some(course => {
        const courseName = typeof course === 'string' ? course : course.name;
        return courseName?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [trainers, searchQuery]);

  const formatTimeSlots = (timings) => {
    if (!timings || timings.length === 0) return 'Not set';
    const availableDays = timings.filter(t => t.isAvailable && t.timeSlots.length > 0);
    if (availableDays.length === 0) return 'Not set';
    return availableDays.map(t => `${t.day.substring(0, 3)}: ${t.timeSlots.map(ts => `${ts.startTime}-${ts.endTime}`).join(', ')}`).join(' | ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full py-6 px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainers</h1>
              <p className="text-gray-600">Manage trainers, courses, and schedules</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl"
            >
              <FiPlus size={20} />
              Add Trainer
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No trainers found matching your search.' : 'No trainers found. Click "Add Trainer" to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredTrainers.map((trainer) => (
                    <tr key={trainer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" size={18} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{trainer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMail className="mr-2" size={16} />
                          {trainer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiPhone className="mr-2" size={16} />
                          {trainer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setViewingTrainer(trainer);
                              setIsViewModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(trainer)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(trainer._id, trainer.name)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter trainer name"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alternative Phone
                        </label>
                        <input
                          type="tel"
                          name="alternativePhone"
                          value={formData.alternativePhone}
                          onChange={handleInputChange}
                          placeholder="Enter alternative phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Percentages */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Share Percentages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Lead Share Percentage <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          name="companyLeadSharePercentage"
                          value={formData.companyLeadSharePercentage}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500">Company's share when lead comes from company (0-100)</p>
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Company:</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                              {formData.companyLeadSharePercentage || 0}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Trainer:</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                              {100 - (formData.companyLeadSharePercentage || 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trainer Lead Share Percentage <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          name="trainerLeadSharePercentage"
                          value={formData.trainerLeadSharePercentage}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Trainer's share when lead comes from trainer (0-100)</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Trainer:</span>
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold">
                              {formData.trainerLeadSharePercentage || 0}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Company:</span>
                            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-sm font-semibold">
                              {100 - (formData.trainerLeadSharePercentage || 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Courses
                  </h3>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      placeholder="Course name"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={courseAmount}
                      onChange={(e) => setCourseAmount(e.target.value)}
                      placeholder="Amount (₹)"
                      min="0"
                      step="0.01"
                      className="w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {formData.courses.length > 0 && (
                    <div className="space-y-3">
                      {formData.courses.map((course, index) => {
                        const courseName = typeof course === 'string' ? course : course.name;
                        const courseAmount = typeof course === 'object' ? (course.amount || 0) : 0;
                        
                        // Calculate shares for Company Lead
                        const companyLeadPercent = formData.companyLeadSharePercentage || 0;
                        const companyLeadCompanyShare = (courseAmount * companyLeadPercent) / 100;
                        const companyLeadTrainerShare = courseAmount - companyLeadCompanyShare;
                        
                        // Calculate shares for Trainer Lead
                        const trainerLeadPercent = formData.trainerLeadSharePercentage || 0;
                        const trainerLeadTrainerShare = (courseAmount * trainerLeadPercent) / 100;
                        const trainerLeadCompanyShare = courseAmount - trainerLeadTrainerShare;
                        
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <FiBookOpen size={14} />
                                    {courseName}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCourse(index)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <FiX size={18} />
                                  </button>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Course Amount (₹)
                                    </label>
                                    <input
                                      type="number"
                                      value={courseAmount}
                                      onChange={(e) => handleCourseAmountChange(index, e.target.value)}
                                      min="0"
                                      step="0.01"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Company Lead Share Calculation */}
                                    <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                                      <div className="text-xs font-semibold text-orange-800 mb-2">Company Lead Share</div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Company ({formData.companyLeadSharePercentage || 0}%)
                                          </label>
                                          <div className="px-2 py-1.5 bg-white border border-green-200 rounded text-sm font-medium text-green-800">
                                            ₹{companyLeadCompanyShare.toFixed(2)}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Trainer ({100 - (formData.companyLeadSharePercentage || 0)}%)
                                          </label>
                                          <div className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm font-medium text-blue-800">
                                            ₹{companyLeadTrainerShare.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Trainer Lead Share Calculation */}
                                    <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                                      <div className="text-xs font-semibold text-purple-800 mb-2">Trainer Lead Share</div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Trainer ({formData.trainerLeadSharePercentage || 0}%)
                                          </label>
                                          <div className="px-2 py-1.5 bg-white border border-blue-200 rounded text-sm font-medium text-blue-800">
                                            ₹{trainerLeadTrainerShare.toFixed(2)}
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Company ({100 - (formData.trainerLeadSharePercentage || 0)}%)
                                          </label>
                                          <div className="px-2 py-1.5 bg-white border border-green-200 rounded text-sm font-medium text-green-800">
                                            ₹{trainerLeadCompanyShare.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Available Timings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Available Timings (Monday - Sunday)
                  </label>
                  <div className="space-y-4">
                    {formData.availableTimings.map((timing, dayIndex) => (
                      <div key={timing.day} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={timing.isAvailable}
                              onChange={() => handleDayToggle(dayIndex)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">
                              {timing.day}
                            </label>
                          </div>
                          {timing.isAvailable && (
                            <button
                              type="button"
                              onClick={() => handleAddTimeSlot(dayIndex)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Add Time Slot
                            </button>
                          )}
                        </div>
                        {timing.isAvailable && timing.timeSlots.length > 0 && (
                          <div className="space-y-2 ml-6">
                            {timing.timeSlots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    handleTimeSlotChange(dayIndex, slotIndex, 'startTime', e.target.value)
                                  }
                                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    handleTimeSlotChange(dayIndex, slotIndex, 'endTime', e.target.value)
                                  }
                                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <FiX size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTrainer ? 'Update Trainer' : 'Create Trainer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {isViewModalOpen && viewingTrainer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Trainer Details
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewingTrainer(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                      <p className="text-sm text-gray-900">{viewingTrainer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{viewingTrainer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{viewingTrainer.phone}</p>
                    </div>
                    {viewingTrainer.alternativePhone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Alternative Phone</label>
                        <p className="text-sm text-gray-900">{viewingTrainer.alternativePhone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Percentages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Share Percentages
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Company Lead Share</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Company:</span>
                          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-sm font-semibold">
                            {viewingTrainer.companyLeadSharePercentage !== undefined ? viewingTrainer.companyLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0)}%
                          </span>
                          <span className="text-sm text-gray-700">Trainer:</span>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold">
                            {100 - (viewingTrainer.companyLeadSharePercentage !== undefined ? viewingTrainer.companyLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0))}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Trainer Lead Share</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Trainer:</span>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold">
                            {viewingTrainer.trainerLeadSharePercentage !== undefined ? viewingTrainer.trainerLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0)}%
                          </span>
                          <span className="text-sm text-gray-700">Company:</span>
                          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-sm font-semibold">
                            {100 - (viewingTrainer.trainerLeadSharePercentage !== undefined ? viewingTrainer.trainerLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0))}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                {viewingTrainer.courses && viewingTrainer.courses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Courses
                    </h3>
                    <div className="space-y-3">
                      {viewingTrainer.courses.map((course, index) => {
                        const courseName = typeof course === 'string' ? course : course.name;
                        const courseAmount = typeof course === 'object' ? (course.amount || 0) : 0;
                        const companyLeadPercent = viewingTrainer.companyLeadSharePercentage !== undefined ? viewingTrainer.companyLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0);
                        const trainerLeadPercent = viewingTrainer.trainerLeadSharePercentage !== undefined ? viewingTrainer.trainerLeadSharePercentage : (viewingTrainer.trainerSharePercentage !== undefined ? viewingTrainer.trainerSharePercentage : 0);
                        const companyLeadCompanyShare = (courseAmount * companyLeadPercent) / 100;
                        const companyLeadTrainerShare = courseAmount - companyLeadCompanyShare;
                        const trainerLeadTrainerShare = (courseAmount * trainerLeadPercent) / 100;
                        const trainerLeadCompanyShare = courseAmount - trainerLeadTrainerShare;

                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                <FiBookOpen size={14} />
                                {courseName}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Course Amount
                                </label>
                                <p className="text-sm font-semibold text-gray-900">₹{courseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                                  <div className="text-xs font-semibold text-orange-800 mb-2">Company Lead Share</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">Company ({companyLeadPercent}%):</span>
                                      <span className="text-sm font-semibold text-green-800">₹{companyLeadCompanyShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">Trainer ({100 - companyLeadPercent}%):</span>
                                      <span className="text-sm font-semibold text-blue-800">₹{companyLeadTrainerShare.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                                  <div className="text-xs font-semibold text-purple-800 mb-2">Trainer Lead Share</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">Trainer ({trainerLeadPercent}%):</span>
                                      <span className="text-sm font-semibold text-blue-800">₹{trainerLeadTrainerShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-600">Company ({100 - trainerLeadPercent}%):</span>
                                      <span className="text-sm font-semibold text-green-800">₹{trainerLeadCompanyShare.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Timings */}
                {viewingTrainer.availableTimings && viewingTrainer.availableTimings.some(t => t.isAvailable) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Available Timings
                    </h3>
                    <div className="space-y-2">
                      {viewingTrainer.availableTimings.map((timing, dayIndex) => {
                        if (!timing.isAvailable || !timing.timeSlots || timing.timeSlots.length === 0) return null;
                        return (
                          <div key={dayIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-24 font-medium text-sm text-gray-700">{timing.day}:</div>
                            <div className="flex flex-wrap gap-2">
                              {timing.timeSlots.map((slot, slotIndex) => (
                                <span key={slotIndex} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                  {slot.startTime || slot.start} - {slot.endTime || slot.end}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingTrainer(null);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainers;

