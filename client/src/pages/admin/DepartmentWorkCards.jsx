import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowLeft, FiPlus, FiSearch, FiCalendar, FiFilter,
  FiEdit3, FiTrash2, FiEye, FiUsers, FiClock, FiTrendingUp,
  FiCheckCircle, FiAlertCircle, FiPlay, FiPause, FiClipboard
} from 'react-icons/fi';
import AdvancedFilters from '../../components/admin-dashboard/common/AdvancedFilters';
import EditWorkCardModal from '../../components/admin-dashboard/common/EditWorkCardModal';
import LoadingSkeleton from '../../components/admin-dashboard/common/LoadingSkeleton';

const STATUSES = ['Not Started', 'In Progress', 'Review', 'Completed', 'On Hold'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const getDepartmentPrefix = (dept) => {
  const prefixMap = {
    'Administration': 'ADMIN',
    'Human Resources (HR)': 'HR',
    'Finance & Accounting': 'FINANCE',
    'Sales': 'SALES',
    'Marketing': 'MARKETING',
    'Customer Support / Service': 'SUPPORT',
    'Operations / Project Management': 'OPS',
    'Legal & Compliance': 'LEGAL',
    'Procurement / Purchasing': 'PROCUREMENT',
    'Research & Development (R&D)': 'RND',
    'Information Technology (IT)': 'IT',
    'Quality Assurance (QA)': 'QA',
    'Business Development': 'BIZDEV',
    'Public Relations (PR)': 'PR',
    'Training & Development': 'TRAINING'
  };
  return prefixMap[dept] || dept.replace(/[^a-zA-Z]/g, '').substring(0, 8).toUpperCase();
};

const getStatusColor = (status) => {
  const colors = {
    'Not Started': 'bg-slate-50 text-slate-700 border border-slate-200',
    'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Review': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'On Hold': 'bg-rose-50 text-rose-700 border border-rose-200'
  };
  return colors[status] || 'bg-slate-50 text-slate-700 border border-slate-200';
};

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'bg-green-50 text-green-700 border border-green-200',
    'Medium': 'bg-blue-50 text-blue-700 border border-blue-200',
    'High': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Critical': 'bg-rose-50 text-rose-700 border border-rose-200'
  };
  return colors[priority] || 'bg-slate-50 text-slate-700 border border-slate-200';
};

const DepartmentWorkCards = () => {
  const { department } = useParams();
  const navigate = useNavigate();
  const [workCards, setWorkCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchWorkCards();
  }, [department, filters]);

  const fetchWorkCards = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Map URL department parameter to full department name
      const getDepartmentName = (dept) => {
        const departmentMap = {
          'administration': 'Administration',
          'human-resources-hr': 'Human Resources (HR)',
          'finance-accounting': 'Finance & Accounting',
          'sales': 'Sales',
          'marketing': 'Marketing',
          'customer-support-service': 'Customer Support / Service',
          'operations-project-management': 'Operations / Project Management',
          'legal-compliance': 'Legal & Compliance',
          'procurement-purchasing': 'Procurement / Purchasing',
          'research-development-rd': 'Research & Development (R&D)',
          'information-technology-it': 'Information Technology (IT)',
          'quality-assurance-qa': 'Quality Assurance (QA)',
          'business-development': 'Business Development',
          'public-relations-pr': 'Public Relations (PR)',
          'training-development': 'Training & Development'
        };
        
        const lowerDept = dept.toLowerCase();
        return departmentMap[lowerDept] || dept.charAt(0).toUpperCase() + dept.slice(1);
      };

      const fullDepartmentName = getDepartmentName(department);
      
      const params = new URLSearchParams({
        department: fullDepartmentName,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v && v !== 'all'))
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/work-cards?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWorkCards(response.data?.workCards || []);
    } catch (error) {
      console.error('Error fetching work cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (searchValue) => {
    setFilters(prev => ({
      ...prev,
      search: searchValue
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handleCardClick = (card) => {
    setSelectedCard(selectedCard?.id === card._id ? null : card);
  };

  const handleUpdateStatus = async (cardId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/work-cards/${cardId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchWorkCards();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this work card?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/work-cards/${cardId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        fetchWorkCards();
        setSelectedCard(null);
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveCard = (updatedCard) => {
    setWorkCards(prev => 
      prev.map(card => 
        card._id === updatedCard._id ? updatedCard : card
      )
    );
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCard(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-40 h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton.Card key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Get full department name for display
  const getDepartmentDisplayName = (dept) => {
    const departmentMap = {
      'administration': 'Administration',
      'human-resources-hr': 'Human Resources (HR)',
      'finance-accounting': 'Finance & Accounting',
      'sales': 'Sales',
      'marketing': 'Marketing',
      'customer-support-service': 'Customer Support / Service',
      'operations-project-management': 'Operations / Project Management',
      'legal-compliance': 'Legal & Compliance',
      'procurement-purchasing': 'Procurement / Purchasing',
      'research-development-rd': 'Research & Development (R&D)',
      'information-technology-it': 'Information Technology (IT)',
      'quality-assurance-qa': 'Quality Assurance (QA)',
      'business-development': 'Business Development',
      'public-relations-pr': 'Public Relations (PR)',
      'training-development': 'Training & Development'
    };
    
    const lowerDept = dept.toLowerCase();
    return departmentMap[lowerDept] || dept.charAt(0).toUpperCase() + dept.slice(1);
  };

  const departmentName = getDepartmentDisplayName(department);

  return (
    <>
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="p-6 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/company-departments')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{departmentName} Department</h1>
              <p className="text-gray-600 mt-1">{workCards.length} work cards</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/company-departments/create', { 
              state: { selectedDepartment: departmentName } 
            })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="text-lg" />
            Create Work Card
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        searchPlaceholder="Search work cards, team leads, or descriptions..."
        filterOptions={{
          status: STATUSES,
          priority: PRIORITIES
        }}
      />

      {/* Work Cards Grid */}
      {workCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <FiClipboard className="text-5xl text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No work cards yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Get started by creating your first work card for the {departmentName} department. 
            Track progress, assign team members, and manage deadlines all in one place.
          </p>
          <button
            onClick={() => navigate('/company-departments/create', { 
              state: { selectedDepartment: departmentName } 
            })}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
          >
            <FiPlus className="text-xl" /> Create Your First Work Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
          {workCards.map((card) => {
            const daysRemaining = getDaysRemaining(card.dueDate);
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const isDueSoon = daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;

            return (
              <div
                key={card._id}
                onClick={() => handleCardClick(card)}
                className={`bg-white border rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg min-w-0 h-full ${
                  selectedCard?._id === card._id 
                    ? 'border-blue-400 shadow-xl ring-2 ring-blue-100 scale-[1.02]' 
                    : 'border-gray-200 hover:border-blue-300 shadow-md'
                } relative overflow-hidden group flex flex-col`}
                style={{ height: selectedCard?._id === card._id ? 'auto' : '480px' }}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-mono font-semibold shadow-sm whitespace-nowrap">
                          {card.serialNumber || `${getDepartmentPrefix(departmentName)} #${String(workCards.indexOf(card) + 1).padStart(2, '0')}`}
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCard(card);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Edit Work Card"
                          >
                            <FiEdit3 className="text-lg" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Delete Work Card"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 word-wrap break-words">
                          {card.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                            {card.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(card.priority)}`}>
                            {card.priority}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FiUsers className="text-blue-500 flex-shrink-0" />
                            <span className="font-medium truncate">{card.teamLead}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-green-500 flex-shrink-0" />
                            <span className="truncate">{formatDate(card.startDate)}</span>
                          </div>
                          {card.dueDate && (
                            <div className="flex items-center gap-2">
                              <FiClock className={`flex-shrink-0 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-500' : 'text-gray-400'}`} />
                              <span className={`truncate ${isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : ''}`}>
                                Due: {formatDate(card.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content - Flexible middle section */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {card.description}
                    </p>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-600">{card.progress || 0}%</span>
                        <div className={`w-3 h-3 rounded-full ${card.progress >= 100 ? 'bg-green-500' : card.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out ${
                          card.progress >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          card.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        }`}
                        style={{ width: `${card.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Started</span>
                      <span>In Progress</span>
                      <span>Completed</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer - Fixed bottom section */}
                <div className="p-6 border-t border-gray-100 flex-shrink-0">
                  {/* Team Members Preview */}
                  {card.teamMembers && card.teamMembers.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUsers className="text-purple-500 flex-shrink-0 text-sm" />
                        <span className="text-xs font-medium text-gray-700">Team ({card.teamMembers.length + 1})</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          👨‍💼 {card.teamLead.length > 10 ? `${card.teamLead.substring(0, 10)}...` : card.teamLead}
                        </div>
                        {card.teamMembers.slice(0, 2).map((member, index) => (
                          <div key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            👤 {member.name.length > 8 ? `${member.name.substring(0, 8)}...` : member.name}
                          </div>
                        ))}
                        {card.teamMembers.length > 2 && (
                          <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            +{card.teamMembers.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Indicators and Warnings */}
                  <div className="space-y-2">
                    {isOverdue && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded text-xs">
                        <FiAlertCircle className="text-red-500 flex-shrink-0" />
                        <span className="font-medium">Overdue by {Math.abs(daysRemaining)} days</span>
                      </div>
                    )}
                    {isDueSoon && !isOverdue && (
                      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-1.5 rounded text-xs">
                        <FiClock className="text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">Due in {daysRemaining} days</span>
                      </div>
                    )}
                    {card.progress === 100 && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-2 py-1.5 rounded text-xs">
                        <FiCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="font-medium">Completed!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>

                {/* Expanded Content */}
                {selectedCard?._id === card._id && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                    {/* Team Members */}
                    {card.teamMembers && card.teamMembers.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Team Members</h4>
                        <div className="space-y-1">
                          {card.teamMembers.map((member, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-700">{member.name}</span>
                              {member.role && <span className="text-gray-500">{member.role}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {card.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Timeline</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Start:</span>
                          <span className="ml-2 text-gray-700">{formatDate(card.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Due:</span>
                          <span className="ml-2 text-gray-700">{formatDate(card.dueDate)}</span>
                        </div>
                        {card.endDate && (
                          <div>
                            <span className="text-gray-500">End:</span>
                            <span className="ml-2 text-gray-700">{formatDate(card.endDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Status Update */}
                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Status Update:</label>
                      <select
                        value={card.status}
                        onChange={(e) => handleUpdateStatus(card._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Work Card Modal */}
      <EditWorkCardModal
        workCard={editingCard}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveCard}
      />
    </div>
    </>
  );
};

export default DepartmentWorkCards;