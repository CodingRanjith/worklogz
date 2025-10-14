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
      const params = new URLSearchParams({
        department: department.charAt(0).toUpperCase() + department.slice(1),
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

  const departmentName = department.charAt(0).toUpperCase() + department.slice(1);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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
        <div className="text-center py-12">
          <FiClipboard className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No work cards found</h3>
          <p className="text-gray-500 mb-6">Create your first work card to get started.</p>
          <button
            onClick={() => navigate('/company-departments/create', { 
              state: { selectedDepartment: departmentName } 
            })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <FiPlus /> Create Work Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workCards.map((card) => {
            const daysRemaining = getDaysRemaining(card.dueDate);
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const isDueSoon = daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;

            return (
              <div
                key={card._id}
                onClick={() => handleCardClick(card)}
                className={`bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer ${
                  selectedCard?._id === card._id ? 'border-blue-500 shadow-md' : 'hover:shadow-sm'
                }`}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-mono font-medium">
                        {card.serialNumber || `#WC${String(workCards.indexOf(card) + 1).padStart(3, '0')}`}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                        {card.title}
                      </h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCard(card);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <FiEdit3 className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card._id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityColor(card.priority)}`}>
                        {card.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {card.description.length > 120 
                      ? `${card.description.substring(0, 120)}...` 
                      : card.description
                    }
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{card.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${card.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUsers className="text-xs" />
                      <span>{card.teamLead}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-xs" />
                      <span>{formatDate(card.startDate)}</span>
                    </div>
                  </div>

                  {/* Due Date Warning */}
                  {isOverdue && (
                    <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                      <FiAlertCircle />
                      <span>Overdue by {Math.abs(daysRemaining)} days</span>
                    </div>
                  )}
                  {isDueSoon && (
                    <div className="mt-3 flex items-center gap-2 text-yellow-600 text-sm">
                      <FiClock />
                      <span>Due in {daysRemaining} days</span>
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {selectedCard?._id === card._id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
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
  );
};

export default DepartmentWorkCards;