import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSave, 
  FiRefreshCw, FiSearch, FiFilter, FiToggleLeft, FiToggleRight,
  FiBriefcase, FiUsers, FiHome, FiLayers, FiUser, FiMapPin, FiTag
} from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

const FIELD_TYPES = [
  { value: 'role', label: 'Role', icon: <FiUser />, color: 'blue' },
  { value: 'department', label: 'Department', icon: <FiUsers />, color: 'green' },
  { value: 'company', label: 'Company', icon: <FiHome />, color: 'purple' },
  { value: 'division', label: 'Division', icon: <FiLayers />, color: 'orange' },
  { value: 'position', label: 'Position', icon: <FiBriefcase />, color: 'indigo' },
  { value: 'location', label: 'Location', icon: <FiMapPin />, color: 'red' },
  { value: 'custom', label: 'Custom', icon: <FiTag />, color: 'gray' }
];

const CustomFields = () => {
  const [loading, setLoading] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [selectedFieldType, setSelectedFieldType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    fieldType: 'role',
    value: '',
    description: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCustomFields();
  }, []);

  useEffect(() => {
    filterFields();
  }, [customFields, selectedFieldType, searchTerm, showInactive]);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCustomFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomFields(response.data || []);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load custom fields'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFields = () => {
    let filtered = [...customFields];

    // Filter by field type
    if (selectedFieldType !== 'all') {
      filtered = filtered.filter(field => field.fieldType === selectedFieldType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(field => 
        field.value.toLowerCase().includes(term) ||
        (field.description && field.description.toLowerCase().includes(term))
      );
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(field => field.isActive);
    }

    // Sort by field type, then order, then value
    filtered.sort((a, b) => {
      if (a.fieldType !== b.fieldType) {
        return a.fieldType.localeCompare(b.fieldType);
      }
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.value.localeCompare(b.value);
    });

    setFilteredFields(filtered);
  };

  const handleOpenForm = (field = null) => {
    if (field) {
      setEditingField(field);
      setFormData({
        fieldType: field.fieldType,
        value: field.value,
        description: field.description || '',
        order: field.order || 0,
        isActive: field.isActive !== undefined ? field.isActive : true
      });
    } else {
      setEditingField(null);
      setFormData({
        fieldType: selectedFieldType !== 'all' ? selectedFieldType : 'role',
        value: '',
        description: '',
        order: 0,
        isActive: true
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingField(null);
    setFormData({
      fieldType: 'role',
      value: '',
      description: '',
      order: 0,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.value.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Value is required'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (editingField) {
        // Update existing field
        await axios.put(API_ENDPOINTS.updateCustomField(editingField._id), formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Custom field updated successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Create new field
        await axios.post(API_ENDPOINTS.createCustomField, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Custom field created successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      }
      
      handleCloseForm();
      fetchCustomFields();
    } catch (error) {
      console.error('Error saving custom field:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to save custom field'
      });
    }
  };

  const handleDelete = async (field) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Custom Field?',
      text: `Are you sure you want to delete "${field.value}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(API_ENDPOINTS.deleteCustomField(field._id), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Custom field deleted successfully!',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchCustomFields();
      } catch (error) {
        console.error('Error deleting custom field:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete custom field'
        });
      }
    }
  };

  const handleToggleActive = async (field) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(API_ENDPOINTS.toggleCustomFieldStatus(field._id), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchCustomFields();
    } catch (error) {
      console.error('Error toggling active status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status'
      });
    }
  };

  const getFieldTypeInfo = (fieldType) => {
    return FIELD_TYPES.find(ft => ft.value === fieldType) || FIELD_TYPES[FIELD_TYPES.length - 1];
  };

  const getFieldTypeCount = (fieldType) => {
    if (fieldType === 'all') return customFields.length;
    return customFields.filter(f => f.fieldType === fieldType).length;
  };

  const getActiveCount = (fieldType) => {
    const fields = fieldType === 'all' 
      ? customFields 
      : customFields.filter(f => f.fieldType === fieldType);
    return fields.filter(f => f.isActive).length;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Custom Fields</h1>
          <p className="text-gray-600">Manage dropdown values for roles, departments, companies, divisions, and more</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Add New Field
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Field Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={selectedFieldType}
              onChange={(e) => setSelectedFieldType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {FIELD_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({getFieldTypeCount(type.value)})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by value or description..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Show Inactive Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">Show Inactive</span>
            </label>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              onClick={fetchCustomFields}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition w-full justify-center"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Field Type Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FIELD_TYPES.map(type => {
          const count = getFieldTypeCount(type.value);
          const activeCount = getActiveCount(type.value);
          const isSelected = selectedFieldType === type.value;
          
          const getButtonClasses = (color) => {
            const colorMap = {
              blue: isSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              green: isSelected ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              purple: isSelected ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              orange: isSelected ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              indigo: isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              red: isSelected ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              gray: isSelected ? 'bg-gray-50 border-gray-300 text-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            };
            return colorMap[color] || colorMap.gray;
          };
          
          const getBadgeClasses = (color) => {
            const colorMap = {
              blue: isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600',
              green: isSelected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
              purple: isSelected ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600',
              orange: isSelected ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600',
              indigo: isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600',
              red: isSelected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600',
              gray: isSelected ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-600'
            };
            return colorMap[color] || colorMap.gray;
          };
          
          return (
            <button
              key={type.value}
              onClick={() => setSelectedFieldType(type.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${getButtonClasses(type.color)}`}
            >
              {type.icon}
              <span>{type.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${getBadgeClasses(type.color)}`}>
                {activeCount}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fields List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading custom fields...</p>
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">No custom fields found</p>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus /> Create First Field
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.map(field => {
            const typeInfo = getFieldTypeInfo(field.fieldType);
            
            const getIconColor = (color) => {
              const colorMap = {
                blue: 'text-blue-600',
                green: 'text-green-600',
                purple: 'text-purple-600',
                orange: 'text-orange-600',
                indigo: 'text-indigo-600',
                red: 'text-red-600',
                gray: 'text-gray-600'
              };
              return colorMap[color] || colorMap.gray;
            };
            
            const getBadgeColor = (color) => {
              const colorMap = {
                blue: 'bg-blue-100 text-blue-700',
                green: 'bg-green-100 text-green-700',
                purple: 'bg-purple-100 text-purple-700',
                orange: 'bg-orange-100 text-orange-700',
                indigo: 'bg-indigo-100 text-indigo-700',
                red: 'bg-red-100 text-red-700',
                gray: 'bg-gray-100 text-gray-700'
              };
              return colorMap[color] || colorMap.gray;
            };
            
            return (
              <div
                key={field._id}
                className={`bg-white rounded-lg shadow-sm border p-4 ${
                  field.isActive ? 'border-gray-200' : 'border-gray-300 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={getIconColor(typeInfo.color)}>
                      {typeInfo.icon}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getBadgeColor(typeInfo.color)}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(field)}
                    className="text-gray-400 hover:text-gray-600"
                    title={field.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {field.isActive ? <FiToggleRight className="w-5 h-5 text-green-500" /> : <FiToggleLeft className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1">{field.value}</h3>
                {field.description && (
                  <p className="text-sm text-gray-600 mb-3">{field.description}</p>
                )}
                
                {field.order !== undefined && field.order !== 0 && (
                  <p className="text-xs text-gray-500 mb-3">Order: {field.order}</p>
                )}
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleOpenForm(field)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition text-sm"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(field)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition text-sm"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingField ? 'Edit Custom Field' : 'Create Custom Field'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type *
                  </label>
                  <select
                    value={formData.fieldType}
                    onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!editingField}
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value *
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter value (e.g., Manager, HR, Techackode)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in dropdowns</p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">Active (visible in dropdowns)</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FiSave /> {editingField ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFields;

